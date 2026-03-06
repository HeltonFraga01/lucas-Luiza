/**
 * Motion Tokens — Aeterna Design System
 * 
 * Centralized animation configuration for Framer Motion & GSAP.
 * Reference: UX Design §2.5 Motion & Animation Tokens
 */

import type { Variants, Transition } from "framer-motion";

// ── Easing Constants ────────────────────────────────────────────
const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];
const EASE_IN_EXPO: [number, number, number, number] = [0.55, 0, 1, 0.45];
const EASE_GENTLE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ── Framer Motion Transitions ───────────────────────────────────
export const transitions = {
  entrance: { duration: 0.8, ease: EASE_OUT_EXPO } satisfies Transition,
  exit: { duration: 0.4, ease: EASE_IN_EXPO } satisfies Transition,
  gentle: { duration: 1.2, ease: EASE_GENTLE } satisfies Transition,
  snap: { duration: 0.25, ease: "easeOut" as const } satisfies Transition,
};

// ── Scroll Reveal Variants ──────────────────────────────────────
export const scrollReveal: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.entrance,
  },
};

// ── Stagger Container ───────────────────────────────────────────
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

// ── Fade In Up (children) ───────────────────────────────────────
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT_EXPO },
  },
};

// ── Scale In (modals, cards) ────────────────────────────────────
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.entrance,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: transitions.exit,
  },
};

// ── Slide variants (RSVP wizard steps) ──────────────────────────
export const slideLeft: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: EASE_OUT_EXPO },
  },
  exit: {
    opacity: 0,
    x: -60,
    transition: { duration: 0.25, ease: EASE_IN_EXPO },
  },
};

export const slideRight: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: EASE_OUT_EXPO },
  },
  exit: {
    opacity: 0,
    x: 60,
    transition: { duration: 0.25, ease: EASE_IN_EXPO },
  },
};

// ── GSAP Defaults ───────────────────────────────────────────────
export const gsapDefaults = {
  scrollReveal: {
    start: "top 85%",
    toggleActions: "play none none reverse" as const,
  },
  blurReveal: {
    from: { opacity: 0, y: 50, filter: "blur(10px)" },
    to: { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "power2.out" },
  },
  imageReveal: {
    from: { filter: "blur(8px)", scale: 0.95 },
    to: { filter: "blur(0px)", scale: 1, duration: 1.2 },
  },
};
