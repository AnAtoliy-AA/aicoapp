'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from '@/shared/lib/useTranslation';
import {
  type GameLobbyTheme,
  ReusableGameLobby,
} from '@/features/games/ui/ReusableGameLobby';
import {
  LobbyOptionSection,
  LobbyChipGroup,
} from '@/features/games/ui/LobbyOptions';
import { GameThemePicker } from '@/features/games/ui/GameThemePicker';
import type { GameRoomSummary } from '@/shared/types/games';
import { useRoomOptions } from '@/features/games/hooks/useRoomOptions';
import type { BotDifficulty } from '@/features/games/ui/DifficultySelector';
import type { ChessTheme, TimeControl } from '../types';
import { TIME_CONTROLS } from '../types';
import { RulesModal } from './RulesModal';
import { BotSelector, type BotPersonalityOption } from './BotSelector';
import { PgnImportModal } from './PgnImportModal';
import { MatchmakingButton } from './MatchmakingButton';
import { QuickPlayPanel } from './QuickPlayPanel';
import { BOT_PERSONALITIES } from '@arcadeum/games-core/games/chess/chess-bot-personalities';
import { apiClient } from '@/shared/lib/api-client';

const LOBBY_THEME: GameLobbyTheme = {
  titleGradient: 'linear-gradient(90deg, var(--color) 0%, var(--primary) 100%)',
  variantGradient:
    'linear-gradient(90deg, var(--color) 0%, var(--primary) 100%)',
  buttonGradient: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
};

function formatTimeControl(tc: TimeControl | null): string {
  if (!tc) return 'No clock';
  if (tc.type === 'daily') {
    const days = tc.daysPerMove ?? 1;
    return `${days}d`;
  }
  const mins = Math.floor(tc.initialSeconds / 60);
  return tc.incrementSeconds > 0
    ? `${mins}+${tc.incrementSeconds}`
    : `${mins}|0`;
}

interface ChessLobbyProps {
  room: GameRoomSummary;
  userId: string;
  isHost: boolean;
  startBusy: boolean;
  onStartGame: (options?: {
    withBots?: boolean;
    botCount?: number;
    botDifficulty?: BotDifficulty;
    botPersonality?: string;
  }) => void;
  onReorderPlayers?: (newOrder: string[]) => void;
  onLeaveRoom?: () => void;
  onDeleteRoom?: () => void;
  onKickPlayer?: (userId: string) => void;
  onRefresh?: () => void;
  showRulesOpen: boolean;
  onShowRulesClose: () => void;
}

