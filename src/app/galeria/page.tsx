"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Photo {
  id: number;
  url: string;
  caption: string | null;
  category: string;
  width: number;
  height: number;
  featured: boolean;
}

const CATEGORIES = [
  { key: "todos", label: "Todos" },
  { key: "geral", label: "Geral" },
  { key: "pre-wedding", label: "Pré-Wedding" },
  { key: "noivado", label: "Noivado" },
  { key: "ensaio", label: "Ensaio" },
];

export default function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("todos");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((data) => {
        setPhotos(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered =
    activeCategory === "todos"
      ? photos
      : photos.filter((p) => p.category === activeCategory);

  const openLightbox = (idx: number) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);

  const navigate = useCallback(
    (dir: 1 | -1) => {
      if (lightboxIndex === null) return;
      const next = lightboxIndex + dir;
      if (next >= 0 && next < filtered.length) {
        setLightboxIndex(next);
      }
    },
    [lightboxIndex, filtered.length]
  );

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") navigate(-1);
      if (e.key === "ArrowRight") navigate(1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIndex, navigate]);

  return (
    <main className="min-h-screen bg-parchment">
      {/* ── Header ── */}
      <header className="relative w-full pt-28 pb-16 text-center">
        <div className="absolute inset-0 bg-linear-to-b from-sky-wash via-parchment/80 to-parchment" />
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-sans text-stone/60 hover:text-cornflower
                       transition-colors mb-8 group"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
            Voltar ao Site
          </Link>

          <h1 className="font-display italic text-4xl md:text-6xl text-navy-deep mb-4">
            Nossa Galeria
          </h1>
          <p className="text-stone/70 font-sans text-sm md:text-base max-w-lg mx-auto leading-relaxed">
            Momentos que contam a nossa história. Cada foto carrega uma memória
            especial que queremos compartilhar com você.
          </p>
        </div>
      </header>

      {/* ── Category Filter ── */}
      <div className="max-w-6xl mx-auto px-6 mb-10">
        <div className="flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 text-xs font-sans font-medium rounded-pill transition-all duration-200 cursor-pointer
                ${
                  activeCategory === cat.key
                    ? "bg-cornflower text-pearl shadow-sm"
                    : "bg-pearl/60 text-stone/70 hover:bg-pearl hover:text-cornflower border border-dust/50"
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Photo Grid (Masonry-style) ── */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-cornflower border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4 opacity-30">📷</p>
            <p className="text-stone/60 font-sans text-sm">
              {photos.length === 0
                ? "A galeria será preenchida com nossas melhores fotos em breve!"
                : "Nenhuma foto nesta categoria."}
            </p>
          </div>
        ) : (
          <motion.div
            layout
            className="columns-1 sm:columns-2 lg:columns-3 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((photo, idx) => (
                <motion.div
                  key={photo.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: idx * 0.03 }}
                  className="mb-4 break-inside-avoid group cursor-pointer"
                  onClick={() => openLightbox(idx)}
                >
                  <div className="relative overflow-hidden rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.url}
                      alt={photo.caption || "Foto da galeria"}
                      className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      loading="lazy"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-linear-to-t from-charcoal/50 via-transparent to-transparent
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-300
                                    flex items-end p-4">
                      {photo.caption && (
                        <p className="text-pearl font-sans text-xs leading-snug">
                          {photo.caption}
                        </p>
                      )}
                    </div>
                    {/* Featured badge */}
                    {photo.featured && (
                      <span className="absolute top-2 right-2 bg-gold-leaf/90 text-pearl text-[9px] font-sans
                                       font-bold px-2 py-0.5 rounded-pill uppercase tracking-wider">
                        ✧ Destaque
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxIndex !== null && filtered[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 bg-charcoal/95 backdrop-blur-md flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 w-10 h-10 bg-pearl/10 hover:bg-pearl/20
                         rounded-full flex items-center justify-center text-pearl/80
                         hover:text-pearl transition-all cursor-pointer z-10"
            >
              ✕
            </button>

            {/* Navigation */}
            {lightboxIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(-1);
                }}
                className="absolute left-4 md:left-8 w-10 h-10 bg-pearl/10 hover:bg-pearl/20
                           rounded-full flex items-center justify-center text-pearl/80
                           hover:text-pearl transition-all cursor-pointer z-10"
              >
                ←
              </button>
            )}
            {lightboxIndex < filtered.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(1);
                }}
                className="absolute right-4 md:right-8 w-10 h-10 bg-pearl/10 hover:bg-pearl/20
                           rounded-full flex items-center justify-center text-pearl/80
                           hover:text-pearl transition-all cursor-pointer z-10"
              >
                →
              </button>
            )}

            {/* Image */}
            <motion.div
              key={lightboxIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="max-w-[90vw] max-h-[85vh] flex flex-col items-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={filtered[lightboxIndex].url}
                alt={filtered[lightboxIndex].caption || "Foto"}
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
              />
              {filtered[lightboxIndex].caption && (
                <p className="text-pearl/70 font-sans text-sm text-center max-w-md">
                  {filtered[lightboxIndex].caption}
                </p>
              )}
              <p className="text-pearl/30 font-sans text-[10px]">
                {lightboxIndex + 1} / {filtered.length}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
