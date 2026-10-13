import React from 'react';
import { Bot, Cpu, Zap, Activity } from 'lucide-react';

export const AIOpponentCard = ({
  isAiThinking,
  lastAiThought,
  turn,
  isGameOver,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/95 border border-purple-500/25 p-4 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="relative p-2 rounded-xl bg-purple-500/10 border border-purple-400/30 text-purple-400">
            <Bot className="w-5 h-5" />
            {isAiThinking && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500" />
              </span>
            )}
          </div>
          <div>
            <h3 className="text-base font-semibold text-white tracking-wide">
              Autonomous AI Opponent
            </h3>
            <p className="text-xs text-purple-400/80 font-mono">
              Playing as Black
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-slate-800 border border-slate-700">
          <Activity className={`w-3.5 h-3.5 ${isAiThinking ? 'text-amber-400 animate-spin' : 'text-emerald-400'}`} />
          <span className={isAiThinking ? 'text-amber-300' : 'text-emerald-300'}>
            {isAiThinking ? 'Computing...' : turn === 'black' ? 'Turn Pending' : 'Waiting for White'}
          </span>
        </div>
      </div>

      <div className="mt-3">
        {isAiThinking ? (
          <div className="flex items-center space-x-2 text-xs text-purple-300 bg-purple-950/20 p-2.5 rounded-xl border border-purple-500/20 animate-pulse">
            <Zap className="w-4 h-4 text-purple-400 shrink-0" />
            <span>Analyzing tactical responses and position balances...</span>
          </div>
        ) : lastAiThought ? (
          <div className="text-xs text-slate-300 bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
            <div className="text-[10px] font-mono text-purple-400 font-semibold mb-0.5">
              LATEST COUNTER-THOUGHT:
            </div>
            <p className="italic text-slate-200">"{lastAiThought}"</p>
          </div>
        ) : (
          <div className="text-xs text-slate-400 italic bg-slate-800/20 p-2 rounded-xl text-center">
            AI is ready for your opening move.
          </div>
        )}
      </div>
    </div>
  );
};
