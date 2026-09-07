import { expect } from '@playwright/test';
import { test, ensureNavigationVisible } from './fixtures/test-utils';
import { navigateTo } from './fixtures/test-utils';
import { routes } from '../src/shared/config/routes';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await navigateTo(page, '/');
    await page.addStyleTag({
      content:
        'html body [data-reveal][data-reveal] { opacity: 1; transform: none; transition: none; }',
    });
  });

  test('should render layout, header, footer, and logo', async ({ page }) => {
    await expect(page).toHaveURL(/\/(?:en|es|fr|ru|by)?\/?$/);
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
    const footer = page.getByTestId('app-footer').first();
    await expect(footer).toBeVisible();
    const logoLink = page.locator('header a[href="/"]').first();
    await expect(logoLink).toBeVisible();
    await expect(logoLink).toHaveAttribute('href', '/');
    await expect(logoLink).toHaveText(/Arcadeum/i);
  });

  test('should render hero section with game cards and CTAs', async ({
    page,
  }) => {
    const hero = page
      .getByTestId('page-layout')
      .filter({ visible: true })
      .first();
    await expect(hero).toBeVisible();

    const criticalFeature = page
      .locator('main')
      .first()
      .getByTestId('game-title-critical_v1')
      .first();
    await expect(criticalFeature).toBeVisible();

    const seaBattleFeature = page
      .locator('main')
      .first()
      .getByTestId('game-title-sea_battle_v1')
      .first();
    await expect(seaBattleFeature).toBeVisible();

    const supportButton = page.getByTestId('hero-section').getByRole('link', {
      name: /support (the )?developers/i,
    });
    await expect(supportButton).toBeVisible();
    await expect(supportButton).toHaveAttribute('href', /\/support/);
    const icon = supportButton.locator('svg');
    await expect(icon).toBeVisible();

    const getStartedButton = page.getByRole('link', { name: /get started/i });
    await expect(getStartedButton).toBeVisible();
  });

  test('should navigate to games via Get Started and Play vs AI', async ({
    page,
  }) => {
    const getStartedButton = page.getByRole('link', { name: /get started/i });
    await getStartedButton.click();
    await expect(page).toHaveURL(/\/games/);

    await navigateTo(page, '/');
    const playVsAiButton = page.getByTestId('hero-play-vs-ai-button');
    await expect(playVsAiButton).toBeVisible();
    await playVsAiButton.click();

    const modal = page.getByTestId('game-picker-modal');
    await expect(modal).toBeVisible();
    await expect(page.getByTestId('game-picker-title')).toBeVisible();
    await expect(page.getByTestId('game-picker-search')).toBeVisible();

    const chessCard = page.getByTestId('game-picker-card-chess_v1');
    const heartsCard = page.getByTestId('game-picker-card-hearts_v1');
    const goCard = page.getByTestId('game-picker-card-go_v1');

    await expect(chessCard).toBeVisible();
    await expect(heartsCard).toBeVisible();
    await expect(goCard).toBeVisible();

    const cardChip = page.getByTestId('game-picker-category-card');
    await cardChip.click();
    await expect(heartsCard).toBeVisible();
    await expect(chessCard).not.toBeVisible();

    const closeButton = page.getByTestId('modal-close-button');
    await closeButton.click();
    await expect(modal).not.toBeVisible();
  });

  test('should render hero cards stack on desktop', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'Hero cards are only visible on desktop');
    await page.setViewportSize({ width: 1440, height: 900 });
    await navigateTo(page, '/');

    await expect(async () => {
      const cardStack = page.getByTestId('hero-card-stack');
      await expect(cardStack).toBeVisible();
      const heroCards = cardStack.locator('[data-testid^="hero-card-"]');
      await expect(heroCards).toHaveCount(3);
    }).toPass({});
  });

  test('should navigate to games page via nav link', async ({
    page,
    isMobile,
  }) => {
    await ensureNavigationVisible(page);
    const gamesLink = isMobile
      ? page.getByTestId('mobile-nav-rooms')
      : page.getByTestId('nav-games');
    await expect(gamesLink).toBeVisible();
    await gamesLink.dispatchEvent('click');
    await expect(page).toHaveURL(new RegExp(`${routes.games}|${routes.rooms}`));
  });
});
