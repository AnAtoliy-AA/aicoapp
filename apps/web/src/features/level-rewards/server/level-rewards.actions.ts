'use server';

import { revalidatePath } from 'next/cache';
import { serverAuthFetch } from '@/shared/lib/server-auth-fetch';

export interface LevelRewardsStatusResult {
  currentLevel: number;
  claimedLevel: number;
  unclaimedLevels: number[];
  pendingCoins: number;
  pendingBadges: string[];
}

export interface ClaimLevelRewardsResult {
  currentLevel: number;
  claimedLevel: number;
  coinsAwarded: number;
  badgesAwarded: string[];
  alreadyClaimed: boolean;
}

export type LevelActionResult<T> =
  { ok: true; data: T } | { ok: false; error: string };

export async function getLevelRewardsStatusAction(): Promise<
  LevelActionResult<LevelRewardsStatusResult>
> {
  const res = await serverAuthFetch('/xp/level-rewards');
  if (!res.ok) {
    return { ok: false, error: 'Failed to fetch level rewards status' };
  }
  const data = (await res.json()) as LevelRewardsStatusResult;
  return { ok: true, data };
}

export async function claimLevelRewardsAction(): Promise<
  LevelActionResult<ClaimLevelRewardsResult>
> {
  const res = await serverAuthFetch('/xp/level-rewards/claim', {
    method: 'POST',
  });
  if (!res.ok) {
    return { ok: false, error: 'Failed to claim level rewards' };
  }
  const data = (await res.json()) as ClaimLevelRewardsResult;
  revalidatePath('/stats');
  revalidatePath('/', 'layout');
  return { ok: true, data };
}
