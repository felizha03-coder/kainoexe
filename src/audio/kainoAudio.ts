import { KainoSettings } from '../types/kaino';

class KainoAudioEngine {
  private ctx: AudioContext | null = null;
  private settings: KainoSettings = {
    soundEnabled: true,
    bgmVolume: 0.45,
    sfxVolume: 0.65,
    animationsEnabled: true,
  };
  private bgmTimer: number | null = null;
  private bgmStep = 0;
  private bgmRunning = false;
  private hasUserInteracted = false;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined' || !this.hasUserInteracted) return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {
        // Ignore browser resume error
      });
    }
    return this.ctx;
  }

  public unlockFromUserGesture(): void {
    this.hasUserInteracted = true;
    this.ensureContext();
    if (this.settings.soundEnabled && this.settings.bgmVolume > 0 && !this.bgmRunning) {
      this.startMusic();
    }
  }

  public configure(next: KainoSettings): void {
    this.settings = next;
    if (!next.soundEnabled || next.bgmVolume <= 0) {
      this.stopMusic();
    } else if (this.hasUserInteracted && !this.bgmRunning) {
      this.startMusic();
    }
  }

  private playSfxTone(
    freq: number,
    durationSec: number,
    type: OscillatorType = 'triangle',
    baseVol = 0.1,
    slideTo?: number,
    delaySec = 0
  ): void {
    if (!this.settings.soundEnabled || this.settings.sfxVolume <= 0) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime + delaySec;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const volume = Math.max(0.005, baseVol * this.settings.sfxVolume);

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (slideTo) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(40, slideTo), now + durationSec);
    }

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + durationSec + 0.02);
  }

  public playClick(): void {
    this.playSfxTone(680, 0.06, 'square', 0.08, 860);
  }

  public playBootBeep(): void {
    this.playSfxTone(520, 0.045, 'square', 0.06);
  }

  public playBootComplete(): void {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, idx) => {
      this.playSfxTone(f, 0.14, 'triangle', 0.11, undefined, idx * 0.08);
    });
  }

  public playCardFlip(): void {
    this.playSfxTone(420, 0.08, 'triangle', 0.1, 740);
  }

  public playEnvelopeOpen(): void {
    this.playSfxTone(587.33, 0.1, 'triangle', 0.09);
    this.playSfxTone(880, 0.16, 'triangle', 0.1, undefined, 0.07);
  }

  public playHeartCollect(): void {
    this.playSfxTone(784, 0.07, 'sine', 0.12);
    this.playSfxTone(1174.66, 0.15, 'triangle', 0.11, undefined, 0.05);
  }

  public playHurt(): void {
    this.playSfxTone(220, 0.16, 'sawtooth', 0.08, 120);
  }

  public playVictory(): void {
    const notes = [523.25, 659.25, 783.99, 659.25, 1046.5];
    notes.forEach((n, idx) => {
      this.playSfxTone(n, 0.15, 'square', 0.075, undefined, idx * 0.095);
    });
  }

  public playSecretUnlock(): void {
    const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.5];
    notes.forEach((n, idx) => {
      this.playSfxTone(n, 0.2, 'triangle', 0.12, undefined, idx * 0.085);
    });
  }

  public startMusic(): void {
    if (
      !this.hasUserInteracted ||
      !this.settings.soundEnabled ||
      this.settings.bgmVolume <= 0 ||
      this.bgmRunning
    ) {
      return;
    }
    const ctx = this.ensureContext();
    if (!ctx) return;

    this.bgmRunning = true;
    const stepMs = 260;

    // Gentle sweet romantic 8-bit chiptune loop (C Major / F Major dreamy progression)
    const melody: (number | null)[] = [
      523.25, 659.25, 783.99, 659.25, 880, null, 783.99, null,
      698.46, 659.25, 587.33, 523.25, 587.33, null, 659.25, null,
      523.25, 659.25, 783.99, 1046.5, 987.77, null, 880, null,
      783.99, 659.25, 587.33, 659.25, 523.25, null, null, null,
    ];
    const bass: (number | null)[] = [
      130.81, null, 196.0, null, 220.0, null, 196.0, null,
      174.61, null, 164.81, null, 146.83, null, 196.0, null,
      130.81, null, 196.0, null, 220.0, null, 246.94, null,
      196.0, null, 146.83, null, 130.81, null, 196.0, null,
    ];

    this.bgmTimer = window.setInterval(() => {
      if (
        !this.bgmRunning ||
        !this.settings.soundEnabled ||
        this.settings.bgmVolume <= 0 ||
        !this.ctx
      ) {
        return;
      }
      if (this.ctx.state === 'suspended') return;

      const idx = this.bgmStep % melody.length;
      const mel = melody[idx];
      const bas = bass[idx];

      if (mel) {
        this.scheduleBgmTone(mel, 0.2, 'triangle', 0.05 * this.settings.bgmVolume);
      }
      if (bas) {
        this.scheduleBgmTone(bas, 0.24, 'sine', 0.065 * this.settings.bgmVolume);
      }
      this.bgmStep++;
    }, stepMs);
  }

  private scheduleBgmTone(
    freq: number,
    durationSec: number,
    type: OscillatorType,
    volume: number
  ): void {
    if (!this.ctx || volume <= 0.001) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + durationSec + 0.02);
  }

  public stopMusic(): void {
    this.bgmRunning = false;
    if (this.bgmTimer !== null) {
      window.clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

export const kainoAudio = new KainoAudioEngine();
