import { describe, expect, it } from 'vitest';
import { getBestMoveArrow, getThreatArrows } from './threat-arrows';
import type { Board } from '../types';

describe('threat-arrows', () => {
  it('parses valid UCI best move strings into arrow coordinates', () => {
    const arrow = getBestMoveArrow('e2e4');
    expect(arrow).toEqual({
      from: { file: 'e', rank: 2 },
      to: { file: 'e', rank: 4 },
      color: 'rgba(6, 182, 212, 0.9)',
    });
  });

  it('handles promotions in UCI best move strings', () => {
    const arrow = getBestMoveArrow('e7e8q');
    expect(arrow).toEqual({
      from: { file: 'e', rank: 7 },
      to: { file: 'e', rank: 8 },
      color: 'rgba(6, 182, 212, 0.9)',
    });
  });

  it('returns null for invalid or missing best move strings', () => {
    expect(getBestMoveArrow(undefined)).toBeNull();
    expect(getBestMoveArrow('')).toBeNull();
    expect(getBestMoveArrow('xyz')).toBeNull();
    expect(getBestMoveArrow('z9z9')).toBeNull();
  });

  it('calculates threat arrows when opponent pieces attack player pieces', () => {
    const emptyRow = () => [null, null, null, null, null, null, null, null];
    const board: Board = [
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [
        null,
        null,
        { type: 'knight', color: 'black' },
        null,
        null,
        null,
        null,
        null,
      ],
      [
        null,
        null,
        null,
        null,
        { type: 'queen', color: 'white' },
        null,
        null,
        null,
      ],
      emptyRow(),
      emptyRow(),
      emptyRow(),
      emptyRow(),
    ];

    const threats = getThreatArrows(board, 'white');
    expect(threats.length).toBeGreaterThan(0);
    const knightAttack = threats.find(
      (t) =>
        t.from.file === 'c' &&
        t.from.rank === 6 &&
        t.to.file === 'e' &&
        t.to.rank === 5,
    );
    expect(knightAttack).toBeDefined();
    expect(knightAttack?.color).toBe('rgba(239, 68, 68, 0.85)');
  });

  it('returns empty array when no attacks exist or myColor is null', () => {
    const emptyBoard: Board = Array.from({ length: 8 }, () =>
      Array.from({ length: 8 }, () => null),
    );
    expect(getThreatArrows(emptyBoard, 'white')).toEqual([]);
    expect(getThreatArrows(emptyBoard, null)).toEqual([]);
  });
});
