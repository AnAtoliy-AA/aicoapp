import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PlatformComparisonTable } from './PlatformComparisonTable';

const meta: Meta<typeof PlatformComparisonTable> = {
  title: 'Shared/PlatformComparisonTable',
  component: PlatformComparisonTable,
  tags: ['autodocs'],
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};

export default meta;
type Story = StoryObj<typeof PlatformComparisonTable>;

export const ChessComparison: Story = {
  args: {
    title: 'Arcadeum vs Chess.com vs Lichess',
    kicker: 'Platform Comparison',
    subtitle: 'Transparent feature comparison for modern chess players.',
    columns: [
      { key: 'arcadeum', name: 'Arcadeum', isHighlighted: true, badge: 'Recommended', subtext: 'Free & Open' },
      { key: 'chesscom', name: 'Chess.com', subtext: 'Commercial' },
      { key: 'lichess', name: 'Lichess', subtext: 'Open Source' },
    ],
    rows: [
      {
        feature: 'Stockfish 19 Engine',
        hint: 'SFNNv16 neural network',
        values: { arcadeum: 'Stockfish 19', chesscom: 'Stockfish 16 (Diamond)', lichess: 'Stockfish 16' },
      },
      {
        feature: 'Full Game Review & Accuracy',
        hint: 'Move classification & eval graphs',
        values: { arcadeum: 'Free Unlimited', chesscom: '1/day Free (Paywall)', lichess: 'Free' },
      },
      {
        feature: '100% Ad-Free Experience',
        values: { arcadeum: true, chesscom: false, lichess: true },
      },
      {
        feature: 'Guest Play & No Friction Join',
        hint: 'Instant room URL challenge',
        values: { arcadeum: true, chesscom: false, lichess: true },
      },
      {
        feature: '20 AI Personalities',
        hint: 'Rated 250 to 3200 Elo',
        values: { arcadeum: 'Free All', chesscom: 'Diamond Tier', lichess: 'Standard Levels' },
      },
      {
        feature: '7-Piece Endgame Tablebases',
        values: { arcadeum: true, chesscom: false, lichess: true },
      },
    ],
  },
};
