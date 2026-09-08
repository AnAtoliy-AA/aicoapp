'use client';

import { useEffect, useRef } from 'react';
import type { ChessClientState } from '../types';
import type { SoundType } from '../lib/sounds';

interface UseChessGameSoundsProps {
  displaySnapshot: ChessClientState | null;
  isGameOver: boolean;
  playSound: (type: SoundType) => void;
}

export function useChessGameSounds({
  displaySnapshot,
  isGameOver,
  playSound,
}: UseChessGameSoundsProps) {
  const prevMoveCountRef = useRef<number>(0);
  const prevGameOverRef = useRef<boolean>(false);
  const hasInitializedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!displaySnapshot) return;
    const count = displaySnapshot.moveHistory.length;

    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      prevMoveCountRef.current = count;
      return;
    }

    if (count > prevMoveCountRef.current && count > 0) {
      const last = displaySnapshot.moveHistory[count - 1];
      if (displaySnapshot.isCheck) {
        playSound('check');
      } else if (last?.isCastle) {
        playSound('castle');
      } else if (last?.captured) {
        playSound('capture');
      } else {
        playSound('move');
      }
    }
    prevMoveCountRef.current = count;
  }, [
    displaySnapshot?.moveHistory.length,
    displaySnapshot?.isCheck,
    playSound,
    displaySnapshot,
  ]);

  useEffect(() => {
    if (isGameOver && !prevGameOverRef.current) {
      playSound('gameEnd');
    }
    prevGameOverRef.current = isGameOver;
  }, [isGameOver, playSound]);
}
