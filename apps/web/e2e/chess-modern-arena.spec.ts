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
});
