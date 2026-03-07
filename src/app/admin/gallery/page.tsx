import { prisma } from "@/lib/prisma";
import GalleryAdminPanel from "./GalleryAdminPanel";

export default async function AdminGalleryPage() {
  const photos = await prisma.galleryPhoto.findMany({
    orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
  });

  const plainPhotos = photos.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
  }));

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
