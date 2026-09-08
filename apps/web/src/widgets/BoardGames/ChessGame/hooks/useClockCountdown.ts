'use client';

import { useState, useEffect, useCallback } from 'react';
import type { PieceColor, PlayerClock } from '../types';

interface UseClockCountdownOptions {
  clocks: Record<PieceColor, PlayerClock> | null;
  currentTurnColor: PieceColor;
  isGameOver: boolean;
  gameCreatedAt: number;
}

interface LiveClock {
  white: number;
  black: number;
}

const FIRST_MOVE_DEADLINE_MS = 20_000;

function computeRemaining(clock: PlayerClock): number {
  if (clock.lastMoveTimestamp === 0) return clock.remainingSeconds;
  const elapsed = Math.floor((Date.now() - clock.lastMoveTimestamp) / 1000);
  return Math.max(0, clock.remainingSeconds - elapsed);
}

/**
 * Client-side countdown hook.
 * Only the active player's clock ticks on the client.
 * Clock starts only after the player's first move (Lichess model).
 * First move has a 20s grace period before abort.
 */
export function useClockCountdown({
  clocks,
  currentTurnColor,
  isGameOver,
  gameCreatedAt,
}: UseClockCountdownOptions): LiveClock {
  const [, setSeq] = useState(0);
  const forceUpdate = useCallback(() => setSeq((s) => s + 1), []);

  useEffect(() => {
    if (isGameOver || !clocks) return;
    const activeClock = clocks[currentTurnColor];
    // Tick if either: clock is running (lastMoveTimestamp > 0) or first-move window is active
    const clockRunning = activeClock.lastMoveTimestamp > 0;
    const firstMoveWindowActive =
      activeClock.lastMoveTimestamp === 0 &&
      Date.now() - gameCreatedAt < FIRST_MOVE_DEADLINE_MS;
    if (!clockRunning && !firstMoveWindowActive) return;
    const id = setInterval(forceUpdate, 1000);
    return () => clearInterval(id);
  }, [isGameOver, clocks, currentTurnColor, gameCreatedAt, forceUpdate]);

  if (!clocks) return { white: 0, black: 0 };

  const active = computeRemaining(clocks[currentTurnColor]);
  const inactive =
    currentTurnColor === 'white'
      ? clocks.black.remainingSeconds
      : clocks.white.remainingSeconds;

  return {
    white: currentTurnColor === 'white' ? active : inactive,
    black: currentTurnColor === 'black' ? active : inactive,
  };
}
