'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useSoundSetting } from '@/shared/hooks/useSoundSetting';
import { gameSounds } from './GameSoundManager';
import { GAME_SOUND_TYPES } from './gameSoundRegistry';
import type { GameSoundId } from './gameSoundTypes';

export type { GameSoundId };

export interface GameSoundPlayer {
  play: (id: GameSoundId) => void;
}

export function useGameSound(gameId: string): GameSoundPlayer {
  const { soundEnabled } = useSoundSetting();
  const enabledRef = useRef(soundEnabled);

  useEffect(() => {
    enabledRef.current = soundEnabled;
    gameSounds.setMuted(!soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    gameSounds.init();
  }, []);

  // Preload this game's sounds on mount
  useEffect(() => {
    const sounds = GAME_SOUND_TYPES[gameId];
    if (sounds) {
      gameSounds.preload(gameId, sounds);
    }
  }, [gameId]);

  const play = useCallback((id: GameSoundId) => {
    if (!enabledRef.current) return;
    gameSounds.play(id);
  }, []);

  return useMemo(() => ({ play }), [play]);
}
