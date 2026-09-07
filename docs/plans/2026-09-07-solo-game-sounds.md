# Plan: Add Real Sound Effects to All Games

## Context

Currently only Chess has sound infrastructure (`ChessSoundManager`) but its MP3 files don't exist on disk. Solo puzzle games only play win/lose via `GameResultModal`. The 13 other multiplayer games have zero audio feedback. The GameMusic widget's fallback tracks 404 because they're CDN-hosted and only 1 local MP3 exists.

**Goal:** Add real, downloaded (not synthesized) sound effects to all 17 games (4 solo + 13 multiplayer) using free CC0/royalty-free assets.

---

## Phase 1: Download & Organize Sound Assets

### Source: Kenney's "54 Casino Sound Effects" (CC0) + "Board and Card Game FX" by Verdillo

Download and organize into `apps/web/public/sounds/`:

```
sounds/
├── shared/           # Reusable across games
│   ├── click.wav           # UI button press
│   ├── success.wav         # Generic positive feedback
│   ├── error.wav           # Generic negative feedback
│   ├── notification.wav    # Alert / your turn
│   └── game-start.wav      # Round begin
├── cards/            # Card games (Hearts, Spades, Cascade, Critical, Solitaire)
│   ├── deal.wav            # Card dealt from hand
│   ├── flip.wav            # Card face reveal
│   ├── play.wav            # Card placed on table
│   ├── shuffle.wav         # Deck shuffle
│   └── collect.wav         # Trick/winnings collected
├── board/            # Board games (Chess, Checkers, Backgammon, Go, Pachisi, TicTacToe)
│   ├── move.wav            # Piece placed / moved
│   ├── capture.wav         # Piece captured
│   ├── select.wav          # Piece selected
│   └── crown.wav           # Piece promoted / kinged
├── dice/             # Dice games (Backgammon, Pachisi, Cat Dash)
│   ├── roll.wav            # Dice roll
│   └── shake.wav           # Dice shake in hand
├── puzzle/           # Solo puzzles (Solitaire, Minesweeper, Sudoku, 2048)
│   ├── reveal.wav          # Cell revealed / tile appeared
│   ├── place.wav           # Digit placed / card placed
│   ├── slide.wav           # Tile slide (2048)
│   ├── merge.wav           # Tile merge (2048)
│   ├── flag.wav            # Flag placed (Minesweeper)
│   └── flip.wav            # Card flip (Solitaire)
├── battle/           # Battle games (Sea Battle, Critical)
│   ├── hit.wav             # Attack success
│   ├── miss.wav            # Attack missed
│   ├── sink.wav            # Ship destroyed
│   ├── explode.wav         # Explosion
│   └── sonar.wav           # Radar/sonar ping
├── action/           # Action games (Glimworm, Cat Dash)
│   ├── eat.wav             # Power-up / food collected
│   ├── dash.wav            # Speed boost
│   └── countdown.wav       # Round countdown tick
├── chess/            # Chess-specific (already defined in sounds.ts)
│   ├── move.mp3            # (replace existing expectations)
│   ├── capture.mp3
│   ├── check.mp3
│   ├── castle.mp3
│   ├── promotion.mp3
│   ├── game-start.mp3
│   ├── game-end.mp3
│   ├── draw-offer.mp3
│   ├── notification.mp3
│   └── error.mp3
└── result/           # Game outcome (shared)
    ├── win.wav             # Victory jingle
    └── lose.wav            # Defeat tone
```

### Download Script

Create `apps/web/scripts/download-sounds.mjs` — a Node script that fetches from free sources:

- Kenney's casino pack from OpenGameArt (CC0)
- Mixkit free sounds (direct download URLs)
- Freesound.org CC0 sounds (direct download with API)
- itch.io free packs (direct download links)

The script downloads, renames, and normalizes to WAV/MP3 format.

---

## Phase 2: Shared Game Sound Manager

### Create `apps/web/src/shared/lib/game-sounds/`

