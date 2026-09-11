'use client';

import { useMemo } from 'react';
import { useTranslation } from '@/shared/lib/useTranslation';
import { useTrackSoloGameStarted } from '@/shared/analytics/useTrackSoloGameStarted';
import type { GameResultStats } from '@/features/games/ui/GameResultStatsGrid';
import {
  SoloGameContainer,
  formatDuration,
} from '@/features/games/ui/SoloGameContainer';
import { SolitaireThemeProvider } from '../lib/SolitaireThemeContext';
import { useSolitaireGame } from '../hooks/useSolitaireGame';
import { useSoloRating } from '@/shared/hooks/useSoloRating';
import { SolitaireBoard } from './SolitaireBoard';

export default function SolitaireGame() {
  useTrackSoloGameStarted('solitaire_v1');
  const { themeId } = useSolitaireGame();
  return (
    <SolitaireThemeProvider variant={themeId}>
      <SolitaireTable />
    </SolitaireThemeProvider>
  );
}

function SolitaireTable() {
  const { t } = useTranslation();
  const {
    state,
    actions,
    themeId,
    timer,
    game,
    gameSpecific: {
      finished,
      selection,
      setSelection,
      handleDraw,
      handleMove,
      undo,
      canUndo,
    },
  } = useSolitaireGame();
  const { rating } = useSoloRating();

  const stats: GameResultStats | null = useMemo(() => {
    if (!finished) return null;
    return {
      score: finished.score,
      turns: finished.moves,
      duration: formatDuration(finished.durationMs),
    };
  }, [finished]);

  return (
    <SoloGameContainer
      gameId="solitaire_v1"
      difficulty="default"
      sortBy="score"
      order="desc"
      maxWidthClassName="max-w-5xl xl:max-w-6xl 2xl:max-w-7xl"
      leaderboardDefaultExpanded={true}
      isRunning={state.isRunning}
      startedAt={state.startedAt}
      finishedAt={state.finishedAt}
      onNewGame={actions.newGame}
      statsItems={[
        {
          id: 'score',
          label: t('games.solitaire_v1.hud.score'),
          value: game.score,
          icon: '🎯',
        },
        {
          id: 'moves',
          label: t('games.solitaire_v1.hud.moves'),
          value: game.moves,
          icon: '🔄',
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
      undo={{ onUndo: undo, canUndo }}
      loadingMessage="games.solitaire_v1.board.loading"
      timer={timer}
      modal={{
        result: finished ? (finished.won ? 'victory' : 'defeat') : null,
        gameName: 'Solitaire',
        rematchLabel: t('games.solitaire_v1.result.playAgain'),
        theme: themeId,
        stats,
        messages: {
          title: t(
            finished?.won
              ? 'games.solitaire_v1.result.wonTitle'
              : 'games.solitaire_v1.result.lostTitle',
          ),
          message: t(
            finished?.won
              ? 'games.solitaire_v1.result.wonBody'
              : 'games.solitaire_v1.result.lostBody',
          ),
        },
      }}
    >
      <SolitaireBoard
        game={game}
        selection={selection}
        onSelect={setSelection}
        onDraw={handleDraw}
        onMove={handleMove}
      />
    </SoloGameContainer>
  );
}
