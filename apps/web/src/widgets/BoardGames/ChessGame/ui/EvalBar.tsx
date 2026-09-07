'use client';

import { useMemo } from 'react';

interface EvalBarProps {
  evalScore: number | null;
  mateScore?: number | null;
  isFlipped?: boolean;
  orientation?: 'vertical' | 'horizontal';
}

export function EvalBar({
  evalScore,
  mateScore,
  isFlipped = false,
  orientation = 'vertical',
}: EvalBarProps) {
  const isWhiteWinning = useMemo(() => {
    if (mateScore != null) return mateScore > 0;
    return (evalScore ?? 0) >= 0;
  }, [evalScore, mateScore]);

  const bottomHeight = useMemo(() => {
    if (mateScore != null) {
      const whiteWins = mateScore > 0;
      if (!isFlipped) {
        return whiteWins ? 98 : 2;
      }
      return whiteWins ? 2 : 98;
    }
    if (evalScore == null) return 50;
    const clamped = Math.max(-600, Math.min(600, evalScore));
    const whiteShare = 50 + (clamped / 600) * 45;
    return isFlipped ? 100 - whiteShare : whiteShare;
  }, [evalScore, mateScore, isFlipped]);

  const evalLabel = useMemo(() => {
    if (mateScore != null) return `M${Math.abs(mateScore)}`;
    if (evalScore == null) return '0.0';
    const pawns = (Math.abs(evalScore) / 100).toFixed(1);
    return evalScore > 0 ? `+${pawns}` : evalScore < 0 ? `-${pawns}` : '0.0';
  }, [evalScore, mateScore]);

  const clampedHeight = Math.max(2, Math.min(98, Math.round(bottomHeight)));
  const badgePosition = Math.max(12, Math.min(88, clampedHeight));

  if (orientation === 'horizontal') {
    return (
      <div
        className="w-full flex items-center gap-2 select-none px-1 py-0.5"
        title={`Evaluation: ${evalLabel}`}
        aria-label={`Evaluation: ${evalLabel}`}
      >
        <span
          className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded-md text-[11px] font-black font-mono leading-none tracking-tight tabular-nums shadow-sm border shrink-0 whitespace-nowrap ${
            isWhiteWinning
              ? 'bg-white text-zinc-950 border-black/20 shadow-black/25'
              : 'bg-zinc-950 text-white border-white/30 shadow-black/50'
          }`}
        >
          {evalLabel}
        </span>

        <div
          className={`relative flex-1 h-2 rounded-full overflow-hidden border border-[var(--glassBorder)] shadow-inner transition-all duration-300 ${
            isFlipped ? 'bg-slate-100' : 'bg-zinc-800'
          }`}
        >
          <div
            className={`h-full transition-all duration-500 ease-out rounded-full ${
              isFlipped ? 'bg-zinc-800' : 'bg-slate-100'
            }`}
            style={{ width: `${clampedHeight}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative h-full flex items-center select-none py-0.5 overflow-visible"
      title={`Evaluation: ${evalLabel}`}
      aria-label={`Evaluation: ${evalLabel}`}
    >
      <div className="relative h-full w-10 sm:w-11 shrink-0 overflow-visible">
        <div
          className="absolute right-1 -translate-y-1/2 transition-all duration-500 ease-out pointer-events-none z-20"
          style={{ bottom: `${badgePosition}%` }}
        >
          <span
            className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded-md text-[11px] sm:text-[13px] font-black font-mono leading-none tracking-tight tabular-nums shadow-md border whitespace-nowrap ${
              isWhiteWinning
                ? 'bg-white text-zinc-950 border-black/20 shadow-black/25'
                : 'bg-zinc-950 text-white border-white/30 shadow-black/50'
            }`}
          >
            {evalLabel}
          </span>
        </div>
      </div>

      <div
        className={`relative h-full w-2.5 sm:w-3 shrink-0 flex flex-col justify-end overflow-hidden rounded-full border border-[var(--glassBorder)] shadow-md transition-all duration-300 ${
          isFlipped ? 'bg-slate-100' : 'bg-zinc-800'
        }`}
      >
        <div
          className={`w-full transition-all duration-500 ease-out rounded-full ${
            isFlipped ? 'bg-zinc-800' : 'bg-slate-100'
          }`}
          style={{ height: `${clampedHeight}%` }}
        />
      </div>
    </div>
  );
}
