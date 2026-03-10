"use client";

import { useEffect, useRef, useState } from "react";

/**
 * MusicPlayer — player de música ambiente discreto.
 *
 * - O arquivo de áudio só é carregado (lazy) após a primeira
 *   interação do usuário (scroll, click ou touch), respeitando
 *   as políticas de autoplay dos navegadores.
 * - Fade-in de 3s para entrada suave.
 * - Botão fixo discreto no canto inferior esquerdo.
 */
export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false); // áudio foi inicializado
  const interacted = useRef(false);
  const fadeTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fade-in: aumenta volume de 0 → 0.6 em ~3 segundos
  const fadeIn = (audio: HTMLAudioElement) => {
    audio.volume = 0;
    let vol = 0;
    fadeTimer.current = setInterval(() => {
      vol = Math.min(vol + 0.03, 0.6);
      audio.volume = vol;
      if (vol >= 0.6 && fadeTimer.current) {
        clearInterval(fadeTimer.current);
      }
    }, 90);
  };

  const startAudio = () => {
    if (interacted.current) return;
    interacted.current = true;

    // Cria o elemento de áudio apenas agora (lazy)
    const audio = new Audio("/audio/background.mp3");
    audio.loop = true;
    audio.preload = "auto";
    audioRef.current = audio;

    audio.addEventListener("canplaythrough", () => {
      setReady(true);
    });

    audio
      .play()
      .then(() => {
        setPlaying(true);
        fadeIn(audio);
      })
      .catch(() => {
        // Autoplay bloqueado — usuário terá que clicar manualmente
        setReady(true);
      });
  };

  const toggle = () => {
    const audio = audioRef.current;

    if (!audio) {
      // Primeira vez pelo botão (sem scroll anterior)
      startAudio();
      return;
    }

    if (playing) {
      if (fadeTimer.current) clearInterval(fadeTimer.current);
      audio.pause();
      setPlaying(false);
    } else {
      audio
        .play()
        .then(() => {
          setPlaying(true);
          fadeIn(audio);
        })
        .catch(() => {});
    }
  };

  useEffect(() => {
    // Tenta autoplay imediato; se bloqueado pelo navegador,
    // aguarda primeira interação do usuário
    const tryAutoplay = async () => {
      if (interacted.current) return;
      interacted.current = true;

      const audio = new Audio("/audio/background.mp3");
      audio.loop = true;
      audio.preload = "auto";
      audioRef.current = audio;

      audio.addEventListener("canplaythrough", () => setReady(true));

      try {
        await audio.play();
        setPlaying(true);
        fadeIn(audio);
      } catch {
        // Autoplay bloqueado — aguarda interação
        interacted.current = false;
        audioRef.current = null;
        const onInteract = () => startAudio();
        window.addEventListener("scroll", onInteract, { once: true, passive: true });
        window.addEventListener("click", onInteract, { once: true });
        window.addEventListener("touchstart", onInteract, { once: true, passive: true });
      }
    };

    tryAutoplay();

    return () => {
      if (fadeTimer.current) clearInterval(fadeTimer.current);
      audioRef.current?.pause();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <button
      onClick={toggle}
      aria-label={playing ? "Pausar música" : "Tocar música"}
      title={playing ? "Pausar música" : "Tocar música"}
      className={`
        fixed bottom-6 right-6 z-40
        w-10 h-10 rounded-full
        bg-pearl border border-dust
        flex items-center justify-center
        transition-all duration-300 shadow-md
        hover:scale-110 hover:shadow-lg hover:border-cornflower/60
        ${playing ? "text-cornflower" : "text-stone hover:text-cornflower"}
      `}
    >
      {playing ? (
        <>
          {/* Anel pulsante quando tocando */}
          <span className="absolute inset-0 rounded-full border border-cornflower/40 animate-ping" />
          {/* Ícone de pause */}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <rect x="2" y="1" width="4" height="12" rx="1" />
            <rect x="8" y="1" width="4" height="12" rx="1" />
          </svg>
        </>
      ) : (
        // Ícone de play
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
          <path d="M3 2.5C3 1.67 3.93 1.17 4.62 1.63l7 4.5c.62.4.62 1.34 0 1.74l-7 4.5C3.93 12.83 3 12.33 3 11.5v-9Z" />
        </svg>
      )}
    </button>
  );
}
