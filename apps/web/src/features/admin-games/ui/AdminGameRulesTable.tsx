'use client';

import { useCallback, useEffect, useState } from 'react';
import { apiClient } from '@/shared/lib/api-client';

interface RuleItem {
  ruleId: string;
  label: string;
  description?: string;
  enabled: boolean;
}

type RulesByGame = Record<string, RuleItem[]>;
type GameSettings = Record<string, Record<string, unknown>>;

const ALL_DIFFICULTIES = [
  'beginner',
  'easy',
  'intermediate',
  'medium',
  'advanced',
  'strong',
  'hard',
  'master',
  'expert',
] as const;

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: 'Beginner',
  easy: 'Easy',
  intermediate: 'Intermediate',
  medium: 'Medium',
  advanced: 'Advanced',
  strong: 'Strong',
  hard: 'Hard',
  master: 'Master',
  expert: 'Expert',
};

const DEFAULT_ALL_DIFFICULTIES = [...ALL_DIFFICULTIES];
const DEFAULT_AIVSAI_DIFFICULTIES = ['hard', 'master', 'expert'];

export function AdminGameRulesTable() {
  const [rules, setRules] = useState<RulesByGame | null>(null);
  const [settings, setSettings] = useState<GameSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [settingsSaving, setSettingsSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      apiClient.get<{ rules: RulesByGame }>('/admin/game-rules'),
      apiClient.get<{ settings: GameSettings }>('/admin/game-settings'),
    ])
      .then(([rulesData, settingsData]) => {
        setRules(rulesData.rules);
        setSettings(settingsData.settings);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const toggleRule = useCallback(
    async (gameId: string, ruleId: string, enabled: boolean) => {
      setSaving(`${gameId}::${ruleId}`);
      try {
        await apiClient.put(`/admin/game-rules/${gameId}/${ruleId}`, {
          enabled,
        });
        setRules((prev) => {
          if (!prev) return prev;
          const updated = { ...prev };
          updated[gameId] = updated[gameId].map((r) =>
            r.ruleId === ruleId ? { ...r, enabled } : r,
          );
          return updated;
        });
      } catch {
        // revert
      } finally {
        setSaving(null);
      }
    },
    [],
  );

  const updateGameSetting = useCallback(
    async (gameId: string, key: string, value: unknown) => {
      setSettingsSaving(true);
      try {
        const currentSettings = settings?.[gameId] ?? {};
        const newSettings = { ...currentSettings, [key]: value };
        await apiClient.put(`/admin/game-settings/${gameId}`, {
          settings: newSettings,
        });
        setSettings((prev) => {
          if (!prev) return prev;
          return { ...prev, [gameId]: newSettings };
        });
      } catch {
        // revert
      } finally {
        setSettingsSaving(false);
      }
    },
    [settings],
  );

  const toggleDifficulty = useCallback(
    (gameId: string, settingKey: string, difficulty: string) => {
      const currentList = (settings?.[gameId]?.[settingKey] as string[]) ?? [];
      const newList = currentList.includes(difficulty)
        ? currentList.filter((d) => d !== difficulty)
        : [...currentList, difficulty];
      updateGameSetting(gameId, settingKey, newList);
    },
    [settings, updateGameSetting],
  );

  if (loading) {
    return (
      <div className="text-center py-12 text-[var(--colorTextSecondary,#71717a)]">
        Loading...
      </div>
    );
  }

  if (!rules || Object.keys(rules).length === 0) {
    return (
      <div className="text-center py-12 text-[var(--colorTextSecondary,#71717a)]">
        No games with configurable rules found.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 mt-4">
      {Object.entries(rules).map(([gameId, gameRules]) => {
        const gameSettings = settings?.[gameId];
        const isChess = gameId === 'chess_v1';
        const availableDifficulties =
          (gameSettings?.availableDifficulties as string[]) ??
          DEFAULT_ALL_DIFFICULTIES;
        const aivsaiDifficulties =
          (gameSettings?.aivsaiDifficulties as string[]) ??
          DEFAULT_AIVSAI_DIFFICULTIES;

        return (
          <div
            key={gameId}
            className="bg-[var(--colorCard,#1c1c1e)] rounded-xl border border-[var(--borderColor)] overflow-hidden"
          >
            <div className="py-4 px-5 border-b border-[var(--borderColor)] flex flex-row justify-between items-center bg-[var(--backgroundFocus)]">
              <h3 className="text-base font-semibold text-[var(--colorText,#e4e4e7)] capitalize m-0">
                {gameId.replace('_v1', '').replace(/_/g, ' ')}
              </h3>
              <span className="text-xs text-[var(--colorTextSecondary,#71717a)] font-mono">
                {gameRules.filter((r) => r.enabled).length}/{gameRules.length}{' '}
                enabled
              </span>
            </div>
            <div className="py-2 divide-y divide-[rgba(255,255,255,0.04)]">
              {gameRules.map((rule) => {
                const isSaving = saving === `${gameId}::${rule.ruleId}`;
                return (
                  <div
                    key={rule.ruleId}
                    className="py-3 px-5 flex flex-row justify-between items-center hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                  >
                    <div>
                      <div
                        className={`text-sm font-medium ${
                          rule.enabled
                            ? 'text-[var(--colorText,#e4e4e7)]'
                            : 'text-[var(--colorTextSecondary,#71717a)]'
                        } ${rule.description ? 'cursor-help' : 'cursor-default'}`}
                        title={rule.description}
                      >
                        {rule.label}
                      </div>
                      <div className="text-xs font-mono text-[var(--colorTextSecondary,#71717a)] mt-0.5">
                        {rule.ruleId}
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() =>
                        toggleRule(gameId, rule.ruleId, !rule.enabled)
                      }
                      className={`px-4 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        isSaving
                          ? 'opacity-60 cursor-not-allowed'
                          : 'cursor-pointer'
                      } ${
                        rule.enabled
                          ? 'border-rose-500/40 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                          : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                      }`}
                    >
                      {rule.enabled ? 'Exclude' : 'Include'}
                    </button>
                  </div>
                );
              })}
            </div>

            {isChess && (
              <div className="py-4 px-5 border-t border-[var(--borderColor)]">
                <h4 className="text-sm font-semibold text-[var(--colorText,#e4e4e7)] mb-3">
                  AI Configuration
                </h4>

                <div className="mb-4">
                  <div className="text-xs text-[var(--colorTextSecondary,#71717a)] mb-2">
                    Available Difficulties (bot selector)
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ALL_DIFFICULTIES.map((diff) => {
                      const isActive = availableDifficulties.includes(diff);
                      return (
                        <button
                          key={diff}
                          type="button"
                          disabled={settingsSaving}
                          onClick={() =>
                            toggleDifficulty(
                              gameId,
                              'availableDifficulties',
                              diff,
                            )
                          }
                          className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                            isActive
                              ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-400'
                              : 'border-[var(--borderColor)] bg-[var(--backgroundFocus)] text-[var(--colorTextSecondary,#71717a)]'
                          }`}
                        >
                          {DIFFICULTY_LABELS[diff]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-[var(--colorTextSecondary,#71717a)] mb-2">
                    AI vs AI Difficulties
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ALL_DIFFICULTIES.map((diff) => {
                      const isActive = aivsaiDifficulties.includes(diff);
                      return (
                        <button
                          key={diff}
                          type="button"
                          disabled={settingsSaving}
                          onClick={() =>
                            toggleDifficulty(
                              gameId,
                              'aivsaiDifficulties',
                              diff,
                            )
                          }
                          className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                            isActive
                              ? 'border-amber-500/40 bg-amber-500/10 text-amber-400'
                              : 'border-[var(--borderColor)] bg-[var(--backgroundFocus)] text-[var(--colorTextSecondary,#71717a)]'
                          }`}
                        >
                          {DIFFICULTY_LABELS[diff]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
