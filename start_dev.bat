@echo off
echo ========================================================
echo   Launching Neural Chess (Backend + 3D Frontend)
echo ========================================================

echo [1/2] Starting FastAPI Backend on http://localhost:8000 ...
start "Chess Backend" cmd /k ".\.venv\Scripts\python.exe -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload"

echo [2/2] Starting Vite Frontend on http://localhost:5173 ...
start "Chess Frontend" cmd /k "cd frontend && npm run dev"

echo Done! Open your browser at: http://localhost:5173
pause
