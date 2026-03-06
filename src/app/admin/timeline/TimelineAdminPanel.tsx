"use client";

import { useState, useEffect } from "react";

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

  // Form states
  const [year, setYear] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState("");

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/admin/timeline");
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (error) {
      console.error("Error fetching timeline items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleOpenModal = (item?: TimelineItem) => {
    if (item) {
      setEditingItem(item);
      setYear(item.year);
      setTitle(item.title);
      setDescription(item.description);
      setOrder(item.order.toString());
    } else {
      setEditingItem(null);
      setYear("");
      setTitle("");
      setDescription("");
      setOrder("");
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...(editingItem && { id: editingItem.id }),
      year,
      title,
      description,
      order: parseInt(order) || 0,
    };

    try {
      const res = await fetch("/api/admin/timeline", {
        method: editingItem ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await fetchItems();
        handleCloseModal();
      } else {
        alert("Erro ao salvar momento.");
      }
    } catch (error) {
      console.error("Error saving timeline item:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja remover este momento?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/timeline?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchItems();
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Grandes Momentos</h2>
          <p className="text-zinc-500 text-sm">Gerencie a linha do tempo da Nossa História.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-zinc-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-zinc-800 transition-colors"
        >
          + Adicionar Momento
        </button>
      </div>

      {loading && items.length === 0 ? (
        <div className="text-center py-10 text-zinc-500">Carregando...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-10 text-zinc-500 bg-zinc-50 rounded-lg border border-dashed border-zinc-200">
          Nenhum momento cadastrado. Clique no botão acima para adicionar.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200">
                <th className="py-3 px-4 text-sm font-semibold text-zinc-600">Ano</th>
                <th className="py-3 px-4 text-sm font-semibold text-zinc-600">Título</th>
                <th className="py-3 px-4 text-sm font-semibold text-zinc-600">Descrição</th>
                <th className="py-3 px-4 text-sm font-semibold text-zinc-600">Ordem</th>
                <th className="py-3 px-4 text-sm font-semibold text-zinc-600 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                  <td className="py-3 px-4 text-sm text-zinc-900">{item.year}</td>
                  <td className="py-3 px-4 text-sm text-zinc-900 font-medium">{item.title}</td>
                  <td className="py-3 px-4 text-sm text-zinc-500 max-w-xs truncate" title={item.description}>{item.description}</td>
                  <td className="py-3 px-4 text-sm text-zinc-500">{item.order}</td>
                  <td className="py-3 px-4 flex justify-end gap-2">
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="text-blue-600 hover:underline text-sm font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:underline text-sm font-medium"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Moda de Adição/Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-zinc-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-950 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-zinc-200 dark:border-zinc-800">
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                {editingItem ? "Editar Momento" : "Novo Momento"}
              </h3>
              <button onClick={handleCloseModal} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-xl font-bold">
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Ano (Ex: 2018)</label>
                  <input
                    type="text"
                    required
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="p-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-md outline-none focus:ring-2 focus:ring-[#d4af37]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Ordem (Ex: 1, 2, 3)</label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    className="p-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-md outline-none focus:ring-2 focus:ring-[#d4af37]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Título</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="p-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-md outline-none focus:ring-2 focus:ring-[#d4af37]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Descrição</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="p-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-md outline-none focus:ring-2 focus:ring-[#d4af37] resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-zinc-100 text-zinc-700 rounded-lg hover:bg-zinc-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-50"
                >
                  {loading ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
