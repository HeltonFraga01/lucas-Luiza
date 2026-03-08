import { prisma } from "@/lib/prisma";
import RegistryAdminPanel from "./RegistryAdminPanel";

export const dynamic = "force-dynamic";

export default async function RegistryAdminPage() {
  type PlainGift = {
    id: number;
    title: string;
    description: string | null;
    imageUrl: string | null;
    externalUrl: string | null;
    price: number;
    category: string;
    isMostWanted: boolean;
    isGroupGift: boolean;
    targetAmount: number | null;
    raisedAmount: number;
    isPurchased: boolean;
    hidden: boolean;
    createdAt: string;
  };

  let gifts: PlainGift[] = [];

  try {
    const raw = await prisma.giftItem.findMany({ orderBy: { createdAt: "desc" } });
    gifts = raw.map((g) => ({
      id: g.id,
      title: g.title,
      description: g.description,
      imageUrl: g.imageUrl,
      externalUrl: g.externalUrl,
      price: g.price,
      category: g.category,
      isMostWanted: g.isMostWanted,
      isGroupGift: g.isGroupGift,
      targetAmount: g.targetAmount,
      raisedAmount: g.raisedAmount,
      isPurchased: g.isPurchased,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      hidden: (g as any).hidden ?? false,
      createdAt: g.createdAt.toISOString(),
    }));
  } catch {
    // DB not available at build time
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-serif text-charcoal">Lista de Presentes</h1>
        <p className="text-stone mt-2">Adicione itens via link de qualquer loja do mundo (Scraping) e acompanhe a arrecadação.</p>
      </div>

      <RegistryAdminPanel initialGifts={gifts} />
    </div>
  );
}
