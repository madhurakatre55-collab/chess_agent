import base64
import chess
import chess.svg
import streamlit as st
from autogen import ConversableAgent, register_function

# ==============================================================================
# 1. PAGE CONFIG & SESSION STATE
# ==============================================================================
st.set_page_config(page_title="AI Chess Agents", page_icon="♟️", layout="wide")

if "board" not in st.session_state:
    st.session_state.board = chess.Board()
if "gemini_api_key" not in st.session_state:
    st.session_state.gemini_api_key = ""
if "made_move" not in st.session_state:
    st.session_state.made_move = False
if "move_history" not in st.session_state:
    st.session_state.move_history = []
if "max_turns" not in st.session_state:
    st.session_state.max_turns = 6


# ==============================================================================
# 2. HELPER & CHESS ENGINE FUNCTIONS (AGENT TOOLS)
# ==============================================================================
def render_svg(svg_string: str, size: int = 380):
    """Renders chess SVG cleanly inside Streamlit."""
    b64 = base64.b64encode(svg_string.encode("utf-8")).decode("utf-8")
    html_code = f'<div style="display:flex; justify-content:center;"><img src="data:image/svg+xml;base64,{b64}" width="{size}" height="{size}"/></div>'
    st.markdown(html_code, unsafe_allow_html=True)


def available_moves() -> str:
    """Returns a comma-separated list of legal UCI moves (e.g. 'e2e4, g1f3')."""
    moves = [m.uci() for m in st.session_state.board.legal_moves]
    if not moves:
        return "No legal moves available. The game is over."
    return f"Legal moves: {', '.join(moves)}"


def execute_move(move: str) -> str:
    """Validates and executes a UCI move on the board, updating move history."""
    try:
        chess_move = chess.Move.from_uci(move.strip())
        if chess_move not in st.session_state.board.legal_moves:
            return f"Invalid move '{move}'. Call available_moves() to check legal moves."

        # Get piece symbol before executing move
        piece = st.session_state.board.piece_at(chess_move.from_square)
        piece_symbol = piece.unicode_symbol() if piece else ""
        from_sq = chess.SQUARE_NAMES[chess_move.from_square]
        to_sq = chess.SQUARE_NAMES[chess_move.to_square]

        # Push move to board
        st.session_state.board.push(chess_move)
        st.session_state.made_move = True

        # Generate board SVG with highlighted move arrow
        board_svg = chess.svg.board(
            st.session_state.board,
            arrows=[(chess_move.from_square, chess_move.to_square)],
            fill={chess_move.from_square: "#86efac", chess_move.to_square: "#bbf7d0"},
            size=380,
        )
        move_label = f"{piece_symbol} {from_sq} ➔ {to_sq}"
        st.session_state.move_history.append((move_label, board_svg))

        desc = f"Executed move: {from_sq} to {to_sq}."
        if st.session_state.board.is_checkmate():
            winner = "White" if st.session_state.board.turn == chess.BLACK else "Black"
            desc += f"\nCheckmate! {winner} wins."
        elif st.session_state.board.is_stalemate():
            desc += "\nDraw by stalemate."
        elif st.session_state.board.is_check():
            desc += "\nCheck!"
        return desc

    except ValueError:
        return f"Invalid format '{move}'. Please provide valid UCI format like 'e2e4'."


def check_made_move(msg):
    """Termination condition: ends turn when a valid move has occurred."""
    if st.session_state.made_move:
        st.session_state.made_move = False
        return True
    return False


# ==============================================================================
# 3. SIDEBAR CONFIGURATION
# ==============================================================================
st.sidebar.title("⚙️ Game Configuration")
api_key = st.sidebar.text_input("Gemini API Key", type="password", value=st.session_state.gemini_api_key)
if api_key:
    st.session_state.gemini_api_key = api_key
    st.sidebar.success("API Key saved!")

st.sidebar.info("💡 Recommended: 4–10 turns per run to save API usage.")
st.session_state.max_turns = st.sidebar.number_input(
    "Max Turns per Run", min_value=1, max_value=50, value=st.session_state.max_turns, step=1
)


