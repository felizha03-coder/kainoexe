import React, { useEffect, useState } from 'react';
import {
  GameOverSummary,
  GameScreenState,
  GameSettings,
  HighScoreEntry,
  HudSnapshot,
} from '../types/game';
import { getChibiIdlePreviewUrl } from '../game/sprites/chibiSpidermanSheet';

interface ScreenOverlaysProps {
  screen: GameScreenState;
  hud: HudSnapshot;
  gameOver: GameOverSummary | null;
  settings: GameSettings;
  highScores: HighScoreEntry[];
  menuIndex: number;
  onSelectMenuIndex: (idx: number) => void;
  onStartGame: () => void;
  onOpenHowToPlay: () => void;
  onOpenSettings: () => void;
  onOpenHighScores: () => void;
  onPauseToggle: () => void;
  onBackToMenu: () => void;
  onUpdateSettings: (next: GameSettings) => void;
  onClearHighScores: () => void;
}

export const MENU_OPTIONS = [
  'START GAME',
  'HOW TO PLAY',
  'SETTINGS',
  'HIGH SCORES',
] as const;

export const ScreenOverlays: React.FC<ScreenOverlaysProps> = ({
  screen,
  hud,
  gameOver,
  settings,
  highScores,
  menuIndex,
  onSelectMenuIndex,
  onStartGame,
  onOpenHowToPlay,
  onOpenSettings,
  onOpenHighScores,
  onPauseToggle,
  onBackToMenu,
  onUpdateSettings,
  onClearHighScores,
}) => {
  const [idleFrame, setIdleFrame] = useState(0);
  const [confirmClear, setConfirmClear] = useState(false);

  const previewFrame0 = React.useMemo(() => getChibiIdlePreviewUrl(10), []);
  const previewFrame1 = React.useMemo(() => getChibiIdlePreviewUrl(11), []);

  useEffect(() => {
    if (screen !== 'MAIN_MENU') return;
    const timer = window.setInterval(() => {
      setIdleFrame((f) => (f === 0 ? 1 : 0));
    }, 420);
    return () => window.clearInterval(timer);
  }, [screen]);

  const handleMenuClick = (idx: number) => {
    onSelectMenuIndex(idx);
    if (idx === 0) onStartGame();
    else if (idx === 1) onOpenHowToPlay();
    else if (idx === 2) onOpenSettings();
    else if (idx === 3) onOpenHighScores();
  };

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-20 flex flex-col">
      {/* ACTIVE HUD BAR (during STARTING, PLAYING, PAUSED) */}
      {(screen === 'PLAYING' || screen === 'STARTING' || screen === 'PAUSED') && (
        <div className="pointer-events-auto w-full px-2.5 py-1.5 bg-[#0F172A]/80 border-b-2 border-white/15 flex items-center justify-between gap-2 text-white">
          <div className="flex items-center gap-3 sm:gap-4 text-[8px] sm:text-[10px] font-pixel tabular-nums">
            <div>
              <span className="text-sky-300">SCR </span>
              <span className="text-yellow-300">{String(hud.score).padStart(5, '0')}</span>
            </div>
            <div>
              <span className="text-sky-300">DST </span>
              <span>{hud.distance}m</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 bg-yellow-400 border border-black" />
              <span>{hud.tokens}</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-slate-400">BEST </span>
              <span className="text-rose-300">{String(hud.bestScore).padStart(5, '0')}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onPauseToggle}
            aria-label={screen === 'PAUSED' ? 'Resume game' : 'Pause game'}
            className="px-2 py-1 bg-[#DC2626] hover:bg-[#EF4444] border border-white/60 text-white font-pixel text-[8px] sm:text-[9px] cursor-pointer whitespace-nowrap shrink-0"
          >
            {screen === 'PAUSED' ? 'PLAY' : 'PAUSE'}
          </button>
        </div>
      )}

      {/* MAIN MENU */}
      {screen === 'MAIN_MENU' && (
        <div className="pointer-events-auto flex-1 bg-gradient-to-b from-[#0F172A]/78 via-[#0F172A]/68 to-[#1E3A8A]/85 p-3 sm:p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1.5 max-w-[74%]">
              <h2 className="font-pixel text-base sm:text-xl leading-tight text-white drop-shadow-[2px_2px_0_#DC2626]">
                SPIDERMAN
              </h2>
              <p className="font-pixel text-[10px] sm:text-xs text-[#FACC15] drop-shadow-[1px_1px_0_#0F172A]">
                PIXEL ADVENTURE
              </p>
              <p className="font-silk text-[9px] sm:text-[11px] text-sky-200 leading-snug pt-0.5">
                YOUR FRIENDLY NEIGHBORHOOD PIXEL HERO.
              </p>
            </div>

            {/* Iconic Upside-Down Hanging Chibi Spider-Man Preview */}
            <div className="shrink-0 flex flex-col items-center -mt-3 sm:-mt-5">
              <div className="w-0.5 h-3 sm:h-4 bg-white" />
              <img
                src={idleFrame === 0 ? previewFrame0 : previewFrame1}
                alt="Chibi Spider-Man hanging from web"
                className="w-14 h-16 sm:w-18 sm:h-20 pixelated drop-shadow-[0_4px_0_rgba(0,0,0,0.45)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-2.5 pt-2">
            {MENU_OPTIONS.map((label, idx) => {
              const selected = menuIndex === idx;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => handleMenuClick(idx)}
                  onMouseEnter={() => onSelectMenuIndex(idx)}
                  className={`pixel-btn px-2.5 py-2 sm:py-2.5 font-pixel text-[8px] sm:text-[10px] text-left flex items-center gap-1.5 border-2 cursor-pointer whitespace-nowrap ${
                    selected
                      ? idx === 0
                        ? 'bg-[#DC2626] text-white border-[#FACC15]'
                        : 'bg-[#1D4ED8] text-white border-[#FACC15]'
                      : 'bg-[#0F172A]/90 text-slate-100 border-slate-400/60 hover:border-white'
                  }`}
                >
                  <span className="text-[#FACC15]">{selected ? '▶' : ' '}</span>
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* HOW TO PLAY */}
      {screen === 'HOW_TO_PLAY' && (
        <div className="pointer-events-auto flex-1 bg-[#0F172A]/95 p-3 sm:p-4 flex flex-col justify-between text-white overflow-y-auto">
          <div className="space-y-2">
            <h3 className="font-pixel text-xs sm:text-sm text-[#FACC15]">HOW TO PLAY</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-silk text-[10px] sm:text-[11px] leading-snug">
              <div className="bg-[#1E293B] border border-sky-400/40 p-2 space-y-1">
                <p className="font-pixel text-[8px] text-sky-300">CONTROLS</p>
                <p>SPACE / A: Shoot &amp; Swing Web</p>
                <p>W / UP / B: Jump &amp; Air Hop</p>
                <p>A / D / D-PAD: Swing &amp; Move</p>
                <p>ESC / START: Pause Game</p>
              </div>
              <div className="bg-[#1E293B] border border-rose-400/40 p-2 space-y-1">
                <p className="font-pixel text-[8px] text-rose-300">HERO TIPS</p>
                <p>Hold A / SPACE to arc over gaps.</p>
                <p>Release at upswing to launch!</p>
                <p>Grab Spider Tokens for +50 pts.</p>
                <p>Dodge shock drones &amp; spikes.</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-2">
            <button
              type="button"
              onClick={onBackToMenu}
              className="pixel-btn px-3 py-1.5 bg-slate-700 text-white border-2 border-slate-300 font-pixel text-[8px] sm:text-[9px] cursor-pointer whitespace-nowrap"
            >
              ◀ MENU
            </button>
            <button
              type="button"
              onClick={onStartGame}
              className="pixel-btn px-3 py-1.5 bg-[#DC2626] text-white border-2 border-[#FACC15] font-pixel text-[8px] sm:text-[9px] cursor-pointer whitespace-nowrap"
            >
              START GAME ▶
            </button>
          </div>
        </div>
      )}

      {/* SETTINGS */}
      {screen === 'SETTINGS' && (
        <div className="pointer-events-auto flex-1 bg-[#0F172A]/95 p-3 sm:p-4 flex flex-col justify-between text-white">
          <div className="space-y-2">
            <h3 className="font-pixel text-xs sm:text-sm text-[#FACC15]">SETTINGS</h3>
            <div className="grid grid-cols-2 gap-2 font-silk text-[10px] sm:text-[11px]">
              <button
                type="button"
                onClick={() =>
                  onUpdateSettings({ ...settings, sfxEnabled: !settings.sfxEnabled })
                }
                className="p-2 bg-[#1E293B] border-2 border-slate-500 hover:border-white flex items-center justify-between cursor-pointer"
              >
                <span>SOUND FX</span>
                <span className={settings.sfxEnabled ? 'text-lime-400' : 'text-rose-400'}>
                  {settings.sfxEnabled ? 'ON' : 'OFF'}
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  onUpdateSettings({ ...settings, musicEnabled: !settings.musicEnabled })
                }
                className="p-2 bg-[#1E293B] border-2 border-slate-500 hover:border-white flex items-center justify-between cursor-pointer"
              >
                <span>8-BIT BGM</span>
                <span className={settings.musicEnabled ? 'text-lime-400' : 'text-rose-400'}>
                  {settings.musicEnabled ? 'ON' : 'OFF'}
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  onUpdateSettings({
                    ...settings,
                    scanlinesEnabled: !settings.scanlinesEnabled,
                  })
                }
                className="p-2 bg-[#1E293B] border-2 border-slate-500 hover:border-white flex items-center justify-between cursor-pointer"
              >
                <span>LCD GLOW</span>
                <span className={settings.scanlinesEnabled ? 'text-lime-400' : 'text-rose-400'}>
                  {settings.scanlinesEnabled ? 'ON' : 'OFF'}
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  onUpdateSettings({
                    ...settings,
                    difficulty: settings.difficulty === 'CLASSIC' ? 'TURBO' : 'CLASSIC',
                  })
                }
                className="p-2 bg-[#1E293B] border-2 border-slate-500 hover:border-white flex items-center justify-between cursor-pointer"
              >
                <span>SPEED</span>
                <span className="text-[#FACC15]">{settings.difficulty}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-2">
            {!confirmClear ? (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="px-2.5 py-1.5 bg-rose-950 border border-rose-500/70 text-rose-200 font-pixel text-[8px] cursor-pointer whitespace-nowrap"
              >
                CLEAR SCORES
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onClearHighScores();
                  setConfirmClear(false);
                }}
                className="px-2.5 py-1.5 bg-red-600 border border-white text-white font-pixel text-[8px] cursor-pointer whitespace-nowrap"
              >
                CONFIRM CLEAR?
              </button>
            )}

            <button
              type="button"
              onClick={onBackToMenu}
              className="pixel-btn px-3 py-1.5 bg-[#1D4ED8] text-white border-2 border-[#FACC15] font-pixel text-[8px] sm:text-[9px] cursor-pointer whitespace-nowrap"
            >
              ◀ BACK
            </button>
          </div>
        </div>
      )}

      {/* HIGH SCORES */}
      {screen === 'HIGH_SCORES' && (
        <div className="pointer-events-auto flex-1 bg-[#0F172A]/95 p-3 sm:p-4 flex flex-col justify-between text-white">
          <div className="space-y-2">
            <h3 className="font-pixel text-xs sm:text-sm text-[#FACC15]">HIGH SCORES</h3>
            {highScores.length === 0 ? (
              <p className="font-silk text-xs text-slate-300 py-6 text-center">
                No runs recorded yet. Swing across the city to set a record!
              </p>
            ) : (
              <div className="space-y-1 font-mono text-[10px] sm:text-xs tabular-nums">
                {highScores.map((entry, idx) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between px-2 py-1 bg-[#1E293B] border border-white/10"
                  >
                    <span className="text-[#FACC15]">
                      #{idx + 1} · {entry.score.toLocaleString()} PTS
                    </span>
                    <span className="text-sky-300">
                      {entry.distance}m · {entry.tokens} TKN
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 pt-2">
            <button
              type="button"
              onClick={onBackToMenu}
              className="pixel-btn px-3 py-1.5 bg-slate-700 text-white border-2 border-slate-300 font-pixel text-[8px] sm:text-[9px] cursor-pointer whitespace-nowrap"
            >
              ◀ MENU
            </button>
            <button
              type="button"
              onClick={onStartGame}
              className="pixel-btn px-3 py-1.5 bg-[#DC2626] text-white border-2 border-[#FACC15] font-pixel text-[8px] sm:text-[9px] cursor-pointer whitespace-nowrap"
            >
              PLAY NOW ▶
            </button>
          </div>
        </div>
      )}

      {/* PAUSED OVERLAY */}
      {screen === 'PAUSED' && (
        <div className="pointer-events-auto flex-1 bg-[#0F172A]/85 flex flex-col items-center justify-center p-4 gap-3 text-white">
          <h3 className="font-pixel text-base sm:text-lg text-[#FACC15] drop-shadow-[2px_2px_0_#0F172A]">
            PAUSED
          </h3>
          <div className="grid grid-cols-2 gap-2 w-full max-w-xs">
            <button
              type="button"
              onClick={onPauseToggle}
              className="pixel-btn py-2 bg-[#1D4ED8] border-2 border-[#FACC15] font-pixel text-[8px] sm:text-[9px] cursor-pointer whitespace-nowrap"
            >
              RESUME
            </button>
            <button
              type="button"
              onClick={onStartGame}
              className="pixel-btn py-2 bg-[#DC2626] border-2 border-white font-pixel text-[8px] sm:text-[9px] cursor-pointer whitespace-nowrap"
            >
              RETRY
            </button>
            <button
              type="button"
              onClick={onOpenSettings}
              className="pixel-btn py-2 bg-slate-700 border-2 border-slate-300 font-pixel text-[8px] sm:text-[9px] cursor-pointer whitespace-nowrap"
            >
              SETTINGS
            </button>
            <button
              type="button"
              onClick={onBackToMenu}
              className="pixel-btn py-2 bg-slate-800 border-2 border-slate-400 font-pixel text-[8px] sm:text-[9px] cursor-pointer whitespace-nowrap"
            >
              MAIN MENU
            </button>
          </div>
        </div>
      )}

      {/* GAME OVER OVERLAY */}
      {screen === 'GAME_OVER' && gameOver && (
        <div className="pointer-events-auto flex-1 bg-[#0F172A]/90 flex flex-col items-center justify-center p-3 sm:p-4 gap-2.5 text-white">
          <div className="text-center space-y-1">
            <h3 className="font-pixel text-base sm:text-xl text-[#EF4444] drop-shadow-[2px_2px_0_#000]">
              GAME OVER
            </h3>
            {gameOver.isNewBest && (
              <p className="font-pixel text-[8px] sm:text-[9px] text-[#FACC15]">
                ★ NEW BEST SCORE! ★
              </p>
            )}
          </div>

          <div className="w-full max-w-xs bg-[#1E293B] border-2 border-sky-400/60 p-2.5 grid grid-cols-2 gap-y-1.5 text-[9px] sm:text-[10px] font-pixel tabular-nums">
            <span className="text-sky-300">FINAL SCORE</span>
            <span className="text-right text-yellow-300">
              {gameOver.finalScore.toLocaleString()}
            </span>
            <span className="text-sky-300">BEST SCORE</span>
            <span className="text-right text-rose-300">
              {gameOver.bestScore.toLocaleString()}
            </span>
            <span className="text-slate-300">DISTANCE</span>
            <span className="text-right">{gameOver.distance}m</span>
            <span className="text-slate-300">TOKENS</span>
            <span className="text-right">{gameOver.tokens}</span>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={onStartGame}
              className="pixel-btn px-4 py-2 bg-[#DC2626] border-2 border-[#FACC15] font-pixel text-[9px] sm:text-[10px] cursor-pointer whitespace-nowrap"
            >
              RETRY
            </button>
            <button
              type="button"
              onClick={onBackToMenu}
              className="pixel-btn px-3 py-2 bg-[#1D4ED8] border-2 border-white font-pixel text-[9px] sm:text-[10px] cursor-pointer whitespace-nowrap"
            >
              MAIN MENU
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
