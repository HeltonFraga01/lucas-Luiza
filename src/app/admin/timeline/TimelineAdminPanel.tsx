"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { toast } from "@/components/ui/Toast";

type TimelineItem = {
  id: number;
  year: string;
  title: string;
  description: string;
  order: number;
};

export default function TimelineAdminPanel() {
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TimelineItem | null>(null);
  const [saving, setSaving] = useState(false);

  // Form states
  const [year, setYear] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState("");

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/admin/timeline");
      if (res.ok) setItems(await res.json());
    } catch { /* no-op */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleOpenModal = (item?: TimelineItem) => {
    if (item) {
      setEditingItem(item);
      setYear(item.year);
      setTitle(item.title);
      setDescription(item.description);
      setOrder(item.order.toString());
    } else {
      setEditingItem(null);
      setYear(""); setTitle(""); setDescription(""); setOrder("");
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...(editingItem && { id: editingItem.id }),
      year, title, description,
      order: parseInt(order) || 0,
    };
    try {
      const res = await fetch("/api/admin/timeline", {
        method: editingItem ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      await fetchItems();
      handleCloseModal();
      toast(editingItem ? "Momento atualizado!" : "Momento adicionado!", "success");
    } catch {
      toast("Erro ao salvar momento.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja remover este momento?")) return;
    try {
      const res = await fetch(`/api/admin/timeline?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      await fetchItems();
      toast("Momento removido.", "success");
    } catch {
      toast("Erro ao remover momento.", "error");
    }
  };

  return (
    <div className="bg-pearl rounded-xl border border-dust p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-serif text-xl text-charcoal">Grandes Momentos</h2>
          <p className="text-stone text-xs font-sans mt-0.5">Gerencie a linha do tempo da Nossa História.</p>
        </div>
        <Button variant="primary" onClick={() => handleOpenModal()}>
          + Adicionar Momento
        </Button>
      </div>

      {loading && items.length === 0 ? (
        <div className="text-center py-10 text-stone font-sans text-sm">Carregando...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-10 text-stone font-sans text-sm bg-sky-wash rounded-lg border border-dashed border-dust">
          Nenhum momento cadastrado. Clique no botão acima para adicionar.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-sans text-left border-collapse">
            <thead>
              <tr className="bg-sky-wash border-b border-dust">
                <th className="py-3 px-4 text-[10px] text-stone uppercase tracking-wider font-medium">Ano</th>
                <th className="py-3 px-4 text-[10px] text-stone uppercase tracking-wider font-medium">Título</th>
                <th className="py-3 px-4 text-[10px] text-stone uppercase tracking-wider font-medium">Descrição</th>
                <th className="py-3 px-4 text-[10px] text-stone uppercase tracking-wider font-medium">Ordem</th>
                <th className="py-3 px-4 text-[10px] text-stone uppercase tracking-wider font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-dust/50 last:border-0 hover:bg-ice-blue/20 transition-colors">
                  <td className="py-3 px-4 text-charcoal">{item.year}</td>
                  <td className="py-3 px-4 text-charcoal font-medium">{item.title}</td>
                  <td className="py-3 px-4 text-stone max-w-xs truncate" title={item.description}>{item.description}</td>
                  <td className="py-3 px-4 text-stone">{item.order}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenModal(item)}
                        className="text-cornflower hover:underline text-sm font-medium cursor-pointer"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-blush hover:underline text-sm font-medium cursor-pointer"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingItem ? "Editar Momento" : "Novo Momento"}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Ano (Ex: 2018)"
              type="text"
              required
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="2018"
            />
            <Input
              label="Ordem (Ex: 1, 2, 3)"
              type="number"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              placeholder="1"
            />
          </div>
          <Input
            label="Título"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="O Primeiro Encontro"
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-sans font-medium text-stone uppercase tracking-wider">
              Descrição
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Conte o que aconteceu neste momento especial..."
              className="w-full px-4 py-3 text-base font-sans text-charcoal bg-pearl border-[1.5px] border-dust hover:border-stone rounded-md placeholder:text-stone/60 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-periwinkle focus:border-periwinkle resize-none"
            />
          </div>
          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2.5 text-sm text-stone font-sans font-medium border border-dust rounded-pill hover:bg-dust/20 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <Button type="submit" variant="primary" loading={saving}>
              {editingItem ? "Salvar Alterações" : "Adicionar Momento"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
