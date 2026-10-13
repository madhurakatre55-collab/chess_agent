import json
import chess
from typing import Optional, Dict, Any, List
import google.generativeai as genai
from backend.app.config import GEMINI_API_KEY
from backend.app.schemas.chess_schemas import HintResponse


def get_heuristic_best_move(board: chess.Board) -> chess.Move:
    """Fallback heuristic move selector in case Gemini API is unreachable or rate-limited."""
    legal_moves = list(board.legal_moves)
    if not legal_moves:
        return None

    # Priority 1: Checkmate moves
    for m in legal_moves:
        board.push(m)
        if board.is_checkmate():
            board.pop()
            return m
        board.pop()

    # Priority 2: Captures of highest valued pieces
    piece_vals = {chess.PAWN: 1, chess.KNIGHT: 3, chess.BISHOP: 3, chess.ROOK: 5, chess.QUEEN: 9, chess.KING: 0}
    best_capture = None
    best_capture_val = -1
    for m in legal_moves:
        if board.is_capture(m):
            target = board.piece_at(m.to_square)
            val = piece_vals.get(target.piece_type, 1) if target else 1
            if val > best_capture_val:
                best_capture_val = val
                best_capture = m
    if best_capture:
        return best_capture

    # Priority 3: Moves towards center
    center_squares = {chess.D4, chess.D5, chess.E4, chess.E5, chess.C4, chess.C5, chess.F4, chess.F5}
    for m in legal_moves:
        if m.to_square in center_squares:
            return m

    # Priority 4: Checks
    for m in legal_moves:
        board.push(m)
        if board.is_check():
            board.pop()
            return m
        board.pop()

    return legal_moves[0]


class AICoachService:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or GEMINI_API_KEY
        if self.api_key:
            try:
                genai.configure(api_key=self.api_key)
                self.model = genai.GenerativeModel("gemini-1.5-flash")
            except Exception:
                self.model = None
        else:
            self.model = None

    def get_hint(self, board: chess.Board) -> HintResponse:
        legal_uci = [m.uci() for m in board.legal_moves]
        if not legal_uci:
            return HintResponse(
                recommended_uci="",
                from_square="",
                to_square="",
                move_name="",
                strategic_reason="No legal moves available. Game is over.",
                tactical_concept="Endgame Resolution",
                brain_insight="Recognize game termination states early.",
                evaluation_score=0.0,
            )

        legal_san_map = {m.uci(): board.san(m) for m in board.legal_moves}
        turn_str = "White (Human)" if board.turn == chess.WHITE else "Black"

        if self.api_key and self.model:
            prompt = f"""
You are an elite International Grandmaster and Cognitive Chess Coach.
Your goal is to train the human player's pattern recognition and mental reasoning.

Current position FEN: {board.fen()}
Turn: {turn_str}
Legal moves available: {', '.join([f"{san} ({uci})" for uci, san in legal_san_map.items()])}

Analyze the position and select the single best move for {turn_str}.
Return valid JSON only in this exact schema:
{{
  "recommended_uci": "<exact UCI move from the legal list, e.g. e2e4>",
  "move_name": "<SAN notation, e.g. e4 or Nf3>",
  "strategic_reason": "<1-2 sentences explaining why this move creates an advantage>",
  "tactical_concept": "<e.g. Center Domination, Pin Exploitation, Knight Outpost, Open File Infiltration>",
  "brain_insight": "<1 key mental model lesson for the player to memorize and look for in future games>",
  "evaluation_score": <numeric pawn advantage from White's perspective, e.g. 1.2 or -0.5>
}}
"""
            try:
                response = self.model.generate_content(
                    prompt,
                    generation_config={"response_mime_type": "application/json", "temperature": 0.2}
                )
                data = json.loads(response.text)
                rec_uci = data.get("recommended_uci", "").strip()

                if chess.Move.from_uci(rec_uci) in board.legal_moves:
                    move_obj = chess.Move.from_uci(rec_uci)
                    return HintResponse(
                        recommended_uci=rec_uci,
                        from_square=chess.square_name(move_obj.from_square),
                        to_square=chess.square_name(move_obj.to_square),
                        move_name=data.get("move_name") or legal_san_map.get(rec_uci, rec_uci),
                        strategic_reason=data.get("strategic_reason", "Strategically optimal move."),
                        tactical_concept=data.get("tactical_concept", "Tactical Optimization"),
                        brain_insight=data.get("brain_insight", "Look for piece synergy and weak enemy squares."),
                        evaluation_score=float(data.get("evaluation_score", 0.5)),
                    )
            except Exception as e:
                # Fallback to heuristic
                pass

        # Heuristic Fallback
        fallback_move = get_heuristic_best_move(board)
        from_sq = chess.square_name(fallback_move.from_square)
        to_sq = chess.square_name(fallback_move.to_square)
        san = board.san(fallback_move)

        concept = "Center Control & Development"
        reason = f"Develops your piece toward active central squares ({from_sq} to {to_sq})."
        insight = "Control the center to maximize your piece mobility while restricting the opponent."

        if board.is_capture(fallback_move):
            concept = "Material Capture"
            reason = f"Takes an opponent piece on {to_sq} to gain material and open tactical lines."
            insight = "Always calculate exchanges: count attackers vs defenders before trading."

        return HintResponse(
            recommended_uci=fallback_move.uci(),
            from_square=from_sq,
            to_square=to_sq,
            move_name=san,
            strategic_reason=reason,
            tactical_concept=concept,
            brain_insight=insight,
            evaluation_score=0.4,
        )


ai_coach_singleton = AICoachService()
