import Phaser from 'phaser';
import {
  DifficultyMode,
  GameOverSummary,
  GameScreenState,
  HudSnapshot,
} from '../../types/game';
import { getBestScore, recordHighScore } from '../../utils/storage';
import { retroAudio } from '../audio/retroAudio';
import { inputBridge } from '../inputBridge';
import {
  registerChibiSpidermanSpriteSheet,
  SPIDEY_SHEET_KEY,
} from '../sprites/chibiSpidermanSheet';
import { registerPixelWorldTextures } from '../sprites/pixelWorldTextures';

export const GAME_WIDTH = 480;
export const GAME_HEIGHT = 270;

export interface SpidermanSceneCallbacks {
  onHudUpdate: (hud: HudSnapshot) => void;
  onStateChange: (state: GameScreenState) => void;
  onGameOver: (summary: GameOverSummary) => void;
}

interface RooftopBlock {
  sprite: Phaser.GameObjects.TileSprite;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface WebAnchor {
  sprite: Phaser.GameObjects.Image;
  x: number;
  y: number;
  isTemporary?: boolean;
}

interface TokenEntity {
  sprite: Phaser.GameObjects.Sprite;
  baseY: number;
  phase: number;
  collected: boolean;
}

interface HazardEntity {
  sprite: Phaser.GameObjects.Image;
  kind: 'spikes' | 'drone';
  baseY: number;
  phase: number;
  hitWidth: number;
  hitHeight: number;
}

export class SpidermanScene extends Phaser.Scene {
  private callbacks: SpidermanSceneCallbacks;

  private farSkyline!: Phaser.GameObjects.TileSprite;
  private midSkyline!: Phaser.GameObjects.TileSprite;
  private clouds: { sprite: Phaser.GameObjects.Image; speed: number }[] = [];

  private player!: Phaser.GameObjects.Sprite;
  private webGraphics!: Phaser.GameObjects.Graphics;
  private anchorRing!: Phaser.GameObjects.Graphics;
  private readyBanner!: Phaser.GameObjects.Text;

  private rooftops: RooftopBlock[] = [];
  private anchors: WebAnchor[] = [];
  private tokens: TokenEntity[] = [];
  private hazards: HazardEntity[] = [];
  private particles: {
    sprite: Phaser.GameObjects.Image;
    vx: number;
    vy: number;
    life: number;
  }[] = [];

  // Gameplay physics state
  private activeMode: GameScreenState = 'MAIN_MENU';
  private difficulty: DifficultyMode = 'CLASSIC';
  private vx = 0;
  private vy = 0;
  private onGround = false;
  private airJumpAvailable = true;
  private landTimer = 0;
  private webShootTimer = 0;
  private introTimer = 0;

  // Pendulum web swinging state
  private isSwinging = false;
  private swingAnchor: { x: number; y: number } | null = null;
  private swingAngle = 0;
  private swingAngularVel = 0;
  private swingLength = 90;

  // Score & progression
  private worldSpeed = 145;
  private distanceMeters = 0;
  private tokenCount = 0;
  private bonusScore = 0;
  private bestScore = 0;
  private comboCount = 0;
  private comboTimer = 0;
  private lastHudEmit = 0;
  private lastMilestone = 0;
  private milestoneBannerTimer = 0;

  // Keyboard inputs
  private keys!: {
    space: Phaser.Input.Keyboard.Key;
    w: Phaser.Input.Keyboard.Key;
    up: Phaser.Input.Keyboard.Key;
    a: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    d: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };
  private prevSpaceDown = false;
  private prevJumpDown = false;

  constructor(callbacks: SpidermanSceneCallbacks) {
    super('SpidermanScene');
    this.callbacks = callbacks;
  }

