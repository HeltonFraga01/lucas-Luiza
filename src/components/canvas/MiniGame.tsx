"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ═══════════════════════════════════════════════════════════════
// Types & Constants
// ═══════════════════════════════════════════════════════════════

interface GameEntity {
  x: number;
  y: number;
  w: number;
  h: number;
  type: "obstacle" | "collectible" | "ring";
  collected?: boolean;
}

const CANVAS_W = 800;
const CANVAS_H = 400;
const GROUND_Y = 340;
const GRAVITY = 0.6;
const JUMP_FORCE = -12;
const MOVE_SPEED = 4;
const PLAYER_W = 28;
const PLAYER_H = 40;
const TOTAL_COLLECTIBLES = 10;
const MAP_LENGTH = 3200;

// ═══════════════════════════════════════════════════════════════
// Map Generation (outside component)
// ═══════════════════════════════════════════════════════════════

function generateMap(): GameEntity[] {
  const entities: GameEntity[] = [];

  // Obstacles (rocks)
  const obstaclePositions = [400, 700, 950, 1250, 1600, 1900, 2200, 2550, 2800];
  for (const x of obstaclePositions) {
    entities.push({
      x,
      y: GROUND_Y - 20,
      w: 30,
      h: 20,
      type: "obstacle",
    });
  }

  // Collectibles (strawberries/hearts)
  const collectiblePositions = [
    { x: 250, y: GROUND_Y - 60 },
    { x: 550, y: GROUND_Y - 80 },
    { x: 800, y: GROUND_Y - 50 },
    { x: 1050, y: GROUND_Y - 90 },
    { x: 1350, y: GROUND_Y - 60 },
    { x: 1650, y: GROUND_Y - 70 },
    { x: 1950, y: GROUND_Y - 55 },
    { x: 2150, y: GROUND_Y - 85 },
    { x: 2450, y: GROUND_Y - 65 },
    { x: 2700, y: GROUND_Y - 75 },
  ];
  for (const pos of collectiblePositions) {
    entities.push({ x: pos.x, y: pos.y, w: 20, h: 20, type: "collectible" });
  }

  // Ring at the end
  entities.push({
    x: MAP_LENGTH - 150,
    y: GROUND_Y - 60,
    w: 24,
    h: 24,
    type: "ring",
  });

  return entities;
}

// ═══════════════════════════════════════════════════════════════
// Mini-Game Component
// ═══════════════════════════════════════════════════════════════

interface MiniGameProps {
  onClose: () => void;
  secretMessage?: string;
}

