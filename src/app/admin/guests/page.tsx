"use client";

import { useState, useEffect, useCallback } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { toast } from "@/components/ui/Toast";

interface Guest {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  group: string | null;
  isVip: boolean;
  plusOneAllowed: boolean;
  checkedIn: boolean;
  checkedInAt: string | null;
  rsvp: {
    confirmed: boolean;
    submittedAt: string;
    notes: string | null;
    plusOneName: string | null;
  } | null;
  attendees: { id: number; name: string; dietaryNeeds: string | null }[];
}

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editGuest, setEditGuest] = useState<Guest | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [group, setGroup] = useState("");
  const [isVip, setIsVip] = useState(false);
  const [plusOne, setPlusOne] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchGuests = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/guests");
      if (res.ok) setGuests(await res.json());
    } catch { /* no-op */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchGuests(); }, [fetchGuests]);

  const openCreate = () => {
    setEditGuest(null);
    setName(""); setEmail(""); setPhone(""); setGroup(""); setIsVip(false); setPlusOne(false);
    setModalOpen(true);
  };

  const openEdit = (g: Guest) => {
    setEditGuest(g);
    setName(g.name); setEmail(g.email); setPhone(g.phone || "");
    setGroup(g.group || ""); setIsVip(g.isVip); setPlusOne(g.plusOneAllowed);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!name || !email) return;
    setSaving(true);
    try {
      const body = { name, email, phone: phone || null, group: group || null, isVip, plusOneAllowed: plusOne };
      const url = editGuest ? `/api/admin/guests?id=${editGuest.id}` : "/api/admin/guests";
      const method = editGuest ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error();
      toast(editGuest ? "Convidado atualizado!" : "Convidado adicionado!", "success");
      setModalOpen(false);
      fetchGuests();
    } catch { toast("Erro ao salvar.", "error"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await fetch(`/api/admin/guests?id=${deleteId}`, { method: "DELETE" });
      toast("Convidado removido.", "success");
      setDeleteId(null);
      fetchGuests();
    } catch { toast("Erro ao remover.", "error"); }
  };

  const toggleVip = async (g: Guest) => {
    try {
      await fetch(`/api/admin/guests?id=${g.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: g.name, email: g.email, phone: g.phone, group: g.group, isVip: !g.isVip, plusOneAllowed: g.plusOneAllowed }),
      });
      fetchGuests();
    } catch { toast("Erro ao atualizar VIP.", "error"); }
  };

  const toggleCheckIn = async (g: Guest) => {
    try {
      await fetch(`/api/admin/guests?id=${g.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkedIn: !g.checkedIn }),
      });
      fetchGuests();
    } catch { toast("Erro ao registrar check-in.", "error"); }
  };

  const exportCSV = () => {
    const header = "Nome,Email,Telefone,Grupo,VIP,RSVP,+1 Nome,Observações,Acompanhantes,Restrições Alimentares,Check-in";
    const rows = guests.map((g) => [
      g.name,
      g.email,
      g.phone || "",
      g.group || "",
      g.isVip ? "Sim" : "Não",
      g.rsvp ? (g.rsvp.confirmed ? "Confirmado" : "Não vai") : "Pendente",
      g.rsvp?.plusOneName || "",
      g.rsvp?.notes || "",
      g.attendees.map((a) => a.name).join("; "),
      g.attendees.map((a) => a.dietaryNeeds || "").join("; "),
      g.checkedIn ? "Chegou" : "Não chegou",
    ].map((v) => '"' + String(v).replace(/"/g, '""') + '"').join(","));
    const csv = [header, ...rows].join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "convidados.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = guests.filter((g) => {
    const q = search.toLowerCase();
    return (
      g.name.toLowerCase().includes(q) ||
      g.email.toLowerCase().includes(q) ||
      (g.rsvp?.plusOneName?.toLowerCase().includes(q) ?? false) ||
      g.attendees.some((a) => a.name.toLowerCase().includes(q))
    );
  });

  const checkedCount = guests.filter((g) => g.checkedIn).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl text-charcoal">Convidados & RSVP</h1>
          <p className="text-stone text-xs font-sans mt-0.5">
            {guests.length} convidados · <span className="text-sage font-medium">{checkedCount} presentes</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-sans font-medium text-stone border border-dust rounded-pill hover:bg-dust/20 transition-colors cursor-pointer"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Exportar CSV
          </button>
          <Button variant="primary" onClick={openCreate}>+ Adicionar</Button>
        </div>
      </div>

      {/* Search */}
      <Input
        placeholder="Buscar por nome, email ou acompanhante..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>}
      />

      {/* Table */}
      <div className="bg-pearl rounded-xl border border-dust overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="skeleton w-full h-6 mb-3"/>
            <div className="skeleton w-full h-6 mb-3"/>
            <div className="skeleton w-3/4 h-6"/>
          </div>
        ) : filtered.length === 0 ? (
          <p className="p-12 text-center text-stone font-sans text-sm">Nenhum convidado encontrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-sans">
              <thead>
                <tr className="bg-sky-wash border-b border-dust text-left">
                  <th className="px-4 py-3 text-[10px] text-stone uppercase tracking-wider font-medium">Nome</th>
                  <th className="px-4 py-3 text-[10px] text-stone uppercase tracking-wider font-medium hidden md:table-cell">Email</th>
                  <th className="px-4 py-3 text-[10px] text-stone uppercase tracking-wider font-medium hidden lg:table-cell">Grupo</th>
                  <th className="px-4 py-3 text-[10px] text-stone uppercase tracking-wider font-medium text-center">VIP</th>
                  <th className="px-4 py-3 text-[10px] text-stone uppercase tracking-wider font-medium text-center">RSVP</th>
                  <th className="px-4 py-3 text-[10px] text-stone uppercase tracking-wider font-medium text-center">Check-in</th>
                  <th className="px-4 py-3 text-[10px] text-stone uppercase tracking-wider font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((g) => (
                  <tr key={g.id} className="border-b border-dust/50 last:border-0 hover:bg-ice-blue/20 transition-colors">
                    {/* Nome + acompanhantes */}
                    <td className="px-4 py-3">
                      <span className="font-medium text-charcoal">{g.name}</span>
                      <span className="md:hidden block text-[10px] text-stone">{g.email}</span>
                      {g.rsvp?.plusOneName && (
                        <span className="block text-[10px] text-stone mt-0.5">
                          +1: {g.rsvp.plusOneName}
                          {g.rsvp.notes ? <span className="text-stone/60"> · {g.rsvp.notes}</span> : null}
                        </span>
                      )}
                      {g.attendees.length > 0 && (
                        <div className="mt-0.5 flex flex-col gap-0.5">
                          {g.attendees.map((a) => (
                            <span key={a.id} className="text-[10px] text-stone">
                              👤 {a.name}
                              {a.dietaryNeeds ? <span className="text-stone/60"> · {a.dietaryNeeds}</span> : null}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3 text-stone hidden md:table-cell">{g.email}</td>
                    <td className="px-4 py-3 text-stone hidden lg:table-cell">{g.group || "—"}</td>

                    {/* VIP toggle */}
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleVip(g)}
                        className={`w-8 h-5 rounded-pill transition-colors duration-200 relative cursor-pointer
                          ${g.isVip ? "bg-gold-leaf" : "bg-dust"}`}
                      >
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-pearl shadow transition-transform duration-200
                          ${g.isVip ? "translate-x-3.5" : "translate-x-0.5"}`}/>
                      </button>
                    </td>

                    {/* RSVP */}
                    <td className="px-4 py-3 text-center">
                      {g.rsvp ? (
                        <span className={`inline-flex px-2 py-0.5 rounded-pill text-[10px] font-semibold uppercase tracking-wider
                          ${g.rsvp.confirmed ? "bg-sage/15 text-sage" : "bg-blush/10 text-blush"}`}>
                          {g.rsvp.confirmed ? "Sim" : "Não"}
                        </span>
                      ) : (
                        <span className="text-[10px] text-stone/50 uppercase tracking-wider">Pendente</span>
                      )}
                    </td>

                    {/* Check-in */}
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleCheckIn(g)}
                        title={g.checkedIn ? "Marcar como não chegou" : "Marcar como chegou"}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-pill text-[10px] font-semibold uppercase tracking-wider transition-colors cursor-pointer
                          ${g.checkedIn
                            ? "bg-sage/15 text-sage hover:bg-sage/25"
                            : "bg-dust/40 text-stone hover:bg-dust/60"
                          }`}
                      >
                        {g.checkedIn ? "✓ Chegou" : "—"}
                      </button>
                    </td>

                    {/* Ações */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(g)} className="p-1.5 text-stone hover:text-cornflower transition-colors rounded-md hover:bg-ice-blue/30 cursor-pointer" title="Editar">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button onClick={() => setDeleteId(g.id)} className="p-1.5 text-stone hover:text-blush transition-colors rounded-md hover:bg-blush/10 cursor-pointer" title="Remover">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editGuest ? "Editar Convidado" : "Novo Convidado"}>
        <div className="flex flex-col gap-4">
          <Input label="Nome completo" value={name} onChange={(e) => setName(e.target.value)} placeholder="Maria da Silva" />
          <Input label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="maria@email.com" />
          <Input label="Telefone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(11) 99999-9999" />
          <Input label="Grupo familiar" value={group} onChange={(e) => setGroup(e.target.value)} placeholder="Ex: Família Silva" />
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <div onClick={() => setIsVip(!isVip)} className={`w-9 h-5 rounded-pill transition-colors duration-200 relative ${isVip ? "bg-gold-leaf" : "bg-dust"}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-pearl shadow transition-transform duration-200 ${isVip ? "translate-x-4" : "translate-x-0.5"}`}/>
              </div>
              <span className="text-xs font-sans text-stone">VIP</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <div onClick={() => setPlusOne(!plusOne)} className={`w-9 h-5 rounded-pill transition-colors duration-200 relative ${plusOne ? "bg-cornflower" : "bg-dust"}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-pearl shadow transition-transform duration-200 ${plusOne ? "translate-x-4" : "translate-x-0.5"}`}/>
              </div>
              <span className="text-xs font-sans text-stone">Permite +1</span>
            </label>
          </div>
          <Button variant="primary" size="lg" onClick={handleSave} loading={saving} disabled={!name || !email} className="w-full">
            {editGuest ? "Salvar Alterações" : "Adicionar Convidado"}
          </Button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Confirmar Remoção" size="sm">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-stone font-sans">Tem certeza que deseja remover este convidado? Esta ação não pode ser desfeita.</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 text-sm text-stone font-sans font-medium border border-dust rounded-pill hover:bg-dust/20 transition-colors cursor-pointer">
              Cancelar
            </button>
            <Button variant="danger" onClick={handleDelete} className="flex-1">
              Remover
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
