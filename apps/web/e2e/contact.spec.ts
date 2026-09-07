import { expect } from '@playwright/test';
import { test } from './fixtures/test-utils';
import { navigateTo } from './fixtures/test-utils';

test.describe('Contact Form', () => {
  test('should validate fields and have working links', async ({ page }) => {
    await navigateTo(page, '/contact');

    // Empty form submission stays on page
    const submitBtn = page.getByTestId('contact-submit-button');
    await submitBtn.scrollIntoViewIfNeeded();
    await submitBtn.click({ force: true });
    await expect(page.locator('form')).toBeVisible();

    // Invalid email stays on page
    await page.getByTestId('contact-name-input').fill('Test User');
    await page.getByTestId('contact-email-input').fill('invalid-email');
    await page.getByTestId('contact-subject-input').fill('Test Subject');
    await page
      .getByTestId('contact-message-textarea')
      .fill('Hello, this is a test message.');
    await submitBtn.click({ force: true });
    await expect(page.locator('form')).toBeVisible();

    // External mailto link
    const emailLink = page
      .locator('a[href^="mailto:arcadeum.care@gmail.com"]')
      .first();
    await expect(emailLink).toBeVisible();
    await expect(emailLink).toHaveAttribute(
      'href',
      /arcadeum\.care@gmail\.com/,
    );
  });

  test('should show success message on valid submission', async ({
    page,
  }, testInfo) => {
    await navigateTo(page, '/contact');

    // BE dedupes identical submissions (ip + email + subject + message) for
    // an hour. Project name + retry index keep messages unique across
    // chromium/firefox/webkit and across retry runs in the same window.
    // Project names contain spaces ("Mobile Chrome"), which would make
    // an invalid email local-part — collapse to dashes.
    const projectSlug = testInfo.project.name.replace(/\s+/g, '-');
    const nonce = `${projectSlug}-${testInfo.retry}-${Date.now()}`;
    await page.getByTestId('contact-name-input').fill('John Doe');
    await page
      .getByTestId('contact-email-input')
      .fill(`john+${nonce}@example.com`);
    await page.getByTestId('contact-subject-input').fill('Hello');
    await page
      .getByTestId('contact-message-textarea')
      .fill(`This is a great app! Run ${nonce}`);

    // BE anti-bot: rejects submissions arriving < 2s after form mount.
    // Poll a timestamp rather than blind-delaying so Playwright can bail
    // early if the timeout budget is exceeded.
    const mountTime = Date.now();
    await page.waitForFunction(() => Date.now() - mountTime >= 2200);

    const submitBtn = page.getByTestId('contact-submit-button');
    await submitBtn.scrollIntoViewIfNeeded();
    await submitBtn.click({ force: true });

    await expect(page.getByTestId('contact-success-message')).toBeVisible();
    await expect(page.locator('form')).not.toBeVisible();
  });
});
