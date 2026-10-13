import React, { useState, useMemo } from 'react';
import { PieceRenderer } from './PieceRenderer';

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

const DEFAULT_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

// Helper to convert FEN string to an 8x8 square matrix
function parseFen(fen) {
  const board = Array(8).fill(null).map(() => Array(8).fill(null));
  const activeFen = fen || DEFAULT_FEN;

  const placement = activeFen.split(' ')[0];
  const rows = placement.split('/');

  rows.forEach((row, rIdx) => {
    let cIdx = 0;
    for (const char of row) {
      if (isNaN(char)) {
        board[rIdx][cIdx] = char;
        cIdx++;
      } else {
        cIdx += parseInt(char, 10);
      }
    }
  });

  return board;
}

export const ChessBoard3D = ({
  fen,
  turn,
  legalMoves = [],
  lastMove = null,
  isCheck = false,
  coachHint = null,
  is3D = true,
  theme = 'cyber',
  onMove,
}) => {
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [draggedSquare, setDraggedSquare] = useState(null);

  const boardMatrix = useMemo(() => parseFen(fen), [fen]);

  // Map legal moves for quick lookup from the selected square
  const legalDestsForSelected = useMemo(() => {
    if (!selectedSquare) return [];
    return legalMoves
      .filter((m) => m.from_square === selectedSquare)
      .map((m) => ({
        to: m.to_square,
        uci: m.uci,
        isCapture: m.is_capture,
        promotion: m.promotion,
      }));
  }, [selectedSquare, legalMoves]);

  const handleSquareClick = (squareName, piece) => {
    if (turn !== 'white') return; // User plays white

    // Case 1: Clicking a legal destination square for the already selected piece
    if (selectedSquare) {
      const destMatch = legalDestsForSelected.find((d) => d.to === squareName);
      if (destMatch) {
        onMove(destMatch.uci);
        setSelectedSquare(null);
        return;
      }
    }

    // Case 2: Selecting own piece
    if (piece && piece === piece.toUpperCase()) {
      setSelectedSquare(squareName === selectedSquare ? null : squareName);
    } else {
      setSelectedSquare(null);
    }
  };

  // Drag and Drop
  const handleDragStart = (e, squareName, piece) => {
    if (turn !== 'white' || !piece || piece !== piece.toUpperCase()) {
      e.preventDefault();
      return;
    }
    setDraggedSquare(squareName);
    setSelectedSquare(squareName);
    e.dataTransfer.setData('text/plain', squareName);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetSquare) => {
    e.preventDefault();
    const fromSquare = draggedSquare || selectedSquare;
    if (!fromSquare || fromSquare === targetSquare) {
      setDraggedSquare(null);
      return;
    }

    const moveMatch = legalMoves.find(
      (m) => m.from_square === fromSquare && m.to_square === targetSquare
    );

    if (moveMatch) {
      onMove(moveMatch.uci);
      setSelectedSquare(null);
    }
    setDraggedSquare(null);
  };

  // Calculate coordinates for the AI coach trace arrow
  const traceCoords = useMemo(() => {
    if (!coachHint?.from_square || !coachHint?.to_square) return null;
    const fromFile = FILES.indexOf(coachHint.from_square[0]);
    const fromRank = RANKS.indexOf(coachHint.from_square[1]);
    const toFile = FILES.indexOf(coachHint.to_square[0]);
    const toRank = RANKS.indexOf(coachHint.to_square[1]);

    if (fromFile === -1 || fromRank === -1 || toFile === -1 || toRank === -1) return null;

    // Center percentages (0% to 100% across the 8x8 grid)
    return {
      x1: fromFile * 12.5 + 6.25,
      y1: fromRank * 12.5 + 6.25,
      x2: toFile * 12.5 + 6.25,
      y2: toRank * 12.5 + 6.25,
    };
  }, [coachHint]);

  const squareColors = theme === 'cyber'
    ? {
        light: 'bg-[#1e293b] hover:bg-[#283548]',
        dark: 'bg-[#0f172a] hover:bg-[#192237]',
        border: 'border-[#334155]',
      }
    : {
        light: 'bg-[#eedbb5] hover:bg-[#f5e5c7]',
        dark: 'bg-[#b88b4a] hover:bg-[#c99a57]',
        border: 'border-[#785223]',
      };

  return (
    <div className="relative flex flex-col items-center justify-center select-none py-4">
      {/* 3D Container with perspective */}
      <div
        className={`relative transition-all duration-700 ease-out ${
          is3D
            ? 'rotate-x-[22deg] scale-[0.98] shadow-board-3d'
            : 'rotate-x-0 scale-100 shadow-2xl'
        }`}
        style={{
          transformStyle: 'preserve-3d',
          transform: is3D ? 'perspective(1200px) rotateX(24deg)' : 'none',
        }}
      >
        {/* Outer 3D Beveled Board Rim */}
        <div
          className={`relative p-3.5 sm:p-5 rounded-2xl border-4 ${
            theme === 'cyber'
              ? 'bg-gradient-to-b from-[#1a2333] via-[#0d131f] to-[#080c14] border-[#38bdf8]/40 shadow-[inset_0_2px_10px_rgba(56,189,248,0.25)]'
              : 'bg-gradient-to-b from-[#5c3e21] via-[#3d2713] to-[#24160a] border-[#d97706]/40 shadow-[inset_0_2px_10px_rgba(217,119,6,0.3)]'
          }`}
        >
          {/* Main 8x8 Grid */}
          <div className="relative grid grid-cols-8 grid-rows-8 w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] md:w-[540px] md:h-[540px] rounded-lg overflow-hidden border border-black/50">
            {RANKS.map((rank, rIdx) =>
              FILES.map((file, fIdx) => {
                const squareName = `${file}${rank}`;
                const isLight = (rIdx + fIdx) % 2 === 0;
                const piece = boardMatrix[rIdx][fIdx];
                const isSelected = selectedSquare === squareName;
                const legalDest = legalDestsForSelected.find((d) => d.to === squareName);
                const isLastMoveSrc = lastMove?.from === squareName;
                const isLastMoveDst = lastMove?.to === squareName;
                const isWhiteKingInCheck = isCheck && piece === 'K';
                const isHintSrc = coachHint?.from_square === squareName;
                const isHintDst = coachHint?.to_square === squareName;

                return (
                  <div
                    key={squareName}
                    onClick={() => handleSquareClick(squareName, piece)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, squareName)}
                    className={`relative flex items-center justify-center transition-colors duration-200 cursor-pointer ${
                      isLight ? squareColors.light : squareColors.dark
                    } ${isSelected ? '!bg-amber-500/35 ring-2 ring-amber-400 inset-0' : ''} ${
                      isLastMoveSrc || isLastMoveDst ? '!bg-emerald-500/25 ring-1 ring-emerald-400/50' : ''
                    } ${isWhiteKingInCheck ? '!bg-rose-600/50 animate-pulse ring-2 ring-rose-500' : ''} ${
                      isHintSrc ? 'ring-2 ring-sky-400 bg-sky-500/20' : ''
                    } ${isHintDst ? 'ring-2 ring-cyan-400 bg-cyan-500/25' : ''}`}
                  >
                    {/* Square Coordinate Labels on edge files & ranks */}
                    {fIdx === 0 && (
                      <span className="absolute top-1 left-1.5 text-[10px] font-mono font-semibold text-slate-400/70 pointer-events-none">
                        {rank}
                      </span>
                    )}
                    {rIdx === 7 && (
                      <span className="absolute bottom-0.5 right-1.5 text-[10px] font-mono font-semibold text-slate-400/70 pointer-events-none">
                        {file}
                      </span>
                    )}

                    {/* Legal Move Indicator (Quiet move = glowing dot, Capture = ring) */}
                    {legalDest && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                        {legalDest.isCapture || piece ? (
                          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border-2 sm:border-4 border-cyan-400/80 animate-ping opacity-75" />
                        ) : (
                          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-cyan-400 shadow-[0_0_10px_#38bdf8] opacity-90" />
                        )}
                      </div>
                    )}

                    {/* AI Coach Target Pulse */}
                    {isHintDst && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                        <div className="w-9 h-9 sm:w-13 sm:h-13 rounded-full border-2 border-sky-400 animate-pulse opacity-90" />
                      </div>
                    )}

                    {/* Chess Piece with 3D elevation */}
                    {piece && (
                      <div
                        draggable={turn === 'white' && piece === piece.toUpperCase()}
                        onDragStart={(e) => handleDragStart(e, squareName, piece)}
                        className={`relative w-[82%] h-[82%] transition-transform duration-200 z-20 ${
                          isSelected ? '-translate-y-2 scale-110 drop-shadow-2xl' : 'hover:-translate-y-1'
                        } ${is3D ? 'transform-gpu' : ''}`}
                      >
                        <PieceRenderer piece={piece} is3D={is3D} />
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {/* AI Coach Suggestion Glowing Trace Arrow Overlay */}
            {traceCoords && (
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none z-30"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <defs>
                  <marker
                    id="coach-arrowhead"
                    viewBox="0 0 10 10"
                    refX="6"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 9 5 L 0 9 z" fill="#38bdf8" />
                  </marker>
                  <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#38bdf8" floodOpacity="0.9" />
                  </filter>
                </defs>

                {/* Glowing Background Line */}
                <line
                  x1={`${traceCoords.x1}%`}
                  y1={`${traceCoords.y1}%`}
                  x2={`${traceCoords.x2}%`}
                  y2={`${traceCoords.y2}%`}
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeDasharray="4 2"
                  filter="url(#neon-glow)"
                  className="animate-pulse"
                />

                {/* Foreground Sharp Arrow */}
                <line
                  x1={`${traceCoords.x1}%`}
                  y1={`${traceCoords.y1}%`}
                  x2={`${traceCoords.x2}%`}
                  y2={`${traceCoords.y2}%`}
                  stroke="#e0f2fe"
                  strokeWidth="1.2"
                  markerEnd="url(#coach-arrowhead)"
                />
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
