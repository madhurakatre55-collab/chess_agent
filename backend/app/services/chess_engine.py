import chess
from typing import List, Dict, Optional, Tuple
from datetime import datetime
from backend.app.schemas.chess_schemas import GameState, LegalMove, MoveHistoryItem

PIECE_VALUES = {
    chess.PAWN: 1,
    chess.KNIGHT: 3,
    chess.BISHOP: 3,
    chess.ROOK: 5,
    chess.QUEEN: 9,
    chess.KING: 0,
}

STARTING_PIECES = {
    chess.WHITE: {chess.PAWN: 8, chess.KNIGHT: 2, chess.BISHOP: 2, chess.ROOK: 2, chess.QUEEN: 1},
    chess.BLACK: {chess.PAWN: 8, chess.KNIGHT: 2, chess.BISHOP: 2, chess.ROOK: 2, chess.QUEEN: 1},
}


class ChessEngineService:
    def __init__(self, fen: Optional[str] = None):
        self.board = chess.Board(fen) if fen else chess.Board()
        self.move_history: List[MoveHistoryItem] = []

    def reset(self, fen: Optional[str] = None):
        self.board = chess.Board(fen) if fen else chess.Board()
        self.move_history = []

    def get_legal_moves(self) -> List[LegalMove]:
        legal = []
        for move in self.board.legal_moves:
            from_sq = chess.square_name(move.from_square)
            to_sq = chess.square_name(move.to_square)
            piece = self.board.piece_at(move.from_square)
            piece_sym = piece.symbol() if piece else ""
            is_cap = self.board.is_capture(move)

            # Check if this move gives check
            self.board.push(move)
            gives_check = self.board.is_check()
            self.board.pop()

            promo = chess.piece_symbol(move.promotion) if move.promotion else None

            legal.append(
                LegalMove(
                    uci=move.uci(),
                    san=self.board.san(move),
                    from_square=from_sq,
                    to_square=to_sq,
                    piece=piece_sym,
                    is_capture=is_cap,
                    is_check=gives_check,
                    promotion=promo,
                )
            )
        return legal

    def calculate_material(self) -> Tuple[int, int, List[str], List[str]]:
        white_material = 0
        black_material = 0

        current_white = {chess.PAWN: 0, chess.KNIGHT: 0, chess.BISHOP: 0, chess.ROOK: 0, chess.QUEEN: 0}
        current_black = {chess.PAWN: 0, chess.KNIGHT: 0, chess.BISHOP: 0, chess.ROOK: 0, chess.QUEEN: 0}

        for square in chess.SQUARES:
            piece = self.board.piece_at(square)
            if piece:
                val = PIECE_VALUES.get(piece.piece_type, 0)
                if piece.color == chess.WHITE:
                    white_material += val
                    if piece.piece_type in current_white:
                        current_white[piece.piece_type] += 1
                else:
                    black_material += val
                    if piece.piece_type in current_black:
                        current_black[piece.piece_type] += 1

        captured_by_white = []
        for p_type, count in STARTING_PIECES[chess.BLACK].items():
            missing = count - current_black[p_type]
            if missing > 0:
                sym = chess.Piece(p_type, chess.BLACK).symbol()
                captured_by_white.extend([sym] * missing)

        captured_by_black = []
        for p_type, count in STARTING_PIECES[chess.WHITE].items():
            missing = count - current_white[p_type]
            if missing > 0:
                sym = chess.Piece(p_type, chess.WHITE).symbol()
                captured_by_black.extend([sym] * missing)

        return white_material, black_material, captured_by_white, captured_by_black

    def evaluate_position(self) -> float:
        """
        Fast heuristic evaluation score in pawn units from White's perspective.
        Positive = White advantage, Negative = Black advantage.
        """
        if self.board.is_checkmate():
            return -100.0 if self.board.turn == chess.WHITE else 100.0
        if self.board.is_game_over():
            return 0.0

        score = 0.0
        # Material and positional weights
        for square in chess.SQUARES:
            piece = self.board.piece_at(square)
            if not piece:
                continue

            val = float(PIECE_VALUES.get(piece.piece_type, 0))

            # Center square control bonus
            file_idx = chess.square_file(square)
            rank_idx = chess.square_rank(square)
            if 2 <= file_idx <= 5 and 2 <= rank_idx <= 5:
                val += 0.2
            if (file_idx in (3, 4)) and (rank_idx in (3, 4)):
                val += 0.25

            if piece.color == chess.WHITE:
                score += val
            else:
                score -= val

        # Mobility bonus
        current_turn = self.board.turn
        white_mobility = len(list(self.board.legal_moves)) if current_turn == chess.WHITE else 0
        score += white_mobility * 0.05

        return round(score, 2)

    def execute_move(self, uci_str: str) -> Tuple[bool, Optional[str], Optional[MoveHistoryItem]]:
        try:
            move = chess.Move.from_uci(uci_str.strip())
            if move not in self.board.legal_moves:
                # Try auto-promoting to Queen if promotion piece was omitted for pawn move to 8th/1st rank
                if len(uci_str) == 4:
                    promo_move = chess.Move.from_uci(uci_str.strip() + "q")
                    if promo_move in self.board.legal_moves:
                        move = promo_move
                    else:
                        return False, f"Illegal move: {uci_str}", None
                else:
                    return False, f"Illegal move: {uci_str}", None

            piece = self.board.piece_at(move.from_square)
            piece_sym = piece.symbol() if piece else ""
            captured_piece = self.board.piece_at(move.to_square)
            captured_sym = captured_piece.symbol() if captured_piece else None
            san = self.board.san(move)
            player = "white" if self.board.turn == chess.WHITE else "black"

            from_sq = chess.square_name(move.from_square)
            to_sq = chess.square_name(move.to_square)

            self.board.push(move)

            history_item = MoveHistoryItem(
                ply=len(self.move_history) + 1,
                uci=move.uci(),
                san=san,
                from_square=from_sq,
                to_square=to_sq,
                player=player,
                piece=piece_sym,
                captured=captured_sym,
                fen=self.board.fen(),
                timestamp=datetime.now().strftime("%H:%M:%S"),
            )
            self.move_history.append(history_item)
            return True, None, history_item

        except Exception as e:
            return False, str(e), None

    def undo_last_move(self) -> bool:
        if len(self.board.move_stack) > 0:
            self.board.pop()
            if self.move_history:
                self.move_history.pop()
            return True
        return False

    def get_state(self) -> GameState:
        white_mat, black_mat, cap_white, cap_black = self.calculate_material()
        eval_score = self.evaluate_position()

        winner = None
        if self.board.is_checkmate():
            winner = "black" if self.board.turn == chess.WHITE else "white"
        elif self.board.is_game_over():
            winner = "draw"

        last_move_dict = None
        if self.move_history:
            last = self.move_history[-1]
            last_move_dict = {"from": last.from_square, "to": last.to_square, "uci": last.uci, "san": last.san}

        return GameState(
            fen=self.board.fen(),
            turn="white" if self.board.turn == chess.WHITE else "black",
            fullmove_number=self.board.fullmove_number,
            is_game_over=self.board.is_game_over(),
            is_check=self.board.is_check(),
            is_checkmate=self.board.is_checkmate(),
            is_stalemate=self.board.is_stalemate(),
            is_insufficient_material=self.board.is_insufficient_material(),
            is_threefold_repetition=self.board.is_repetition(3),
            is_draw=(
                self.board.is_stalemate()
                or self.board.is_insufficient_material()
                or self.board.is_fifty_moves()
                or self.board.is_repetition(3)
            ),
            winner=winner,
            legal_moves=self.get_legal_moves(),
            move_history=self.move_history,
            captured_by_white=cap_white,
            captured_by_black=cap_black,
            white_material=white_mat,
            black_material=black_mat,
            evaluation_score=eval_score,
            last_move=last_move_dict,
        )


# Global engine instance for simple interactive gameplay
chess_engine_singleton = ChessEngineService()
