'use client';

import { useState } from 'react';
import { EmotePicker, type EmoteId } from './EmotePicker';
import { QuickButton, QuickButtonText, QuickRow } from './GameChat.styles';

const QUICK_PHRASES = ['gl hf', 'nice play', 'thinking…', 'gg'];

interface ChatQuickBarProps {
  onEmote?: (emoteId: EmoteId) => void;
  onQuickPhrase: (phrase: string) => void;
  /** True when the user may send chat messages (player or authenticated). */
  canSend?: boolean;
}

export function ChatQuickBar({
  onEmote,
  onQuickPhrase,
  canSend = true,
}: ChatQuickBarProps) {
  const [emoteOpen, setEmoteOpen] = useState(false);

  if (emoteOpen && onEmote) {
    return (
      <EmotePicker
        onEmote={(id) => {
          onEmote(id);
          setEmoteOpen(false);
        }}
      />
    );
  }

  return (
    <QuickRow role="toolbar" aria-label="Quick phrases">
      <QuickButton
        onClick={() => {
          if (canSend) {
            setEmoteOpen(true);
          }
        }}
        aria-label={canSend ? 'Send emote' : 'Sign in to react'}
        title={canSend ? undefined : 'Sign in to react'}
        className={!canSend ? 'opacity-50 cursor-not-allowed' : undefined}
      >
        <QuickButtonText>😀</QuickButtonText>
      </QuickButton>
      {QUICK_PHRASES.map((p) => (
        <QuickButton key={p} onClick={() => onQuickPhrase(p)} aria-label={p}>
          <QuickButtonText>{p}</QuickButtonText>
        </QuickButton>
      ))}
    </QuickRow>
  );
}
