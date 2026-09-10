'use client';

import { type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import BrowserRegistry from '@/app/BrowserRegistry';
import { StatsReplay } from '@/shared/ui/StatsReplay';
import { RootModals } from '@/app/[locale]/RootModals';

/**
 * Paths (or prefixes) that require the full interactive shell:
 * socket.io, stats replay, modals, etc.
 *
 * Public / static pages skip all of these to keep the JS bundle small.
 */
const INTERACTIVE_PREFIXES = [
  '/games/',
  '/rooms',
  '/chat',
  '/chats',
  '/friends',
  '/clans',
  '/stats',
  '/leaderboards',
  '/history',
  '/settings',
  '/wallet',
  '/shop',
  '/payment',
  '/rewards',
  '/referrals',
  '/replays',
  '/events',
  '/tournaments',
  '/battle-pass',
  '/notes',
  '/token',
];

function needsInteractive(pathname: string | null): boolean {
  if (!pathname) return true;
  const lower = pathname.toLowerCase();
  return INTERACTIVE_PREFIXES.some((p) => lower.startsWith(p));
}

/**
 * Mounts BrowserRegistry (socket.io + SW + token refresh), StatsReplay, and
 * RootModals only on pages that actually need them.  Static / public pages
 * (terms, privacy, help, blog, games catalog, game landings, etc.) get a
 * much lighter client bundle.
 */
export function InteractiveShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const interactive = needsInteractive(pathname);

  if (!interactive) {
    return <>{children}</>;
  }

  return (
    <BrowserRegistry>
      {children}
      <RootModals />
      <StatsReplay />
    </BrowserRegistry>
  );
}
