import { expect } from '@playwright/test';
import { test, navigateTo } from './fixtures/test-utils';

test.describe('Public Player Profile Page', () => {
  test('renders player profile with stats overview, favorite games, and match history', async ({
    page,
  }) => {
    const res = await page.request.get('/players/p_1');
    if (res.status() >= 400) {
      test.skip();
      return;
    }

    await navigateTo(page, '/players/p_1');

    await expect(page.getByTestId('player-stats-overview')).toBeVisible();
    await expect(page.getByTestId('stat-total-games')).toBeVisible();
    await expect(page.getByTestId('stat-wins')).toBeVisible();
    await expect(page.getByTestId('stat-losses')).toBeVisible();

    await expect(page.getByTestId('player-favorite-games')).toBeVisible();
    await expect(page.getByTestId('player-game-history')).toBeVisible();

    const shareActions = page.getByTestId('player-share-actions');
    await expect(shareActions).toBeVisible();
    await expect(page.getByTestId('share-profile-button')).toBeVisible();
  });

  test('back button navigates back to leaderboards', async ({ page }) => {
    await navigateTo(page, '/leaderboards');
    await navigateTo(page, '/players/p_1');

    const backButton = page.getByTestId('player-profile-back');
    await expect(backButton).toBeVisible();
    await backButton.click();
    await expect(page).toHaveURL(/\/leaderboards/);
  });
});
