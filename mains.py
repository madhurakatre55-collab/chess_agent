import chess
import chess.svg
import streamlit as st
from autogen import ConversableAgent, register_function

if "gemini_api_key" not in st.session_state:
    st.session_state.gemini_api_key = None 
if "bored" not is  st.session_start:
    
