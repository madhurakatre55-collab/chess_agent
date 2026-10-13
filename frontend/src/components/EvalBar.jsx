import React from 'react';

export const EvalBar = ({ evaluation = 0 }) => {
  // Clamp evaluation between -10 and +10 for visual bar percentage
  // 0 evaluation = 50% height
  const clamped = Math.max(-10, Math.min(10, evaluation));
  const whitePercent = 50 + (clamped / 20) * 100;
  const clampedPercent = Math.max(5, Math.min(95, whitePercent));

  const displayScore = evaluation > 0 ? `+${evaluation.toFixed(1)}` : evaluation.toFixed(1);

  return (
    <div className="flex flex-col items-center select-none py-2">
      <div className="relative w-6 sm:w-7 h-[340px] sm:h-[480px] md:h-[540px] rounded-full bg-slate-900 border-2 border-slate-700/80 overflow-hidden shadow-inner flex flex-col justify-between">
        {/* Black side fill (top) */}
        <div
          className="w-full bg-gradient-to-b from-slate-950 to-slate-800 transition-all duration-500 ease-out flex items-start justify-center pt-1"
          style={{ height: `${100 - clampedPercent}%` }}
        >
          {evaluation < 0 && (
            <span className="text-[10px] font-mono font-bold text-slate-300">
              {displayScore}
            </span>
          )}
        </div>

        {/* White side fill (bottom) */}
        <div
          className="w-full bg-gradient-to-t from-slate-100 to-slate-300 transition-all duration-500 ease-out flex items-end justify-center pb-1"
          style={{ height: `${clampedPercent}%` }}
        >
          {evaluation >= 0 && (
            <span className="text-[10px] font-mono font-bold text-slate-900">
              {displayScore}
            </span>
          )}
        </div>
      </div>
      <span className="text-[10px] font-mono font-semibold text-slate-400 mt-1 uppercase tracking-wider">
        EVAL
      </span>
    </div>
  );
};
