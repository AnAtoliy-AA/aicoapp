'use client';

import { useCallback } from 'react';
import { useGameSound } from '@/shared/lib/game-sounds';
import type { GameSoundId } from '@/shared/lib/game-sounds';
import type { SoundType } from '../lib/sounds';

const SOUND_MAP: Record<SoundType, GameSoundId> = {
  move: 'chess_move',
  capture: 'chess_capture',
  check: 'chess_check',
  castle: 'chess_castle',
  promotion: 'chess_promotion',
  gameStart: 'chess_game_start',
  gameEnd: 'chess_game_end',
  drawOffer: 'chess_draw_offer',
  notification: 'chess_notification',
  error: 'chess_error',
  illegal: 'chess_error',
};

export function useChessSounds() {
  const { play } = useGameSound('chess_v1');

  const playSound = useCallback(
    (type: SoundType) => {
      const soundId = SOUND_MAP[type];
      if (soundId) {
        play(soundId);
      }
    },
    [play],
  );

  return { playSound };
}
