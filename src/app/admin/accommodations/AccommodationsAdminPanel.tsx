"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "@/components/ui/Toast";

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
  hidden: boolean;
  order: number;
  createdAt: string;
}

type Draft = {
  name: string;
  description: string;
  imageUrl: string;
  externalUrl: string;
  pricePerNight: string;
  city: string;
  category: string;
  whatsapp: string;
  featured: boolean;
};

const EMPTY: Draft = {
  name: "", description: "", imageUrl: "", externalUrl: "",
  pricePerNight: "", city: "", category: "hotel", whatsapp: "", featured: false,
};

const CATEGORIES = [
  { value: "hotel",   label: "Hotel" },
  { value: "pousada", label: "Pousada" },
  { value: "airbnb",  label: "Airbnb" },
  { value: "outro",   label: "Outro" },
];

const inputCls = "w-full p-3 rounded-lg border border-dust bg-parchment text-charcoal focus:ring-2 focus:ring-cornflower outline-none";

function DraftForm({
  values, onChange, onSave, onCancel, saveLabel, loading,
}: {
  values: Draft;
  onChange: (v: Draft) => void;
  onSave: () => void;
  onCancel: () => void;
  saveLabel: string;
  loading: boolean;
}) {
  return (
    <div className="mt-6 p-6 bg-sky-wash rounded-xl border border-dust flex flex-col gap-5">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Image preview */}
        <div className="w-full md:w-48 flex flex-col gap-3 shrink-0">
          {values.imageUrl ? (
            <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-pearl">
              <Image src={values.imageUrl} alt="Preview" fill className="object-cover" unoptimized />
            </div>
          ) : (
            <div className="w-full aspect-square rounded-xl bg-dust flex items-center justify-center text-stone text-sm">
              Sem Imagem
            </div>
          )}
          <input type="text" placeholder="URL da imagem (opcional)" value={values.imageUrl}
            onChange={(e) => onChange({ ...values, imageUrl: e.target.value })} className={inputCls} />
        </div>

        {/* Fields */}
        <div className="grow flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-charcoal">Nome do Local *</label>
            <input type="text" value={values.name} autoFocus
              onChange={(e) => onChange({ ...values, name: e.target.value })} className={inputCls} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-charcoal">Descrição</label>
            <textarea rows={3} value={values.description}
              onChange={(e) => onChange({ ...values, description: e.target.value })}
              className={inputCls + " resize-none"} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-charcoal">Cidade</label>
              <input type="text" value={values.city}
                onChange={(e) => onChange({ ...values, city: e.target.value })} className={inputCls} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-charcoal">Categoria</label>
              <select value={values.category} onChange={(e) => onChange({ ...values, category: e.target.value })} className={inputCls}>
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-charcoal">Diária (R$)</label>
              <input type="number" min="0" step="0.01" value={values.pricePerNight}
                onChange={(e) => onChange({ ...values, pricePerNight: e.target.value })} className={inputCls} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-charcoal">Link Airbnb / Booking</label>
              <input type="text" value={values.externalUrl} placeholder="https://..."
                onChange={(e) => onChange({ ...values, externalUrl: e.target.value })} className={inputCls} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-charcoal">WhatsApp do Local</label>
              <input type="text" value={values.whatsapp} placeholder="5511999998888 (só números)"
                onChange={(e) => onChange({ ...values, whatsapp: e.target.value.replace(/\D/g, "") })} className={inputCls} />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={values.featured}
              onChange={(e) => onChange({ ...values, featured: e.target.checked })} className="w-4 h-4" />
            <span className="text-sm font-medium text-charcoal">Destacar este local</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="px-6 py-2 rounded-lg font-medium text-stone hover:bg-dust transition-colors">
          Cancelar
        </button>
        <button onClick={onSave} disabled={loading || !values.name}
          className="px-6 py-2 rounded-lg font-medium bg-charcoal text-pearl hover:bg-charcoal/80 transition-colors disabled:opacity-50">
          {loading ? "Salvando..." : saveLabel}
        </button>
      </div>
    </div>
  );
}

