'use client';

import { GameLandingPreview } from '@/features/games/ui/landing/GameLandingPreview';
import styles from './CheckersLanding.module.scss';

const DEMO_BOARD: Array<Array<string | null>> = [
  [null, 'b', null, 'b', null, 'b', null, 'b'],
  ['b', null, 'b', null, 'b', null, 'b', null],
  [null, 'b', null, null, null, 'b', null, 'b'],
  [null, null, null, 'b', null, null, null, null],
  [null, null, null, null, 'w', null, null, null],
  ['w', null, 'w', null, null, null, 'w', null],
  [null, 'w', null, 'w', null, 'w', null, 'w'],
  ['w', null, 'w', null, 'w', null, 'w', null],
];

export function CheckersLandingPreview() {
  return (
    <GameLandingPreview
      testId="checkers-landing-preview"
      render={() => {
        return (
          <div aria-hidden="true" className={styles.boardContainer}>
            {DEMO_BOARD.map((row, rowIdx) =>
              row.map((cell, colIdx) => {
                const isDark = (rowIdx + colIdx) % 2 === 1;
                return (
                  <div
                    key={`${rowIdx}-${colIdx}`}
                    className={isDark ? styles.squareDark : styles.squareLight}
                  >
                    {cell === 'b' ? (
                      <span className={styles.pieceDark} />
                    ) : cell === 'w' ? (
                      <span className={styles.pieceLight} />
                    ) : null}
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
