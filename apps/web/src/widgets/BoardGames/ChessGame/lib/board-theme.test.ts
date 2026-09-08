import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  BOARD_THEME_OPTIONS,
  getBoardThemeCssVars,
  type BoardThemeOption,
} from './board-theme';

describe('BOARD_THEME_OPTIONS', () => {
  it('has 8 unique theme ids', () => {
    const ids = BOARD_THEME_OPTIONS.map((t) => t.id);
    expect(new Set(ids).size).toBe(8);
  });

  it('each theme has all required css properties', () => {
    for (const theme of BOARD_THEME_OPTIONS) {
      expect(theme.lightSquare).toBeTruthy();
      expect(theme.darkSquare).toBeTruthy();
      expect(theme.legalDot).toBeTruthy();
      expect(theme.lastMove).toBeTruthy();
      expect(theme.coord).toBeTruthy();
      expect(theme.name).toBeTruthy();
    }
  });
});

describe('getBoardThemeCssVars', () => {
  it('returns default theme when null', () => {
    const result = getBoardThemeCssVars(null);
    const defaultTheme = BOARD_THEME_OPTIONS[0];
    expect(result['--chess-light-square']).toBe(defaultTheme.lightSquare);
    expect(result['--chess-dark-square']).toBe(defaultTheme.darkSquare);
  });

  it('returns all 5 css vars for a valid theme', () => {
    const theme = BOARD_THEME_OPTIONS[0] as BoardThemeOption;
    const vars = getBoardThemeCssVars(theme);
    expect(vars['--chess-light-square']).toBe(theme.lightSquare);
    expect(vars['--chess-dark-square']).toBe(theme.darkSquare);
    expect(vars['--chess-legal-dot']).toBe(theme.legalDot);
    expect(vars['--chess-last-move']).toBe(theme.lastMove);
    expect(vars['--chess-coord']).toBe(theme.coord);
  });

  it('produces different light and dark squares for each theme', () => {
    for (const theme of BOARD_THEME_OPTIONS) {
      expect(theme.lightSquare).not.toBe(theme.darkSquare);
    }
  });
});

describe('localStorage persistence', () => {
  beforeEach(() => {
    const store = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => store.set(key, value),
      removeItem: (key: string) => store.delete(key),
    });
  });

  it('returns null when no theme is stored', () => {
    expect(localStorage.getItem('arcadeum_chess_board_theme')).toBeNull();
  });

  it('stores and retrieves a valid theme id', () => {
    localStorage.setItem('arcadeum_chess_board_theme', 'blue');
    expect(localStorage.getItem('arcadeum_chess_board_theme')).toBe('blue');
  });
});
