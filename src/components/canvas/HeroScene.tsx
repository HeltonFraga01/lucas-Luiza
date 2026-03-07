"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import { Suspense, useRef, useCallback, lazy } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const MiniGame = lazy(() => import("@/components/canvas/MiniGame"));

// ═══════════════════════════════════════════════════════════════
// Particle generation (outside component to avoid impure render)
// ═══════════════════════════════════════════════════════════════

function generateParticles(count: number) {
  const pos = new Float32Array(count * 3);
  const vel = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 12;
    pos[i * 3 + 1] = Math.random() * 8 - 2;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
    vel[i * 3] = (Math.random() - 0.5) * 0.003;
    vel[i * 3 + 1] = -Math.random() * 0.005 - 0.002;
    vel[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
  }
  return { positions: pos, velocities: vel };
}

// ═══════════════════════════════════════════════════════════════
// Story 2.1: Partículas com gravidade e reação ao mouse
// ═══════════════════════════════════════════════════════════════

function Particles({ count = 80, color = "#6B7FD4" }: { count?: number; color?: string }) {
  const mesh = useRef<THREE.Points>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const dataRef = useRef(generateParticles(count));

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(() => {
    if (!mesh.current) return;
    const geo = mesh.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    const { velocities } = dataRef.current;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      arr[ix] += velocities[ix];
      arr[iy] += velocities[iy];
      arr[iz] += velocities[iz];

      const dx = mouse.current.x * 5 - arr[ix];
      const dy = mouse.current.y * 4 - arr[iy];
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 3) {
        const force = 0.0003 / (dist + 0.5);
        arr[ix] += dx * force;
        arr[iy] += dy * force;
      }

      if (arr[iy] < -5) {
        arr[iy] = 5 + Math.random() * 3;
        arr[ix] = (Math.random() - 0.5) * 12;
        arr[iz] = (Math.random() - 0.5) * 6;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[dataRef.current.positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color={color}
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ═══════════════════════════════════════════════════════════════
// Camera that follows mouse (parallax)
// ═══════════════════════════════════════════════════════════════

function CameraRig() {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 0 });
  const cameraRef = useRef(camera);
  cameraRef.current = camera;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 0.5;
      target.current.y = (e.clientY / window.innerHeight - 0.5) * -0.3;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(() => {
    const cam = cameraRef.current;
    cam.position.x += (target.current.x - cam.position.x) * 0.02;
    cam.position.y += (target.current.y - cam.position.y) * 0.02;
    cam.lookAt(0, 0, 0);
  });

  return null;
}

// ═══════════════════════════════════════════════════════════════
// 3D Scene
// ═══════════════════════════════════════════════════════════════

function Scene({ color }: { color: string }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={0.8} />
      <CameraRig />
      <Particles count={80} color={color} />
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <Sparkles
          count={60}
          scale={10}
          size={1.5}
          speed={0.3}
          opacity={0.25}
          color={color}
        />
      </Float>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// Story 2.2: Countdown Component
// ═══════════════════════════════════════════════════════════════

function Countdown({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));
  const [isToday, setIsToday] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) {
        setIsToday(true);
        clearInterval(interval);
      } else {
        setTimeLeft(calculateTimeLeft(targetDate));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (isToday) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <p className="font-serif text-xl md:text-2xl text-gold-leaf animate-pulse">
          🎉 O grande dia chegou!
        </p>
      </motion.div>
    );
  }

  return (
    <div className="flex items-center gap-3 md:gap-6">
      {([
        { value: timeLeft.days, label: "dias" },
        { value: timeLeft.hours, label: "horas" },
        { value: timeLeft.minutes, label: "min" },
        { value: timeLeft.seconds, label: "seg" },
      ] as const).map((unit, i) => (
        <div key={unit.label} className="flex items-center gap-3 md:gap-6">
          <div className="flex flex-col items-center">
            <span className="font-serif text-2xl md:text-4xl font-medium text-navy-deep tabular-nums">
              {String(unit.value).padStart(2, "0")}
            </span>
            <span className="text-[10px] md:text-xs text-stone uppercase tracking-widest font-sans mt-1">
              {unit.label}
            </span>
          </div>
          {i < 3 && (
            <span className="text-xl md:text-2xl text-dust font-light select-none">·</span>
          )}
        </div>
      ))}
    </div>
  );
}

