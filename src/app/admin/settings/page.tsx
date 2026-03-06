"use client";

import { useState, useEffect } from "react";

export default function SettingsAdminPanel() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [heroImagesInput, setHeroImagesInput] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        setSettings(data);
        if (data.heroImages) {
          try {
             const parsed = JSON.parse(data.heroImages);
             if (Array.isArray(parsed)) setHeroImagesInput(parsed.join('\n'));
          } catch(e){}
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error("Erro ao salvar");
      setMessage("Configurações salvas com sucesso!");
    } catch (error) {
      console.error(error);
      setMessage("Erro ao salvar configurações.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-zinc-900 dark:text-zinc-100">Personalização</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2">Personalize textos, imagens e cores da sua página pública.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-[#d4af37] text-white rounded-xl font-medium hover:bg-[#b8952b] transition-colors whitespace-nowrap disabled:opacity-50"
        >
          {saving ? "Salvando..." : "Salvar Alterações"}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-xl ${message.includes("Erro") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        
        {/* Seção Hero */}
        <div className="bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col gap-4">
          <h2 className="text-xl font-serif text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">Cabeçalho (Hero)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Título (Nomes)</label>
              <input 
                type="text" 
                value={settings?.heroTitle || ""}
                onChange={(e) => setSettings({...settings, heroTitle: e.target.value})}
                className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500" 
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Subtítulo (Data)</label>
              <input 
                type="text" 
                value={settings?.heroSubtitle || ""}
                onChange={(e) => setSettings({...settings, heroSubtitle: e.target.value})}
                className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500" 
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">URLs das Imagens de Fundo (Carrossel)</label>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Insira uma URL por linha. Estas imagens alternarão a cada 5 segundos.</p>
            <textarea 
              rows={4}
              value={heroImagesInput}
              onChange={(e) => {
                setHeroImagesInput(e.target.value);
                const lines = e.target.value.split('\n').map(l => l.trim()).filter(l => l.length > 0);
                setSettings({...settings, heroImages: JSON.stringify(lines)});
              }}
              placeholder={"https://exemplo.com/foto1.jpg\nhttps://exemplo.com/foto2.jpg"}
              className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 outline-none resize-y placeholder:text-zinc-400 dark:placeholder:text-zinc-500" 
            />
          </div>
        </div>

        {/* Seção História */}
        <div className="bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col gap-4">
          <h2 className="text-xl font-serif text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">Nossa História</h2>
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Texto da História</label>
            <textarea 
              rows={6}
              value={settings?.storyText || ""}
              onChange={(e) => setSettings({...settings, storyText: e.target.value})}
              className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 outline-none resize-y placeholder:text-zinc-400 dark:placeholder:text-zinc-500" 
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">URL da Imagem da História</label>
            <input 
              type="text" 
              value={settings?.storyImage || ""}
              onChange={(e) => setSettings({...settings, storyImage: e.target.value})}
              className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500" 
            />
          </div>
        </div>

        {/* Seção Cores */}
        <div className="bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col gap-4">
          <h2 className="text-xl font-serif text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">Cores do Tema</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Cor Principal (Botões e Destaques)</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={settings?.primaryColor || "#d4af37"}
                  onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                  className="w-12 h-12 rounded cursor-pointer border-none p-0" 
                />
                <input 
                  type="text" 
                  value={settings?.primaryColor || "#d4af37"}
                  onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                  className="flex-1 p-3 font-mono rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500" 
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Cor Secundária (Fundos Alternativos)</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={settings?.secondaryColor || "#fdf4e3"}
                  onChange={(e) => setSettings({...settings, secondaryColor: e.target.value})}
                  className="w-12 h-12 rounded cursor-pointer border-none p-0" 
                />
                <input 
                  type="text" 
                  value={settings?.secondaryColor || "#fdf4e3"}
                  onChange={(e) => setSettings({...settings, secondaryColor: e.target.value})}
                  className="flex-1 p-3 font-mono rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500" 
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
