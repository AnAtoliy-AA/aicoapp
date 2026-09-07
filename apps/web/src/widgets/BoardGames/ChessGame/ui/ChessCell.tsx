'use client';

import { memo } from 'react';
import type { ChessPiece, File, Rank } from '../types';
import type { ChessPieceStyle } from '../lib/piece-style';
import { ChessPieceIcon } from './ChessPieceIcon';

export interface ChessCellProps {
  file: File;
  rank: Rank;
  piece: ChessPiece | null;
  pieceStyle?: ChessPieceStyle;
  isLight: boolean;
  selected: boolean;
  legalTarget: boolean;
  lastMoved: boolean;
  hintMoved: boolean;
  pendingTarget: boolean;
  kingCheck: boolean;
  hovered: boolean;
  isDragOver: boolean;
  isMyPiece: boolean;
  canInteract: boolean;
  isLastFile: boolean;
  isBottomRank: boolean;
  disabled: boolean;
  cellFocusProps: Record<string, unknown>;
  onSquareClick: (file: File, rank: Rank) => void;
  onPieceDrop?: (
    fromFile: File,
    fromRank: Rank,
    toFile: File,
    toRank: Rank,
  ) => void;
  onHover: (square: string | null) => void;
  onDragOver: (square: string | null) => void;
  animating: Map<string, { dx: number; dy: number }>;
}

const UNICODE_PIECES: Record<string, string> = {
  'white-pawn': '♙',
  'white-knight': '♘',
  'white-bishop': '♗',
  'white-rook': '♖',
  'white-queen': '♕',
  'white-king': '♔',
  'black-pawn': '♟',
  'black-knight': '♞',
  'black-bishop': '♝',
  'black-rook': '♜',
  'black-queen': '♛',
  'black-king': '♚',
};

function ChessCell({
  file,
  rank,
  piece,
  pieceStyle = 'neo',
  isLight,
  selected,
  legalTarget,
  lastMoved,
  hintMoved,
  pendingTarget,
  kingCheck,
  hovered,
  isDragOver,
  isMyPiece,
  canInteract,
  isLastFile,
  isBottomRank,
  disabled,
  cellFocusProps,
  onSquareClick,
  onPieceDrop,
  onHover,
  onDragOver,
  animating: _animating,
}: ChessCellProps) {
  const square = `${file}-${rank}`;

  let bgClass = isLight
    ? 'bg-[var(--chess-light-square)]'
    : 'bg-[var(--chess-dark-square)]';
  if (selected) {
    bgClass =
      'bg-[var(--chess-selected-square)] ring-2 ring-amber-400/80 inset-ring';
  } else if (kingCheck) {
    bgClass =
      'bg-[var(--chess-check-square)] ring-2 ring-red-500 animate-pulse';
  } else if (pendingTarget) {
    bgClass = 'bg-amber-400/40';
  } else if (hintMoved) {
    bgClass = 'bg-emerald-500/35 ring-2 ring-emerald-400/70';
  } else if (lastMoved) {
    bgClass = 'bg-[var(--chess-last-move)]';
  }

  const pieceKey = piece ? `${piece.color}-${piece.type}` : '';
  const unicodeSymbol = pieceKey ? UNICODE_PIECES[pieceKey] : '';

  return (
    <div
      role="gridcell"
      data-testid={`chess-${file}${rank}`}
      className={`flex-1 aspect-square relative flex items-center justify-center overflow-hidden select-none touch-manipulation transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--primary)] ${bgClass} ${
        canInteract ? 'cursor-pointer' : 'cursor-default'
      } ${legalTarget && (hovered || isDragOver) ? 'brightness-125' : ''}`}
      aria-label={`${file}${rank}${piece ? ` ${piece.color} ${piece.type}` : ''}${selected ? ' selected' : ''}${legalTarget ? ' legal move' : ''}${hintMoved ? ' suggested' : ''}`}
      {...cellFocusProps}
      draggable={isMyPiece && !disabled}
      onClick={() => {
        if (!disabled) onSquareClick(file, rank);
      }}
      onMouseEnter={() => onHover(square)}
      onMouseLeave={() => onHover(null)}
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', square);
        e.dataTransfer.effectAllowed = 'move';
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        onDragOver(square);
      }}
      onDragLeave={() => onDragOver(null)}
      onDrop={(e) => {
        e.preventDefault();
        onDragOver(null);
        const data = e.dataTransfer.getData('text/plain');
        if (data && onPieceDrop) {
          const [fromFile, fromRank] = data.split('-');
          onPieceDrop(fromFile as File, Number(fromRank) as Rank, file, rank);
        }
      }}
    >
      {legalTarget && !piece && (
        <div className="absolute w-[30%] h-[30%] rounded-full bg-emerald-400/60 pointer-events-none shadow-sm transition-transform scale-100 hover:scale-125" />
      )}

      {legalTarget && piece && (
        <div className="absolute inset-1 rounded-full border-4 border-red-500/80 pointer-events-none animate-pulse" />
      )}

      {hintMoved && (
        <div className="absolute inset-1 rounded-full border-2 border-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)] pointer-events-none animate-pulse" />
      )}

      {isLastFile && (
        <span className="absolute right-1 top-0.5 text-[10px] font-bold text-[var(--color)] opacity-40 leading-none pointer-events-none select-none font-mono">
          {rank}
        </span>
      )}

      {isBottomRank && (
        <span className="absolute left-1 bottom-0.5 text-[10px] font-bold text-[var(--color)] opacity-40 leading-none pointer-events-none select-none font-mono">
          {file}
        </span>
      )}

      {piece && (
        <div className="relative z-10 w-[82%] h-[82%] flex items-center justify-center transition-transform hover:scale-105 active:scale-95 drop-shadow-md">
          <ChessPieceIcon piece={piece} pieceStyle={pieceStyle} />
          <span className="sr-only">{unicodeSymbol}</span>
        </div>
      )}
    </div>
  );
}

export const MemoizedChessCell = memo(ChessCell);
