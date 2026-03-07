import { prisma } from "@/lib/prisma";
import ItineraryAdminPanel from "./ItineraryAdminPanel";

export default async function AdminItineraryPage() {
  const events = await prisma.event.findMany({
    orderBy: { datetime: "asc" }
  });

  const settings = await prisma.siteSettings.findFirst();

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
