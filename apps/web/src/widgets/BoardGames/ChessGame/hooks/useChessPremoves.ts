'use client';

import { useCallback, useMemo } from 'react';
import type {
  BoardPosition,
  ChessClientState,
  File,
  PieceColor,
  PieceType,
  Rank,
} from '../types';
import { FILES } from '../types';
import { usePremoveQueue } from './usePremoveQueue';
import { getPseudoLegalMovesForSquare } from '../lib/premove-moves';
import type { SoundType } from '../lib/sounds';

interface UseChessPremovesProps {
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
  selectedSquare: BoardPosition | null;
  setSelectedSquare: (pos: BoardPosition | null) => void;
}

export function useChessPremoves({
  snapshot,
  myColor,
  displayMyTurn,
  isGameOver,
  movePiece,
  applyOptimisticMove,
  playSound,
  selectedSquare,
  setSelectedSquare,
}: UseChessPremovesProps) {
  const {
    premoveQueue,
    virtualBoard,
    addPremove,
    cancelPremoves,
    removePremoveStep,
  } = usePremoveQueue({
    snapshot,
    myColor,
    displayMyTurn,
    isGameOver,
    movePiece,
    applyOptimisticMove,
    playSound,
  });

  const activeBoard = virtualBoard ?? snapshot?.board ?? null;

  const premoveLegalMoves = useMemo(() => {
    if (!selectedSquare || !activeBoard || !myColor) return [];
    return getPseudoLegalMovesForSquare(activeBoard, selectedSquare, myColor);
  }, [selectedSquare, activeBoard, myColor]);

  const handlePremoveSquareClick = useCallback(
    (file: File, rank: Rank) => {
      if (!activeBoard || !myColor || isGameOver) return;
      const clickedPiece = activeBoard[8 - rank]?.[FILES.indexOf(file)];

      if (selectedSquare) {
        const isLegal = premoveLegalMoves.some(
          (m) => m.file === file && m.rank === rank,
        );
        if (isLegal) {
          const fromPiece =
            activeBoard[8 - selectedSquare.rank]?.[
              FILES.indexOf(selectedSquare.file)
            ];
          if (fromPiece) {
            addPremove(selectedSquare, { file, rank }, fromPiece);
          }
          setSelectedSquare(null);
          return;
        }

        if (clickedPiece?.color === myColor) {
          setSelectedSquare({ file, rank });
          return;
        }

        setSelectedSquare(null);
        return;
      }

      if (clickedPiece?.color === myColor) {
        setSelectedSquare({ file, rank });
      }
    },
    [
      activeBoard,
      myColor,
      isGameOver,
      selectedSquare,
      premoveLegalMoves,
      addPremove,
      setSelectedSquare,
    ],
  );

  const handlePremovePieceDrop = useCallback(
    (fromFile: File, fromRank: Rank, toFile: File, toRank: Rank) => {
      if (!activeBoard || !myColor || isGameOver) return;
      const piece = activeBoard[8 - fromRank]?.[FILES.indexOf(fromFile)];
      if (!piece || piece.color !== myColor) return;

      const moves = getPseudoLegalMovesForSquare(
        activeBoard,
        { file: fromFile, rank: fromRank },
        myColor,
      );
      const isLegal = moves.some((m) => m.file === toFile && m.rank === toRank);
      if (isLegal) {
        addPremove(
          { file: fromFile, rank: fromRank },
          { file: toFile, rank: toRank },
          piece,
        );
        setSelectedSquare(null);
      }
    },
    [activeBoard, myColor, isGameOver, addPremove, setSelectedSquare],
  );

  return {
    premoveQueue,
    virtualBoard,
    cancelPremoves,
    removePremoveStep,
    premoveLegalMoves,
    handlePremoveSquareClick,
    handlePremovePieceDrop,
  };
}
