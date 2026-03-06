"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Text, Float, Sparkles } from "@react-three/drei";
import { Suspense, useRef, useState, useEffect, useMemo } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

function Scene({ title, subtitle, color }: { title: string, subtitle: string, color: string }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  return (
    <group ref={group}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Text
          fontSize={1.5}
          font="/fonts/Geist-Medium.ttf" // We will use fallback if not found
          position={[0, 0, 0]}
          color="#1a1a1a" // Dark elegant color
          anchorX="center"
          anchorY="middle"
          material-toneMapped={false}
        >
          {title}
        </Text>
        <Text
          fontSize={0.4}
          position={[0, -1.2, 0]}
          color="#4a4a4a"
          anchorX="center"
          anchorY="middle"
        >
          {subtitle}
        </Text>
      </Float>
      
      {/* Decorative environment */}
      <Sparkles count={100} scale={10} size={2} speed={0.4} opacity={0.3} color={color} />
    </group>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function HeroScene({ settings }: { settings?: any }) {
  const title = settings?.heroTitle || "Lucas & Luiza";
  const subtitle = settings?.heroSubtitle || "20 de Setembro, 2026";
  const primaryColor = settings?.primaryColor || "#d4af37";
  
  const images = useMemo(() => {
    if (settings?.heroImages) {
      try {
        const parsed = JSON.parse(settings.heroImages);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // Fallback
      }
    }
    return settings?.heroImage ? [settings.heroImage] : ["/hero-bg.jpg"];
  }, [settings?.heroImage, settings?.heroImages]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000); // Change image every 5 seconds
    
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div id="hero" className="h-screen w-full relative bg-zinc-50  overflow-hidden">
      
      {/* Background Slider */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url(${images[currentIndex]})` }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-white/50  z-0"></div>
      <Canvas
        className="z-10 relative"
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]} // Optimize for retina displays
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Environment preset="city" />
          <Scene title={title} subtitle={subtitle} color={primaryColor} />
        </Suspense>
      </Canvas>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <p className="text-sm uppercase tracking-widest text-zinc-500">Role para baixo</p>
        <div className="w-px h-12 bg-zinc-300 "></div>
      </div>
    </div>
  );
}
