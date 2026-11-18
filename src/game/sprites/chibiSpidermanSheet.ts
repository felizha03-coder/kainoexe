import Phaser from 'phaser';

export const SPIDEY_SHEET_KEY = 'chibi-spidey';

// Crisp pure palette matching the user's pixel-art Spider-Man reference
const PALETTE: Record<string, string> = {
  '.': 'transparent',
  K: '#000000', // Bold crisp black outline & eye frames
  R: '#EE1C25', // Vivid pure Spider-Man Red
  B: '#1D63DC', // Vivid royal Spider-Man Blue
  W: '#FFFFFF', // Pure crisp white eyes & web
};

type PixelRow = string; // 24 chars wide inside 32x32 frame (xOffset = 4, yOffset = 1)

// Clean 16x14 giant-eyed chibi head with bold black outlines and zero face clutter
function buildCleanChibiHead(
  variant: 'normal' | 'blink' | 'happy' | 'wide' | 'upsideDown'
): PixelRow[] {
  if (variant === 'blink') {
    return [
      '........KKKKKKKK........',
      '......KKRRRRRRRRKK......',
      '.....KRRRRRRRRRRRRK.....',
      '....KRRRRRRRRRRRRRRK....',
      '....KRRRRRRRRRRRRRRK....',
      '...KRRRRRRRRRRRRRRRRK...',
      '...KRKKKKKRRRRKKKKKRK...',
      '...KRKWWWKRRRRKWWWKRK...',
      '...KRRKKKKRRRRKKKKRRK...',
      '....KRRRRRRRRRRRRRRK....',
      '....KRRRRRRRRRRRRRRK....',
      '.....KRRRRRRRRRRRRK.....',
      '......KKRRRRRRRRKK......',
      '........KKKKKKKK........',
    ];
  }
  if (variant === 'happy') {
    return [
      '........KKKKKKKK........',
      '......KKRRRRRRRRKK......',
      '.....KRRRRRRRRRRRRK.....',
      '....KRRRRRRRRRRRRRRK....',
      '....KRRKKRRRRRRKKRRK....',
      '...KRRKWWKRRRRKWWKRRK...',
      '...KRKWWWWKRRKWWWWKRK...',
      '...KRKWWKKRRRRKKWWKRK...',
      '...KRRKKRRRRRRRRKKRRK...',
      '....KRRRRRRRRRRRRRRK....',
      '....KRRRRRRRRRRRRRRK....',
      '.....KRRRRRRRRRRRRK.....',
      '......KKRRRRRRRRKK......',
      '........KKKKKKKK........',
    ];
  }
  if (variant === 'wide') {
    return [
      '........KKKKKKKK........',
      '......KKRRRRRRRRKK......',
      '.....KRRRRRRRRRRRRK.....',
      '....KRRKKRRRRRRKKRRK....',
      '....KRKWWKRRRRKWWKRK....',
      '...KRKWWWWKRRKWWWWKRK...',
      '...KRKWWWWKRRKWWWWKRK...',
      '...KRKWWWWKRRKWWWWKRK...',
      '...KRRKWWKRRRRKWWKRRK...',
      '....KRRKKRRRRRRKKRRK....',
      '....KRRRRRRRRRRRRRRK....',
      '.....KRRRRRRRRRRRRK.....',
      '......KKRRRRRRRRKK......',
      '........KKKKKKKK........',
    ];
  }
  if (variant === 'upsideDown') {
    // Exact upside-down giant-eyed mask silhouette from reference image
    return [
      '.......KKKKKKKKKK.......',
      '......KRRRRRRRRRRK......',
      '.....KRRRRRRRRRRRRK.....',
      '.....KRRKKRRRRKKRRK.....',
      '....KRRKWWKRRKWWKRRK....',
      '....KRKWWWWKKWWWWKRK....',
      '....KRKWWWWKKWWWWKRK....',
      '....KRKWWWWKKWWWWKRK....',
      '.....KRKWWKRRKWWKRK.....',
      '.....KRRKKRRRRKKRRK.....',
      '......KRRRRRRRRRRK......',
      '.......KRRRRRRRRK.......',
      '........KKRRRRKK........',
      '..........KKKK..........',
    ];
  }
  // Classic upright giant-eyed clean mask
  return [
    '........KKKKKKKK........',
    '......KKRRRRRRRRKK......',
    '.....KRRRRRRRRRRRRK.....',
    '....KRRRRRRRRRRRRRRK....',
    '....KRRKKRRRRRRKKRRK....',
    '...KRRKWWKRRRRKWWKRRK...',
    '...KRKWWWWKRRKWWWWKRK...',
    '...KRKWWWWKRRKWWWWKRK...',
    '...KRKWWWWKRRKWWWWKRK...',
    '....KRKWWKRRRRKWWKRK....',
    '....KRRKKRRRRRRKKRRK....',
    '.....KRRRRRRRRRRRRK.....',
    '......KKRRRRRRRRKK......',
    '........KKKKKKKK........',
  ];
}

