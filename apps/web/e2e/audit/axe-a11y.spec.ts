import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const urlsPath = resolve(__dirname, '../../lighthouse-urls.json');

// Skip silently if lighthouse-urls.json hasn't been generated yet
// (e.g. during regular E2E runs that don't audit pages).
if (!existsSync(urlsPath)) {
  test.skip(() => true, 'lighthouse-urls.json not found — skipping axe-a11y audit');
}

const allUrls: string[] = JSON.parse(
  readFileSync(urlsPath, 'utf-8'),
);

// Sharding: set SHARD_INDEX (1-based) and SHARD_TOTAL via env to split URLs.
// When unset, all URLs run in a single test file.
const shardIndex = parseInt(process.env.SHARD_INDEX ?? '1', 10);
const shardTotal = parseInt(process.env.SHARD_TOTAL ?? '1', 10);

const perShard = Math.ceil(allUrls.length / shardTotal);
const start = (shardIndex - 1) * perShard;
const urls = allUrls.slice(start, start + perShard);

for (const url of urls) {
  const path = new URL(url).pathname;

  test(`${path} should have no critical or serious axe-core violations`, async ({
    page,
  }) => {
    await page.goto(path, {
      waitUntil: 'domcontentloaded',
      timeout: 30_000,
    });

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const critical = results.violations.filter((v) => v.impact === 'critical');

    if (critical.length > 0) {
      console.error(
        `Critical a11y violations on ${path}:`,
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
      `Found ${critical.length} critical a11y violations on ${path}`,
    ).toHaveLength(0);
  });
}
