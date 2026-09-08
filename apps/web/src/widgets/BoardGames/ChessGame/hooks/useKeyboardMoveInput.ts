'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type { File, Rank, LegalMove } from '../types';
import { FILES } from '../types';

export interface KeyboardMoveInputState {
  active: boolean;
  inputValue: string;
  error: string | null;
}

export interface UseKeyboardMoveInputOptions {
  enabled: boolean;
  legalMoves: LegalMove[];
  onMove: (fromFile: File, fromRank: Rank, toFile: File, toRank: Rank) => void;
}

export interface UseKeyboardMoveInputResult {
  state: KeyboardMoveInputState;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  onDismiss: () => void;
}

function parseSquare(sq: string): { file: File; rank: Rank } | null {
  if (sq.length < 2) return null;
  const file = sq[0]?.toLowerCase() as File;
  const rankNum = parseInt(sq[1] ?? '', 10) as Rank;
  if (!FILES.includes(file)) return null;
  if (isNaN(rankNum) || rankNum < 1 || rankNum > 8) return null;
  return { file, rank: rankNum as Rank };
}

function parseInput(
  input: string,
): { from: { file: File; rank: Rank }; to: { file: File; rank: Rank } } | null {
  const normalized = input
    .trim()
    .toLowerCase()
    .replace(/[^a-h1-8]/g, '');
  if (normalized.length < 4) return null;
  const from = parseSquare(normalized.slice(0, 2));
  const to = parseSquare(normalized.slice(2, 4));
  if (!from || !to) return null;
  return { from, to };
}

export function useKeyboardMoveInput({
  enabled,
  legalMoves,
  onMove,
}: UseKeyboardMoveInputOptions): UseKeyboardMoveInputResult {
  const [active, setActive] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        setActive(true);
        setInputValue('');
        setError(null);
      }
      if (e.key === 'Escape' && active) {
        setActive(false);
        setInputValue('');
        setError(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, active]);

  useEffect(() => {
    if (active) {
      inputRef.current?.focus();
    }
  }, [active]);

  const onInputChange = useCallback((value: string) => {
    setInputValue(value);
    setError(null);
  }, []);

  const onSubmit = useCallback(() => {
    const parsed = parseInput(inputValue);
    if (!parsed) {
      setError('Enter a move like e2e4 or d1h5');
      return;
    }
    const isLegal = legalMoves.some(
      (m) =>
        m.from.file === parsed.from.file &&
        m.from.rank === parsed.from.rank &&
        m.to.file === parsed.to.file &&
        m.to.rank === parsed.to.rank,
    );
    if (!isLegal) {
      setError('Illegal move');
      return;
    }
    onMove(parsed.from.file, parsed.from.rank, parsed.to.file, parsed.to.rank);
    setActive(false);
    setInputValue('');
    setError(null);
  }, [inputValue, legalMoves, onMove]);

  const onDismiss = useCallback(() => {
    setActive(false);
    setInputValue('');
    setError(null);
  }, []);

  return {
    state: { active, inputValue, error },
    inputRef,
    onInputChange,
    onSubmit,
    onDismiss,
  };
}
