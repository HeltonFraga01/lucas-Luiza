"use client";

import { useState, useRef } from "react";
import { toast } from "@/components/ui/Toast";

interface Photo {
  id: number;
  url: string;
  caption: string | null;
  category: string;
  width: number;
  height: number;
  featured: boolean;
  createdAt: string;
}

const CATEGORIES = [
  { value: "geral", label: "Geral" },
  { value: "pre-wedding", label: "Pré-Wedding" },
  { value: "noivado", label: "Noivado" },
  { value: "ensaio", label: "Ensaio" },
];

const inputCls =
  "p-3 rounded-lg border border-dust bg-parchment focus:ring-2 focus:ring-cornflower outline-none text-charcoal";

export default function GalleryAdminPanel({ initialPhotos }: { initialPhotos: Photo[] }) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("geral");
  const [featured, setFeatured] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const multiFileRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File): Promise<Photo | null> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("preset", "hero");

      const uploadRes = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (!uploadRes.ok) {
        const err = await uploadRes.json();
        throw new Error(err.error || "Falha no upload");
      }
      const uploadData = await uploadRes.json();

      const galleryRes = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: uploadData.url,
          caption,
          category,
          width: uploadData.width,
          height: uploadData.height,
          featured,
        }),
      });
      if (!galleryRes.ok) throw new Error("Falha ao salvar na galeria");
      return await galleryRes.json();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      toast(msg, "error");
      return null;
    }
  };

  const handleSingleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const photo = await uploadFile(file);
    if (photo) {
      setPhotos([photo, ...photos]);
      setCaption("");
      setFeatured(false);
      toast("Foto adicionada com sucesso!", "success");
    }
    setUploading(false);
    e.target.value = "";
  };

  const handleBatchUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    const results: Photo[] = [];
    for (const file of Array.from(files)) {
      const photo = await uploadFile(file);
      if (photo) results.push(photo);
    }
    if (results.length > 0) {
      setPhotos([...results, ...photos]);
      toast(`${results.length} foto(s) adicionada(s)!`, "success");
    }
    setUploading(false);
    e.target.value = "";
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/gallery?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Falha ao remover");
      setPhotos(photos.filter((p) => p.id !== id));
      toast("Foto removida", "success");
    } catch {
      toast("Erro ao remover foto", "error");
    }
  };

  const toggleFeatured = async (photo: Photo) => {
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: photo.id, featured: !photo.featured }),
      });
      if (!res.ok) throw new Error();
      setPhotos(photos.map((p) => (p.id === photo.id ? { ...p, featured: !p.featured } : p)));
    } catch {
      toast("Erro ao atualizar", "error");
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Upload Section */}
      <div className="bg-pearl border border-dust rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-medium text-charcoal mb-1">Adicionar Fotos</h2>
        <p className="text-xs text-stone mb-5">
          Envie uma foto com detalhes ou faça upload em lote.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-charcoal">Legenda (opcional)</label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Ex: Nosso primeiro pôr do sol juntos"
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-charcoal">Categoria</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputCls}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>

        <label className="flex items-center gap-3 mb-5 cursor-pointer">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm text-charcoal">Marcar como destaque</span>
        </label>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-5 py-3 bg-charcoal text-pearl rounded-xl font-medium hover:bg-charcoal/80 transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-2 text-sm"
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-pearl border-t-transparent rounded-full animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar Foto"
            )}
          </button>

          <button
            onClick={() => multiFileRef.current?.click()}
            disabled={uploading}
            className="px-5 py-3 border border-dust text-charcoal rounded-xl font-medium hover:bg-sky-wash transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-2 text-sm"
          >
            Upload em Lote
          </button>
        </div>

        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={handleSingleUpload} className="hidden" />
        <input ref={multiFileRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple onChange={handleBatchUpload} className="hidden" />
      </div>

      {/* Photos Grid */}
      <div className="bg-pearl border border-dust rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-medium text-charcoal">Fotos na Galeria</h2>
            <p className="text-xs text-stone">{photos.length} foto(s)</p>
          </div>
        </div>

        {photos.length === 0 ? (
          <div className="py-12 text-center border border-dust border-dashed rounded-xl">
            <p className="text-3xl opacity-30 mb-2">📷</p>
            <p className="text-stone text-sm">Nenhuma foto na galeria.</p>
            <p className="text-stone/60 text-xs mt-1">Use os botões acima para adicionar fotos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="relative group rounded-xl overflow-hidden border border-dust"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt={photo.caption || "Foto"}
                  className="w-full aspect-square object-cover"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleFeatured(photo)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs cursor-pointer transition-colors ${
                        photo.featured
                          ? "bg-yellow-400 text-charcoal"
                          : "bg-white/20 text-white hover:bg-white/40"
                      }`}
                      title={photo.featured ? "Remover destaque" : "Marcar destaque"}
                    >
                      ⭐
                    </button>
                    <button
                      onClick={() => handleDelete(photo.id)}
                      className="w-8 h-8 rounded-full bg-red-500/80 text-white hover:bg-red-500 flex items-center justify-center text-xs cursor-pointer transition-colors"
                      title="Remover foto"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {/* Bottom label */}
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-linear-to-t from-black/50 to-transparent">
                  <div className="flex items-center gap-1.5">
                    {photo.featured && (
                      <span className="text-[9px] bg-yellow-400 text-charcoal px-1.5 py-0.5 rounded font-bold">★</span>
                    )}
                    <span className="text-[9px] text-white/80 font-medium">
                      {CATEGORIES.find((c) => c.value === photo.category)?.label || photo.category}
                    </span>
                  </div>
                  {photo.caption && (
                    <p className="text-[10px] text-white/60 truncate mt-0.5">{photo.caption}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
