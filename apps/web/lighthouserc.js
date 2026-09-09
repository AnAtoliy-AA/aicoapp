const config = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/en',
        'http://localhost:3000/en/games',
        'http://localhost:3000/en/games/chess',
        'http://localhost:3000/en/games/hearts',
        'http://localhost:3000/en/shop',
        'http://localhost:3000/en/blog',
        'http://localhost:3000/en/leaderboards',
        'http://localhost:3000/en/features',
        'http://localhost:3000/en/auth',
        'http://localhost:3000/en/help',
      ],
      settings: {
        chromeFlags:
          '--no-sandbox --disable-gpu --disable-dev-shm-usage --disable-setuid-sandbox',
        preset: 'desktop',
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
