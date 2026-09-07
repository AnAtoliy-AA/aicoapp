import { expect } from '@playwright/test';
import { test } from './fixtures/test-utils';
import { routes } from '../src/shared/config/routes';

test.describe('Chess Modern Arena UI/UX', () => {
  test('renders chess landing with modern advantages and interactive elements', async ({
    page,
  }) => {
    const response = await page.goto(routes.chessLanding, {
      waitUntil: 'domcontentloaded',
    });
    expect(response?.status()).toBe(200);

    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Chess');

    const quickPlayBtn = page
      .locator('[data-testid="quickplay-ai-button"]')
      .first();
    await expect(quickPlayBtn).toBeVisible();

    const advantages = page
      .locator('section')
      .filter({ hasText: 'Stockfish 19 Engine' })
      .first();
    await expect(advantages).toBeVisible();
  });

  test('renders offline chess with clean board and non-overlapping console', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 750 });
    const response = await page.goto('/en/offline/chess', {
      waitUntil: 'domcontentloaded',
    });
    expect(response?.status()).toBe(200);

    const board = page.locator('[role="grid"]').first();
    await expect(board).toBeVisible();

    const streamerPill = page.locator('button', { hasText: '🎯 Best' });
    await expect(streamerPill).toHaveCount(0);

    const settingsTab = page
      .locator('button', { hasText: 'Tools & Settings' })
      .first();
    await expect(settingsTab).toBeVisible();
    await settingsTab.click();

    const gameTab = page
      .locator('button', { hasText: 'Game & Engine' })
      .first();
    await expect(gameTab).toBeVisible();
    await gameTab.click();

    const movesHeader = page.locator('text=MOVES').first();
    await expect(movesHeader).toBeVisible();
  });
});
