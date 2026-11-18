import React, { useState } from 'react';
import { HelpCircle, Play, Settings, X } from 'lucide-react';
import { kainoAudio } from '../audio/kainoAudio';
import {
  DelonielSprite,
  DreamyMeadowScene,
  EnergyOrb,
  KainoSprite,
  PixelCloud,
  PixelHeart,
} from '../components/PixelSprites';
import { useKaino } from '../context/KainoContext';

export const TitleScreen: React.FC = () => {
  const {
    navigate,
    settings,
    updateSettings,
    collectHearts,
    resetAllProgress,
    progress,
  } = useKaino();

  const [modal, setModal] = useState<'HOW' | 'SETTINGS' | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const openModal = (next: 'HOW' | 'SETTINGS') => {
    kainoAudio.unlockFromUserGesture();
    kainoAudio.playClick();
    setConfirmReset(false);
    setModal(next);
  };

  return (
    <main className="min-h-[calc(100vh-3.5rem)] w-full pink-pixel-grid relative overflow-hidden flex flex-col items-center justify-center py-6 px-4 sm:px-6">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-4 flex justify-between px-6 opacity-90">
        <div className="animate-cloud-drift">
          <PixelCloud size={82} />
        </div>
        <div className="animate-cloud-drift-reverse mt-6">
          <PixelCloud size={72} />
        </div>
      </div>

      {/* Main Collector Card Shell — Thick Yellow Border + Mottled Magenta Card Body */}
      <section className="relative z-10 w-full max-w-[540px] yellow-card-shell rounded-[26px] p-3">
        <div className="card-magenta-texture rounded-[16px] border-2 border-[#6B2D5C]/75 px-4 sm:px-5 py-4 space-y-4 text-[#2E1028]">
          {/* Card Header Strip */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="basic-silver-tag px-2.5 py-0.5 font-body font-extrabold italic text-[10px] text-[#181016] shrink-0">
                BASIC
              </span>
              <span className="text-sm shrink-0">☆</span>
              <h1 className="font-body font-extrabold text-xl sm:text-2xl tracking-tight text-[#181016] truncate">
                KAINO.EXE
              </h1>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 tabular-nums">
              <span className="font-body font-extrabold text-xs">LP</span>
              <span className="font-body font-extrabold text-2xl leading-none">
                {progress.lovePoints || 2025}
              </span>
              <button
                type="button"
                onClick={() => collectHearts(1, 5, '+5 LP · Title Heart ♡')}
                aria-label="Collect heart bonus"
                className="cursor-pointer hover:scale-110 transition-transform"
              >
                <EnergyOrb variant="pink" size={22} />
              </button>
            </div>
          </div>

          {/* Large Metallic Silver Illustration Frame with Sky, Clouds, Flower Meadow & Sprites */}
          <div className="silver-bevel rounded-lg p-2">
            <DreamyMeadowScene
              bubbleText="you're kinda special <3"
              heightClass="h-56 sm:h-60"
            >
              <div
                className={`flex items-end gap-2 ${
                  settings.animationsEnabled ? 'animate-float-slow' : ''
                }`}
              >
                <KainoSprite pose="waving" size={92} />
                <div className="mb-14 animate-heartbeat">
                  <PixelHeart size={20} color="#EF4444" />
                </div>
                <DelonielSprite pose="smiling" size={92} />
              </div>
            </DreamyMeadowScene>

            {/* Silver Caption Plate */}
            <div className="pt-1.5 text-center font-body font-bold text-xs text-[#1E293B]">
              A little world, just for you · created by Deloniel
            </div>
          </div>

          {/* Ability-Style Dialogue Row Directly on Magenta Surface */}
          <div className="space-y-1.5 px-1">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <EnergyOrb variant="psychic" size={18} />
                <EnergyOrb variant="pink" size={18} />
              </div>
              <p className="font-body font-extrabold text-base text-[#181016]">
                Deloniel says
              </p>
              <span className="font-body font-bold text-sm">×</span>
            </div>
            <p className="font-body font-semibold text-sm leading-snug text-[#181016]">
              &ldquo;Hey, Kaino! I made something for you. Don&apos;t ask why, just explore it.&rdquo; ✿
            </p>
          </div>

          {/* Ability-Style Primary Menu Actions */}
          <div className="space-y-2.5 pt-1">
            <button
              type="button"
              onClick={() => navigate('WORLD')}
              className="w-full pixel-button py-3 px-4 bg-[#FCE24F] hover:bg-[#FFF5E8] text-[#181016] font-body font-extrabold text-base rounded-xl flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <EnergyOrb variant="pink" size={18} />
                <EnergyOrb variant="pink" size={18} />
                <span>Start Game</span>
              </span>
              <Play className="w-4 h-4 fill-current" />
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => openModal('HOW')}
                className="silver-bevel rounded-xl py-2.5 px-3 font-body font-extrabold text-sm text-[#181016] inline-flex items-center justify-center gap-1.5 cursor-pointer hover:brightness-105 whitespace-nowrap"
              >
                <HelpCircle className="w-4 h-4 text-[#C92778]" />
                <span>How to Play</span>
              </button>

              <button
                type="button"
                onClick={() => openModal('SETTINGS')}
                className="silver-bevel rounded-xl py-2.5 px-3 font-body font-extrabold text-sm text-[#181016] inline-flex items-center justify-center gap-1.5 cursor-pointer hover:brightness-105 whitespace-nowrap"
              >
                <Settings className="w-4 h-4 text-[#C92778]" />
                <span>Settings</span>
              </button>
            </div>
          </div>

          {/* Bottom Silver Weakness/Resistance + Retreat Status Bars */}
          <div className="pt-1 space-y-1.5">
            <div className="grid grid-cols-12 gap-2 items-center text-[10px] sm:text-[11px] font-body font-bold">
              <div className="col-span-7 silver-bevel rounded-full px-3 py-0.5 flex items-center justify-between gap-1 text-[#181016]">
                <span className="inline-flex items-center gap-1">
                  weakness <EnergyOrb variant="dark" size={14} /> ×2
                </span>
                <span className="text-[#475569]">|</span>
                <span className="inline-flex items-center gap-1">
                  resist <EnergyOrb variant="psychic" size={14} /> -30
                </span>
              </div>
              <div className="col-span-5 silver-bevel rounded-full px-2.5 py-0.5 flex items-center justify-between gap-1 text-[#181016]">
                <span>retreat</span>
                <span className="inline-flex items-center gap-0.5">
                  {[0, 1, 2, 3, 4].map((s) => (
                    <EnergyOrb key={s} variant="star" size={11} />
                  ))}
                </span>
              </div>
            </div>

            <div className="flex items-end justify-between text-[10px] text-[#181016]">
              <div>
                <p className="italic font-bold">Illus. Deloniel</p>
                <p className="font-extrabold">1105/1404 · © KAINO.EXE</p>
              </div>
              <p className="italic font-semibold text-right max-w-[55%]">
                Click anywhere in the garden to unlock cards &amp; surprises.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW TO PLAY & SETTINGS MODALS */}
      {modal && (
        <div
          className="fixed inset-0 z-50 bg-[#6B2D5C]/45 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setModal(null)}
        >
          <div
            className="w-full max-w-lg yellow-card-shell rounded-[24px] p-2.5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="card-magenta-texture rounded-2xl border-2 border-[#382033] p-5 sm:p-6 space-y-5 text-[#181016]">
              <div className="flex items-center justify-between silver-bevel rounded-lg px-3 py-2">
                <h2 className="font-body font-extrabold text-sm">
                  {modal === 'HOW' ? 'How to Play' : 'Settings'}
                </h2>
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  aria-label="Close modal"
                  className="p-1 bg-[#FCE24F] border border-[#382033] rounded cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {modal === 'HOW' ? (
                <div className="space-y-3 bg-[#FFF5E8]/90 border-2 border-[#382033] rounded-xl p-4 font-body text-sm leading-relaxed">
                  <p>
                    <strong>1. Explore Our Little World:</strong> Visit the Pink House for Special Messages, Heart Tree for Collectible Cards, Arcade Cabinet for 4 Mini-Games, and Flower Garden &amp; Pond for hidden surprises.
                  </p>
                  <p>
                    <strong>2. Collect LP:</strong> Reading notes, flipping trading cards, and playing mini-games automatically save your LP progress.
                  </p>
                  <p>
                    <strong>3. Unlock Secrets:</strong> Collect <strong>80 LP</strong> for the Legendary Card and <strong>120 LP</strong> to open the Secret Room!
                  </p>
                </div>
              ) : (
                <div className="space-y-3 bg-[#FFF5E8]/92 border-2 border-[#382033] rounded-xl p-4 font-body text-sm">
                  <div className="flex items-center justify-between p-2.5 bg-[#FFD4E7] border border-[#382033] rounded-lg">
                    <span className="font-bold">Master Audio</span>
                    <button
                      type="button"
                      onClick={() =>
                        updateSettings({ ...settings, soundEnabled: !settings.soundEnabled })
                      }
                      className={`pixel-button px-4 py-1 font-pixel text-[9px] cursor-pointer ${
                        settings.soundEnabled
                          ? 'bg-[#EC4899] text-white'
                          : 'bg-white text-[#181016]'
                      }`}
                    >
                      {settings.soundEnabled ? 'ON' : 'OFF'}
                    </button>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between font-bold text-xs">
                      <span>Music Volume</span>
                      <span className="tabular-nums">{Math.round(settings.bgmVolume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={Math.round(settings.bgmVolume * 100)}
                      onChange={(e) =>
                        updateSettings({
                          ...settings,
                          bgmVolume: Number(e.target.value) / 100,
                        })
                      }
                      className="w-full accent-[#EC4899]"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between font-bold text-xs">
                      <span>Sound Effects Volume</span>
                      <span className="tabular-nums">{Math.round(settings.sfxVolume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={Math.round(settings.sfxVolume * 100)}
                      onChange={(e) =>
                        updateSettings({
                          ...settings,
                          sfxVolume: Number(e.target.value) / 100,
                        })
                      }
                      className="w-full accent-[#EC4899]"
                    />
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-[#C7B6F3]/45 border border-[#382033] rounded-lg">
                    <span className="font-bold">Floating Animations</span>
                    <button
                      type="button"
                      onClick={() =>
                        updateSettings({
                          ...settings,
                          animationsEnabled: !settings.animationsEnabled,
                        })
                      }
                      className="silver-bevel px-3 py-1 rounded font-pixel text-[9px] cursor-pointer"
                    >
                      {settings.animationsEnabled ? 'SMOOTH' : 'REDUCED'}
                    </button>
                  </div>

                  <div className="pt-2 border-t border-[#382033]/20 flex items-center justify-between gap-3">
                    <span className="text-xs font-bold">
                      Saved LP: {progress.lovePoints} · Hearts: {progress.hearts}
                    </span>
                    {!confirmReset ? (
                      <button
                        type="button"
                        onClick={() => setConfirmReset(true)}
                        className="px-3 py-1.5 bg-rose-100 border border-[#382033] font-pixel text-[8px] text-rose-700 cursor-pointer"
                      >
                        RESET PROGRESS
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            resetAllProgress();
                            setConfirmReset(false);
                          }}
                          className="px-3 py-1.5 bg-[#EC4899] border border-[#382033] font-pixel text-[8px] text-white cursor-pointer"
                        >
                          YES, RESET
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmReset(false)}
                          className="px-2.5 py-1.5 bg-white border border-[#382033] font-pixel text-[8px] cursor-pointer"
                        >
                          CANCEL
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
