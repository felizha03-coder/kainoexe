import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { kainoAudio } from '../audio/kainoAudio';
import {
  KainoProgress,
  KainoScreen,
  KainoSettings,
  SECRET_ROOM_UNLOCK_LP,
} from '../types/kaino';
import {
  loadKainoProgress,
  loadKainoSettings,
  resetKainoProgress,
  saveKainoProgress,
  saveKainoSettings,
} from '../utils/kainoStorage';

interface ToastNotice {
  id: number;
  text: string;
}

interface KainoContextValue {
  screen: KainoScreen;
  navigate: (next: KainoScreen) => void;
  progress: KainoProgress;
  settings: KainoSettings;
  updateSettings: (next: KainoSettings) => void;
  toast: ToastNotice | null;
  awardLovePoints: (amount: number, label?: string) => void;
  collectHearts: (count: number, bonusLp?: number, label?: string) => void;
  markLetterOpened: (id: string, rewardLp: number) => void;
  saveCustomLetter: (id: string, text: string) => void;
  markCardFlipped: (id: string) => void;
  recordDiscovery: (id: string, rewardLp: number, label: string) => boolean;
  recordGameComplete: (gameId: string, rewardLp: number, label: string) => void;
  unlockSecretRoom: () => boolean;
  keepLittleWorldForever: () => void;
  resetAllProgress: () => void;
}

const KainoContext = createContext<KainoContextValue | null>(null);

export const KainoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [screen, setScreen] = useState<KainoScreen>('BOOT');
  const [progress, setProgress] = useState<KainoProgress>(() => loadKainoProgress());
  const [settings, setSettings] = useState<KainoSettings>(() => loadKainoSettings());
  const [toast, setToast] = useState<ToastNotice | null>(null);

  useEffect(() => {
    saveKainoProgress(progress);
  }, [progress]);

  useEffect(() => {
    saveKainoSettings(settings);
    kainoAudio.configure(settings);
  }, [settings]);

  const showToast = useCallback((text: string) => {
    const id = Date.now();
    setToast({ id, text });
    window.setTimeout(() => {
      setToast((curr) => (curr && curr.id === id ? null : curr));
    }, 2800);
  }, []);

  const navigate = useCallback((next: KainoScreen) => {
    kainoAudio.unlockFromUserGesture();
    kainoAudio.playClick();
    setScreen(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const updateSettings = useCallback((next: KainoSettings) => {
    kainoAudio.unlockFromUserGesture();
    setSettings(next);
  }, []);

  const awardLovePoints = useCallback(
    (amount: number, label?: string) => {
      if (amount <= 0) return;
      setProgress((prev) => ({
        ...prev,
        lovePoints: prev.lovePoints + amount,
      }));
      if (label) {
        showToast(`+${amount} LP · ${label}`);
      }
    },
    [showToast]
  );

  const collectHearts = useCallback(
    (count: number, bonusLp = 0, label?: string) => {
      kainoAudio.playHeartCollect();
      setProgress((prev) => ({
        ...prev,
        hearts: prev.hearts + count,
        lovePoints: prev.lovePoints + bonusLp,
      }));
      if (label) {
        showToast(label);
      }
    },
    [showToast]
  );

  const markLetterOpened = useCallback(
    (id: string, rewardLp: number) => {
      kainoAudio.playEnvelopeOpen();
      setProgress((prev) => {
        if (prev.openedLetters.includes(id)) return prev;
        showToast(`+${rewardLp} LP · Special Message Read ♡`);
        return {
          ...prev,
          lovePoints: prev.lovePoints + rewardLp,
          hearts: prev.hearts + 2,
          openedLetters: [...prev.openedLetters, id],
        };
      });
    },
    [showToast]
  );

  const saveCustomLetter = useCallback(
    (id: string, text: string) => {
      setProgress((prev) => ({
        ...prev,
        customLetters: { ...prev.customLetters, [id]: text },
      }));
      showToast('Custom note saved ♡');
    },
    [showToast]
  );

  const markCardFlipped = useCallback(
    (id: string) => {
      kainoAudio.playCardFlip();
      setProgress((prev) => {
        if (prev.flippedCards.includes(id)) return prev;
        showToast('+15 LP · Card Inspected ♡');
        return {
          ...prev,
          lovePoints: prev.lovePoints + 15,
          hearts: prev.hearts + 1,
          flippedCards: [...prev.flippedCards, id],
        };
      });
    },
    [showToast]
  );

  const recordDiscovery = useCallback(
    (id: string, rewardLp: number, label: string): boolean => {
      let isFirstTime = false;
      setProgress((prev) => {
        if (prev.hiddenDiscoveries.includes(id)) {
          return {
            ...prev,
            hearts: prev.hearts + 1,
          };
        }
        isFirstTime = true;
        return {
          ...prev,
          lovePoints: prev.lovePoints + rewardLp,
          hearts: prev.hearts + 3,
          hiddenDiscoveries: [...prev.hiddenDiscoveries, id],
        };
      });
      kainoAudio.playHeartCollect();
      showToast(isFirstTime ? `+${rewardLp} LP · ${label}` : `+1 Heart · ${label}`);
      return isFirstTime;
    },
    [showToast]
  );

  const recordGameComplete = useCallback(
    (gameId: string, rewardLp: number, label: string) => {
      kainoAudio.playVictory();
      setProgress((prev) => {
        const firstClear = !prev.completedGames.includes(gameId);
        const granted = firstClear ? rewardLp : Math.max(5, Math.floor(rewardLp / 3));
        showToast(`+${granted} LP · ${label}`);
        return {
          ...prev,
          lovePoints: prev.lovePoints + granted,
          hearts: prev.hearts + 3,
          completedGames: firstClear
            ? [...prev.completedGames, gameId]
            : prev.completedGames,
        };
      });
    },
    [showToast]
  );

  const unlockSecretRoom = useCallback((): boolean => {
    if (progress.lovePoints < SECRET_ROOM_UNLOCK_LP && !progress.secretRoomUnlocked) {
      return false;
    }
    kainoAudio.playSecretUnlock();
    setProgress((prev) => ({
      ...prev,
      secretRoomUnlocked: true,
    }));
    showToast('Secret Room Unlocked! ♡');
    return true;
  }, [progress.lovePoints, progress.secretRoomUnlocked, showToast]);

  const keepLittleWorldForever = useCallback(() => {
    kainoAudio.playVictory();
    setProgress((prev) => ({
      ...prev,
      keptForever: true,
      secretRoomUnlocked: true,
    }));
    setScreen('FINAL_LOVE');
  }, []);

  const resetAllProgress = useCallback(() => {
    const fresh = resetKainoProgress();
    setProgress(fresh);
    showToast('Progress reset to a fresh start ♡');
  }, [showToast]);

  return (
    <KainoContext.Provider
      value={{
        screen,
        navigate,
        progress,
        settings,
        updateSettings,
        toast,
        awardLovePoints,
        collectHearts,
        markLetterOpened,
        saveCustomLetter,
        markCardFlipped,
        recordDiscovery,
        recordGameComplete,
        unlockSecretRoom,
        keepLittleWorldForever,
        resetAllProgress,
      }}
    >
      {children}
    </KainoContext.Provider>
  );
};

export function useKaino(): KainoContextValue {
  const ctx = useContext(KainoContext);
  if (!ctx) throw new Error('useKaino must be used within KainoProvider');
  return ctx;
}
