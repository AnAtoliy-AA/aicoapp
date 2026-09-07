#!/usr/bin/env node
/**
 * Downloads free CC0 game sound effects from OpenGameArt.org and other sources.
 * Extracts, renames, and organizes into public/sounds/ by category.
 *
 * Run: node apps/web/scripts/download-sounds.mjs
 */
import { execSync } from 'node:child_process';
import { mkdirSync, existsSync, readdirSync, renameSync, unlinkSync, cpSync } from 'node:fs';
import { join, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PUBLIC_SOUNDS = join(__dirname, '..', 'public', 'sounds');
const TMP_DIR = join(__dirname, '..', '.tmp-sounds');

const SOURCES = [
  {
    name: 'kenney-casino',
    url: 'https://opengameart.org/sites/default/files/kenney_casino-audio.zip',
    description: '54 casino sounds (cards, dice, chips) by Kenney - CC0',
  },
  {
    name: 'kenney-interface',
    url: 'https://opengameart.org/sites/default/files/kenney_interfaceSounds.zip',
    description: '100 interface sounds (clicks, snaps, confirmations) by Kenney - CC0',
  },
  {
    name: 'card-sounds',
    url: 'https://opengameart.org/sites/default/files/Cardsounds.zip',
    description: 'Card game sounds (shuffle, deal, play, tap) by HaelDB - CC0',
  },
  {
    name: 'click-clips',
    url: 'https://opengameart.org/sites/default/files/Click_Clips.zip',
    description: '87 clickety clips (clicks, snaps, switches) - CC0',
  },
  {
    name: 'ui-sounds',
    url: 'https://opengameart.org/sites/default/files/ui_wav.zip',
    description: 'UI button clicks, feedback, notifications - CC0',
  },
  {
    name: 'menu-sounds',
    url: 'https://opengameart.org/sites/default/files/Menu%20Soundpack%203.wav',
    description: '8 menu button sounds by Listener - CC0',
    singleFile: true,
  },
  {
    name: 'game-over-bad',
    url: 'https://opengameart.org/sites/default/files/game_over_bad_chest.wav',
    description: 'Game over / negative effect SFX - CC0',
    singleFile: true,
  },
  {
    name: 'victory',
    url: 'https://opengameart.org/sites/default/files/win-176035.mp3',
    description: 'Victory win sound - CC0',
    singleFile: true,
  },
  {
    name: 'game-over-trumpet',
    url: 'https://opengameart.org/sites/default/files/losetrumpet.mp3',
    description: 'Game over trumpet (lose) - CC0',
    singleFile: true,
  },
  {
    name: 'explosion',
    url: 'https://opengameart.org/sites/default/files/mechanical_explosion.wav',
    description: 'Mechanical explosion - CC0',
    singleFile: true,
  },
  {
    name: 'sonar-ping',
    url: 'https://opengameart.org/sites/default/files/sonar_ping.mp3',
    description: 'Sonar ping for submarine games - CC0',
    singleFile: true,
  },
  {
    name: 'water-splash',
    url: 'https://opengameart.org/sites/default/files/water-splash-slime-sfx.zip',
    description: '40 water/splash/slime SFX - CC0',
  },
  {
    name: 'sound-effects-pack',
    url: 'https://opengameart.org/sites/default/files/Sound%20effects%20Mini%20Pack1.5.zip',
    description: '55 SFX (explosions, hit, lose, power-up, etc.) - CC0',
  },
  {
    name: 'oldschool-win-lose',
    url: 'https://opengameart.org/sites/default/files/vsgame_0.zip',
    description: 'Win and lose retro sounds - CC0',
  },
];

/** Download a file to disk */
async function downloadFile(url, dest) {
  if (existsSync(dest)) {
    console.log(`  ↳ already downloaded: ${basename(dest)}`);
    return;
  }
  const res = await fetch(url, {
    headers: { 'User-Agent': 'ArcadeumSoundDownloader/1.0' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const fileStream = createWriteStream(dest);
  await pipeline(Readable.fromWeb(res.body), fileStream);
  console.log(`  ↳ downloaded: ${basename(dest)} (${(res.headers.get('content-length') ?? 0) / 1024 | 0} KB)`);
}

/** Recursively find all audio files in a directory */
function findAudioFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findAudioFiles(full));
    } else if (/\.(wav|mp3|ogg|flac)$/i.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

/** Convert non-wav audio to wav using ffmpeg (if available), otherwise copy */
function convertOrCopy(src, dest) {
  const ext = extname(src).toLowerCase();
  if (ext === '.wav') {
    cpSync(src, dest);
    return;
  }
  // Try ffmpeg conversion
  try {
    execSync(`ffmpeg -y -i "${src}" -ar 44100 -ac 1 "${dest}" 2>/dev/null`, {
      stdio: 'pipe',
    });
    console.log(`  ↳ converted ${basename(src)} → ${basename(dest)}`);
  } catch {
    // If ffmpeg fails, just copy the original
    cpSync(src, dest);
    console.log(`  ↳ copied ${basename(src)} (no conversion)`);
  }
}

async function main() {
  console.log('🎵 Downloading free game sound effects...\n');

  // Create directories
  mkdirSync(TMP_DIR, { recursive: true });
  const categories = ['shared', 'cards', 'board', 'dice', 'puzzle', 'battle', 'action', 'result', 'chess'];
  for (const cat of categories) {
    mkdirSync(join(PUBLIC_SOUNDS, cat), { recursive: true });
  }

  // Download all sources
  for (const source of SOURCES) {
    console.log(`📥 ${source.name}: ${source.description}`);
    const isZip = source.url.endsWith('.zip');
    const is7z = source.url.endsWith('.7z');
    const destPath = join(TMP_DIR, source.url.split('/').pop());

    try {
      await downloadFile(source.url, destPath);

      if (isZip) {
        const extractDir = join(TMP_DIR, source.name);
        mkdirSync(extractDir, { recursive: true });
        execSync(`unzip -o "${destPath}" -d "${extractDir}" 2>/dev/null`, { stdio: 'pipe' });
        console.log(`  ↳ extracted to ${source.name}/`);
      } else if (is7z) {
        const extractDir = join(TMP_DIR, source.name);
        mkdirSync(extractDir, { recursive: true });
        try {
          execSync(`7z x "${destPath}" -o"${extractDir}" -y 2>/dev/null`, { stdio: 'pipe' });
          console.log(`  ↳ extracted to ${source.name}/`);
        } catch {
          console.log(`  ⚠ 7z not available, skipping extraction of ${source.name}`);
        }
      }
    } catch (err) {
      console.error(`  ✗ Failed: ${err.message}`);
    }
    console.log('');
  }

  // Map sounds to categories
  console.log('🏷️  Organizing sounds by category...\n');

  const MAPPING = {
    // Shared UI sounds
    'shared': [
      'click', 'button', 'tap', 'select', 'confirm', 'notification',
      'alert', 'pop', 'snap', 'switch',
    ],
    // Card game sounds
    'cards': [
      'card', 'deal', 'shuffle', 'flip', 'play_card', 'hand',
    ],
    // Board game piece sounds
    'board': [
      'piece', 'move', 'place', 'select_piece', 'board',
    ],
    // Dice sounds
    'dice': [
      'dice', 'roll',
    ],
    // Battle sounds
    'battle': [
      'explosion', 'hit', 'attack', 'miss', 'splash', 'sonar',
      'sink', 'destroy', 'dynamite',
    ],
    // Result sounds
    'result': [
      'win', 'lose', 'victory', 'game_over', 'gameover', 'fail',
      'success', 'complete', 'jingle',
    ],
  };

  // Find all downloaded audio files
  const allAudioFiles = findAudioFiles(TMP_DIR);
  console.log(`Found ${allAudioFiles.length} audio files total\n`);

  let assigned = 0;
  for (const filePath of allAudioFiles) {
    const fileName = basename(filePath).toLowerCase();
    const nameWithoutExt = fileName.replace(/\.[^.]+$/, '');

    let matched = false;

    // Direct category mapping
    for (const [category, keywords] of Object.entries(MAPPING)) {
      if (keywords.some(kw => nameWithoutExt.includes(kw))) {
        const destName = `${sourceFileName(filePath)}`;
        const dest = join(PUBLIC_SOUNDS, category, destName);
        if (!existsSync(dest)) {
          convertOrCopy(filePath, dest);
          assigned++;
        }
        matched = true;
        break;
      }
    }

    // If not matched, put in shared as generic sounds
    if (!matched) {
      const dest = join(PUBLIC_SOUNDS, 'shared', sourceFileName(filePath));
      if (!existsSync(dest)) {
        convertOrCopy(filePath, dest);
        assigned++;
      }
    }
  }

  console.log(`\n✅ Organized ${assigned} sound files into ${PUBLIC_SOUNDS}`);

  // List what we have
  console.log('\n📁 Sound library contents:');
  for (const cat of categories) {
    const dir = join(PUBLIC_SOUNDS, cat);
    if (existsSync(dir)) {
      const files = readdirSync(dir).filter(f => /\.(wav|mp3|ogg)$/i.test(f));
      if (files.length > 0) {
        console.log(`  ${cat}/ (${files.length} files): ${files.slice(0, 5).join(', ')}${files.length > 5 ? '...' : ''}`);
      }
    }
  }

  // Cleanup tmp
  try {
    execSync(`rm -rf "${TMP_DIR}"`, { stdio: 'pipe' });
  } catch {}

  console.log('\n🎉 Done! Run "pnpm --filter web dev" to test sounds in-game.');
}

function sourceFileName(filePath) {
  // Generate a clean name from the source path
  const name = basename(filePath);
  return name;
}

main().catch(console.error);
