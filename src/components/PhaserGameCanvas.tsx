import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import {
  GAME_HEIGHT,
  GAME_WIDTH,
  SpidermanScene,
  SpidermanSceneCallbacks,
} from '../game/scenes/SpidermanScene';

interface PhaserGameCanvasProps {
  callbacks: SpidermanSceneCallbacks;
  onSceneReady: (scene: SpidermanScene) => void;
}

export const PhaserGameCanvas: React.FC<PhaserGameCanvasProps> = ({
  callbacks,
  onSceneReady,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const callbacksRef = useRef(callbacks);
  const onSceneReadyRef = useRef(onSceneReady);

  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  useEffect(() => {
    onSceneReadyRef.current = onSceneReady;
  }, [onSceneReady]);

  useEffect(() => {
    const parent = containerRef.current;
    if (!parent) return;

    const sceneInstance = new SpidermanScene({
      onHudUpdate: (hud) => callbacksRef.current.onHudUpdate(hud),
      onStateChange: (state) => callbacksRef.current.onStateChange(state),
      onGameOver: (summary) => callbacksRef.current.onGameOver(summary),
    });

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      backgroundColor: '#0284C7',
      pixelArt: true,
      roundPixels: true,
      antialias: false,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
      },
      scene: [sceneInstance],
    });

    onSceneReadyRef.current(sceneInstance);

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full pixelated select-none overflow-hidden bg-[#0284C7]"
    />
  );
};
