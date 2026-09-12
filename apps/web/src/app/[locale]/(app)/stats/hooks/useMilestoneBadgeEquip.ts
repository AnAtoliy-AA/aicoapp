'use client';

import { useState, useCallback } from 'react';
import { useSessionTokens } from '@/entities/session/model/useSessionTokens';
import {
  equipItemAction,
  unequipItemAction,
} from '@/features/shop/server/shop.actions';
import { syncEquippedToSession } from '@/features/shop/lib/syncEquippedToSession';

export function useMilestoneBadgeEquip() {
  const { snapshot } = useSessionTokens();
  const [pendingBadgeId, setPendingBadgeId] = useState<string | null>(null);

  const handleEquip = useCallback(async (badgeId: string) => {
    setPendingBadgeId(badgeId);
    try {
      const res = await equipItemAction(badgeId);
      if (res.ok) {
        syncEquippedToSession(res.data);
      }
    } finally {
      setPendingBadgeId(null);
    }
  }, []);

  const handleUnequip = useCallback(async () => {
    setPendingBadgeId('unequip');
    try {
      const res = await unequipItemAction('badge');
      if (res.ok) {
        syncEquippedToSession(res.data);
      }
    } finally {
      setPendingBadgeId(null);
    }
  }, []);

  return {
    equippedBadgeId: snapshot.equippedBadgeId,
    pendingBadgeId,
    handleEquip,
    handleUnequip,
    isLoggedIn: !!snapshot.accessToken,
  };
}
