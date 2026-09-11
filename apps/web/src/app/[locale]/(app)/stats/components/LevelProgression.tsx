'use client';

import { useState } from 'react';
import { Card } from '@arcadeum/ui';
import { xpForLevel } from '@/shared/lib/xp-level';

export function LevelProgression({ currentLevel }: { currentLevel: number }) {
  const [expanded, setExpanded] = useState(false);

  const rows = Array.from({ length: 99 }, (_, i) => {
    const level = i + 1;
    const totalXp = xpForLevel(level);
    const gap = level > 1 ? totalXp - xpForLevel(level - 1) : totalXp;
    const isCurrent = level === currentLevel;
    const isPast = level < currentLevel;
    return { level, totalXp, gap, isCurrent, isPast };
  });

  const visibleRows = expanded ? rows : rows.slice(0, 10);

  return (
    <Card variant="glass" padding="md">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between cursor-pointer"
      >
        <span className="text-[14px] font-bold uppercase tracking-wider text-[var(--textSecondary)]">
          Level Progression
        </span>
        <span className="text-[12px] text-[var(--textSecondary)]">
          {expanded ? 'Show less' : 'Show all 99 levels'}
        </span>
      </button>

      <div className="mt-3 overflow-hidden">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="text-[var(--textSecondary)] border-b border-[var(--borderColor)]">
              <th className="text-left py-1.5 font-semibold">Level</th>
              <th className="text-right py-1.5 font-semibold">Total XP</th>
              <th className="text-right py-1.5 font-semibold">XP Needed</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => (
              <tr
                key={row.level}
                className={
                  row.isCurrent
                    ? 'bg-violet-500/10 font-bold text-violet-300'
                    : row.isPast
                      ? 'text-[var(--textSecondary)] opacity-60'
                      : ''
                }
              >
                <td className="py-1">
                  {row.level}
                  {row.isCurrent && (
                    <span className="ml-1.5 text-[10px] text-violet-400">
                      ← you
                    </span>
                  )}
                </td>
                <td className="text-right py-1">
                  {row.totalXp.toLocaleString()}
                </td>
                <td className="text-right py-1">{row.gap.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
