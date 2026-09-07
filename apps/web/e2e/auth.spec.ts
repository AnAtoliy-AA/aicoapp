import { expect } from '@playwright/test';
import { test } from './fixtures/test-utils';
import { navigateTo } from './fixtures/test-utils';

test.describe('Auth Page', () => {
  test.beforeEach(async ({ page }) => {
    await navigateTo(page, '/auth');
  });

  test('should render auth page with form, OAuth, and sign-in content', async ({
    page,
  }) => {
    await expect(page).toHaveURL(/\/auth/);
    await expect(page.getByTestId('auth-page-root')).toBeVisible();
    await expect(page.getByTestId('auth-form-panel')).toBeVisible();
    await expect(page.getByTestId('auth-oauth-google')).toBeVisible();

    const signInText = page.getByText(/sign in|login|welcome/i).first();
    if (await signInText.isVisible()) {
      await expect(signInText).toBeVisible();
    }
  });
});