# ==============================================================================
# 4. MAIN INTERFACE & AGENT EXECUTION
# ==============================================================================
st.title("♟️ Autonomous AI Chess Match")
st.caption("AutoGen Multi-Agent System powered by Google Gemini")

col_board, col_controls = st.columns([1, 1])

with col_board:
    st.subheader("Current Chess Board")
    current_board_svg = chess.svg.board(st.session_state.board, size=380)
    render_svg(current_board_svg)

with col_controls:
    st.subheader("Controls")

    if not st.session_state.gemini_api_key:
        st.warning("👈 Please enter your Gemini API Key in the sidebar to start.")
    else:
        btn1, btn2 = st.columns(2)
        with btn1:
            start_game = st.button("▶️ Start / Next Move", use_container_width=True)
        with btn2:
            reset_game = st.button("🔄 Reset Game", use_container_width=True)

        if reset_game:
            st.session_state.board.reset()
            st.session_state.made_move = False
            st.session_state.move_history = []
            st.rerun()

        if start_game:
            try:
                # LLM Configuration for Gemini
                llm_config = {
                    "config_list": [
                        {
                            "model": "gemini-1.5-flash",
                            "api_key": st.session_state.gemini_api_key,
                            "api_type": "google",
                        }
                    ],
                    "cache_seed": None,
                }

                # Setup Players & Game Master
                agent_white = ConversableAgent(
                    name="Agent_White",
                    system_message=(
                        "You play as WHITE in chess. First call available_moves(). "
                        "Then choose the best move and call execute_move(move) in UCI format (e.g., 'e2e4')."
                    ),
                    llm_config=llm_config,
                )

                agent_black = ConversableAgent(
                    name="Agent_Black",
                    system_message=(
                        "You play as BLACK in chess. First call available_moves(). "
                        "Then choose the best move and call execute_move(move) in UCI format (e.g., 'e7e5')."
                    ),
                    llm_config=llm_config,
                )

                game_master = ConversableAgent(
                    name="Game_Master",
                    llm_config=False,
                    is_termination_msg=check_made_move,
                    default_auto_reply="Please make your move.",
                    human_input_mode="NEVER",
                )

                # Register Tools
                for agent in (agent_white, agent_black):
                    register_function(
                        available_moves,
                        caller=agent,
                        executor=game_master,
                        name="available_moves",
                        description="Get the list of legal available moves.",
                    )
                    register_function(
                        execute_move,
                        caller=agent,
                        executor=game_master,
                        name="execute_move",
                        description="Execute a chess move using UCI format.",
                    )

                # Register Nested Chat Loops
                agent_white.register_nested_chats(
                    trigger=agent_black,
                    chat_queue=[{"sender": game_master, "recipient": agent_white, "summary_method": "last_msg"}],
                )
                agent_black.register_nested_chats(
                    trigger=agent_white,
                    chat_queue=[{"sender": game_master, "recipient": agent_black, "summary_method": "last_msg"}],
                )

                # Initiate Match
                with st.spinner("AI agents are strategizing and playing..."):
                    agent_black.initiate_chat(
                        recipient=agent_white,
                        message="Let's play chess! You go first as White. Make your move.",
                        max_turns=st.session_state.max_turns,
                        summary_method="last_msg",
                    )

                st.success("Round finished!")
                st.rerun()

            except Exception as e:
                st.error(f"Execution error: {e}")


# ==============================================================================
# 5. MOVE HISTORY VISUALIZATION
# ==============================================================================
if st.session_state.move_history:
    st.divider()
    st.subheader("📜 Move History")
    history_cols = st.columns(3)
    for idx, (label, svg) in enumerate(st.session_state.move_history):
        col = history_cols[idx % 3]
        with col:
            turn_player = "White" if idx % 2 == 0 else "Black"
            st.markdown(f"**Move {idx + 1} ({turn_player}):** `{label}`")
            render_svg(svg, size=240)