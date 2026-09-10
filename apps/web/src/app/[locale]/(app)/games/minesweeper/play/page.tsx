import type { Metadata } from 'next';
import { buildPageMetadata } from '@/shared/seo/buildPageMetadata';
import { isLocale } from '@/shared/i18n';
import { PageLayout } from '@arcadeum/ui';
import { MinesweeperGameClient } from './MinesweeperGameClient';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  return isLocale(rawLocale)
    ? buildPageMetadata({ locale: rawLocale, page: 'minesweeperPlay' })
    : {};
}

export default async function MinesweeperPlayRoute({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  isLocale(rawLocale);

  return (
    <PageLayout>
      <div className="box-border min-h-screen py-2 sm:py-3">
        <MinesweeperGameClient />
      </div>
    </PageLayout>
  );
}
