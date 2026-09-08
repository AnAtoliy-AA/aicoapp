import { expect } from '@playwright/test';
import {
  test,
  mockSession,
  navigateTo,
  mockRoomInfo,
  mockGameSocket,
  handleRoute,
} from './fixtures/test-utils';

const MOCK_ROOM_ID = '507f1f77bcf86cd799439011';
const USER_WHITE_ID = '507f191e810c19729de860ea';
const USER_BLACK_ID = '507f1f77bcf86cd799439012';

function createInitialBoard() {
  return [
    [
      { type: 'rook', color: 'black' },
      { type: 'knight', color: 'black' },
      { type: 'bishop', color: 'black' },
      { type: 'queen', color: 'black' },
      { type: 'king', color: 'black' },
      { type: 'bishop', color: 'black' },
      { type: 'knight', color: 'black' },
      { type: 'rook', color: 'black' },
    ],
    Array(8).fill({ type: 'pawn', color: 'black' }),
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill({ type: 'pawn', color: 'white' }),
    [
      { type: 'rook', color: 'white' },
      { type: 'knight', color: 'white' },
      { type: 'bishop', color: 'white' },
      { type: 'queen', color: 'white' },
      { type: 'king', color: 'white' },
      { type: 'bishop', color: 'white' },
      { type: 'knight', color: 'white' },
      { type: 'rook', color: 'white' },
    ],
  ];
}

test.describe('Chess Game Clock and Orientation', () => {
  test.beforeEach(async ({ page }) => {
    await mockSession(page);

    await page.route('**/games/rooms/join', async (route) => {
      await handleRoute(route, { roomId: MOCK_ROOM_ID });
    });

    await page.route('**/games/*', async (route) => {
      if (route.request().resourceType() === 'document') {
        return route.continue();
      }
      return handleRoute(route, {});
    });
  });

  test('displays accurate game clocks and keeps time frozen during first-move grace period', async ({
    page,
  }) => {
    await mockRoomInfo(page, {
      room: {
        id: MOCK_ROOM_ID,
        gameId: 'chess_v1',
        name: 'Active Chess Game',
        status: 'playing',
        playerCount: 2,
        maxPlayers: 2,
      },
    });

    const now = Date.now();
    const chessState = {
      phase: 'playing',
      gameCreatedAt: now - 3000,
      variant: 'standard',
      timeControl: { type: 'blitz', initialSeconds: 180, incrementSeconds: 2 },
      board: createInitialBoard(),
      currentTurnColor: 'white',
      castlingRights: {
        whiteKingSide: true,
        whiteQueenSide: true,
        blackKingSide: true,
        blackQueenSide: true,
      },
      enPassantTarget: null,
      moveHistory: [],
      players: [
        { playerId: USER_WHITE_ID, color: 'white', isBot: false },
        { playerId: USER_BLACK_ID, color: 'black', isBot: false },
      ],
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
      clocks: {
        white: { remainingSeconds: 180, lastMoveTimestamp: 0 },
        black: { remainingSeconds: 180, lastMoveTimestamp: 0 },
      },
      positionHistory: [],
      currentTurnIndex: 0,
      logs: [],
      halfMoveClock: 0,
      fullMoveNumber: 1,
      legalMovesForCurrentPlayer: [],
    };

    await mockGameSocket(page, MOCK_ROOM_ID, USER_WHITE_ID, {
      roomJoinedPayload: {
        id: MOCK_ROOM_ID,
        gameId: 'chess_v1',
        status: 'playing',
        members: [
          {
            id: USER_WHITE_ID,
            userId: USER_WHITE_ID,
            displayName: 'White Player',
            isHost: true,
          },
          {
            id: USER_BLACK_ID,
            userId: USER_BLACK_ID,
            displayName: 'Black Player',
            isHost: false,
          },
        ],
        session: {
          id: 'session-chess-1',
          roomId: MOCK_ROOM_ID,
          gameId: 'chess_v1',
          status: 'playing',
          state: chessState,
        },
      },
    });

    await navigateTo(page, `/rooms/${MOCK_ROOM_ID}`);

    const clocks = page.locator('.tabular-nums');
    await expect(clocks.first()).toHaveText('03:00');
    await expect(clocks.last()).toContainText(/00:(1[0-9]|20)/);
  });
});
