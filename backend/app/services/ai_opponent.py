import json
import chess
from typing import Optional, Tuple
import google.generativeai as genai
from backend.app.config import GEMINI_API_KEY
from backend.app.services.ai_coach import get_heuristic_best_move


class AIOpponentService:
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

    def calculate_move(self, board: chess.Board) -> Tuple[str, str]:
        """
        Returns (chosen_uci, thought_process)
        """
        legal_uci = [m.uci() for m in board.legal_moves]
        if not legal_uci:
            return "", "No legal moves."

        legal_san_map = {m.uci(): board.san(m) for m in board.legal_moves}

        if self.api_key and self.model:
            prompt = f"""
You are a formidable chess engine and master AI opponent playing as Black against a human player.
Current position FEN: {board.fen()}
Turn: Black
Legal available moves: {', '.join([f"{san} ({uci})" for uci, san in legal_san_map.items()])}

Choose the single best and most challenging response move for Black.
Return valid JSON only in this exact schema:
{{
  "chosen_uci": "<one exact UCI move from the legal available moves list, e.g. e7e5 or g8f6>",
  "thought_process": "<1 concise sentence explaining Black's strategic idea or tactical threat>"
}}
"""
            try:
                response = self.model.generate_content(
                    prompt,
                    generation_config={"response_mime_type": "application/json", "temperature": 0.25}
                )
                data = json.loads(response.text)
                chosen = data.get("chosen_uci", "").strip()
                if chess.Move.from_uci(chosen) in board.legal_moves:
                    return chosen, data.get("thought_process", "Executing tactical counter-play.")
            except Exception:
                pass

        # Fallback heuristic
        fallback = get_heuristic_best_move(board)
        san = board.san(fallback)
        if board.is_capture(fallback):
            return fallback.uci(), f"Capturing piece with {san} to challenge white's position."
        return fallback.uci(), f"Playing {san} to fight for central squares and active piece play."


ai_opponent_singleton = AIOpponentService()
