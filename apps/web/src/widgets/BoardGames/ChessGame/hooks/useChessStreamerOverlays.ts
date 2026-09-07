'use client';

import { useState, useCallback, useMemo } from 'react';
import type { Board, PieceColor } from '../types';
import { getBestMoveArrow, getThreatArrows } from '../lib/threat-arrows';
import type { Arrow } from './useBoardDrawings';

interface UseChessStreamerOverlaysProps {
  board?: Board;
  myColor: PieceColor | null;
  bestMoveUci?: string;
}

export function useChessStreamerOverlays({
  board,
  myColor,
  bestMoveUci,
}: UseChessStreamerOverlaysProps) {
  const [showBestMove, setShowBestMove] = useState(false);
  const [showThreats, setShowThreats] = useState(false);

  const toggleBestMove = useCallback(() => setShowBestMove((v) => !v), []);
  const toggleThreats = useCallback(() => setShowThreats((v) => !v), []);

  const bestMoveArrow: Arrow | null = useMemo(() => {
    return getBestMoveArrow(bestMoveUci);
  }, [bestMoveUci]);

  const threatArrows: Arrow[] = useMemo(() => {
    if (!board) return [];
    return getThreatArrows(board, myColor);
  }, [board, myColor]);

  return {
    showBestMove,
    showThreats,
    toggleBestMove,
    toggleThreats,
    bestMoveArrow,
    threatArrows,
  };
}