// 17 consistent 32x32 frames (0-15 game animations + 16 iconic upside-down hang)
const CHIBI_FRAMES: PixelRow[][] = [
  // 0: IDLE A
  [
    '........................',
    ...buildCleanChibiHead('normal'),
    '.......KKBBRRBBKK.......',
    '......KRKBRRRRKBKR......',
    '......KRKBRRRRKBKR......',
    '......KKKBBBBBBKKK......',
    '.......KKKBBBBKKK.......',
    '........KBB..BBK........',
    '........KRR..RRK........',
    '........KKK..KKK........',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
  ],
  // 1: IDLE B (subtle bounce + blink)
  [
    '........................',
    '........................',
    ...buildCleanChibiHead('blink'),
    '.......KKBBRRBBKK.......',
    '......KRKBRRRRKBKR......',
    '......KKKBRRRRKKKK......',
    '.......KKBBBBBBKK.......',
    '........KBB..BBK........',
    '........KRR..RRK........',
    '........KKK..KKK........',
    '........................',
    '........................',
    '........................',
    '........................',
  ],
  // 2: RUN 1
  [
    '........................',
    ...buildCleanChibiHead('normal'),
    '.......KKBBRRBBKK.......',
    '.....KKRKBRRRRKBKRKK....',
    '....KRR.KBBBBBBK.RRK....',
    '.....KK..KBBKKBBK.KK....',
    '........KBBK..KBBK......',
    '.......KRRK....KRRK.....',
    '.......KKK......KKK.....',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
  ],
  // 3: RUN 2
  [
    '........................',
    '........................',
    ...buildCleanChibiHead('normal'),
    '.......KKBBRRBBKK.......',
    '......KRKBRRRRKBKR......',
    '......KKKBBBBBBKKK......',
    '........KBBKKBBK........',
    '........KBB..BBK........',
    '........KRR..RRK........',
    '........KKK..KKK........',
    '........................',
    '........................',
    '........................',
    '........................',
  ],
  // 4: RUN 3
  [
    '........................',
    ...buildCleanChibiHead('normal'),
    '.......KKBBRRBBKK.......',
    '......KKRBRRRRBRKK......',
    '.....KRR.BBBBBB.RRK.....',
    '......KK.KBBKKBBK.K.....',
    '........KBBK..KBBK......',
    '.......KRRK....KRRK.....',
    '.......KKK......KKK.....',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
  ],
  // 5: RUN 4
  [
    ...buildCleanChibiHead('normal'),
    '.......KKBBRRBBKK.......',
    '......KRKBRRRRKBKR......',
    '......KKKBBBBBBKKK......',
    '........KBB..BBK........',
    '.......KRRK..KRRK.......',
    '.......KKK....KKK.......',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
  ],
  // 6: JUMP A
  [
    ...buildCleanChibiHead('happy'),
    '.....KK..BBRRBB..KK.....',
    '....KRRKKBRRRRKBKKRRK...',
    '.....KK.KBBBBBBK.KK.....',
    '.......KBBKKKKBBK.......',
    '......KRRK....KRRK......',
    '......KKK......KKK......',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
  ],
  // 7: JUMP B
  [
    '........................',
    ...buildCleanChibiHead('happy'),
    '.....KK..BBRRBB..KK.....',
    '....KRRKKBRRRRKBKKRRK...',
    '.....KK.KBBBBBBK.KK.....',
    '.......KBBKKKKBBK.......',
    '......KRRK....KRRK......',
    '......KKK......KKK......',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
  ],
  // 8: WEB SHOOT A
  [
    '.................KKK....',
    '................KRRK....',
    ...buildCleanChibiHead('normal').slice(0, 12),
    '.......KKBBRRBBKRRK.....',
    '......KRKBRRRRKBKK......',
    '......KKKBBBBBBK........',
    '........KBBKKBBK........',
    '.......KBBK..KBBK.......',
    '......KRRK....KRRK......',
    '......KKK......KKK......',
    '........................',
    '........................',
    '........................',
    '........................',
  ],
  // 9: WEB SHOOT B
  [
    '..................KKK...',
    '.................KRRK...',
    ...buildCleanChibiHead('normal').slice(0, 12),
    '.......KKBBRRBBKRRK.....',
    '......KRKBRRRRKBKK......',
    '.......KKBBBBBBK........',
    '.......KBBKKKKBBK.......',
    '......KRRK....KRRK......',
    '......KKK......KKK......',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
  ],
  // 10: WEB SWING A (iconic upside-down tucked web hang from reference!)
  [
    '..........KKWWKK........',
    '.........KRRWWWRK.......',
    '.......KKBRRWWWRBKK.....',
    '......KBBKRRRRRRKBBK....',
    '......KBBKRKBBKRKBBK....',
    '.......KKKRRRRRRKKK.....',
    '........KKRRRRRRKK......',
    ...buildCleanChibiHead('upsideDown'),
    '........................',
    '........................',
    '........................',
    '........................',
  ],
  // 11: WEB SWING B (gentle tucked swing sway)
  [
    '...........KKWWKK.......',
    '..........KRRWWWRK......',
    '........KKBRRWWWRBKK....',
    '.......KBBKRRRRRRKBBK...',
    '.......KBBKRKBBKRKBBK...',
    '........KKKRRRRRRKKK....',
    '.........KKRRRRRRKK.....',
    ...buildCleanChibiHead('upsideDown'),
    '........................',
    '........................',
    '........................',
    '........................',
  ],
  // 12: FALL A (wide surprised O O eyes)
  [
    '...KK..............KK...',
    '..KRRK............KRRK..',
    ...buildCleanChibiHead('wide').slice(0, 13),
    '.......KKBBRRBBKK.......',
    '......KK.BRRRRKB.KK.....',
    '........KBBBBBBK........',
    '.......KBBK..KBBK.......',
    '......KRRK....KRRK......',
    '......KKK......KKK......',
    '........................',
    '........................',
    '........................',
  ],
  // 13: FALL B
  [
    '..KK................KK..',
    '.KRRK..............KRRK.',
    ...buildCleanChibiHead('wide').slice(0, 13),
    '.......KKBBRRBBKK.......',
    '.......K.BRRRRKB.K......',
    '........KBBBBBBK........',
    '.......KBBK..KBBK.......',
    '.......KRRK..KRRK.......',
    '.......KKK....KKK.......',
    '........................',
    '........................',
    '........................',
  ],
  // 14: LAND
  [
    '........................',
    '........................',
    '........................',
    ...buildCleanChibiHead('blink'),
    '.....KKKBBRRBBKKK.......',
    '....KRRKBRRRRKBKRRK.....',
    '.....KK.BBBBBB.KK.......',
    '.......KBBKKBBK.........',
    '......KRRK..KRRK........',
    '......KKK....KKK........',
    '........................',
    '........................',
  ],
  // 15: VICTORY
  [
    '..KKK..............KKK..',
    '..KRRK............KRRK..',
    ...buildCleanChibiHead('happy').slice(0, 13),
    '......KKKBBRRBBKKK......',
    '.......KKBRRRRKBKK......',
    '........KBBBBBBK........',
    '........KBBKKBBK........',
    '........KBB..BBK........',
    '........KRR..RRK........',
    '........KKK..KKK........',
    '........................',
  ],
];

