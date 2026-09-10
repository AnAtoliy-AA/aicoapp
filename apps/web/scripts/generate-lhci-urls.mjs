#!/usr/bin/env node
/**
 * Generate Lighthouse & axe-a11y audit URL list from the filesystem.
 *
 * Scans `src/app/[locale]/(app)/` for `page.tsx` files, converts each
 * path to a URL, and filters out pages that require authentication,
 * are admin-only, or use dynamic route segments.
 *
 * Usage:  node scripts/generate-lhci-urls.mjs
 */
import { readdirSync, writeFileSync, statSync, existsSync } from 'node:fs';
import { resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = resolve(__dirname, '..');
const LOCALE_DIR = resolve(WEB_ROOT, 'src/app/[locale]');
const APP_DIR = resolve(LOCALE_DIR, '(app)');
const OUTPUT_FILE = resolve(WEB_ROOT, 'lighthouse-urls.json');

const LOCALE = 'en';
const BASE = `http://localhost:3000/${LOCALE}`;

// Directory prefixes to skip entirely (admin, system)
const SKIP_DIRS = new Set(['admin', 'offline']);

// Exact directory names to skip (system pages, OAuth handler)
const SKIP_EXACT = new Set(['test-crash', 'callback']);

// Pages marked noindex by middleware (proxy.ts PRIVATE_SLUG_KEYS + PRIVATE_GAMES_SUBPATHS)
const PRIVATE_PATHS = new Set([
  'auth', 'chat', 'chats', 'history', 'settings', 'stats',
  'referrals', 'payment', 'wallet', 'shop', 'rooms',
  'games/create',
]);

/**
 * Recursively find all page.tsx files under dir, returning
 * relative paths from APP_DIR (e.g. "games/chess/page.tsx").
 */
function findPages(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = resolve(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...findPages(full));
    } else if (entry === 'page.tsx') {
      results.push(relative(APP_DIR, full));
    }
  }
  return results;
}

/**
 * Convert a filesystem page path to a URL path.
 *   "games/chess/page.tsx" → "/games/chess"
 *   "page.tsx"             → ""
 */
function pageToPath(pagePath) {
  const replaced = pagePath.replace(/\/page\.tsx$/, '').replace(/^page\.tsx$/, '');
  return replaced ? `/${replaced}` : '';
}

/**
 * Check if a URL path should be excluded.
 */
function shouldExclude(urlPath) {
  const segments = urlPath.split('/').filter(Boolean);

  // Skip entirely-excluded directories
  if (segments.some((s) => SKIP_DIRS.has(s))) return true;

  // Skip exact directory matches (first or second segment)
  if (segments.length > 0 && SKIP_EXACT.has(segments[0])) return true;
  if (segments.length > 1 && SKIP_EXACT.has(segments[1])) return true;

  // Skip private/noindex paths (mirrors proxy.ts PRIVATE_SLUG_KEYS)
  // Check single-segment paths against the set
  if (segments.length > 0 && PRIVATE_PATHS.has(segments[0])) return true;
  // Check multi-segment paths by joining (e.g. "games/create")
  if (segments.length > 1 && PRIVATE_PATHS.has(segments.slice(0, 2).join('/'))) return true;

  // Skip any path containing a dynamic segment [param]
  if (segments.some((s) => s.startsWith('['))) return true;

  return false;
}

// Discover all pages
const pages = findPages(APP_DIR);

// Also include the locale root page (homepage at src/app/[locale]/page.tsx)
if (existsSync(resolve(LOCALE_DIR, 'page.tsx'))) {
  pages.unshift('page.tsx');
}

// Build URL list
const urls = [];
for (const page of pages) {
  const urlPath = pageToPath(page);
  if (!shouldExclude(urlPath)) {
    urls.push(`${BASE}${urlPath}`);
  }
}

// Deduplicate and sort
const unique = [...new Set(urls)].sort();

// Write output
writeFileSync(OUTPUT_FILE, JSON.stringify(unique, null, 2) + '\n');
console.log(`✅ Generated ${unique.length} audit URLs → ${OUTPUT_FILE}`);
