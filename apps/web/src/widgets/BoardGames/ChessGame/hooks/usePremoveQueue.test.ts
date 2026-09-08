import { describe, expect, it, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePremoveQueue } from './usePremoveQueue';
import type { ChessClientState } from '../types';

describe('usePremoveQueue', () => {
  const baseSnapshot: ChessClientState = {
    phase: 'playing',
    gameCreatedAt: Date.now(),
    variant: 'standard',
    timeControl: null,
    board: [
      Array(8).fill(null),
      Array(8).fill(null),
      Array(8).fill(null),
      Array(8).fill(null),
      Array(8).fill(null),
      Array(8).fill(null),
      [
        { type: 'pawn', color: 'white' },
        { type: 'pawn', color: 'white' },
        { type: 'pawn', color: 'white' },
        { type: 'pawn', color: 'white' },
        { type: 'pawn', color: 'white' },
        null,
        null,
        null,
      ],
      [
        { type: 'rook', color: 'white' },
        { type: 'knight', color: 'white' },
        { type: 'bishop', color: 'white' },
        { type: 'queen', color: 'white' },
        { type: 'king', color: 'white' },
        null,
        null,
        null,
      ],
    ],
    currentTurnColor: 'black',
    castlingRights: {
      whiteKingSide: true,
      whiteQueenSide: true,
      blackKingSide: true,
      blackQueenSide: true,
    },
    enPassantTarget: null,
    moveHistory: [],
    players: [
      { playerId: 'user1', color: 'white', isBot: false },
      { playerId: 'user2', color: 'black', isBot: false },
    ],
    legalMovesForCurrentPlayer: [],
    winnerColor: null,
    isCheck: false,
    isCheckmate: false,
    isStalemate: false,
    isDrawByRepetition: false,
    isDrawByFiftyMoveRule: false,
    isInsufficientMaterial: false,
    isDrawByAgreement: false,
    drawOfferedBy: null,
    takebackOfferedBy: null,
    takebackMoveIndex: null,
    halfMoveClock: 0,
    fullMoveNumber: 1,
    clocks: null,
    positionHistory: [],
    currentTurnIndex: 0,
    logs: [],
  };

  it('queues up to 5 consecutive premoves and maintains virtual board', () => {
    const movePiece = vi.fn();
    const applyOptimisticMove = vi.fn();
    const playSound = vi.fn();

    const { result } = renderHook(() =>
      usePremoveQueue({
        snapshot: baseSnapshot,
        myColor: 'white',
        displayMyTurn: false,
        isGameOver: false,
        movePiece,
        applyOptimisticMove,
        playSound,
      }),
    );

    act(() => {
      result.current.addPremove(
        { file: 'a', rank: 2 },
        { file: 'a', rank: 4 },
        { type: 'pawn', color: 'white' },
      );
      result.current.addPremove(
        { file: 'b', rank: 2 },
        { file: 'b', rank: 4 },
        { type: 'pawn', color: 'white' },
      );
    });

    expect(result.current.premoveQueue).toHaveLength(2);
    expect(result.current.premoveQueue[0].from).toEqual({ file: 'a', rank: 2 });
    expect(result.current.premoveQueue[1].from).toEqual({ file: 'b', rank: 2 });
    expect(result.current.virtualBoard).not.toBeNull();
  });

  it('cancels all premoves when cancelPremoves is called', () => {
    const movePiece = vi.fn();
    const applyOptimisticMove = vi.fn();
    const playSound = vi.fn();

    const { result } = renderHook(() =>
      usePremoveQueue({
        snapshot: baseSnapshot,
        myColor: 'white',
        displayMyTurn: false,
        isGameOver: false,
        movePiece,
        applyOptimisticMove,
        playSound,
      }),
    );

    act(() => {
      result.current.addPremove(
        { file: 'a', rank: 2 },
        { file: 'a', rank: 4 },
        { type: 'pawn', color: 'white' },
      );
      result.current.cancelPremoves();
    });

    expect(result.current.premoveQueue).toHaveLength(0);
  });

  it('executes first queued premove when displayMyTurn becomes true and move is legal', async () => {
    const movePiece = vi.fn();
    const applyOptimisticMove = vi.fn();
    const playSound = vi.fn();

    const snapshotWithLegals: ChessClientState = {
      ...baseSnapshot,
      currentTurnColor: 'white',
      legalMovesForCurrentPlayer: [
        {
          from: { file: 'a', rank: 2 },
          to: { file: 'a', rank: 4 },
          promotion: null,
        },
      ],
    };

    let isMyTurn = false;
    let currentSnapshot = baseSnapshot;

    const { result, rerender } = renderHook(() =>
      usePremoveQueue({
        snapshot: currentSnapshot,
        myColor: 'white',
        displayMyTurn: isMyTurn,
        isGameOver: false,
        movePiece,
        applyOptimisticMove,
        playSound,
      }),
    );

    act(() => {
      result.current.addPremove(
        { file: 'a', rank: 2 },
        { file: 'a', rank: 4 },
        { type: 'pawn', color: 'white' },
      );
      result.current.addPremove(
        { file: 'b', rank: 2 },
        { file: 'b', rank: 4 },
        { type: 'pawn', color: 'white' },
      );
    });

    expect(result.current.premoveQueue).toHaveLength(2);

    await act(async () => {
      isMyTurn = true;
      currentSnapshot = snapshotWithLegals;
      rerender();
      await Promise.resolve();
    });

    expect(movePiece).toHaveBeenCalledWith('a', 2, 'a', 4, undefined);
    expect(applyOptimisticMove).toHaveBeenCalledWith('a', 2, 'a', 4, undefined);
    expect(result.current.premoveQueue).toHaveLength(1);
    expect(result.current.premoveQueue[0].from).toEqual({ file: 'b', rank: 2 });
  });
});
