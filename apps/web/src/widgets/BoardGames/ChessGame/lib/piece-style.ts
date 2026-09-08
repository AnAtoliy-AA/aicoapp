'use client';

import { useSyncExternalStore, useCallback } from 'react';

export type ChessPieceStyle =
  | 'arcadeum'
  | 'neo'
  | 'classic'
  | 'classic-filled'
  | 'classic-outline'
  | 'classic-serif'
  | 'wood'
  | 'neon'
  | 'glass';

export interface PieceStyleOption {
  id: ChessPieceStyle;
  name: string;
  badge: string;
}

export const PIECE_STYLE_OPTIONS: PieceStyleOption[] = [
  { id: 'arcadeum', name: 'Arcadeum Premium', badge: 'Sprite' },
  { id: 'neo', name: 'Tournament Neo', badge: 'Vector' },
  { id: 'classic', name: 'Classic (Original)', badge: 'Unicode' },
  { id: 'classic-filled', name: 'Solid Bold', badge: 'Unicode' },
  { id: 'classic-outline', name: 'Outline Minimal', badge: 'Unicode' },
  { id: 'classic-serif', name: 'Book Serif', badge: 'Unicode' },
  { id: 'wood', name: 'Classic Wood', badge: 'Warm' },
  { id: 'neon', name: 'Cyber Neon', badge: 'Arcade' },
  { id: 'glass', name: 'Frosted Glass', badge: 'Modern' },
];

const STORAGE_KEY = 'arcadeum_chess_piece_style';

const VALID_STYLES: ChessPieceStyle[] = [
  'arcadeum',
  'neo',
  'classic',
  'classic-filled',
  'classic-outline',
  'classic-serif',
  'wood',
  'neon',
  'glass',
];

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getSnapshot(): ChessPieceStyle {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as ChessPieceStyle | null;
    if (saved && VALID_STYLES.includes(saved)) {
      return saved;
    }
  } catch {}
  return 'arcadeum';
}

function getServerSnapshot(): ChessPieceStyle {
  return 'arcadeum';
}

export function useChessPieceStylePreference() {
  const pieceStyle = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const setPieceStyle = useCallback((style: ChessPieceStyle) => {
    try {
      localStorage.setItem(STORAGE_KEY, style);
      window.dispatchEvent(new Event('storage'));
    } catch {}
  }, []);

  return { pieceStyle, setPieceStyle };
}
