import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useClockCountdown } from './useClockCountdown';
import type { PieceColor, PlayerClock } from '../types';

describe('useClockCountdown', () => {
  it('returns zero clock when clocks are null', () => {
    const { result } = renderHook(() =>
      useClockCountdown({
        clocks: null,
        currentTurnColor: 'white',
        isGameOver: false,
        gameCreatedAt: Date.now(),
      }),
    );
    expect(result.current.white).toBe(0);
    expect(result.current.black).toBe(0);
  });

  it('displays 20s countdown for White before first move within grace period', () => {
    const clocks: Record<PieceColor, PlayerClock> = {
      white: { remainingSeconds: 180, lastMoveTimestamp: 0 },
      black: { remainingSeconds: 180, lastMoveTimestamp: 0 },
    };
    const { result } = renderHook(() =>
      useClockCountdown({
        clocks,
        currentTurnColor: 'white',
        isGameOver: false,
        gameCreatedAt: Date.now() - 5000,
      }),
    );
    expect(result.current.white).toBeCloseTo(15, 0);
    expect(result.current.black).toBe(180);
  });

  it('deducts time for White if first move exceeds 20s grace period', () => {
    const clocks: Record<PieceColor, PlayerClock> = {
      white: { remainingSeconds: 180, lastMoveTimestamp: 0 },
      black: { remainingSeconds: 180, lastMoveTimestamp: 0 },
    };
    const { result } = renderHook(() =>
      useClockCountdown({
        clocks,
        currentTurnColor: 'white',
        isGameOver: false,
        gameCreatedAt: Date.now() - 25000,
      }),
    );
    expect(result.current.white).toBeCloseTo(175, 0);
    expect(result.current.black).toBe(180);
  });

  it('counts down active player while freezing inactive player after first move', () => {
    const clocks: Record<PieceColor, PlayerClock> = {
      white: { remainingSeconds: 178, lastMoveTimestamp: Date.now() - 10000 },
      black: { remainingSeconds: 180, lastMoveTimestamp: 0 },
    };
    const { result } = renderHook(() =>
      useClockCountdown({
        clocks,
        currentTurnColor: 'black',
        isGameOver: false,
        gameCreatedAt: Date.now() - 30000,
      }),
    );
    expect(result.current.white).toBe(178);
    expect(result.current.black).toBeCloseTo(170, 0);
  });

  it('preserves final clock values when isGameOver is true without resetting to zero', () => {
    const clocks: Record<PieceColor, PlayerClock> = {
      white: { remainingSeconds: 142, lastMoveTimestamp: Date.now() - 20000 },
      black: { remainingSeconds: 95, lastMoveTimestamp: Date.now() - 10000 },
    };
    const { result } = renderHook(() =>
      useClockCountdown({
        clocks,
        currentTurnColor: 'white',
        isGameOver: true,
        gameCreatedAt: Date.now() - 60000,
      }),
    );
    expect(result.current.white).toBe(142);
    expect(result.current.black).toBe(95);
  });
});
