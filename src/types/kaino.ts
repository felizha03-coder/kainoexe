export type KainoScreen =
  | 'BOOT'
  | 'TITLE'
  | 'WORLD'
  | 'LETTERS'
  | 'CARDS'
  | 'ARCADE'
  | 'SECRET_ROOM'
  | 'FINAL_LOVE';

export type CharacterPose =
  | 'smiling'
  | 'blushing'
  | 'waving'
  | 'looking'
  | 'sending-hearts';

export type DuoPose =
  | 'standing'
  | 'holding-hands'
  | 'sitting'
  | 'hugging';

export interface LoveLetterItem {
  id: string;
  label: string;
  title: string;
  body: string;
  isSpecial?: boolean;
  rewardLp: number;
}

export type CardRarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'VIP';

export interface CharacterCardData {
  id: string;
  number: string;
  name: string;
  type: string;
  hp: string;
  ability: string;
  specialMove: string;
  rarity: CardRarity;
  stats: {
    affection: number;
    cuteness: number;
    loyalty: number;
    charm: number;
  };
  backTitle?: string;
  backNote: string;
  backSignature?: string;
  unlockRequirementLp: number;
}

export interface KainoSettings {
  soundEnabled: boolean;
  bgmVolume: number; // 0 to 1
  sfxVolume: number; // 0 to 1
  animationsEnabled: boolean;
}

export interface KainoProgress {
  lovePoints: number;
  hearts: number;
  openedLetters: string[];
  flippedCards: string[];
  hiddenDiscoveries: string[];
  completedGames: string[];
  secretRoomUnlocked: boolean;
  keptForever: boolean;
  customLetters: Record<string, string>;
}

export const SECRET_ROOM_UNLOCK_LP = 120;
export const LEGENDARY_CARD_UNLOCK_LP = 80;
