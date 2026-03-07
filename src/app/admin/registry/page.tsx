import { prisma } from "@/lib/prisma";
import RegistryAdminPanel from "./RegistryAdminPanel";

export const dynamic = "force-dynamic";

export default async function RegistryAdminPage() {
  let gifts: Awaited<ReturnType<typeof prisma.giftItem.findMany>> = [];

  try {
    gifts = await prisma.giftItem.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    // DB not available at build time
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-serif text-zinc-900 dark:text-zinc-100">Lista de Presentes</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-2">Adicione itens via link de qualquer loja do mundo (Scraping) e acompanhe a arrecadação.</p>
      </div>

      <RegistryAdminPanel initialGifts={gifts} />
    </div>
  );
}