export function ChessLobby({
  room,
  userId,
  isHost,
  startBusy,
  onStartGame,
  onReorderPlayers,
  onLeaveRoom,
  onDeleteRoom,
  onKickPlayer,
  onRefresh,
  showRulesOpen,
  onShowRulesClose,
}: ChessLobbyProps) {
  const { t } = useTranslation();
  const { setOption } = useRoomOptions({ roomId: room.id, userId });
  const [selectedPersonality, setSelectedPersonality] = useState<string | null>(
    null,
  );
  const [showPgnImport, setShowPgnImport] = useState(false);
  const [availableDifficulties, setAvailableDifficulties] = useState<string[]>(
    () => BOT_PERSONALITIES.map((p) => p.difficulty),
  );

  useEffect(() => {
    apiClient
      .get<{ settings: Record<string, Record<string, unknown>> }>(
        '/admin/game-settings',
      )
      .then((data) => {
        const chessSettings = data.settings?.chess_v1;
        if (chessSettings?.availableDifficulties) {
          setAvailableDifficulties(
            chessSettings.availableDifficulties as string[],
          );
        }
      })
      .catch(() => {
        // Use default (all difficulties)
      });
  }, []);

  const personalityOptions: BotPersonalityOption[] = useMemo(
    () =>
      BOT_PERSONALITIES.filter((p) =>
        availableDifficulties.includes(p.difficulty),
      ).map((p) => ({
        id: p.id,
        name: p.name,
        avatar: p.avatar,
        rating: p.rating,
        style: p.style,
      })),
    [availableDifficulties],
  );

  const options = useMemo(() => {
    const raw = (room.gameOptions ?? {}) as Partial<{
      theme: string;
      variant: string;
      timeControl: TimeControl | null;
    }>;
    const validVariants = [
      'standard',
      'chess960',
      'king_of_the_hill',
      'three_check',
      'crazyhouse',
      'atomic',
    ];
    const variant = validVariants.includes(raw.variant ?? '')
      ? (raw.variant as ChessTheme)
      : 'standard';
    return {
      theme: (raw.theme as string) || 'adventure',
      variant,
      timeControl: (raw.timeControl ?? null) as TimeControl | null,
    };
  }, [room.gameOptions]);

  const variantLabel =
    options.variant === 'chess960'
      ? 'Chess960'
      : options.variant === 'king_of_the_hill'
        ? t('games.chess_v1.lobby.kingOfTheHill')
        : options.variant === 'three_check'
          ? t('games.chess_v1.lobby.threeCheck')
          : options.variant === 'crazyhouse'
            ? t('games.chess_v1.lobby.crazyhouse')
            : options.variant === 'atomic'
              ? t('games.chess_v1.lobby.atomic')
              : t('games.chess_v1.lobby.standard');

  const variantOptions = [
    {
      id: 'standard',
      label: t('games.chess_v1.lobby.standard'),
      description: t('games.chess_v1.lobby.standardDesc'),
    },
    {
      id: 'chess960',
      label: t('games.chess_v1.lobby.chess960'),
      description: t('games.chess_v1.lobby.chess960Desc'),
    },
    {
      id: 'king_of_the_hill',
      label: t('games.chess_v1.lobby.kingOfTheHill'),
      description: t('games.chess_v1.lobby.kingOfTheHillDesc'),
    },
    {
      id: 'three_check',
      label: t('games.chess_v1.lobby.threeCheck'),
      description: t('games.chess_v1.lobby.threeCheckDesc'),
    },
    {
      id: 'crazyhouse',
      label: t('games.chess_v1.lobby.crazyhouse'),
      description: t('games.chess_v1.lobby.crazyhouseDesc'),
    },
    {
      id: 'atomic',
      label: t('games.chess_v1.lobby.atomic'),
      description: t('games.chess_v1.lobby.atomicDesc'),
    },
  ];

  const TIME_CONTROL_LABELS: Record<string, string> = {
    bullet: t('games.chess_v1.lobby.bullet'),
    blitz: t('games.chess_v1.lobby.blitz'),
    rapid: t('games.chess_v1.lobby.rapid'),
    classical: t('games.chess_v1.lobby.classical'),
  };

  const timeControlOptions = [
    ...TIME_CONTROLS.map((tc) => ({
      id: `tc-${tc.initialSeconds}-${tc.incrementSeconds}`,
      label: formatTimeControl(tc),
      description: TIME_CONTROL_LABELS[tc.type] ?? tc.type,
      disabled: tc.disabled,
    })),
    {
      id: 'no-clock',
      label: t('games.chess_v1.lobby.noClock'),
      description: t('games.chess_v1.lobby.unlimitedTime'),
      disabled: false,
    },
  ];

  const getSelectedTimeControl = () => {
    if (options.timeControl === null) return 'no-clock';
    return `tc-${options.timeControl.initialSeconds}-${options.timeControl.incrementSeconds}`;
  };

  const handleTimeControlChange = (value: string) => {
    if (value === 'no-clock') {
      setOption({ timeControl: null });
    } else {
      const parts = value.split('-');
      const initial = Number(parts[1]);
      const increment = Number(parts[2]);
      const tc = TIME_CONTROLS.find(
        (t) => t.initialSeconds === initial && t.incrementSeconds === increment,
      );
      if (tc && !tc.disabled) setOption({ timeControl: tc });
    }
  };

  const optionsSlot = (
    <div className="flex flex-col items-stretch gap-4">
      {isHost && (
        <QuickPlayPanel
          disabled={startBusy}
          onSelectTimeControl={(tc) => {
            setOption({ timeControl: tc });
          }}
        />
      )}
      <LobbyOptionSection title={t('games.create.sectionVariant')}>
        <GameThemePicker
          selectedTheme={options.theme}
          onSelect={(themeId) => setOption({ theme: themeId })}
          disabled={!isHost}
        />
      </LobbyOptionSection>
      <LobbyOptionSection title={t('games.chess_v1.lobby.variant')}>
        <LobbyChipGroup
          options={variantOptions}
          value={options.variant}
          onChange={(v) => setOption({ variant: v })}
          disabled={!isHost}
          accentColor="#6366f1"
          testIdPrefix="chess-variant"
        />
      </LobbyOptionSection>

      <LobbyOptionSection title={t('games.chess_v1.lobby.timeControl')}>
        <div className="flex flex-col gap-3">
          {(['bullet', 'blitz', 'rapid', 'classical'] as const).map(
            (category) => {
              const categoryTcs = timeControlOptions.filter(
                (opt) => opt.description === TIME_CONTROL_LABELS[category],
              );
              if (categoryTcs.length === 0) return null;
              return (
                <div key={category} className="flex flex-col gap-1.5">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--textSecondary)] px-1">
                    {TIME_CONTROL_LABELS[category]}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categoryTcs.map((opt) => {
                      const isSelected = getSelectedTimeControl() === opt.id;
                      const isDisabled = opt.disabled;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          disabled={!isHost || isDisabled}
                          onClick={() => handleTimeControlChange(opt.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            isDisabled
                              ? 'opacity-40 cursor-not-allowed border-[var(--glassBorder)] bg-[var(--glassBg)] text-[var(--textMuted)]'
                              : isSelected
                                ? 'border-[rgba(99,102,241,0.5)] bg-[rgba(99,102,241,0.15)] text-[var(--color)]'
                                : 'border-[var(--glassBorder)] bg-[var(--glassBg)] text-[var(--textSecondary)] hover:bg-[var(--glassBgHover)] hover:text-[var(--color)] cursor-pointer'
                          } ${!isHost && !isDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            },
          )}
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={!isHost}
                onClick={() => handleTimeControlChange('no-clock')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  getSelectedTimeControl() === 'no-clock'
                    ? 'border-[rgba(99,102,241,0.5)] bg-[rgba(99,102,241,0.15)] text-[var(--color)]'
                    : 'border-[var(--glassBorder)] bg-[var(--glassBg)] text-[var(--textSecondary)] hover:bg-[var(--glassBgHover)] hover:text-[var(--color)] cursor-pointer'
                } ${!isHost ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                {t('games.chess_v1.lobby.noClock')}
              </button>
            </div>
          </div>
        </div>
      </LobbyOptionSection>

      <LobbyOptionSection title={t('games.chess_v1.lobby.botPersonality')}>
        <BotSelector
          personalities={personalityOptions}
          selectedId={selectedPersonality}
          onSelect={setSelectedPersonality}
          disabled={!isHost}
        />
      </LobbyOptionSection>

      <button
        type="button"
        onClick={() => setShowPgnImport(true)}
        className="w-full py-2 px-4 rounded-lg bg-[var(--backgroundHover)] border border-[var(--glassBorder)] text-[var(--textSecondary)] text-xs font-semibold cursor-pointer hover:text-[var(--color)] transition-colors"
      >
        {t('games.chess_v1.actions.importPgn')}
      </button>

      <MatchmakingButton
        userId={userId}
        rating={1200}
        timeControlType={options.timeControl?.type ?? 'blitz'}
      />
    </div>
  );

  return (
    <>
      <ReusableGameLobby
        room={room}
        userId={userId}
        isHost={isHost}
        startBusy={startBusy}
        onStartGame={(opts) =>
          onStartGame({
            ...opts,
            botDifficulty: opts?.difficulty ?? 'medium',
            botPersonality: selectedPersonality ?? undefined,
          })
        }
        onLeaveRoom={onLeaveRoom}
        onDeleteRoom={onDeleteRoom}
        onKickPlayer={onKickPlayer}
        onRefresh={onRefresh}
        gameName={t('games.chess_v1.name')}
        gameIcon="♟"
        variantName={variantLabel}
        minPlayers={2}
        maxPlayers={2}
        theme={LOBBY_THEME}
        enableBots
        showDifficulty={false}
        labels={{
          startWithBotsLabel: t('games.chess_v1.lobby.startWithBots'),
        }}
        optionsSlot={optionsSlot}
        showInvitedPlayers
        showReorderControls
        onReorderPlayers={onReorderPlayers}
      />
      <RulesModal open={showRulesOpen} onClose={onShowRulesClose} />
      <PgnImportModal
        isOpen={showPgnImport}
        onClose={() => setShowPgnImport(false)}
        onImport={(_moves, _variant) => {
          // PGN import creates a new room with the imported position
        }}
      />
    </>
  );
}
