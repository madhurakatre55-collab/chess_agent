import React from 'react';
import { PieceRenderer } from './PieceRenderer';

export const CapturedPieces = ({
  capturedByWhite = [],
  capturedByBlack = [],
  whiteMaterial = 0,
  blackMaterial = 0,
}) => {
  const diff = whiteMaterial - blackMaterial;

  return (
    <div className="w-full flex items-center justify-between px-2 py-1.5 bg-slate-900/60 rounded-xl border border-slate-800 text-xs">
      {/* Captured by White (Black pieces captured) */}
      <div className="flex items-center space-x-1 overflow-x-auto max-w-[48%] py-0.5">
        <span className="text-[10px] text-slate-500 font-mono font-medium mr-1 shrink-0">W:</span>
        {capturedByWhite.map((p, idx) => (
          <div key={idx} className="w-4 h-4 shrink-0 drop-shadow">
            <PieceRenderer piece={p} is3D={false} />
          </div>
        ))}
        {diff > 0 && (
          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1 rounded">
            +{diff}
          </span>
        )}
      </div>

      <div className="h-4 w-[1px] bg-slate-700" />

      {/* Captured by Black (White pieces captured) */}
      <div className="flex items-center space-x-1 overflow-x-auto max-w-[48%] py-0.5 justify-end">
        {diff < 0 && (
          <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-500/10 px-1 rounded mr-1">
            +{Math.abs(diff)}
          </span>
        )}
        {capturedByBlack.map((p, idx) => (
          <div key={idx} className="w-4 h-4 shrink-0 drop-shadow">
            <PieceRenderer piece={p} is3D={false} />
          </div>
        ))}
        <span className="text-[10px] text-slate-500 font-mono font-medium ml-1 shrink-0">:B</span>
      </div>
    </div>
  );
};
