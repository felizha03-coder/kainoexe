import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { kainoAudio } from '../audio/kainoAudio';
import { PixelHeart } from '../components/PixelSprites';
import { useKaino } from '../context/KainoContext';

const BOOT_LINES = [
  'INITIALIZING KAINO.EXE...',
  'LOADING LITTLE SURPRISES...',
  'SEARCHING FOR SOMEBODY SPECIAL...',
  'USER FOUND: KAINO ♡ (VIP PLAYER)',
  'CREATED BY: DELONIEL',
  'WELCOME TO OUR LITTLE WORLD.',
];

export const BootScreen: React.FC = () => {
  const { navigate, settings, updateSettings } = useKaino();
  const [visibleCount, setVisibleCount] = useState(1);
  const [progressPct, setProgressPct] = useState(16);

  useEffect(() => {
    if (visibleCount >= BOOT_LINES.length) return;
    const timer = window.setTimeout(() => {
      const next = visibleCount + 1;
      setVisibleCount(next);
      setProgressPct(Math.round((next / BOOT_LINES.length) * 100));
      if (next === BOOT_LINES.length) {
        kainoAudio.playBootComplete();
      } else {
        kainoAudio.playBootBeep();
      }
    }, 600);
    return () => window.clearTimeout(timer);
  }, [visibleCount]);

  const bootDone = visibleCount >= BOOT_LINES.length;

  const handleOpen = () => {
    kainoAudio.unlockFromUserGesture();
    kainoAudio.playBootComplete();
    navigate('TITLE');
  };

  return (
    <main className="min-h-screen w-full pink-pixel-grid text-[#481D3F] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {settings.animationsEnabled && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          {[
            { left: '12%', top: '18%', delay: '0s' },
            { left: '84%', top: '22%', delay: '0.7s' },
            { left: '18%', top: '76%', delay: '1.3s' },
            { left: '80%', top: '72%', delay: '0.4s' },
          ].map((h, i) => (
            <div
              key={i}
              className="absolute animate-float-slow opacity-70"
              style={{ left: h.left, top: h.top, animationDelay: h.delay }}
            >
              <PixelHeart size={20} color={i % 2 === 0 ? '#EC4899' : '#A78BFA'} />
            </div>
          ))}
        </div>
      )}

      <section className="relative z-10 w-full max-w-2xl yellow-card-shell rounded-[24px] p-2.5">
        <div className="bg-[#FFF9FC] border-2 border-[#6B2D5C] rounded-[16px] overflow-hidden">
          <div className="card-magenta-texture px-4 py-2.5 border-b-2 border-[#6B2D5C] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-pixel text-[9px] sm:text-[11px] text-[#2E1028]">
              <PixelHeart size={16} color="#FEF08A" />
              <span>KAINO.EXE — SYSTEM STARTUP</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  kainoAudio.unlockFromUserGesture();
                  updateSettings({ ...settings, soundEnabled: !settings.soundEnabled });
                }}
                aria-label="Toggle sound"
                className="silver-bevel px-2.5 py-1 rounded text-[#481D3F] cursor-pointer inline-flex items-center gap-1 font-pixel text-[8px]"
              >
                {settings.soundEnabled ? (
                  <Volume2 className="w-3.5 h-3.5 text-[#DB2777]" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span className="hidden sm:inline">{settings.soundEnabled ? 'SFX ON' : 'MUTED'}</span>
              </button>

              {!bootDone && (
                <button
                  type="button"
                  onClick={handleOpen}
                  className="px-2.5 py-1 bg-[#FEF08A] hover:bg-white border-2 border-[#6B2D5C] rounded font-pixel text-[8px] text-[#481D3F] cursor-pointer whitespace-nowrap"
                >
                  SKIP ▶▶
                </button>
              )}
            </div>
          </div>

          <div className="p-5 sm:p-8 space-y-6 bg-gradient-to-b from-[#FFF9FC] to-[#FFE8F4]">
            <div className="space-y-3 min-h-[195px] font-pixel text-[10px] sm:text-xs leading-relaxed">
              {BOOT_LINES.slice(0, visibleCount).map((line, idx) => (
                <p
                  key={line}
                  className={
                    idx === 3
                      ? 'text-[#DB2777]'
                      : idx === 5
                      ? 'text-[#7C3AED]'
                      : 'text-[#481D3F]'
                  }
                >
                  <span className="text-[#EC4899] mr-2">&gt;</span>
                  {line}
                  {idx === visibleCount - 1 && (
                    <span className="inline-block w-2.5 h-3.5 bg-[#EC4899] ml-1.5 align-middle animate-pulse" />
                  )}
                </p>
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between font-pixel text-[9px] text-[#6B2D5C] tabular-nums">
                <span>LOADING PROGRESS</span>
                <span>{progressPct}%</span>
              </div>
              <div className="w-full h-6 bg-[#FFD4E7] border-2 border-[#6B2D5C] rounded p-1 flex gap-1">
                {Array.from({ length: 12 }).map((_, i) => {
                  const filled = (i + 1) / 12 <= progressPct / 100;
                  return (
                    <div
                      key={i}
                      className={`flex-1 h-full transition-colors duration-200 rounded-xs ${
                        filled ? 'bg-[#EC4899]' : 'bg-white/60'
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
              <span className="font-silk text-xs text-[#6B2D5C]">
                Created by Deloniel ♡
              </span>

              <button
                type="button"
                onClick={handleOpen}
                className="pixel-button px-5 py-3 bg-[#FEF08A] hover:bg-white text-[#481D3F] font-pixel text-[10px] sm:text-xs cursor-pointer whitespace-nowrap"
              >
                [ OPEN KAINO.EXE ]
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
