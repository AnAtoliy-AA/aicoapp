'use client';

import { memo, useState, useCallback } from 'react';
import { cx } from '@arcadeum/ui/utils/cx';
import { useWidgetFullscreen } from '@/features/games/ui/GameWidgetContainer';
import { ChessBoard } from './ChessBoard';
import { EvalBar } from './EvalBar';
import { ChessPlayerHud } from './ChessPlayerHud';
import { ChessGameConsole } from './ChessGameConsole';
import { useChessPieceStylePreference } from '../lib/piece-style';
import type { UseChessCoachResult } from '../hooks/useChessCoach';
import './styles/chess-arena.scss';
import type { ChessClientState, BoardPosition, File, Rank } from '../types';
import type { TranslationKey } from '@/shared/lib/useTranslation';

type TranslateFn = (
  key: TranslationKey,
  params?: Record<string, string | number>,
) => string;

interface ChessBoardPanelProps {
  snapshot: ChessClientState | null;
  myColor: 'white' | 'black' | null;
  isFlipped: boolean;
  displayMyTurn: boolean;
  isGameOver: boolean;
  isSpectator: boolean;
  selectedSquare: BoardPosition | null;
  legalMoves: BoardPosition[];
  lastMove: { from: BoardPosition; to: BoardPosition } | null;
  kingPosition: BoardPosition | null;
  coach: UseChessCoachResult;
  currentUserId: string | null;
  resolveName: (id: string) => string;
  t: TranslateFn;
  onSquareClick: (file: File, rank: Rank) => void;
  onDeselectSquare: () => void;
  onPieceDrop: (
    fromFile: File,
    fromRank: Rank,
    toFile: File,
    toRank: Rank,
  ) => void;
  onOfferDraw: () => void;
  onResign: () => void;
  onAcceptDraw: () => void;
  onOfferTakeback: () => void;
  onAcceptTakeback: () => void;
  onDeclineTakeback: () => void;
  liveEval?: {
    cp: number | null;
    mate: number | null;
    pv: string[];
    depth: number;
    selDepth: number;
    nodes: number;
    nps: number;
    timeMs: number;
  } | null;
  liveEvalAnalyzing?: boolean;
  onFlipBoard?: () => void;
  onExportPgn?: () => void;
  onToggleConfirmMoves?: () => void;
  confirmMoves?: boolean;
  moveCandidates?: Array<{
    move: string;
    cp: number | null;
    mate: number | null;
    pv: string[];
  }> | null;
  pendingMove?: { from: BoardPosition; to: BoardPosition } | null;
}

