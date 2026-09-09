import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PAGES = [
  { name: 'Homepage', path: '/en' },
  { name: 'Games', path: '/en/games' },
  { name: 'Chess', path: '/en/games/chess' },
  { name: 'Hearts', path: '/en/games/hearts' },
  { name: 'Shop', path: '/en/shop' },
  { name: 'Blog', path: '/en/blog' },
  { name: 'Leaderboards', path: '/en/leaderboards' },
  { name: 'Features', path: '/en/features' },
  { name: 'Auth', path: '/en/auth' },
  { name: 'Help', path: '/en/help' },
];

for (const { name, path } of PAGES) {
  test(`${name} should have no critical or serious axe-core violations`, async ({
    page,
  }) => {
    await page.goto(path, { waitUntil: 'networkidle' });

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const critical = results.violations.filter(
      (v) => v.impact === 'critical',
    );

    if (critical.length > 0) {
      console.error(
        `Critical a11y violations on ${name}:`,
        critical.map((v) => ({
          id: v.id,
          description: v.description,
          nodes: v.nodes.length,
          help: v.help,
          helpUrl: v.helpUrl,
        })),
      );
    }

    expect(
      critical,
      `Found ${critical.length} critical a11y violations on ${name}`,
    ).toHaveLength(0);
  });
}
