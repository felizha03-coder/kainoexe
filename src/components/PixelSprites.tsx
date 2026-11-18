import React from 'react';
import { CharacterPose, DuoPose } from '../types/kaino';

interface SingleSpriteProps {
  pose?: CharacterPose;
  className?: string;
  size?: number;
  flipX?: boolean;
}

export const PixelHeart: React.FC<{
  size?: number;
  color?: string;
  className?: string;
}> = ({ size = 20, color = '#EC4899', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 11 10"
    shapeRendering="crispEdges"
    className={`pixelated ${className}`}
    aria-hidden="true"
  >
    <path
      d="M2 1h2v1h1v1h1V2h1V1h2v1h1v3H9v1H8v1H7v1H6v1H5V8H4V7H3V6H2V5H1V2h1V1z"
      fill="#382033"
    />
    <path
      d="M2 2h2v1h1v1h1V3h1V2h2v3H8v1H7v1H6v1H5V7H4V6H3V5H2V2z"
      fill={color}
    />
    <rect x="3" y="3" width="1" height="1" fill="#FFF5E8" />
  </svg>
);

export const PixelStar: React.FC<{
  size?: number;
  color?: string;
  className?: string;
}> = ({ size = 20, color = '#C7B6F3', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 11 11"
    shapeRendering="crispEdges"
    className={`pixelated ${className}`}
    aria-hidden="true"
  >
    <rect x="5" y="1" width="1" height="9" fill="#382033" />
    <rect x="1" y="5" width="9" height="1" fill="#382033" />
    <rect x="4" y="2" width="3" height="7" fill={color} />
    <rect x="2" y="4" width="7" height="3" fill={color} />
    <rect x="3" y="3" width="5" height="5" fill={color} />
    <rect x="4" y="4" width="1" height="1" fill="#FFF5E8" />
  </svg>
);

export const PixelFlower: React.FC<{
  size?: number;
  petalColor?: string;
  className?: string;
}> = ({ size = 20, petalColor = '#FFD4E7', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 12 12"
    shapeRendering="crispEdges"
    className={`pixelated ${className}`}
    aria-hidden="true"
  >
    <rect x="5" y="7" width="2" height="4" fill="#16A34A" />
    <rect x="3" y="8" width="2" height="1" fill="#22C55E" />
    <rect x="4" y="1" width="4" height="2" fill={petalColor} />
    <rect x="4" y="5" width="4" height="2" fill={petalColor} />
    <rect x="2" y="3" width="2" height="2" fill={petalColor} />
    <rect x="8" y="3" width="2" height="2" fill={petalColor} />
    <rect x="4" y="3" width="4" height="2" fill="#FFE66D" />
  </svg>
);

/** Pokémon-style Energy / Type Icon Orbs */
export const EnergyOrb: React.FC<{
  variant: 'pink' | 'psychic' | 'dark' | 'star';
  size?: number;
}> = ({ variant, size = 18 }) => {
  if (variant === 'pink') {
    return (
      <span
        style={{ width: size, height: size }}
        className="rounded-full bg-gradient-to-br from-[#F9A8D4] via-[#EC4899] to-[#BE185D] border-[1.5px] border-[#1F111C] inline-flex items-center justify-center shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]"
        aria-hidden="true"
      >
        <svg width={Math.round(size * 0.62)} height={Math.round(size * 0.62)} viewBox="0 0 10 10">
          <path d="M5 1 L6.4 3.8 L9.5 5 L6.4 6.2 L5 9 L3.6 6.2 L0.5 5 L3.6 3.8 Z" fill="#1F111C" />
          <circle cx="5" cy="5" r="1.1" fill="#FCE7F3" />
        </svg>
      </span>
    );
  }
  if (variant === 'psychic') {
    return (
      <span
        style={{ width: size, height: size }}
        className="rounded-full bg-gradient-to-br from-[#DDD6FE] via-[#A855F7] to-[#6B21A8] border-[1.5px] border-[#1F111C] inline-flex items-center justify-center shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]"
        aria-hidden="true"
      >
        <svg width={Math.round(size * 0.66)} height={Math.round(size * 0.66)} viewBox="0 0 12 12">
          <path d="M1 6 Q6 2 11 6 Q6 10 1 6 Z" fill="none" stroke="#1F111C" strokeWidth="1.3" />
          <circle cx="6" cy="6" r="1.8" fill="#1F111C" />
        </svg>
      </span>
    );
  }
  if (variant === 'dark') {
    return (
      <span
        style={{ width: size, height: size }}
        className="rounded-full bg-gradient-to-br from-[#94A3B8] via-[#334155] to-[#0F172A] border-[1.5px] border-[#1F111C] inline-flex items-center justify-center shrink-0"
        aria-hidden="true"
      >
        <svg width={Math.round(size * 0.62)} height={Math.round(size * 0.62)} viewBox="0 0 10 10">
          <path d="M6.5 1.5 A3.8 3.8 0 1 0 8.5 7.5 A3 3 0 1 1 6.5 1.5 Z" fill="#F8FAFC" />
        </svg>
      </span>
    );
  }
  return (
    <span
      style={{ width: size, height: size }}
      className="rounded-full bg-gradient-to-br from-[#FFFFFF] via-[#E2E8F0] to-[#94A3B8] border border-[#334155] inline-flex items-center justify-center shrink-0"
      aria-hidden="true"
    >
      <svg width={Math.round(size * 0.62)} height={Math.round(size * 0.62)} viewBox="0 0 10 10">
        <path
          d="M5 0.8 L6 3.7 L9 3.7 L6.6 5.5 L7.5 8.5 L5 6.7 L2.5 8.5 L3.4 5.5 L1 3.7 L4 3.7 Z"
          fill="#1F111C"
        />
      </svg>
    </span>
  );
};

/** Pink Pixel Speech Bubble with Tiny Ribbon Cat Mascot on top (matching reference aesthetic) */
export const PixelSpeechBubble: React.FC<{
  text: string;
  showMascot?: boolean;
  className?: string;
}> = ({ text, showMascot = true, className = '' }) => (
  <div className={`relative inline-flex flex-col items-center ${className}`}>
    {showMascot && (
      <svg
        width="34"
        height="24"
        viewBox="0 0 17 12"
        shapeRendering="crispEdges"
        className="pixelated -mb-1 relative z-10"
        aria-hidden="true"
      >
        {/* Ears */}
        <rect x="2" y="1" width="3" height="3" fill="#382033" />
        <rect x="12" y="1" width="3" height="3" fill="#382033" />
        <rect x="3" y="2" width="2" height="2" fill="#FFFFFF" />
        <rect x="12" y="2" width="2" height="2" fill="#FFFFFF" />
        {/* Head */}
        <rect x="2" y="3" width="13" height="7" fill="#382033" />
        <rect x="3" y="4" width="11" height="5" fill="#FFFFFF" />
        {/* Eyes & Nose */}
        <rect x="5" y="6" width="1" height="2" fill="#382033" />
        <rect x="11" y="6" width="1" height="2" fill="#382033" />
        <rect x="8" y="7" width="1" height="1" fill="#FACC15" />
        {/* Whiskers */}
        <rect x="1" y="6" width="2" height="1" fill="#382033" />
        <rect x="14" y="6" width="2" height="1" fill="#382033" />
        {/* Cute Pink Bow */}
        <rect x="10" y="1" width="5" height="3" fill="#EC4899" />
        <rect x="12" y="2" width="1" height="1" fill="#FFE66D" />
      </svg>
    )}
    <div className="relative bg-[#F472B6] border-2 border-[#382033] px-3 py-1 shadow-[0_2px_0_#382033] text-center">
      <span className="font-silk font-bold text-[10px] sm:text-[11px] text-white drop-shadow-[1px_1px_0_#382033] whitespace-nowrap">
        {text}
      </span>
      <div
        aria-hidden="true"
        className="w-2.5 h-2.5 bg-[#F472B6] border-r-2 border-b-2 border-[#382033] rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2"
      />
    </div>
  </div>
);

/** Adorable Original Pixel Companion Puff for Garden Corners */
export const PixelCompanionPuff: React.FC<{
  variant?: 'lavender' | 'pink' | 'mint';
  size?: number;
}> = ({ variant = 'lavender', size = 28 }) => {
  const body = variant === 'lavender' ? '#A78BFA' : variant === 'pink' ? '#F9A8D4' : '#38BDF8';
  const accent = variant === 'lavender' ? '#7C3AED' : variant === 'pink' ? '#EC4899' : '#0284C7';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      shapeRendering="crispEdges"
      className="pixelated"
      aria-hidden="true"
    >
      <rect x="3" y="2" width="2" height="2" fill="#382033" />
      <rect x="9" y="2" width="2" height="2" fill="#382033" />
      <rect x="2" y="4" width="10" height="7" fill="#382033" />
      <rect x="3" y="5" width="8" height="5" fill={body} />
      <rect x="4" y="3" width="1" height="2" fill={accent} />
      <rect x="9" y="3" width="1" height="2" fill={accent} />
      <rect x="5" y="7" width="1" height="2" fill="#FFFFFF" />
      <rect x="8" y="7" width="1" height="2" fill="#FFFFFF" />
      <rect x="5" y="8" width="1" height="1" fill="#382033" />
      <rect x="8" y="8" width="1" height="1" fill="#382033" />
      <rect x="6" y="9" width="2" height="1" fill="#FFF5E8" />
    </svg>
  );
};

/** KAINO — Chibi MapleStory-inspired Pixel Sprite (fluffy brown bangs, big eyes, dark hoodie) */
export const KainoSprite: React.FC<SingleSpriteProps> = ({
  pose = 'smiling',
  className = '',
  size = 96,
  flipX = false,
}) => {
  const isBlushing = pose === 'blushing' || pose === 'sending-hearts';
  const isWaving = pose === 'waving' || pose === 'sending-hearts';
  const eyeOffsetX = pose === 'looking' ? 1 : 0;

  return (
    <svg
      width={size}
      height={Math.round(size * 1.18)}
      viewBox="0 0 24 28"
      shapeRendering="crispEdges"
      className={`pixelated ${className}`}
      style={flipX ? { transform: 'scaleX(-1)' } : undefined}
      role="img"
      aria-label="Kaino pixel character"
    >
      {/* Fluffy Layered Chestnut Hair */}
      <rect x="6" y="1" width="12" height="2" fill="#382033" />
      <rect x="4" y="2" width="16" height="8" fill="#382033" />
      <rect x="3" y="5" width="2" height="5" fill="#382033" />
      <rect x="19" y="5" width="2" height="5" fill="#382033" />

      <rect x="6" y="2" width="12" height="5" fill="#6D4139" />
      <rect x="4" y="4" width="16" height="4" fill="#6D4139" />
      <rect x="7" y="3" width="4" height="1" fill="#9A6156" />
      <rect x="13" y="3" width="3" height="1" fill="#9A6156" />
      {/* Bangs Swoops */}
      <rect x="6" y="7" width="3" height="2" fill="#6D4139" />
      <rect x="10" y="7" width="3" height="2" fill="#6D4139" />
      <rect x="15" y="7" width="3" height="2" fill="#6D4139" />

      {/* Face */}
      <rect x="6" y="8" width="12" height="7" fill="#FFE4D6" />
      <rect x="5" y="9" width="1" height="5" fill="#FFE4D6" />
      <rect x="18" y="9" width="1" height="5" fill="#FFE4D6" />
      <rect x="6" y="15" width="12" height="1" fill="#382033" />

      {/* Big Chibi Eyes with Catchlights */}
      {pose === 'blushing' ? (
        <>
          <rect x="7" y="11" width="3" height="1" fill="#382033" />
          <rect x="14" y="11" width="3" height="1" fill="#382033" />
        </>
      ) : (
        <>
          <rect x={7 + eyeOffsetX} y="10" width="2" height="3" fill="#2D162C" />
          <rect x={14 + eyeOffsetX} y="10" width="2" height="3" fill="#2D162C" />
          <rect x={7 + eyeOffsetX} y="10" width="1" height="1" fill="#FFFFFF" />
          <rect x={14 + eyeOffsetX} y="10" width="1" height="1" fill="#FFFFFF" />
          <rect x={8 + eyeOffsetX} y="12" width="1" height="1" fill="#7F1D1D" />
          <rect x={15 + eyeOffsetX} y="12" width="1" height="1" fill="#7F1D1D" />
        </>
      )}

      {/* Rosy Cheeks */}
      <rect x="6" y="13" width={isBlushing ? 3 : 2} height="1" fill="#FF8AB5" />
      <rect x={isBlushing ? 15 : 16} y="13" width={isBlushing ? 3 : 2} height="1" fill="#FF8AB5" />

      {/* Smile */}
      <rect x="11" y="14" width="2" height="1" fill="#C92778" />

      {/* Cozy Charcoal Oversized Hoodie with Pastel Strings */}
      <rect x="6" y="16" width="12" height="7" fill="#18121B" />
      <rect x="7" y="17" width="10" height="5" fill="#2B2130" />
      <rect x="10" y="17" width="1" height="2" fill="#E2E8F0" />
      <rect x="13" y="17" width="1" height="2" fill="#E2E8F0" />
      <rect x="9" y="20" width="6" height="2" fill="#1F1824" />

      {/* Arms */}
      {isWaving ? (
        <>
          <rect x="2" y="13" width="4" height="4" fill="#18121B" />
          <rect x="3" y="14" width="3" height="3" fill="#2B2130" />
          <rect x="3" y="12" width="2" height="2" fill="#FFE4D6" />
        </>
      ) : (
        <>
          <rect x="4" y="17" width="2" height="5" fill="#18121B" />
          <rect x="4" y="18" width="2" height="3" fill="#2B2130" />
          <rect x="4" y="21" width="2" height="1" fill="#FFE4D6" />
        </>
      )}
      <rect x="18" y="17" width="2" height="5" fill="#18121B" />
      <rect x="18" y="18" width="2" height="3" fill="#2B2130" />
      <rect x="18" y="21" width="2" height="1" fill="#FFE4D6" />

      {/* Light Shorts / Jeans & Sneakers */}
      <rect x="7" y="23" width="4" height="2" fill="#F8FAFC" />
      <rect x="13" y="23" width="4" height="2" fill="#F8FAFC" />
      <rect x="7" y="25" width="4" height="2" fill="#18121B" />
      <rect x="13" y="25" width="4" height="2" fill="#18121B" />
      <rect x="7" y="26" width="4" height="1" fill="#FFFFFF" />
      <rect x="13" y="26" width="4" height="1" fill="#FFFFFF" />

      {(pose === 'sending-hearts' || pose === 'blushing') && (
        <path d="M19 1h1v1h1V1h1v2h-1v1h-1V3h-1V1z" fill="#EC4899" />
      )}
    </svg>
  );
};

/** DELONIEL — Chibi Pixel Sprite, 100% CLEAN-SHAVEN (NO MUSTACHE, NO BEARD, NO FACIAL HAIR!) */
export const DelonielSprite: React.FC<SingleSpriteProps> = ({
  pose = 'smiling',
  className = '',
  size = 96,
  flipX = false,
}) => {
  const isBlushing = pose === 'blushing' || pose === 'sending-hearts';
  const isWaving = pose === 'waving' || pose === 'sending-hearts';
  const eyeOffsetX = pose === 'looking' ? -1 : 0;

  return (
    <svg
      width={size}
      height={Math.round(size * 1.18)}
      viewBox="0 0 24 28"
      shapeRendering="crispEdges"
      className={`pixelated ${className}`}
      style={flipX ? { transform: 'scaleX(-1)' } : undefined}
      role="img"
      aria-label="Deloniel clean-shaven pixel character"
    >
      {/* Swept Dark-Plum / Midnight-Black Hair */}
      <rect x="6" y="1" width="12" height="2" fill="#1F111C" />
      <rect x="4" y="2" width="16" height="8" fill="#2A1424" />
      <rect x="3" y="5" width="2" height="5" fill="#2A1424" />
      <rect x="19" y="5" width="2" height="5" fill="#2A1424" />
      <rect x="7" y="3" width="4" height="1" fill="#6D28D9" />
      <rect x="14" y="3" width="3" height="1" fill="#6D28D9" />
      {/* Center-parted playful hair swoop */}
      <rect x="6" y="7" width="4" height="2" fill="#2A1424" />
      <rect x="14" y="7" width="4" height="2" fill="#2A1424" />

      {/* Smooth Clean-Shaven Face Canvas (Zero Facial Hair!) */}
      <rect x="6" y="8" width="12" height="7" fill="#FFE0D0" />
      <rect x="5" y="9" width="1" height="5" fill="#FFE0D0" />
      <rect x="18" y="9" width="1" height="5" fill="#FFE0D0" />
      <rect x="6" y="15" width="12" height="1" fill="#382033" />

      {/* Big Expressive Eyes with Catchlights */}
      {pose === 'blushing' ? (
        <>
          <rect x="7" y="11" width="3" height="1" fill="#2A1424" />
          <rect x="14" y="11" width="3" height="1" fill="#2A1424" />
        </>
      ) : (
        <>
          <rect x={7 + eyeOffsetX} y="10" width="2" height="3" fill="#2A1424" />
          <rect x={14 + eyeOffsetX} y="10" width="2" height="3" fill="#2A1424" />
          <rect x={7 + eyeOffsetX} y="10" width="1" height="1" fill="#FFFFFF" />
          <rect x={14 + eyeOffsetX} y="10" width="1" height="1" fill="#FFFFFF" />
          <rect x={8 + eyeOffsetX} y="12" width="1" height="1" fill="#7F1D1D" />
          <rect x={15 + eyeOffsetX} y="12" width="1" height="1" fill="#7F1D1D" />
        </>
      )}

      {/* Soft Rosy Cheeks */}
      <rect x="6" y="13" width={isBlushing ? 3 : 2} height="1" fill="#FF8AB5" />
      <rect x={isBlushing ? 15 : 16} y="13" width={isBlushing ? 3 : 2} height="1" fill="#FF8AB5" />

      {/* Clean-Shaven Smile */}
      <rect x="11" y="14" width="2" height="1" fill="#C92778" />

      {/* Coordinated Casual Striped-Sleeve / Pink Accent Sweater */}
      <rect x="6" y="16" width="12" height="7" fill="#18121B" />
      <rect x="7" y="17" width="10" height="5" fill="#EC4899" />
      <rect x="11" y="17" width="2" height="2" fill="#FFF5E8" />
      <rect x="10" y="19" width="4" height="1" fill="#FFE66D" />

      {/* Arms */}
      <rect x="4" y="17" width="2" height="5" fill="#18121B" />
      <rect x="4" y="18" width="2" height="1" fill="#FFF5E8" />
      <rect x="4" y="20" width="2" height="1" fill="#FFF5E8" />
      <rect x="4" y="21" width="2" height="1" fill="#FFE0D0" />

      {isWaving ? (
        <>
          <rect x="18" y="13" width="4" height="4" fill="#18121B" />
          <rect x="18" y="14" width="3" height="3" fill="#EC4899" />
          <rect x="19" y="12" width="2" height="2" fill="#FFE0D0" />
        </>
      ) : (
        <>
          <rect x="18" y="17" width="2" height="5" fill="#18121B" />
          <rect x="18" y="18" width="2" height="1" fill="#FFF5E8" />
          <rect x="18" y="20" width="2" height="1" fill="#FFF5E8" />
          <rect x="18" y="21" width="2" height="1" fill="#FFE0D0" />
        </>
      )}

      {/* Dark Plum Pants & Cream Sneakers */}
      <rect x="7" y="23" width="4" height="2" fill="#382033" />
      <rect x="13" y="23" width="4" height="2" fill="#382033" />
      <rect x="7" y="25" width="4" height="2" fill="#18121B" />
      <rect x="13" y="25" width="4" height="2" fill="#18121B" />
      <rect x="7" y="26" width="4" height="1" fill="#FFFFFF" />
      <rect x="13" y="26" width="4" height="1" fill="#FFFFFF" />

      {(pose === 'sending-hearts' || pose === 'blushing') && (
        <path d="M2 1h1v1h1V1h1v2H4v1H3V3H2V1z" fill="#EC4899" />
      )}
    </svg>
  );
};

export const CouplePixelArt: React.FC<{
  pose?: DuoPose;
  size?: number;
  className?: string;
}> = ({ pose = 'standing', size = 160, className = '' }) => {
  const isHugging = pose === 'hugging';
  const isHoldingHands = pose === 'holding-hands' || pose === 'hugging';
  const isSitting = pose === 'sitting';

  return (
    <div
      className={`relative inline-flex items-end justify-center select-none ${className}`}
      style={{ minWidth: size }}
    >
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 animate-heartbeat">
        <PixelHeart size={Math.max(18, Math.round(size * 0.16))} color="#EC4899" />
      </div>

      <div
        className={`flex items-end ${
          isHugging ? '-space-x-3' : isHoldingHands ? '-space-x-1' : 'gap-2.5'
        } ${isSitting ? 'translate-y-1.5 scale-y-95' : ''}`}
      >
        <KainoSprite
          pose={isHugging ? 'blushing' : isHoldingHands ? 'looking' : 'smiling'}
          size={Math.round(size * 0.48)}
        />
        <DelonielSprite
          pose={isHugging ? 'blushing' : isHoldingHands ? 'looking' : 'smiling'}
          size={Math.round(size * 0.48)}
        />
      </div>

      {isHoldingHands && (
        <div
          aria-hidden="true"
          className="absolute bottom-5 left-1/2 -translate-x-1/2 w-3 h-2 bg-[#FFE0D0] border border-[#382033]"
        />
      )}
    </div>
  );
};

/** Pixel Cloud cluster for lively skies */
export const PixelCloud: React.FC<{
  size?: number;
  className?: string;
}> = ({ size = 64, className = '' }) => (
  <svg
    width={size}
    height={Math.round(size * 0.45)}
    viewBox="0 0 22 10"
    shapeRendering="crispEdges"
    className={`pixelated ${className}`}
    aria-hidden="true"
  >
    {/* Soft pale-yellow sunlit cloud underside */}
    <rect x="2" y="6" width="18" height="3" fill="#FEF08A" />
    <rect x="1" y="5" width="20" height="3" fill="#FEF9C3" />
    {/* Crisp sunlit cloud top */}
    <rect x="3" y="3" width="16" height="4" fill="#FFFFFF" />
    <rect x="5" y="1" width="6" height="3" fill="#FFFFFF" />
    <rect x="11" y="2" width="5" height="3" fill="#FFFFFF" />
    <rect x="1" y="4" width="3" height="2" fill="#FFFFFF" />
    <rect x="18" y="4" width="3" height="2" fill="#FFFFFF" />
  </svg>
);

/** Scenic Pixel-Art Sunset Boardwalk Cityscape Park (Bright Yellow, Pink & Lavender Palette) */
export const DreamyMeadowScene: React.FC<{
  children: React.ReactNode;
  bubbleText?: string;
  heightClass?: string;
  showCompanions?: boolean;
}> = ({
  children,
  bubbleText,
  heightClass = 'h-48',
  showCompanions = true,
}) => {
  const uid = React.useId().replace(/:/g, '');
  const skyGradId = `boardwalkSky-${uid}`;
  const waterGradId = `waterReflect-${uid}`;
  const plankGradId = `plankSunGlow-${uid}`;

  return (
    <div
      className={`relative w-full ${heightClass} border-2 border-[#6B2D5C] bg-gradient-to-b from-[#DDD6FE] via-[#FBCFE8] to-[#FEF08A] overflow-hidden flex flex-col justify-between`}
    >
      {/* Crisp Pixel-Art Boardwalk & Cityscape Backdrop */}
      <svg
        viewBox="0 0 320 180"
        preserveAspectRatio="xMidYMax slice"
        shapeRendering="crispEdges"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 w-full h-full pixelated"
      >
        <defs>
          <linearGradient id={skyGradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C7B6F3" />
            <stop offset="32%" stopColor="#F9A8D4" />
            <stop offset="68%" stopColor="#FEF08A" />
            <stop offset="100%" stopColor="#FEF9C3" />
          </linearGradient>
          <linearGradient id={waterGradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FBCFE8" />
            <stop offset="40%" stopColor="#A5B4FC" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
          <linearGradient id={plankGradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="45%" stopColor="#F5C6A5" />
            <stop offset="100%" stopColor="#DDA288" />
          </linearGradient>
        </defs>

        {/* 1. Luminous Sky + Radiant Horizon Sun */}
        <rect x="0" y="0" width="320" height="114" fill={`url(#${skyGradId})`} />
      {/* Sun outer halo */}
      <circle cx="174" cy="84" r="26" fill="#FEF9C3" opacity="0.55" />
      <circle cx="174" cy="84" r="18" fill="#FEF08A" opacity="0.85" />
      <circle cx="174" cy="84" r="12" fill="#FFFBEB" />

      {/* Distant Sunset Horizon Haze Clouds */}
      <rect x="0" y="20" width="84" height="8" fill="#FBCFE8" opacity="0.6" />
      <rect x="18" y="14" width="52" height="8" fill="#FFF1F7" opacity="0.65" />
      <rect x="195" y="18" width="96" height="9" fill="#FBCFE8" opacity="0.65" />
      <rect x="212" y="12" width="58" height="8" fill="#FFF1F7" opacity="0.7" />
      <rect x="92" y="54" width="60" height="5" fill="#FEF9C3" opacity="0.55" />

      {/* 2. Distant Pixel City Skyline Silhouettes (Left & Horizon) */}
      <g fill="#8B6B9E" opacity="0.88">
        <rect x="0" y="42" width="16" height="66" />
        <rect x="16" y="58" width="14" height="50" fill="#9D7EB0" />
        <rect x="30" y="34" width="18" height="74" />
        <rect x="36" y="26" width="6" height="8" />
        <rect x="48" y="64" width="12" height="44" fill="#9D7EB0" />
        <rect x="60" y="48" width="16" height="60" />
        <rect x="76" y="70" width="14" height="38" fill="#A98BB8" />
        <rect x="90" y="56" width="12" height="52" />
        <rect x="102" y="76" width="16" height="32" fill="#B699C4" />
        {/* Far central spire silhouette */}
        <rect x="128" y="72" width="10" height="36" fill="#B699C4" />
        <rect x="131" y="56" width="4" height="16" fill="#B699C4" />
        <rect x="132" y="48" width="2" height="8" fill="#B699C4" />
        <rect x="138" y="84" width="18" height="24" fill="#C4ABD2" />
        <rect x="194" y="82" width="18" height="26" fill="#B699C4" />
        <rect x="214" y="74" width="16" height="34" fill="#9D7EB0" />
      </g>
      {/* Subtle city pixel lights */}
      <g fill="#FEF08A" opacity="0.75">
        <rect x="34" y="42" width="2" height="3" />
        <rect x="40" y="48" width="2" height="3" />
        <rect x="64" y="56" width="2" height="3" />
        <rect x="68" y="66" width="2" height="3" />
        <rect x="94" y="64" width="2" height="3" />
      </g>

      {/* 3. Waterfront Lagoon & Sun Reflections (Right Side) */}
      <rect x="170" y="104" width="150" height="76" fill={`url(#${waterGradId})`} />
      {/* Shimmering horizontal reflection bands */}
      <rect x="182" y="109" width="76" height="3" fill="#FEF08A" opacity="0.85" />
      <rect x="196" y="116" width="54" height="3" fill="#FEF9C3" opacity="0.75" />
      <rect x="210" y="124" width="48" height="2" fill="#FBCFE8" opacity="0.8" />
      <rect x="224" y="133" width="58" height="3" fill="#FEF08A" opacity="0.65" />
      <rect x="236" y="143" width="44" height="2" fill="#F9A8D4" opacity="0.7" />
      <rect x="246" y="155" width="52" height="3" fill="#FEF08A" opacity="0.55" />

      {/* 4. Distant Left Cherry Blossom Tree */}
      <rect x="112" y="88" width="4" height="20" fill="#5B2C52" />
      <rect x="98" y="74" width="32" height="16" fill="#EC4899" />
      <rect x="102" y="68" width="24" height="12" fill="#F472B6" />
      <rect x="106" y="65" width="16" height="8" fill="#FBCFE8" />

      {/* 5. Waterfront Balustrade / Promenade Railing */}
      <rect x="0" y="101" width="320" height="3" fill="#5B2C52" />
      <rect x="0" y="101" width="320" height="1" fill="#FBCFE8" />
      <rect x="0" y="109" width="320" height="4" fill="#481D3F" />
      {/* Railing vertical pixel posts */}
      {[12, 34, 56, 78, 100, 122, 144, 166, 188, 210, 232, 254, 276, 298].map((px) => (
        <rect key={px} x={px} y="103" width="3" height="7" fill="#6B2D5C" />
      ))}
      {/* Small stone pier lamp post / pillar on right */}
      <rect x="232" y="92" width="12" height="20" fill="#6B2D5C" />
      <rect x="234" y="88" width="8" height="4" fill="#A78BFA" />
      <rect x="236" y="85" width="4" height="3" fill="#FEF08A" />

      {/* 6. Perspective Wooden Boardwalk Deck */}
      <polygon points="0,113 218,113 266,180 0,180" fill={`url(#${plankGradId})`} />
      {/* Sunlit yellow reflection stripe down center of boardwalk */}
      <polygon points="146,113 196,113 212,180 120,180" fill="#FEF08A" opacity="0.52" />
      {/* Boardwalk outer wooden curb bordering water */}
      <polygon points="218,113 224,113 274,180 264,180" fill="#6B2D5C" />

      {/* Perspective radial plank seams */}
      <g stroke="#6B2D5C" strokeWidth="1.2" opacity="0.72">
        <line x1="88" y1="113" x2="10" y2="180" />
        <line x1="112" y1="113" x2="54" y2="180" />
        <line x1="136" y1="113" x2="98" y2="180" />
        <line x1="158" y1="113" x2="144" y2="180" />
        <line x1="178" y1="113" x2="186" y2="180" />
        <line x1="198" y1="113" x2="226" y2="180" />
      </g>
      {/* Cross plank seams (closer near horizon, wider in foreground) */}
      <g stroke="#6B2D5C" strokeWidth="1" opacity="0.48">
        <line x1="0" y1="120" x2="223" y2="120" />
        <line x1="0" y1="130" x2="230" y2="130" />
        <line x1="0" y1="143" x2="240" y2="143" />
        <line x1="0" y1="159" x2="251" y2="159" />
      </g>

      {/* 7. Pixel Wooden Park Bench (Left Foreground) */}
      {/* Iron bench frame & legs */}
      <rect x="26" y="136" width="4" height="20" fill="#481D3F" />
      <rect x="78" y="128" width="4" height="16" fill="#481D3F" />
      <rect x="38" y="148" width="3" height="10" fill="#481D3F" />
      <rect x="66" y="140" width="3" height="10" fill="#481D3F" />
      {/* Angled backrest slats */}
      <polygon points="24,122 82,113 82,118 24,128" fill="#DB2777" stroke="#481D3F" strokeWidth="1" />
      <polygon points="24,129 82,120 82,125 24,135" fill="#F472B6" stroke="#481D3F" strokeWidth="1" />
      {/* Bench seat slats */}
      <polygon points="24,138 82,128 92,132 34,144" fill="#FBCFE8" stroke="#481D3F" strokeWidth="1" />
      <polygon points="34,144 92,132 92,137 34,149" fill="#C04A8C" stroke="#481D3F" strokeWidth="1" />

      {/* 8. Overhanging Foreground Pink Cherry Blossom Tree (Right) */}
      <rect x="292" y="64" width="12" height="58" fill="#481D3F" />
      <rect x="294" y="66" width="4" height="54" fill="#6B2D5C" />
      <rect x="278" y="68" width="16" height="5" fill="#481D3F" />
      {/* Layered Blossom Canopy */}
      <rect x="228" y="10" width="92" height="44" fill="#EC4899" />
      <rect x="240" y="2" width="80" height="36" fill="#F472B6" />
      <rect x="218" y="22" width="70" height="30" fill="#F472B6" />
      <rect x="246" y="12" width="66" height="24" fill="#F9A8D4" />
      <rect x="262" y="16" width="48" height="16" fill="#FBCFE8" />
      <rect x="224" y="26" width="22" height="12" fill="#FBCFE8" />
      {/* Floating Blossom Petals */}
      <rect x="212" y="54" width="3" height="2" fill="#FBCFE8" />
      <rect x="244" y="66" width="3" height="2" fill="#F9A8D4" />
      <rect x="272" y="80" width="3" height="2" fill="#FEF08A" />
      <rect x="192" y="42" width="2" height="2" fill="#FFF1F7" />
    </svg>

    {/* Layered Drifting Pixel Clouds Across Sunset Sky */}
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-20 z-10">
      <div className="absolute left-3 top-2 animate-cloud-drift opacity-90">
        <PixelCloud size={58} />
      </div>
      <div className="absolute left-1/3 top-4 animate-cloud-drift-reverse opacity-85">
        <PixelCloud size={44} />
      </div>
    </div>

    {/* Fluttering Pixel Sparkles / Petals */}
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10">
      <svg
        width="12"
        height="10"
        viewBox="0 0 7 6"
        shapeRendering="crispEdges"
        className="pixelated absolute left-10 bottom-16 animate-butterfly opacity-90"
      >
        <rect x="0" y="1" width="2" height="3" fill="#FEF08A" />
        <rect x="5" y="1" width="2" height="3" fill="#FEF08A" />
        <rect x="3" y="1" width="1" height="4" fill="#6B2D5C" />
      </svg>
      <svg
        width="12"
        height="10"
        viewBox="0 0 7 6"
        shapeRendering="crispEdges"
        className="pixelated absolute right-14 bottom-20 animate-butterfly opacity-90"
        style={{ animationDelay: '1.6s' }}
      >
        <rect x="0" y="1" width="2" height="3" fill="#FBCFE8" />
        <rect x="5" y="1" width="2" height="3" fill="#FBCFE8" />
        <rect x="3" y="1" width="1" height="4" fill="#6B2D5C" />
      </svg>
    </div>

    {/* Speech Bubble */}
    <div className="relative z-20 flex justify-center pt-2 px-2">
      {bubbleText && <PixelSpeechBubble text={bubbleText} />}
    </div>

    {/* Cute Companions Tucked Near Boardwalk Water Edge */}
    {showCompanions && (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-2 bottom-2 z-20 flex items-end gap-0.5 animate-float-slow"
      >
        <PixelCompanionPuff variant="lavender" size={22} />
        <PixelCompanionPuff variant="pink" size={18} />
      </div>
    )}

      {/* Main Scene Characters / Objects Standing on the Wooden Boardwalk */}
      <div className="relative z-20 flex items-end justify-center pb-2.5">
        {children}
      </div>
    </div>
  );
};
