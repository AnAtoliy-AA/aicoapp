'use client';

import { useCallback, useMemo } from 'react';
import { Select } from '@arcadeum/ui';
import { useTranslation } from '@/shared/lib/useTranslation';
import type { TranslationKey } from '@/shared/lib/useTranslation';
import { useTrackSoloGameStarted } from '@/shared/analytics/useTrackSoloGameStarted';
import type { GameResultStats } from '@/features/games/ui/GameResultStatsGrid';
import {
  SoloGameContainer,
  formatDuration,
  useSoloFullscreen,
} from '@/features/games/ui/SoloGameContainer';
import { SudokuThemeProvider } from '../lib/SudokuThemeContext';
import { useSudokuGame } from '../hooks/useSudokuGame';
import { useSoloRating } from '@/shared/hooks/useSoloRating';
import type { Difficulty } from '../types';
import { SudokuBoard } from './SudokuBoard';

const DIFFICULTY_OPTIONS: Array<{ value: Difficulty }> = [
  { value: 'easy' },
  { value: 'medium' },
  { value: 'hard' },
];

const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function SudokuGame() {
  useTrackSoloGameStarted('sudoku_v1');
  const { themeId } = useSudokuGame();
  return (
    <SudokuThemeProvider variant={themeId}>
      <SudokuTable />
    </SudokuThemeProvider>
  );
}

