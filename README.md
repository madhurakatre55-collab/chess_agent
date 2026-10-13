# AI-Based Autonomous Chess Assistant

[![Live Web App](https://img.shields.io/badge/Live%20Demo-chess--agent--1.onrender.com-38bdf8?style=for-the-badge&logo=render)](https://chess-agent-1.onrender.com/)
[![Backend API](https://img.shields.io/badge/Live%20API-FastAPI%20Docs-emerald?style=for-the-badge&logo=fastapi)](https://chess-agent-pnt7.onrender.com/docs)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-purple?style=for-the-badge&logo=github)](https://github.com/madhurakatre55-collab/chess_agent)

> 🌐 **Live Production Deployment**:
> - 🎮 **Play the Game Live**: **[https://chess-agent-1.onrender.com/](https://chess-agent-1.onrender.com/)**
> - ⚡ **FastAPI Backend Swagger Docs**: **[https://chess-agent-pnt7.onrender.com/docs](https://chess-agent-pnt7.onrender.com/docs)**
> - 📡 **Live API Base URL**: `https://chess-agent-pnt7.onrender.com/api/game`

---

## 🌟 Key Features

1. **Decoupled Client-Server Architecture**:
   - **Backend**: Asynchronous FastAPI service managing chess engine state (`python-chess`), legal move calculations, heuristic evaluation, captured piece differential, and Google Gemini AI integrations.
   - **Frontend**: High-performance Vite + React + Tailwind CSS client with 3D board perspective, customizable themes, Web Audio synthesized sounds, and move notation history.

2. **Independent Player Autonomy**:
   - The user has complete freedom to click or drag & drop ANY piece on the board to make ANY legal move.
   - The AI Coach's move suggestions and glowing traces are non-coercive advisory hints—the user can follow them or ignore them and execute their own strategy.

3. **Cognitive AI Coach & Move Tracing**:
   - **Tactical Concept**: Identifies motifs such as Center Control, Pin Exploitation, Knight Outposts, and Open Files.
   - **Strategic Rationale**: Concise explanation of positional advantages.
   - **Brain Learning Insight**: Mental models and pattern recognition lessons to train the human chess mind.
   - **Visual Trace Overlay**: Directional glowing trace arrow highlighting the suggested path directly on the board.

4. **3D Visualized Board & Modern UX**:
   - Dynamic 3D perspective tilt toggle (`3D Tilt` vs `2D Flat`).
   - Multiple aesthetic themes: `Cyber Obsidian` and `Classic Walnut`.
   - Real-time Position Evaluation bar ($+1.5$ vs $-0.8$) and captured piece trays.
   - Subtle synthesized move, capture, check, and victory sound effects using the Web Audio API.

---

## 🏗️ System Architecture

```
+-------------------------------------------------------------------------+
|                           FRONTEND (React + Vite)                       |
|   +-------------------+    +--------------------+    +--------------+   |
|   | 3D Chessboard     |    | Cognitive Coach    |    | Opponent Hub |   |
|   | (Click/Drag/Move) |    | (Trace & Insights) |    | (AI Thoughts)|   |
|   +-------------------+    +--------------------+    +--------------+   |
|                            | (REST API via fetch)                       |
+----------------------------|--------------------------------------------+
                             v
+-------------------------------------------------------------------------+
|                           BACKEND (FastAPI)                             |
|       +---------------------------------------------------------+       |
|       |                     FastAPI Router                      |       |
|       |  /state  |  /move  |  /ai-move  |  /hint  |  /reset     |       |
|       +---------------------------------------------------------+       |
|                     |                     |              |              |
|                     v                     v              v              |
|           [python-chess Engine]     [AI Coach]     [AI Opponent]        |
|           (Rules, Moves, Eval)       (Gemini)        (Gemini)           |
+-------------------------------------------------------------------------+
```

---

## 📁 Repository Structure

```
chess_agent/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes.py             # REST endpoints (state, move, ai-move, hint, reset, undo)
│   │   ├── schemas/
│   │   │   └── chess_schemas.py      # Pydantic data schemas
│   │   ├── services/
│   │   │   ├── chess_engine.py       # Game state, validation, evaluation & history
│   │   │   ├── ai_coach.py           # Gemini Cognitive Coach with heuristic fallback
│   │   │   └── ai_opponent.py        # Gemini Opponent counter-move generator
│   │   ├── config.py                 # Configuration & CORS settings
│   │   └── main.py                   # FastAPI application entrypoint
│   ├── requirements.txt              # Python dependencies
│   ├── run.py                        # Standalone backend server runner
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChessBoard3D.jsx      # Interactive 3D board with tilt & trace arrows
│   │   │   ├── PieceRenderer.jsx     # Vector SVG chess pieces with metallic gradients
│   │   │   ├── AICoachCard.jsx       # Tactical concept & brain insight advisory
│   │   │   ├── AIOpponentCard.jsx    # Opponent thought-stream card
│   │   │   ├── EvalBar.jsx           # Position evaluation score bar
│   │   │   ├── CapturedPieces.jsx    # Captured piece material trays
│   │   │   ├── MoveHistory.jsx       # Algebraic notation timeline
│   │   │   ├── StatusBanner.jsx      # Check and game-over banners
│   │   │   └── Navbar.jsx            # Perspective, theme, sound, and reset controls
│   │   ├── services/
│   │   │   └── api.js                # Client API service
│   │   ├── utils/
│   │   │   └── soundEffects.js       # Web Audio API sound synthesizers
│   │   ├── App.jsx                   # Central layout and game orchestrator
│   │   ├── main.jsx                  # React DOM mount point
│   │   └── index.css                 # 3D perspective & Tailwind styles
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
├── start_dev.bat                     # Quick Windows Command Prompt launcher
├── start_dev.ps1                     # Quick PowerShell launcher
├── .env                              # API Key configuration
└── README.md                         # Documentation
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Python 3.10+**
- **Node.js 18+** and **npm**
- A **Google Gemini API Key** (configured in `.env`)

### 2. Quick Launch (One-Click)

On Windows, run either:
```powershell
.\start_dev.ps1
```
or double-click:
```cmd
start_dev.bat
```

---

### 3. Manual Launch

#### Step 1: Start the Backend (FastAPI)
```powershell
# In the root project folder:
.\.venv\Scripts\python.exe -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```
* Backend API runs on: `http://localhost:8000`
* Interactive API Documentation (Swagger): `http://localhost:8000/docs`

#### Step 2: Start the Frontend (Vite + React)
```powershell
# In a new terminal window:
cd frontend
npm run dev
```
* Frontend Web App runs on: `http://localhost:5173`

---

## 🎮 How to Play

1. Open **`http://localhost:5173`** in your browser.
2. **Move Independent of Suggestions**:
   - Click any white piece to view all legal destination squares highlighted with glowing cyan indicators.
   - Click the destination square (or drag & drop the piece) to make your independent move.
3. **Request AI Coach Advice**:
   - Click **"Ask AI Coach"** to receive tactical reasoning, concept categorization (e.g. Pin, Fork, Center Control), and brain training insights.
   - A glowing blue trace arrow appears on the board indicating the suggested trajectory.
   - You can click **"Play Hint"** to accept it, or freely make any other legal move on the board!
4. **AI Counter-Move**:
   - The AI Opponent calculates its counter-move as Black and displays its strategic thought in the AI hub.
5. **Customizations**:
   - Toggle **3D Tilt / 2D Flat** in the top navigation bar.
   - Switch between **Cyber Obsidian** and **Classic Walnut** themes.
   - Use **Undo** to step backward or **Reset** to start a new match.

---

## 🌐 Production Deployment
 
### Live Render Setup
- **Frontend URL**: [https://chess-agent-1.onrender.com/](https://chess-agent-1.onrender.com/)
- **Backend API URL**: [https://chess-agent-pnt7.onrender.com/](https://chess-agent-pnt7.onrender.com/)
- **Interactive Swagger Docs**: [https://chess-agent-pnt7.onrender.com/docs](https://chess-agent-pnt7.onrender.com/docs)

### Backend Deployment (Render Web Service)
- **Environment**: Python 3
- **Root Directory**: *(empty)*
- **Build Command**: `pip install -r backend/requirements.txt`
- **Start Command**: `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`
- **Environment Variables**:
  - `GEMINI_API_KEY`: Your Google Gemini API Key

### Frontend Deployment (Render Static Site)
- **Environment**: Static Site
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Routing**: Client automatically connects to `https://chess-agent-pnt7.onrender.com/api/game` in production