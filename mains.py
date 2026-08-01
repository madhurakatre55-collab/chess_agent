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
    
