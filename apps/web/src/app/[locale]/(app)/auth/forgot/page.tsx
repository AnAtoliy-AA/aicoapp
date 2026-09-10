import { Suspense } from 'react';
import type { Metadata } from 'next';
import { buildPageMetadata } from '@/shared/seo/buildPageMetadata';
import { isLocale } from '@/shared/i18n';
import ForgotPasswordClient from '@/features/auth/ui/ForgotPasswordClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale)
    ? buildPageMetadata({ locale, page: 'authForgot' })
    : {};
}

export default function ForgotRoute() {
  return (
    <Suspense fallback={null}>
      <ForgotPasswordClient />
    </Suspense>
  );
}
