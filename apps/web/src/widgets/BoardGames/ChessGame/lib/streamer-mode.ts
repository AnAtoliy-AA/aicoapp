'use client';

import { useSyncExternalStore, useCallback } from 'react';

const STORAGE_KEY = 'arcadeum_chess_streamer_mode';

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getSnapshot(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

function getServerSnapshot(): boolean {
  return false;
}

function isStreamerUrlParam(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get('overlay') === 'streamer';
  } catch {
    return false;
  }
}

export function useStreamerMode() {
  const storedEnabled = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const isUrlMode = isStreamerUrlParam();
  const enabled = storedEnabled || isUrlMode;

  const setEnabled = useCallback((value: boolean) => {
    try {
      if (value) {
        localStorage.setItem(STORAGE_KEY, '1');
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
      window.dispatchEvent(new Event('storage'));
    } catch {}
  }, []);

  const copyObsUrl = useCallback(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    url.searchParams.set('overlay', 'streamer');
    navigator.clipboard.writeText(url.toString()).catch(() => undefined);
  }, []);

  return { enabled, setEnabled, copyObsUrl, isUrlMode };
}
