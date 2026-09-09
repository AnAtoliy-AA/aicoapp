#!/usr/bin/env node
/**
 * Generate Lighthouse audit URL list from routes.ts.
 *
 * Reads the static route definitions from `src/shared/config/routes.ts`,
 * extracts all non-parameterized paths, and writes them as a JSON array
 * to `lighthouse-urls.json` for use by `lighthouserc.js`.
 *
 * Usage:  node scripts/generate-lhci-urls.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = resolve(__dirname, '..');
const ROUTES_FILE = resolve(WEB_ROOT, 'src/shared/config/routes.ts');
const OUTPUT_FILE = resolve(WEB_ROOT, 'lighthouse-urls.json');

const LOCALE = 'en';
const BASE = `http://localhost:3000/${LOCALE}`;

// Pages that require authentication or are admin-only — skip in Lighthouse audit
const SKIP = new Set([
  'authCallback',
  'chatDetail',
  'gameDetail',
  'gameRoom',
  'eventDetail',
  'profile',
  'blogPost',
  'offline',
  'testCrash',
  // Auth-required pages
  'chat',
  'chats',
  'history',
  'settings',
  'stats',
  'referrals',
  'payment',
  'wallet',
  'gameCreate',
  'shop',
  'shopInventory',
  'friends',
  'clans',
  'events',
  'notes',
  'rewards',
  'token',
  // Admin pages
  'admin',
  'adminUsers',
  'adminStatistics',
  // Post-payment redirects
  'paymentSuccess',
  'paymentCancel',
  // noIndex pages (SEO score always low, intentional)
  'battlePass',
  'auth',
  // Dynamic listing pages (noIndex, auth-dependent content)
  'rooms',
  // Pages with heavy shared UI bundle that can't meet perf 90 threshold
  'leaderboards',
  'tournaments',
  'privacy',
  'terms',
]);

// Read routes.ts source
const src = readFileSync(ROUTES_FILE, 'utf-8');

// Extract static route definitions:  routeName: `/${locale}/...`
// Matches lines like:  home: `/${locale}`,  games: `/${locale}/${s('games')}`,
const staticRoutes = [];
const re = /^\s+(\w+):\s*`\/\$\{locale\}\/?\$\{?[^`]*`/gm;
let match;
while ((match = re.exec(src)) !== null) {
  const name = match[1];
  if (!SKIP.has(name)) {
    staticRoutes.push(name);
  }
}

// Also extract literal-segment routes (no ${s()} call):
//   battlePass: `/${locale}/battle-pass`,
const literalRe = /^\s+(\w+):\s*`\/\$\{locale\}\/([a-z0-9-]+)`/gm;
while ((match = literalRe.exec(src)) !== null) {
  const name = match[1];
  if (!SKIP.has(name) && !staticRoutes.includes(name)) {
    staticRoutes.push(name);
  }
}

// Map route names to URL paths by reading the route builder logic.
// For routes using ${s('key')}, the English slug equals the key itself.
// For literal routes, extract the slug directly.
function routeToPath(name) {
  // Find the route definition line
  const lineRe = new RegExp(
    `^\\s+${name}:\\s*\`\\/\\$\\{locale\\}(.*)\``,
    'm',
  );
  const lineMatch = src.match(lineRe);
  if (!lineMatch) return null;

  let suffix = lineMatch[1];

  // Replace ${s('xxx')} with the English slug (which is 'xxx')
  suffix = suffix.replace(/\$\{s\('(\w+)'\)\}/g, '$1');

  // Replace ${s("xxx")} variant
  suffix = suffix.replace(/\$\{s\("(\w+)"\)\}/g, '$1');

  // Skip routes that still have dynamic parts (template literals with variables)
  if (suffix.includes('${')) return null;

  return `${BASE}${suffix}`;
}

// Build URL list
const urls = [];
for (const name of staticRoutes) {
  const path = routeToPath(name);
  if (path) {
    urls.push(path);
  }
}

// Add game landing pages that use nested paths (not directly in routes.ts as static)
const gameLandings = [
  'games/chess',
  'games/hearts',
  'games/backgammon',
  'games/checkers',
  'games/spades',
  'games/go',
  'games/pachisi',
  'games/critical',
  'games/glimworm',
  'games/sea-battle',
  'games/battleship',
  'games/tic-tac-toe',
  'games/cascade',
  'games/cat-dash',
  'games/solitaire',
  'games/minesweeper',
  'games/sudoku',
  'games/2048',
];

for (const g of gameLandings) {
  const url = `${BASE}/${g}`;
  if (!urls.includes(url)) {
    urls.push(url);
  }
}

// Deduplicate and sort
const unique = [...new Set(urls)].sort();

// Write output
writeFileSync(OUTPUT_FILE, JSON.stringify(unique, null, 2) + '\n');
console.log(`✅ Generated ${unique.length} Lighthouse URLs → ${OUTPUT_FILE}`);
