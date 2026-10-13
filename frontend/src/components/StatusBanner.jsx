import React from 'react';
import { AlertTriangle, Trophy, MinusCircle } from 'lucide-react';

export const StatusBanner = ({
  isCheck,
  isCheckmate,
  isDraw,
  winner,
  turn,
}) => {
  if (isCheckmate) {
    const isHumanWin = winner === 'white';
    return (
      <div className={`p-3.5 rounded-xl border flex items-center justify-between mb-3 shadow-lg animate-bounce ${
        isHumanWin
          ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
          : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
      }`}>
        <div className="flex items-center space-x-2.5">
          <Trophy className="w-5 h-5 text-amber-400" />
          <span className="font-semibold text-sm">
            {isHumanWin ? 'Victory! Checkmate against AI Opponent.' : 'Checkmate. AI Opponent won the match.'}
          </span>
        </div>
      </div>
    );
  }

  if (isDraw) {
    return (
      <div className="p-3 rounded-xl border border-amber-500/40 bg-amber-950/30 text-amber-300 flex items-center space-x-2.5 mb-3">
        <MinusCircle className="w-5 h-5 text-amber-400" />
        <span className="font-medium text-sm">Game drawn by stalemate / repetition.</span>
      </div>
    );
  }

  if (isCheck) {
    return (
      <div className="p-2.5 rounded-xl border border-rose-500/40 bg-rose-950/30 text-rose-300 flex items-center space-x-2 mb-3 animate-pulse">
        <AlertTriangle className="w-4 h-4 text-rose-400" />
        <span className="font-medium text-xs sm:text-sm">
          {turn === 'white' ? 'Check! Your King is in danger.' : 'Check delivered to Black King.'}
        </span>
      </div>
    );
  }

  return null;
};
