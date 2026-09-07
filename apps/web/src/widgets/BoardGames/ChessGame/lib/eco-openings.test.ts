import { describe, it, expect } from 'vitest';
import { detectOpening, ECO_OPENINGS } from './eco-openings';

describe('ECO_OPENINGS', () => {
  it('contains at least 60 opening entries', () => {
    expect(ECO_OPENINGS.size).toBeGreaterThanOrEqual(60);
  });

  it('all values are non-empty strings', () => {
    for (const [, name] of ECO_OPENINGS) {
      expect(typeof name).toBe('string');
      expect(name.length).toBeGreaterThan(0);
    }
  });

  it('all keys are FEN piece placement strings without spaces', () => {
    for (const [fen] of ECO_OPENINGS) {
      expect(fen).toMatch(/^[rnbqkpRNBQKP1-8/\s]+$/);
    }
  });
});

describe('detectOpening', () => {
  it('returns null for empty history', () => {
    expect(detectOpening([])).toBeNull();
  });

  it('returns null for starting position only', () => {
    expect(
      detectOpening([
        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      ]),
    ).toBe('Starting Position');
  });

  it('detects Sicilian Defense after 1.e4 c5', () => {
    const history = [
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
      'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2',
    ];
    expect(detectOpening(history)).toBe('Sicilian Defense');
  });

  it("detects Queen's Gambit after 1.d4 d5 2.c4", () => {
    const history = [
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3 0 1',
      'rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq d6 0 2',
      'rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3 0 2',
    ];
    expect(detectOpening(history)).toBe("Queen's Gambit");
  });

  it('returns the most recent matched opening (later position takes priority)', () => {
    const history = [
      'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR',
      'rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR',
    ];
    const result = detectOpening(history);
    expect(result).toBeTruthy();
  });

  it('returns null for an unknown position sequence', () => {
    const unknownHistory = ['8/8/8/8/8/8/8/8'];
    expect(detectOpening(unknownHistory)).toBeNull();
  });
});
