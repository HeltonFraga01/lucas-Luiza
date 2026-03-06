"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const HeroScene = dynamic(() => import("@/components/canvas/HeroScene"), {
  ssr: false,
  loading: () => (
    <section className="relative h-screen w-full bg-parchment flex items-center justify-center">
      <div className="text-center">
        <p className="font-display italic text-4xl md:text-6xl text-navy-deep opacity-60 animate-pulse">
          Luiza & Lucas
        </p>
      </div>
    </section>
  ),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function HeroWrapper({ settings }: { settings?: Record<string, any> }) {
  return (
    <Suspense>
      <HeroScene settings={settings} />
    </Suspense>
  );
}
