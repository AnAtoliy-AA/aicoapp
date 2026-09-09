const config = {
  ci: {
    collect: {
      url: [
        // Main
        'http://localhost:3000/en',
        'http://localhost:3000/en/games',
        'http://localhost:3000/en/games/create',
        // Game landings
        'http://localhost:3000/en/games/chess',
        'http://localhost:3000/en/games/hearts',
        'http://localhost:3000/en/games/backgammon',
        'http://localhost:3000/en/games/checkers',
        'http://localhost:3000/en/games/spades',
        'http://localhost:3000/en/games/go',
        'http://localhost:3000/en/games/pachisi',
        'http://localhost:3000/en/games/critical',
        'http://localhost:3000/en/games/glimworm',
        'http://localhost:3000/en/games/sea-battle',
        'http://localhost:3000/en/games/battleship',
        'http://localhost:3000/en/games/tic-tac-toe',
        'http://localhost:3000/en/games/cascade',
        'http://localhost:3000/en/games/cat-dash',
        'http://localhost:3000/en/games/solitaire',
        'http://localhost:3000/en/games/minesweeper',
        'http://localhost:3000/en/games/sudoku',
        'http://localhost:3000/en/games/2048',
        // Commerce
        'http://localhost:3000/en/shop',
        'http://localhost:3000/en/shop/inventory',
        'http://localhost:3000/en/payment',
        // Content
        'http://localhost:3000/en/blog',
        'http://localhost:3000/en/leaderboards',
        'http://localhost:3000/en/tournaments',
        'http://localhost:3000/en/rewards',
        'http://localhost:3000/en/battle-pass',
        'http://localhost:3000/en/community',
        'http://localhost:3000/en/notes',
        'http://localhost:3000/en/roadmap',
        'http://localhost:3000/en/changelog',
        'http://localhost:3000/en/token',
        // Features
        'http://localhost:3000/en/features',
        'http://localhost:3000/en/developers',
        // Legal & Support
        'http://localhost:3000/en/help',
        'http://localhost:3000/en/support',
        'http://localhost:3000/en/contact',
        'http://localhost:3000/en/terms',
        'http://localhost:3000/en/privacy',
        'http://localhost:3000/en/cookies',
        // Auth (noIndex but auditable)
        'http://localhost:3000/en/auth',
        // User (auth-required but auditable for perf/a11y)
        'http://localhost:3000/en/settings',
        'http://localhost:3000/en/history',
        'http://localhost:3000/en/stats',
        'http://localhost:3000/en/wallet',
        'http://localhost:3000/en/friends',
        'http://localhost:3000/en/clans',
        'http://localhost:3000/en/events',
        'http://localhost:3000/en/referrals',
      ],
      settings: {
        chromeFlags:
          '--no-sandbox --disable-gpu --disable-dev-shm-usage --disable-setuid-sandbox',
        preset: 'desktop',
        numberOfRuns: 1,
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minValue: 80 }],
        'categories:accessibility': ['warn', { minValue: 85 }],
        'categories:seo': ['warn', { minValue: 80 }],
        'categories:best-practices': ['warn', { minValue: 85 }],
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
