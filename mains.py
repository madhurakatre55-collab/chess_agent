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
def check_made_move(msg):
    if st.session_state.made_move:
        st.session_state.made_move = False
        return True
    else:
        return False
        
if st.session_state.gemini_api_key :
    try:
        agent_white_config_list = [
            {
                "model":"gemini-1.5",
                "api_key": st.session_state.gemini_api_key,
            },
        ]
        
        agent_black_config_list = [
            {
                "model":"gemini-1.5",
                "api_key": st.session_state.gemini_api_key,
            }
        ]
        
        agent_black= ConversableAgent(
            name="Agent_Black",
            system_message = "You are a professional chess player and you play as black. "
            "First call available_moves() first, to get list of legal available moves. "
            "Then call execute_move(move) to make a move.",
            llm_config={"config_list": agent_black_config_list,"cache_seed":None},
            
        )
        
        agent_white = ConversableAgent(
            name="Agent_White",
            system_message = "You are a professional chess player and you play as white. "
            "First call available_moves() first, to get list of legal available moves. "
            "Then call execute_move(move) to make a move.",
            llm_config={"config_list": agent_white_config_list,"cache_seed":None},
        )
        
        game_master = ConversableAgent(
            name = "Game_Master",
            llm_config = False,
            is_tremination_msg = check_made_move,
            default_auto_reply = "Please make a move.",
            human_input_mode = "NEVER",
        )
        
        register_function(
            excute_move,
            caller =agent_white,
            executor = game_master,
            name = "execute_move",
            description = "Call this tool to make a move.",
        )
        
        register_function(
            available_moves,
            caller =agent_white,
            executor = game_master,
            name = "available_moves",
            description = "Call this tool to get a list of legal available moves.",
        )
        
        register_function(
            excute_move,
            caller =agent_black,
            executor = game_master,
            name = "execute_move",
            description = "Call this tool to make a move.",
        )
        
        register_function(
            available_moves,
            caller =agent_black,
            executor = game_master,
            name = "available_moves",
            description = "Call this tool to get a list of legal available moves.",
        )
        
        agent_white.register_nested_chats(
            trigerr=agents_black,
            chat_quene=[
                {
                    "sender": game_master,
                    "recipient": agent_white,
                    "summary_method": "last_msg",
                }
            ],
        )
        
        agent_black.register_nested_chats(
            trigger=agent_white,
            chat_queue=[
                {
                    "sender": game_master,
                    "recipient": agent_black,
                    "summary_method": "last_msg",
                }
            ],
        )
        
        st.info("""
        This chess game is played between two AG2 AI agents:
- **Agent White**: A GPT-4o-mini powered chess player controlling white pieces
- **Agent Black**: A GPT-4o-mini powered chess player controlling black pieces

The game is managed by a **Game Master** that:
- Validates all moves
- Updates the chess board
- Manages turn-taking between players
- Provides legal move information

        """)
        
        initial_board_svg = chess.svg.board(chess.Board(), size=300)
        st.subheader("Initial Chess Board")
        st.image(initial_board_svg)
        
        if st.button("Start Game"):
        st.session_state.board.reset()
        st.session_state.made_move = False
        st.session_state.move_history = []
        st.session_state.board_svg = chess.svg.board(st.session_state.board, size=300)
        st.info("The AI agents will now play against each other. Each agent will analyze the board, " 
                "request legal moves from the Game Master (proxy agent), and make strategic decisions.")
        st.success("You can view the interaction between the agents in the terminal output, after the turns between agents end, you get view all the chess board moves displayed below!")
        st.write("Game started! White's turn")
        chat_result = agent_black.initiate_chat(
            recipient=agent_white,
            message="Let's play chess! You go first, it's your move."
            max_turns=st.session_state.max_turns,
            summary_method="reflection_with_llm"
        )
        st.markdown(chat_result.summary)
        
        st.subheader("Move History")
        
        for i, move_svg in enumerate(st.session_state.move_history):
            if i % 2 == 0:
                move_by = "Agent White"
            else:
                move_by = "Agent Black"
            st.write(f"**Move {i+1} by {move_by}:")
            st.image(move_svg)
        if st.button("Reset Game"):
            st.session_state.board.reset()
            st.session_state.made_move = False
            st.session_state.move_history = []
            st.session_state.board_svg = chess.svg.board(st.session_state.board, size=300)
            st.info("Game has been reset. You can start a new game.")
    except Exception as e:
        st.error(f"An error occurred: {e},Please check your API key and try again.")
else:
    st.warning("Please enter your Gemini API key in the sidebar to start the game.")
    #code completeed
    