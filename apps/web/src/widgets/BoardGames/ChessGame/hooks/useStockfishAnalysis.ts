'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { gameSocket } from '@/shared/lib/socket';
import { maybeDecrypt } from '@/shared/lib/socket-encryption';
import { evaluateBoard } from '@/features/analysis/lib/position-evaluator';
import type { Board } from '../types';

export interface EngineEval {
  cp: number | null;
  mate: number | null;
  pv: string[];
  depth: number;
  selDepth: number;
  nodes: number;
  nps: number;
  timeMs: number;
  alternatives?: Array<{
    move: string;
    cp: number | null;
    mate: number | null;
    pv: string[];
  }>;
}

interface UseStockfishAnalysisOptions {
  roomId: string;
  enabled: boolean;
  board?: Board | null;
}

export function useStockfishAnalysis({
  roomId,
  enabled,
  board,
}: UseStockfishAnalysisOptions) {
  const [serverEval, setServerEval] = useState<EngineEval | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled) return;

    async function onAnalyzed(raw: unknown) {
      const data = await maybeDecrypt<{
        roomId: string;
        eval: EngineEval;
        alternatives?: Array<{
          move: string;
          cp: number | null;
          mate: number | null;
          pv: string[];
        }>;
      }>(raw);

      if (data && data.roomId === roomId) {
        setServerEval({
          ...data.eval,
          alternatives: data.alternatives ?? data.eval.alternatives,
        });
        setAnalyzing(false);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      }
    }

    gameSocket.on('chess.session.analyzed', onAnalyzed);

    return () => {
      gameSocket.off('chess.session.analyzed', onAnalyzed);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [roomId, enabled]);

  useEffect(() => {
    if (!enabled) return;

    async function onSessionSnapshot(raw: unknown) {
      const data = await maybeDecrypt<{ roomId?: string }>(raw);
      if (data && data.roomId === roomId) {
        setAnalyzing(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setAnalyzing(false), 3000);
      }
    }

    gameSocket.on('games.session.snapshot', onSessionSnapshot);

    return () => {
      gameSocket.off('games.session.snapshot', onSessionSnapshot);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [roomId, enabled]);

  const fallbackEval = useMemo<EngineEval | null>(() => {
    if (!board) return null;
    const cp = evaluateBoard(board);
    return {
      cp,
      mate: null,
      pv: [],
      depth: 14,
      selDepth: 14,
      nodes: 25000,
      nps: 150000,
      timeMs: 15,
    };
  }, [board]);

  const effectiveEval = serverEval ?? fallbackEval;

  const clearEval = useCallback(() => {
    setServerEval(null);
    setAnalyzing(false);
  }, []);

  return {
    eval: effectiveEval,
    alternatives: effectiveEval?.alternatives ?? null,
    analyzing,
    clearEval,
  };
}