| File                   | Purpose                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------ |
| `GameSoundManager.ts`  | Generic sound manager (reuse Chess's Web Audio API pattern) with per-game sound maps |
| `gameSoundRegistry.ts` | Maps `gameId → SoundType → file path` for all 17 games                               |
| `useGameSound.ts`      | Hook: `useGameSound(gameId)` returns `{ play(type), muted, toggleMute }`             |
| `index.ts`             | Barrel exports                                                                       |

### Architecture

```
GameSoundManager
├── AudioContext (shared, lazily created)
├── Map<SoundId, AudioBuffer> (decoded buffers, lazy-loaded)
├── muted flag (reads from useSoundSetting)
├── volume (0-1)
└── play(soundId) → creates BufferSource → connects gain → destination
```

Each game defines its sound types:

```typescript
// Shared types
type SharedSound = 'click' | 'success' | 'error' | 'notification' | 'gameStart';
type CardSound = 'deal' | 'flip' | 'play' | 'shuffle' | 'collect';
type BoardSound = 'move' | 'capture' | 'select' | 'crown';
type DiceSound = 'roll' | 'shake';
type PuzzleSound = 'reveal' | 'place' | 'slide' | 'merge' | 'flag';
type BattleSound = 'hit' | 'miss' | 'sink' | 'explode' | 'sonar';
type ResultSound = 'win' | 'lose';

// Per-game composition
type ChessSounds = SharedSound | BoardSound;
type HeartsSounds = SharedSound | CardSound | ResultSound;
type BackgammonSounds = SharedSound | BoardSound | DiceSound | ResultSound;
// etc.
```

---

## Phase 3: Integrate Into Each Game

### Solo Puzzle Games (4 games)

Each game's `Game.tsx` gets `useGameSound('game_id')` and calls `play()` at interaction points:

| Game            | Interactions → Sound                                                                  |
| --------------- | ------------------------------------------------------------------------------------- |
| **Solitaire**   | draw stock → `flip`, move card → `place`, win → `win`, stuck → `lose`                 |
| **Minesweeper** | reveal cell → `reveal`, flag → `flag`, boom → `lose`, clear → `win`                   |
| **Sudoku**      | place digit → `place`, erase → `click`, note toggle → `click`, win → `win`            |
| **2048**        | tile merge → `merge`, slide no merge → `slide`, reach 2048 → `win`, no moves → `lose` |

### Multiplayer Card Games (4 games)

| Game         | Interactions → Sound                                                          |
| ------------ | ----------------------------------------------------------------------------- |
| **Hearts**   | play card → `play`, take trick → `collect`, heart broken → `hit`, win → `win` |
| **Spades**   | play card → `play`, take trick → `collect`, set → `error`, win → `win`        |
| **Cascade**  | play card → `play`, draw → `deal`, call cascade → `notification`, win → `win` |
| **Critical** | play card → `play`, attack → `hit`, eliminated → `explode`, win → `win`       |

### Multiplayer Board Games (6 games)

| Game           | Interactions → Sound                                                                  |
| -------------- | ------------------------------------------------------------------------------------- |
| **Chess**      | Already has `ChessSoundManager` — wire to use shared `GameSoundManager` instead       |
| **Checkers**   | move → `move`, capture → `capture`, king → `crown`, win → `win`                       |
| **Backgammon** | roll dice → `roll`, move checker → `move`, hit blot → `capture`, bear off → `success` |
| **Go**         | place stone → `move`, capture stones → `capture`, pass → `click`                      |
| **Pachisi**    | roll dice → `roll`, move token → `move`, capture → `capture`, home → `success`        |
| **TicTacToe**  | place mark → `move`, win → `win`, draw → `click`                                      |

### Strategy & Action Games (3 games)

| Game           | Interactions → Sound                                                       |
| -------------- | -------------------------------------------------------------------------- |
| **Sea Battle** | fire shot → `hit`/`miss`, ship sunk → `sink`, sonar → `sonar`, win → `win` |
| **Glimworm**   | eat food → `eat`, kill → `hit`, die → `lose`, countdown → `countdown`      |
| **Cat Dash**   | roll dice → `roll`, advance → `move`, capture → `capture`, finish → `win`  |

---

## Phase 4: Sound Toggle Integration

- The global `useSoundSetting` hook (already in `SoloControlPanel` and `GamesControlPanel`) gates all sounds
- `GameSoundManager` reads `soundEnabled` from this setting before playing
- Each game's sound toggle button controls the shared setting — no per-game mute needed (Chess's separate `chess-sound-settings` can be deprecated)

