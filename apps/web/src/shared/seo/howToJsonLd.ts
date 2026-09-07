import { appConfig } from '@/shared/config/app-config';
import { SCHEMA_LANGUAGE_MAP } from './schemaLanguageMap';
import type { Locale } from '@/shared/i18n';

interface HowToStep {
  name: string;
  text: string;
  url?: string;
  image?: string;
}

interface BuildHowToJsonLdInput {
  name: string;
  description?: string;
  steps: HowToStep[];
  totalTime?: string;
  locale: Locale;
  pageUrl: string;
}

/**
 * Build a HowTo structured data block for step-by-step guides.
 * Useful for "How to Play" sections on game landing pages.
 */
export function buildHowToJsonLd({
  name,
  description,
  steps,
  totalTime,
  locale,
  pageUrl,
}: BuildHowToJsonLdInput): Record<string, unknown> {
  const fullPageUrl = pageUrl.startsWith('http')
    ? pageUrl
    : `${appConfig.siteUrl}${pageUrl}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    ...(description ? { description } : {}),
    inLanguage: SCHEMA_LANGUAGE_MAP[locale],
    url: fullPageUrl,
    ...(totalTime ? { totalTime } : {}),
    step: steps.map((step, idx) => ({
      '@type': 'HowToStep',
      position: idx + 1,
      name: step.name,
      text: step.text,
      ...(step.url
        ? {
            url: step.url.startsWith('http')
              ? step.url
              : `${appConfig.siteUrl}${step.url}`,
          }
        : {}),
      ...(step.image ? { image: step.image } : {}),
    })),
  };
}
