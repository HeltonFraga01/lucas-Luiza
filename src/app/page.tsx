import HeroScene from "@/components/canvas/HeroScene";
import OurStory from "@/components/sections/OurStory";
import RsvpWizard from "@/components/rsvp/RsvpWizard";
import GiftRegistry from "@/components/registry/GiftRegistry";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const settings = await prisma.siteSettings.findFirst();
  const timeline = await prisma.storyTimeline.findMany({
    orderBy: { order: 'asc' }
  });
  
  // Transform to plain object to pass to client components (avoiding Date serialization issues)
  const plainSettings = settings ? {
    ...settings,
    updatedAt: settings.updatedAt.toISOString(),
  } : undefined;

  const plainTimeline = timeline.map(item => ({
    ...item,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  }));

  return (
    <main 
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: plainSettings?.secondaryColor || '#eaf2fa' }}
    >
      <HeroScene settings={plainSettings} />
      <OurStory settings={plainSettings} timeline={plainTimeline} />
      <RsvpWizard />
      <GiftRegistry />
    </main>
  );
}
