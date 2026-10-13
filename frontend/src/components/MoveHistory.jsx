import React, { useEffect, useRef } from 'react';
import { History, Swords } from 'lucide-react';

export const MoveHistory = ({ moveHistory = [] }) => {
  const scrollRef = useRef(null);

  // Group plies into full move turns: { moveNum: 1, white: 'e4', black: 'e5' }
  const fullMoves = [];
  for (let i = 0; i < moveHistory.length; i += 2) {
    fullMoves.push({
      num: Math.floor(i / 2) + 1,
      white: moveHistory[i],
      black: moveHistory[i + 1] || null,
    });
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [moveHistory.length]);

  return (
    <div className="rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/95 border border-slate-800 p-4 shadow-xl backdrop-blur-md flex flex-col h-[280px]">
      <div className="flex items-center space-x-2 pb-2.5 border-b border-slate-800 text-slate-300">
        <History className="w-4 h-4 text-sky-400" />
        <h3 className="text-xs font-semibold uppercase tracking-wider font-mono">
          Game Notation History ({moveHistory.length} Plies)
        </h3>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto mt-2 space-y-1.5 pr-1.5 scrollbar-thin scrollbar-thumb-slate-700"
      >
        {fullMoves.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs py-8">
            <Swords className="w-6 h-6 mb-2 opacity-40" />
            <span>No moves played yet.</span>
          </div>
        ) : (
          fullMoves.map((turn) => (
            <div
              key={turn.num}
              className="flex items-center text-xs py-1 px-2 rounded-lg hover:bg-slate-800/50 transition-colors font-mono"
            >
              <span className="w-8 text-slate-500 font-semibold">{turn.num}.</span>
              <span className="w-20 text-sky-300 font-medium font-mono">
                {turn.white?.san || ''}
              </span>
              <span className="w-20 text-purple-300 font-medium font-mono">
                {turn.black?.san || ''}
              </span>
              <span className="ml-auto text-[10px] text-slate-500">
                {turn.black?.timestamp || turn.white?.timestamp || ''}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
