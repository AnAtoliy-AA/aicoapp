'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import type { ChessClientState } from '../types';
import { generateMoveList, generatePGN } from '../lib/pgn';

interface MoveListProps {
  state: ChessClientState;
  t: (
    key: import('@/shared/lib/useTranslation').TranslationKey,
    params?: Record<string, string | number>,
  ) => string;
  onMoveHover?: (moveIndex: number | null) => void;
  onSelectMove?: (moveIndex: number) => void;
  selectedMoveIndex?: number | null;
}

export function MoveList({
  state,
  t: _t,
  onMoveHover,
  onSelectMove,
  selectedMoveIndex,
}: MoveListProps) {
  const [copied, setCopied] = useState(false);
  const [hoveredMove, setHoveredMove] = useState<number | null>(null);
  const activeRowRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const pairs = useMemo(() => {
    const moves = generateMoveList(state);
    const result: {
      white: string;
      black: string;
      num: number;
      whiteIdx: number;
      blackIdx: number;
    }[] = [];
    for (let i = 0; i < moves.length; i += 2) {
      result.push({
        num: Math.floor(i / 2) + 1,
        white: moves[i] ?? '',
        black: moves[i + 1] ?? '',
        whiteIdx: i,
        blackIdx: i + 1,
      });
    }
    return result;
  }, [state]);

  const totalMoves = state.moveHistory.length;

  useEffect(() => {
    if (activeRowRef.current) {
      activeRowRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    } else if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [selectedMoveIndex, totalMoves]);

  const handleCopyPGN = useCallback(() => {
    const pgn = generatePGN(state);
    navigator.clipboard.writeText(pgn).then(() => {
      setCopied(true);
      requestAnimationFrame(() => {
        const timer = window.setTimeout(() => setCopied(false), 2000);
        return () => window.clearTimeout(timer);
      });
    });
  }, [state]);

  const handleStep = useCallback(
    (target: 'first' | 'prev' | 'next' | 'last') => {
      if (totalMoves === 0) return;
      const current = selectedMoveIndex ?? totalMoves - 1;
      let nextIndex = current;
      if (target === 'first') nextIndex = 0;
      else if (target === 'prev') nextIndex = Math.max(0, current - 1);
      else if (target === 'next')
        nextIndex = Math.min(totalMoves - 1, current + 1);
      else if (target === 'last') nextIndex = totalMoves - 1;

      onSelectMove?.(nextIndex);
      onMoveHover?.(nextIndex);
    },
    [totalMoves, selectedMoveIndex, onSelectMove, onMoveHover],
  );

  return (
    <div className="flex flex-col gap-1.5 flex-1 min-h-0">
      <div className="flex justify-between items-center px-1 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-[var(--textSecondary)] font-bold uppercase tracking-wider">
            Moves
          </span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/5 text-[var(--textSecondary)] font-mono">
            {totalMoves}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopyPGN}
          className={`text-[11px] bg-transparent border-0 cursor-pointer p-0 transition-colors font-medium ${
            copied
              ? 'text-emerald-400 font-semibold'
              : 'text-[var(--textSecondary)] hover:text-[var(--color)]'
          }`}
        >
          {copied ? 'Copied!' : 'Copy PGN'}
        </button>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex-1 min-h-[60px] sm:min-h-[120px] max-h-[220px] overflow-y-auto modern-scrollbar p-1.5 rounded-xl bg-black/25 border border-white/5 font-mono select-none"
      >
        {pairs.length === 0 && (
          <div className="text-xs text-[var(--textSecondary)] text-center py-6">
            No moves yet
          </div>
        )}
        {pairs.map((pair) => {
          const isWhiteActive =
            selectedMoveIndex === pair.whiteIdx ||
            hoveredMove === pair.whiteIdx;
          const isBlackActive =
            selectedMoveIndex === pair.blackIdx ||
            hoveredMove === pair.blackIdx;
          const isActivePair = isWhiteActive || isBlackActive;

          return (
            <div
              key={pair.num}
              ref={isActivePair ? activeRowRef : undefined}
              className={`flex items-center py-0.5 px-1 rounded transition-colors text-xs ${
                isActivePair ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
            >
              <span className="w-7 text-[11px] text-[var(--textSecondary)] opacity-60 text-right pr-2 select-none">
                {pair.num}.
              </span>
              <button
                type="button"
                className={`flex-1 text-left px-2 py-0.5 rounded cursor-pointer transition-colors ${
                  isWhiteActive
                    ? 'bg-amber-500/25 text-amber-300 font-bold shadow-sm'
                    : 'text-[var(--color)] hover:bg-white/10'
                }`}
                onMouseEnter={() => {
                  setHoveredMove(pair.whiteIdx);
                  onMoveHover?.(pair.whiteIdx);
                }}
                onMouseLeave={() => {
                  setHoveredMove(null);
                  onMoveHover?.(null);
                }}
                onClick={() => onSelectMove?.(pair.whiteIdx)}
              >
                {pair.white}
              </button>
              <button
                type="button"
                className={`flex-1 text-left px-2 py-0.5 rounded cursor-pointer transition-colors ${
                  isBlackActive
                    ? 'bg-amber-500/25 text-amber-300 font-bold shadow-sm'
                    : 'text-[var(--textSecondary)] hover:text-[var(--color)] hover:bg-white/10'
                }`}
                onMouseEnter={() => {
                  setHoveredMove(pair.blackIdx);
                  onMoveHover?.(pair.blackIdx);
                }}
                onMouseLeave={() => {
                  setHoveredMove(null);
                  onMoveHover?.(null);
                }}
                onClick={() => onSelectMove?.(pair.blackIdx)}
              >
                {pair.black}
              </button>
            </div>
          );
        })}
      </div>

      {totalMoves > 0 && (
        <div className="flex items-center justify-center gap-1.5 p-1 bg-black/20 rounded-xl border border-white/5 shrink-0">
          <button
            type="button"
            title="First Move"
            aria-label="First Move"
            onClick={() => handleStep('first')}
            className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-white/5 hover:bg-white/15 text-[var(--textSecondary)] hover:text-white transition-colors cursor-pointer"
          >
            |&lt;
          </button>
          <button
            type="button"
            title="Previous Move"
            aria-label="Previous Move"
            onClick={() => handleStep('prev')}
            className="px-3 py-1 text-xs font-mono font-bold rounded-lg bg-white/5 hover:bg-white/15 text-[var(--textSecondary)] hover:text-white transition-colors cursor-pointer"
          >
            &lt;
          </button>
          <button
            type="button"
            title="Next Move"
            aria-label="Next Move"
            onClick={() => handleStep('next')}
            className="px-3 py-1 text-xs font-mono font-bold rounded-lg bg-white/5 hover:bg-white/15 text-[var(--textSecondary)] hover:text-white transition-colors cursor-pointer"
          >
            &gt;
          </button>
          <button
            type="button"
            title="Latest Move"
            aria-label="Latest Move"
            onClick={() => handleStep('last')}
            className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-white/5 hover:bg-white/15 text-[var(--textSecondary)] hover:text-white transition-colors cursor-pointer"
          >
            &gt;|
          </button>
        </div>
      )}
    </div>
  );
}
