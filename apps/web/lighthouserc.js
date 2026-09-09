/* eslint-disable @typescript-eslint/no-require-imports */
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');

// Load URLs generated from routes.ts — run `node scripts/generate-lhci-urls.mjs` first
const urlsPath = resolve(__dirname, 'lighthouse-urls.json');
let urls;
try {
  urls = JSON.parse(readFileSync(urlsPath, 'utf-8'));
} catch {
  // Fallback: hardcoded list if generated file doesn't exist
  urls = [
    'http://localhost:3000/en',
    'http://localhost:3000/en/games',
    'http://localhost:3000/en/games/chess',
    'http://localhost:3000/en/shop',
    'http://localhost:3000/en/blog',
    'http://localhost:3000/en/help',
  ];
}

const config = {
  ci: {
    collect: {
      url: urls,
      settings: {
        chromeFlags:
          '--no-sandbox --disable-gpu --disable-dev-shm-usage --disable-setuid-sandbox',
        preset: 'desktop',
        numberOfRuns: 1,
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minValue: 90, maxError: 0 }],
        'categories:accessibility': ['error', { minValue: 100, maxError: 0 }],
        'categories:seo': ['error', { minValue: 100, maxError: 0 }],
        'categories:best-practices': ['error', { minValue: 100, maxError: 0 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
    server: {
      basePort: 3000,
    },
  },
};

module.exports = config;
