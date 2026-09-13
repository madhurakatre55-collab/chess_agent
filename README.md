# Autonomous AI Chess Agents

An autonomous multi-agent chess application powered by **Microsoft AutoGen**, **Google Gemini**, and **python-chess**, built with an interactive **Streamlit** interface.

---

## Overview

This project simulates a full chess game between two autonomous AI agents:
- **Agent White**: Plays the white pieces, requesting legal moves and strategizing.
- **Agent Black**: Plays the black pieces, analyzing board states and responding with tactical moves.
- **Game Master**: Acts as a referee, validating all moves, maintaining the chess engine board state, and preventing illegal plays.

The UI displays the live board and a move-by-move visual history with dynamic SVG highlighting.

---

## Architecture

```
                 +-------------------+
                 |    Streamlit UI   |
                 +---------+---------+
                           |
            +--------------+--------------+
            |                             |
     [Agent White]                  [Agent Black]
(Google Gemini 1.5)             (Google Gemini 1.5)
            \                             /
             \                           /
          +---v-------------------------v---+
          |          Game Master            |
          |       (Execution Proxy)         |
          +----------------+----------------+
                           |
                    [python-chess]
              (Move Validation & Board)
```

---

## Getting Started

### 1. Prerequisites
- Python 3.10+
- A Google Gemini API Key ([Get an API key here](https://aistudio.google.com/))

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/chess_agent.git
cd chess_agent

# Create and activate virtual environment
python -m venv .venv
# On Windows:
.\.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

# Install required packages
pip install -r requirement.txt
```

### 3. Dependencies

The project relies on:
- `streamlit` - Web application interface
- `autogen` - Multi-agent conversation and orchestration framework
- `chess` - Game logic, UCI move validation, and SVG rendering

---

## Running the Application

Launch the Streamlit app:

```bash
streamlit run mains.py
```

### How to Play:
1. Open the app in your browser (usually `http://localhost:8501`).
2. Enter your **Gemini API Key** in the sidebar.
3. Configure the **Max Turns per Run** (recommended: 4-10 turns for quick testing).
4. Click **Start / Next Move** to watch the AI agents deliberate and execute moves.
5. View the real-time board updates and the **Move History** log below.

---

## Project Structure

```
chess_agent/
├── mains.py           # Streamlit app, AutoGen agents, and chess engine tools
├── requirement.txt    # Project dependencies
├── README.md          # Project documentation
└── .env               # Optional environment variables
```

---

## License

MIT License. Feel free to use, modify, and build upon this project!