import os
from pathlib import Path
from dotenv import load_dotenv

# Search for .env in current folder, parent folder, and root folder
env_paths = [
    Path(__file__).resolve().parent.parent / ".env",
    Path(__file__).resolve().parent.parent.parent / ".env",
    Path(".env").resolve(),
]

for p in env_paths:
    if p.exists():
        load_dotenv(dotenv_path=p)
        break
else:
    load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip(' "\'')
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", 8000))
CORS_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "http://localhost:8501",
    "*",
]
