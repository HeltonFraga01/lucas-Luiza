"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "@/components/ui/Toast";

interface Gift {
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
}

type DraftState = {
  title: string;
  imageUrl: string;
  price: number;
  category: string;
  isGroupGift: boolean;
  targetAmount: number;
  externalUrl: string;
};

const EMPTY_DRAFT: DraftState = {
  title: "", imageUrl: "", price: 0, category: "Casa",
  isGroupGift: false, targetAmount: 0, externalUrl: "",
};

const inputCls =
  "w-full p-3 rounded-lg border border-dust bg-parchment text-charcoal focus:ring-2 focus:ring-cornflower outline-none";

export default function RegistryAdminPanel({ initialGifts }: { initialGifts: Gift[] }) {
  const [gifts, setGifts] = useState<Gift[]>(initialGifts);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Create mode
  const [isCreating, setIsCreating] = useState(false);
  const [draft, setDraft] = useState<DraftState>(EMPTY_DRAFT);

  // Edit mode
  const [editingGift, setEditingGift] = useState<Gift | null>(null);
  const [editDraft, setEditDraft] = useState<DraftState>(EMPTY_DRAFT);

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
        externalUrl: url,
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
      const res = await fetch("/api/admin/registry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!res.ok) throw new Error("Erro ao salvar presente");
      const saved: Gift = await res.json();
      setGifts([saved, ...gifts]);
      setUrl("");
      setDraft(EMPTY_DRAFT);
      setIsCreating(false);
      toast("Presente adicionado!", "success");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (g: Gift) => {
    setEditingGift(g);
    setEditDraft({
      title: g.title,
      imageUrl: g.imageUrl ?? "",
      price: g.price,
      category: g.category,
      isGroupGift: g.isGroupGift,
      targetAmount: g.targetAmount ?? 0,
      externalUrl: g.externalUrl ?? "",
    });
  };

  const handleUpdate = async () => {
    if (!editingGift) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/registry?id=${editingGift.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editDraft),
      });
      if (!res.ok) throw new Error("Erro ao atualizar");
      const updated: Gift = await res.json();
      setGifts(gifts.map((g) => (g.id === updated.id ? updated : g)));
      setEditingGift(null);
      toast("Presente atualizado!", "success");
    } catch {
      toast("Erro ao atualizar presente", "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleHidden = async (g: Gift) => {
    try {
      const res = await fetch(`/api/admin/registry?id=${g.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hidden: !g.hidden }),
      });
      if (!res.ok) throw new Error();
      setGifts(gifts.map((x) => (x.id === g.id ? { ...x, hidden: !x.hidden } : x)));
      toast(g.hidden ? "Presente visível na home" : "Presente ocultado da home", "success");
    } catch {
      toast("Erro ao alterar visibilidade", "error");
    }
  };

  const handleDelete = async (g: Gift) => {
    if (!confirm(`Remover "${g.title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/registry?id=${g.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setGifts(gifts.filter((x) => x.id !== g.id));
      toast("Presente removido", "success");
    } catch {
      toast("Erro ao remover presente", "error");
    }
  };

  const DraftForm = ({
    values,
    onChange,
    onSave,
    onCancel,
    saveLabel,
  }: {
    values: DraftState;
    onChange: (v: DraftState) => void;
    onSave: () => void;
    onCancel: () => void;
    saveLabel: string;
  }) => (
    <div className="mt-6 p-6 bg-sky-wash rounded-xl border border-dust flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-1/3 flex flex-col gap-4">
        {values.imageUrl ? (
          <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-pearl">
            <Image src={values.imageUrl} alt="Preview" fill className="object-cover" unoptimized />
          </div>
        ) : (
          <div className="w-full aspect-square rounded-xl bg-dust flex items-center justify-center text-stone text-sm">
            Sem Imagem
          </div>
        )}
        <input
          type="text"
          placeholder="URL da Imagem (opcional)"
          value={values.imageUrl}
          onChange={(e) => onChange({ ...values, imageUrl: e.target.value })}
          className={inputCls}
        />
      </div>

      <div className="grow flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-charcoal">Nome do Produto</label>
          <input
            type="text"
            value={values.title}
            onChange={(e) => onChange({ ...values, title: e.target.value })}
            className={inputCls}
            autoFocus
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-charcoal">Preço Base (R$)</label>
            <input
              type="number"
              value={values.price}
              onChange={(e) => onChange({ ...values, price: parseFloat(e.target.value) || 0 })}
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-charcoal">Categoria</label>
            <select
              value={values.category}
              onChange={(e) => onChange({ ...values, category: e.target.value })}
              className={inputCls}
            >
              <option value="Casa">Casa</option>
              <option value="Cozinha">Cozinha</option>
              <option value="Lua de Mel">Lua de Mel</option>
              <option value="Aventuras">Aventuras</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-charcoal">Link da Loja (opcional)</label>
          <input
            type="text"
            value={values.externalUrl}
            onChange={(e) => onChange({ ...values, externalUrl: e.target.value })}
            className={inputCls}
            placeholder="https://..."
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={values.isGroupGift}
            onChange={(e) => onChange({ ...values, isGroupGift: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="text-sm font-medium text-charcoal">Financiamento Coletivo (Cota)</span>
        </label>

        {values.isGroupGift && (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-charcoal">Meta Final (R$)</label>
            <input
              type="number"
              value={values.targetAmount || 0}
              onChange={(e) => onChange({ ...values, targetAmount: parseFloat(e.target.value) || 0 })}
              className={inputCls}
            />
          </div>
        )}

        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={onCancel}
            className="px-6 py-2 rounded-lg font-medium text-stone hover:bg-dust transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onSave}
            disabled={loading || !values.title || values.price <= 0}
            className="px-6 py-2 rounded-lg font-medium bg-charcoal text-pearl hover:bg-charcoal/80 transition-colors disabled:opacity-50"
          >
            {saveLabel}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Scraper Card */}
      <div className="bg-pearl shadow-sm border border-dust rounded-2xl p-6">
        <h2 className="text-xl font-medium text-charcoal mb-4">Adicionar Presente Universal</h2>

        <form onSubmit={handleScrape} className="flex flex-col md:flex-row gap-4">
          <input
            type="url"
            placeholder="Cole o link do produto de qualquer loja..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="grow p-3 rounded-xl border border-dust bg-parchment focus:ring-2 focus:ring-cornflower outline-none text-charcoal"
          />
          <div className="flex gap-2 w-full md:w-auto">
            <button
              type="submit"
              disabled={loading || !url}
              className="flex-1 md:flex-none px-6 py-3 bg-charcoal text-pearl rounded-xl font-medium hover:bg-charcoal/80 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {loading ? "Buscando..." : "Extrair"}
            </button>
            <button
              type="button"
              onClick={() => {
                setDraft(EMPTY_DRAFT);
                setIsCreating(true);
              }}
              className="flex-1 md:flex-none px-6 py-3 border border-dust bg-pearl text-charcoal rounded-xl font-medium hover:bg-sky-wash transition-colors whitespace-nowrap"
            >
              Manual
            </button>
          </div>
        </form>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        {isCreating && (
          <DraftForm
            values={draft}
            onChange={setDraft}
            onSave={handleCreate}
            onCancel={() => { setDraft(EMPTY_DRAFT); setIsCreating(false); setUrl(""); }}
            saveLabel="Adicionar ao Site"
          />
        )}
      </div>

      {/* Edit Modal */}
      {editingGift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 p-4">
          <div className="bg-pearl rounded-2xl border border-dust shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-medium text-charcoal mb-4">Editar Presente</h2>
            <DraftForm
              values={editDraft}
              onChange={setEditDraft}
              onSave={handleUpdate}
              onCancel={() => setEditingGift(null)}
              saveLabel="Salvar Alterações"
            />
          </div>
        </div>
      )}

      {/* Gift Grid */}
      <h2 className="text-2xl font-serif text-charcoal mt-4">
        Presentes Cadastrados{" "}
        <span className="text-base font-sans font-normal text-stone">
          {gifts.length} total · {gifts.filter((g) => g.hidden).length} ocultos
        </span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gifts.map((gift) => (
          <div
            key={gift.id}
            className={`bg-pearl rounded-2xl border shadow-sm flex flex-col overflow-hidden transition-opacity ${
              gift.hidden ? "opacity-60 border-dust" : "border-dust"
            }`}
          >
            <div className="relative w-full aspect-[4/3] bg-sky-wash overflow-hidden">
              {gift.imageUrl ? (
                <Image src={gift.imageUrl} alt={gift.title} fill className="object-cover" unoptimized />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone text-sm">
                  Sem Foto
                </div>
              )}
              {gift.hidden && (
                <div className="absolute inset-0 flex items-center justify-center bg-charcoal/30">
                  <span className="bg-charcoal/80 text-pearl text-xs font-medium px-2 py-1 rounded-lg">
                    Oculto
                  </span>
                </div>
              )}
              {gift.isGroupGift && (
                <span className="absolute top-3 left-3 px-2 py-1 text-xs font-bold bg-gold-leaf text-charcoal rounded-lg">
                  Cota: R$ {gift.targetAmount}
                </span>
              )}
            </div>
            <div className="p-4 flex flex-col gap-1">
              <h3 className="font-semibold text-lg text-charcoal line-clamp-1" title={gift.title}>
                {gift.title}
              </h3>
              <span className="text-stone text-sm">{gift.category}</span>
              <div className="mt-4 pt-4 border-t border-dust flex justify-between items-center gap-2">
                <span className="font-bold text-cornflower">R$ {gift.price.toFixed(2)}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleHidden(gift)}
                    title={gift.hidden ? "Mostrar na home" : "Ocultar da home"}
                    className="text-xs text-stone font-medium hover:text-charcoal transition-colors"
                  >
                    {gift.hidden ? "👁️ Mostrar" : "🙈 Ocultar"}
                  </button>
                  <span className="text-dust">|</span>
                  <button
                    onClick={() => openEdit(gift)}
                    className="text-xs text-cornflower font-medium hover:underline"
                  >
                    Editar
                  </button>
                  <span className="text-dust">|</span>
                  <button
                    onClick={() => handleDelete(gift)}
                    className="text-xs text-red-500 font-medium hover:underline"
                  >
                    Remover
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
