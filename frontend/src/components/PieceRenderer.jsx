import React from 'react';

// Highly recognizable, high-contrast 3D vector chess pieces with metallic gradients and drop shadows
export const PieceRenderer = ({ piece, className = "w-full h-full", is3D = true }) => {
  if (!piece) return null;

  const isWhite = piece === piece.toUpperCase();
  const type = piece.toLowerCase();

  // Distinct gradient and outline styling for White (pearl/silver) and Black (obsidian/cyan cyber)
  const whiteFill = "url(#whitePieceGradient)";
  const blackFill = "url(#blackPieceGradient)";
  const fill = isWhite ? whiteFill : blackFill;
  const stroke = isWhite ? "#334155" : "#38bdf8";
  const strokeWidth = isWhite ? "1.6" : "1.8";

  const renderShape = () => {
    switch (type) {
      case 'p': // Pawn
        return (
          <g>
            {/* Head */}
            <circle cx="20" cy="11" r="5.5" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
            {/* Collar */}
            <path d="M 15 19 C 16 17 24 17 25 19" fill="none" stroke={stroke} strokeWidth={strokeWidth} />
            {/* Body */}
            <path d="M 16 19 C 16 23 14 27 13 30 L 27 30 C 26 27 24 23 24 19 Z" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
            {/* Base */}
            <rect x="11" y="30" width="18" height="4" rx="2" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
          </g>
        );
      case 'r': // Rook / Castle
        return (
          <g>
            {/* Battlements */}
            <path
              d="M 12 11 L 12 16 L 14.5 16 L 14.5 13.5 L 18 13.5 L 18 16 L 22 16 L 22 13.5 L 25.5 13.5 L 25.5 16 L 28 16 L 28 11 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeWidth}
            />
            {/* Tower Body */}
            <path d="M 14 16 L 15 28 L 25 28 L 26 16 Z" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
            {/* Base */}
            <rect x="11" y="28" width="18" height="5" rx="1.5" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
          </g>
        );
      case 'n': // Knight / Horse
        return (
          <g>
            {/* Horse Mane and Head */}
            <path
              d="M 22 9 C 20 8 16 9 14 12 C 12 14 11 17 11 20 C 11 21.5 12.5 22 14 21 C 13 23 11 25 11 27 C 11 29 13 30 15 30 L 26 30 C 27 29 28 25 27 21 C 26 16 28 12 24 9 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeWidth}
            />
            {/* Eye */}
            <circle cx="15.5" cy="14" r="1.2" fill={stroke} />
            {/* Base */}
            <rect x="11" y="30" width="18" height="4" rx="1.5" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
          </g>
        );
      case 'b': // Bishop
        return (
          <g>
            {/* Mitre Top Pip */}
            <circle cx="20" cy="8" r="1.8" fill={isWhite ? "#fbbf24" : "#38bdf8"} />
            {/* Mitre Body */}
            <path
              d="M 20 10 C 16 10 14 13 14 18 C 14 23 16 26 16 28 L 24 28 C 24 26 26 23 26 18 C 26 13 24 10 20 10 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeWidth}
            />
            {/* Cross Slit */}
            <line x1="20" y1="13" x2="20" y2="20" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="17.5" y1="16" x2="22.5" y2="16" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
            {/* Base */}
            <rect x="11" y="28" width="18" height="5" rx="1.5" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
          </g>
        );
      case 'q': // Queen
        return (
          <g>
            {/* Crown Jewels (3 balls) */}
            <circle cx="11" cy="11" r="1.8" fill={isWhite ? "#fbbf24" : "#38bdf8"} />
            <circle cx="20" cy="9" r="2.2" fill={isWhite ? "#fbbf24" : "#38bdf8"} />
            <circle cx="29" cy="11" r="1.8" fill={isWhite ? "#fbbf24" : "#38bdf8"} />
            {/* Crown Body with flaring points */}
            <path
              d="M 11 13 L 14 24 L 20 13 L 26 24 L 29 13 L 26 28 L 14 28 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeWidth}
            />
            {/* Waist band */}
            <path d="M 13 26 L 27 26" stroke={stroke} strokeWidth={strokeWidth} />
            {/* Base */}
            <rect x="10" y="28" width="20" height="5" rx="2" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
          </g>
        );
      case 'k': // King
        return (
          <g>
            {/* King Cross */}
            <path
              d="M 20 5 L 20 11 M 17 8 L 23 8"
              stroke={isWhite ? "#fbbf24" : "#38bdf8"}
              strokeWidth="2.2"
              strokeLinecap="square"
            />
            {/* Crown Dome & Arches */}
            <path
              d="M 13 13 C 13 11 27 11 27 13 C 27 18 25 24 25 28 L 15 28 C 15 24 13 18 13 13 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeWidth}
            />
            {/* Royal Circlet Ribbon */}
            <path d="M 14 21 C 17 23 23 23 26 21" fill="none" stroke={stroke} strokeWidth="1.5" />
            {/* Heavy Base */}
            <rect x="10" y="28" width="20" height="5" rx="2" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
          </g>
        );
      default:
        return null;
    }
  };

  return (
    <svg
      viewBox="0 0 40 40"
      className={`${className} drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)] transition-transform duration-200`}
    >
      <defs>
        {/* Universal White Gradient: Clean, pearlescent metallic */}
        <linearGradient id="whitePieceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>

        {/* Universal Black Gradient: Deep obsidian with metallic sheen */}
        <linearGradient id="blackPieceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="50%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>

      {renderShape()}
    </svg>
  );
};
