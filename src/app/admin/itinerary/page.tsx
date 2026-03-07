import { prisma } from "@/lib/prisma";
import ItineraryAdminPanel from "./ItineraryAdminPanel";

export const dynamic = "force-dynamic";

export default async function AdminItineraryPage() {
  let events: Awaited<ReturnType<typeof prisma.event.findMany>> = [];
  let settings: Awaited<ReturnType<typeof prisma.siteSettings.findFirst>> = null;

  try {
    [events, settings] = await Promise.all([
      prisma.event.findMany({ orderBy: { datetime: "asc" } }),
      prisma.siteSettings.findFirst(),
    ]);
  } catch {
    // DB not available at build time
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-serif text-zinc-900 dark:text-zinc-100">Itinerário</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-2">Gerencie os eventos do casamento e determine a visibilidade para convidados VIPs.</p>
      </div>

      <ItineraryAdminPanel
        initialEvents={events}
        initialTitle={settings?.itineraryTitle ?? "Programação do Dia"}
        initialSubtitle={settings?.itinerarySubtitle ?? "Cada momento foi pensado com carinho para que todos aproveitem ao máximo este dia especial."}
      />
    </div>
  );
}

