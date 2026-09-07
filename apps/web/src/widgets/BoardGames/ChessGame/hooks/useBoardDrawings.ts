import { useState, useCallback } from 'react';
import type { BoardPosition } from '../types';

export interface Arrow {
  from: BoardPosition;
  to: BoardPosition;
  color: string;
}

export interface DrawingCircle {
  square: BoardPosition;
  color: string;
}

export const MODIFIER_COLORS = {
  default: 'rgba(34, 197, 94, 0.8)',
  red: 'rgba(239, 68, 68, 0.8)',
  blue: 'rgba(14, 165, 233, 0.8)',
  gold: 'rgba(245, 158, 11, 0.8)',
} as const;

export function resolveDrawingColor(e: {
  altKey: boolean;
  shiftKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
}): string {
  if (e.altKey) return MODIFIER_COLORS.red;
  if (e.shiftKey) return MODIFIER_COLORS.blue;
  if (e.ctrlKey || e.metaKey) return MODIFIER_COLORS.gold;
  return MODIFIER_COLORS.default;
}

const MAX_ARROWS = 15;
const MAX_CIRCLES = 15;

export function useBoardDrawings() {
  const [arrows, setArrows] = useState<Arrow[]>([]);
  const [circles, setCircles] = useState<DrawingCircle[]>([]);
  const [showBestMove, setShowBestMove] = useState(false);
  const [showThreats, setShowThreats] = useState(false);

  const toggleBestMove = useCallback(() => setShowBestMove((v) => !v), []);
  const toggleThreats = useCallback(() => setShowThreats((v) => !v), []);

  const addArrow = useCallback(
    (
      from: BoardPosition,
      to: BoardPosition,
      color: string = MODIFIER_COLORS.default,
    ) => {
      setArrows((prev) => {
        const filtered = prev.filter(
          (a) =>
            !(
              a.from.file === from.file &&
              a.from.rank === from.rank &&
              a.to.file === to.file &&
              a.to.rank === to.rank
            ),
        );
        const next = [...filtered, { from, to, color }];
        return next.length > MAX_ARROWS ? next.slice(-MAX_ARROWS) : next;
      });
    },
    [],
  );

  const toggleCircle = useCallback(
    (square: BoardPosition, color: string = MODIFIER_COLORS.default) => {
      setCircles((prev) => {
        const exists = prev.some(
          (c) => c.square.file === square.file && c.square.rank === square.rank,
        );
        if (exists) {
          return prev.filter(
            (c) =>
              !(c.square.file === square.file && c.square.rank === square.rank),
          );
        }
        const next = [...prev, { square, color }];
        return next.length > MAX_CIRCLES ? next.slice(-MAX_CIRCLES) : next;
      });
    },
    [],
  );

  const clearDrawings = useCallback(() => {
    setArrows([]);
    setCircles([]);
  }, []);

  return {
    arrows,
    circles,
    showBestMove,
    showThreats,
    toggleBestMove,
    toggleThreats,
    addArrow,
    toggleCircle,
    clearDrawings,
  };
}
