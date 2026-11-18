class RetroAudioEngine {
  private ctx: AudioContext | null = null;
  private sfxEnabled = true;
  private musicEnabled = true;
  private bgmTimer: number | null = null;
  private bgmStep = 0;
  private isPlayingBgm = false;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {
        // Ignore autoplay restriction before user gesture
      });
    }
    return this.ctx;
  }

  public configure(sfxEnabled: boolean, musicEnabled: boolean): void {
    this.sfxEnabled = sfxEnabled;
    this.musicEnabled = musicEnabled;
    if (!musicEnabled) {
      this.stopMusic();
    }
  }

  private playTone(
    freq: number,
    durationSec: number,
    type: OscillatorType = 'square',
    volume = 0.08,
    slideToFreq?: number,
    delaySec = 0
  ): void {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime + delaySec;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (slideToFreq) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(40, slideToFreq), now + durationSec);
    }

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + durationSec + 0.02);
  }

  private playNoise(durationSec: number, volume = 0.05, delaySec = 0): void {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const bufferSize = Math.max(1, Math.floor(ctx.sampleRate * durationSec));
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1800;

    const gain = ctx.createGain();
    const now = ctx.currentTime + delaySec;
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + durationSec + 0.02);
  }

  public playMenuNav(): void {
    this.playTone(520, 0.055, 'square', 0.05, 640);
  }

  public playButtonClick(): void {
    this.playTone(660, 0.06, 'square', 0.06);
    this.playTone(880, 0.08, 'square', 0.06, undefined, 0.045);
  }

  public playJump(): void {
    this.playTone(220, 0.14, 'square', 0.07, 560);
  }

  public playWebShoot(): void {
    this.playNoise(0.09, 0.06);
    this.playTone(980, 0.1, 'triangle', 0.08, 340);
  }

  public playWebSwing(): void {
    this.playTone(280, 0.16, 'triangle', 0.04, 420);
  }

  public playTokenCollect(combo = 1): void {
    const pitchBoost = Math.min(6, Math.max(0, combo - 1)) * 45;
    this.playTone(784 + pitchBoost, 0.065, 'square', 0.07);
    this.playTone(1046 + pitchBoost, 0.12, 'square', 0.075, undefined, 0.055);
  }

  public playLand(): void {
    this.playTone(130, 0.06, 'triangle', 0.05, 70);
  }

  public playGameOver(): void {
    this.stopMusic();
    this.playTone(440, 0.15, 'sawtooth', 0.07, 392, 0);
    this.playTone(370, 0.15, 'sawtooth', 0.07, 311, 0.14);
    this.playTone(293, 0.18, 'sawtooth', 0.07, 220, 0.28);
    this.playTone(196, 0.36, 'square', 0.075, 130, 0.45);
  }

  public playVictory(): void {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, idx) => {
      this.playTone(n, 0.12, 'square', 0.07, undefined, idx * 0.09);
    });
  }

  public startMusic(): void {
    if (!this.musicEnabled || this.isPlayingBgm) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    this.isPlayingBgm = true;
    const stepMs = 150;

    // Original upbeat 8-bit heroic spider-swing loop (32 steps)
    const melody: (number | null)[] = [
      330, null, 392, 440, null, 494, 440, 392,
      330, null, 392, 523, null, 494, 440, 392,
      294, null, 349, 440, null, 392, 349, 330,
      262, 294, 330, 392, 440, null, 392, null,
    ];
    const bass: (number | null)[] = [
      110, null, 110, null, 131, null, 147, null,
      110, null, 110, null, 165, null, 147, null,
      98, null, 98, null, 110, null, 131, null,
      87, null, 98, null, 110, null, 131, null,
    ];

    this.bgmTimer = window.setInterval(() => {
      if (!this.musicEnabled || !this.isPlayingBgm || !this.ctx) return;
      if (this.ctx.state === 'suspended') return;

      const idx = this.bgmStep % melody.length;
      const melFreq = melody[idx];
      const bassFreq = bass[idx];

      if (melFreq) {
        this.scheduleBgmNote(melFreq, 0.11, 'square', 0.028);
      }
      if (bassFreq) {
        this.scheduleBgmNote(bassFreq, 0.13, 'triangle', 0.04);
      }
      this.bgmStep++;
    }, stepMs);
  }

  private scheduleBgmNote(
    freq: number,
    durationSec: number,
    type: OscillatorType,
    volume: number
  ): void {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + durationSec + 0.015);
  }

  public stopMusic(): void {
    this.isPlayingBgm = false;
    if (this.bgmTimer !== null) {
      window.clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

export const retroAudio = new RetroAudioEngine();
