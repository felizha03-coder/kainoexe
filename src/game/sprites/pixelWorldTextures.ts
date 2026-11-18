import Phaser from 'phaser';

function createCanvas(w: number, h: number): {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
} {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  return { canvas, ctx };
}

export function registerPixelWorldTextures(scene: Phaser.Scene): void {
  // 1. Pixel Clouds
  if (!scene.textures.exists('pixel-cloud')) {
    const { canvas, ctx } = createCanvas(48, 20);
    ctx.fillStyle = '#E0F2FE';
    ctx.fillRect(8, 8, 32, 8);
    ctx.fillRect(14, 4, 20, 4);
    ctx.fillRect(4, 11, 40, 5);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(10, 6, 26, 6);
    ctx.fillRect(16, 3, 14, 4);
    ctx.fillRect(6, 10, 34, 4);
    scene.textures.addCanvas('pixel-cloud', canvas);
  }

  // 2. Far Parallax City Skyline (orange / terracotta retro silhouettes)
  if (!scene.textures.exists('skyline-far')) {
    const { canvas, ctx } = createCanvas(320, 140);
    const buildings = [
      { x: 0, w: 36, h: 78, color: '#EA580C', trim: '#FB923C' },
      { x: 38, w: 28, h: 96, color: '#C2410C', trim: '#F97316' },
      { x: 68, w: 44, h: 66, color: '#B45309', trim: '#F59E0B' },
      { x: 114, w: 32, h: 112, color: '#DC2626', trim: '#F87171' },
      { x: 148, w: 40, h: 84, color: '#9A3412', trim: '#EA580C' },
      { x: 190, w: 34, h: 104, color: '#C2410C', trim: '#FB923C' },
      { x: 226, w: 46, h: 74, color: '#B45309', trim: '#FBBF24' },
      { x: 274, w: 46, h: 92, color: '#B91C1C', trim: '#EF4444' },
    ];
    buildings.forEach((b) => {
      const top = 140 - b.h;
      ctx.fillStyle = b.color;
      ctx.fillRect(b.x, top, b.w, b.h);
      ctx.fillStyle = b.trim;
      ctx.fillRect(b.x, top, b.w, 3);
      // Rooftop antenna
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(b.x + Math.floor(b.w / 2), top - 10, 2, 10);
      // Lit pixel windows
      for (let wy = top + 8; wy < 132; wy += 9) {
        for (let wx = b.x + 5; wx < b.x + b.w - 6; wx += 7) {
          ctx.fillStyle = (wx + wy) % 5 === 0 ? '#FEF08A' : '#38BDF8';
          ctx.fillRect(wx, wy, 3, 4);
        }
      }
    });
    scene.textures.addCanvas('skyline-far', canvas);
  }

  // 3. Mid Parallax City Skyline (warmer reds, browns, neon billboards)
  if (!scene.textures.exists('skyline-mid')) {
    const { canvas, ctx } = createCanvas(360, 150);
    const midBuildings = [
      { x: 0, w: 48, h: 92, color: '#92400E', accent: '#FBBF24' },
      { x: 52, w: 40, h: 118, color: '#991B1B', accent: '#38BDF8' },
      { x: 96, w: 54, h: 82, color: '#78350F', accent: '#F43F5E' },
      { x: 154, w: 44, h: 126, color: '#B45309', accent: '#FEF08A' },
      { x: 202, w: 50, h: 95, color: '#7C2D12', accent: '#22D3EE' },
      { x: 256, w: 46, h: 110, color: '#991B1B', accent: '#FDE047' },
      { x: 306, w: 54, h: 86, color: '#78350F', accent: '#FB7185' },
    ];
    midBuildings.forEach((b, idx) => {
      const top = 150 - b.h;
      ctx.fillStyle = b.color;
      ctx.fillRect(b.x, top, b.w, b.h);
      ctx.fillStyle = '#451A03';
      ctx.fillRect(b.x, top, b.w, 4);
      // Neon rooftop billboard on every second building
      if (idx % 2 === 1) {
        ctx.fillStyle = '#1E293B';
        ctx.fillRect(b.x + 8, top - 12, b.w - 16, 10);
        ctx.fillStyle = b.accent;
        ctx.fillRect(b.x + 10, top - 10, b.w - 20, 6);
      }
      for (let wy = top + 10; wy < 142; wy += 10) {
        for (let wx = b.x + 6; wx < b.x + b.w - 8; wx += 8) {
          ctx.fillStyle = (wx + idx) % 3 === 0 ? '#FDE047' : '#1E293B';
          ctx.fillRect(wx, wy, 4, 5);
        }
      }
    });
    scene.textures.addCanvas('skyline-mid', canvas);
  }

  // 4. Playable Rooftop Building Blocks (3 distinct brick/color styles)
  const themes = [
    { key: 'rooftop-orange', body: '#EA580C', shade: '#C2410C', rim: '#FDBA74', win: '#FEF08A' },
    { key: 'rooftop-red', body: '#DC2626', shade: '#991B1B', rim: '#FCA5A5', win: '#BAE6FD' },
    { key: 'rooftop-brown', body: '#92400E', shade: '#78350F', rim: '#FDE68A', win: '#FDE047' },
  ];

  themes.forEach((t) => {
    if (scene.textures.exists(t.key)) return;
    const { canvas, ctx } = createCanvas(64, 160);
    // Main facade
    ctx.fillStyle = t.body;
    ctx.fillRect(0, 8, 64, 152);
    // Side depth shadow
    ctx.fillStyle = t.shade;
    ctx.fillRect(54, 8, 10, 152);
    // Pixel brick lines
    ctx.fillStyle = t.shade;
    for (let y = 20; y < 156; y += 12) {
      ctx.fillRect(2, y, 50, 1);
    }
    // Crisp rooftop ledge & outline
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, 64, 10);
    ctx.fillStyle = t.rim;
    ctx.fillRect(1, 2, 62, 5);
    ctx.fillStyle = '#475569';
    ctx.fillRect(0, 8, 64, 2);
    // Lit building windows
    for (let y = 18; y < 146; y += 18) {
      for (let x = 8; x < 48; x += 14) {
        ctx.fillStyle = '#0F172A';
        ctx.fillRect(x, y, 9, 11);
        ctx.fillStyle = (x + y) % 4 === 0 ? t.win : '#38BDF8';
        ctx.fillRect(x + 1, y + 1, 7, 9);
      }
    }
    scene.textures.addCanvas(t.key, canvas);
  });

  // 5. Spider Token Collectible (4-frame spinning sheet 64x16)
  if (!scene.textures.exists('spider-token')) {
    const { canvas, ctx } = createCanvas(64, 16);
    const widths = [12, 8, 4, 8];
    widths.forEach((w, frame) => {
      const cx = frame * 16 + 8;
      const half = Math.floor(w / 2);
      // Outer outline
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(cx - half - 1, 2, w + 2, 12);
      // Gold coin fill
      ctx.fillStyle = '#FACC15';
      ctx.fillRect(cx - half, 3, w, 10);
      // Inner highlight
      ctx.fillStyle = '#FEF08A';
      ctx.fillRect(cx - half + 1, 4, Math.max(1, w - 2), 3);
      // Tiny red spider emblem in center
      if (w >= 8) {
        ctx.fillStyle = '#DC2626';
        ctx.fillRect(cx - 1, 6, 3, 4);
        ctx.fillRect(cx - 3, 7, 1, 2);
        ctx.fillRect(cx + 2, 7, 1, 2);
      }
    });
    const tex = scene.textures.addCanvas('spider-token', canvas);
    if (tex) {
      for (let i = 0; i < 4; i++) tex.add(i, 0, i * 16, 0, 16, 16);
    }
    if (!scene.anims.exists('token-spin')) {
      scene.anims.create({
        key: 'token-spin',
        frames: scene.anims.generateFrameNumbers('spider-token', { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1,
      });
    }
  }

  // 6. Web Anchor Node (crane / floating beacon node)
  if (!scene.textures.exists('web-anchor')) {
    const { canvas, ctx } = createCanvas(16, 16);
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(2, 2, 12, 12);
    ctx.fillStyle = '#38BDF8';
    ctx.fillRect(3, 3, 10, 10);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(5, 5, 6, 6);
    ctx.fillStyle = '#DC2626';
    ctx.fillRect(7, 7, 2, 2);
    scene.textures.addCanvas('web-anchor', canvas);
  }

  // 7. Rooftop Hazard Barrier / Electric Spikes
  if (!scene.textures.exists('hazard-spikes')) {
    const { canvas, ctx } = createCanvas(20, 16);
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 11, 20, 5);
    ctx.fillStyle = '#FACC15';
    ctx.fillRect(2, 12, 4, 3);
    ctx.fillRect(10, 12, 4, 3);
    // Electric hazard spikes
    for (let sx = 2; sx <= 14; sx += 6) {
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(sx, 2, 4, 9);
      ctx.fillStyle = '#EF4444';
      ctx.fillRect(sx + 1, 3, 2, 7);
      ctx.fillStyle = '#FCA5A5';
      ctx.fillRect(sx + 1, 3, 1, 3);
    }
    scene.textures.addCanvas('hazard-spikes', canvas);
  }

  // 8. Aerial Hazard Drone (retro shock bot)
  if (!scene.textures.exists('hazard-drone')) {
    const { canvas, ctx } = createCanvas(22, 16);
    // Rotor
    ctx.fillStyle = '#CBD5E1';
    ctx.fillRect(2, 1, 18, 2);
    // Body
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(4, 3, 14, 10);
    ctx.fillStyle = '#334155';
    ctx.fillRect(5, 4, 12, 8);
    // Glowing red visor
    ctx.fillStyle = '#EF4444';
    ctx.fillRect(6, 7, 10, 3);
    ctx.fillStyle = '#FEF08A';
    ctx.fillRect(7, 8, 3, 1);
    // Bottom spikes
    ctx.fillStyle = '#94A3B8';
    ctx.fillRect(6, 13, 2, 3);
    ctx.fillRect(14, 13, 2, 3);
    scene.textures.addCanvas('hazard-drone', canvas);
  }

  // 9. Crisp Square Pixel Particle
  if (!scene.textures.exists('pixel-particle')) {
    const { canvas, ctx } = createCanvas(4, 4);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 4, 4);
    scene.textures.addCanvas('pixel-particle', canvas);
  }
}
