'use client';

import type { UseKeyboardMoveInputResult } from '../hooks/useKeyboardMoveInput';

interface ChessKeyboardInputProps {
  keyboardInput: UseKeyboardMoveInputResult;
}

export function ChessKeyboardInput({ keyboardInput }: ChessKeyboardInputProps) {
  const { state, inputRef, onInputChange, onSubmit, onDismiss } = keyboardInput;
  if (!state.active) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center pb-16 pointer-events-none">
      <div className="pointer-events-auto flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-black/85 border border-white/20 backdrop-blur-xl shadow-2xl">
        <span className="text-[10px] font-bold text-[var(--textSecondary)] uppercase tracking-wider">
          Enter move (e.g. e2e4)
        </span>
        <div className="flex items-center gap-2">
          <input
            id="chess-keyboard-move-input"
            ref={inputRef}
            type="text"
            value={state.inputValue}
            maxLength={5}
            placeholder="e2e4"
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSubmit();
              if (e.key === 'Escape') onDismiss();
            }}
            className="w-24 px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white font-mono text-sm text-center focus:outline-none focus:border-amber-400/60"
          />
          <button
            type="button"
            onClick={onSubmit}
            className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-bold cursor-pointer hover:bg-amber-500/30 transition-colors"
          >
            Go
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="px-2 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[var(--textSecondary)] text-xs cursor-pointer hover:bg-white/10 transition-colors"
          >
            Esc
          </button>
        </div>
        {state.error && (
          <span className="text-[10px] text-red-400 font-medium">
            {state.error}
          </span>
        )}
      </div>
    </div>
  );
}
