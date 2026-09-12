'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Card } from '@arcadeum/ui';
import { xpForLevel } from '@/shared/lib/xp-level';
import {
  getRewardForLevel,
  getCoinsForLevel,
  type LevelBadgeReward,
} from '@/shared/lib/level-rewards';
import {
  useTranslation,
  type TranslationKey,
} from '@/shared/lib/useTranslation';
import { useMilestoneBadgeEquip } from '../hooks/useMilestoneBadgeEquip';

interface LevelRewardCellProps {
  reward: LevelBadgeReward;
  level: number;
  isUnlocked: boolean;
  isLoggedIn: boolean;
  equippedBadgeId?: string | null;
  pendingBadgeId: string | null;
  handleEquip: (badgeId: string) => Promise<void>;
  handleUnequip: () => Promise<void>;
}

function LevelRewardCell({
  reward,
  level,
  isUnlocked,
  isLoggedIn,
  equippedBadgeId,
  pendingBadgeId,
  handleEquip,
  handleUnequip,
}: LevelRewardCellProps) {
  const { t } = useTranslation();
  const isEquipped = equippedBadgeId === reward.badgeId;

  return (
    <div
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-[var(--borderColor)] bg-[var(--surfaceSecondary)]"
      data-testid={`level-reward-${level}`}
    >
      <Image
        src={reward.assetUrl}
        alt={reward.badgeId}
        width={18}
        height={18}
        className="object-contain"
      />
      <span className="text-[11px] font-medium text-[var(--color)]">
        {t(`pages.shop.${reward.nameKey}` as TranslationKey)}
      </span>
      {isUnlocked ? (
        <>
          <span className="text-[9px] px-1 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
            {t('stats.unlocked' as TranslationKey)}
          </span>
          {isLoggedIn &&
            (isEquipped ? (
              <button
                type="button"
                disabled={pendingBadgeId === 'unequip'}
                onClick={handleUnequip}
                data-testid={`level-equip-btn-${level}`}
                className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-200 font-semibold hover:bg-emerald-500/40 cursor-pointer transition-colors"
              >
                {pendingBadgeId === 'unequip'
                  ? '...'
                  : `✓ ${t('stats.equipped' as TranslationKey)}`}
              </button>
            ) : (
              <button
                type="button"
                disabled={pendingBadgeId === reward.badgeId}
                onClick={() => handleEquip(reward.badgeId)}
                data-testid={`level-equip-btn-${level}`}
                className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--primary)] text-white font-semibold hover:opacity-90 cursor-pointer transition-opacity"
              >
                {pendingBadgeId === reward.badgeId
                  ? '...'
                  : t('stats.equip' as TranslationKey)}
              </button>
            ))}
        </>
      ) : (
        <span className="text-[9px] px-1 rounded bg-[var(--surfaceTertiary)] text-[var(--textSecondary)]">
          {t('stats.locked' as TranslationKey)}
        </span>
      )}
    </div>
  );
}

export function LevelProgression({ currentLevel }: { currentLevel: number }) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const {
    equippedBadgeId,
    pendingBadgeId,
    handleEquip,
    handleUnequip,
    isLoggedIn,
  } = useMilestoneBadgeEquip();

  const rows = Array.from({ length: 99 }, (_, i) => {
    const level = i + 1;
    const totalXp = xpForLevel(level);
    const gap = level > 1 ? totalXp - xpForLevel(level - 1) : totalXp;
    const isCurrent = level === currentLevel;
    const isPast = level < currentLevel;
    const reward = getRewardForLevel(level);
    const coinAmount = getCoinsForLevel(level);
    return { level, totalXp, gap, isCurrent, isPast, reward, coinAmount };
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
          {t('stats.levelProgression' as TranslationKey)}
        </span>
        <span className="text-[12px] text-[var(--textSecondary)]">
          {expanded
            ? t('stats.levelProgressionShowLess' as TranslationKey)
            : t('stats.levelProgressionShowAll' as TranslationKey)}
        </span>
      </button>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="text-[var(--textSecondary)] border-b border-[var(--borderColor)]">
              <th className="text-left py-1.5 font-semibold">
                {t('stats.level' as TranslationKey)}
              </th>
              <th className="text-right py-1.5 font-semibold">
                {t('stats.totalXP' as TranslationKey)}
              </th>
              <th className="text-right py-1.5 font-semibold">
                {t('stats.xpNeeded' as TranslationKey)}
              </th>
              <th className="text-right py-1.5 font-semibold">
                {t('stats.coins' as TranslationKey)}
              </th>
              <th className="text-left py-1.5 pl-4 font-semibold">
                {t('stats.reward' as TranslationKey)}
              </th>
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
                      ? 'text-[var(--textSecondary)] opacity-70'
                      : ''
                }
              >
                <td className="py-1">
                  {row.level}
                  {row.isCurrent && (
                    <span className="ml-1.5 text-[10px] text-violet-400">
                      ← {t('stats.youBadge' as TranslationKey)}
                    </span>
                  )}
                </td>
                <td className="text-right py-1">
                  {row.totalXp.toLocaleString()}
                </td>
                <td className="text-right py-1">{row.gap.toLocaleString()}</td>
                <td
                  className="text-right py-1 font-semibold text-amber-400"
                  data-testid={`level-coins-${row.level}`}
                >
                  +{row.coinAmount.toLocaleString()} 🪙
                </td>
                <td className="py-1 pl-4">
                  {row.reward ? (
                    <LevelRewardCell
                      reward={row.reward}
                      level={row.level}
                      isUnlocked={row.isPast || row.isCurrent}
                      isLoggedIn={isLoggedIn}
                      equippedBadgeId={equippedBadgeId}
                      pendingBadgeId={pendingBadgeId}
                      handleEquip={handleEquip}
                      handleUnequip={handleUnequip}
                    />
                  ) : (
                    <span className="text-[var(--textTertiary)] opacity-30">
                      —
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
