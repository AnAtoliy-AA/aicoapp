import { describe, it, expect } from 'vitest';
import { buildVideoGameJsonLd } from '../videoGameJsonLd';
import { buildFaqPageJsonLd } from '../faqPageJsonLd';

describe('SEO JSON-LD builders', () => {
  it('builds comprehensive VideoGame schema with features and platforms', () => {
    const jsonLd = buildVideoGameJsonLd({
      gameId: 'chess_v1',
      gameName: 'Chess',
      description: 'The classic strategy board game',
      locale: 'en',
      minPlayers: 2,
      maxPlayers: 2,
      genre: 'Board Game',
      alternateName: ['Chess Online'],
      featureList: ['Stockfish 19', 'Chess960'],
      breadcrumb: {
        home: 'Home',
        games: 'Games',
        game: 'Chess',
      },
    });

    expect(jsonLd).toHaveLength(2);
    const videoGame = jsonLd[0];
    expect(videoGame['@type']).toBe('VideoGame');
    expect(videoGame['name']).toBe('Chess');
    expect(videoGame['gamePlatform']).toEqual([
      'Web Browser',
      'Desktop',
      'Mobile',
    ]);
    expect(videoGame['featureList']).toEqual(['Stockfish 19', 'Chess960']);

    const breadcrumbs = jsonLd[1];
    expect(breadcrumbs['@type']).toBe('BreadcrumbList');
  });

  it('builds FAQPage schema with questions and accepted answers', () => {
    const faqLd = buildFaqPageJsonLd({
      pageName: 'Chess',
      pageUrl: '/en/games/chess',
      faqs: [
        {
          question: 'Is Chess free?',
          answer: 'Yes, 100% free with no install or signup.',
        },
      ],
    });

    expect(faqLd).toHaveLength(2);
    const faqPage = faqLd[0];
    expect(faqPage['@type']).toBe('FAQPage');
    const mainEntity = faqPage['mainEntity'] as Array<Record<string, unknown>>;
    expect(mainEntity).toHaveLength(1);
    expect(mainEntity[0]['@type']).toBe('Question');
    expect(mainEntity[0]['name']).toBe('Is Chess free?');
  });
});
