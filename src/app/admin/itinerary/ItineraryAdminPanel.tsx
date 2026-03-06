"use client";

import { useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ItineraryAdminPanel({ initialEvents }: { initialEvents: any[] }) {
  const [events, setEvents] = useState(initialEvents);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [draft, setDraft] = useState({
    title: "", description: "", location: "", mapUrl: "", 
    startTime: "", endTime: "", isVipOnly: false
  });

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
      
      const newEvents = [...events, savedEvent].sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
      setEvents(newEvents);
      
      // Reset form
      setDraft({ title: "", description: "", location: "", mapUrl: "", startTime: "", endTime: "", isVipOnly: false });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Event Form */}
      <div className="bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
        <h2 className="text-xl font-medium mb-6">Adicionar Evento</h2>
        
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Nome do Evento</label>
              <input 
                type="text" 
                value={draft.title} 
                onChange={(e) => setDraft({...draft, title: e.target.value})}
                required
                className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-[#d4af37] outline-none" 
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Local / Endereço</label>
              <input 
                type="text" 
                value={draft.location} 
                onChange={(e) => setDraft({...draft, location: e.target.value})}
                required
                className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-[#d4af37] outline-none" 
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Descrição (Traje, Observações)</label>
            <textarea 
              value={draft.description} 
              onChange={(e) => setDraft({...draft, description: e.target.value})}
              rows={3}
              className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-[#d4af37] outline-none resize-none" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Data e Hora de Início</label>
              <input 
                type="datetime-local" 
                value={draft.startTime} 
                onChange={(e) => setDraft({...draft, startTime: e.target.value})}
                required
                className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-[#d4af37] outline-none" 
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Acesso Restrito</label>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 cursor-pointer h-full">
                <input 
                  type="checkbox" 
                  checked={draft.isVipOnly}
                  onChange={(e) => setDraft({...draft, isVipOnly: e.target.checked})}
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
              className="px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50"
            >
              {loading ? "Salvando..." : "Salvar Evento"}
            </button>
          </div>
        </form>
      </div>

      {/* Events List */}
      <div className="flex flex-col gap-4">
        {events.map((event) => (
          <div key={event.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between shadow-sm">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-semibold text-xl text-zinc-900 dark:text-zinc-100">{event.title}</h3>
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
                  {new Date(event.datetime).toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' })}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#d4af37]">📍</span>
                  {event.location}
                </div>
              </div>
            </div>

            <button className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors">
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
