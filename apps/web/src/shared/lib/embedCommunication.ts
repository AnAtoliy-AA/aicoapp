/**
 * Communication layer for embeddable game widgets.
 * Games embedded via iframe use postMessage to communicate with the parent page.
 */

export interface EmbedReadyMessage {
  type: 'ready';
}

export interface EmbedGameOverMessage {
  type: 'gameOver';
  result: 'won' | 'lost' | 'draw';
  score?: number;
}

export interface EmbedScoreUpdateMessage {
  type: 'scoreUpdate';
  score: number;
}

export interface EmbedConfigureMessage {
  type: 'configure';
  theme?: 'dark' | 'light';
  size?: 'compact' | 'normal';
}

export type EmbedMessage =
  | EmbedReadyMessage
  | EmbedGameOverMessage
  | EmbedScoreUpdateMessage
  | EmbedConfigureMessage;

/**
 * Send a message from the embedded game to the parent window.
 */
export function sendEmbedMessage(message: EmbedMessage): void {
  if (typeof window === 'undefined') return;
  window.parent.postMessage(message, '*');
}

/**
 * Listen for configuration messages from the parent window.
 */
export function onEmbedMessage(
  handler: (message: EmbedConfigureMessage) => void,
): () => void {
  if (typeof window === 'undefined') return () => {};

  const listener = (event: MessageEvent) => {
    const data = event.data as Partial<EmbedMessage>;
    if (data?.type === 'configure') {
      handler(data as EmbedConfigureMessage);
    }
  };

  window.addEventListener('message', listener);
  return () => window.removeEventListener('message', listener);
}

/**
 * Detect if the current page is running inside an iframe.
 */
export function isEmbedded(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}
