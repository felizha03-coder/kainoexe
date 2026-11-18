import { GameSettings, HighScoreEntry } from '../types/game';

const SETTINGS_KEY = 'spiderman_pixel_settings_v1';
const HIGHSCORES_KEY = 'spiderman_pixel_highscores_v1';

export const DEFAULT_SETTINGS: GameSettings = {
  sfxEnabled: true,
  musicEnabled: true,
  scanlinesEnabled: true,
  difficulty: 'CLASSIC',
};

export function loadSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<GameSettings>;
    return {
      sfxEnabled: typeof parsed.sfxEnabled === 'boolean' ? parsed.sfxEnabled : true,
      musicEnabled: typeof parsed.musicEnabled === 'boolean' ? parsed.musicEnabled : true,
      scanlinesEnabled:
        typeof parsed.scanlinesEnabled === 'boolean' ? parsed.scanlinesEnabled : true,
      difficulty: parsed.difficulty === 'TURBO' ? 'TURBO' : 'CLASSIC',
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: GameSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Ignore storage quota errors
  }
}

export function loadHighScores(): HighScoreEntry[] {
  try {
    const raw = localStorage.getItem(HIGHSCORES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HighScoreEntry[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item && typeof item.score === 'number')
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  } catch {
    return [];
  }
}

export function getBestScore(): number {
  const list = loadHighScores();
  return list.length > 0 ? list[0].score : 0;
}

export function recordHighScore(entry: Omit<HighScoreEntry, 'id' | 'date'>): {
  scores: HighScoreEntry[];
  isNewBest: boolean;
  bestScore: number;
} {
  const existing = loadHighScores();
  const prevBest = existing.length > 0 ? existing[0].score : 0;
  const isNewBest = entry.score > prevBest && entry.score > 0;

  const newEntry: HighScoreEntry = {
    ...entry,
    id: `run-${Date.now()}`,
    date: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
  };

  const merged = [...existing, newEntry]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  try {
    localStorage.setItem(HIGHSCORES_KEY, JSON.stringify(merged));
  } catch {
    // Ignore storage errors
  }

  return {
    scores: merged,
    isNewBest,
    bestScore: merged.length > 0 ? merged[0].score : entry.score,
  };
}

export function clearHighScores(): void {
  try {
    localStorage.removeItem(HIGHSCORES_KEY);
  } catch {
    // Ignore
  }
}
