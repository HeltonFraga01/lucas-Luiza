"use client";

import { useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function GuestTable({ initialGuests }: { initialGuests: any[] }) {
  const [guests, setGuests] = useState(initialGuests);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState({
    name: "", email: "", phone: "", group: "", isVip: false, plusOneAllowed: false
  });

  const filtered = guests.filter((g) => 
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    g.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (g.phone && g.phone.includes(searchTerm))
  );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });

      if (!res.ok) throw new Error("Erro ao adicionar convidado");
      const savedGuest = await res.json();
      
      setGuests([savedGuest, ...guests]);
      setIsModalOpen(false);
      setDraft({ name: "", email: "", phone: "", group: "", isVip: false, plusOneAllowed: false });
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar convidado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-zinc-900 dark:text-zinc-100">Convidados e RSVP</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2">Gerencie a sua lista de convidados e visualize as confirmações e restrições alimentares.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-[#d4af37] text-white rounded-xl font-medium hover:bg-[#c4a030] transition-colors whitespace-nowrap"
        >
          + Adicionar Convidado
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950/50">
          <input 
            type="search" 
            placeholder="Buscar por nome, email ou telefone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-sm p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-[#d4af37] outline-none transition-all"
          />
        </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-zinc-50 dark:bg-zinc-950/50 text-zinc-500 dark:text-zinc-400 capitalize">
            <tr>
              <th className="px-6 py-4 font-medium">Nome</th>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Grupo / VIP</th>
              <th className="px-6 py-4 font-medium">Status RSVP</th>
              <th className="px-6 py-4 font-medium">Restrições (Notas)</th>
              <th className="px-6 py-4 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                  Nenhum convidado encontrado.
                </td>
              </tr>
            ) : filtered.map((guest) => (
              <tr key={guest.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100">
                  {guest.name}
                  {guest.attendees?.length > 0 && (
                    <span className="ml-2 text-xs bg-zinc-200 dark:bg-zinc-700 px-2 py-0.5 rounded-full text-zinc-600 dark:text-zinc-300">
                      +{guest.attendees.length} acompanhantes
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 flex flex-col gap-0.5">
                  <span className="text-zinc-500 text-sm">{guest.email}</span>
                  {guest.phone && <span className="text-zinc-400 text-xs">{guest.phone}</span>}
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-xs font-medium mr-2">
                    {guest.group || "Sem Grupo"}
                  </span>
                  {guest.isVip && (
                    <span className="px-2 py-1 bg-[#d4af37]/10 text-[#a08226] dark:text-[#d4af37] rounded text-xs font-bold border border-[#d4af37]/20">
                      VIP
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {!guest.rsvp ? (
                    <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-md text-xs font-medium bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                      Pendente
                    </span>
                  ) : guest.rsvp.confirmed ? (
                    <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-md text-xs font-medium bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400 border border-green-200 dark:border-green-800">
                      Confirmado
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-md text-xs font-medium bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-800">
                      Recusado
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-[200px] truncate text-zinc-500" title={guest.rsvp?.notes || ""}>
                    {guest.rsvp?.notes || "-"}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-[#d4af37] hover:text-[#b8952b] font-medium text-sm transition-colors">
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>

      {/* Add Guest Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-lg p-8 shadow-2xl relative">
            <h2 className="text-2xl font-serif text-zinc-900 dark:text-zinc-100 mb-6">Novo Convidado</h2>
            
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Nome Completo</label>
                <input 
                  type="text" required
                  value={draft.name} onChange={(e) => setDraft({...draft, name: e.target.value})}
                  className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-[#d4af37] outline-none text-zinc-900 dark:text-zinc-100" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Email</label>
                  <input 
                    type="email" required
                    value={draft.email} onChange={(e) => setDraft({...draft, email: e.target.value})}
                    className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-[#d4af37] outline-none text-zinc-900 dark:text-zinc-100" 
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Telefone</label>
                  <input 
                    type="tel" placeholder="(11) 99999-9999"
                    value={draft.phone} onChange={(e) => setDraft({...draft, phone: e.target.value})}
                    className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-[#d4af37] outline-none text-zinc-900 dark:text-zinc-100" 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Grupo (Ex: Família da Noiva)</label>
                <input 
                  type="text" 
                  value={draft.group} onChange={(e) => setDraft({...draft, group: e.target.value})}
                  className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-[#d4af37] outline-none text-zinc-900 dark:text-zinc-100" 
                />
              </div>

              <div className="flex flex-col gap-3 mt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={draft.isVip} onChange={(e) => setDraft({...draft, isVip: e.target.checked})} className="w-4 h-4 text-[#d4af37]" />
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Marcar como Convidado VIP</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={draft.plusOneAllowed} onChange={(e) => setDraft({...draft, plusOneAllowed: e.target.checked})} className="w-4 h-4 text-[#d4af37]" />
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Permitir acompanhante extra (+1)</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">Cancelar</button>
                <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-xl font-medium bg-[#d4af37] text-white hover:bg-[#b8952b] transition-colors disabled:opacity-50">
                  {loading ? "Salvando..." : "Salvar Convidado"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
