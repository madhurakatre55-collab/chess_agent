import React from 'react';
import { Box, Layers, Volume2, VolumeX, RotateCcw, Undo2, Palette } from 'lucide-react';

export const Navbar = ({
  is3D,
  onToggle3D,
  theme,
  onToggleTheme,
  isMuted,
  onToggleMute,
  onReset,
  onUndo,
  canUndo,
  isThinking,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 p-0.5 shadow-glow-cyan flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-bold text-sky-400 text-lg">
              ♟
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white font-mono">
                NEURAL CHESS
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-500/15 text-sky-400 border border-sky-500/30 uppercase tracking-widest font-mono">
                COGNITIVE v2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Human vs AI Agent with Cognitive Brain Coach & Free Independent Moves
            </p>
          </div>
        </div>

        {/* Action Toolbars */}
        <div className="flex items-center space-x-2 sm:space-x-2.5">
          {/* 3D / 2D View Switch */}
          <button
            onClick={onToggle3D}
            title={is3D ? 'Switch to 2D Top-down View' : 'Switch to 3D Isometric View'}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition-all duration-200"
          >
            {is3D ? (
              <>
                <Box className="w-3.5 h-3.5 text-sky-400" />
                <span>3D Tilt</span>
              </>
            ) : (
              <>
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                <span>2D Flat</span>
              </>
            )}
          </button>

          {/* Theme Switch */}
          <button
            onClick={onToggleTheme}
            title="Toggle Board Visual Theme"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition-all duration-200"
          >
            <Palette className="w-3.5 h-3.5 text-amber-400" />
            <span className="capitalize">{theme}</span>
          </button>

          {/* Sound Mute */}
          <button
            onClick={onToggleMute}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            className="p-2 rounded-xl text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition-all duration-200"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Undo */}
          <button
            onClick={onUndo}
            disabled={!canUndo || isThinking}
            title="Undo last turn"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Undo</span>
          </button>

          {/* New Game */}
          <button
            onClick={onReset}
            disabled={isThinking}
            title="Start new game"
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-slate-200 border border-slate-700 shadow transition-all duration-200 disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