export default function AccommodationsAdminPanel({ initialItems }: { initialItems: Accommodation[] }) {
  const [items, setItems] = useState<Accommodation[]>(initialItems);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [editingItem, setEditingItem] = useState<Accommodation | null>(null);
  const [editDraft, setEditDraft] = useState<Draft>(EMPTY);

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/accommodations/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) throw new Error("Erro ao extrair dados da URL");
      const data = await res.json();
      setDraft({
        name: data.name || "",
        description: data.description || "",
        imageUrl: data.imageUrl || "",
        externalUrl: url,
        pricePerNight: data.pricePerNight ? String(data.pricePerNight) : "",
        city: data.city || "",
        category: data.category || "hotel",
        whatsapp: "",
        featured: false,
      });
      setIsCreating(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/accommodations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!res.ok) throw new Error("Erro ao salvar");
      const saved: Accommodation = await res.json();
      setItems([saved, ...items]);
      setDraft(EMPTY);
      setUrl("");
      setIsCreating(false);
      toast("Local adicionado!", "success");
    } catch {
      toast("Erro ao adicionar local", "error");
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (item: Accommodation) => {
    setEditingItem(item);
    setEditDraft({
      name: item.name,
      description: item.description ?? "",
      imageUrl: item.imageUrl ?? "",
      externalUrl: item.externalUrl ?? "",
      pricePerNight: item.pricePerNight ? String(item.pricePerNight) : "",
      city: item.city ?? "",
      category: item.category,
      whatsapp: item.whatsapp ?? "",
      featured: item.featured,
    });
  };

  const handleUpdate = async () => {
    if (!editingItem) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/accommodations?id=${editingItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editDraft),
      });
      if (!res.ok) throw new Error();
      const updated: Accommodation = await res.json();
      setItems(items.map((x) => (x.id === updated.id ? updated : x)));
      setEditingItem(null);
      toast("Local atualizado!", "success");
    } catch {
      toast("Erro ao atualizar", "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleHidden = async (item: Accommodation) => {
    try {
      const res = await fetch(`/api/admin/accommodations?id=${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hidden: !item.hidden }),
      });
      if (!res.ok) throw new Error();
      setItems(items.map((x) => (x.id === item.id ? { ...x, hidden: !x.hidden } : x)));
      toast(item.hidden ? "Local visível" : "Local ocultado", "success");
    } catch {
      toast("Erro ao alterar visibilidade", "error");
    }
  };

  const handleDelete = async (item: Accommodation) => {
    if (!confirm(`Remover "${item.name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/accommodations?id=${item.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setItems(items.filter((x) => x.id !== item.id));
      toast("Local removido", "success");
    } catch {
      toast("Erro ao remover", "error");
    }
  };

  const categoryLabel = (v: string) => CATEGORIES.find((c) => c.value === v)?.label ?? v;

  return (
    <div className="flex flex-col gap-8">
      {/* Scraper Card */}
      <div className="bg-pearl shadow-sm border border-dust rounded-2xl p-6">
        <h2 className="text-xl font-medium text-charcoal mb-1">Adicionar Hospedagem</h2>
        <p className="text-xs text-stone mb-4">Cole um link do Airbnb ou Booking.com para extrair as informações automaticamente.</p>

        <form onSubmit={handleScrape} className="flex flex-col md:flex-row gap-4">
          <input type="url" placeholder="https://www.airbnb.com.br/rooms/... ou booking.com/hotel/..."
            value={url} onChange={(e) => setUrl(e.target.value)}
            className="grow p-3 rounded-xl border border-dust bg-parchment focus:ring-2 focus:ring-cornflower outline-none text-charcoal"
          />
          <div className="flex gap-2 w-full md:w-auto">
            <button type="submit" disabled={loading || !url}
              className="flex-1 md:flex-none px-6 py-3 bg-charcoal text-pearl rounded-xl font-medium hover:bg-charcoal/80 transition-colors disabled:opacity-50 whitespace-nowrap">
              {loading ? "Buscando..." : "Extrair"}
            </button>
            <button type="button" onClick={() => { setDraft(EMPTY); setIsCreating(true); }}
              className="flex-1 md:flex-none px-6 py-3 border border-dust bg-pearl text-charcoal rounded-xl font-medium hover:bg-sky-wash transition-colors whitespace-nowrap">
              Manual
            </button>
          </div>
        </form>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        {isCreating && (
          <DraftForm values={draft} onChange={setDraft} onSave={handleCreate}
            onCancel={() => { setDraft(EMPTY); setIsCreating(false); setUrl(""); }}
            saveLabel="Adicionar ao Site" loading={loading} />
        )}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 p-4">
          <div className="bg-pearl rounded-2xl border border-dust shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-medium text-charcoal mb-2">Editar Hospedagem</h2>
            <DraftForm values={editDraft} onChange={setEditDraft} onSave={handleUpdate}
              onCancel={() => setEditingItem(null)} saveLabel="Salvar Alterações" loading={loading} />
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif text-charcoal">
          Hospedagens Cadastradas{" "}
          <span className="text-base font-sans font-normal text-stone">
            {items.length} total · {items.filter((x) => x.hidden).length} ocultos
          </span>
        </h2>
      </div>

      {items.length === 0 ? (
        <div className="py-16 text-center border border-dust border-dashed rounded-2xl">
          <p className="text-4xl opacity-30 mb-2">🏨</p>
          <p className="text-stone">Nenhuma hospedagem cadastrada.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id}
              className={`bg-pearl rounded-2xl border border-dust shadow-sm flex flex-col overflow-hidden transition-opacity ${item.hidden ? "opacity-60" : ""}`}>
              <div className="relative w-full aspect-[4/3] bg-sky-wash overflow-hidden">
                {item.imageUrl ? (
                  <Image src={item.imageUrl} alt={item.name} fill className="object-cover" unoptimized />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl opacity-30">🏨</div>
                )}
                {item.hidden && (
                  <div className="absolute inset-0 flex items-center justify-center bg-charcoal/30">
                    <span className="bg-charcoal/80 text-pearl text-xs font-medium px-2 py-1 rounded-lg">Oculto</span>
                  </div>
                )}
                {item.featured && (
                  <span className="absolute top-3 left-3 px-2 py-1 text-xs font-bold bg-gold-leaf text-charcoal rounded-lg">Destaque</span>
                )}
                <span className="absolute top-3 right-3 px-2 py-1 text-xs bg-pearl/80 text-charcoal rounded-lg">
                  {categoryLabel(item.category)}
                </span>
              </div>

              <div className="p-4 flex flex-col gap-1 grow">
                <h3 className="font-semibold text-charcoal line-clamp-1" title={item.name}>{item.name}</h3>
                {item.city && <p className="text-stone text-xs">📍 {item.city}</p>}
                {item.description && <p className="text-stone text-sm line-clamp-2 mt-1">{item.description}</p>}

                <div className="mt-auto pt-3 flex items-center justify-between gap-2">
                  <div className="flex flex-col">
                    {item.pricePerNight && (
                      <span className="text-sm font-bold text-cornflower">
                        R$ {item.pricePerNight.toFixed(2)}<span className="text-xs font-normal text-stone">/noite</span>
                      </span>
                    )}
                    {item.whatsapp && (
                      <span className="text-xs text-stone mt-0.5">
                        📱 {item.whatsapp}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs flex-wrap justify-end">
                    <button onClick={() => toggleHidden(item)}
                      className="text-stone font-medium hover:text-charcoal transition-colors">
                      {item.hidden ? "👁️ Mostrar" : "🙈 Ocultar"}
                    </button>
                    <span className="text-dust">|</span>
                    <button onClick={() => openEdit(item)} className="text-cornflower font-medium hover:underline">Editar</button>
                    <span className="text-dust">|</span>
                    <button onClick={() => handleDelete(item)} className="text-red-500 font-medium hover:underline">Remover</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
