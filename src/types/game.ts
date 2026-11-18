export type GameScreenState =
  | 'MAIN_MENU'
  | 'HOW_TO_PLAY'
  | 'STARTING'
  | 'PLAYING'
  | 'PAUSED'
  | 'GAME_OVER'
  | 'HIGH_SCORES'
  | 'SETTINGS';

export type DifficultyMode = 'CLASSIC' | 'TURBO';

export interface GameSettings {
  sfxEnabled: boolean;
  musicEnabled: boolean;
  scanlinesEnabled: boolean;
  difficulty: DifficultyMode;
}

export interface HighScoreEntry {
  id: string;
  score: number;
  distance: number;
  tokens: number;
  difficulty: DifficultyMode;
  date: string;
}

export interface HudSnapshot {
  score: number;
  distance: number;
  tokens: number;
  bestScore: number;
  isNewBest: boolean;
  speedLevel: number;
  isSwinging: boolean;
  comboCount: number;
}

export interface GameOverSummary {
  finalScore: number;
  distance: number;
  tokens: number;
  bestScore: number;
  isNewBest: boolean;
  reason: 'FALL' | 'OBSTACLE';
}

export type ConsoleButton =
  | 'UP'
  | 'DOWN'
  | 'LEFT'
  | 'RIGHT'
  | 'A'
  | 'B'
  | 'START'
  | 'SELECT';
