import { appConfig } from '@/shared/config/app-config';
import { buildRoutes } from '@/shared/config/routes';
import type { Locale } from '@/shared/i18n';

interface BuildVideoGameJsonLdInput {
  gameId: string;
  gameName: string;
  description?: string;
  /** Minimum number of players supported (defaults to 2). */
  minPlayers?: number;
  /** Maximum number of players supported (defaults to 6). */
  maxPlayers?: number;
  /** Genre/category (defaults to "Strategy"). */
  genre?: string;
  /** Alternate names for SEO (e.g. ["Battleship", "Sea Battle Online"]). */
  alternateName?: string[];
  /** Locale to render breadcrumbs in. */
  locale: Locale;
  breadcrumb: {
    home: string;
    games: string;
    game: string;
  };
  featureList?: string[];
  screenshot?: string;
}

export function buildVideoGameJsonLd({
  gameId,
  gameName,
  description,
  minPlayers = 2,
  maxPlayers = 6,
  genre = 'Strategy',
  alternateName,
  featureList,
  screenshot,
  locale,
  breadcrumb,
}: BuildVideoGameJsonLdInput): Record<string, unknown>[] {
  const routes = buildRoutes(locale);
  const pageUrl = `${appConfig.siteUrl}${routes.gameDetail(gameId)}`;
  const image =
    screenshot ??
    `${appConfig.siteUrl}/${locale}/games/${gameId.replace(/_v\d+$/, '')}/opengraph-image`;

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'VideoGame',
      name: gameName,
      alternateName,
      description,
      url: pageUrl,
      image,
      genre,
      inLanguage: locale,
      gamePlatform: ['Web Browser', 'Desktop', 'Mobile'],
      operatingSystem: 'Any',
      applicationCategory: 'GameApplication',
      playMode: ['MultiPlayer', 'SinglePlayer'],
      numberOfPlayers: {
        '@type': 'QuantitativeValue',
        minValue: minPlayers,
        maxValue: maxPlayers,
      },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
      publisher: {
        '@type': 'Organization',
        name: appConfig.appName,
        url: appConfig.siteUrl,
      },
      softwareHelp: {
        '@type': 'WebPage',
        url: `${appConfig.siteUrl}${routes.support}`,
      },
      ...(featureList && featureList.length > 0 ? { featureList } : {}),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: breadcrumb.home,
          item: `${appConfig.siteUrl}${routes.home}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: breadcrumb.games,
          item: `${appConfig.siteUrl}${routes.games}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: breadcrumb.game,
          item: pageUrl,
        },
      ],
    },
  ];
}
