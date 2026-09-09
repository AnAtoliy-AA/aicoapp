'use client';

import { useState } from 'react';
import { GameLandingPreview } from '@/features/games/ui/landing/GameLandingPreview';
import { Button } from '@arcadeum/ui';
import styles from './ChessLanding.module.scss';

type BoardState = Array<Array<string | null>>;

const INITIAL_BOARD: BoardState = [
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
];

const PIECE_GLYPHS: Record<string, string> = {
  K: '♔',
  Q: '♕',
  R: '♖',
  B: '♗',
  N: '♘',
  P: '♙',
  k: '♚',
  q: '♛',
  r: '♜',
  b: '♝',
  n: '♞',
  p: '♟',
};

interface MovePreset {
  id: string;
  name: string;
  whiteMove: string;
  from: [number, number];
  to: [number, number];
  blackMove: string;
  blackFrom: [number, number];
  blackTo: [number, number];
  openingName: string;
  evalText: string;
}

const PRESETS: MovePreset[] = [
  {
    id: 'e4',
    name: '1. e4 (King Pawn)',
    whiteMove: '1. e4',
    from: [6, 4],
    to: [4, 4],
    blackMove: '1...c5',
    blackFrom: [1, 2],
    blackTo: [3, 2],
    openingName: 'Sicilian Defense',
    evalText: '+0.25 (Stockfish 19 · Depth 22)',
  },
  {
    id: 'd4',
    name: '1. d4 (Queen Pawn)',
    whiteMove: '1. d4',
    from: [6, 3],
    to: [4, 3],
    blackMove: '1...Nf6',
    blackFrom: [0, 6],
    blackTo: [2, 5],
    openingName: 'Indian Defense',
    evalText: '+0.30 (Stockfish 19 · Depth 22)',
  },
  {
    id: 'Nf3',
    name: '1. Nf3 (Réti)',
    whiteMove: '1. Nf3',
    from: [7, 6],
    to: [5, 5],
    blackMove: '1...d5',
    blackFrom: [1, 3],
    blackTo: [3, 3],
    openingName: 'Réti Opening',
    evalText: '+0.20 (Stockfish 19 · Depth 22)',
  },
];

function cloneBoard(b: BoardState): BoardState {
  return b.map((row) => [...row]);
}

export function ChessLandingPreview() {
  const [board, setBoard] = useState<BoardState>(INITIAL_BOARD);
  const [activePreset, setActivePreset] = useState<MovePreset | null>(null);
  const [highlightSquares, setHighlightSquares] = useState<
    Array<[number, number]>
  >([]);

  const handlePlayMove = (preset: MovePreset) => {
    const next = cloneBoard(INITIAL_BOARD);
    const whitePiece = next[preset.from[0]][preset.from[1]];
    next[preset.from[0]][preset.from[1]] = null;
    next[preset.to[0]][preset.to[1]] = whitePiece;

    const blackPiece = next[preset.blackFrom[0]][preset.blackFrom[1]];
    next[preset.blackFrom[0]][preset.blackFrom[1]] = null;
    next[preset.blackTo[0]][preset.blackTo[1]] = blackPiece;

    setBoard(next);
    setActivePreset(preset);
    setHighlightSquares([preset.to, preset.blackTo]);
  };

  const handleReset = () => {
    setBoard(INITIAL_BOARD);
    setActivePreset(null);
    setHighlightSquares([]);
  };

  return (
    <GameLandingPreview
      testId="chess-landing-preview"
      interactive
      render={() => {
        return (
          <div className={styles.demoWrapper}>
            <div className={styles.evalHeader}>
              <span className="text-[var(--primary)] font-bold">
                {activePreset ? 'Stockfish 19 Eval' : 'Stockfish 19 Ready'}
              </span>
              <span className="opacity-80">
                {activePreset ? activePreset.evalText : 'Make a move below'}
              </span>
            </div>

            <div className={styles.evalBarContainer}>
              <div
                className={`${styles.evalWhiteBar} ${
                  activePreset ? 'w-[56%]' : 'w-1/2'
                }`}
              />
              <div className={styles.evalBlackBar} />
            </div>

            <div
              aria-label="Interactive Chess Board"
              className={styles.boardContainer}
            >
              {board.map((row, rowIdx) =>
                row.map((cell, colIdx) => {
                  const isLight = (rowIdx + colIdx) % 2 === 0;
                  const isHighlighted = highlightSquares.some(
                    ([r, c]) => r === rowIdx && c === colIdx,
                  );

                  return (
                    <div
                      key={`${rowIdx}-${colIdx}`}
                      className={`${
                        isLight ? styles.squareLight : styles.squareDark
                      } ${isHighlighted ? styles.squareMoved : ''}`}
                    >
                      {cell ? PIECE_GLYPHS[cell] : ''}
                    </div>
                  );
                }),
              )}
            </div>

            <div className={styles.statusPill}>
              {activePreset ? (
                <span>
                  {activePreset.whiteMove} ➔{' '}
                  <strong>{activePreset.blackMove}</strong> (
                  {activePreset.openingName})
                </span>
              ) : (
                <span>Try an opening move against Stockfish 19:</span>
              )}
            </div>

            <div className={styles.demoActions}>
              {!activePreset ? (
                PRESETS.map((preset) => (
                  <Button
                    key={preset.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handlePlayMove(preset)}
                  >
                    {preset.whiteMove}
                  </Button>
                ))
              ) : (
                <Button variant="secondary" size="sm" onClick={handleReset}>
                  Reset Board
                </Button>
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
