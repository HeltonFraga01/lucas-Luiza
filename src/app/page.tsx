import HeroWrapper from "@/components/canvas/HeroWrapper";
import OurStory from "@/components/sections/OurStory";
import Itinerary from "@/components/sections/Itinerary";
import RsvpWizard from "@/components/rsvp/RsvpWizard";
import GiftRegistry from "@/components/registry/GiftRegistry";
import { prisma } from "@/lib/prisma";

// ═══════════════════════════════════════════════════════════════
// Footer Component (uses settings from parent)
// ═══════════════════════════════════════════════════════════════

function Footer({
  heroTitle,
  heroSubtitle,
  footerText,
}: {
  heroTitle?: string;
  heroSubtitle?: string;
  footerText?: string;
}) {
  return (
    <footer className="w-full py-10 bg-parchment border-t border-dust">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <p className="font-display italic text-lg text-navy-deep mb-2">
          {heroTitle || "Luiza & Lucas"}
        </p>
        <p className="text-xs text-stone font-sans">
          {heroSubtitle || "15 de Novembro de 2026"} · {footerText || "Feito com 💙"}
        </p>
        <p className="text-[10px] text-stone/40 font-sans mt-4">
          © 2026 Aeterna — Wedding Experience
        </p>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════════
// Page (Server Component — Story 7.2: data fetch + code-split)
// ═══════════════════════════════════════════════════════════════

export default async function Home() {
  const [settings, timeline, events] = await Promise.all([
    prisma.siteSettings.findFirst(),
    prisma.storyTimeline.findMany({ orderBy: { order: "asc" } }),
    prisma.event.findMany({ orderBy: { order: "asc" } }),
  ]);

  // Transform dates to ISO strings (avoid Next.js serialization issues)
  const plainSettings = settings
    ? {
        ...settings,
        weddingDate: settings.weddingDate?.toISOString() || null,
        updatedAt: settings.updatedAt?.toISOString() || null,
      }
    : undefined;

  const plainTimeline = timeline.map((item) => ({
    ...item,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  }));

  const plainEvents = events.map((e) => ({
    ...e,
    datetime: e.datetime.toISOString(),
  }));

  return (
    <main className="flex min-h-screen flex-col bg-parchment">
      <HeroWrapper settings={plainSettings} />
      <OurStory settings={plainSettings} timeline={plainTimeline} />
      <Itinerary events={plainEvents} settings={plainSettings} />
      <RsvpWizard />
      <GiftRegistry />
      <Footer
        heroTitle={plainSettings?.heroTitle}
        heroSubtitle={plainSettings?.heroSubtitle}
        footerText={plainSettings?.footerText}
      />
    </main>
  );
}
