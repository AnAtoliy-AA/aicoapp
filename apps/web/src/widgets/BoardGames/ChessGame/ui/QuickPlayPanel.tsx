'use client';

import { memo } from 'react';
import { cx } from '@arcadeum/ui/utils/cx';
import type { TimeControl } from '../types';

interface QuickPlayCard {
  label: string;
  category: string;
  categoryColor: string;
  timeControl: TimeControl;
}

const QUICK_PLAY_CARDS: QuickPlayCard[] = [
  {
    label: '1+0',
    category: 'Bullet',
    categoryColor: 'text-red-400 bg-red-500/15 border-red-500/30',
    timeControl: { type: 'bullet', initialSeconds: 60, incrementSeconds: 0 },
  },
  {
    label: '3+0',
    category: 'Blitz',
    categoryColor: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
    timeControl: { type: 'blitz', initialSeconds: 180, incrementSeconds: 0 },
  },
  {
    label: '3+2',
    category: 'Blitz',
    categoryColor: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
    timeControl: { type: 'blitz', initialSeconds: 180, incrementSeconds: 3 },
  },
  {
    label: '5+0',
    category: 'Blitz',
    categoryColor: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
    timeControl: { type: 'blitz', initialSeconds: 300, incrementSeconds: 0 },
  },
  {
    label: '10+0',
    category: 'Rapid',
    categoryColor: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
    timeControl: { type: 'rapid', initialSeconds: 600, incrementSeconds: 0 },
  },
  {
    label: '15+10',
    category: 'Classical',
    categoryColor: 'text-blue-400 bg-blue-500/15 border-blue-500/30',
    timeControl: {
      type: 'classical',
      initialSeconds: 900,
      incrementSeconds: 10,
    },
  },
];

interface QuickPlayPanelProps {
  onSelectTimeControl: (tc: TimeControl) => void;
  disabled?: boolean;
}

function QuickPlayPanelImpl({
  onSelectTimeControl,
  disabled = false,
}: QuickPlayPanelProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-bold text-[var(--textSecondary)] uppercase tracking-wider">
          Quick Play
        </span>
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-[var(--textSecondary)] border border-white/10">
          Casual
        </span>
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        {QUICK_PLAY_CARDS.map((card) => (
          <button
            key={card.label}
            type="button"
            id={`quick-play-${card.label.replace('+', 'plus')}`}
            disabled={disabled}
            onClick={() => onSelectTimeControl(card.timeControl)}
            className={cx(
              'flex flex-col items-center gap-1 p-2.5 rounded-xl border transition-all cursor-pointer group',
              'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-105',
              'active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100',
            )}
          >
            <span className="text-base font-extrabold font-mono text-white leading-none">
              {card.label}
            </span>
            <span
              className={cx(
                'text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wide',
                card.categoryColor,
              )}
            >
              {card.category}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export const QuickPlayPanel = memo(QuickPlayPanelImpl);
