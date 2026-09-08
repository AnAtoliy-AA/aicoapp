import type { CSSProperties } from 'react';
import type { GameTheme } from '@/features/games/lib/shared-themes';
import type { ChessTheme } from './theme';

export function boardVars(theme: ChessTheme): CSSProperties {
  return {
    '--chess-board-bg': theme.boardBackground,
    '--chess-selected-square': theme.selectedSquare,
    '--chess-valid-dot': theme.validMoveDot,
    '--chess-check-square': theme.checkSquare,
    '--chess-text-color': theme.textColor,
    '--chess-border-radius': theme.borderRadius,
  } as CSSProperties;
}

export function sharedThemeToChess(theme: GameTheme): ChessTheme {
  const rgb = (hex: string): string => {
    const clean = hex.replace('#', '');
    const value =
      clean.length === 3
        ? clean
            .split('')
            .map((c) => c + c)
            .join('')
        : clean;
    const num = Number.parseInt(value, 16);
    if (Number.isNaN(num)) return '99, 102, 241';
    return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
  };

  const isDarkBase =
    theme.colors.background.includes('0') ||
    theme.colors.background.includes('1') ||
    theme.colors.background.includes('2');

  return {
    background: `linear-gradient(135deg, ${theme.colors.background} 0%, ${theme.colors.surface} 100%)`,
    boardBackground: `rgba(${rgb(theme.colors.surface)}, 0.95)`,
    lightSquare: isDarkBase ? `rgba(241, 245, 249, 0.18)` : '#edeed1',
    darkSquare: `rgba(${rgb(theme.colors.primary)}, 0.45)`,
    lightPieceColor: theme.colors.playerPalette[1] ?? theme.colors.text,
    darkPieceColor: theme.colors.playerPalette[0] ?? theme.colors.primary,
    selectedSquare: `rgba(${rgb(theme.colors.glow)}, 0.65)`,
    lastMoveSquare: `rgba(${rgb(theme.colors.accent)}, 0.45)`,
    validMoveDot: `rgba(${rgb(theme.colors.highlight)}, 0.75)`,
    checkSquare: 'rgba(239, 68, 68, 0.8)',
    textColor: theme.colors.text,
    borderRadius: '14px',
    bgImage: theme.bgImage,
  };
}
