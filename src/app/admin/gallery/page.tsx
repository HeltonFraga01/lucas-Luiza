import { prisma } from "@/lib/prisma";
import GalleryAdminPanel from "./GalleryAdminPanel";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  type PlainPhoto = {
    id: number;
    url: string;
    caption: string | null;
    category: string;
    width: number;
    height: number;
    featured: boolean;
    createdAt: string;
  };

  let plainPhotos: PlainPhoto[] = [];

  try {
    const photos = await prisma.galleryPhoto.findMany({
      orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
    });
    plainPhotos = photos.map((p) => ({
      id: p.id,
      url: p.url,
      caption: p.caption,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      category: (p as any).category ?? "geral",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      width: (p as any).width ?? 0,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      height: (p as any).height ?? 0,
      featured: p.featured,
      createdAt: p.createdAt.toISOString(),
    }));
  } catch {
    // DB not available at build time — render with empty list
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-serif text-zinc-900 dark:text-zinc-100">Galeria</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-2">
          Gerencie as fotos da galeria pública do casal.
        </p>
      </div>

      <GalleryAdminPanel initialPhotos={plainPhotos} />
    </div>
  );
}