function SudokuTable() {
  const { t } = useTranslation();
  const {
    state,
    actions,
    themeId,
    pause,
    game,
    gameSpecific: {
      finished,
      changeDifficulty,
      selected,
      setSelected,
      notesMode,
      setNotesMode,
      applyDigit,
      erase,
      undo,
      canUndo,
    },
  } = useSudokuGame();
  const { rating } = useSoloRating();

  const digitCounts = useMemo(() => {
    const counts: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
    };
    for (const cell of game.cells) {
      if (cell >= 1 && cell <= 9) counts[cell] = (counts[cell] ?? 0) + 1;
    }
    return counts;
  }, [game.cells]);

  const moveSelection = useCallback(
    (deltaRow: number, deltaCol: number) => {
      setSelected((current) => {
        const base = current ?? 0;
        const row = Math.min(Math.max(Math.floor(base / 9) + deltaRow, 0), 8);
        const col = Math.min(Math.max((base % 9) + deltaCol, 0), 8);
        return row * 9 + col;
      });
    },
    [setSelected],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (pause.isPaused) return;
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          moveSelection(-1, 0);
          break;
        case 'ArrowDown':
          event.preventDefault();
          moveSelection(1, 0);
          break;
        case 'ArrowLeft':
          event.preventDefault();
          moveSelection(0, -1);
          break;
        case 'ArrowRight':
          event.preventDefault();
          moveSelection(0, 1);
          break;
        case 'Backspace':
        case 'Delete':
          event.preventDefault();
          erase();
          break;
        case 'n':
        case 'N':
          setNotesMode((mode) => !mode);
          break;
        default: {
          const digit = Number(event.key);
          if (Number.isInteger(digit) && digit >= 1 && digit <= 9)
            applyDigit(digit);
        }
      }
    },
    [pause.isPaused, applyDigit, erase, moveSelection, setNotesMode],
  );

  const stats: GameResultStats | null = useMemo(() => {
    if (!finished) return null;
    return {
      duration: formatDuration(finished.durationMs),
      customStats: [
        {
          id: 'mistakes',
          label: t('games.sudoku_v1.hud.mistakes'),
          value: finished.mistakes,
        },
        {
          id: 'difficulty',
          label: t('games.sudoku_v1.hud.difficulty'),
          value: t(
            `games.sudoku_v1.difficulty.${game.difficulty}` as TranslationKey,
          ),
        },
      ],
    };
  }, [finished, game.difficulty, t]);

  return (
    <SoloGameContainer
      gameId="sudoku_v1"
      difficulty={game.difficulty}
      sortBy="durationMs"
      order="asc"
      isRunning={state.isRunning}
      startedAt={state.startedAt}
      finishedAt={state.finishedAt}
      onNewGame={actions.newGame}
      statsItems={[
        {
          id: 'mistakes',
          label: t('games.sudoku_v1.hud.mistakes'),
          value: game.mistakes,
          icon: '⚠️',
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
      controls={
        <Select
          id="sudoku-difficulty"
          size="sm"
          value={game.difficulty}
          onValueChange={(value) => changeDifficulty(value as Difficulty)}
          options={DIFFICULTY_OPTIONS.map(({ value }) => ({
            value,
            label: t(`games.sudoku_v1.difficulty.${value}` as TranslationKey),
          }))}
        />
      }
      loadingMessage="games.sudoku_v1.board.loading"
      modal={{
        result: finished ? 'victory' : null,
        gameName: 'Sudoku',
        rematchLabel: t('games.sudoku_v1.result.playAgain'),
        theme: themeId,
        stats,
        messages: {
          title: t('games.sudoku_v1.result.wonTitle'),
          message:
            finished?.mistakes === 0
              ? t('games.sudoku_v1.result.flawlessBody')
              : t('games.sudoku_v1.result.wonBody', {
                  mistakes: finished?.mistakes ?? 0,
                }),
        },
      }}
    >
      <div
        onKeyDown={handleKeyDown}
        tabIndex={0}
        className="w-full outline-none"
      >
        <SudokuBoard
          game={game}
          selected={selected}
          notesMode={notesMode}
          onSelect={setSelected}
        />
      </div>
      <SudokuKeypad
        selected={selected}
        notesMode={notesMode}
        digitCounts={digitCounts}
        onApplyDigit={applyDigit}
        onToggleNotes={() => setNotesMode((mode) => !mode)}
        onErase={erase}
        undo={undo}
        canUndo={canUndo}
      />
    </SoloGameContainer>
  );
}

function SudokuKeypad({
  selected,
  notesMode,
  digitCounts,
  onApplyDigit,
  onToggleNotes,
  onErase,
  undo,
  canUndo,
}: {
  selected: number | null;
  notesMode: boolean;
  digitCounts: Record<number, number>;
  onApplyDigit: (digit: number) => void;
  onToggleNotes: () => void;
  onErase: () => void;
  undo: () => void;
  canUndo: boolean;
}) {
  const { t } = useTranslation();
  const isFullscreen = useSoloFullscreen();
  return (
    <div
      className={`flex w-full flex-col items-center gap-2 ${isFullscreen ? 'max-w-[min(94vw,min(calc(100dvh-14rem),40rem))]' : 'max-w-[min(100vw-1rem,min(48vh,24.5rem))] sm:max-w-[min(100vw-2rem,min(50vh,25.5rem))]'}`}
    >
      <div className="grid w-full grid-cols-9 gap-1 sm:gap-1.5">
        {DIGITS.map((digit) => {
          const remaining = Math.max(9 - (digitCounts[digit] ?? 0), 0);
          return (
            <button
              key={digit}
              type="button"
              onClick={() => onApplyDigit(digit)}
              disabled={selected === null || remaining === 0}
              aria-label={
                notesMode
                  ? t('games.sudoku_v1.controls.noteDigit', { digit })
                  : t('games.sudoku_v1.controls.placeDigit', { digit })
              }
              className={`flex flex-col items-center justify-center rounded-lg border py-1 sm:py-1.5 font-mono transition-all ${remaining === 0 ? 'border-dashed border-[var(--borderColor)] bg-[var(--backgroundHover)] opacity-30 cursor-not-allowed' : notesMode ? 'border-[var(--primary)]/40 bg-[var(--primary)]/15 text-[var(--color)] hover:bg-[var(--primary)]/25 active:scale-95' : 'border-[var(--glassBorder)] bg-[var(--glassBg)] text-[var(--color)] hover:border-[var(--primary)]/50 hover:bg-[var(--glassBgHover)] active:scale-95'} disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              <span
                className={`text-sm font-extrabold sm:text-base ${isFullscreen ? 'md:text-lg' : ''}`}
              >
                {digit}
              </span>
              <span className="text-[9px] sm:text-[10px] text-[var(--textSecondary)] font-medium">
                {remaining}
              </span>
            </button>
          );
        })}
      </div>
      <div className="flex w-full items-center justify-center gap-2">
        <button
          type="button"
          onClick={undo}
          disabled={!canUndo}
          title="Undo last move (Ctrl+Z)"
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs sm:text-sm font-bold transition-all ${canUndo ? 'border-[var(--glassBorder)] bg-[var(--glassBg)] text-[var(--color)] hover:border-[var(--primary)] hover:bg-[var(--glassBgHover)]' : 'border-[var(--glassBorder)] bg-[var(--glassBg)] text-[var(--textSecondary)] opacity-50 cursor-not-allowed'}`}
        >
          <span>↩️</span>
          <span>Undo</span>
        </button>
        <button
          type="button"
          onClick={onToggleNotes}
          aria-pressed={notesMode}
          title={t('games.sudoku_v1.controls.notesHint')}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs sm:text-sm font-bold transition-all ${notesMode ? 'border-[var(--primary)] bg-[var(--primary)]/20 text-[var(--color)] shadow-md shadow-[var(--primary)]/20 ring-1 ring-[var(--primary)]' : 'border-[var(--glassBorder)] bg-[var(--glassBg)] text-[var(--color)] hover:border-[var(--primary)] hover:bg-[var(--glassBgHover)]'}`}
        >
          <span>✎</span>
          <span>{t('games.sudoku_v1.controls.notes')}</span>
        </button>
        <button
          type="button"
          onClick={onErase}
          disabled={selected === null}
          title={t('games.sudoku_v1.controls.erase')}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[var(--glassBorder)] bg-[var(--glassBg)] px-3 py-1.5 text-xs sm:text-sm font-bold text-[var(--color)] transition-all hover:border-rose-500/50 hover:bg-rose-500/10 hover:text-rose-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span>⌫</span>
          <span>{t('games.sudoku_v1.controls.erase')}</span>
        </button>
      </div>
    </div>
  );
}
