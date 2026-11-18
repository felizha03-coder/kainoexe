import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { kainoAudio } from '../audio/kainoAudio';
import {
  DelonielSprite,
  EnergyOrb,
  KainoSprite,
  PixelFlower,
  PixelHeart,
  PixelStar,
} from '../components/PixelSprites';
import { useKaino } from '../context/KainoContext';
import { QUIZ_QUESTIONS } from '../data/kainoData';

type ArcadeGameTab = 'tictactoe' | 'catch' | 'memory' | 'quiz';

// ---------------------------------------------------------------------------
// GAME 01 — TIC TAC TOE
// ---------------------------------------------------------------------------
const TicTacToeGame: React.FC = () => {
  const { recordGameComplete } = useKaino();
  const [board, setBoard] = useState<(null | 'X' | 'O')[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<'X' | 'O'>('X');
  const [scores, setScores] = useState({ kaino: 0, deloniel: 0, ties: 0 });
  const [vsBot, setVsBot] = useState(true);

  const winLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const getWinner = (b: (null | 'X' | 'O')[]) => {
    for (const [a, c, d] of winLines) {
      if (b[a] && b[a] === b[c] && b[a] === b[d]) {
        return { winner: b[a], line: [a, c, d] };
      }
    }
    if (b.every(Boolean)) return { winner: 'DRAW' as const, line: [] as number[] };
    return null;
  };

  const result = getWinner(board);

  const makeMove = useCallback(
    (idx: number) => {
      if (board[idx] || getWinner(board)) return;
      kainoAudio.playClick();
      const next = [...board];
      next[idx] = turn;
      setBoard(next);

      const res = getWinner(next);
      if (res) {
        if (res.winner === 'X') {
          setScores((s) => ({ ...s, kaino: s.kaino + 1 }));
          recordGameComplete('tictactoe', 25, 'Won Tic Tac Toe ♡');
        } else if (res.winner === 'O') {
          setScores((s) => ({ ...s, deloniel: s.deloniel + 1 }));
          recordGameComplete('tictactoe', 20, 'Played Tic Tac Toe ♡');
        } else {
          setScores((s) => ({ ...s, ties: s.ties + 1 }));
          recordGameComplete('tictactoe', 20, 'Draw Game ♡');
        }
      } else {
        setTurn(turn === 'X' ? 'O' : 'X');
      }
    },
    [board, turn, recordGameComplete]
  );

  useEffect(() => {
    if (!vsBot || turn !== 'O' || result) return;
    const empty = board
      .map((val, i) => (val === null ? i : -1))
      .filter((i) => i >= 0);
    if (empty.length === 0) return;

    const timer = window.setTimeout(() => {
      const pick = empty.includes(4)
        ? 4
        : empty[Math.floor(Math.random() * empty.length)];
      makeMove(pick);
    }, 450);

    return () => window.clearTimeout(timer);
  }, [vsBot, turn, result, board, makeMove]);

  const restart = () => {
    kainoAudio.playClick();
    setBoard(Array(9).fill(null));
    setTurn('X');
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-body font-extrabold text-base text-[#181016]">
            Tic Tac Toe
          </h2>
          <p className="font-body text-xs text-[#382033]">
            Pink Heart (Kaino) vs Purple Star (Deloniel)
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            kainoAudio.playClick();
            setVsBot((v) => !v);
            restart();
          }}
          className="silver-bevel px-3 py-1.5 rounded-md font-pixel text-[8px] text-[#181016] cursor-pointer"
        >
          MODE: {vsBot ? 'VS DELONIEL' : '2 PLAYERS'}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 font-pixel text-[9px] text-center tabular-nums">
        <div className="bg-[#FFD4E7] border-2 border-[#382033] rounded-xl p-2.5">
          <p className="text-[#C92778]">KAINO ♡</p>
          <p className="text-sm pt-1">{scores.kaino}</p>
        </div>
        <div className="silver-bevel rounded-xl p-2.5">
          <p className="text-[#382033]/75">TIES</p>
          <p className="text-sm pt-1">{scores.ties}</p>
        </div>
        <div className="bg-[#C7B6F3]/55 border-2 border-[#382033] rounded-xl p-2.5">
          <p className="text-[#7C3AED]">DELONIEL ★</p>
          <p className="text-sm pt-1">{scores.deloniel}</p>
        </div>
      </div>

      <div className="max-w-[270px] mx-auto grid grid-cols-3 gap-2.5">
        {board.map((cell, i) => {
          const isWinCell = result?.line.includes(i);
          return (
            <button
              key={i}
              type="button"
              onClick={() => makeMove(i)}
              className={`h-20 rounded-xl border-2 border-[#382033] flex items-center justify-center cursor-pointer transition-transform ${
                isWinCell
                  ? 'bg-[#FCE24F] animate-heartbeat'
                  : 'bg-[#FFF5E8] hover:bg-[#FFD4E7]'
              }`}
            >
              {cell === 'X' && <PixelHeart size={34} color="#EC4899" />}
              {cell === 'O' && <PixelStar size={34} color="#C7B6F3" />}
            </button>
          );
        })}
      </div>

      <div className="silver-bevel rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
        <p className="font-body font-bold text-sm text-[#181016]">
          {result
            ? result.winner === 'DRAW'
              ? "Well, that's awkward. Nobody wins!"
              : result.winner === 'X'
              ? 'Okay, show-off. You win this round!'
              : 'Deloniel steals this round! Rematch?'
            : `Turn: ${turn === 'X' ? 'Kaino (Pink Heart)' : 'Deloniel (Purple Star)'}`}
        </p>

        <button
          type="button"
          onClick={restart}
          className="pixel-button px-4 py-2 bg-[#FCE24F] text-[#181016] font-pixel text-[9px] inline-flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>RESTART</span>
        </button>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// GAME 02 — CATCH MY HEART (Fixed Stable Loop + Mouse/Touch/Keyboard Controls)
// ---------------------------------------------------------------------------
interface FallingDrop {
  id: number;
  x: number;
  y: number;
  speed: number;
  kind: 'pink' | 'yellow' | 'broken';
}

const CatchMyHeartGame: React.FC = () => {
  const { collectHearts, recordGameComplete } = useKaino();
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [playerX, setPlayerX] = useState(50);
  const [avatar, setAvatar] = useState<'kaino' | 'deloniel'>('kaino');
  const [drops, setDrops] = useState<FallingDrop[]>([]);

  const arenaRef = useRef<HTMLDivElement | null>(null);
  const playerXRef = useRef(50);
  const moveDirRef = useRef(0);
  const scoreRef = useRef(0);
  const timeLeftRef = useRef(30);
  const dropsRef = useRef<FallingDrop[]>([]);
  const spawnAccRef = useRef(0);
  const dropIdRef = useRef(1);
  const keysRef = useRef<{ left: boolean; right: boolean }>({
    left: false,
    right: false,
  });

  const endRound = useCallback(() => {
    setPlaying(false);
    setFinished(true);
    moveDirRef.current = 0;
    keysRef.current = { left: false, right: false };
    const earnedHearts = Math.max(1, Math.floor(scoreRef.current / 10));
    collectHearts(earnedHearts, 0);
    recordGameComplete('catch-heart', 20, `Caught ${earnedHearts} Hearts ♡`);
  }, [collectHearts, recordGameComplete]);

  const endRoundRef = useRef(endRound);
  endRoundRef.current = endRound;

  const startRound = () => {
    kainoAudio.unlockFromUserGesture();
    kainoAudio.playClick();
    playerXRef.current = 50;
    scoreRef.current = 0;
    timeLeftRef.current = 30;
    spawnAccRef.current = 0;
    moveDirRef.current = 0;
    keysRef.current = { left: false, right: false };
    const initialDrop: FallingDrop = {
      id: dropIdRef.current++,
      x: 50,
      y: 8,
      speed: 34,
      kind: 'pink',
    };
    dropsRef.current = [initialDrop];
    setPlayerX(50);
    setScore(0);
    setTimeLeft(30);
    setDrops([initialDrop]);
    setFinished(false);
    setPlaying(true);
  };

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        if (playing) e.preventDefault();
        keysRef.current.left = true;
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        if (playing) e.preventDefault();
        keysRef.current.right = true;
      }
    };
    const onUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keysRef.current.left = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keysRef.current.right = false;
    };
    const onBlur = () => {
      keysRef.current = { left: false, right: false };
      moveDirRef.current = 0;
    };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      window.removeEventListener('blur', onBlur);
    };
  }, [playing]);

  // Countdown timer decoupled from rAF loop (depends only on [playing])
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      const nextTime = timeLeftRef.current - 1;
      timeLeftRef.current = nextTime;
      setTimeLeft(nextTime);
      if (nextTime <= 0) {
        window.clearInterval(timer);
        endRoundRef.current();
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [playing]);

  // Stable 60fps animation & collision loop (depends only on [playing])
  useEffect(() => {
    if (!playing) return;
    let rafId = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const dir =
        (keysRef.current.left ? -1 : 0) +
        (keysRef.current.right ? 1 : 0) +
        moveDirRef.current;

      if (dir !== 0) {
        playerXRef.current = Math.max(8, Math.min(92, playerXRef.current + dir * 74 * dt));
        setPlayerX(playerXRef.current);
      }

      const elapsedFactor = Math.max(0, (30 - timeLeftRef.current) / 30);
      const spawnInterval = Math.max(0.36, 0.72 - elapsedFactor * 0.28);
      spawnAccRef.current += dt;

      const nextList: FallingDrop[] = [];
      let scoreChanged = false;

      for (const d of dropsRef.current) {
        const ny = d.y + d.speed * dt;
        if (ny >= 74 && ny <= 94 && Math.abs(d.x - playerXRef.current) < 14) {
          if (d.kind === 'broken') {
            scoreRef.current = Math.max(0, scoreRef.current - 15);
            kainoAudio.playHurt();
          } else {
            const pts = d.kind === 'yellow' ? 25 : 10;
            scoreRef.current += pts;
            kainoAudio.playHeartCollect();
          }
          scoreChanged = true;
          continue;
        }
        if (ny < 103) {
          nextList.push({ ...d, y: ny });
        }
      }

      if (spawnAccRef.current >= spawnInterval) {
        spawnAccRef.current = 0;
        const r = Math.random();
        const kind: FallingDrop['kind'] =
          r < 0.22 ? 'broken' : r < 0.44 ? 'yellow' : 'pink';
        nextList.push({
          id: dropIdRef.current++,
          x: 10 + Math.random() * 80,
          y: -4,
          speed: 32 + elapsedFactor * 20 + Math.random() * 14,
          kind,
        });
      }

      dropsRef.current = nextList;
      setDrops(nextList);
      if (scoreChanged) {
        setScore(scoreRef.current);
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [playing]);

  const movePlayerFromPointer = (clientX: number) => {
    if (!playing || !arenaRef.current) return;
    const rect = arenaRef.current.getBoundingClientRect();
    if (rect.width <= 0) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    const clamped = Math.max(8, Math.min(92, pct));
    playerXRef.current = clamped;
    setPlayerX(clamped);
  };

  const stepPlayer = (delta: number) => {
    if (!playing) return;
    const clamped = Math.max(8, Math.min(92, playerXRef.current + delta));
    playerXRef.current = clamped;
    setPlayerX(clamped);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="font-body font-extrabold text-base text-[#181016]">
            Catch My Heart
          </h2>
          <p className="font-body text-xs text-[#481D3F]">
            Move mouse/finger in the box, use A / D / Arrow Keys, or press LEFT / RIGHT.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAvatar((a) => (a === 'kaino' ? 'deloniel' : 'kaino'))}
          className="silver-bevel px-3 py-1.5 rounded-md font-pixel text-[8px] cursor-pointer"
        >
          HERO: {avatar.toUpperCase()}
        </button>
      </div>

      <div className="flex items-center justify-between bg-[#EC4899] border-2 border-[#6B2D5C] text-white px-4 py-2 rounded-xl font-pixel text-[10px] tabular-nums">
        <span>SCORE: {score}</span>
        <span className="text-[#FEF08A]">TIME: {timeLeft}s</span>
      </div>

      <div
        ref={arenaRef}
        onPointerMove={(e) => movePlayerFromPointer(e.clientX)}
        onPointerDown={(e) => movePlayerFromPointer(e.clientX)}
        onTouchMove={(e) => {
          if (e.touches[0]) movePlayerFromPointer(e.touches[0].clientX);
        }}
        className="relative w-full h-72 bg-gradient-to-b from-[#FEF08A] via-[#FEF9C3] to-[#86EFAC] border-3 border-[#6B2D5C] rounded-2xl overflow-hidden select-none touch-none cursor-crosshair"
      >
        {drops.map((d) => (
          <div
            key={d.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ left: `${d.x}%`, top: `${d.y}%` }}
          >
            {d.kind === 'broken' ? (
              <span className="inline-block px-1.5 py-0.5 bg-[#6B2D5C] text-white font-pixel text-[10px] rounded border border-rose-300">
                💔
              </span>
            ) : (
              <PixelHeart
                size={26}
                color={d.kind === 'yellow' ? '#FDE047' : '#EC4899'}
              />
            )}
          </div>
        ))}

        <div
          className="absolute bottom-2 -translate-x-1/2 pointer-events-none"
          style={{ left: `${playerX}%` }}
        >
          {avatar === 'kaino' ? (
            <KainoSprite pose="waving" size={54} />
          ) : (
            <DelonielSprite pose="waving" size={54} />
          )}
        </div>

        {!playing && (
          <div className="absolute inset-0 bg-[#FF8DC7]/88 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center gap-3 text-[#481D3F] cursor-default">
            {finished ? (
              <>
                <h3 className="font-pixel text-sm text-[#FEF08A] drop-shadow-[1px_1px_0_#6B2D5C]">
                  TIME&apos;S UP!
                </h3>
                <p className="font-pixel text-xs text-white drop-shadow-[1px_1px_0_#6B2D5C]">
                  FINAL SCORE: {score}
                </p>
              </>
            ) : (
              <p className="font-body font-extrabold text-sm max-w-xs bg-[#FFF9FC]/95 border-2 border-[#6B2D5C] rounded-xl px-4 py-2.5">
                Catch as many pink &amp; yellow hearts as you can in 30 seconds!
              </p>
            )}
            <button
              type="button"
              onClick={startRound}
              className="pixel-button px-5 py-2.5 bg-[#FDE047] hover:bg-[#FFF9FC] text-[#481D3F] font-pixel text-[10px] cursor-pointer"
            >
              {finished ? 'PLAY AGAIN ♡' : 'START CATCHING ♡'}
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-4">
        <button
          type="button"
          onPointerDown={() => {
            moveDirRef.current = -1;
          }}
          onPointerUp={() => {
            moveDirRef.current = 0;
          }}
          onPointerCancel={() => {
            moveDirRef.current = 0;
          }}
          onPointerLeave={() => {
            moveDirRef.current = 0;
          }}
          onClick={() => stepPlayer(-9)}
          className="silver-bevel flex-1 max-w-[140px] py-2.5 rounded-xl font-pixel text-xs flex items-center justify-center gap-1 cursor-pointer select-none"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>LEFT</span>
        </button>

        <button
          type="button"
          onPointerDown={() => {
            moveDirRef.current = 1;
          }}
          onPointerUp={() => {
            moveDirRef.current = 0;
          }}
          onPointerCancel={() => {
            moveDirRef.current = 0;
          }}
          onPointerLeave={() => {
            moveDirRef.current = 0;
          }}
          onClick={() => stepPlayer(9)}
          className="silver-bevel flex-1 max-w-[140px] py-2.5 rounded-xl font-pixel text-xs flex items-center justify-center gap-1 cursor-pointer select-none"
        >
          <span>RIGHT</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// GAME 03 — MEMORY MATCH (4x4)
// ---------------------------------------------------------------------------
interface MemoryTile {
  uid: number;
  pairId: string;
  matched: boolean;
}

const MEMORY_SYMBOLS = [
  'heart',
  'flower',
  'star',
  'kaino',
  'deloniel',
  'yellowHeart',
  'lavFlower',
  'spark',
] as const;

function buildShuffledMemoryDeck(): MemoryTile[] {
  const doubled = [...MEMORY_SYMBOLS, ...MEMORY_SYMBOLS];
  for (let i = doubled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [doubled[i], doubled[j]] = [doubled[j], doubled[i]];
  }
  return doubled.map((pairId, uid) => ({ uid, pairId, matched: false }));
}

const MemoryMatchGame: React.FC = () => {
  const { recordGameComplete } = useKaino();
  const [tiles, setTiles] = useState<MemoryTile[]>(() => buildShuffledMemoryDeck());
  const [openIndices, setOpenIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [won, setWon] = useState(false);

  useEffect(() => {
    if (won) return;
    const t = window.setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => window.clearInterval(t);
  }, [won]);

  const restart = () => {
    kainoAudio.playClick();
    setTiles(buildShuffledMemoryDeck());
    setOpenIndices([]);
    setMoves(0);
    setElapsed(0);
    setWon(false);
  };

  const flipTile = (idx: number) => {
    if (won || openIndices.length >= 2 || openIndices.includes(idx) || tiles[idx].matched) {
      return;
    }
    kainoAudio.playCardFlip();
    const nextOpen = [...openIndices, idx];
    setOpenIndices(nextOpen);

    if (nextOpen.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = nextOpen;
      if (tiles[a].pairId === tiles[b].pairId) {
        window.setTimeout(() => {
          kainoAudio.playHeartCollect();
          setTiles((prev) => {
            const updated = prev.map((tile, i) =>
              i === a || i === b ? { ...tile, matched: true } : tile
            );
            if (updated.every((t) => t.matched)) {
              setWon(true);
              recordGameComplete('memory-match', 30, 'Completed Memory Match ♡');
            }
            return updated;
          });
          setOpenIndices([]);
        }, 320);
      } else {
        window.setTimeout(() => {
          setOpenIndices([]);
        }, 720);
      }
    }
  };

  const renderTileIcon = (pairId: string) => {
    switch (pairId) {
      case 'heart':
        return <PixelHeart size={28} color="#EC4899" />;
      case 'yellowHeart':
        return <PixelHeart size={28} color="#FDE047" />;
      case 'flower':
        return <PixelFlower size={28} petalColor="#EC4899" />;
      case 'lavFlower':
        return <PixelFlower size={28} petalColor="#C7B6F3" />;
      case 'star':
        return <PixelStar size={28} color="#C7B6F3" />;
      case 'kaino':
        return <KainoSprite pose="smiling" size={34} />;
      case 'deloniel':
        return <DelonielSprite pose="smiling" size={34} />;
      default:
        return <PixelHeart size={28} color="#C92778" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="font-body font-extrabold text-base text-[#181016]">
            Memory Match (4×4)
          </h2>
          <p className="font-body text-xs text-[#382033]">
            Match hearts, flowers, stars, Kaino &amp; Deloniel!
          </p>
        </div>

        <div className="flex items-center gap-3 font-pixel text-[9px] tabular-nums">
          <span>MOVES: {moves}</span>
          <span>TIME: {elapsed}s</span>
        </div>
      </div>

      <div className="max-w-sm mx-auto grid grid-cols-4 gap-2.5">
        {tiles.map((tile, idx) => {
          const revealed = tile.matched || openIndices.includes(idx);
          return (
            <button
              key={tile.uid}
              type="button"
              onClick={() => flipTile(idx)}
              className={`h-16 sm:h-20 rounded-xl border-2 border-[#382033] flex items-center justify-center cursor-pointer transition-transform ${
                tile.matched
                  ? 'bg-[#C7B6F3]/65'
                  : revealed
                  ? 'bg-[#FFF5E8]'
                  : 'bg-[#EC4899] hover:bg-[#C92778]'
              }`}
            >
              {revealed ? (
                renderTileIcon(tile.pairId)
              ) : (
                <span className="font-pixel text-xs text-white">♡</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="silver-bevel flex items-center justify-between rounded-xl p-3">
        <p className="font-body font-bold text-sm text-[#181016]">
          {won
            ? `You matched all 8 pairs in ${moves} moves (${elapsed}s)! ♡`
            : 'Flip two tiles to find matching pairs.'}
        </p>
        <button
          type="button"
          onClick={restart}
          className="pixel-button px-4 py-2 bg-[#FCE24F] text-[#181016] font-pixel text-[9px] inline-flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>RESTART</span>
        </button>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// GAME 04 — HOW WELL DO YOU KNOW ME?
// ---------------------------------------------------------------------------
const KnowMeQuizGame: React.FC = () => {
  const { recordGameComplete } = useKaino();
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [answersCount, setAnswersCount] = useState(0);
  const [done, setDone] = useState(false);

  const current = QUIZ_QUESTIONS[step];

  const choose = (opt: string) => {
    kainoAudio.playClick();
    setPicked(opt);
    setAnswersCount((c) => c + 1);
  };

  const nextQuestion = () => {
    kainoAudio.playClick();
    if (step + 1 < QUIZ_QUESTIONS.length) {
      setStep((s) => s + 1);
      setPicked(null);
    } else {
      setDone(true);
      recordGameComplete('know-me-quiz', 30, 'Completed Quiz ♡');
    }
  };

  const restart = () => {
    kainoAudio.playClick();
    setStep(0);
    setPicked(null);
    setAnswersCount(0);
    setDone(false);
  };

  if (done) {
    return (
      <div className="silver-bevel rounded-2xl p-6 text-center space-y-4">
        <div className="flex justify-center gap-4">
          <KainoSprite pose="blushing" size={68} />
          <DelonielSprite pose="blushing" size={68} />
        </div>
        <h3 className="font-body font-extrabold text-base text-[#C92778]">
          VIBE COMPATIBILITY: 100% ♡
        </h3>
        <p className="font-body text-sm text-[#181016] max-w-md mx-auto">
          You answered all {answersCount} questions! Whatever this dynamic is, Kaino &amp; Deloniel clearly share top-tier timing and chaotic chemistry.
        </p>
        <button
          type="button"
          onClick={restart}
          className="pixel-button px-5 py-2.5 bg-[#FCE24F] text-[#181016] font-pixel text-[10px] cursor-pointer"
        >
          PLAY QUIZ AGAIN ♡
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-body font-extrabold text-base text-[#181016]">
          How Well Do You Know Me?
        </h2>
        <span className="font-pixel text-[9px] text-[#382033]">
          {step + 1} / {QUIZ_QUESTIONS.length}
        </span>
      </div>

      <div className="bg-[#FFD4E7] border-2 border-[#382033] rounded-2xl p-5 space-y-4">
        <p className="font-body font-extrabold text-base text-[#181016]">
          {current.prompt}
        </p>

        <div className="space-y-2.5">
          {current.options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => choose(opt)}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 border-[#382033] font-body font-bold text-sm cursor-pointer transition-colors ${
                picked === opt
                  ? 'bg-[#EC4899] text-white'
                  : 'bg-[#FFF5E8] hover:bg-white text-[#181016]'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {picked && (
          <div className="silver-bevel rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3">
            <p className="font-body text-xs sm:text-sm text-[#181016]">
              {current.reaction}
            </p>
            <button
              type="button"
              onClick={nextQuestion}
              className="pixel-button px-4 py-2 bg-[#FCE24F] font-pixel text-[9px] text-[#181016] cursor-pointer"
            >
              {step + 1 < QUIZ_QUESTIONS.length ? 'NEXT ▶' : 'SEE RESULT ♡'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// ARCADE CONTAINER SCREEN
// ---------------------------------------------------------------------------
export const LoveArcadeScreen: React.FC = () => {
  const { navigate } = useKaino();
  const [activeTab, setActiveTab] = useState<ArcadeGameTab>('tictactoe');

  return (
    <main className="min-h-[calc(100vh-3.5rem)] w-full pink-pixel-grid py-6 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="yellow-card-shell rounded-2xl p-1.5">
          <div className="card-magenta-texture rounded-xl border-2 border-[#382033] px-5 py-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="basic-silver-tag px-2.5 py-0.5 font-body font-extrabold italic text-[10px]">
                  ARCADE
                </span>
                <h1 className="font-body font-extrabold text-lg sm:text-xl text-[#181016]">
                  MINI-GAME ARCADE
                </h1>
              </div>
              <p className="font-body font-bold text-xs sm:text-sm text-[#181016]/85">
                LET&apos;S PLAY SOMETHING!
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

        {/* Yellow Card Frame + Mottled Magenta Arcade Deck */}
        <section className="yellow-card-shell rounded-[26px] p-2.5">
          <div className="card-magenta-texture rounded-[18px] border-2 border-[#382033] p-4 sm:p-5 space-y-4">
            {/* Game Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(
                [
                  { id: 'tictactoe', label: '01. Tic Tac Toe' },
                  { id: 'catch', label: '02. Catch Heart' },
                  { id: 'memory', label: '03. Memory' },
                  { id: 'quiz', label: '04. Quiz' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    kainoAudio.playClick();
                    setActiveTab(tab.id);
                  }}
                  className={`py-2 px-3 rounded-lg font-body font-extrabold text-xs sm:text-sm cursor-pointer whitespace-nowrap inline-flex items-center justify-center gap-1.5 ${
                    activeTab === tab.id
                      ? 'bg-[#FCE24F] border-2 border-[#382033] text-[#181016] shadow-[0_2px_0_#382033]'
                      : 'silver-bevel text-[#181016] hover:brightness-105'
                  }`}
                >
                  <EnergyOrb variant="pink" size={14} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Metallic Silver Screen Frame */}
            <div className="silver-bevel rounded-xl p-2">
              <div className="bg-[#FFF5E8] border-2 border-[#382033] rounded-lg p-4 sm:p-5">
                {activeTab === 'tictactoe' && <TicTacToeGame />}
                {activeTab === 'catch' && <CatchMyHeartGame />}
                {activeTab === 'memory' && <MemoryMatchGame />}
                {activeTab === 'quiz' && <KnowMeQuizGame />}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
