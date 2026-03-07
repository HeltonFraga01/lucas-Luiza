"use client";

import { useState, useEffect } from "react";

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
    } catch {
      setError("Erro ao salvar título da seção.");
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

      // Reset form
      setDraft({
        title: "", description: "", location: "", mapUrl: "",
        startTime: "", endTime: "", isVipOnly: false,
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete event
  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/itinerary?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erro ao remover");
      setEvents(events.filter((ev) => ev.id !== id));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* ─── Section Title/Subtitle ─── */}
      <div className="bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
              📋 Título da Seção
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Título e subtítulo que aparecem no topo da seção Programação no site.
            </p>
          </div>
          <button
            onClick={handleSaveSection}
            disabled={savingSection || !sectionDirty}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              sectionSaved
                ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                : "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800"
            }`}
          >
            {savingSection ? "Salvando..." : sectionSaved ? "Salvo ✓" : "Salvar Título"}
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Título do Itinerário
            </label>
            <input
              type="text"
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              placeholder="Ex: Programação do Dia"
              className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-[#d4af37] outline-none text-zinc-900 dark:text-zinc-100"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Subtítulo do Itinerário
            </label>
            <textarea
              value={sectionSubtitle}
              onChange={(e) => setSectionSubtitle(e.target.value)}
              placeholder="Ex: Cada momento foi pensado com carinho..."
              rows={2}
              className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-[#d4af37] outline-none resize-none text-zinc-900 dark:text-zinc-100"
            />
          </div>
        </div>
      </div>

      {/* ─── Add Event Form ─── */}
      <div className="bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
        <h2 className="text-xl font-medium mb-6 text-zinc-900 dark:text-zinc-100">Adicionar Evento</h2>

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Nome do Evento</label>
              <input
                type="text"
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                required
                className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-[#d4af37] outline-none text-zinc-900 dark:text-zinc-100"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Local / Endereço</label>
              <input
                type="text"
                value={draft.location}
                onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                required
                className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-[#d4af37] outline-none text-zinc-900 dark:text-zinc-100"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Descrição (Traje, Observações)</label>
            <textarea
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              rows={3}
              className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-[#d4af37] outline-none resize-none text-zinc-900 dark:text-zinc-100"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Data e Hora de Início</label>
              <input
                type="datetime-local"
                value={draft.startTime}
                onChange={(e) => setDraft({ ...draft, startTime: e.target.value })}
                required
                className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-[#d4af37] outline-none text-zinc-900 dark:text-zinc-100"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Acesso Restrito</label>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 cursor-pointer h-full">
                <input
                  type="checkbox"
                  checked={draft.isVipOnly}
                  onChange={(e) => setDraft({ ...draft, isVipOnly: e.target.checked })}
                  className="w-4 h-4 text-[#d4af37]"
                />
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Evento exclusivo para VIPs (ex: Jantar de Ensaio)
                </span>
              </label>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Salvando..." : "Salvar Evento"}
            </button>
          </div>
        </form>
      </div>

      {/* ─── Events List ─── */}
      <div className="flex flex-col gap-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between shadow-sm"
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-semibold text-xl text-zinc-900 dark:text-zinc-100">
                  {event.title}
                </h3>
                {event.isVipOnly && (
                  <span className="px-2 py-0.5 bg-[#d4af37]/10 text-[#a08226] dark:text-[#d4af37] rounded text-xs font-bold border border-[#d4af37]/20">
                    VIP
                  </span>
                )}
              </div>
              <p className="text-zinc-500 text-sm">{event.description}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#d4af37]">📅</span>
                  {new Date(event.datetime).toLocaleString("pt-BR", {
                    dateStyle: "long",
                    timeStyle: "short",
                  })}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#d4af37]">📍</span>
                  {event.location}
                </div>
              </div>
            </div>

            <button
              onClick={() => handleDelete(event.id)}
              className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors cursor-pointer"
            >
              Remover
            </button>
          </div>
        ))}
        {events.length === 0 && (
          <div className="p-8 text-center text-zinc-500 border border-zinc-200 dark:border-zinc-800 border-dashed rounded-2xl">
            Nenhum evento cadastrado.
          </div>
        )}
      </div>
    </div>
  );
}
