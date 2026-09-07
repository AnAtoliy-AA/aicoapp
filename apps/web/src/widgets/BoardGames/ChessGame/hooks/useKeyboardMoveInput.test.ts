import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useKeyboardMoveInput } from './useKeyboardMoveInput';
import type { LegalMove } from '../types';

const MOCK_LEGAL_MOVES: LegalMove[] = [
  { from: { file: 'e', rank: 2 }, to: { file: 'e', rank: 4 }, promotion: null },
  { from: { file: 'd', rank: 2 }, to: { file: 'd', rank: 4 }, promotion: null },
  { from: { file: 'g', rank: 1 }, to: { file: 'f', rank: 3 }, promotion: null },
];

describe('useKeyboardMoveInput', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('starts inactive', () => {
    const { result } = renderHook(() =>
      useKeyboardMoveInput({
        enabled: true,
        legalMoves: MOCK_LEGAL_MOVES,
        onMove: vi.fn(),
      }),
    );
    expect(result.current.state.active).toBe(false);
  });

  it('onDismiss deactivates and clears state', () => {
    const { result } = renderHook(() =>
      useKeyboardMoveInput({
        enabled: true,
        legalMoves: MOCK_LEGAL_MOVES,
        onMove: vi.fn(),
      }),
    );
    act(() => result.current.onDismiss());
    expect(result.current.state.active).toBe(false);
    expect(result.current.state.inputValue).toBe('');
    expect(result.current.state.error).toBeNull();
  });

  it('onInputChange updates inputValue and clears error', () => {
    const { result } = renderHook(() =>
      useKeyboardMoveInput({
        enabled: true,
        legalMoves: MOCK_LEGAL_MOVES,
        onMove: vi.fn(),
      }),
    );
    act(() => result.current.onInputChange('e2e4'));
    expect(result.current.state.inputValue).toBe('e2e4');
    expect(result.current.state.error).toBeNull();
  });

  it('onSubmit sets error for unparseable input', () => {
    const { result } = renderHook(() =>
      useKeyboardMoveInput({
        enabled: true,
        legalMoves: MOCK_LEGAL_MOVES,
        onMove: vi.fn(),
      }),
    );
    act(() => result.current.onInputChange('xyz'));
    act(() => result.current.onSubmit());
    expect(result.current.state.error).toBeTruthy();
  });

  it('onSubmit sets error for illegal move', () => {
    const { result } = renderHook(() =>
      useKeyboardMoveInput({
        enabled: true,
        legalMoves: MOCK_LEGAL_MOVES,
        onMove: vi.fn(),
      }),
    );
    act(() => result.current.onInputChange('a1a8'));
    act(() => result.current.onSubmit());
    expect(result.current.state.error).toBe('Illegal move');
  });

  it('onSubmit calls onMove and clears state for legal move', () => {
    const onMove = vi.fn();
    const { result } = renderHook(() =>
      useKeyboardMoveInput({
        enabled: true,
        legalMoves: MOCK_LEGAL_MOVES,
        onMove,
      }),
    );
    act(() => result.current.onInputChange('e2e4'));
    act(() => result.current.onSubmit());
    expect(onMove).toHaveBeenCalledWith('e', 2, 'e', 4);
    expect(result.current.state.active).toBe(false);
    expect(result.current.state.error).toBeNull();
  });
});
