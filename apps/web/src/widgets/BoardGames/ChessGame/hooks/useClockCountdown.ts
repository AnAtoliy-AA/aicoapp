'use client';

import { useState, useEffect, useRef } from 'react';
import type { PieceColor, PlayerClock } from '../types';

interface UseClockCountdownOptions {
  clocks: Record<PieceColor, PlayerClock> | null;
  currentTurnColor: PieceColor;
  isGameOver: boolean;
  gameCreatedAt: number;
  incrementSeconds?: number;
}

export interface LiveClock {
  white: number;
  black: number;
}

const FIRST_MOVE_DEADLINE_MS = 20_000;
const FIRST_MOVE_SECONDS = FIRST_MOVE_DEADLINE_MS / 1000;
const ZERO_CLOCK: LiveClock = { white: 0, black: 0 };

function computeLiveClocks(
  clocks: Record<PieceColor, PlayerClock>,
  currentTurnColor: PieceColor,
  gameCreatedAt: number,
): LiveClock {
  const now = Date.now();
  const whiteClock = clocks.white;
  const blackClock = clocks.black;

  const firstMoveMade =
    whiteClock.lastMoveTimestamp > 0 || blackClock.lastMoveTimestamp > 0;

  if (!firstMoveMade) {
    const sinceCreation = (now - gameCreatedAt) / 1000;
    if (sinceCreation < FIRST_MOVE_SECONDS) {
      return {
        white: Math.max(0, FIRST_MOVE_SECONDS - sinceCreation),
        black: blackClock.remainingSeconds,
      };
    }
    const clockElapsed = sinceCreation - FIRST_MOVE_SECONDS;
    return {
      white: Math.max(0, whiteClock.remainingSeconds - clockElapsed),
      black: blackClock.remainingSeconds,
    };
  }

  const activeClock = clocks[currentTurnColor];
  const inactiveClock = currentTurnColor === 'white' ? blackClock : whiteClock;
  const opponentClock = currentTurnColor === 'white' ? blackClock : whiteClock;

  const turnStartedAt =
    opponentClock.lastMoveTimestamp > 0
      ? opponentClock.lastMoveTimestamp
      : gameCreatedAt;
  const elapsedSeconds = (now - turnStartedAt) / 1000;
  const activeRemaining = Math.max(
    0,
    activeClock.remainingSeconds - elapsedSeconds,
  );

  return {
    white:
      currentTurnColor === 'white'
        ? activeRemaining
        : inactiveClock.remainingSeconds,
    black:
      currentTurnColor === 'black'
        ? activeRemaining
        : inactiveClock.remainingSeconds,
  };
}

/**
 * Client-side countdown hook.
 *
 * Rules:
 * - Before ANY move: White shows 20s grace countdown, Black frozen at game time.
 * - After first move: active player's clock ticks, inactive player's frozen.
 * - When it's your move your clock counts; when it's not your move it stops.
 */
export function useClockCountdown({
  clocks,
  currentTurnColor,
  isGameOver,
  gameCreatedAt,
}: UseClockCountdownOptions): LiveClock {
  const [live, setLive] = useState<LiveClock>(ZERO_CLOCK);
  const inputsRef = useRef({
    clocks,
    currentTurnColor,
    isGameOver,
    gameCreatedAt,
  });

  useEffect(() => {
    inputsRef.current = { clocks, currentTurnColor, isGameOver, gameCreatedAt };

    const tick = () => {
      const {
        clocks: c,
        currentTurnColor: ctc,
        isGameOver: go,
        gameCreatedAt: gca,
      } = inputsRef.current;
      if (go || !c) {
        setLive(ZERO_CLOCK);
        return;
      }
      setLive(computeLiveClocks(c, ctc, gca));
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [isGameOver, clocks, currentTurnColor, gameCreatedAt]);

  return live;
}
