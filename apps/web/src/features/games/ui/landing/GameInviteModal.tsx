'use client';

import { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  Button,
} from '@arcadeum/ui';

interface GameInviteModalProps {
  open: boolean;
  onClose: () => void;
  gameId: string;
  gameTitle: string;
}

function SvgQrCode() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="w-40 h-40 rounded-xl bg-white p-2 shadow-lg"
      aria-label="QR Code to join game"
    >
      <rect x="10" y="10" width="24" height="24" fill="#09090b" rx="2" />
      <rect x="14" y="14" width="16" height="16" fill="#ffffff" rx="1" />
      <rect x="18" y="18" width="8" height="8" fill="#09090b" rx="1" />

      <rect x="66" y="10" width="24" height="24" fill="#09090b" rx="2" />
      <rect x="70" y="14" width="16" height="16" fill="#ffffff" rx="1" />
      <rect x="74" y="18" width="8" height="8" fill="#09090b" rx="1" />

      <rect x="10" y="66" width="24" height="24" fill="#09090b" rx="2" />
      <rect x="14" y="70" width="16" height="16" fill="#ffffff" rx="1" />
      <rect x="18" y="74" width="8" height="8" fill="#09090b" rx="1" />

      <rect x="42" y="14" width="6" height="10" fill="#09090b" />
      <rect x="52" y="10" width="6" height="18" fill="#09090b" />
      <rect x="42" y="32" width="16" height="6" fill="#09090b" />
      <rect x="14" y="44" width="12" height="6" fill="#09090b" />
      <rect x="34" y="44" width="8" height="8" fill="#09090b" />
      <rect x="50" y="44" width="10" height="6" fill="#09090b" />
      <rect x="70" y="42" width="16" height="8" fill="#09090b" />
      <rect x="44" y="58" width="12" height="6" fill="#09090b" />
      <rect x="62" y="58" width="8" height="16" fill="#09090b" />
      <rect x="76" y="66" width="14" height="8" fill="#09090b" />
      <rect x="42" y="74" width="12" height="12" fill="#09090b" />
      <rect x="62" y="80" width="12" height="8" fill="#09090b" />
      <rect x="80" y="82" width="10" height="8" fill="#09090b" />
    </svg>
  );
}

export function GameInviteModal({
  open,
  onClose,
  gameId,
  gameTitle,
}: GameInviteModalProps) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return `https://arcadeum.games/en/games/${gameId}`;
  };

  const handleCopy = async () => {
    const url = getShareUrl();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    }
  };

  const handleNativeShare = async () => {
    const url = getShareUrl();
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `Play ${gameTitle} on Arcadeum`,
          text: `Join me for an instant game of ${gameTitle} on Arcadeum! Zero signup or download needed.`,
          url,
        });
      } catch {
        // user aborted or not supported
      }
    }
  };

  const canNativeShare =
    typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  return (
    <Modal open={open} onClose={onClose}>
      <ModalContent maxWidth={480} data-testid="game-invite-modal-content">
        <ModalHeader onClose={onClose}>
          <ModalTitle>Invite a Friend to {gameTitle}</ModalTitle>
        </ModalHeader>

        <ModalBody>
          <div className="flex flex-col items-center gap-6 py-2 text-center">
            <SvgQrCode />

            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color)]">
                Instant Guest Access
              </span>
              <p className="m-0 text-sm text-[var(--foreground)] opacity-90 max-w-sm">
                Scan this QR code from mobile, or copy the link below to play
                directly in browser with no registration.
              </p>
            </div>

            <div className="flex w-full items-center gap-2 rounded-xl border border-[var(--borderColor)] bg-[var(--surfaceBackground)]/50 p-2">
              <input
                type="text"
                readOnly
                value={getShareUrl()}
                className="flex-1 bg-transparent px-2 text-xs font-mono text-[var(--foreground)] outline-none"
                aria-label="Share URL"
              />
              <Button
                variant={copied ? 'victory' : 'primary'}
                size="sm"
                onClick={handleCopy}
              >
                {copied ? 'Copied! ✓' : 'Copy Link'}
              </Button>
            </div>

            {canNativeShare ? (
              <Button
                variant="outline"
                size="md"
                className="w-full"
                onClick={handleNativeShare}
              >
                Share via Apps / Messages 📱
              </Button>
            ) : null}
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant="secondary" size="md" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