export default function MiniGame({ onClose, secretMessage }: MiniGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<"playing" | "won">("playing");
  const [collected, setCollected] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  // Game refs (avoid re-renders)
  const playerRef = useRef({ x: 80, y: GROUND_Y - PLAYER_H, vy: 0, onGround: true });
  const keysRef = useRef<Set<string>>(new Set());
  const cameraRef = useRef(0);
  const entitiesRef = useRef<GameEntity[]>(generateMap());
  const collectedRef = useRef(0);
  const rafRef = useRef<number>(0);
  const gameOverRef = useRef(false);

  // ── Keyboard Controls ────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", " "].includes(e.key)) {
        e.preventDefault();
        keysRef.current.add(e.key);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // ── Touch Controls ───────────────────────────────────
  const touchAction = useCallback((action: string, active: boolean) => {
    if (active) keysRef.current.add(action);
    else keysRef.current.delete(action);
  }, []);

  // ── Game Loop ────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function gameLoop() {
      if (gameOverRef.current) return;
      if (!ctx) return;

      const player = playerRef.current;
      const keys = keysRef.current;
      const entities = entitiesRef.current;

      // ── Input ──
      if (keys.has("ArrowLeft")) player.x -= MOVE_SPEED;
      if (keys.has("ArrowRight")) player.x += MOVE_SPEED;
      if ((keys.has("ArrowUp") || keys.has(" ")) && player.onGround) {
        player.vy = JUMP_FORCE;
        player.onGround = false;
      }

      // ── Physics ──
      player.vy += GRAVITY;
      player.y += player.vy;

      // Ground collision
      if (player.y >= GROUND_Y - PLAYER_H) {
        player.y = GROUND_Y - PLAYER_H;
        player.vy = 0;
        player.onGround = true;
      }

      // Keep player in bounds
      if (player.x < 20) player.x = 20;
      if (player.x > MAP_LENGTH - 40) player.x = MAP_LENGTH - 40;

      // Camera follow
      const targetCam = player.x - CANVAS_W / 3;
      cameraRef.current += (targetCam - cameraRef.current) * 0.08;
      if (cameraRef.current < 0) cameraRef.current = 0;
      if (cameraRef.current > MAP_LENGTH - CANVAS_W) cameraRef.current = MAP_LENGTH - CANVAS_W;

      const cam = cameraRef.current;

      // ── Collisions ──
      for (const e of entities) {
        if (e.collected) continue;
        const px = player.x, py = player.y;
        const overlap = px < e.x + e.w && px + PLAYER_W > e.x && py < e.y + e.h && py + PLAYER_H > e.y;

        if (!overlap) continue;

        if (e.type === "collectible") {
          e.collected = true;
          collectedRef.current++;
          setCollected(collectedRef.current);
        } else if (e.type === "ring" && collectedRef.current >= TOTAL_COLLECTIBLES) {
          e.collected = true;
          gameOverRef.current = true;
          setGameState("won");
          setShowConfetti(true);
          return;
        } else if (e.type === "obstacle") {
          // Bounce off obstacle
          player.y = e.y - PLAYER_H;
          player.vy = JUMP_FORCE * 0.5;
          player.onGround = false;
        }
      }

      // ── Render ──
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

      // Sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
      skyGrad.addColorStop(0, "#D6E4F7");
      skyGrad.addColorStop(0.6, "#F5F1EA");
      skyGrad.addColorStop(1, "#E8DDC8");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Clouds (parallax)
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      for (let i = 0; i < 6; i++) {
        const cx = (i * 600 + 100) - cam * 0.3;
        if (cx > -100 && cx < CANVAS_W + 100) {
          ctx.beginPath();
          ctx.ellipse(cx, 60 + (i % 3) * 25, 50 + i * 8, 18, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Hills (parallax)
      ctx.fillStyle = "rgba(139,168,120,0.25)";
      ctx.beginPath();
      ctx.moveTo(0, CANVAS_H);
      for (let x = 0; x <= CANVAS_W; x += 10) {
        const worldX = x + cam * 0.5;
        const hill = Math.sin(worldX * 0.003) * 40 + Math.sin(worldX * 0.007) * 20;
        ctx.lineTo(x, GROUND_Y - 20 + hill);
      }
      ctx.lineTo(CANVAS_W, CANVAS_H);
      ctx.closePath();
      ctx.fill();

      // Ground
      ctx.fillStyle = "#C4B59A";
      ctx.fillRect(0, GROUND_Y, CANVAS_W, CANVAS_H - GROUND_Y);
      ctx.fillStyle = "#9E8E73";
      ctx.fillRect(0, GROUND_Y, CANVAS_W, 3);

      // Grass tufts
      ctx.fillStyle = "#8BA878";
      for (let i = 0; i < 40; i++) {
        const gx = (i * 80 + 20) - (cam % 80);
        ctx.fillRect(gx, GROUND_Y - 4, 8, 4);
      }

      // ── Entities ──
      for (const e of entities) {
        if (e.collected) continue;
        const sx = e.x - cam;
        if (sx < -50 || sx > CANVAS_W + 50) continue;

        if (e.type === "obstacle") {
          // Rock
          ctx.fillStyle = "#8B7355";
          ctx.beginPath();
          ctx.moveTo(sx, e.y + e.h);
          ctx.lineTo(sx + e.w / 2, e.y);
          ctx.lineTo(sx + e.w, e.y + e.h);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = "#A08868";
          ctx.beginPath();
          ctx.moveTo(sx + 5, e.y + e.h);
          ctx.lineTo(sx + e.w / 2, e.y + 4);
          ctx.lineTo(sx + e.w - 5, e.y + e.h);
          ctx.closePath();
          ctx.fill();
        } else if (e.type === "collectible") {
          // Strawberry / heart
          const bob = Math.sin(Date.now() * 0.005 + e.x) * 3;
          ctx.fillStyle = "#E84057";
          ctx.beginPath();
          ctx.arc(sx + 10, e.y + 10 + bob, 8, 0, Math.PI * 2);
          ctx.fill();
          // Leaf
          ctx.fillStyle = "#4CAF50";
          ctx.beginPath();
          ctx.ellipse(sx + 10, e.y + 3 + bob, 4, 2, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (e.type === "ring") {
          // Wedding ring (only glows if enough collectibles)
          const glow = collectedRef.current >= TOTAL_COLLECTIBLES;
          const bob = Math.sin(Date.now() * 0.004) * 4;
          if (glow) {
            ctx.shadowColor = "#C9A84C";
            ctx.shadowBlur = 15;
          }
          ctx.strokeStyle = glow ? "#C9A84C" : "#999";
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.ellipse(sx + 12, e.y + 12 + bob, 10, 12, 0, 0, Math.PI * 2);
          ctx.stroke();
          // Diamond
          if (glow) {
            ctx.fillStyle = "#E0F7FA";
            ctx.beginPath();
            ctx.moveTo(sx + 12, e.y + bob);
            ctx.lineTo(sx + 8, e.y + 6 + bob);
            ctx.lineTo(sx + 12, e.y + 4 + bob);
            ctx.lineTo(sx + 16, e.y + 6 + bob);
            ctx.closePath();
            ctx.fill();
          }
          ctx.shadowBlur = 0;
        }
      }

      // ── Player ──
      const px = player.x - cam;
      const py = player.y;

      // Body
      ctx.fillStyle = "#6B7FD4";
      ctx.fillRect(px + 6, py + 14, 16, 18);

      // Head
      ctx.fillStyle = "#F5D0A9";
      ctx.beginPath();
      ctx.arc(px + 14, py + 10, 10, 0, Math.PI * 2);
      ctx.fill();

      // Hair
      ctx.fillStyle = "#5C3D2E";
      ctx.beginPath();
      ctx.arc(px + 14, py + 7, 10, Math.PI, 0);
      ctx.fill();

      // Eyes
      ctx.fillStyle = "#333";
      ctx.fillRect(px + 10, py + 8, 2, 2);
      ctx.fillRect(px + 16, py + 8, 2, 2);

      // Smile
      ctx.strokeStyle = "#C98A5A";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(px + 14, py + 12, 4, 0, Math.PI);
      ctx.stroke();

      // Legs
      ctx.fillStyle = "#444";
      ctx.fillRect(px + 8, py + 32, 5, 8);
      ctx.fillRect(px + 15, py + 32, 5, 8);

      // ── HUD ──
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.fillRect(10, 10, 160, 32);
      ctx.fillStyle = "#FFF";
      ctx.font = "bold 13px 'DM Sans', sans-serif";
      ctx.fillText(`🍓 ${collectedRef.current} / ${TOTAL_COLLECTIBLES}`, 18, 30);

      // Ring indicator
      if (collectedRef.current >= TOTAL_COLLECTIBLES) {
        ctx.fillStyle = "#C9A84C";
        ctx.fillText("💍 Colete o anel!", 100, 30);
      }

      rafRef.current = requestAnimationFrame(gameLoop);
    }

    rafRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center bg-charcoal/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-pearl rounded-2xl shadow-hover overflow-hidden max-w-[850px] w-full"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 bg-sky-wash border-b border-dust">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎮</span>
            <h3 className="font-serif text-base text-charcoal">Jogo do Amor</h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-sans text-stone">
              🍓 {collected} / {TOTAL_COLLECTIBLES}
            </span>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-dust/40
                         text-stone transition-colors cursor-pointer text-sm"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="relative">
          <AnimatePresence>
            {gameState === "playing" && (
              <canvas
                ref={canvasRef}
                width={CANVAS_W}
                height={CANVAS_H}
                className="w-full aspect-2/1 block"
                style={{ imageRendering: "pixelated" }}
              />
            )}

            {gameState === "won" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full aspect-2/1 flex flex-col items-center justify-center bg-parchment relative overflow-hidden"
              >
                {/* Confetti */}
                {showConfetti && <ConfettiCanvas />}

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="text-5xl mb-3"
                >
                  💌
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="font-display italic text-2xl md:text-3xl text-navy-deep mb-2"
                >
                  Mensagem Secreta
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="font-serif text-sm md:text-base text-charcoal/80 max-w-md text-center leading-relaxed px-4"
                >
                  {secretMessage ? (
                    <>
                      &ldquo;{secretMessage}&rdquo;
                    </>
                  ) : (
                    <>
                      &ldquo;Obrigado por estar nessa jornada com a gente!
                      Cada pessoa que estará presente faz parte da nossa história.
                      Não vemos a hora de celebrar com você!&rdquo;
                    </>
                  )}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0 }}
                  className="font-display italic text-base text-gold-leaf mt-2"
                >
                  Com amor, Lucas & Luiza 💙
                </motion.p>
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4 }}
                  onClick={onClose}
                  className="mt-5 px-6 py-2.5 bg-cornflower text-pearl font-sans text-sm font-medium
                             rounded-pill hover:bg-cornflower/90 transition-colors cursor-pointer"
                >
                  Voltar ao site 💙
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Touch Controls (visible on mobile) */}
        {gameState === "playing" && (
          <div className="flex items-center justify-center gap-4 p-3 bg-sky-wash border-t border-dust md:hidden">
            <button
              onTouchStart={() => touchAction("ArrowLeft", true)}
              onTouchEnd={() => touchAction("ArrowLeft", false)}
              className="w-14 h-14 rounded-xl bg-pearl border border-dust shadow-sm
                         flex items-center justify-center text-xl active:bg-dust/30 transition-colors touch-none"
            >
              ←
            </button>
            <button
              onTouchStart={() => touchAction(" ", true)}
              onTouchEnd={() => touchAction(" ", false)}
              className="w-14 h-14 rounded-xl bg-cornflower text-pearl shadow-sm
                         flex items-center justify-center text-sm font-sans font-bold
                         active:bg-cornflower/80 transition-colors touch-none"
            >
              PULAR
            </button>
            <button
              onTouchStart={() => touchAction("ArrowRight", true)}
              onTouchEnd={() => touchAction("ArrowRight", false)}
              className="w-14 h-14 rounded-xl bg-pearl border border-dust shadow-sm
                         flex items-center justify-center text-xl active:bg-dust/30 transition-colors touch-none"
            >
              →
            </button>
          </div>
        )}

        {/* Instructions */}
        {gameState === "playing" && (
          <p className="hidden md:block text-[10px] text-stone/60 font-sans text-center py-2">
            ← → para mover · Espaço ou ↑ para pular · Colete todas as 🍓 e pegue o 💍
          </p>
        )}
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Confetti Canvas
// ═══════════════════════════════════════════════════════════════

function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;

    const confetti: { x: number; y: number; vx: number; vy: number; r: number; color: string; rot: number }[] = [];
    const colors = ["#C9A84C", "#6B7FD4", "#E84057", "#4CAF50", "#D6E4F7", "#F5D0A9"];

    for (let i = 0; i < 80; i++) {
      confetti.push({
        x: Math.random() * W,
        y: -Math.random() * H,
        vx: (Math.random() - 0.5) * 3,
        vy: Math.random() * 3 + 1,
        r: Math.random() * 5 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rot: Math.random() * Math.PI * 2,
      });
    }

    let raf: number;
    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      for (const c of confetti) {
        c.x += c.vx;
        c.y += c.vy;
        c.rot += 0.05;
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rot);
        ctx.fillStyle = c.color;
        ctx.fillRect(-c.r, -c.r / 2, c.r * 2, c.r);
        ctx.restore();
        if (c.y > H) c.y = -10;
      }
      raf = requestAnimationFrame(animate);
    }
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
