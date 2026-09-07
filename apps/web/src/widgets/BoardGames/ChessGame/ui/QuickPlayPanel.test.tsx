import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuickPlayPanel } from './QuickPlayPanel';

describe('QuickPlayPanel', () => {
  it('renders all 6 time control cards', () => {
    render(<QuickPlayPanel onSelectTimeControl={vi.fn()} />);
    expect(screen.getByText('1+0')).toBeDefined();
    expect(screen.getByText('3+0')).toBeDefined();
    expect(screen.getByText('3+2')).toBeDefined();
    expect(screen.getByText('5+0')).toBeDefined();
    expect(screen.getByText('10+0')).toBeDefined();
    expect(screen.getByText('15+10')).toBeDefined();
  });

  it('calls onSelectTimeControl with correct time control when 3+0 is clicked', () => {
    const onSelect = vi.fn();
    render(<QuickPlayPanel onSelectTimeControl={onSelect} />);
    fireEvent.click(screen.getByText('3+0').closest('button')!);
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'blitz',
        initialSeconds: 180,
        incrementSeconds: 0,
      }),
    );
  });

  it('calls onSelectTimeControl with bullet for 1+0', () => {
    const onSelect = vi.fn();
    render(<QuickPlayPanel onSelectTimeControl={onSelect} />);
    fireEvent.click(screen.getByText('1+0').closest('button')!);
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'bullet', initialSeconds: 60 }),
    );
  });

  it('does not call onSelectTimeControl when disabled', () => {
    const onSelect = vi.fn();
    render(<QuickPlayPanel onSelectTimeControl={onSelect} disabled />);
    const button = screen.getByText('1+0').closest('button')!;
    expect(button).toHaveProperty('disabled', true);
  });

  it('renders category badges for each time control type', () => {
    render(<QuickPlayPanel onSelectTimeControl={vi.fn()} />);
    expect(screen.getByText('Bullet')).toBeDefined();
    expect(screen.getByText('Classical')).toBeDefined();
    expect(screen.getByText('Rapid')).toBeDefined();
  });
});
