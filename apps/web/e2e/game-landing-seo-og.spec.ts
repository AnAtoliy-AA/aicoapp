import { expect } from '@playwright/test';
import { test, navigateTo } from './fixtures/test-utils';
import { routes } from '../src/shared/config/routes';

test.describe('Game Landing SEO, AEO, GEO & Social Sharing', () => {
  test('chess landing renders complete AEO summary, specifications matrix and schemas', async ({
    page,
  }) => {
    const res = await page.goto(routes.chessLanding, {
      waitUntil: 'domcontentloaded',
    });
    expect(res?.status()).toBe(200);

    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Chess');

    const quickplayBtn = page
      .locator('[data-testid="quickplay-ai-button"]')
      .first();
    await expect(quickplayBtn).toBeVisible();

    const specTable = page.locator('[data-testid="game-spec-table"]').first();
    await expect(specTable).toBeVisible();
    await expect(specTable).toContainText('Stockfish 19 NNUE');
    await expect(specTable).toContainText('Chess960');

    const howTo = page.locator('#how-to-play').first();
    await expect(howTo).toBeVisible();

    const faq = page.locator('#faq').first();
    await expect(faq).toBeVisible();
    const firstDetails = faq.locator('details').first();
    await expect(firstDetails).toBeVisible();

    const jsonLd = page.locator('script#json-ld-chess');
    await expect(jsonLd).toHaveCount(1);
    const content = await jsonLd.textContent();
    expect(content).toContain('VideoGame');
    expect(content).toContain('HowTo');
    expect(content).toContain('FAQPage');
    expect(content).toContain('BreadcrumbList');
    expect(content).toContain('Stockfish 19');
  });

  test('checkers and backgammon render specifications matrix and direct answers', async ({
    page,
  }) => {
    await navigateTo(page, routes.checkersLanding);
    const checkersHeading = page.locator('h1').first();
    await expect(checkersHeading).toBeVisible();
    await expect(checkersHeading).toContainText('Checkers');

    const checkersSpec = page
      .locator('[data-testid="game-spec-table"]')
      .first();
    await expect(checkersSpec).toBeVisible();
    await expect(checkersSpec).toContainText('American Draughts');

    await navigateTo(page, routes.backgammonLanding);
    const bgHeading = page.locator('h1').first();
    await expect(bgHeading).toBeVisible();
    await expect(bgHeading).toContainText('Backgammon');

    const bgSpec = page.locator('[data-testid="game-spec-table"]').first();
    await expect(bgSpec).toBeVisible();
    await expect(bgSpec).toContainText('24 Points');
  });

  test('chess page contains OpenGraph and Twitter card meta tags', async ({
    page,
  }) => {
    await page.goto(routes.chessLanding, {
      waitUntil: 'domcontentloaded',
    });

    const ogImage = page.locator('meta[property="og:image"]');
    await expect(ogImage).toHaveCount(1);
    const ogImageContent = await ogImage.getAttribute('content');
    expect(ogImageContent).toContain('/games/chess/opengraph-image');

    const twitterCard = page.locator('meta[name="twitter:card"]');
    await expect(twitterCard).toHaveCount(1);
    expect(await twitterCard.getAttribute('content')).toBe(
      'summary_large_image',
    );
  });

  test('game OG image routes respond successfully with png content-type', async ({
    request,
  }) => {
    const chessOg = await request.get('/en/games/chess/opengraph-image');
    expect(chessOg.status()).toBe(200);
    expect(chessOg.headers()['content-type']).toContain('image/png');

    const checkersOg = await request.get('/en/games/checkers/opengraph-image');
    expect(checkersOg.status()).toBe(200);
    expect(checkersOg.headers()['content-type']).toContain('image/png');

    const backgammonOg = await request.get(
      '/en/games/backgammon/opengraph-image',
    );
    expect(backgammonOg.status()).toBe(200);
    expect(backgammonOg.headers()['content-type']).toContain('image/png');
  });
});
