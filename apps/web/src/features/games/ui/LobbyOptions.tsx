'use client';

import React from 'react';
import { Button } from '@arcadeum/ui';
import { cx } from '@arcadeum/ui/utils/cx';

interface LobbyOptionSectionProps {
  title: string;
  children: React.ReactNode;
  hint?: string;
}

export function LobbyOptionSection({
  title,
  children,
  hint,
}: LobbyOptionSectionProps) {
  return (
    <div className="flex flex-col items-stretch gap-2 w-full">
      <span className="text-xs font-bold uppercase tracking-wider text-[var(--textPrimary)]">
        {title}
      </span>
      {children}
      {hint && (
        <span className="text-[11px] text-[var(--textMuted)]">{hint}</span>
      )}
    </div>
  );
}

interface ChipOption {
  id: string;
  label: string;
  emoji?: string;
  description?: string;
  comingSoon?: boolean;
}

interface LobbyChipGroupProps {
  options: ChipOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  accentColor?: string;
  testIdPrefix?: string;
}

export function LobbyChipGroup({
  options,
  value,
  onChange,
  disabled = false,
  testIdPrefix = 'chip',
}: LobbyChipGroupProps) {
  return (
    <div className="flex flex-row items-stretch gap-2 flex-wrap">
      {options.map((option) => {
        const isActive = value === option.id;
        const isDisabled = disabled || option.comingSoon;
        return (
          <Button
            className={cx(
              'rounded-xl font-semibold text-xs px-3.5 py-2 transition-all',
              isActive
                ? 'bg-indigo-500/20 border-indigo-500 text-white ring-1 ring-indigo-500/60 shadow-sm'
                : 'bg-[var(--surface)]/90 backdrop-blur-md border-[var(--glassBorder)] text-[var(--textSecondary)] hover:bg-[var(--surfaceHover)] hover:text-[var(--textPrimary)] hover:border-white/30',
              option.comingSoon && 'opacity-40 cursor-not-allowed',
              disabled && !isActive && 'opacity-50 cursor-not-allowed',
            )}
            key={option.id}
            variant="chip"
            size="sm"
            data-testid={`${testIdPrefix}-${option.id}`}
            data-active={isActive ? 'on' : undefined}
            disabled={isDisabled}
            onClick={() => !isDisabled && onChange(option.id)}
          >
            {option.emoji && <span className="-mr-1.5">{option.emoji}</span>}
            {option.label}
            {option.comingSoon && (
              <span className="-ml-1 text-[10px] uppercase font-bold tracking-wider opacity-80">
                Coming Soon
              </span>
            )}
          </Button>
        );
      })}
    </div>
  );
}

interface LobbyToggleProps {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  hint?: string;
}

export function LobbyToggle({
  label,
  checked,
  onCheckedChange,
  disabled = false,
  hint,
}: LobbyToggleProps) {
  return (
    <div className="flex flex-col items-stretch gap-1">
      <label className="flex flex-row items-center gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onCheckedChange(e.target.checked)}
          className={cx(
            'w-4 h-4 rounded accent-indigo-500',
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
          )}
        />
        <span
          className={cx(
            'text-sm font-medium',
            disabled ? 'text-[var(--textMuted)]' : 'text-[var(--textPrimary)]',
          )}
        >
          {label}
        </span>
      </label>
      {hint && <span className="text-xs text-[var(--textMuted)]">{hint}</span>}
    </div>
  );
}
