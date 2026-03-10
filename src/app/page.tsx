import HeroWrapper from "@/components/canvas/HeroWrapper";
import OurStory from "@/components/sections/OurStory";
import Itinerary from "@/components/sections/Itinerary";
import RsvpWizard from "@/components/rsvp/RsvpWizard";
import GiftRegistry from "@/components/registry/GiftRegistry";
import MusicPlayer from "@/components/ui/MusicPlayer";
import { prisma } from "@/lib/prisma";

type SiteSettings = NonNullable<Awaited<ReturnType<typeof prisma.siteSettings.findFirst>>>;
type StoryTimeline = Awaited<ReturnType<typeof prisma.storyTimeline.findFirst>>;
type WeddingEvent = Awaited<ReturnType<typeof prisma.event.findFirst>>;

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
          © 2026 FragaCom — Wedding Experience
        </p>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════════
// Page (Server Component — Story 7.2: data fetch + code-split)
// ═══════════════════════════════════════════════════════════════

// Force dynamic rendering — this page fetches DB data at runtime
export const dynamic = "force-dynamic";

export default async function Home() {
  // Wrap in try/catch: during Docker build the DB doesn't exist yet,
  // so we fall back to empty defaults instead of crashing the build.
  let settings: SiteSettings | null = null;
  let timeline: NonNullable<StoryTimeline>[] = [];
  let events: NonNullable<WeddingEvent>[] = [];

  try {
    [settings, timeline, events] = await Promise.all([
      prisma.siteSettings.findFirst(),
      prisma.storyTimeline.findMany({ orderBy: { order: "asc" } }),
      prisma.event.findMany({ orderBy: { order: "asc" } }),
    ]);
  } catch {
    // DB not available at build time — render with defaults
  }

  // Safe date serialization helper
  const safeISOString = (d: unknown): string | null => {
    if (!d) return null;
    try {
      const date = d instanceof Date ? d : new Date(String(d));
      if (isNaN(date.getTime())) return null;
      return date.toISOString();
    } catch {
      return null;
    }
  };

  // Transform dates to ISO strings (avoid Next.js serialization issues)
  const plainSettings = settings
    ? {
        ...settings,
        weddingDate: safeISOString(settings.weddingDate),
        updatedAt: safeISOString(settings.updatedAt),
      }
    : undefined;

  const plainTimeline = timeline.map((item) => ({
    ...item,
    createdAt: safeISOString(item.createdAt) || new Date().toISOString(),
    updatedAt: safeISOString(item.updatedAt) || new Date().toISOString(),
  }));

  const plainEvents = events.map((e) => ({
    ...e,
    datetime: safeISOString(e.datetime) || new Date().toISOString(),
  }));

  return (
    <main className="flex min-h-screen flex-col bg-parchment">
      <HeroWrapper settings={plainSettings} />
      <OurStory settings={plainSettings} timeline={plainTimeline} />
      <Itinerary events={plainEvents} settings={plainSettings} />
      <RsvpWizard />
      <GiftRegistry />
      <MusicPlayer />
      <Footer
        heroTitle={plainSettings?.heroTitle}
        heroSubtitle={plainSettings?.heroSubtitle}
        footerText={plainSettings?.footerText}
      />
    </main>
  );
}
