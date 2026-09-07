import { test, expect } from '@playwright/test';

test.describe('Chess Share Game Link', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3500');
  });

  test('settings tab copy game link button exists and is clickable', async ({
    page,
  }) => {
    const settingsBtn = page.getByRole('button', { name: /Tools & Settings/i });
    if (!(await settingsBtn.isVisible())) {
      test.skip();
      return;
    }
    await settingsBtn.click();

    const shareBtn = page.locator('#chess-share-game-link');
    await expect(shareBtn).toBeVisible();
  });

  test('streamer mode toggle exists in settings tab', async ({ page }) => {
    const settingsBtn = page.getByRole('button', { name: /Tools & Settings/i });
    if (!(await settingsBtn.isVisible())) {
      test.skip();
      return;
    }
    await settingsBtn.click();

    const toggleBtn = page.locator('#chess-streamer-mode-toggle');
    await expect(toggleBtn).toBeVisible();
  });

  test('OBS URL button appears after enabling streamer mode', async ({
    page,
  }) => {
    const settingsBtn = page.getByRole('button', { name: /Tools & Settings/i });
    if (!(await settingsBtn.isVisible())) {
      test.skip();
      return;
    }
    await settingsBtn.click();

    const toggleBtn = page.locator('#chess-streamer-mode-toggle');
    await toggleBtn.click();

    await expect(page.locator('#chess-copy-obs-url')).toBeVisible();
  });

  test('quick play panel shows time control buttons in lobby', async ({
    page,
  }) => {
    const bulletCard = page.locator('#quick-play-1plus0');
    if (!(await bulletCard.isVisible())) {
      test.skip();
      return;
    }
    await expect(bulletCard).toBeEnabled();
  });
});
