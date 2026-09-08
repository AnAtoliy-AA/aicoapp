import { PIECE_SYMBOLS, type ChessPiece, type PieceType } from '../types';
import type { ChessPieceStyle } from '../lib/piece-style';

interface ChessPieceIconProps {
  piece: ChessPiece;
  className?: string;
  pieceStyle?: ChessPieceStyle;
}

const SOLID_PIECES: Record<PieceType, string> = {
  king: '♚',
  queen: '♛',
  rook: '♜',
  bishop: '♝',
  knight: '♞',
  pawn: '♟',
};

const HOLLOW_PIECES: Record<PieceType, string> = {
  king: '♔',
  queen: '♕',
  rook: '♖',
  bishop: '♗',
  knight: '♘',
  pawn: '♙',
};

export function ChessPieceIcon({
  piece,
  className = 'w-full h-full',
  pieceStyle = 'arcadeum',
}: ChessPieceIconProps) {
  const isWhite = piece.color === 'white';

  if (pieceStyle === 'arcadeum') {
    return (
      <svg
        viewBox="0 0 100 100"
        className={className}
        aria-hidden="true"
        data-testid={`piece-${piece.color}-${piece.type}`}
      >
        <use
          href={`/images/chess/arcadeum_chess_sprite.svg#arcadeum-${piece.color}-${piece.type}`}
        />
      </svg>
    );
  }

  if (
    pieceStyle === 'classic' ||
    pieceStyle === 'classic-filled' ||
    pieceStyle === 'classic-outline' ||
    pieceStyle === 'classic-serif'
  ) {
    let symbol = PIECE_SYMBOLS[piece.type][piece.color];
    let fill = isWhite ? '#FFFFFF' : '#18181B';
    let stroke = isWhite ? '#0F172A' : '#F1F5F9';
    let strokeWidth = '0.7';
    let fontFamily = 'sans-serif';

    if (pieceStyle === 'classic-filled') {
      symbol = SOLID_PIECES[piece.type];
      fill = isWhite ? '#F8FAFC' : '#09090B';
      stroke = isWhite ? '#334155' : '#71717A';
      strokeWidth = '0.9';
    } else if (pieceStyle === 'classic-outline') {
      symbol = HOLLOW_PIECES[piece.type];
      fill = isWhite ? '#FFFFFF' : '#1E293B';
      stroke = isWhite ? '#0284C7' : '#94A3B8';
      strokeWidth = '1';
    } else if (pieceStyle === 'classic-serif') {
      fontFamily = 'Georgia, Cambria, serif';
      fill = isWhite ? '#FEF3C7' : '#27272A';
      stroke = isWhite ? '#78350F' : '#F59E0B';
      strokeWidth = '0.6';
    }

    return (
      <svg
        viewBox="0 0 45 45"
        className={className}
        aria-hidden="true"
        data-testid={`piece-${piece.color}-${piece.type}`}
      >
        <text
          x="22.5"
          y="35"
          textAnchor="middle"
          fontSize="37"
          fontFamily={fontFamily}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          paintOrder="stroke fill"
          className="select-none"
        >
          {symbol}
        </text>
      </svg>
    );
  }

  let fill = isWhite ? '#FFFFFF' : '#1E293B';
  let stroke = isWhite ? '#334155' : '#0F172A';
  let highlight = isWhite ? '#F8FAFC' : '#334155';

  if (pieceStyle === 'wood') {
    fill = isWhite ? '#F5EBE1' : '#5C3A21';
    stroke = isWhite ? '#8C6239' : '#362010';
    highlight = isWhite ? '#FFFDF9' : '#8C6239';
  } else if (pieceStyle === 'neon') {
    fill = isWhite ? '#0284C7' : '#BE123C';
    stroke = isWhite ? '#38BDF8' : '#FB7185';
    highlight = isWhite ? '#BAE6FD' : '#FECDD3';
  } else if (pieceStyle === 'glass') {
    fill = isWhite ? '#E2E8F0' : '#334155';
    stroke = isWhite ? '#94A3B8' : '#1E293B';
    highlight = isWhite ? '#FFFFFF' : '#64748B';
  }

  switch (piece.type) {
    case 'pawn':
      return (
        <svg
          viewBox="0 0 45 45"
          className={className}
          aria-hidden="true"
          data-testid={`piece-${piece.color}-${piece.type}`}
        >
          <path
            d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 36c3-1 14-1 17 0"
            fill="none"
            stroke={highlight}
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'knight':
      return (
        <svg
          viewBox="0 0 45 45"
          className={className}
          aria-hidden="true"
          data-testid={`piece-${piece.color}-${piece.type}`}
        >
          <path
            d="M22 10c-3.5 0-6.5 2-8 5 0 0 .5 2-1 3-2 1-3 4-3 6s1 4 2 4c.5 0 1-.5 1-1 0 0 1.5 1 3 0 1-1 1-3 1-3s1 1 2 0c0 0 .5-1 0-2s-2-2-2-2c2-1 4-1 5 1 1 2 2 5 2 7 0 2-1 4-1 4s3.5-1 5-4c2-4 2-8 2-10 0-4-3-8-7-8z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z"
            fill={isWhite ? '#0F172A' : '#FFFFFF'}
          />
          <path
            d="M13 14c1.5-2 4-3 6.5-3"
            fill="none"
            stroke={highlight}
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M11 39.5c6-1 17-1 23 0"
            fill="none"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M11 39.5c0-4 3-7 6-8h11c3 1 6 4 6 8"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'bishop':
      return (
        <svg
          viewBox="0 0 45 45"
          className={className}
          aria-hidden="true"
          data-testid={`piece-${piece.color}-${piece.type}`}
        >
          <path
            d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="22.5"
            cy="8"
            r="2"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
          />
          <path
            d="M17.5 26h10M22.5 21v10"
            fill="none"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'rook':
      return (
        <svg
          viewBox="0 0 45 45"
          className={className}
          aria-hidden="true"
          data-testid={`piece-${piece.color}-${piece.type}`}
        >
          <path
            d="M9 39h27v-3H9v3zm3-3v-4h21v4H12zm2-4l1-14h15l1 14H14zm-3-15l1-5h4v3h3v-3h5v3h3v-3h4l1 5H11z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 30c4-1 13-1 17 0"
            fill="none"
            stroke={highlight}
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'queen':
      return (
        <svg
          viewBox="0 0 45 45"
          className={className}
          aria-hidden="true"
          data-testid={`piece-${piece.color}-${piece.type}`}
        >
          <path
            d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11-8.5-14L14 25l-7-11 2 12z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 20 1 26.5 0 0 0 2-1 .5-2.5 0 0 0-1.5-1.5-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="6"
            cy="12"
            r="2"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
          />
          <circle
            cx="14"
            cy="9"
            r="2"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
          />
          <circle
            cx="22.5"
            cy="8"
            r="2"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
          />
          <circle
            cx="31"
            cy="9"
            r="2"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
          />
          <circle
            cx="39"
            cy="12"
            r="2"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
          />
          <path
            d="M12 33.5c6-1 15-1 21 0"
            fill="none"
            stroke={highlight}
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'king':
      return (
        <svg
          viewBox="0 0 45 45"
          className={className}
          aria-hidden="true"
          data-testid={`piece-${piece.color}-${piece.type}`}
        >
          <path
            d="M22.5 11.63V6M20 8h5"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-4c0 0 0-4-3.5-5.5-3-1.5-6.5-1-6.5-1s-3.5-.5-6.5 1c-3.5 1.5-3.5 5.5-3.5 5.5v4z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11.5 30c3.5-1 6.5-2 11-2s7.5 1 11 2"
            fill="none"
            stroke={stroke}
            strokeWidth="1.5"
          />
          <path
            d="M14 36c4-1 13-1 17 0"
            fill="none"
            stroke={highlight}
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}
