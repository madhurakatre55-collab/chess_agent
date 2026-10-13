import base64
import os
import json
import chess
import chess.svg
import streamlit as st
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

st.set_page_config(page_title="Human vs AI Chess Coach", layout="wide")

default_api_key = os.getenv("GEMINI_API_KEY", "").strip(' "\'')

if "board" not in st.session_state:
    st.session_state.board = chess.Board()
if "gemini_api_key" not in st.session_state:
    st.session_state.gemini_api_key = default_api_key
if "move_history" not in st.session_state:
    st.session_state.move_history = []
if "current_hint" not in st.session_state:
    st.session_state.current_hint = None
if "last_ai_thought" not in st.session_state:
    st.session_state.last_ai_thought = ""


def get_genai_model(api_key: str):
    genai.configure(api_key=api_key)
    return genai.GenerativeModel("gemini-1.5-flash")


def render_svg(svg_string: str, size: int = 400):
    b64 = base64.b64encode(svg_string.encode("utf-8")).decode("utf-8")
    html_code = f'<div style="display:flex; justify-content:center;"><img src="data:image/svg+xml;base64,{b64}" width="{size}" height="{size}"/></div>'
    st.markdown(html_code, unsafe_allow_html=True)


def generate_board_svg(board: chess.Board, last_move=None, trace_move=None):
    arrows = []
    fill_map = {}

    if last_move:
        arrows.append((last_move.from_square, last_move.to_square))
        fill_map[last_move.from_square] = "#86efac"
        fill_map[last_move.to_square] = "#bbf7d0"

    if trace_move:
        arrows.append((trace_move.from_square, trace_move.to_square))
        fill_map[trace_move.from_square] = "#93c5fd"
        fill_map[trace_move.to_square] = "#bfdbfe"

    return chess.svg.board(
        board,
        arrows=arrows,
        fill=fill_map,
        size=400,
    )


def get_ai_hint(board: chess.Board, api_key: str):
    legal_uci = [m.uci() for m in board.legal_moves]
    legal_san = [board.san(m) for m in board.legal_moves]
    legal_mapping = [f"{san} ({uci})" for san, uci in zip(legal_san, legal_uci)]

    prompt = f"""
You are a grandmaster chess coach helping a human player train their strategic thinking and cognitive pattern recognition.
Current position FEN: {board.fen()}
Turn: White (Human)
Legal moves: {', '.join(legal_mapping)}

Analyze the position and select the best single move for White.
Return valid JSON only in the following exact format:
{{
  "recommended_uci": "<one move from the legal moves, e.g. e2e4>",
  "move_name": "<name in standard algebraic notation, e.g. e4 or Nf3>",
  "strategic_reason": "<1-2 sentences explaining why this move is strategically sound>",
  "tactical_concept": "<e.g. Center Control, Piece Activity, King Safety, Fork, Pin, Open File>",
  "brain_insight": "<1 key cognitive lesson for the player to remember in similar positions>"
}}
"""
    try:
        model = get_genai_model(api_key)
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        data = json.loads(response.text)
        recommended_uci = data.get("recommended_uci", "").strip()
        if chess.Move.from_uci(recommended_uci) in board.legal_moves:
            return data
        first_legal = legal_uci[0]
        return {
            "recommended_uci": first_legal,
            "move_name": board.san(chess.Move.from_uci(first_legal)),
            "strategic_reason": "Develop pieces and control central squares.",
            "tactical_concept": "Development & Center Control",
            "brain_insight": "Look to occupy or influence the central d4, d5, e4, e5 squares early."
        }
    except Exception as e:
        first_legal = legal_uci[0] if legal_uci else ""
        return {
            "recommended_uci": first_legal,
            "move_name": board.san(chess.Move.from_uci(first_legal)) if first_legal else "",
            "strategic_reason": f"Standard solid move: {e}",
            "tactical_concept": "Position Optimization",
            "brain_insight": "Evaluate piece mobility and protect vulnerable squares."
        }


def get_ai_opponent_move(board: chess.Board, api_key: str):
    legal_uci = [m.uci() for m in board.legal_moves]
    legal_san = [board.san(m) for m in board.legal_moves]
    legal_mapping = [f"{san} ({uci})" for san, uci in zip(legal_san, legal_uci)]

    prompt = f"""
You are a strong chess engine playing as Black against a human.
Current position FEN: {board.fen()}
Turn: Black
Legal available moves: {', '.join(legal_mapping)}

Choose the best response move for Black.
Return valid JSON only in the following exact format:
{{
  "chosen_uci": "<one move from the legal available moves list, e.g. e7e5>",
  "thought_process": "<1 short sentence explaining Black's strategic idea>"
}}
"""
    try:
        model = get_genai_model(api_key)
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        data = json.loads(response.text)
        chosen_uci = data.get("chosen_uci", "").strip()
        if chess.Move.from_uci(chosen_uci) in board.legal_moves:
            return chosen_uci, data.get("thought_process", "")
        return legal_uci[0], "Played solid responsive move."
    except Exception:
        return legal_uci[0], "Played best available legal move."


def execute_turn(chess_move: chess.Move, player_label: str):
    piece = st.session_state.board.piece_at(chess_move.from_square)
    piece_symbol = piece.unicode_symbol() if piece else ""
    from_sq = chess.SQUARE_NAMES[chess_move.from_square]
    to_sq = chess.SQUARE_NAMES[chess_move.to_square]
    san = st.session_state.board.san(chess_move)

    st.session_state.board.push(chess_move)
    board_svg = generate_board_svg(st.session_state.board, last_move=chess_move)
    move_label = f"{player_label}: {piece_symbol} {san} ({from_sq} -> {to_sq})"
    st.session_state.move_history.append((move_label, board_svg))


