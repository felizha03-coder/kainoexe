import React, { useState } from 'react';
import { ArrowLeft, Lock, Unlock } from 'lucide-react';
import {
  DelonielSprite,
  DreamyMeadowScene,
  EnergyOrb,
  KainoSprite,
  PixelHeart,
} from '../components/PixelSprites';
import { useKaino } from '../context/KainoContext';
import { SECRET_ROOM_UNLOCK_LP } from '../types/kaino';

export const SecretRoomScreen: React.FC = () => {
  const {
    navigate,
    progress,
    unlockSecretRoom,
    keepLittleWorldForever,
  } = useKaino();

  const [shakeDoor, setShakeDoor] = useState(false);
  const canUnlock = progress.lovePoints >= SECRET_ROOM_UNLOCK_LP;
  const isOpen = progress.secretRoomUnlocked;
  const pct = Math.min(100, Math.round((progress.lovePoints / SECRET_ROOM_UNLOCK_LP) * 100));

  const handleDoorTap = () => {
    if (canUnlock) {
      unlockSecretRoom();
    } else {
      setShakeDoor(true);
      window.setTimeout(() => setShakeDoor(false), 450);
    }
  };

  return (
    <main className="min-h-[calc(100vh-3.5rem)] w-full pink-pixel-grid py-6 px-4 sm:px-6 flex flex-col items-center">
      <div className="w-full max-w-3xl space-y-6">
        <div className="yellow-card-shell rounded-2xl p-1.5">
          <div className="card-magenta-texture rounded-xl border-2 border-[#382033] px-5 py-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="basic-silver-tag px-2.5 py-0.5 font-body font-extrabold italic text-[10px]">
                  SECRET
                </span>
                <h1 className="font-body font-extrabold text-lg sm:text-xl text-[#181016]">
                  {isOpen ? 'SECRET ROOM ♡' : 'MYSTERIOUS PINK DOOR'}
                </h1>
              </div>
              <p className="font-body font-bold text-xs sm:text-sm text-[#181016]/85">
                {isOpen
                  ? 'A quiet little corner made just for Kaino.'
                  : 'Earn Love Points across the world to unlock this special room.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('WORLD')}
              className="pixel-button px-4 py-2 bg-[#FCE24F] font-pixel text-[9px] text-[#181016] inline-flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>BACK TO WORLD</span>
            </button>
          </div>
        </div>

        {!isOpen ? (
          <section className="yellow-card-shell rounded-[26px] p-2.5">
            <div className="card-magenta-texture rounded-[18px] border-2 border-[#382033] p-6 sm:p-8 text-center space-y-6 text-[#181016]">
              <button
                type="button"
                onClick={handleDoorTap}
                className={`mx-auto w-44 h-56 rounded-t-full border-4 border-[#382033] flex flex-col items-center justify-center gap-3 cursor-pointer transition-transform ${
                  canUnlock
                    ? 'bg-gradient-to-b from-[#FCE24F] to-[#FFD4E7] hover:scale-105'
                    : 'silver-bevel'
                } ${shakeDoor ? 'translate-x-2' : ''}`}
              >
                <div className="w-16 h-16 rounded-2xl bg-[#FFF5E8] border-3 border-[#382033] flex items-center justify-center">
                  {canUnlock ? (
                    <Unlock className="w-8 h-8 text-[#EC4899] animate-bounce" />
                  ) : (
                    <Lock className="w-8 h-8 text-[#382033]" />
                  )}
                </div>
                <span className="font-pixel text-[9px] text-[#181016]">
                  {canUnlock ? 'TAP TO UNLOCK ♡' : 'LOCKED'}
                </span>
              </button>

              <div className="max-w-md mx-auto silver-bevel rounded-xl p-3 space-y-2">
                <div className="flex justify-between font-pixel text-[9px] text-[#181016] tabular-nums">
                  <span>LOVE POINTS PROGRESS</span>
                  <span>
                    {progress.lovePoints} / {SECRET_ROOM_UNLOCK_LP} LP
                  </span>
                </div>
                <div className="w-full h-4 bg-[#FFD4E7] border-2 border-[#382033] rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full bg-[#EC4899] rounded-full transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              {canUnlock ? (
                <button
                  type="button"
                  onClick={() => unlockSecretRoom()}
                  className="pixel-button px-6 py-3 bg-[#FCE24F] text-[#181016] font-pixel text-xs cursor-pointer"
                >
                  [ UNLOCK SECRET ROOM ♡ ]
                </button>
              ) : (
                <div className="flex flex-wrap justify-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => navigate('LETTERS')}
                    className="silver-bevel px-4 py-2 rounded-lg font-pixel text-[9px] cursor-pointer"
                  >
                    READ MESSAGES (+LP)
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('CARDS')}
                    className="silver-bevel px-4 py-2 rounded-lg font-pixel text-[9px] cursor-pointer"
                  >
                    FLIP CARDS (+LP)
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('ARCADE')}
                    className="silver-bevel px-4 py-2 rounded-lg font-pixel text-[9px] cursor-pointer"
                  >
                    PLAY ARCADE (+LP)
                  </button>
                </div>
              )}
            </div>
          </section>
        ) : (
          <section className="yellow-card-shell rounded-[26px] p-2.5">
            <div className="card-magenta-texture rounded-[18px] border-2 border-[#382033] p-5 sm:p-7 text-center space-y-5 text-[#181016]">
              <div className="silver-bevel rounded-lg p-1.5">
                <DreamyMeadowScene bubbleText="and somehow, that's you <3" heightClass="h-52">
                  <div className="flex items-end gap-2 translate-y-1">
                    <KainoSprite pose="blushing" size={82} />
                    <div className="mb-12 animate-heartbeat">
                      <PixelHeart size={20} color="#EF4444" />
                    </div>
                    <DelonielSprite pose="blushing" size={82} />
                  </div>
                </DreamyMeadowScene>
                <div className="pt-1 text-center font-body font-bold text-xs text-[#1E293B]">
                  secret room · deloniel &amp; kaino
                </div>
              </div>

              <div className="max-w-lg mx-auto silver-bevel rounded-2xl p-5 space-y-3 font-body text-sm sm:text-base text-[#181016] leading-relaxed">
                <div className="flex justify-center gap-1.5">
                  <EnergyOrb variant="psychic" size={16} />
                  <EnergyOrb variant="pink" size={16} />
                </div>
                <p>Some connections are difficult to explain.</p>
                <p>
                  Sometimes, you just meet someone who makes everything a little more interesting.
                </p>
                <p className="font-extrabold text-[#C92778]">
                  And somehow, that&apos;s you.
                </p>
                <p className="font-body italic font-bold text-xs pt-1">— Deloniel ♡</p>
              </div>

              <button
                type="button"
                onClick={keepLittleWorldForever}
                className="pixel-button px-6 py-3.5 bg-[#FCE24F] hover:bg-[#FFF5E8] text-[#181016] font-pixel text-[10px] sm:text-xs cursor-pointer"
              >
                [ KEEP THIS LITTLE WORLD ]
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
};
