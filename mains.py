from shutil import move

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
        
                                    arrows=[(chess_move.from_square,chess_move.to_square)],
                                    fill={chess_move.from_square:"gray"},
                                    size = 400)
        st.session_state.board_svg = board_svg
        st.session_state.move_history.append(board_svg)
        
        moved_peice = st.session_state.board.piece_at(chess_move.to_square)
        piece_unicode = moved_peice.unicode_symbol()
        piece_type_name = chess.piece_name(moved_peice.piece_type)
        piece_name = piece_type_name.capitalize() if piece_unicode.isupper() else piece_type_name
        
        from_square = chess.SQUARE_NAMES[chess_move.from_square]
        to_square = chess.SQUARE_NAMES[chess_move.to_square]
        move_desc = f"{piece_name}({piece_unicode}) from{from_square} to {to_square}."
        if st.session_state.board.is_checkmate():
            winner = "White" if st.session_state.board.turn == chess.BLACK else "Black"
            move_desc += f"\nCheckmate! {winner} wins the game."
        elif st.session_state.board.is_stalemate():
            move_desc += "\nThe game is a draw."
        elif st.session_state.board.is_insufficient_material():
            move_desc += "\nThe game is a draw due to insufficient material."
        elif st.session_state.board.is_check():
            move_desc += "\nCheck!"
        return move_desc +="\nCheck!"
    except ValueError:
        return f"Invalid move format: {move}. Please provide a valid UCI move."