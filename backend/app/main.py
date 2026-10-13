from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.config import CORS_ORIGINS
from backend.app.api.routes import router

app = FastAPI(
    title="Autonomous Chess Assistant & AI Coach API",
    description="Backend API for human vs AI chess gameplay, real-time tactical suggestions, and cognitive move tracing.",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/")
def health_check():
    return {
        "status": "online",
        "service": "Chess Assistant API",
        "version": "2.0.0",
        "endpoints": ["/api/game/state", "/api/game/move", "/api/game/ai-move", "/api/game/hint", "/api/game/reset", "/api/game/undo"],
        "docs": "/docs",
    }