function ChessBoardPanelImpl({
  snapshot,
  myColor,
  isFlipped,
  displayMyTurn,
  isGameOver,
  isSpectator,
  selectedSquare,
  legalMoves,
  lastMove,
  kingPosition,
  coach,
  currentUserId,
  resolveName,
  t,
  onSquareClick,
  onDeselectSquare,
  onPieceDrop,
  onOfferDraw,
  onResign,
  onAcceptDraw,
  onOfferTakeback,
  onAcceptTakeback,
  onDeclineTakeback,
  liveEval,
  liveEvalAnalyzing,
  onFlipBoard,
  onExportPgn,
  onToggleConfirmMoves,
  confirmMoves,
  moveCandidates,
  pendingMove,
}: ChessBoardPanelProps) {
  const [hoveredMoveIdx, setHoveredMoveIdx] = useState<number | null>(null);
  const { pieceStyle, setPieceStyle } = useChessPieceStylePreference();
  const isFullscreen = useWidgetFullscreen();

  const handleMoveHover = useCallback((idx: number | null) => {
    setHoveredMoveIdx(idx);
  }, []);

  if (!snapshot) return null;

  const players = snapshot.players ?? [];
  const whitePlayer = players.find((p) => p.color === 'white');
  const blackPlayer = players.find((p) => p.color === 'black');

  const topPlayer = isFlipped ? whitePlayer : blackPlayer;
  const bottomPlayer = isFlipped ? blackPlayer : whitePlayer;

  const topColor = isFlipped ? 'white' : 'black';
  const bottomColor = isFlipped ? 'black' : 'white';

  const topName = topPlayer?.playerId
    ? resolveName(topPlayer.playerId)
    : topColor === 'white'
      ? 'White'
      : 'Black';
  const bottomName = bottomPlayer?.playerId
    ? resolveName(bottomPlayer.playerId)
    : bottomColor === 'white'
      ? 'White'
      : 'Black';

  const highlightMove =
    hoveredMoveIdx !== null && snapshot.moveHistory[hoveredMoveIdx]
      ? {
          from: snapshot.moveHistory[hoveredMoveIdx].from,
          to: snapshot.moveHistory[hoveredMoveIdx].to,
        }
      : lastMove;

  const topPlayerHud = (
    <ChessPlayerHud
      playerId={topPlayer?.playerId ?? ''}
      name={topName}
      color={topColor}
      isActive={snapshot.currentTurnColor === topColor}
      isGameOver={isGameOver}
      remainingSeconds={snapshot.clocks?.[topColor]?.remainingSeconds ?? null}
      incrementSeconds={snapshot.timeControl?.incrementSeconds}
      board={snapshot.board}
      pieceStyle={pieceStyle}
    />
  );

  const bottomPlayerHud = (
    <ChessPlayerHud
      playerId={bottomPlayer?.playerId ?? ''}
      name={bottomName}
      color={bottomColor}
      isActive={snapshot.currentTurnColor === bottomColor}
      isGameOver={isGameOver}
      remainingSeconds={
        snapshot.clocks?.[bottomColor]?.remainingSeconds ?? null
      }
      incrementSeconds={snapshot.timeControl?.incrementSeconds}
      board={snapshot.board}
      pieceStyle={pieceStyle}
    />
  );

  return (
    <div className={cx('chess-arena-root', isFullscreen && 'is-fullscreen')}>
      <div
        className={cx('chess-board-column', isFullscreen && 'is-fullscreen')}
      >
        <div className="chess-hud-row">{topPlayerHud}</div>

        <div className="chess-eval-horizontal">
          <EvalBar
            evalScore={liveEval?.cp ?? null}
            mateScore={liveEval?.mate ?? null}
            isFlipped={isFlipped}
            orientation="horizontal"
          />
        </div>

        <div className="chess-board-stage-wrapper">
          <div className="chess-board-stage">
            <div className="chess-eval-container">
              <EvalBar
                evalScore={liveEval?.cp ?? null}
                mateScore={liveEval?.mate ?? null}
                isFlipped={isFlipped}
                orientation="vertical"
              />
            </div>

            <div className="chess-board-grid-wrapper">
              <ChessBoard
                board={snapshot.board}
                myColor={myColor}
                isFlipped={isFlipped}
                disabled={!displayMyTurn || isGameOver || isSpectator}
                selectedSquare={selectedSquare}
                legalMoves={legalMoves}
                lastMove={highlightMove}
                hintMove={
                  coach.hint
                    ? { from: coach.hint.from, to: coach.hint.to }
                    : null
                }
                pendingMove={pendingMove}
                isCheck={snapshot.isCheck}
                kingPosition={kingPosition}
                pieceStyle={pieceStyle}
                ariaLabel={t('games.chess_v1.status.boardLabel', {
                  color:
                    snapshot.currentTurnColor === 'white'
                      ? t('games.chess_v1.status.white')
                      : t('games.chess_v1.status.black'),
                })}
                onSquareClick={onSquareClick}
                onDeselectSquare={onDeselectSquare}
                onPieceDrop={onPieceDrop}
              />
            </div>
          </div>
        </div>

        <div className="chess-hud-row">{bottomPlayerHud}</div>
      </div>

      <div className="chess-console-column">
        <div className="chess-landscape-hud chess-landscape-hud-top">
          {topPlayerHud}
        </div>

        <ChessGameConsole
          snapshot={snapshot}
          myColor={myColor}
          isGameOver={isGameOver}
          isSpectator={isSpectator}
          currentUserId={currentUserId}
          coach={coach}
          pieceStyle={pieceStyle}
          onSelectPieceStyle={setPieceStyle}
          liveEval={liveEval}
          liveEvalAnalyzing={liveEvalAnalyzing}
          moveCandidates={moveCandidates}
          confirmMoves={confirmMoves}
          t={t}
          onMoveHover={handleMoveHover}
          onOfferDraw={onOfferDraw}
          onResign={onResign}
          onAcceptDraw={onAcceptDraw}
          onOfferTakeback={onOfferTakeback}
          onAcceptTakeback={onAcceptTakeback}
          onDeclineTakeback={onDeclineTakeback}
          onFlipBoard={onFlipBoard}
          onExportPgn={onExportPgn}
          onToggleConfirmMoves={onToggleConfirmMoves}
        />

        <div className="chess-landscape-hud chess-landscape-hud-bottom">
          {bottomPlayerHud}
        </div>
      </div>
    </div>
  );
}

export const ChessBoardPanel = memo(ChessBoardPanelImpl);
