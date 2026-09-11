'use client';

import { useEffect, useMemo } from 'react';
import { useTranslation } from '@/shared/lib/useTranslation';
import { useTrackSoloGameStarted } from '@/shared/analytics/useTrackSoloGameStarted';
import type { GameResultStats } from '@/features/games/ui/GameResultStatsGrid';
import {
  SoloGameContainer,
  formatDuration,
} from '@/features/games/ui/SoloGameContainer';
import { Game2048ThemeProvider } from '../lib/Game2048ThemeContext';
import { useGame2048Game } from '../hooks/useGame2048Game';
import { useSoloRating } from '@/shared/hooks/useSoloRating';
import type { Direction } from '../types';
import { Game2048Board } from './Game2048Board';

export default function Game2048() {
  useTrackSoloGameStarted('game_2048_v1');
  const { themeId } = useGame2048Game();
  return (
    <Game2048ThemeProvider variant={themeId}>
      <Game2048Table />
    </Game2048ThemeProvider>
  );
}

function Game2048Table() {
  const { t } = useTranslation();
  const {
    state,
    actions,
    themeId,
    gameSpecific: {
      grid,
      score,
      best,
      finished,
      status,
      keepPlayingFlag,
      continuePlaying,
      handleMove,
      undo,
      canUndo,
    },
  } = useGame2048Game();
  const { rating } = useSoloRating();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const keyMap: Record<string, Direction> = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
        w: 'up',
        s: 'down',
        a: 'left',
        d: 'right',
        W: 'up',
        S: 'down',
        A: 'left',
        D: 'right',
      };
      const direction = keyMap[event.key];
      if (!direction) return;
      event.preventDefault();
      handleMove(direction);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleMove]);

  const maxTile = useMemo(() => Math.max(0, ...grid.flat()), [grid]);

  const stats: GameResultStats | null = useMemo(() => {
    if (!finished) return null;
    return {
      score: finished.score,
      turns: finished.moves,
      duration: formatDuration(finished.durationMs),
      customStats: [
        {
          id: 'best-score',
          label: t('games.game_2048_v1.hud.best'),
          value: best,
        },
        { id: 'max-tile', label: 'Max Tile', value: maxTile },
      ],
    };
  }, [finished, best, maxTile, t]);

  return (
    <SoloGameContainer
      gameId="game_2048_v1"
      difficulty="default"
      sortBy="score"
      order="desc"
      isRunning={state.isRunning}
      startedAt={state.startedAt}
      finishedAt={state.finishedAt}
      onNewGame={actions.newGame}
      statsItems={[
        {
          id: 'score',
          label: t('games.game_2048_v1.hud.score'),
          value: score,
          icon: '🎯',
          dataTestId: 'game-2048-score',
        },
        {
          id: 'best',
          label: t('games.game_2048_v1.hud.best'),
          value: best,
          icon: '🏆',
          dataTestId: 'game-2048-best',
        },
        ...(rating
          ? [
              {
                id: 'rating',
                label: 'Rating',
                value: rating.rating,
                icon: '⭐',
              },
            ]
          : []),
      ]}
      loadingMessage="games.game_2048_v1.board.loading"
      undo={{ onUndo: undo, canUndo }}
      modal={{
        result: finished ? (finished.won ? 'victory' : 'defeat') : null,
        gameName: '2048',
        rematchLabel: t('games.game_2048_v1.result.playAgain'),
        theme: themeId,
        stats,
        messages: {
          title: t(
            finished?.won
              ? 'games.game_2048_v1.result.wonTitle'
              : 'games.game_2048_v1.result.lostTitle',
          ),
          message: t(
            finished?.won
              ? 'games.game_2048_v1.result.wonBody'
              : 'games.game_2048_v1.result.lostBody',
          ),
        },
        secondaryAction:
          finished?.won && status !== 'lost' && !keepPlayingFlag
            ? {
                label: t('games.game_2048_v1.result.keepGoing'),
                onClick: continuePlaying,
                testId: 'keep-going-button',
              }
            : undefined,
        onClose: status === 'won' ? continuePlaying : undefined,
      }}
    >
      <Game2048Board grid={grid} onMove={handleMove} />
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-col items-center gap-1 sm:hidden select-none">
          <div className="relative flex h-28 w-28 items-center justify-center">
            <button
              type="button"
              onClick={() => handleMove('up')}
              data-testid="pad-up"
              aria-label="Move Up"
              className="absolute top-0 h-10 w-10 rounded-xl border border-[var(--glassBorder)] bg-[var(--glassBg)] flex items-center justify-center text-sm font-bold shadow-md active:scale-90 active:bg-[var(--primary)]/20 active:border-[var(--primary)] transition-transform"
            >
              ▲
            </button>
            <button
              type="button"
              onClick={() => handleMove('left')}
              data-testid="pad-left"
              aria-label="Move Left"
              className="absolute left-0 h-10 w-10 rounded-xl border border-[var(--glassBorder)] bg-[var(--glassBg)] flex items-center justify-center text-sm font-bold shadow-md active:scale-90 active:bg-[var(--primary)]/20 active:border-[var(--primary)] transition-transform"
            >
              ◀
            </button>
            <button
              type="button"
              onClick={() => handleMove('down')}
              data-testid="pad-down"
              aria-label="Move Down"
              className="absolute bottom-0 h-10 w-10 rounded-xl border border-[var(--glassBorder)] bg-[var(--glassBg)] flex items-center justify-center text-sm font-bold shadow-md active:scale-90 active:bg-[var(--primary)]/20 active:border-[var(--primary)] transition-transform"
            >
              ▼
            </button>
            <button
              type="button"
              onClick={() => handleMove('right')}
              data-testid="pad-right"
              aria-label="Move Right"
              className="absolute right-0 h-10 w-10 rounded-xl border border-[var(--glassBorder)] bg-[var(--glassBg)] flex items-center justify-center text-sm font-bold shadow-md active:scale-90 active:bg-[var(--primary)]/20 active:border-[var(--primary)] transition-transform"
            >
              ▶
            </button>
            <div className="h-5 w-5 rounded-full bg-[var(--backgroundHover)]" />
          </div>
          <p className="text-center text-xs text-[var(--textSecondary)]">
            {t('games.game_2048_v1.board.controlsHint')}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-xs text-[var(--textSecondary)]">
          <div className="flex items-center gap-1">
            <kbd className="rounded border border-[var(--glassBorder)] bg-[var(--backgroundHover)] px-1.5 py-0.5 font-mono text-[11px] font-semibold text-[var(--color)] shadow-sm">
              W
            </kbd>
            <kbd className="rounded border border-[var(--glassBorder)] bg-[var(--backgroundHover)] px-1.5 py-0.5 font-mono text-[11px] font-semibold text-[var(--color)] shadow-sm">
              A
            </kbd>
            <kbd className="rounded border border-[var(--glassBorder)] bg-[var(--backgroundHover)] px-1.5 py-0.5 font-mono text-[11px] font-semibold text-[var(--color)] shadow-sm">
              S
            </kbd>
            <kbd className="rounded border border-[var(--glassBorder)] bg-[var(--backgroundHover)] px-1.5 py-0.5 font-mono text-[11px] font-semibold text-[var(--color)] shadow-sm">
              D
            </kbd>
            <span className="px-1 text-[var(--textSecondary)]">or</span>
            <kbd className="rounded border border-[var(--glassBorder)] bg-[var(--backgroundHover)] px-1.5 py-0.5 font-mono text-[11px] font-semibold text-[var(--color)] shadow-sm">
              ↑
            </kbd>
            <kbd className="rounded border border-[var(--glassBorder)] bg-[var(--backgroundHover)] px-1.5 py-0.5 font-mono text-[11px] font-semibold text-[var(--color)] shadow-sm">
              ←
            </kbd>
            <kbd className="rounded border border-[var(--glassBorder)] bg-[var(--backgroundHover)] px-1.5 py-0.5 font-mono text-[11px] font-semibold text-[var(--color)] shadow-sm">
              ↓
            </kbd>
            <kbd className="rounded border border-[var(--glassBorder)] bg-[var(--backgroundHover)] px-1.5 py-0.5 font-mono text-[11px] font-semibold text-[var(--color)] shadow-sm">
              →
            </kbd>
          </div>
          <span>to slide</span>
        </div>
      </div>
    </SoloGameContainer>
  );
}