  public create(): void {
    this.bestScore = getBestScore();

    registerChibiSpidermanSpriteSheet(this);
    registerPixelWorldTextures(this);

    // Bright Retro Blue Pixel Sky
    const sky = this.add.graphics();
    sky.fillGradientStyle(0x0284c7, 0x0284c7, 0x7dd3fc, 0xbae6fd, 1);
    sky.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Pixel Sun Accent
    const sun = this.add.graphics();
    sun.fillStyle(0xfef08a, 0.95);
    sun.fillRect(390, 26, 26, 26);
    sun.fillStyle(0xfde047, 0.4);
    sun.fillRect(386, 22, 34, 34);

    // Floating Pixel Clouds
    for (let i = 0; i < 5; i++) {
      const cloud = this.add.image(60 + i * 95, 34 + (i % 3) * 18, 'pixel-cloud');
      cloud.setScale(1.1);
      cloud.setAlpha(0.92);
      this.clouds.push({ sprite: cloud, speed: 10 + (i % 3) * 5 });
    }

    // Parallax City Layers
    this.farSkyline = this.add
      .tileSprite(0, GAME_HEIGHT - 135, GAME_WIDTH, 140, 'skyline-far')
      .setOrigin(0, 0);
    this.midSkyline = this.add
      .tileSprite(0, GAME_HEIGHT - 122, GAME_WIDTH, 150, 'skyline-mid')
      .setOrigin(0, 0);

    this.webGraphics = this.add.graphics().setDepth(15);
    this.anchorRing = this.add.graphics().setDepth(14);

    // Chibi Spider-Man Sprite (larger crisp kawaii chibi scale)
    this.player = this.add
      .sprite(112, 145, SPIDEY_SHEET_KEY, 0)
      .setScale(1.38)
      .setDepth(20);
    this.player.play('spidey-idle');

    // Ready / Milestone Floating Text
    this.readyBanner = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20, '', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '18px',
        color: '#FACC15',
        stroke: '#0F172A',
        strokeThickness: 5,
      })
      .setOrigin(0.5)
      .setDepth(30)
      .setVisible(false);

    if (this.input.keyboard) {
      this.keys = {
        space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
        w: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
        a: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
        d: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      };
    }

