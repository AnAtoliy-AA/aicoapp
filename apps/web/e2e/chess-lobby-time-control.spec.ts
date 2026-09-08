import { expect } from '@playwright/test';
import {
  test,
  mockSession,
  navigateTo,
  mockRoomInfo,
  MOCK_OBJECT_ID,
  waitForRoomReady,
  mockGameSocket,
  handleRoute,
} from './fixtures/test-utils';
import { routes } from '../src/shared/config/routes';

test.describe('Chess Lobby Time Control UI/UX', () => {
  test.beforeEach(async ({ page }) => {
    await mockSession(page);

    await page.route('**/games/rooms/join', async (route) => {
      await handleRoute(route, { roomId: MOCK_OBJECT_ID });
    });

    await page.route('**/games/*', async (route) => {
      if (route.request().resourceType() === 'document') {
        return route.continue();
      }
      return handleRoute(route, {});
    });
  });

  test('renders time control presets with visible selection and duration labels', async ({
    page,
  }) => {
    const roomId = MOCK_OBJECT_ID;

    await mockRoomInfo(page, {
      room: {
        id: roomId,
        name: 'Chess Time Control Room',
        gameId: 'chess_v1',
        gameOptions: {
          variant: 'standard',
          theme: 'adventure',
          timeControl: {
            type: 'blitz',
            initialSeconds: 180,
            incrementSeconds: 0,
          },
        },
        status: 'lobby',
        playerCount: 1,
        maxPlayers: 2,
      },
    });

    await mockGameSocket(page, roomId, MOCK_OBJECT_ID, {
      gameId: 'chess_v1',
      roomJoinedPayload: {
        id: roomId,
        gameId: 'chess_v1',
        status: 'lobby',
        gameOptions: {
          variant: 'standard',
          theme: 'adventure',
          timeControl: {
            type: 'blitz',
            initialSeconds: 180,
            incrementSeconds: 0,
          },
        },
        members: [
          {
            id: MOCK_OBJECT_ID,
            userId: MOCK_OBJECT_ID,
            displayName: 'Host Player',
            isHost: true,
          },
        ],
      },
    });

    await navigateTo(page, routes.gameRoom(roomId));
    await waitForRoomReady(page);

    const preset30 = page.getByTestId('quick-play-3-0');
    await expect(preset30).toBeVisible();
    await expect(preset30).toHaveAttribute('data-active', 'true');
    await expect(preset30.getByTestId('selected-indicator')).toBeVisible();

    const preset32 = page.getByTestId('quick-play-3-2');
    await expect(preset32).toBeVisible();
    await expect(preset32.getByText('3m + 2s')).toBeVisible();
    await expect(preset32).toHaveAttribute('data-active', 'false');

    const presetNoClock = page.getByTestId('quick-play-no-clock');
    await expect(presetNoClock).toBeVisible();
    await expect(presetNoClock.getByText('Unlimited')).toBeVisible();

    await preset32.click();

    await mockRoomInfo(page, {
      room: {
        id: roomId,
        name: 'Chess Time Control Room',
        gameId: 'chess_v1',
        gameOptions: {
          variant: 'standard',
          theme: 'adventure',
          timeControl: {
            type: 'blitz',
            initialSeconds: 180,
            incrementSeconds: 2,
          },
        },
        status: 'lobby',
        playerCount: 1,
        maxPlayers: 2,
      },
    });

    await mockGameSocket(page, roomId, MOCK_OBJECT_ID, {
      gameId: 'chess_v1',
      roomJoinedPayload: {
        id: roomId,
        gameId: 'chess_v1',
        status: 'lobby',
        gameOptions: {
          variant: 'standard',
          theme: 'adventure',
          timeControl: {
            type: 'blitz',
            initialSeconds: 180,
            incrementSeconds: 2,
          },
        },
        members: [
          {
            id: MOCK_OBJECT_ID,
            userId: MOCK_OBJECT_ID,
            displayName: 'Host Player',
            isHost: true,
          },
        ],
      },
    });

    await navigateTo(page, routes.gameRoom(roomId));
    await waitForRoomReady(page);

    const updatedPreset32 = page.getByTestId('quick-play-3-2');
    await expect(updatedPreset32).toHaveAttribute('data-active', 'true');
    await expect(
      updatedPreset32.getByTestId('selected-indicator'),
    ).toBeVisible();
    await expect(page.getByTestId('quick-play-3-0')).toHaveAttribute(
      'data-active',
      'false',
    );

    await expect(page.getByText('1|0')).toHaveCount(0);
    await expect(page.getByText('3|0')).toHaveCount(0);
  });
});
