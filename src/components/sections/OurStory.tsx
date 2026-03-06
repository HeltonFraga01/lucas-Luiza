"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

// ═══════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════

interface TimelineItem {
  id?: number;
  year: string;
  title: string;
  description: string;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface OurStorySettings {
  storyText?: string;
  storyImage?: string;
  [key: string]: unknown;
}

// ═══════════════════════════════════════════════════════════════
// Default Timeline (fallback when DB is empty)
// ═══════════════════════════════════════════════════════════════

const defaultTimeline: TimelineItem[] = [
  {
    year: "2019",
    title: "O Primeiro Match",
    description:
      "Um like despreocupado, uma conversa que não acabava mais. O universo conspirou ali, num match que mudaria tudo.",
  },
  {
    year: "2019",
    title: "O Primeiro Encontro",
    description:
      "Café, risos nervosos e a sensação de que o tempo voou. Saímos sabendo que seria diferente.",
  },
  {
    year: "2021",
    title: "Começamos a Morar Juntos",
    description:
      "Um apartamento pequeno, sonhos grandes. O lar foi nascendo entre caixas de mudança e playlists compartilhadas.",
  },
  {
    year: "2024",
    title: "O Pedido",
    description:
      "De joelhos, com o coração acelerado. Um 'sim' que ecoou pela eternidade. ✦",
  },
  {
    year: "2026",
    title: "O Grande Dia",
    description:
      "16 de Maio de 2026 — o dia em que celebramos diante de todos o amor que construímos juntos.",
  },
];

// ═══════════════════════════════════════════════════════════════
// OurStory Component
// ═══════════════════════════════════════════════════════════════

export default function OurStory({
  settings,
  timeline,
}: {
  settings?: OurStorySettings;
  timeline?: TimelineItem[];
}) {
  const containerRef = useRef<HTMLElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const eventRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);

  const items = timeline && timeline.length > 0 ? timeline : defaultTimeline;

  // ── GSAP ScrollTrigger Animations ───────────────────────
  useGSAP(
    () => {
      // 1. Progress line grows as you scroll
      if (progressLineRef.current && containerRef.current) {
        gsap.fromTo(
          progressLineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 60%",
              end: "bottom 80%",
              scrub: 1,
            },
          }
        );
      }

      // 2. Each event slides in from alternating sides
      eventRefs.current.forEach((el, index) => {
        if (!el) return;
        const isLeft = index % 2 === 0;

        gsap.fromTo(
          el,
          {
            opacity: 0,
            x: isLeft ? -60 : 60,
            y: 20,
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // 3. Images: blur → focus
      imageRefs.current.forEach((el) => {
        if (!el) return;

        gsap.fromTo(
          el,
          { filter: "blur(8px)", scale: 0.95, opacity: 0.5 },
          {
            filter: "blur(0px)",
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // 4. Timeline dots pulse when visible
      dotRefs.current.forEach((el) => {
        if (!el) return;

        gsap.fromTo(
          el,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: "back.out(2)",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      id="historia"
      ref={containerRef}
      className="relative w-full py-20 md:py-32 bg-parchment"
    >
      {/* ── Section Header ──────────────────────────────── */}
      <div className="text-center px-6 mb-16 md:mb-24">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-display italic font-light text-navy-deep mb-4"
        >
          Nossa História
        </motion.h2>

        {/* Bible verse / subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="font-serif text-stone italic max-w-md mx-auto"
        >
          &quot;Nós amamos porque ELE nos amou primeiro.&quot;
          <span className="block text-sm mt-1 not-italic text-dust">— João 4:19</span>
        </motion.p>
      </div>

      {/* ── Story Text + Image (from settings) ──────────── */}
      {(settings?.storyText || settings?.storyImage) && (
        <div className="max-w-4xl mx-auto px-6 mb-20 md:mb-32">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {settings?.storyImage && (
              <div
                ref={(el) => { imageRefs.current[imageRefs.current.length] = el; }}
                className="w-full md:w-1/2 aspect-square md:aspect-4/3 rounded-2xl overflow-hidden shadow-hover"
              >
                <Image
                  src={settings.storyImage}
                  alt="Nossa História"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            )}
            {settings?.storyText && (
              <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
                <p className="text-stone text-lg leading-relaxed whitespace-pre-wrap font-sans">
                  {settings.storyText}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Timeline ────────────────────────────────────── */}
      <div className="relative max-w-5xl mx-auto px-6">
        {/* Section title */}
        <motion.h3
          id="momentos"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-serif text-center text-charcoal mb-16 md:mb-20"
        >
          Grandes Momentos
        </motion.h3>

        {/* Central line (background track) */}
        <div className="absolute left-6 md:left-1/2 top-[140px] bottom-[80px] w-px bg-dust md:-translate-x-1/2" />

        {/* Central line (progress fill) */}
        <div
          ref={progressLineRef}
          className="absolute left-6 md:left-1/2 top-[140px] bottom-[80px] w-px bg-periwinkle md:-translate-x-1/2 origin-top"
          style={{ transform: "scaleY(0)" }}
        />

        {/* Timeline Events */}
        <div className="relative flex flex-col gap-16 md:gap-24">
          {items.map((item, index) => {
            const isLeft = index % 2 === 0;
            const isLast = index === items.length - 1;

            return (
              <div
                key={`${item.year}-${index}`}
                ref={(el) => { eventRefs.current[index] = el; }}
                className={`
                  relative flex flex-col
                  pl-12 md:pl-0
                  ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}
                  items-start md:items-center
                  gap-6 md:gap-12
                `}
              >
                {/* ── Content Side ───────────────────────── */}
                <div
                  className={`
                    w-full md:w-[calc(50%-32px)]
                    ${isLeft ? "md:text-right" : "md:text-left"}
                  `}
                >
                  {/* Year badge */}
                  <div
                    className={`
                      inline-block text-xs font-sans font-semibold tracking-[0.2em] uppercase
                      text-gold-leaf mb-2
                    `}
                  >
                    {item.year}
                  </div>

                  {/* Title */}
                  <h4 className="font-serif text-xl md:text-2xl text-charcoal mb-3">
                    {item.title}
                  </h4>

                  {/* Description */}
                  <p className="text-stone leading-relaxed font-sans text-sm md:text-base max-w-md">
                    {item.description}
                  </p>
                </div>

                {/* ── Timeline Dot ───────────────────────── */}
                <div
                  ref={(el) => { dotRefs.current[index] = el; }}
                  className={`
                    absolute
                    left-[18px] md:left-1/2 md:-translate-x-1/2
                    top-1
                    w-4 h-4 rounded-full
                    border-[3px] border-parchment
                    ${isLast
                      ? "bg-gold-leaf shadow-[0_0_20px_rgba(201,168,76,0.5)]"
                      : "bg-periwinkle shadow-[0_0_15px_rgba(107,127,212,0.3)]"
                    }
                    z-10
                  `}
                />

                {/* ── Empty Side (for balance on desktop) ── */}
                <div className="hidden md:block w-[calc(50%-32px)]" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