    this.setupShowcaseCity();
  }

  private clearWorldEntities(): void {
    this.rooftops.forEach((r) => r.sprite.destroy());
    this.anchors.forEach((a) => a.sprite.destroy());
    this.tokens.forEach((t) => t.sprite.destroy());
    this.hazards.forEach((h) => h.sprite.destroy());
    this.particles.forEach((p) => p.sprite.destroy());

    this.rooftops = [];
    this.anchors = [];
    this.tokens = [];
    this.hazards = [];
    this.particles = [];
    this.webGraphics.clear();
    this.anchorRing.clear();
  }

  private setupShowcaseCity(): void {
    this.clearWorldEntities();
    this.spawnRooftop(0, 198, 260, 'rooftop-orange', false);
    this.spawnRooftop(320, 184, 210, 'rooftop-red', false);
    this.player.setPosition(110, 198 - 19);
    this.player.setScale(1.38);
    this.player.setAngle(0);
    this.player.play('spidey-idle', true);
  }

  public startNewRun(difficulty: DifficultyMode): void {
    this.difficulty = difficulty;
    this.clearWorldEntities();

    this.bestScore = getBestScore();
    this.worldSpeed = difficulty === 'TURBO' ? 185 : 148;
    this.distanceMeters = 0;
    this.tokenCount = 0;
    this.bonusScore = 0;
    this.comboCount = 0;
    this.comboTimer = 0;
    this.lastMilestone = 0;
    this.milestoneBannerTimer = 0;

    this.vx = 0;
    this.vy = 0;
    this.onGround = true;
    this.airJumpAvailable = true;
    this.isSwinging = false;
    this.swingAnchor = null;
    this.landTimer = 0;
    this.webShootTimer = 0;
    this.prevSpaceDown = false;
    this.prevJumpDown = false;
    inputBridge.resetAll();

    // Long safe starting rooftop + ahead skyline
    this.spawnRooftop(0, 196, 300, 'rooftop-orange', false);
    this.ensureWorldAhead();

    this.player.setPosition(104, 196 - 19);
    this.player.setScale(1.38);
    this.player.setAngle(0);
    this.player.play('spidey-idle', true);

    this.activeMode = 'STARTING';
    this.introTimer = 1.25;
    this.readyBanner.setText('READY?').setVisible(true);
    this.callbacks.onStateChange('STARTING');
    this.emitHud(true);

    retroAudio.playButtonClick();
    retroAudio.startMusic();
  }

  public setPausedState(paused: boolean): void {
    if (paused && this.activeMode === 'PLAYING') {
      this.activeMode = 'PAUSED';
      retroAudio.stopMusic();
    } else if (!paused && this.activeMode === 'PAUSED') {
      this.activeMode = 'PLAYING';
      retroAudio.startMusic();
    }
  }

  public returnToMenu(): void {
    this.activeMode = 'MAIN_MENU';
    this.isSwinging = false;
    this.swingAnchor = null;
    this.readyBanner.setVisible(false);
    retroAudio.stopMusic();
    this.setupShowcaseCity();
  }

  private spawnRooftop(
    x: number,
    y: number,
    width: number,
    textureKey: 'rooftop-orange' | 'rooftop-red' | 'rooftop-brown',
    allowHazards = true
  ): void {
    const height = GAME_HEIGHT - y + 10;
    const sprite = this.add
      .tileSprite(x, y, width, height, textureKey)
      .setOrigin(0, 0)
      .setDepth(10);

    this.rooftops.push({ sprite, x, y, width, height });

    // Optional rooftop spider tokens
    if (width >= 120 && Math.random() < 0.72) {
      const count = Math.min(3, Math.floor(width / 65));
      for (let i = 0; i < count; i++) {
        this.spawnToken(x + 36 + i * 26, y - 24);
      }
    }

    // Optional rooftop spike hazard on wide buildings once run is underway
    if (allowHazards && this.distanceMeters > 45 && width >= 150 && Math.random() < 0.45) {
      const hx = x + width * 0.56;
      const hazardSprite = this.add
        .image(hx, y - 7, 'hazard-spikes')
        .setDepth(12);
      this.hazards.push({
        sprite: hazardSprite,
        kind: 'spikes',
        baseY: y - 7,
        phase: 0,
        hitWidth: 14,
        hitHeight: 11,
      });
    }
  }

  private spawnToken(x: number, y: number): void {
    const sprite = this.add.sprite(x, y, 'spider-token', 0).setDepth(13);
    sprite.play('token-spin');
    this.tokens.push({
      sprite,
      baseY: y,
      phase: Math.random() * Math.PI * 2,
      collected: false,
    });
  }

  private spawnWebAnchor(x: number, y: number): void {
    const sprite = this.add.image(x, y, 'web-anchor').setDepth(12);
    this.anchors.push({ sprite, x, y });
  }

  private ensureWorldAhead(): void {
    let rightEdge = 0;
    let lastY = 196;
    for (const r of this.rooftops) {
      if (r.x + r.width > rightEdge) {
        rightEdge = r.x + r.width;
        lastY = r.y;
      }
    }

    const textures: ('rooftop-orange' | 'rooftop-red' | 'rooftop-brown')[] = [
      'rooftop-orange',
      'rooftop-red',
      'rooftop-brown',
    ];

    while (rightEdge < GAME_WIDTH + 320) {
      const difficultyFactor = Math.min(1, this.distanceMeters / 900);
      const minGap = 62 + Math.round(difficultyFactor * 28);
      const maxGap = 112 + Math.round(difficultyFactor * 36);
      const gap = Phaser.Math.Between(minGap, maxGap);

      const nextX = rightEdge + gap;
      const nextWidth = Phaser.Math.Between(115, 225);
      const deltaY = Phaser.Math.Between(-34, 34);
      const nextY = Phaser.Math.Clamp(lastY + deltaY, 152, 224);
      const tex = textures[Phaser.Math.Between(0, textures.length - 1)];

      // Place overhead web anchor above every gap for joyful swinging
      const anchorX = rightEdge + Math.round(gap * 0.55);
      const anchorY = Phaser.Math.Between(24, 52);
      this.spawnWebAnchor(anchorX, anchorY);

      // Arc of Spider Tokens over the gap!
      if (Math.random() < 0.85) {
        const midGapX = rightEdge + gap * 0.5;
        const arcPeakY = Math.min(lastY, nextY) - Phaser.Math.Between(36, 62);
        this.spawnToken(midGapX - 18, arcPeakY + 10);
        this.spawnToken(midGapX, arcPeakY);
        this.spawnToken(midGapX + 18, arcPeakY + 10);
      }

      // Occasional aerial shock drone over wider gaps / mid-air after 90m
      if (this.distanceMeters > 90 && gap > 85 && Math.random() < 0.35 + difficultyFactor * 0.2) {
        const droneX = nextX + Math.round(nextWidth * 0.35);
        const droneY = nextY - Phaser.Math.Between(48, 74);
        const droneSprite = this.add.image(droneX, droneY, 'hazard-drone').setDepth(13);
        this.hazards.push({
          sprite: droneSprite,
          kind: 'drone',
          baseY: droneY,
          phase: Math.random() * Math.PI * 2,
          hitWidth: 16,
          hitHeight: 11,
        });
      }

      this.spawnRooftop(nextX, nextY, nextWidth, tex, true);
      rightEdge = nextX + nextWidth;
      lastY = nextY;
    }
  }

  private emitParticles(
    x: number,
    y: number,
    color: number,
    count: number,
    speed = 70
  ): void {
    for (let i = 0; i < count; i++) {
      const sprite = this.add
        .image(x, y, 'pixel-particle')
        .setTint(color)
        .setDepth(25);
      const angle = Math.random() * Math.PI * 2;
      const spd = speed * (0.4 + Math.random() * 0.8);
      this.particles.push({
        sprite,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd - 20,
        life: 0.35 + Math.random() * 0.25,
      });
    }
  }

  private tryAttachWeb(): void {
    if (this.isSwinging) return;

    // Find best anchor ahead-above Spider-Man
    let bestAnchor: { x: number; y: number } | null = null;
    let bestScore = Infinity;

    for (const a of this.anchors) {
      const dx = a.x - this.player.x;
      const dy = this.player.y - a.y;
      if (dx >= -20 && dx <= 210 && dy >= 28) {
        const dist = Math.hypot(dx - 55, dy);
        if (dist < bestScore) {
          bestScore = dist;
          bestAnchor = { x: a.x, y: a.y };
        }
      }
    }

    // Fallback temporary skyline web anchor so web shooting always succeeds
    if (!bestAnchor) {
      bestAnchor = {
        x: this.player.x + 88,
        y: Math.max(18, this.player.y - 115),
      };
    }

    this.isSwinging = true;
    this.swingAnchor = bestAnchor;
    this.onGround = false;

    const dx = this.player.x - bestAnchor.x;
    const dy = this.player.y - bestAnchor.y;
    this.swingLength = Phaser.Math.Clamp(Math.hypot(dx, dy), 58, 138);
    this.swingAngle = Math.atan2(dx, dy); // 0 = straight down, negative = left, positive = right
    // Give initial forward pendulum angular velocity from current world speed
    this.swingAngularVel = Math.max(1.85, (this.worldSpeed + this.vx) / this.swingLength * 0.72);
    this.webShootTimer = 0.14;
    this.airJumpAvailable = true;

    this.player.play('spidey-web-shoot', true);
    this.emitParticles(this.player.x + 8, this.player.y - 10, 0xffffff, 6, 65);
    retroAudio.playWebShoot();
  }

  private releaseWeb(): void {
    if (!this.isSwinging) return;
    this.isSwinging = false;

    // Convert angular momentum into upward + forward release boost
    const tangentialSpeed = this.swingAngularVel * this.swingLength;
    const forwardBoost = Math.cos(this.swingAngle) * tangentialSpeed * 0.35;
    const upwardBoost = Math.sin(this.swingAngle) * tangentialSpeed * 0.85;

    this.vx = Phaser.Math.Clamp(this.vx + Math.max(20, forwardBoost), -60, 115);
    this.vy = Phaser.Math.Clamp(-Math.abs(upwardBoost) - 110, -295, -135);

    this.swingAnchor = null;
    this.player.setAngle(0);
    this.player.play('spidey-jump', true);
    this.emitParticles(this.player.x, this.player.y, 0x38bdf8, 5, 55);
    retroAudio.playWebSwing();
  }

  private performJump(): void {
    if (this.isSwinging) {
      this.releaseWeb();
      return;
    }

    if (this.onGround) {
      this.onGround = false;
      this.vy = -268;
      this.airJumpAvailable = true;
      this.player.setScale(1.22, 1.54);
      this.player.play('spidey-jump', true);
      this.emitParticles(this.player.x, this.player.y + 16, 0xf8fafc, 5, 45);
      retroAudio.playJump();
    } else if (this.airJumpAvailable) {
      this.airJumpAvailable = false;
      this.vy = -238;
      this.player.setScale(1.22, 1.54);
      this.player.play('spidey-jump', true);
      this.emitParticles(this.player.x, this.player.y + 12, 0xffffff, 7, 65);
      retroAudio.playWebShoot();
    }
  }

  private triggerGameOver(reason: 'FALL' | 'OBSTACLE'): void {
    if (this.activeMode !== 'PLAYING') return;
    this.activeMode = 'GAME_OVER';
    this.isSwinging = false;
    this.swingAnchor = null;
    this.webGraphics.clear();
    this.anchorRing.clear();
    this.readyBanner.setVisible(false);

    this.cameras.main.shake(220, 0.015);
    this.emitParticles(this.player.x, this.player.y, 0xef4444, 16, 110);

    const finalScore = Math.floor(this.distanceMeters * 2 + this.bonusScore);
    const { isNewBest, bestScore } = recordHighScore({
      score: finalScore,
      distance: Math.floor(this.distanceMeters),
      tokens: this.tokenCount,
      difficulty: this.difficulty,
    });
    this.bestScore = bestScore;

    if (isNewBest) {
      retroAudio.playVictory();
    } else {
      retroAudio.playGameOver();
    }

    this.callbacks.onGameOver({
      finalScore,
      distance: Math.floor(this.distanceMeters),
      tokens: this.tokenCount,
      bestScore,
      isNewBest,
      reason,
    });
  }

  private emitHud(force = false): void {
    const now = this.time.now;
    if (!force && now - this.lastHudEmit < 80) return;
    this.lastHudEmit = now;

    const currentScore = Math.floor(this.distanceMeters * 2 + this.bonusScore);
    const isNewBest = currentScore > this.bestScore && this.bestScore > 0;
    const displayBest = Math.max(this.bestScore, currentScore);

    this.callbacks.onHudUpdate({
      score: currentScore,
      distance: Math.floor(this.distanceMeters),
      tokens: this.tokenCount,
      bestScore: displayBest,
      isNewBest,
      speedLevel: Math.min(9, 1 + Math.floor(this.distanceMeters / 180)),
      isSwinging: this.isSwinging,
      comboCount: this.comboCount,
    });
  }

  public update(time: number, deltaMs: number): void {
    const dt = Math.min(0.05, deltaMs / 1000);

    // Gentle cloud animation on menus too
    if (this.activeMode === 'MAIN_MENU') {
      for (const c of this.clouds) {
        c.sprite.x -= c.speed * dt * 0.4;
        if (c.sprite.x < -40) c.sprite.x = GAME_WIDTH + 40;
      }
      return;
    }

    if (this.activeMode === 'PAUSED' || this.activeMode === 'GAME_OVER') {
      return;
    }

    // Starting Intro Sequence (1.25s)
    if (this.activeMode === 'STARTING') {
      this.introTimer -= dt;
      if (this.introTimer > 0.55) {
        this.readyBanner.setText('READY?');
        this.player.play('spidey-idle', true);
      } else if (this.introTimer > 0.1) {
        this.readyBanner.setText('SWING!');
        this.player.play('spidey-web-shoot', true);
      } else {
        this.readyBanner.setVisible(false);
        this.activeMode = 'PLAYING';
        this.callbacks.onStateChange('PLAYING');
        this.vy = -175;
        this.onGround = false;
        this.player.play('spidey-jump', true);
      }
      return;
    }

    if (this.activeMode !== 'PLAYING') return;

    // 1. Progressive speed scaling
    const baseSpeed = this.difficulty === 'TURBO' ? 185 : 148;
    const speedCap = this.difficulty === 'TURBO' ? 320 : 275;
    this.worldSpeed = Math.min(speedCap, baseSpeed + this.distanceMeters * 0.11);
    const scrollDx = this.worldSpeed * dt;
    this.distanceMeters += (scrollDx / 22);

    // Milestone celebratory banner every 250m
    const milestoneStep = Math.floor(this.distanceMeters / 250);
    if (milestoneStep > this.lastMilestone && milestoneStep > 0) {
      this.lastMilestone = milestoneStep;
      this.milestoneBannerTimer = 1.3;
      this.readyBanner.setText(`${milestoneStep * 250}M!`).setVisible(true);
      retroAudio.playVictory();
    }
    if (this.milestoneBannerTimer > 0) {
      this.milestoneBannerTimer -= dt;
      if (this.milestoneBannerTimer <= 0) {
        this.readyBanner.setVisible(false);
      }
    }

    if (this.comboTimer > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) this.comboCount = 0;
    }

    // 2. Parallax Backgrounds
    this.farSkyline.tilePositionX += scrollDx * 0.16;
    this.midSkyline.tilePositionX += scrollDx * 0.4;
    for (const c of this.clouds) {
      c.sprite.x -= (c.speed + this.worldSpeed * 0.08) * dt;
      if (c.sprite.x < -40) c.sprite.x = GAME_WIDTH + 40;
    }

    // 3. Gather Inputs (Keyboard + GameBoy Virtual Shell)
    const bridgeEdges = inputBridge.consumeFrameEdges();
    const spaceDown = Boolean(this.keys?.space.isDown) || inputBridge.virtual.webHold;
    const jumpDown = Boolean(this.keys?.w.isDown || this.keys?.up.isDown) || inputBridge.virtual.up;
    const moveLeft =
      Boolean(this.keys?.a.isDown || this.keys?.left.isDown) || inputBridge.virtual.left;
    const moveRight =
      Boolean(this.keys?.d.isDown || this.keys?.right.isDown) || inputBridge.virtual.right;

    const webJustPressed = (spaceDown && !this.prevSpaceDown) || bridgeEdges.webJustPressed;
    const webJustReleased = (!spaceDown && this.prevSpaceDown) || bridgeEdges.webJustReleased;
    const jumpJustPressed = (jumpDown && !this.prevJumpDown) || bridgeEdges.jumpJustPressed;

    this.prevSpaceDown = spaceDown;
    this.prevJumpDown = jumpDown;

    if (webJustPressed) {
      this.tryAttachWeb();
    } else if (webJustReleased && this.isSwinging) {
      this.releaseWeb();
    }

    if (jumpJustPressed) {
      this.performJump();
    }

    // 4. Scroll World Entities Left
    for (let i = this.rooftops.length - 1; i >= 0; i--) {
      const r = this.rooftops[i];
      r.x -= scrollDx;
      r.sprite.x = r.x;
      if (r.x + r.width < -60) {
        r.sprite.destroy();
        this.rooftops.splice(i, 1);
      }
    }

    for (let i = this.anchors.length - 1; i >= 0; i--) {
      const a = this.anchors[i];
      a.x -= scrollDx;
      a.sprite.x = a.x;
      if (a.x < -40) {
        a.sprite.destroy();
        this.anchors.splice(i, 1);
      }
    }

    for (let i = this.tokens.length - 1; i >= 0; i--) {
      const t = this.tokens[i];
      t.sprite.x -= scrollDx;
      t.sprite.y = t.baseY + Math.sin(time * 0.006 + t.phase) * 3;
      if (t.sprite.x < -30 || t.collected) {
        t.sprite.destroy();
        this.tokens.splice(i, 1);
      }
    }

    for (let i = this.hazards.length - 1; i >= 0; i--) {
      const h = this.hazards[i];
      h.sprite.x -= scrollDx;
      if (h.kind === 'drone') {
        h.sprite.y = h.baseY + Math.sin(time * 0.005 + h.phase) * 9;
      }
      if (h.sprite.x < -40) {
        h.sprite.destroy();
        this.hazards.splice(i, 1);
      }
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      p.sprite.x += p.vx * dt;
      p.sprite.y += p.vy * dt;
      p.vy += 180 * dt;
      p.sprite.setAlpha(Math.max(0, p.life * 2.2));
      if (p.life <= 0) {
        p.sprite.destroy();
        this.particles.splice(i, 1);
      }
    }

    this.ensureWorldAhead();

    // 5. Update Player Physics (Pendulum Swing vs Platforming)
    const steerAccel = moveLeft ? -230 : moveRight ? 230 : 0;

    if (this.isSwinging && this.swingAnchor) {
      // Anchor moves with skyline so player rides the swing forward smoothly
      this.swingAnchor.x -= scrollDx * 0.65;

      // Pendulum angular dynamics: alpha = -(g / L) * sin(theta) + pump
      const gravityRatio = 4.6;
      const pump = (moveRight ? 3.2 : moveLeft ? -2.2 : 0.85);
      const angularAccel = -gravityRatio * Math.sin(this.swingAngle) + pump;
      this.swingAngularVel += angularAccel * dt;
      this.swingAngularVel *= 0.994;
      this.swingAngle += this.swingAngularVel * dt;

      // Shorten line gently if player was low so they sweep gracefully above buildings
      if (this.swingLength > 84) {
        this.swingLength -= 22 * dt;
      }

      const targetX = this.swingAnchor.x + Math.sin(this.swingAngle) * this.swingLength;
      const targetY = this.swingAnchor.y + Math.cos(this.swingAngle) * this.swingLength;

      this.player.x = Phaser.Math.Clamp(targetX, 46, 290);
      this.player.y = Phaser.Math.Clamp(targetY, 22, GAME_HEIGHT + 20);
      this.player.setAngle(Phaser.Math.RadToDeg(-this.swingAngle) * 0.45);

      if (this.webShootTimer > 0) {
        this.webShootTimer -= dt;
      } else {
        this.player.play('spidey-web-swing', true);
      }

      // Draw crisp white silk web line connected cleanly to top center of Spider-Man
      const rad = Phaser.Math.DegToRad(this.player.angle);
      const attachX = this.player.x + Math.sin(rad) * 17;
      const attachY = this.player.y - Math.cos(rad) * 17;
      this.webGraphics.clear();
      this.webGraphics.lineStyle(2, 0xffffff, 1);
      this.webGraphics.beginPath();
      this.webGraphics.moveTo(attachX, attachY);
      this.webGraphics.lineTo(this.swingAnchor.x, this.swingAnchor.y);
      this.webGraphics.strokePath();

      this.anchorRing.clear();
      this.anchorRing.fillStyle(0x38bdf8, 0.9);
      this.anchorRing.fillCircle(this.swingAnchor.x, this.swingAnchor.y, 4);

      // Auto-release if swung way past anchor top arc
      if (this.swingAngle > 1.18) {
        this.releaseWeb();
      }
    } else {
      this.webGraphics.clear();
      this.anchorRing.clear();
      this.player.setAngle(0);

      // Horizontal position nudging within comfortable viewing band
      if (steerAccel !== 0) {
        this.vx = Phaser.Math.Clamp(this.vx + steerAccel * dt, -110, 125);
      } else {
        // Gently recenter toward ideal viewing position x = 112
        const homePull = (112 - this.player.x) * 1.4;
        this.vx = Phaser.Math.Linear(this.vx, homePull, 3.5 * dt);
      }

      // Smoothly settle squash-and-stretch back toward crisp 1.38 scale
      this.player.scaleX = Phaser.Math.Linear(this.player.scaleX, 1.38, 12 * dt);
      this.player.scaleY = Phaser.Math.Linear(this.player.scaleY, 1.38, 12 * dt);

      const prevBottom = this.player.y + 19;
      this.player.x = Phaser.Math.Clamp(this.player.x + this.vx * dt, 44, 275);
      this.vy = Math.min(430, this.vy + 690 * dt);
      this.player.y += this.vy * dt;
      const newBottom = this.player.y + 19;

      // Check landing on rooftops
      let landed = false;
      if (this.vy >= 0) {
        for (const r of this.rooftops) {
          const withinX = this.player.x + 9 > r.x && this.player.x - 9 < r.x + r.width;
          if (withinX && prevBottom <= r.y + 9 && newBottom >= r.y) {
            if (!this.onGround && this.vy > 90) {
              this.landTimer = 0.12;
              this.player.setScale(1.56, 1.18);
              this.emitParticles(this.player.x, r.y, 0xfdba74, 4, 40);
              retroAudio.playLand();
            }
            this.player.y = r.y - 19;
            this.vy = 0;
            this.onGround = true;
            this.airJumpAvailable = true;
            landed = true;
            break;
          }
        }
      }

      if (!landed) {
        this.onGround = false;
      }

      // Animation State Selection
      if (this.landTimer > 0) {
        this.landTimer -= dt;
        this.player.play('spidey-land', true);
      } else if (this.onGround) {
        this.player.play('spidey-run', true);
      } else if (this.vy < 35) {
        this.player.play('spidey-jump', true);
      } else {
        this.player.play('spidey-fall', true);
      }
    }

    // 6. Highlight nearest reachable web anchor subtly
    if (!this.isSwinging) {
      this.anchorRing.clear();
      for (const a of this.anchors) {
        const dx = a.x - this.player.x;
        if (dx >= -15 && dx <= 200) {
          this.anchorRing.lineStyle(1, 0xfacc15, 0.85);
          this.anchorRing.strokeRect(a.sprite.x - 9, a.sprite.y - 9, 18, 18);
          break;
        }
      }
    }

    // 7. Collect Spider Tokens
    for (const t of this.tokens) {
      if (t.collected) continue;
      const dist = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        t.sprite.x,
        t.sprite.y
      );
      if (dist <= 22) {
        t.collected = true;
        this.tokenCount += 1;
        this.comboCount += 1;
        this.comboTimer = 2.4;
        this.bonusScore += 50 + Math.min(50, (this.comboCount - 1) * 10);
        this.emitParticles(t.sprite.x, t.sprite.y, 0xfacc15, 8, 75);
        retroAudio.playTokenCollect(this.comboCount);
      }
    }

    // 8. Check Hazard Collisions
    const px = this.player.x;
    const py = this.player.y + 2;
    for (const h of this.hazards) {
      if (
        Math.abs(px - h.sprite.x) < h.hitWidth &&
        Math.abs(py - h.sprite.y) < h.hitHeight + 6
      ) {
        this.triggerGameOver('OBSTACLE');
        return;
      }
    }

    // 9. Check Fall Below City Street
    if (this.player.y > GAME_HEIGHT + 24) {
      this.triggerGameOver('FALL');
      return;
    }

    this.emitHud();
  }
}