function drawFrameToContext(
  ctx: CanvasRenderingContext2D,
  frameRows: PixelRow[],
  frameIndex: number
): void {
  const originX = frameIndex * 32 + 4;
  const originY = 1;

  for (let y = 0; y < frameRows.length; y++) {
    const row = frameRows[y];
    for (let x = 0; x < row.length; x++) {
      const color = PALETTE[row[x]];
      if (!color || color === 'transparent') continue;
      ctx.fillStyle = color;
      ctx.fillRect(originX + x, originY + y, 1, 1);
    }
  }
}

export function registerChibiSpidermanSpriteSheet(scene: Phaser.Scene): void {
  if (scene.textures.exists(SPIDEY_SHEET_KEY)) return;

  const canvas = document.createElement('canvas');
  canvas.width = CHIBI_FRAMES.length * 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.imageSmoothingEnabled = false;
  CHIBI_FRAMES.forEach((rows, idx) => drawFrameToContext(ctx, rows, idx));

  const tex = scene.textures.addCanvas(SPIDEY_SHEET_KEY, canvas);
  if (tex) {
    for (let i = 0; i < CHIBI_FRAMES.length; i++) {
      tex.add(i, 0, i * 32, 0, 32, 32);
    }
  }

  const anims = scene.anims;
  if (!anims.exists('spidey-idle')) {
    anims.create({
      key: 'spidey-idle',
      frames: anims.generateFrameNumbers(SPIDEY_SHEET_KEY, { frames: [0, 1] }),
      frameRate: 3,
      repeat: -1,
    });
  }
  if (!anims.exists('spidey-run')) {
    anims.create({
      key: 'spidey-run',
      frames: anims.generateFrameNumbers(SPIDEY_SHEET_KEY, { frames: [2, 3, 4, 5] }),
      frameRate: 12,
      repeat: -1,
    });
  }
  if (!anims.exists('spidey-jump')) {
    anims.create({
      key: 'spidey-jump',
      frames: anims.generateFrameNumbers(SPIDEY_SHEET_KEY, { frames: [6, 7] }),
      frameRate: 8,
      repeat: -1,
    });
  }
  if (!anims.exists('spidey-web-shoot')) {
    anims.create({
      key: 'spidey-web-shoot',
      frames: anims.generateFrameNumbers(SPIDEY_SHEET_KEY, { frames: [8, 9] }),
      frameRate: 14,
      repeat: 0,
    });
  }
  if (!anims.exists('spidey-web-swing')) {
    anims.create({
      key: 'spidey-web-swing',
      frames: anims.generateFrameNumbers(SPIDEY_SHEET_KEY, { frames: [10, 11] }),
      frameRate: 6,
      repeat: -1,
    });
  }
  if (!anims.exists('spidey-fall')) {
    anims.create({
      key: 'spidey-fall',
      frames: anims.generateFrameNumbers(SPIDEY_SHEET_KEY, { frames: [12, 13] }),
      frameRate: 10,
      repeat: -1,
    });
  }
  if (!anims.exists('spidey-land')) {
    anims.create({
      key: 'spidey-land',
      frames: [{ key: SPIDEY_SHEET_KEY, frame: 14 }],
      frameRate: 10,
      repeat: 0,
    });
  }
  if (!anims.exists('spidey-victory')) {
    anims.create({
      key: 'spidey-victory',
      frames: anims.generateFrameNumbers(SPIDEY_SHEET_KEY, { frames: [15, 0] }),
      frameRate: 5,
      repeat: -1,
    });
  }
}

export function getChibiIdlePreviewUrl(frameIndex = 10): string {
  if (typeof document === 'undefined') return '';
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 36;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Draw crisp white vertical web thread from top for the iconic upside-down hang preview
  if (frameIndex === 10 || frameIndex === 11) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(15, 0, 2, 10);
  }

  const rows = CHIBI_FRAMES[frameIndex] || CHIBI_FRAMES[10];
  const yStart = frameIndex === 10 || frameIndex === 11 ? 8 : 2;
  for (let y = 0; y < rows.length; y++) {
    const row = rows[y];
    for (let x = 0; x < row.length; x++) {
      const color = PALETTE[row[x]];
      if (!color || color === 'transparent') continue;
      ctx.fillStyle = color;
      ctx.fillRect(4 + x, yStart + y, 1, 1);
    }
  }
  return canvas.toDataURL('image/png');
}
