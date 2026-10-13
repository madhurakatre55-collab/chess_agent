import React from 'react';
import { Sparkles, Brain, Lightbulb, Compass, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';

export const AICoachCard = ({
  coachHint,
  isLoadingHint,
  onRequestHint,
  onClearHint,
  onApplyHint,
  turn,
  isGameOver,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/95 border border-sky-500/30 p-5 shadow-xl backdrop-blur-md">
      {/* Ambient background glow */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-400/30 text-sky-400">
            <Brain className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white tracking-wide">
              Cognitive AI Coach
            </h3>
            <p className="text-xs text-sky-400/80 font-mono">
              Strategic Assistant & Move Tracer
            </p>
          </div>
        </div>

        {coachHint && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-500/15 text-sky-300 border border-sky-500/30">
            Trace Active
          </span>
        )}
      </div>

      {/* Content Body */}
      <div className="mt-4 space-y-3.5">
        {!coachHint ? (
          <div className="py-4 text-center space-y-3">
            <div className="mx-auto w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400">
              <Lightbulb className="w-5 h-5" />
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xs mx-auto">
              Request grandmaster advice to inspect tactical patterns and visualize the optimal move trace on the board.
            </p>
            <p className="text-[11px] text-slate-500 italic">
              You retain 100% independence to play any move you want.
            </p>
          </div>
        ) : (
          <div className="space-y-3 animate-fadeIn">
            {/* Suggested Move & Tactical Concept Badge */}
            <div className="flex items-center justify-between bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
              <div className="flex items-center space-x-2">
                <Compass className="w-4 h-4 text-sky-400" />
                <span className="text-xs text-slate-400">Recommended Move:</span>
                <span className="text-sm font-bold text-sky-300 font-mono">
                  {coachHint.move_name} ({coachHint.from_square} → {coachHint.to_square})
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                {coachHint.tactical_concept}
              </span>
            </div>

            {/* Strategic Rationale */}
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Strategic Rationale
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {coachHint.strategic_reason}
              </p>
            </div>

            {/* Cognitive Brain Training Lesson */}
            <div className="bg-sky-950/30 p-3 rounded-xl border border-sky-500/20">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-sky-400 mb-1 flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-sky-400" />
                Brain Learning Insight
              </div>
              <p className="text-xs sm:text-sm text-sky-200/90 leading-relaxed">
                {coachHint.brain_insight}
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-800/30 px-2.5 py-1.5 rounded-lg border border-slate-800">
              <AlertCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Blue arrow shows the trace. You can follow it or play any independent move on the board.</span>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="pt-2 flex flex-wrap gap-2">
          <button
            onClick={onRequestHint}
            disabled={isLoadingHint || turn !== 'white' || isGameOver}
            className="flex-1 min-w-[130px] flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-slate-950 shadow-lg shadow-sky-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoadingHint ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Thinking...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{coachHint ? 'Recalculate Hint' : 'Ask AI Coach'}</span>
              </>
            )}
          </button>

          {coachHint && (
            <>
              <button
                onClick={onApplyHint}
                disabled={turn !== 'white' || isGameOver}
                className="flex items-center space-x-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 transition-all duration-200 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Play Hint</span>
              </button>

              <button
                onClick={onClearHint}
                className="flex items-center space-x-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all duration-200"
              >
                <EyeOff className="w-4 h-4" />
                <span>Hide</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