st.sidebar.title("Configuration & Learning Mode")
api_key_input = st.sidebar.text_input("Gemini API Key", type="password", value=st.session_state.gemini_api_key)
if api_key_input:
    st.session_state.gemini_api_key = api_key_input
    st.sidebar.success("API Key configured")

st.sidebar.info("Play as White against the Gemini AI. Use the Brain Training Coach to receive strategic hints and advance move traces.")

st.title("Human vs AI Chess: Cognitive Learning Coach")
st.caption("One side Human (White) vs one side AI Agent (Black) with real-time strategic hints & advance move traces.")

board = st.session_state.board
is_game_over = board.is_game_over()

col_board, col_actions = st.columns([1.1, 0.9])

with col_board:
    st.subheader("Interactive Board")
    trace_move = None
    if st.session_state.current_hint:
        try:
            trace_move = chess.Move.from_uci(st.session_state.current_hint["recommended_uci"])
        except Exception:
            trace_move = None

    last_move = board.peek() if len(board.move_stack) > 0 else None
    current_svg = generate_board_svg(board, last_move=last_move, trace_move=trace_move)
    render_svg(current_svg)

    if trace_move:
        st.caption("Blue Arrow: AI Coach Recommended Move Trace")

with col_actions:
    st.subheader("Game Actions & Brain Insights")

    if is_game_over:
        if board.is_checkmate():
            winner = "Human (White)" if board.turn == chess.BLACK else "AI Agent (Black)"
            st.success(f"Checkmate! {winner} won the match.")
        elif board.is_stalemate():
            st.warning("Game drawn by stalemate.")
        elif board.is_insufficient_material():
            st.info("Game drawn due to insufficient material.")
        else:
            st.info("Game concluded.")

    if not st.session_state.gemini_api_key:
        st.warning("Please configure your Gemini API Key in the sidebar or .env file.")
    else:
        if not is_game_over and board.turn == chess.WHITE:
            st.markdown("### Your Turn (White)")

            col_hint, col_clear = st.columns([1, 1])
            with col_hint:
                if st.button("Get AI Coach Hint & Trace", use_container_width=True):
                    with st.spinner("Analyzing position & calculating best tactical pattern..."):
                        hint = get_ai_hint(board, st.session_state.gemini_api_key)
                        st.session_state.current_hint = hint
                        st.rerun()

            with col_clear:
                if st.session_state.current_hint:
                    if st.button("Hide Hint Trace", use_container_width=True):
                        st.session_state.current_hint = None
                        st.rerun()

            if st.session_state.current_hint:
                hint = st.session_state.current_hint
                st.success(f"Recommended Move: **{hint.get('move_name', '')}** (`{hint.get('recommended_uci', '')}`)")
                st.info(f"**Concept:** {hint.get('tactical_concept', '')}\n\n**Strategy:** {hint.get('strategic_reason', '')}\n\n**Brain Insight:** {hint.get('brain_insight', '')}")

            legal_moves_list = list(board.legal_moves)
            options = {f"{board.san(m)} ({m.uci()})": m for m in legal_moves_list}

            default_index = 0
            if st.session_state.current_hint:
                target_uci = st.session_state.current_hint.get("recommended_uci", "")
                for idx, (label, m) in enumerate(options.items()):
                    if m.uci() == target_uci:
                        default_index = idx
                        break

            selected_label = st.selectbox("Select Your Move", list(options.keys()), index=default_index)
            
            if st.button("Play Move", use_container_width=True):
                chosen_move = options[selected_label]
                st.session_state.current_hint = None
                execute_turn(chosen_move, "Human (White)")

                if not st.session_state.board.is_game_over():
                    with st.spinner("AI Agent (Black) is calculating response..."):
                        ai_uci, thought = get_ai_opponent_move(st.session_state.board, st.session_state.gemini_api_key)
                        st.session_state.last_ai_thought = thought
                        ai_move = chess.Move.from_uci(ai_uci)
                        execute_turn(ai_move, "AI Agent (Black)")

                st.rerun()

        elif not is_game_over and board.turn == chess.BLACK:
            st.markdown("### AI Turn (Black)")
            with st.spinner("AI Agent is making its move..."):
                ai_uci, thought = get_ai_opponent_move(st.session_state.board, st.session_state.gemini_api_key)
                st.session_state.last_ai_thought = thought
                ai_move = chess.Move.from_uci(ai_uci)
                execute_turn(ai_move, "AI Agent (Black)")
                st.rerun()

        if st.session_state.last_ai_thought:
            st.caption(f"Last AI Opponent Strategy: {st.session_state.last_ai_thought}")

        if st.button("Reset / New Game", use_container_width=True):
            st.session_state.board.reset()
            st.session_state.move_history = []
            st.session_state.current_hint = None
            st.session_state.last_ai_thought = ""
            st.rerun()

if st.session_state.move_history:
    st.divider()
    st.subheader("Move History & Timeline")
    history_cols = st.columns(3)
    for idx, (label, svg) in enumerate(st.session_state.move_history):
        col = history_cols[idx % 3]
        with col:
            st.markdown(f"**Move {idx + 1}:** `{label}`")
            render_svg(svg, size=240)

