from fastapi import APIRouter, HTTPException
from backend.app.schemas.chess_schemas import (
    MoveRequest,
    GameState,
    HintResponse,
    AIMoveResponse,
    ResetRequest,
)
from backend.app.services.chess_engine import chess_engine_singleton
from backend.app.services.ai_coach import ai_coach_singleton
from backend.app.services.ai_opponent import ai_opponent_singleton

router = APIRouter(prefix="/api/game", tags=["chess-game"])


@router.get("/state", response_model=GameState)
def get_game_state():
    return chess_engine_singleton.get_state()


@router.post("/move", response_model=GameState)
def make_human_move(req: MoveRequest):
    """
    Allows the human player to execute their own independent move!
    Validates legality and updates the board.
    """
    if chess_engine_singleton.board.is_game_over():
        raise HTTPException(status_code=400, detail="Game is already over.")

    success, error_msg, history_item = chess_engine_singleton.execute_move(req.uci)
    if not success:
        raise HTTPException(status_code=400, detail=error_msg or "Illegal move.")

    return chess_engine_singleton.get_state()


@router.post("/ai-move", response_model=AIMoveResponse)
def make_ai_move():
    """
    Triggers the AI Opponent to calculate and execute its response move.
    """
    if chess_engine_singleton.board.is_game_over():
        raise HTTPException(status_code=400, detail="Game is already over.")

    if chess_engine_singleton.board.turn != False:  # Black's turn is False in python-chess
        raise HTTPException(status_code=400, detail="It is not AI's turn.")

    chosen_uci, thought = ai_opponent_singleton.calculate_move(chess_engine_singleton.board)
    if not chosen_uci:
        raise HTTPException(status_code=400, detail="AI has no legal moves.")

    success, error, hist = chess_engine_singleton.execute_move(chosen_uci)
    if not success:
        raise HTTPException(status_code=500, detail=f"AI move execution error: {error}")

    state = chess_engine_singleton.get_state()
    return AIMoveResponse(
        uci=hist.uci,
        san=hist.san,
        from_square=hist.from_square,
        to_square=hist.to_square,
        thought_process=thought,
        fen=state.fen,
        is_check=state.is_check,
        is_checkmate=state.is_checkmate,
        is_draw=state.is_draw,
        turn=state.turn,
        captured=hist.captured,
    )


@router.post("/hint", response_model=HintResponse)
def get_hint():
    """
    Requests the AI Coach to suggest a move with tactical justification and advance move trace.
    Does NOT execute the move, giving the user full autonomy to play independently or apply hint.
    """
    if chess_engine_singleton.board.is_game_over():
        raise HTTPException(status_code=400, detail="Game is already over.")

    hint = ai_coach_singleton.get_hint(chess_engine_singleton.board)
    return hint


@router.post("/reset", response_model=GameState)
def reset_game(req: ResetRequest = None):
    """
    Resets the game to starting position or custom FEN.
    """
    fen = req.fen if req else None
    chess_engine_singleton.reset(fen)
    return chess_engine_singleton.get_state()


@router.post("/undo", response_model=GameState)
def undo_move():
    """
    Undoes the moves. If it's White's turn, undoes the last 2 moves (AI + human) to restore human's previous turn.
    """
    if len(chess_engine_singleton.board.move_stack) >= 2:
        chess_engine_singleton.undo_last_move()  # Undo AI
        chess_engine_singleton.undo_last_move()  # Undo Human
    elif len(chess_engine_singleton.board.move_stack) == 1:
        chess_engine_singleton.undo_last_move()

    return chess_engine_singleton.get_state()
