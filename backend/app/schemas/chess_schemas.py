from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class MoveRequest(BaseModel):
    uci: str = Field(..., description="UCI format move, e.g. 'e2e4' or 'e7e8q'")
    promotion: Optional[str] = Field(None, description="Optional promotion piece 'q', 'r', 'b', 'n'")


class LegalMove(BaseModel):
    uci: str
    san: str
    from_square: str
    to_square: str
    piece: str
    is_capture: bool
    is_check: bool
    promotion: Optional[str] = None


class MoveHistoryItem(BaseModel):
    ply: int
    uci: str
    san: str
    from_square: str
    to_square: str
    player: str  # "white" or "black"
    piece: str
    captured: Optional[str] = None
    fen: str
    timestamp: Optional[str] = None


class HintResponse(BaseModel):
    recommended_uci: str
    from_square: str
    to_square: str
    move_name: str
    strategic_reason: str
    tactical_concept: str
    brain_insight: str
    evaluation_score: Optional[float] = None
    alternative_moves: Optional[List[str]] = None


class AIMoveResponse(BaseModel):
    uci: str
    san: str
    from_square: str
    to_square: str
    thought_process: str
    fen: str
    is_check: bool
    is_checkmate: bool
    is_draw: bool
    turn: str
    captured: Optional[str] = None


class GameState(BaseModel):
    fen: str
    turn: str  # "white" or "black"
    fullmove_number: int
    is_game_over: bool
    is_check: bool
    is_checkmate: bool
    is_stalemate: bool
    is_insufficient_material: bool
    is_threefold_repetition: bool
    is_draw: bool
    winner: Optional[str] = None  # "white", "black", or "draw"
    legal_moves: List[LegalMove]
    move_history: List[MoveHistoryItem]
    captured_by_white: List[str]
    captured_by_black: List[str]
    white_material: int
    black_material: int
    evaluation_score: float
    last_move: Optional[Dict[str, str]] = None


class ResetRequest(BaseModel):
    fen: Optional[str] = None
