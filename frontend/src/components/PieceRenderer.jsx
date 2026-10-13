import React from 'react';

// Crisp, stylized SVG vectors with 3D drop-shadow and specular reflections
export const PieceRenderer = ({ piece, className = "w-full h-full", is3D = true }) => {
  if (!piece) return null;

  const isWhite = piece === piece.toUpperCase();
  const type = piece.toLowerCase();

  const whiteGradient = (
    <defs>
      <linearGradient id={`wGrad-${type}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="60%" stopColor="#e2e8f0" />
        <stop offset="100%" stopColor="#cbd5e1" />
      </linearGradient>
      <filter id={`shadow-${type}`} x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy={is3D ? "4" : "1"} stdDeviation={is3D ? "3" : "1"} floodColor="#000" floodOpacity={is3D ? "0.6" : "0.3"} />
      </filter>
    </defs>
  );

  const blackGradient = (
    <defs>
      <linearGradient id={`bGrad-${type}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#334155" />
        <stop offset="50%" stopColor="#1e293b" />
        <stop offset="100%" stopColor="#0f172a" />
      </linearGradient>
      <filter id={`shadow-${type}`} x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy={is3D ? "4" : "1"} stdDeviation={is3D ? "3" : "1"} floodColor="#000" floodOpacity={is3D ? "0.7" : "0.4"} />
      </filter>
    </defs>
  );

  const fill = isWhite ? `url(#wGrad-${type})` : `url(#bGrad-${type})`;
  const stroke = isWhite ? "#94a3b8" : "#475569";
  const strokeWidth = "1.5";

  const renderShape = () => {
    switch (type) {
      case 'p': // Pawn
        return (
          <g filter={`url(#shadow-${type})`}>
            <path
              d="M 22 9 A 4 4 0 1 1 18 9 A 4 4 0 1 1 22 9 Z M 16 16 C 16 13 24 13 24 16 C 24 20 23 23 25 28 L 15 28 C 17 23 16 20 16 16 Z M 12 32 L 28 32 C 28 30 26 29 25 28 L 15 28 C 14 29 12 30 12 32 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeWidth}
            />
          </g>
        );
      case 'r': // Rook
        return (
          <g filter={`url(#shadow-${type})`}>
            <path
              d="M 11 12 L 11 16 L 13 16 L 13 13 L 17 13 L 17 16 L 23 16 L 23 13 L 27 13 L 27 16 L 29 16 L 29 12 Z M 14 17 L 26 17 L 24 27 L 16 27 Z M 12 28 L 28 28 L 28 32 L 12 32 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeWidth}
            />
          </g>
        );
      case 'n': // Knight
        return (
          <g filter={`url(#shadow-${type})`}>
            <path
              d="M 22 10 C 22 10 20 8 16 10 C 13 11.5 11 14 11 17 C 11 19 13 20 15 19 C 14 21 12 22 11 25 C 11 28 13 29 15 28 C 14 30 16 32 19 32 L 27 32 C 28 31 29 27 28 23 C 27 18 29 14 25 10 Z M 15 14 A 1.2 1.2 0 1 1 15 11.6 A 1.2 1.2 0 1 1 15 14 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeWidth}
            />
          </g>
        );
      case 'b': // Bishop
        return (
          <g filter={`url(#shadow-${type})`}>
            <path
              d="M 20 8 C 18 8 16.5 10 16.5 12 C 16.5 14 18 15 18 16 C 16 18 14 21 15 26 L 25 26 C 26 21 24 18 22 16 C 22 15 23.5 14 23.5 12 C 23.5 10 22 8 20 8 Z M 19 9.5 L 21 9.5 M 20 8.5 L 20 10.5 M 13 28 L 27 28 L 27 32 L 13 32 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeWidth}
            />
          </g>
        );
      case 'q': // Queen
        return (
          <g filter={`url(#shadow-${type})`}>
            <path
              d="M 10 13 L 13 22 L 20 12 L 27 22 L 30 13 L 26 26 L 14 26 Z M 9 12 A 1.5 1.5 0 1 1 9 9 A 1.5 1.5 0 1 1 9 12 Z M 20 11 A 1.5 1.5 0 1 1 20 8 A 1.5 1.5 0 1 1 20 11 Z M 31 12 A 1.5 1.5 0 1 1 31 9 A 1.5 1.5 0 1 1 31 12 Z M 12 28 L 28 28 L 28 32 L 12 32 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeWidth}
            />
          </g>
        );
      case 'k': // King
        return (
          <g filter={`url(#shadow-${type})`}>
            <path
              d="M 19 6 L 21 6 L 21 8 L 23 8 L 23 10 L 21 10 L 21 12 L 19 12 L 19 10 L 17 10 L 17 8 L 19 8 Z M 14 14 C 14 12 26 12 26 14 C 26 18 25 22 25 26 L 15 26 C 15 22 14 18 14 14 Z M 12 28 L 28 28 L 28 32 L 12 32 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeWidth}
            />
          </g>
        );
      default:
        return null;
    }
  };

  return (
    <svg viewBox="0 0 40 40" className={className}>
      {isWhite ? whiteGradient : blackGradient}
      {renderShape()}
    </svg>
  );
};
