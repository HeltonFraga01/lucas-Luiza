"use client";

import { useState } from "react";
import Image from "next/image";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function RegistryAdminPanel({ initialGifts }: { initialGifts: any[] }) {
  const [gifts, setGifts] = useState(initialGifts);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  
  // Draft Item state
  const [draft, setDraft] = useState({
    title: "", imageUrl: "", price: 0, category: "Casa", 
    isGroupGift: false, targetAmount: 0, externalUrl: ""
  });

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) throw new Error("Erro ao extrair dados da URL");
      
      const data = await res.json();
      setDraft({
        title: data.title || "",
        imageUrl: data.imageUrl || "",
        price: data.price || 0,
        category: "Casa",
        isGroupGift: false,
        targetAmount: data.price || 0,
        externalUrl: url
      });
      setIsEditing(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/registry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });

      if (!res.ok) throw new Error("Erro ao salvar presente");
      const savedGift = await res.json();
      setGifts([savedGift, ...gifts]);
      
      // Reset form
      setUrl("");
      setDraft({ title: "", imageUrl: "", price: 0, category: "Casa", isGroupGift: false, targetAmount: 0, externalUrl: "" });
      setIsEditing(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Scraper Card */}
      <div className="bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
        <h2 className="text-xl font-medium mb-4">Adicionar Presente Universal</h2>
        
        <form onSubmit={handleScrape} className="flex flex-col md:flex-row gap-4">
          <input 
            type="url" 
            placeholder="Cole o link do produto de qualquer loja..." 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="grow p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-[#d4af37] outline-none text-zinc-900 dark:text-zinc-100"
          />
          <div className="flex gap-2 w-full md:w-auto">
            <button 
              type="submit" 
              disabled={loading || !url}
              className="flex-1 md:flex-none px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {loading ? "Buscando..." : "Extrair"}
            </button>
            <button 
              type="button" 
              onClick={() => {
                setDraft({ title: "", imageUrl: "", price: 0, category: "Casa", isGroupGift: false, targetAmount: 0, externalUrl: "" });
                setIsEditing(true);
              }}
              className="flex-1 md:flex-none px-6 py-3 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-xl font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors whitespace-nowrap"
            >
              Manual
            </button>
          </div>
        </form>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        {/* Draft Edit Area */}
        {isEditing && (
          <div className="mt-8 p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700 flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 flex flex-col gap-4">
              {draft.imageUrl ? (
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-white/50">
                  <Image src={draft.imageUrl} alt="Preview" fill className="object-cover" unoptimized />
                </div>
              ) : (
                <div className="w-full aspect-square rounded-xl bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-zinc-400">
                  Sem Imagem
                </div>
              )}
              <input 
                type="text" 
                placeholder="URL da Imagem (Opcional)" 
                value={draft.imageUrl} 
                onChange={(e) => setDraft({...draft, imageUrl: e.target.value})}
                className="w-full p-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-[#d4af37] outline-none" 
              />
            </div>
            
            <div className="grow flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Nome do Produto</label>
                <input 
                  type="text" 
                  value={draft.title} 
                  onChange={(e) => setDraft({...draft, title: e.target.value})}
                  className="w-full p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-[#d4af37] outline-none" 
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Preço Base (R$)</label>
                  <input 
                    type="number" 
                    value={draft.price} 
                    onChange={(e) => setDraft({...draft, price: parseFloat(e.target.value) || 0})}
                    className="w-full p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-[#d4af37] outline-none" 
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Categoria</label>
                  <select 
                    value={draft.category}
                    onChange={(e) => setDraft({...draft, category: e.target.value})}
                    className="w-full p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-[#d4af37] outline-none"
                  >
                    <option value="Casa">Casa</option>
                    <option value="Cozinha">Cozinha</option>
                    <option value="Lua de Mel">Lua de Mel</option>
                    <option value="Aventuras">Aventuras</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4 py-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={draft.isGroupGift}
                    onChange={(e) => setDraft({...draft, isGroupGift: e.target.checked})}
                    className="w-4 h-4 text-[#d4af37]"
                  />
                  <span className="text-sm font-medium">Financiamento Coletivo (Cota)</span>
                </label>
              </div>

              {draft.isGroupGift && (
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Meta Final (R$)</label>
                  <input 
                    type="number" 
                    value={draft.targetAmount || 0} 
                    onChange={(e) => setDraft({...draft, targetAmount: parseFloat(e.target.value) || 0})}
                    className="w-full p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-[#d4af37] outline-none" 
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => { setDraft({...draft, title: ""}); setIsEditing(false); }} className="px-6 py-2 rounded-lg font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">Cancelar</button>
                <button onClick={handleSave} disabled={loading || !draft.title || draft.price <= 0} className="px-6 py-2 rounded-lg font-medium bg-[#d4af37] text-white hover:bg-[#b8952b] transition-colors disabled:opacity-50">
                  Adicionar ao Site
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Registry Items Grid Admin View */}
      <h2 className="text-2xl font-serif mt-4">Presentes Cadastrados</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gifts.map((gift) => (
          <div key={gift.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm flex flex-col">
             <div className="relative w-full aspect-[4/3] bg-zinc-100 overflow-hidden">
                {gift.imageUrl ? (
                  <Image src={gift.imageUrl} alt={gift.title} fill className="object-cover" unoptimized />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-400">Sem Foto</div>
                )}
                {gift.isGroupGift && (
                  <span className="absolute top-3 left-3 px-2 py-1 text-xs font-bold bg-[#d4af37] text-white rounded-lg">Cota: R$ {gift.targetAmount}</span>
                )}
             </div>
             <div className="p-4 flex flex-col gap-1">
                <h3 className="font-semibold text-lg line-clamp-1" title={gift.title}>{gift.title}</h3>
                <span className="text-zinc-500 text-sm">{gift.category}</span>
                <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                  <span className="font-bold text-[#d4af37]">R$ {gift.price}</span>
                  <button className="text-xs text-red-500 font-medium hover:underline">Remover</button>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
