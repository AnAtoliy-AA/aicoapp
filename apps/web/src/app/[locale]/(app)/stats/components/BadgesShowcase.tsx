'use client';

import React from 'react';
import Image from 'next/image';
import { Card, Button } from '@arcadeum/ui';
import { LEVEL_BADGE_REWARDS } from '@/shared/lib/level-rewards';
import {
  useTranslation,
  type TranslationKey,
} from '@/shared/lib/useTranslation';
import { useMilestoneBadgeEquip } from '../hooks/useMilestoneBadgeEquip';

interface BadgesShowcaseProps {
  currentLevel: number;
}

export function BadgesShowcase({ currentLevel }: BadgesShowcaseProps) {
  const { t } = useTranslation();
  const {
    equippedBadgeId,
    pendingBadgeId,
    handleEquip,
    handleUnequip,
    isLoggedIn,
  } = useMilestoneBadgeEquip();

  return (
    <Card variant="glass" padding="md" className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h3 className="text-[16px] font-bold tracking-tight text-[var(--color)]">
            {t('stats.milestoneBadges' as TranslationKey)}
          </h3>
          <span className="text-[12px] font-medium text-[var(--textSecondary)]">
            {LEVEL_BADGE_REWARDS.filter((r) => currentLevel >= r.level).length}{' '}
            / {LEVEL_BADGE_REWARDS.length}{' '}
            {t('stats.unlocked' as TranslationKey)}
          </span>
        </div>
        <p className="text-[13px] text-[var(--textSecondary)] leading-relaxed">
          {t('stats.milestoneBadgesSubtitle' as TranslationKey)}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {LEVEL_BADGE_REWARDS.map((reward) => {
          const isUnlocked = currentLevel >= reward.level;
          const isEquipped = equippedBadgeId === reward.badgeId;
          const isPending =
            pendingBadgeId === reward.badgeId ||
            (isEquipped && pendingBadgeId === 'unequip');

          return (
            <div
              key={reward.badgeId}
              data-testid={`milestone-badge-card-${reward.level}`}
              className={`group relative flex flex-col items-center justify-between rounded-xl border p-3 text-center transition-all ${
                isEquipped
                  ? 'border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                  : isUnlocked
                    ? 'border-[var(--borderColor)] bg-[var(--surfaceSecondary)] hover:border-[var(--primary)]/50 hover:bg-[var(--surfaceHover)]'
                    : 'border-[var(--borderColor)]/40 bg-[var(--surfaceTertiary)]/20 opacity-55'
              }`}
            >
              <div className="absolute top-2 left-2 rounded-md bg-[var(--background)]/80 px-1.5 py-0.5 text-[10px] font-bold text-[var(--textSecondary)] border border-[var(--borderColor)]/40">
                Lv. {reward.level}
              </div>

              {isEquipped && (
                <div className="absolute top-2 right-2 rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400 border border-emerald-500/30">
                  ✓
                </div>
              )}

              <div className="mt-4 mb-2 flex h-[72px] w-[72px] items-center justify-center">
                <Image
                  src={reward.assetUrl}
                  alt={reward.badgeId}
                  width={64}
                  height={64}
                  className={`object-contain transition-transform duration-200 group-hover:scale-105 ${
                    !isUnlocked ? 'grayscale brightness-75 contrast-75' : ''
                  }`}
                />
              </div>

              <div className="flex flex-col items-center gap-0.5 mb-3 w-full min-h-[40px]">
                <span className="text-[12px] font-bold text-[var(--color)] line-clamp-1">
                  {t(`pages.shop.${reward.nameKey}` as TranslationKey)}
                </span>
                <span className="text-[10px] text-[var(--textSecondary)] line-clamp-1">
                  {t(`pages.shop.${reward.descKey}` as TranslationKey)}
                </span>
              </div>

              <div className="w-full mt-auto">
                {isUnlocked ? (
                  isEquipped ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      fullWidth
                      disabled={isPending || !isLoggedIn}
                      onClick={handleUnequip}
                      data-testid={`badge-action-${reward.level}`}
                      className="text-emerald-300 border-emerald-500/30 bg-emerald-500/20 hover:bg-emerald-500/30 text-[11px] py-1"
                    >
                      {isPending
                        ? '...'
                        : t('stats.equipped' as TranslationKey)}
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      fullWidth
                      disabled={isPending || !isLoggedIn}
                      onClick={() => handleEquip(reward.badgeId)}
                      data-testid={`badge-action-${reward.level}`}
                      className="text-[11px] py-1"
                    >
                      {isPending ? '...' : t('stats.equip' as TranslationKey)}
                    </Button>
                  )
                ) : (
                  <div
                    data-testid={`badge-locked-${reward.level}`}
                    className="flex items-center justify-center py-1 px-2 rounded-md bg-[var(--surfaceTertiary)]/50 text-[10px] font-medium text-[var(--textSecondary)]"
                  >
                    🔒{' '}
                    {t('stats.lockedLevel' as TranslationKey, {
                      level: String(reward.level),
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
