"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/motion";

interface Accommodation {
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
}

const CATEGORY_LABELS: Record<string, string> = {
  hotel: "Hotel",
  pousada: "Pousada",
  airbnb: "Airbnb",
  outro: "Outro",
};

export default function Accommodations({ standalone = false }: { standalone?: boolean }) {
  const [items, setItems] = useState<Accommodation[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/accommodations")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setItems(data);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  if (loaded && items.length === 0 && !standalone) return null;

  const emptyState = loaded && items.length === 0 && standalone;

  return (
    <section id="onde-ficar" className="py-20 bg-parchment">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.p
            variants={fadeInUp}
            className="text-xs font-sans uppercase tracking-[0.25em] text-cornflower mb-3"
          >
            Onde Ficar
          </motion.p>
          <motion.h2
            variants={fadeInUp}
            className="font-display italic text-4xl md:text-5xl text-navy-deep mb-4"
          >
            Sugestões de Hospedagem
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-stone font-sans max-w-xl mx-auto">
            Selecionamos algumas opções de hospedagem próximas ao evento para tornar
            sua estadia mais cômoda.
          </motion.p>
        </motion.div>

        {/* Empty state */}
        {emptyState && (
          <p className="text-center text-stone font-sans py-12">
            Em breve adicionaremos sugestões de hospedagem.
          </p>
        )}

        {/* Cards */}
        {!emptyState && loaded && items.length > 0 && (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {items.map((item) => (
            <motion.div
              key={item.id}
              variants={fadeInUp}
              className="bg-pearl rounded-2xl border border-dust shadow-sm overflow-hidden flex flex-col"
            >
              {/* Image */}
              <div className="relative w-full aspect-[4/3] bg-sky-wash overflow-hidden">
                {item.imageUrl ? (
                  <Image src={item.imageUrl} alt={item.name} fill className="object-cover" unoptimized />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl opacity-20">🏨</div>
                )}
                {item.featured && (
                  <span className="absolute top-3 left-3 px-2 py-1 text-[10px] font-bold bg-gold-leaf text-charcoal rounded-lg uppercase tracking-wide">
                    Destaque
                  </span>
                )}
                <span className="absolute top-3 right-3 px-2 py-1 text-[10px] bg-pearl/90 text-charcoal rounded-lg">
                  {CATEGORY_LABELS[item.category] ?? item.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col gap-2 grow">
                <h3 className="font-display italic text-lg text-navy-deep leading-tight">{item.name}</h3>
                {item.city && (
                  <p className="text-xs text-stone font-sans flex items-center gap-1">
                    <span>📍</span> {item.city}
                  </p>
                )}
                {item.description && (
                  <p className="text-stone text-sm font-sans line-clamp-3 mt-1">{item.description}</p>
                )}

                {item.pricePerNight && (
                  <p className="text-sm font-medium text-cornflower mt-1">
                    A partir de{" "}
                    <span className="font-bold">R$ {item.pricePerNight.toFixed(2)}</span>
                    <span className="text-xs font-normal text-stone"> / noite</span>
                  </p>
                )}

                {/* Actions */}
                <div className="mt-auto pt-4 flex flex-wrap gap-2">
                  {item.whatsapp && (
                    <a
                      href={`https://wa.me/${item.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white text-sm font-medium rounded-xl hover:bg-[#1ebe5a] transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                      WhatsApp
                    </a>
                  )}
                  {item.externalUrl && (
                    <a
                      href={item.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-4 py-2 border border-dust text-charcoal text-sm font-medium rounded-xl hover:bg-sky-wash transition-colors"
                    >
                      Ver Local ↗
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        )}
      </div>
    </section>
  );
}
