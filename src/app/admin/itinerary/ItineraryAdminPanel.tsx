"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";

interface ItineraryAdminPanelProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialEvents: any[];
  initialTitle: string;
  initialSubtitle: string;
}

export default function ItineraryAdminPanel({
  initialEvents,
  initialTitle,
  initialSubtitle,
}: ItineraryAdminPanelProps) {
  const [events, setEvents] = useState(initialEvents);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Section title/subtitle
  const [sectionTitle, setSectionTitle] = useState(initialTitle);
  const [sectionSubtitle, setSectionSubtitle] = useState(initialSubtitle);
  const [savingSection, setSavingSection] = useState(false);
  const [sectionSaved, setSectionSaved] = useState(false);

  const [draft, setDraft] = useState({
    title: "", description: "", location: "", mapUrl: "",
    startTime: "", endTime: "", isVipOnly: false,
  });

  // Save section title/subtitle
  const handleSaveSection = async () => {
    setSavingSection(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itineraryTitle: sectionTitle,
          itinerarySubtitle: sectionSubtitle,
        }),
      });
      if (!res.ok) throw new Error("Erro ao salvar");
      setSectionSaved(true);
      setTimeout(() => setSectionSaved(false), 2000);
      toast("Título da seção salvo!", "success");
    } catch {
      setError("Erro ao salvar título da seção.");
      toast("Erro ao salvar título.", "error");
    } finally {
      setSavingSection(false);
    }
  };

  // Track if section fields changed
  const [sectionDirty, setSectionDirty] = useState(false);
  useEffect(() => {
    setSectionDirty(
      sectionTitle !== initialTitle || sectionSubtitle !== initialSubtitle
    );
  }, [sectionTitle, sectionSubtitle, initialTitle, initialSubtitle]);

  // Save new event
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: draft.title,
          description: draft.description,
          location: draft.location,
          isVipOnly: draft.isVipOnly,
          datetime: new Date(draft.startTime).toISOString(),
        }),
      });
      if (!res.ok) throw new Error("Erro ao salvar evento");
      const savedEvent = await res.json();
      const newEvents = [...events, savedEvent].sort(
        (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
      );
      setEvents(newEvents);
      setDraft({ title: "", description: "", location: "", mapUrl: "", startTime: "", endTime: "", isVipOnly: false });
      toast("Evento adicionado!", "success");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
      toast("Erro ao salvar evento.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Delete event
  const handleDelete = async (id: number) => {
    if (!confirm("Remover este evento?")) return;
    try {
      const res = await fetch(`/api/admin/itinerary?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao remover");
      setEvents(events.filter((ev) => ev.id !== id));
      toast("Evento removido.", "success");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    }
  };

  const inputCls = "w-full p-3 rounded-lg border border-dust hover:border-stone bg-pearl focus:ring-2 focus:ring-periwinkle outline-none text-charcoal font-sans text-sm transition-all";

  return (
    <div className="flex flex-col gap-8">
      {/* ─── Section Title/Subtitle ─── */}
      <div className="bg-pearl border border-dust rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-serif text-lg text-charcoal">Título da Seção</h2>
            <p className="text-xs text-stone font-sans mt-0.5">
              Título e subtítulo que aparecem no topo da seção Programação no site.
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSaveSection}
            disabled={savingSection || !sectionDirty}
            loading={savingSection}
          >
            {sectionSaved ? "Salvo ✓" : "Salvar Título"}
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-sans font-medium text-stone uppercase tracking-wider">
              Título do Itinerário
            </label>
            <input
              type="text"
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              placeholder="Ex: Programação do Dia"
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-sans font-medium text-stone uppercase tracking-wider">
              Subtítulo do Itinerário
            </label>
            <textarea
              value={sectionSubtitle}
              onChange={(e) => setSectionSubtitle(e.target.value)}
              placeholder="Ex: Cada momento foi pensado com carinho..."
              rows={2}
              className={inputCls + " resize-none"}
            />
          </div>
        </div>
      </div>

      {/* ─── Add Event Form ─── */}
      <div className="bg-pearl border border-dust rounded-2xl p-6">
        <h2 className="font-serif text-lg text-charcoal mb-6">Adicionar Evento</h2>

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-sans font-medium text-stone uppercase tracking-wider">Nome do Evento</label>
              <input
                type="text"
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                required
                className={inputCls}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-sans font-medium text-stone uppercase tracking-wider">Local / Endereço</label>
              <input
                type="text"
                value={draft.location}
                onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                required
                className={inputCls}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-sans font-medium text-stone uppercase tracking-wider">Descrição (Traje, Observações)</label>
            <textarea
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              rows={3}
              className={inputCls + " resize-none"}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-sans font-medium text-stone uppercase tracking-wider">Data e Hora de Início</label>
              <input
                type="datetime-local"
                value={draft.startTime}
                onChange={(e) => setDraft({ ...draft, startTime: e.target.value })}
                required
                className={inputCls}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-sans font-medium text-stone uppercase tracking-wider">Acesso Restrito</label>
              <label className={inputCls + " flex items-center gap-3 cursor-pointer"}>
                <input
                  type="checkbox"
                  checked={draft.isVipOnly}
                  onChange={(e) => setDraft({ ...draft, isVipOnly: e.target.checked })}
                  className="w-4 h-4 accent-cornflower"
                />
                <span className="text-sm font-sans text-charcoal">
                  Evento exclusivo para VIPs (ex: Jantar de Ensaio)
                </span>
              </label>
            </div>
          </div>

          {error && <p className="text-blush text-sm font-sans">{error}</p>}

          <div className="flex justify-end mt-2">
            <Button type="submit" variant="primary" loading={loading}>
              Salvar Evento
            </Button>
          </div>
        </form>
      </div>

      {/* ─── Events List ─── */}
      <div className="flex flex-col gap-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-pearl rounded-2xl border border-dust p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between"
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-serif text-lg text-charcoal">{event.title}</h3>
                {event.isVipOnly && (
                  <span className="px-2 py-0.5 bg-gold-leaf/10 text-gold-leaf rounded text-[10px] font-semibold border border-gold-leaf/20 uppercase tracking-wider">
                    VIP
                  </span>
                )}
              </div>
              {event.description && (
                <p className="text-stone text-sm font-sans">{event.description}</p>
              )}
              <div className="flex items-center gap-4 mt-2 text-sm text-stone font-sans">
                <span>
                  📅{" "}
                  {new Date(event.datetime).toLocaleString("pt-BR", {
                    dateStyle: "long",
                    timeStyle: "short",
                  })}
                </span>
                <span>📍 {event.location}</span>
              </div>
            </div>

            <button
              onClick={() => handleDelete(event.id)}
              className="text-sm font-medium text-blush hover:text-blush/70 transition-colors cursor-pointer shrink-0"
            >
              Remover
            </button>
          </div>
        ))}
        {events.length === 0 && (
          <div className="p-8 text-center text-stone font-sans text-sm border border-dust border-dashed rounded-2xl">
            Nenhum evento cadastrado.
          </div>
        )}
      </div>
    </div>
  );
}
