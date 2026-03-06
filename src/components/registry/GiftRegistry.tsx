"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function GiftRegistry() {
  const [filter, setFilter] = useState("Todos");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [checkoutGift, setCheckoutGift] = useState<any | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [gifts, setGifts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGifts() {
      try {
        const res = await fetch("/api/registry");
        if (res.ok) {
          const data = await res.json();
          setGifts(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchGifts();
  }, []);

  const categories = ["Todos", "Casa", "Cozinha", "Lua de Mel", "Aventuras"];

  const filteredGifts = filter === "Todos" ? gifts : gifts.filter((g) => g.category === filter);

  return (
    <section id="presentes" className="py-24 bg-zinc-50  font-sans">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-zinc-900  mb-4">
            Lista de Presentes
          </h2>
          <p className="text-lg text-zinc-600  max-w-2xl mx-auto">
            O seu maior presente é a sua presença. Mas, se desejar nos presentear de outra forma, ficaremos muito agradecidos com qualquer contribuição para a nossa nova vida.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                filter === c
                  ? "bg-[#d4af37] text-white shadow-lg shadow-[#d4af37]/20"
                  : "bg-white  text-zinc-600  border border-zinc-200  hover:border-[#d4af37] hover:text-[#d4af37]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Registry Grid */}
        {loading ? (
          <div className="w-full py-20 flex justify-center text-zinc-400">Carregando lista de presentes...</div>
        ) : gifts.length === 0 ? (
          <div className="w-full py-20 flex justify-center text-zinc-400">Nenhum presente disponível no momento.</div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredGifts.map((gift) => (
                <motion.div
                  key={gift.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="group relative bg-white  rounded-2xl overflow-hidden border border-zinc-200  shadow-sm hover:shadow-xl transition-all flex flex-col h-full"
                >
                  <div className="relative w-full aspect-square bg-zinc-100  overflow-hidden">
                    {gift.imageUrl ? (
                       <Image
                         src={gift.imageUrl}
                         alt={gift.title}
                         fill
                         className="object-cover group-hover:scale-105 transition-transform duration-500"
                         unoptimized
                       />
                    ) : (
                       <div className="w-full h-full flex items-center justify-center text-zinc-400">Sem Foto</div>
                    )}
                    {gift.isGroupGift && (
                      <div className="absolute top-4 left-4 bg-white/90  backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#d4af37]">
                        Cota Compartilhada
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex flex-col grow">
                    <span className="text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">{gift.category}</span>
                    <h3 className="text-lg font-medium text-zinc-900  leading-tight mb-4 grow">
                      {gift.title}
                    </h3>
                    
                    <div className="mt-auto">
                      {gift.isGroupGift ? (
                        <div className="flex flex-col gap-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-zinc-500">Arrecadado</span>
                            <span className="font-semibold text-zinc-900 ">
                              R$ {gift.raisedAmount} / R$ {gift.targetAmount}
                            </span>
                          </div>
                          <div className="h-2 w-full bg-zinc-100  rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#d4af37] rounded-full transition-all duration-1000"
                              style={{ width: `${Math.min(100, ((gift.raisedAmount || 0) / (gift.targetAmount || 1)) * 100)}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="text-xl font-semibold text-[#d4af37] mb-6">
                          R$ {gift.price}
                        </div>
                      )}

                      <button
                        onClick={() => setCheckoutGift(gift)}
                        className="w-full py-3 bg-zinc-900  text-white  font-medium rounded-xl hover:bg-zinc-800 :bg-white transition-colors"
                      >
                        Presentear
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Mock Checkout Modal */}
        <AnimatePresence>
          {checkoutGift && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCheckoutGift(null)}
              className="fixed inset-0 z-50 bg-zinc-900/60 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div 
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md bg-white  rounded-3xl p-8 shadow-2xl relative border border-zinc-200 "
              >
                <button 
                  onClick={() => setCheckoutGift(null)}
                  className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100  text-zinc-500 hover:text-zinc-900 :text-white"
                >
                  ✕
                </button>

                <h3 className="text-2xl font-serif mb-2">Presentear</h3>
                <p className="text-zinc-600  mb-8">{checkoutGift.title}</p>
                
                <div className="bg-zinc-50  rounded-2xl p-6 flex flex-col items-center justify-center border border-zinc-200  mb-6">
                  {/* Mock QR Code area */}
                  <div className="w-48 h-48 bg-white rounded-xl mb-4 flex items-center justify-center border-4 border-zinc-200 ">
                    <span className="text-zinc-400 font-mono text-sm">(QR Code PIX)</span>
                  </div>
                  <p className="text-center text-sm text-zinc-600 ">
                    Escaneie o QR Code acima no app do seu banco ou copie a chave PIX abaixo:
                  </p>
                </div>

                <div className="flex gap-2">
                  <input 
                    type="text" 
                    readOnly 
                    value="00020126420014br.gov.bcb.pix..." 
                    className="grow p-3 rounded-xl bg-zinc-100  border-none text-zinc-500 text-sm font-mono outline-none"
                  />
                  <button className="px-6 py-3 bg-[#d4af37] text-white rounded-xl font-medium hover:bg-[#c4a030] transition-colors">
                    Copiar
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
