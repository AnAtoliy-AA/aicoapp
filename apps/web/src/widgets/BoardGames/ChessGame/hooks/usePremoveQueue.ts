import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import type {
  Board,
  BoardPosition,
  ChessClientState,
  ChessPiece,
  File,
  PieceColor,
  PieceType,
  Rank,
} from '../types';
import { calculateOptimisticChessState } from '../lib/optimisticMove';
import type { SoundType } from '../lib/sounds';

export interface PremoveStep {
  from: BoardPosition;
  to: BoardPosition;
  piece: ChessPiece;
  promotion?: PieceType;
}

interface UsePremoveQueueProps {
  snapshot: ChessClientState | null;
  myColor: PieceColor | null;
  displayMyTurn: boolean;
  isGameOver: boolean;
  movePiece: (
    fromFile: File,
    fromRank: Rank,
    toFile: File,
    toRank: Rank,
    promotion?: PieceType,
  ) => void;
  applyOptimisticMove: (
    fromFile: File,
    fromRank: Rank,
    toFile: File,
    toRank: Rank,
    promotion?: PieceType,
  ) => void;
  playSound: (type: SoundType) => void;
}

const MAX_PREMOVES = 5;

export function usePremoveQueue({
  snapshot,
  myColor,
  displayMyTurn,
  isGameOver,
  movePiece,
  applyOptimisticMove,
  playSound,
}: UsePremoveQueueProps) {
  const [queue, setQueue] = useState<PremoveStep[]>([]);
  const prevTurnRef = useRef<boolean>(displayMyTurn);

  const virtualState = useMemo(() => {
    if (!snapshot || queue.length === 0) return snapshot;

    let currentState = snapshot;
    for (const step of queue) {
      const next = calculateOptimisticChessState(
        currentState,
        step.from.file,
        step.from.rank,
        step.to.file,
        step.to.rank,
        step.promotion,
      );
      if (next) {
        currentState = next;
      }
    }
    return currentState;
  }, [snapshot, queue]);

  const virtualBoard: Board | null = useMemo(() => {
    return virtualState?.board ?? snapshot?.board ?? null;
  }, [virtualState?.board, snapshot?.board]);

  const cancelPremoves = useCallback(() => {
    setQueue([]);
  }, []);

  const addPremove = useCallback(
    (
      from: BoardPosition,
      to: BoardPosition,
      piece: ChessPiece,
      promotion?: PieceType,
    ) => {
      if (isGameOver || !myColor || piece.color !== myColor) return;
      let finalPromo = promotion;
      if (
        piece.type === 'pawn' &&
        (to.rank === 8 || to.rank === 1) &&
        !finalPromo
      ) {
        finalPromo = 'queen';
      }
      setQueue((prev) => {
        if (prev.length >= MAX_PREMOVES) return prev;
        const next = [...prev, { from, to, piece, promotion: finalPromo }];
        return next;
      });
      playSound('move');
    },
    [isGameOver, myColor, playSound],
  );

  const removePremoveStep = useCallback((index: number) => {
    setQueue((prev) => prev.filter((_, i) => i !== index));
  }, []);

  useEffect(() => {
    const wasOpponentTurn = !prevTurnRef.current;
    const isNowMyTurn = displayMyTurn;
    prevTurnRef.current = displayMyTurn;

    if (wasOpponentTurn && isNowMyTurn && queue.length > 0 && snapshot) {
      const [nextMove, ...remainingQueue] = queue;
      const legal = (snapshot.legalMovesForCurrentPlayer ?? []).some(
        (m) =>
          m.from.file === nextMove.from.file &&
          m.from.rank === nextMove.from.rank &&
          m.to.file === nextMove.to.file &&
          m.to.rank === nextMove.to.rank,
      );

      if (legal) {
        applyOptimisticMove(
          nextMove.from.file,
          nextMove.from.rank,
          nextMove.to.file,
          nextMove.to.rank,
          nextMove.promotion,
        );
        movePiece(
          nextMove.from.file,
          nextMove.from.rank,
          nextMove.to.file,
          nextMove.to.rank,
          nextMove.promotion,
        );
        queueMicrotask(() => setQueue(remainingQueue));
        playSound('move');
      } else {
        queueMicrotask(() => setQueue([]));
        playSound('illegal');
      }
    }
  }, [
    displayMyTurn,
    queue,
    snapshot,
    applyOptimisticMove,
    movePiece,
    playSound,
  ]);

  useEffect(() => {
    if (isGameOver && queue.length > 0) {
      queueMicrotask(() => setQueue([]));
    }
  }, [isGameOver, queue.length]);

  return {
    premoveQueue: queue,
    virtualBoard,
    addPremove,
    cancelPremoves,
    removePremoveStep,
  };
}
