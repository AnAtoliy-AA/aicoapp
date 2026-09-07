'use client';

import { memo } from 'react';
import { cx } from '@arcadeum/ui/utils/cx';
import type { MoveQuality } from '@/features/analysis/lib/analyzeGame';

interface PlayerAccuracy {
  accuracy: number;
  brilliant: number;
  great: number;
  good: number;
  inaccuracies: number;
  mistakes: number;
  blunders: number;
}

interface MoveAccuracySummaryProps {
  white: PlayerAccuracy;
  black: PlayerAccuracy;
  myColor?: 'white' | 'black' | null;
}

const QUALITY_CONFIG: Record<
  MoveQuality,
  { label: string; color: string; symbol: string }
> = {
  brilliant: { label: 'Brilliant', color: 'text-cyan-400', symbol: '✦' },
  great: { label: 'Great', color: 'text-purple-400', symbol: '!' },
  good: { label: 'Good', color: 'text-emerald-400', symbol: '✓' },
  inaccuracy: { label: 'Inaccuracy', color: 'text-amber-400', symbol: '?!' },
  mistake: { label: 'Mistake', color: 'text-orange-400', symbol: '?' },
  blunder: { label: 'Blunder', color: 'text-red-400', symbol: '??' },
};

function getAccuracyColor(accuracy: number): string {
  if (accuracy >= 90) return 'text-emerald-400';
  if (accuracy >= 75) return 'text-blue-400';
  if (accuracy >= 60) return 'text-amber-400';
  return 'text-red-400';
}

function AccuracyColumn({
  label,
  data,
  isMe,
}: {
  label: string;
  data: PlayerAccuracy;
  isMe: boolean;
}) {
  return (
    <div
      className={cx(
        'flex flex-col gap-1 flex-1 p-2 rounded-xl border transition-all',
        isMe
          ? 'bg-amber-500/10 border-amber-500/30'
          : 'bg-white/5 border-white/10',
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--textSecondary)]">
          {label}
        </span>
        <span
          className={cx(
            'text-sm font-extrabold font-mono',
            getAccuracyColor(data.accuracy),
          )}
        >
          {data.accuracy.toFixed(1)}%
        </span>
      </div>

      <div className="flex flex-col gap-0.5 mt-0.5">
        {data.brilliant > 0 && (
          <div className="flex items-center justify-between text-[10px]">
            <span className={cx('font-bold', QUALITY_CONFIG.brilliant.color)}>
              {QUALITY_CONFIG.brilliant.symbol} Brilliant
            </span>
            <span className="font-mono text-[var(--textSecondary)]">
              {data.brilliant}
            </span>
          </div>
        )}
        {data.great > 0 && (
          <div className="flex items-center justify-between text-[10px]">
            <span className={cx('font-bold', QUALITY_CONFIG.great.color)}>
              {QUALITY_CONFIG.great.symbol} Great
            </span>
            <span className="font-mono text-[var(--textSecondary)]">
              {data.great}
            </span>
          </div>
        )}
        {data.inaccuracies > 0 && (
          <div className="flex items-center justify-between text-[10px]">
            <span className={cx('font-bold', QUALITY_CONFIG.inaccuracy.color)}>
              {QUALITY_CONFIG.inaccuracy.symbol} Inaccuracy
            </span>
            <span className="font-mono text-[var(--textSecondary)]">
              {data.inaccuracies}
            </span>
          </div>
        )}
        {data.mistakes > 0 && (
          <div className="flex items-center justify-between text-[10px]">
            <span className={cx('font-bold', QUALITY_CONFIG.mistake.color)}>
              {QUALITY_CONFIG.mistake.symbol} Mistake
            </span>
            <span className="font-mono text-[var(--textSecondary)]">
              {data.mistakes}
            </span>
          </div>
        )}
        {data.blunders > 0 && (
          <div className="flex items-center justify-between text-[10px]">
            <span className={cx('font-bold', QUALITY_CONFIG.blunder.color)}>
              {QUALITY_CONFIG.blunder.symbol} Blunder
            </span>
            <span className="font-mono text-[var(--textSecondary)]">
              {data.blunders}
            </span>
          </div>
        )}
        {data.blunders === 0 &&
          data.mistakes === 0 &&
          data.inaccuracies === 0 && (
            <div className="text-[10px] text-emerald-400 font-medium">
              Clean game!
            </div>
          )}
      </div>
    </div>
  );
}

function MoveAccuracySummaryImpl({
  white,
  black,
  myColor,
}: MoveAccuracySummaryProps) {
  return (
    <div className="flex flex-col gap-1.5 shrink-0 p-2 rounded-xl bg-black/25 border border-white/8">
      <span className="text-[10px] font-bold text-[var(--textSecondary)] uppercase tracking-wider px-0.5">
        Game Accuracy
      </span>
      <div className="flex gap-2">
        <AccuracyColumn label="White" data={white} isMe={myColor === 'white'} />
        <AccuracyColumn label="Black" data={black} isMe={myColor === 'black'} />
      </div>
    </div>
  );
}

export const MoveAccuracySummary = memo(MoveAccuracySummaryImpl);

export function computePlayerAccuracy(
  moves: import('@/features/analysis/lib/analyzeGame').AnalyzedMove[],
  color: 'white' | 'black',
): PlayerAccuracy {
  const playerMoves = moves.filter((m) => m.color === color);
  if (playerMoves.length === 0) {
    return {
      accuracy: 100,
      brilliant: 0,
      great: 0,
      good: 0,
      inaccuracies: 0,
      mistakes: 0,
      blunders: 0,
    };
  }

  const totalLoss = playerMoves.reduce((sum, m) => sum + m.loss, 0);
  const maxPossibleLoss = playerMoves.length * 300;
  const accuracy = Math.max(0, 100 - (totalLoss / maxPossibleLoss) * 100);

  return {
    accuracy,
    brilliant: playerMoves.filter((m) => m.quality === 'brilliant').length,
    great: playerMoves.filter((m) => m.quality === 'great').length,
    good: playerMoves.filter((m) => m.quality === 'good').length,
    inaccuracies: playerMoves.filter((m) => m.quality === 'inaccuracy').length,
    mistakes: playerMoves.filter((m) => m.quality === 'mistake').length,
    blunders: playerMoves.filter((m) => m.quality === 'blunder').length,
  };
}
