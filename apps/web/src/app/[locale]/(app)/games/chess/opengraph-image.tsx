import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  renderGameOgCard,
} from '@/shared/seo/ogImageTemplate';
import { getTranslations } from '@/shared/i18n/server';
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/shared/i18n';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt =
  'Chess — free multiplayer with Stockfish 19 analysis on Arcadeum';

type Props = { params: Promise<{ locale: string }> };

function resolveLocale(raw: string): Locale {
  return isLocale(raw) ? raw : DEFAULT_LOCALE;
}

const CHESS_BOARD: Array<Array<string | null>> = [
  ['♜', null, '♝', '♛', '♚', '♝', null, '♜'],
  ['♟', '♟', '♟', null, null, '♟', '♟', '♟'],
  [null, null, '♞', '♟', null, '♞', null, null],
  [null, null, null, null, '♟', null, null, null],
  [null, null, '♗', null, '♙', null, null, null],
  [null, null, null, null, null, '♘', null, null],
  ['♙', '♙', '♙', '♙', null, '♙', '♙', '♙'],
  ['♖', '♘', '♗', '♕', '♔', null, null, '♖'],
];

function isBlackPiece(p: string | null): boolean {
  if (!p) return false;
  return '♜♞♝♛♚♟'.includes(p);
}

function ChessVisual() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        position: 'relative',
        padding: 16,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: 360,
          marginBottom: 10,
          padding: '6px 14px',
          borderRadius: 999,
          background: 'rgba(245, 158, 11, 0.12)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 800, color: '#f59e0b' }}>
          STOCKFISH 19 NNUE
        </span>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>
          Eval: +0.4 · Depth 32
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          border: '2px solid rgba(245, 158, 11, 0.35)',
          borderRadius: 14,
          overflow: 'hidden',
          boxShadow: '0 16px 40px rgba(0,0,0,0.7)',
        }}
      >
        {CHESS_BOARD.map((row, ri) => (
          <div key={ri} style={{ display: 'flex' }}>
            {row.map((cell, ci) => {
              const isLight = (ri + ci) % 2 === 0;
              const isHighlighted =
                (ri === 4 && ci === 4) || (ri === 6 && ci === 4);
              return (
                <div
                  key={ci}
                  style={{
                    width: 44,
                    height: 44,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 30,
                    background: isHighlighted
                      ? 'rgba(245, 158, 11, 0.55)'
                      : isLight
                        ? '#f0d9b5'
                        : '#b58863',
                    color: cell && isBlackPiece(cell) ? '#18181b' : '#ffffff',
                    textShadow:
                      cell && !isBlackPiece(cell)
                        ? '0 2px 4px rgba(0,0,0,0.6)'
                        : 'none',
                  }}
                >
                  {cell ?? ''}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: 352,
          marginTop: 6,
          padding: '0 4px',
          fontSize: 11,
          fontWeight: 700,
          color: 'rgba(255,255,255,0.4)',
          letterSpacing: '14px',
        }}
      >
        <span>a</span>
        <span>b</span>
        <span>c</span>
        <span>d</span>
        <span>e</span>
        <span>f</span>
        <span>g</span>
        <span>h</span>
      </div>
    </div>
  );
}

export default async function ChessOpengraphImage({ params }: Props) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const messages = await getTranslations(locale);
  const landing = messages.games?.chess_v1?.landing;
  const gameName = messages.games?.chess_v1?.name ?? 'Chess';

  return renderGameOgCard({
    kicker: 'Classic Strategy · 2 Players',
    title: gameName,
    subtitle:
      landing?.hero?.subtitle ??
      'Free multiplayer chess powered by Stockfish 19 with real-time analysis, bots, and puzzles.',
    accent: '#f59e0b',
    gradient: ['#1c1305', '#0f0a02'],
    badges: [
      'Stockfish 19',
      '20 AI Bots',
      'Chess960',
      'Puzzle Rush',
      'Zero Signup · Free',
    ],
    stats: [
      { label: 'Engine', value: 'SF 19 NNUE' },
      { label: 'Strength', value: '3500+ Elo' },
      { label: 'Variants', value: 'Standard & 960' },
    ],
    visual: <ChessVisual />,
  });
}
