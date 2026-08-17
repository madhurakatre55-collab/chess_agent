import chess
import chess.svg
import streamlit as st
from autogen import ConversableAgent, register_function

if "gemini_api_key" not in st.session_state:
    st.session_state.gemini_api_key = None 
if "bored" not in st.session_state:
    st.session_state.bored = False
if "made_move" not in st.session_state:
    st.session_state.made_move = False
if "board_svg" not in st.session_state:
    st.session_state.board_svg = None
if "move_history" not in st.session_state:
    st.session_state.move_history = []
if "max_truns" not in st.session_state:
    st.session_state.max_turns = 5
    
st.sidebar.title("Chess Agent Configuration")
gemini_api_key = st.sidebar.text_input("Gemini API Key", type="password")
if gemini_api_key:
    st.session_state.gemini_api_key = gemini_api_key
    st.sidebar.success("Gemini API Key set successfully!")
    
st.sidebar.info("For a complete chess game with potential checkmate, it would take max_turns > 200 approximately.
However, this will consume significant API credits and a lot of time.
For demo purposes, using 5-10 turns is recommended.
"")
max_truns_input = st.sidebar.number_input("f'Max turns of total chess moves set to {st.session_state.max_turns}!")
st.title("Chess with autogenerate Agents")
def avaliable_moves() -> str:
    try:
        chess_move = chess.Move.from_uci(move)
        if chess_move not in st.session_state.board.legal_moves:
            return f"Invalid move:{move}, Please call avalibale_moves() to see valid moves."
            
        st.session_state.board.push(chess_move)
        st.session_state.made_move = true
        
        board_svg = chess.svg.board(st.session_state.board,
        
                                     size=400,
                                     lastmove=chess_move,
                                     orientation=chess.WHITE)