'use client';

import { GameLandingPreview } from '@/features/games/ui/landing/GameLandingPreview';
import styles from './ChessLanding.module.scss';

const DEMO_BOARD: Array<Array<string | null>> = [
  ['r', 'n', 'b', 'q', 'k', 'b', null, 'r'],
  ['p', 'p', 'p', null, 'p', 'p', 'p', 'p'],
  [null, null, null, null, null, 'n', null, null],
  [null, null, null, 'p', null, null, null, null],
  [null, null, 'B', 'P', null, null, null, null],
  [null, null, 'N', null, null, null, null, null],
  ['P', 'P', 'P', null, 'P', 'P', 'P', 'P'],
  ['R', null, 'B', 'Q', 'K', null, 'N', 'R'],
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

export function ChessLandingPreview() {
  return (
    <GameLandingPreview
      testId="chess-landing-preview"
      render={() => {
        return (
          <div aria-hidden="true" className={styles.boardContainer}>
            {DEMO_BOARD.map((row, rowIdx) =>
              row.map((cell, colIdx) => {
                const isLight = (rowIdx + colIdx) % 2 === 0;
                return (
                  <div
                    key={`${rowIdx}-${colIdx}`}
                    className={isLight ? styles.squareLight : styles.squareDark}
                  >
                    {cell ? PIECE_GLYPHS[cell] : ''}
                  </div>
                );
              }),
            )}
          </div>
        );
      }}
    />
  );
}
