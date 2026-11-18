import { KainoProgress, KainoSettings } from '../types/kaino';

const SETTINGS_KEY = 'kaino_exe_settings_v1';
const PROGRESS_KEY = 'kaino_exe_progress_v1';

export const DEFAULT_KAINO_SETTINGS: KainoSettings = {
  soundEnabled: true,
  bgmVolume: 0.45,
  sfxVolume: 0.65,
  animationsEnabled: true,
};

export const DEFAULT_KAINO_PROGRESS: KainoProgress = {
  lovePoints: 0,
  hearts: 0,
  openedLetters: [],
  flippedCards: [],
  hiddenDiscoveries: [],
  completedGames: [],
  secretRoomUnlocked: false,
  keptForever: false,
  customLetters: {},
};

export function loadKainoSettings(): KainoSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_KAINO_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<KainoSettings>;
    return {
      soundEnabled: typeof parsed.soundEnabled === 'boolean' ? parsed.soundEnabled : true,
      bgmVolume: typeof parsed.bgmVolume === 'number' ? Math.max(0, Math.min(1, parsed.bgmVolume)) : 0.45,
      sfxVolume: typeof parsed.sfxVolume === 'number' ? Math.max(0, Math.min(1, parsed.sfxVolume)) : 0.65,
      animationsEnabled:
        typeof parsed.animationsEnabled === 'boolean' ? parsed.animationsEnabled : true,
    };
  } catch {
    return DEFAULT_KAINO_SETTINGS;
  }
}

export function saveKainoSettings(settings: KainoSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Ignore storage quota errors
  }
}

export function loadKainoProgress(): KainoProgress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return DEFAULT_KAINO_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<KainoProgress>;
    return {
      lovePoints: typeof parsed.lovePoints === 'number' ? parsed.lovePoints : 0,
      hearts: typeof parsed.hearts === 'number' ? parsed.hearts : 0,
      openedLetters: Array.isArray(parsed.openedLetters) ? parsed.openedLetters : [],
      flippedCards: Array.isArray(parsed.flippedCards) ? parsed.flippedCards : [],
      hiddenDiscoveries: Array.isArray(parsed.hiddenDiscoveries) ? parsed.hiddenDiscoveries : [],
      completedGames: Array.isArray(parsed.completedGames) ? parsed.completedGames : [],
      secretRoomUnlocked: Boolean(parsed.secretRoomUnlocked),
      keptForever: Boolean(parsed.keptForever),
      customLetters:
        parsed.customLetters && typeof parsed.customLetters === 'object'
          ? parsed.customLetters
          : {},
    };
  } catch {
    return DEFAULT_KAINO_PROGRESS;
  }
}

export function saveKainoProgress(progress: KainoProgress): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // Ignore storage quota errors
  }
}

export function resetKainoProgress(): KainoProgress {
  try {
    localStorage.removeItem(PROGRESS_KEY);
  } catch {
    // Ignore
  }
  return { ...DEFAULT_KAINO_PROGRESS };
}
