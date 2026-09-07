'use client';

import { useSyncExternalStore, useCallback } from 'react';

export type ChessSoundPack = 'classic' | 'arcade' | 'minimal' | 'off';

export interface SoundPackOption {
  id: ChessSoundPack;
  name: string;
  description: string;
}

export const SOUND_PACK_OPTIONS: SoundPackOption[] = [
  { id: 'classic', name: 'Classic', description: 'Wooden piece sounds' },
  { id: 'arcade', name: 'Arcade', description: 'Retro game sounds' },
  { id: 'minimal', name: 'Minimal', description: 'Subtle clicks only' },
  { id: 'off', name: 'Off', description: 'No sound effects' },
];

const VOLUME_KEY = 'arcadeum_chess_sound_volume';
const PACK_KEY = 'arcadeum_chess_sound_pack';
const VALID_PACKS: ChessSoundPack[] = ['classic', 'arcade', 'minimal', 'off'];

function clampVolume(v: number): number {
  return Math.min(1, Math.max(0, v));
}

function subscribeVolume(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function subscribePack(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getVolumeSnapshot(): number {
  try {
    const raw = localStorage.getItem(VOLUME_KEY);
    if (raw !== null) {
      const parsed = parseFloat(raw);
      if (!isNaN(parsed)) return clampVolume(parsed);
    }
  } catch {}
  return 0.7;
}

function getVolumeServerSnapshot(): number {
  return 0.7;
}

function getPackSnapshot(): ChessSoundPack {
  try {
    const raw = localStorage.getItem(PACK_KEY) as ChessSoundPack | null;
    if (raw && VALID_PACKS.includes(raw)) return raw;
  } catch {}
  return 'classic';
}

function getPackServerSnapshot(): ChessSoundPack {
  return 'classic';
}

export function useSoundPreferences() {
  const volume = useSyncExternalStore(
    subscribeVolume,
    getVolumeSnapshot,
    getVolumeServerSnapshot,
  );

  const soundPack = useSyncExternalStore(
    subscribePack,
    getPackSnapshot,
    getPackServerSnapshot,
  );

  const setVolume = useCallback((value: number) => {
    try {
      localStorage.setItem(VOLUME_KEY, String(clampVolume(value)));
      window.dispatchEvent(new Event('storage'));
    } catch {}
  }, []);

  const setSoundPack = useCallback((pack: ChessSoundPack) => {
    try {
      localStorage.setItem(PACK_KEY, pack);
      window.dispatchEvent(new Event('storage'));
    } catch {}
  }, []);

  return { volume, soundPack, setVolume, setSoundPack };
}
