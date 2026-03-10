import { prisma } from "@/lib/prisma";
import AccommodationsAdminPanel from "./AccommodationsAdminPanel";

export const dynamic = "force-dynamic";

export default async function AccommodationsAdminPage() {
  type PlainAccommodation = {
    id: number;
    name: string;
    description: string | null;
    imageUrl: string | null;
    externalUrl: string | null;
    pricePerNight: number | null;
    city: string | null;
    category: string;
    whatsapp: string | null;
    featured: boolean;
    hidden: boolean;
    order: number;
    createdAt: string;
  };

  let items: PlainAccommodation[] = [];

  try {
    const raw = await prisma.accommodation.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    items = raw.map((a) => ({
      id: a.id,
      name: a.name,
      description: a.description,
      imageUrl: a.imageUrl,
      externalUrl: a.externalUrl,
      pricePerNight: a.pricePerNight,
      city: a.city,
      category: a.category,
      whatsapp: a.whatsapp,
      featured: a.featured,
      hidden: a.hidden,
      order: a.order,
      createdAt: a.createdAt.toISOString(),
    }));
  } catch {
    // DB not available at build time
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-serif text-charcoal">Onde Ficar</h1>
        <p className="text-stone mt-2">
          Adicione sugestões de hospedagem via link do Airbnb ou Booking.com.
        </p>
      </div>
      <AccommodationsAdminPanel initialItems={items} />
    </div>
  );
}
