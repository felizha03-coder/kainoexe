import React, { useState } from 'react';
import {
  ConsoleButton,
  GameOverSummary,
  GameScreenState,
  GameSettings,
  HighScoreEntry,
  HudSnapshot,
} from '../types/game';
import { inputBridge } from '../game/inputBridge';
import { SpidermanScene } from '../game/scenes/SpidermanScene';
import { PhaserGameCanvas } from './PhaserGameCanvas';
import { ScreenOverlays } from './ScreenOverlays';

interface GameBoyConsoleProps {
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
  onSceneReady: (scene: SpidermanScene) => void;
  onHudUpdate: (hud: HudSnapshot) => void;
  onStateChange: (state: GameScreenState) => void;
  onGameOver: (summary: GameOverSummary) => void;
  onHardwareButtonAction: (btn: ConsoleButton) => void;
}

export const GameBoyConsole: React.FC<GameBoyConsoleProps> = ({
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
  onSceneReady,
  onHudUpdate,
  onStateChange,
  onGameOver,
  onHardwareButtonAction,
}) => {
  const [pressedMap, setPressedMap] = useState<Partial<Record<ConsoleButton, boolean>>>({});

  const pressBtn = (btn: ConsoleButton) => (e: React.PointerEvent) => {
    e.preventDefault();
    setPressedMap((prev) => ({ ...prev, [btn]: true }));
    inputBridge.setButtonState(btn, true);
    onHardwareButtonAction(btn);
  };

  const releaseBtn = (btn: ConsoleButton) => () => {
    setPressedMap((prev) => ({ ...prev, [btn]: false }));
    inputBridge.setButtonState(btn, false);
  };

  const dpadControl = (
    <>
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 select-none touch-none">
        {/* Horizontal bar */}
        <div className="absolute top-1/3 left-0 w-full h-1/3 bg-[#27272A] rounded-md shadow-[0_4px_0_#09090B]" />
        {/* Vertical bar */}
        <div className="absolute left-1/3 top-0 w-1/3 h-full bg-[#27272A] rounded-md shadow-[0_4px_0_#09090B]" />

        {/* Center pivot dimple */}
        <div className="absolute left-1/3 top-1/3 w-1/3 h-1/3 bg-[#27272A] flex items-center justify-center pointer-events-none">
          <div className="w-4 h-4 rounded-full bg-[#18181B] shadow-inner" />
        </div>

        {/* UP */}
        <button
          type="button"
          aria-label="D-Pad Up (Jump / Menu Up)"
          data-pressed={Boolean(pressedMap.UP)}
          onPointerDown={pressBtn('UP')}
          onPointerUp={releaseBtn('UP')}
          onPointerLeave={releaseBtn('UP')}
          onPointerCancel={releaseBtn('UP')}
          className="gb-dpad-btn absolute left-1/3 top-0 w-1/3 h-1/3 flex items-center justify-center text-zinc-400 text-[10px] cursor-pointer rounded-t-md"
        >
          ▲
        </button>

        {/* DOWN */}
        <button
          type="button"
          aria-label="D-Pad Down (Menu Down)"
          data-pressed={Boolean(pressedMap.DOWN)}
          onPointerDown={pressBtn('DOWN')}
          onPointerUp={releaseBtn('DOWN')}
          onPointerLeave={releaseBtn('DOWN')}
          onPointerCancel={releaseBtn('DOWN')}
          className="gb-dpad-btn absolute left-1/3 bottom-0 w-1/3 h-1/3 flex items-center justify-center text-zinc-400 text-[10px] cursor-pointer rounded-b-md"
        >
          ▼
        </button>

        {/* LEFT */}
        <button
          type="button"
          aria-label="D-Pad Left (Move / Swing Left)"
          data-pressed={Boolean(pressedMap.LEFT)}
          onPointerDown={pressBtn('LEFT')}
          onPointerUp={releaseBtn('LEFT')}
          onPointerLeave={releaseBtn('LEFT')}
          onPointerCancel={releaseBtn('LEFT')}
          className="gb-dpad-btn absolute left-0 top-1/3 w-1/3 h-1/3 flex items-center justify-center text-zinc-400 text-[10px] cursor-pointer rounded-l-md"
        >
          ◀
        </button>

        {/* RIGHT */}
        <button
          type="button"
          aria-label="D-Pad Right (Move / Swing Right)"
          data-pressed={Boolean(pressedMap.RIGHT)}
          onPointerDown={pressBtn('RIGHT')}
          onPointerUp={releaseBtn('RIGHT')}
          onPointerLeave={releaseBtn('RIGHT')}
          onPointerCancel={releaseBtn('RIGHT')}
          className="gb-dpad-btn absolute right-0 top-1/3 w-1/3 h-1/3 flex items-center justify-center text-zinc-400 text-[10px] cursor-pointer rounded-r-md"
        >
          ▶
        </button>
      </div>
    </>
  );

  const abControls = (
    <div className="flex items-center gap-4 select-none touch-none">
      <div className="flex flex-col items-center gap-1.5 translate-y-2.5">
        <button
          type="button"
          aria-label="B Button (Jump)"
          data-pressed={Boolean(pressedMap.B)}
          onPointerDown={pressBtn('B')}
          onPointerUp={releaseBtn('B')}
          onPointerLeave={releaseBtn('B')}
          onPointerCancel={releaseBtn('B')}
          className="gb-action-btn w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#9F1239] hover:bg-[#BE123C] text-white font-pixel text-xs flex items-center justify-center cursor-pointer"
        >
          B
        </button>
        <span className="font-pixel text-[8px] text-zinc-600">JUMP</span>
      </div>

      <div className="flex flex-col items-center gap-1.5 -translate-y-2">
        <button
          type="button"
          aria-label="A Button (Web Shoot and Swing)"
          data-pressed={Boolean(pressedMap.A)}
          onPointerDown={pressBtn('A')}
          onPointerUp={releaseBtn('A')}
          onPointerLeave={releaseBtn('A')}
          onPointerCancel={releaseBtn('A')}
          className="gb-action-btn w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#9F1239] hover:bg-[#BE123C] text-white font-pixel text-xs flex items-center justify-center cursor-pointer"
        >
          A
        </button>
        <span className="font-pixel text-[8px] text-zinc-600">WEB</span>
      </div>
    </div>
  );

  const selectStartControls = (
    <div className="flex items-center justify-center gap-4 select-none">
      <div className="flex flex-col items-center gap-1">
        <button
          type="button"
          aria-label="SELECT Button (Settings or Menu)"
          onPointerDown={pressBtn('SELECT')}
          onPointerUp={releaseBtn('SELECT')}
          onPointerLeave={releaseBtn('SELECT')}
          className="w-11 h-3.5 rounded-full bg-[#52525B] hover:bg-[#3F3F46] shadow-[0_2px_0_#18181B] active:translate-y-0.5 transition-transform cursor-pointer"
        />
        <span className="font-pixel text-[7px] text-zinc-600 tracking-tighter">SELECT</span>
      </div>

      <div className="flex flex-col items-center gap-1">
        <button
          type="button"
          aria-label="START Button (Start or Pause)"
          onPointerDown={pressBtn('START')}
          onPointerUp={releaseBtn('START')}
          onPointerLeave={releaseBtn('START')}
          className="w-11 h-3.5 rounded-full bg-[#52525B] hover:bg-[#3F3F46] shadow-[0_2px_0_#18181B] active:translate-y-0.5 transition-transform cursor-pointer"
        />
        <span className="font-pixel text-[7px] text-zinc-600 tracking-tighter">START</span>
      </div>
    </div>
  );

  return (
    <section
      aria-label="SPIDERMAN: PIXEL ADVENTURE Handheld Console"
      className="w-full max-w-[1060px] mx-auto"
    >
      {/* Retro Light-Gray Landscape Game Boy Shell */}
      <div className="gb-plastic-grain gb-shell-shadow rounded-[28px] sm:rounded-[38px] border-4 border-zinc-400 p-3 sm:p-5 lg:p-6">
        {/* Top Shoulder Detail Bar */}
        <div className="flex items-center justify-between px-3 pb-2.5 text-[8px] font-pixel text-zinc-500">
          <span>GAME BOY PIXEL · SPIDER EDITION</span>
          <span className="hidden sm:inline">16-BIT HANDHELD ARCADE</span>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-5">
          {/* LEFT WING CONTROLS (Desktop / Wide Landscape) */}
          <div className="hidden lg:flex flex-col items-center justify-between gap-6 w-40 shrink-0 py-3">
            {dpadControl}
            <div className="pt-2">{selectStartControls}</div>
          </div>

          {/* CENTER DARK SCREEN BEZEL + LANDSCAPE GAME SCREEN */}
          <div className="w-full flex-1 bg-[#22242C] gb-bezel-shadow rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 border-2 border-zinc-700">
            {/* Authentic Top Bezel Header */}
            <div className="flex items-center justify-between px-1 pb-2 gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] shadow-[0_0_8px_#EF4444]" />
                <span className="font-pixel text-[7px] text-zinc-400">BATTERY</span>
              </div>
              <div className="hidden sm:flex items-center gap-2 flex-1 justify-end">
                <span className="h-0.5 flex-1 max-w-20 bg-[#9F1239]" />
                <span className="font-pixel text-[7px] text-zinc-400 whitespace-nowrap">
                  SPIDER-MAN DOT MATRIX
                </span>
                <span className="h-0.5 w-6 bg-[#1D4ED8]" />
              </div>
            </div>

            {/* 16:9 LANDSCAPE LCD GAME SCREEN */}
            <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-black gb-screen-glow bg-[#0284C7]">
              <PhaserGameCanvas
                onSceneReady={onSceneReady}
                callbacks={{
                  onHudUpdate,
                  onStateChange,
                  onGameOver,
                }}
              />

              <ScreenOverlays
                screen={screen}
                hud={hud}
                gameOver={gameOver}
                settings={settings}
                highScores={highScores}
                menuIndex={menuIndex}
                onSelectMenuIndex={onSelectMenuIndex}
                onStartGame={onStartGame}
                onOpenHowToPlay={onOpenHowToPlay}
                onOpenSettings={onOpenSettings}
                onOpenHighScores={onOpenHighScores}
                onPauseToggle={onPauseToggle}
                onBackToMenu={onBackToMenu}
                onUpdateSettings={onUpdateSettings}
                onClearHighScores={onClearHighScores}
              />

              {settings.scanlinesEnabled && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 lcd-scanlines z-30 opacity-65"
                />
              )}
            </div>

            {/* Console Logo Strip Beneath Screen */}
            <div className="flex items-center justify-between px-1 pt-2">
              <span className="font-pixel text-[8px] sm:text-[9px] text-zinc-300 tracking-tight">
                NINTENDO-STYLE <span className="text-sky-400">PIXELBOY</span>
              </span>
              <span className="font-pixel text-[7px] text-zinc-400">
                {hud.isSwinging ? 'WEB ATTACHED' : settings.difficulty}
              </span>
            </div>
          </div>

          {/* RIGHT WING CONTROLS (Desktop / Wide Landscape) */}
          <div className="hidden lg:flex flex-col items-center justify-between gap-8 w-40 shrink-0 py-3">
            {abControls}

            {/* Authentic Recessed Speaker Grille */}
            <div aria-hidden="true" className="grid grid-cols-5 gap-1.5 -rotate-12 pt-2">
              {Array.from({ length: 15 }).map((_, i) => (
                <span key={i} className="w-2 h-2 rounded-full bg-zinc-700/80 shadow-inner" />
              ))}
            </div>
          </div>

          {/* MOBILE & TABLET CONTROLS ROW (Compact handheld deck under screen) */}
          <div className="flex lg:hidden w-full items-center justify-between gap-2 px-1 sm:px-4 pt-1 pb-2">
            {dpadControl}
            <div className="flex flex-col items-center gap-4">
              {selectStartControls}
              <div aria-hidden="true" className="hidden sm:grid grid-cols-5 gap-1 -rotate-12">
                {Array.from({ length: 10 }).map((_, i) => (
                  <span key={i} className="w-1.5 h-1.5 rounded-full bg-zinc-700/75" />
                ))}
              </div>
            </div>
            {abControls}
          </div>
        </div>
      </div>
    </section>
  );
};