function calculateTimeLeft(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

// ═══════════════════════════════════════════════════════════════
// Main HeroScene Component
// ═══════════════════════════════════════════════════════════════

interface HeroSettings {
  heroTitle?: string;
  heroSubtitle?: string;
  primaryColor?: string;
  heroImage?: string;
  heroImages?: string;
  secondaryColor?: string;
  weddingDate?: string;
  secretMessage?: string;
  [key: string]: unknown;
}

export default function HeroScene({ settings }: { settings?: HeroSettings }) {
  const title = settings?.heroTitle || "Luiza & Lucas";
  const subtitle = settings?.heroSubtitle || "16 de Maio de 2026";
  const primaryColor = settings?.primaryColor || "#6B7FD4";

  // Wedding date from settings or fallback
  const weddingDate = settings?.weddingDate
    ? new Date(settings.weddingDate)
    : new Date(2026, 10, 15, 16, 0, 0);
  const secretMessage = settings?.secretMessage || "";

  // Background images carousel
  const [images, setImages] = useState<string[]>(["/hero-bg.jpg"]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showGame, setShowGame] = useState(false);

  useEffect(() => {
    if (settings?.heroImages) {
      try {
        const parsed = JSON.parse(settings.heroImages);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setImages(parsed);
          return;
        }
      } catch { /* fallback */ }
    }
    if (settings?.heroImage) {
      setImages([settings.heroImage]);
    }
  }, [settings?.heroImage, settings?.heroImages]);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [images.length]);

  const handleScrollDown = useCallback(() => {
    const next = document.getElementById("historia");
    next?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden">
      {/* ── Background Image Carousel ─────────────────────── */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${images[currentIndex]})` }}
        />
      </AnimatePresence>

      {/* ── Gradient Overlay (sky-wash → parchment) ───────── */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            to bottom,
            rgba(235, 243, 252, 0.65) 0%,
            rgba(248, 245, 240, 0.70) 50%,
            rgba(248, 245, 240, 0.85) 100%
          )`,
        }}
      />

      {/* ── Watercolor Overlays ───────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 30% 40%, rgba(107,127,212,0.12) 0%, transparent 60%)" }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 70% 60%, rgba(214,228,247,0.20) 0%, transparent 55%)" }}
      />

      {/* ── R3F Canvas ────────────────────────────────────── */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          style={{ pointerEvents: "auto" }}
        >
          <Suspense fallback={null}>
            <Scene color={primaryColor} />
          </Suspense>
        </Canvas>
      </div>

      {/* ── Content Overlay ───────────────────────────────── */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 pointer-events-none">
        {/* Couple Names */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="font-display italic font-light text-navy-deep text-center leading-none mb-4
                     text-5xl md:text-7xl lg:text-8xl"
          style={{ textShadow: "0 2px 40px rgba(248,245,240,0.8)" }}
        >
          {title}
        </motion.h1>

        {/* Date */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
          className="font-serif text-lg md:text-xl text-stone tracking-wider mb-8"
        >
          {subtitle}
        </motion.p>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.9 }}
        >
          <div className="bg-parchment/80 backdrop-blur-sm rounded-2xl px-6 py-4 md:px-10 md:py-5 shadow-card mb-4">
            <Countdown targetDate={weddingDate} />
          </div>
        </motion.div>

        {/* Mini-Game Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 1.0 }}
          onClick={() => setShowGame(true)}
          className="pointer-events-auto mb-6 px-5 py-2 text-xs font-sans font-medium text-stone/70
                     bg-pearl/40 backdrop-blur-sm rounded-pill border border-dust/50
                     hover:bg-pearl/70 hover:text-cornflower hover:border-cornflower/30
                     transition-all duration-300 cursor-pointer"
        >
          🎮 Desbloqueie uma surpresa
        </motion.button>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 1.2 }}
          className="flex flex-col sm:flex-row items-center gap-3 pointer-events-auto"
        >
          <a
            href="#rsvp"
            style={{ color: '#ffffff' }}
            className="inline-flex items-center justify-center gap-2
                       px-8 py-3.5 min-h-12
                       bg-cornflower font-sans font-semibold text-sm tracking-wide
                       rounded-pill shadow-sm hover:bg-cornflower-600 hover:shadow-md
                       transition-all duration-300 active:scale-[0.98]"
          >
            Confirmar Presença →
          </a>
          <a
            href="#presentes"
            className="inline-flex items-center justify-center gap-2
                       px-8 py-3.5 min-h-12
                       bg-transparent text-cornflower font-sans font-medium text-sm tracking-wide
                       border-[1.5px] border-cornflower rounded-pill
                       hover:bg-ice-blue transition-all duration-300 active:scale-[0.98]"
          >
            Ver Presentes
          </a>
          <a
            href="/galeria"
            className="inline-flex items-center justify-center gap-2
                       px-8 py-3.5 min-h-12
                       bg-transparent text-cornflower font-sans font-medium text-sm tracking-wide
                       border-[1.5px] border-cornflower rounded-pill
                       hover:bg-ice-blue transition-all duration-300 active:scale-[0.98]"
          >
            Galeria
          </a>
        </motion.div>
      </div>

      {/* ── Scroll Indicator ──────────────────────────────── */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        onClick={handleScrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2
                   text-stone/60 hover:text-stone transition-colors cursor-pointer"
        aria-label="Rolar para baixo"
      >
        <span className="text-[10px] uppercase tracking-[0.25em] font-sans">Descubra mais</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-10 bg-linear-to-b from-stone/40 to-transparent"
        />
      </motion.button>

      {/* Mini-Game Modal */}
      <AnimatePresence>
        {showGame && (
          <Suspense fallback={null}>
            <MiniGame onClose={() => setShowGame(false)} secretMessage={secretMessage} />
          </Suspense>
        )}
      </AnimatePresence>
    </section>
  );
}
