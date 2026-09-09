import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PlatformComparisonTable } from './PlatformComparisonTable';

describe('PlatformComparisonTable', () => {
  const mockColumns = [
    { key: 'arcadeum', name: 'Arcadeum', isHighlighted: true, badge: 'Recommended' },
    { key: 'competitor', name: 'Other' },
  ];

  const mockRows = [
    {
      feature: 'Engine',
      hint: 'Stockfish version',
      values: { arcadeum: 'Stockfish 19', competitor: 'Stockfish 16' },
    },
    {
      feature: 'Ad Free',
      values: { arcadeum: true, competitor: false },
    },
  ];

  it('renders title, columns, and rows', () => {
    render(
      <PlatformComparisonTable
        title="Platform Comparison"
        kicker="Feature Matrix"
        subtitle="See how we compare"
        columns={mockColumns}
        rows={mockRows}
      />,
    );

    expect(screen.getByText('Platform Comparison')).toBeInTheDocument();
    expect(screen.getByText('Feature Matrix')).toBeInTheDocument();
    expect(screen.getByText('See how we compare')).toBeInTheDocument();
    expect(screen.getByText('Arcadeum')).toBeInTheDocument();
    expect(screen.getByText('Recommended')).toBeInTheDocument();
    expect(screen.getByText('Other')).toBeInTheDocument();
    expect(screen.getByText('Engine')).toBeInTheDocument();
    expect(screen.getByText('Stockfish version')).toBeInTheDocument();
    expect(screen.getByText('Stockfish 19')).toBeInTheDocument();
    expect(screen.getByText('Stockfish 16')).toBeInTheDocument();
    expect(screen.getByLabelText('Supported')).toBeInTheDocument();
    expect(screen.getByLabelText('Not supported')).toBeInTheDocument();
  });

  it('returns null when rows or columns are empty', () => {
    const { container: c1 } = render(<PlatformComparisonTable columns={[]} rows={mockRows} />);
    expect(c1.firstChild).toBeNull();

    const { container: c2 } = render(<PlatformComparisonTable columns={mockColumns} rows={[]} />);
    expect(c2.firstChild).toBeNull();
  });
});
