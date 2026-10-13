Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Launching Neural Chess (FastAPI Backend + 3D Frontend)" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

# Start FastAPI backend
Write-Host "Starting FastAPI Backend on http://localhost:8000 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", ".\.venv\Scripts\python.exe -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload"

# Start Vite React frontend
Write-Host "Starting Vite Frontend on http://localhost:5173 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location frontend; npm run dev"

Write-Host "`nReady! Access your app in the browser at: http://localhost:5173" -ForegroundColor Yellow
