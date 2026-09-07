import type { Board, BoardPosition, File, PieceColor, Rank } from '../types';
import { FILES } from '../types';
import type { Arrow } from '../hooks/useBoardDrawings';

const RANKS: Rank[] = [1, 2, 3, 4, 5, 6, 7, 8];

export function getBestMoveArrow(pvMove?: string): Arrow | null {
  if (!pvMove || pvMove.length < 4) return null;
  const fromFile = pvMove[0] as File;
  const fromRank = parseInt(pvMove[1], 10) as Rank;
  const toFile = pvMove[2] as File;
  const toRank = parseInt(pvMove[3], 10) as Rank;

  if (
    !FILES.includes(fromFile) ||
    !RANKS.includes(fromRank) ||
    !FILES.includes(toFile) ||
    !RANKS.includes(toRank)
  ) {
    return null;
  }

  return {
    from: { file: fromFile, rank: fromRank },
    to: { file: toFile, rank: toRank },
    color: 'rgba(6, 182, 212, 0.9)',
  };
}

export function getThreatArrows(
  board: Board,
  myColor: PieceColor | null,
): Arrow[] {
  if (!myColor) return [];
  const opponentColor: PieceColor = myColor === 'white' ? 'black' : 'white';
  const threats: Arrow[] = [];

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r]?.[c];
      if (!piece || piece.color !== opponentColor) continue;

      const fromPos: BoardPosition = {
        file: FILES[c],
        rank: (8 - r) as Rank,
      };

      const checkAttack = (targetR: number, targetC: number): boolean => {
        if (targetR < 0 || targetR >= 8 || targetC < 0 || targetC >= 8) {
          return false;
        }
        const targetPiece = board[targetR]?.[targetC];
        if (targetPiece?.color === myColor) {
          threats.push({
            from: fromPos,
            to: {
              file: FILES[targetC],
              rank: (8 - targetR) as Rank,
            },
            color: 'rgba(239, 68, 68, 0.85)',
          });
          return false;
        }
        return targetPiece === null;
      };

      switch (piece.type) {
        case 'pawn': {
          const dir = opponentColor === 'white' ? -1 : 1;
          for (const dc of [-1, 1]) {
            const tr = r + dir;
            const tc = c + dc;
            if (tr >= 0 && tr < 8 && tc >= 0 && tc < 8) {
              const target = board[tr]?.[tc];
              if (target?.color === myColor) {
                threats.push({
                  from: fromPos,
                  to: { file: FILES[tc], rank: (8 - tr) as Rank },
                  color: 'rgba(239, 68, 68, 0.85)',
                });
              }
            }
          }
          break;
        }

        case 'knight': {
          const jumps = [
            [-2, -1],
            [-2, 1],
            [-1, -2],
            [-1, 2],
            [1, -2],
            [1, 2],
            [2, -1],
            [2, 1],
          ];
          for (const [dr, dc] of jumps) {
            checkAttack(r + dr, c + dc);
          }
          break;
        }

        case 'bishop': {
          const dirs = [
            [-1, -1],
            [-1, 1],
            [1, -1],
            [1, 1],
          ];
          for (const [dr, dc] of dirs) {
            let tr = r + dr;
            let tc = c + dc;
            while (checkAttack(tr, tc)) {
              tr += dr;
              tc += dc;
            }
          }
          break;
        }

        case 'rook': {
          const dirs = [
            [-1, 0],
            [1, 0],
            [0, -1],
            [0, 1],
          ];
          for (const [dr, dc] of dirs) {
            let tr = r + dr;
            let tc = c + dc;
            while (checkAttack(tr, tc)) {
              tr += dr;
              tc += dc;
            }
          }
          break;
        }

        case 'queen': {
          const dirs = [
            [-1, -1],
            [-1, 1],
            [1, -1],
            [1, 1],
            [-1, 0],
            [1, 0],
            [0, -1],
            [0, 1],
          ];
          for (const [dr, dc] of dirs) {
            let tr = r + dr;
            let tc = c + dc;
            while (checkAttack(tr, tc)) {
              tr += dr;
              tc += dc;
            }
          }
          break;
        }

        case 'king': {
          const deltas = [
            [-1, -1],
            [-1, 0],
            [-1, 1],
            [0, -1],
            [0, 1],
            [1, -1],
            [1, 0],
            [1, 1],
          ];
          for (const [dr, dc] of deltas) {
            checkAttack(r + dr, c + dc);
          }
          break;
        }
      }
    }
  }

  return threats;
}
