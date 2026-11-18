import React from 'react';
import { Home, MapPin, Volume2, VolumeX } from 'lucide-react';
import { useKaino } from '../context/KainoContext';
import { SECRET_ROOM_UNLOCK_LP } from '../types/kaino';
import { EnergyOrb, PixelHeart } from './PixelSprites';

export const TopHud: React.FC = () => {
  const { screen, navigate, progress, settings, updateSettings, toast } = useKaino();

  if (screen === 'BOOT') return null;

  const pct = Math.min(100, Math.round((progress.lovePoints / SECRET_ROOM_UNLOCK_LP) * 100));

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FCE24F] border-b-3 border-[#6B2D5C] shadow-sm">
      <div className="max-w-6xl mx-auto px-3 sm:px-5 h-14 flex items-center justify-between gap-4">
        {/* Zone 1: KAINO.EXE Wordmark with BASIC tag */}
        <button
          type="button"
          onClick={() => navigate('TITLE')}
          className="flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
        >
          <span className="basic-silver-tag px-2 py-0.5 font-body font-extrabold italic text-[9px] text-[#181016] hidden sm:inline-block">
            EXE
          </span>
          <span className="font-body font-extrabold text-base sm:text-lg tracking-tight text-[#181016]">
            KAINO.EXE
          </span>
        </button>

        {/* Zone 2: Clean Unboxed LP / Hearts / Secret Door Status */}
        <div className="flex items-center gap-4 sm:gap-6 font-body font-extrabold text-xs sm:text-sm text-[#181016] tabular-nums">
          <div className="flex items-center gap-1.5" title="Love Points">
            <EnergyOrb variant="pink" size={16} />
            <span>LP {progress.lovePoints}</span>
          </div>

          <div className="flex items-center gap-1.5" title="Hearts Collected">
            <PixelHeart size={15} color="#EC4899" />
            <span>{progress.hearts}</span>
          </div>

          <button
            type="button"
            onClick={() => navigate('SECRET_ROOM')}
            title="Secret Room Unlock Progress"
            className="hidden sm:inline-flex items-center gap-1.5 cursor-pointer hover:underline whitespace-nowrap"
          >
            <EnergyOrb variant="psychic" size={15} />
            <span>
              {progress.secretRoomUnlocked || progress.lovePoints >= SECRET_ROOM_UNLOCK_LP
                ? 'Secret Ready'
                : `Door ${pct}%`}
            </span>
          </button>
        </div>

        {/* Zone 3: World Nav, Sound Toggle & Home */}
        <div className="flex items-center gap-2 shrink-0">
          {screen !== 'WORLD' && screen !== 'TITLE' && (
            <button
              type="button"
              onClick={() => navigate('WORLD')}
              className="silver-bevel px-3 py-1.5 rounded-md font-body font-extrabold text-xs text-[#181016] inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap hover:brightness-105"
            >
              <MapPin className="w-3.5 h-3.5 text-[#C92778]" />
              <span className="hidden sm:inline">World</span>
            </button>
          )}

          <button
            type="button"
            onClick={() =>
              updateSettings({ ...settings, soundEnabled: !settings.soundEnabled })
            }
            aria-label={settings.soundEnabled ? 'Mute sound' : 'Enable sound'}
            className="silver-bevel p-1.5 sm:px-2.5 sm:py-1.5 rounded-md text-[#181016] cursor-pointer inline-flex items-center gap-1 hover:brightness-105"
          >
            {settings.soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-[#C92778]" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-500" />
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate('TITLE')}
            aria-label="Title Screen"
            className="silver-bevel p-1.5 sm:px-2.5 sm:py-1.5 rounded-md text-[#181016] font-body font-extrabold text-xs cursor-pointer inline-flex items-center gap-1 whitespace-nowrap hover:brightness-105"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Home</span>
          </button>
        </div>
      </div>

      {/* Live Toast Feedback Bar */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 silver-bevel rounded-lg px-4 py-2 font-body font-extrabold text-xs text-[#181016]">
          {toast.text}
        </div>
      )}
    </header>
  );
};
