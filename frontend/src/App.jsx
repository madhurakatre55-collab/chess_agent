import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Navbar } from './components/Navbar';
import { ChessBoard3D } from './components/ChessBoard3D';
import { EvalBar } from './components/EvalBar';
import { AICoachCard } from './components/AICoachCard';
import { AIOpponentCard } from './components/AIOpponentCard';
import { CapturedPieces } from './components/CapturedPieces';
import { MoveHistory } from './components/MoveHistory';
import { StatusBanner } from './components/StatusBanner';
import { chessApi } from './services/api';
import { soundEffects } from './utils/soundEffects';

export default function App() {
  const [gameState, setGameState] = useState(null);
  const [coachHint, setCoachHint] = useState(null);
  const [isLoadingHint, setIsLoadingHint] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [lastAiThought, setLastAiThought] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [is3D, setIs3D] = useState(true);
  const [theme, setTheme] = useState('cyber');
  const [isMuted, setIsMuted] = useState(false);

  // Fetch initial game state
  const loadState = useCallback(async () => {
    try {
      const state = await chessApi.getState();
      setGameState(state);
      setErrorMsg('');
    } catch (err) {
      setErrorMsg('Failed to connect to Chess Backend. Please ensure backend is running on port 8000.');
    }
  }, []);

  useEffect(() => {
    loadState();
  }, [loadState]);

  // Handle human move (independent or suggestion-guided)
  const handleMove = async (uci) => {
    if (!gameState || gameState.is_game_over || gameState.turn !== 'white' || isAiThinking) {
      return;
    }

    try {
      setErrorMsg('');
      setCoachHint(null); // Clear hint once player executes their move

      const newState = await chessApi.makeMove(uci);
      setGameState(newState);

      // Play audio cues
      if (newState.is_checkmate && newState.winner === 'white') {
        soundEffects.playVictory();
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      } else if (newState.is_check) {
        soundEffects.playCheck();
      } else if (newState.last_move && newState.move_history.slice(-1)[0]?.captured) {
        soundEffects.playCapture();
      } else {
        soundEffects.playMove();
      }

      // If game is not over, trigger AI Opponent turn (Black)
      if (!newState.is_game_over && newState.turn === 'black') {
        triggerAiTurn();
      }
    } catch (err) {
      setErrorMsg(err.message || 'Illegal move');
    }
  };

  // Trigger AI opponent response
  const triggerAiTurn = async () => {
    setIsAiThinking(true);
    try {
      const aiResp = await chessApi.makeAIMove();
      setLastAiThought(aiResp.thought_process);

      // Refresh complete state
      const refreshedState = await chessApi.getState();
      setGameState(refreshedState);

      if (refreshedState.is_checkmate && refreshedState.winner === 'white') {
        soundEffects.playVictory();
        confetti({ particleCount: 120, spread: 80 });
      } else if (refreshedState.is_check) {
        soundEffects.playCheck();
      } else if (aiResp.captured) {
        soundEffects.playCapture();
      } else {
        soundEffects.playMove();
      }
    } catch (err) {
      setErrorMsg(`AI Opponent error: ${err.message}`);
    } finally {
      setIsAiThinking(false);
    }
  };

  // Request strategic advice from AI Coach
  const handleRequestHint = async () => {
    if (!gameState || gameState.is_game_over || gameState.turn !== 'white') return;

    setIsLoadingHint(true);
    setErrorMsg('');
    try {
      const hint = await chessApi.getHint();
      setCoachHint(hint);
      soundEffects.playHint();
    } catch (err) {
      setErrorMsg(`Could not fetch hint: ${err.message}`);
    } finally {
      setIsLoadingHint(false);
    }
  };

  const handleClearHint = () => {
    setCoachHint(null);
  };

  const handleApplyHint = () => {
    if (coachHint?.recommended_uci) {
      handleMove(coachHint.recommended_uci);
    }
  };

  const handleReset = async () => {
    try {
      const freshState = await chessApi.resetGame();
      setGameState(freshState);
      setCoachHint(null);
      setLastAiThought('');
      setErrorMsg('');
    } catch (err) {
      setErrorMsg('Failed to reset game');
    }
  };

  const handleUndo = async () => {
    try {
      const undoneState = await chessApi.undoMove();
      setGameState(undoneState);
      setCoachHint(null);
      setErrorMsg('');
    } catch (err) {
      setErrorMsg('Cannot undo move');
    }
  };

  const handleToggleMute = () => {
    const muted = soundEffects.toggleMute();
    setIsMuted(muted);
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'cyber' ? 'wood' : 'cyber'));
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-black">
      {/* Navbar */}
      <Navbar
        is3D={is3D}
        onToggle3D={() => setIs3D(!is3D)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onReset={handleReset}
        onUndo={handleUndo}
        canUndo={Boolean(gameState?.move_history?.length)}
        isThinking={isAiThinking}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* Error notification banner */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs sm:text-sm flex items-center justify-between">
            <span>{errorMsg}</span>
            <button
              onClick={() => setErrorMsg('')}
              className="text-xs text-rose-400 font-bold ml-3 px-2 py-0.5 rounded hover:bg-rose-900/50"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Status banner (Check, Checkmate, Draw) */}
        {gameState && (
          <StatusBanner
            isCheck={gameState.is_check}
            isCheckmate={gameState.is_checkmate}
            isDraw={gameState.is_draw}
            winner={gameState.winner}
            turn={gameState.turn}
          />
        )}

        {/* Layout Grid: Left Chessboard + Eval Bar; Right AI Panels & Move Log */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Board + Captured Pieces (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            {/* Top Captured Bar */}
            <div className="w-full max-w-[540px] mb-2">
              <CapturedPieces
                capturedByWhite={gameState?.captured_by_white || []}
                capturedByBlack={gameState?.captured_by_black || []}
                whiteMaterial={gameState?.white_material || 0}
                blackMaterial={gameState?.black_material || 0}
              />
            </div>

            {/* Board + Eval Bar row */}
            <div className="flex items-center justify-center space-x-3 sm:space-x-4 w-full">
              {/* Position Evaluation Bar */}
              <EvalBar evaluation={gameState?.evaluation_score || 0} />

              {/* 3D Interactive Board */}
              <ChessBoard3D
                fen={gameState?.fen}
                turn={gameState?.turn}
                legalMoves={gameState?.legal_moves || []}
                lastMove={gameState?.last_move}
                isCheck={gameState?.is_check}
                coachHint={coachHint}
                is3D={is3D}
                theme={theme}
                onMove={handleMove}
              />
            </div>

            {/* Turn & Player Indicators below Board */}
            <div className="w-full max-w-[540px] mt-3 flex items-center justify-between px-3 py-2 bg-slate-900/40 rounded-xl border border-slate-800 text-xs font-mono">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-200 shadow-[0_0_8px_#fff]" />
                <span className="text-slate-300 font-semibold">You: White Pieces</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-slate-400">
                  {gameState?.turn === 'white' ? 'Your Turn (Make any move)' : 'AI Turn...'}
                </span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    gameState?.turn === 'white' ? 'bg-emerald-400 animate-ping' : 'bg-purple-400 animate-pulse'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Right Column: AI Coach, Opponent Status & History (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* AI Coach Card */}
            <AICoachCard
              coachHint={coachHint}
              isLoadingHint={isLoadingHint}
              onRequestHint={handleRequestHint}
              onClearHint={handleClearHint}
              onApplyHint={handleApplyHint}
              turn={gameState?.turn}
              isGameOver={gameState?.is_game_over}
            />

            {/* AI Opponent Hub */}
            <AIOpponentCard
              isAiThinking={isAiThinking}
              lastAiThought={lastAiThought}
              turn={gameState?.turn}
              isGameOver={gameState?.is_game_over}
            />

            {/* Move Notation History */}
            <MoveHistory moveHistory={gameState?.move_history || []} />
          </div>
        </div>
      </main>
    </div>
  );
}