---

## Phase 5: Fix GameMusic 404 (Bonus)

The `battleship-grid.mp3` 404 happens because `FALLBACK_TRACKS` reference CDN URLs that don't exist in dev. Fix by:

- Checking if `NEXT_PUBLIC_CDN_URL` is set; if not, skip the fallback tracks gracefully
- Or download 2-3 free ambient loops to `public/music/` for local dev

---

## Files to Create/Modify

### New files

| File                                                       | Purpose                               |
| ---------------------------------------------------------- | ------------------------------------- |
| `apps/web/scripts/download-sounds.mjs`                     | Download script for free sound assets |
| `apps/web/src/shared/lib/game-sounds/GameSoundManager.ts`  | Generic sound manager class           |
| `apps/web/src/shared/lib/game-sounds/gameSoundRegistry.ts` | Per-game sound file mappings          |
| `apps/web/src/shared/lib/game-sounds/useGameSound.ts`      | React hook                            |
| `apps/web/src/shared/lib/game-sounds/index.ts`             | Barrel exports                        |
| `apps/web/public/sounds/` (directories)                    | Downloaded sound files                |

### Modified files (17 game widgets)

| File                                           | Change                                    |
| ---------------------------------------------- | ----------------------------------------- |
| `PuzzleGames/SolitaireGame/ui/Game.tsx`        | Add `useGameSound` + play calls           |
| `PuzzleGames/MinesweeperGame/ui/Game.tsx`      | Add `useGameSound` + play calls           |
| `PuzzleGames/SudokuGame/ui/Game.tsx`           | Add `useGameSound` + play calls           |
| `PuzzleGames/Game2048/ui/Game.tsx`             | Add `useGameSound` + play calls           |
| `CardGames/HeartsGame/ui/Game.tsx`             | Add `useGameSound` + play calls           |
| `CardGames/SpadesGame/ui/Game.tsx`             | Add `useGameSound` + play calls           |
| `CardGames/CascadeGame/ui/CascadeBoard.tsx`    | Add `useGameSound` + play calls           |
| `CardGames/CriticalGame/ui/ActiveGameView.tsx` | Add `useGameSound` + play calls           |
| `BoardGames/ChessGame/lib/sounds.ts`           | Refactor to use shared `GameSoundManager` |
| `BoardGames/ChessGame/hooks/useChessSounds.ts` | Refactor to use shared `useGameSound`     |
| `BoardGames/CheckersGame/ui/Game.tsx`          | Add `useGameSound` + play calls           |
| `BoardGames/BackgammonGame/ui/Game.tsx`        | Add `useGameSound` + play calls           |
| `BoardGames/GoGame/ui/Game.tsx`                | Add `useGameSound` + play calls           |
| `BoardGames/PachisiGame/ui/Game.tsx`           | Add `useGameSound` + play calls           |
| `BoardGames/TicTacToeGame/ui/Game.tsx`         | Add `useGameSound` + play calls           |
| `StrategyGames/SeaBattleGame/ui/Game.tsx`      | Add `useGameSound` + play calls           |
| `ActionGames/GlimwormGame/GlimwormGame.tsx`    | Add `useGameSound` + play calls           |
| `ActionGames/CatDashGame/ui/Game.tsx`          | Add `useGameSound` + play calls           |
| `shared/lib/sound/sound-manifest.ts`           | Update with new assets                    |

---

## Verification

1. Run `node apps/web/scripts/download-sounds.mjs` — downloads all assets to `public/sounds/`
2. Run `pnpm --filter web typecheck` — no type errors
3. Run `pnpm --filter web test` — all tests pass
4. Manual: open each game, verify sounds play on interactions and respect the global sound toggle
5. Verify no 404 errors in browser console for sound files
