'use client';

import { useSyncExternalStore, useCallback } from 'react';

export type ChessBoardTheme =
  'green' | 'blue' | 'wood' | 'purple' | 'coral' | 'slate' | 'tan' | 'walnut';

export interface BoardThemeOption {
  id: ChessBoardTheme;
  name: string;
  lightSquare: string;
  darkSquare: string;
  legalDot: string;
  lastMove: string;
  coord: string;
}

export const BOARD_THEME_OPTIONS: BoardThemeOption[] = [
  {
    id: 'green',
    name: 'Classic Green',
    lightSquare: '#f0d9b5',
    darkSquare: '#b58863',
    legalDot: 'rgba(0,0,0,0.25)',
    lastMove: 'rgba(155,199,0,0.41)',
    coord: '#b58863',
  },
  {
    id: 'blue',
    name: 'Ocean Blue',
    lightSquare: '#dee3e6',
    darkSquare: '#8ca2ad',
    legalDot: 'rgba(0,0,0,0.2)',
    lastMove: 'rgba(20,85,30,0.35)',
    coord: '#8ca2ad',
  },
  {
    id: 'wood',
    name: 'Warm Wood',
    lightSquare: '#f3e4c6',
    darkSquare: '#a0622a',
    legalDot: 'rgba(0,0,0,0.22)',
    lastMove: 'rgba(244,188,90,0.4)',
    coord: '#a0622a',
  },
  {
    id: 'purple',
    name: 'Midnight Purple',
    lightSquare: '#e8d5f5',
    darkSquare: '#6b21a8',
    legalDot: 'rgba(255,255,255,0.25)',
    lastMove: 'rgba(168,85,247,0.4)',
    coord: '#e8d5f5',
  },
  {
    id: 'coral',
    name: 'Coral Rose',
    lightSquare: '#fde8e4',
    darkSquare: '#be4a4a',
    legalDot: 'rgba(0,0,0,0.2)',
    lastMove: 'rgba(251,113,133,0.4)',
    coord: '#be4a4a',
  },
  {
    id: 'slate',
    name: 'Steel Slate',
    lightSquare: '#d4d8df',
    darkSquare: '#4b5563',
    legalDot: 'rgba(255,255,255,0.2)',
    lastMove: 'rgba(100,116,139,0.4)',
    coord: '#d4d8df',
  },
  {
    id: 'tan',
    name: 'Desert Tan',
    lightSquare: '#ffe0b2',
    darkSquare: '#d4855a',
    legalDot: 'rgba(0,0,0,0.22)',
    lastMove: 'rgba(245,158,11,0.38)',
    coord: '#d4855a',
  },
  {
    id: 'walnut',
    name: 'Dark Walnut',
    lightSquare: '#c8b89a',
    darkSquare: '#5c3d11',
    legalDot: 'rgba(255,255,255,0.22)',
    lastMove: 'rgba(161,92,30,0.45)',
    coord: '#c8b89a',
  },
];

const STORAGE_KEY = 'arcadeum_chess_board_theme';
const VALID_IDS: ChessBoardTheme[] = BOARD_THEME_OPTIONS.map((t) => t.id);

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getSnapshot(): ChessBoardTheme | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as ChessBoardTheme | null;
    if (saved && VALID_IDS.includes(saved)) return saved;
  } catch {}
  return null;
}

function getServerSnapshot(): ChessBoardTheme | null {
  return null;
}

export function useBoardThemePreference() {
  const boardThemeId = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const setBoardTheme = useCallback((id: ChessBoardTheme | null) => {
    try {
      if (id) {
        localStorage.setItem(STORAGE_KEY, id);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
      window.dispatchEvent(new Event('storage'));
    } catch {}
  }, []);

  const activeBoardTheme = boardThemeId
    ? (BOARD_THEME_OPTIONS.find((t) => t.id === boardThemeId) ?? null)
    : null;

  return { boardThemeId, activeBoardTheme, setBoardTheme };
}

export function getBoardThemeCssVars(
  theme: BoardThemeOption | null,
): Record<string, string> {
  const t = theme ?? BOARD_THEME_OPTIONS[0];
  return {
    '--chess-light-square': t.lightSquare,
    '--chess-dark-square': t.darkSquare,
    '--chess-legal-dot': t.legalDot,
    '--chess-last-move': t.lastMove,
    '--chess-coord': t.coord,
  };
}
