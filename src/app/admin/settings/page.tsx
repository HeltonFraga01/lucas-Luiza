"use client";

import { useState, useEffect, useRef } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { toast } from "@/components/ui/Toast";
import ImageUploader from "@/components/ui/ImageUploader";

interface Settings {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroImages: string;
  weddingDate: string;
  storyText: string;
  storyImage: string;
  primaryColor: string;
  secondaryColor: string;
  secretMessage: string;
  pixKey: string;
  footerText: string;
  itineraryTitle: string;
  itinerarySubtitle: string;
}

const defaultSettings: Settings = {
  heroTitle: "",
  heroSubtitle: "",
  heroImage: "",
  heroImages: "[]",
  weddingDate: "2026-11-15T16:00",
  storyText: "",
  storyImage: "",
  primaryColor: "#6B7FD4",
  secondaryColor: "#D6E4F7",
  secretMessage: "",
  pixKey: "",
  footerText: "Feito com 💙",
  itineraryTitle: "Programação do Dia",
  itinerarySubtitle: "Cada momento foi pensado com carinho para que todos aproveitem ao máximo este dia especial.",
};

// ═══════════════════════════════════════════════════════════════
// Section Card Component
// ═══════════════════════════════════════════════════════════════

function SectionCard({
  icon,
  title,
  description,
  children,
}: {
  icon: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-pearl rounded-xl border border-dust p-5 md:p-6 flex flex-col gap-5">
      <div>
        <h3 className="font-serif text-lg text-charcoal flex items-center gap-2">
          <span>{icon}</span> {title}
        </h3>
        {description && (
          <p className="text-[11px] text-stone/70 font-sans mt-1">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// Textarea Component
// ═══════════════════════════════════════════════════════════════

function Textarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  hint,
  isCode = false,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
  hint?: string;
  isCode?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-sans font-medium text-stone uppercase tracking-wider">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-4 py-3 text-sm text-charcoal bg-parchment
                   border-[1.5px] border-dust rounded-md placeholder:text-stone/60
                   focus:outline-none focus:ring-2 focus:ring-periwinkle focus:border-periwinkle
                   transition-all duration-300 resize-none
                   ${isCode ? "font-mono text-xs" : "font-sans"}`}
      />
      {hint && <p className="text-[10px] text-stone/60 font-sans">{hint}</p>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Color Picker
// ═══════════════════════════════════════════════════════════════

function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-sans font-medium text-stone uppercase tracking-wider">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-lg border border-dust cursor-pointer"
        />
        <span className="text-xs font-mono text-stone">{value}</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Hero Carousel Multi-Image Uploader
// ═══════════════════════════════════════════════════════════════

function HeroCarouselUploader({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  let images: string[] = [];
  try {
    images = JSON.parse(value || "[]");
    if (!Array.isArray(images)) images = [];
  } catch {
    images = [];
  }

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("preset", "hero");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const updated = [...images, data.url];
      onChange(JSON.stringify(updated));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao enviar";
      toast(msg, "error");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(JSON.stringify(updated));
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Image grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((url, i) => (
          <div
            key={`${url}-${i}`}
            className="relative group rounded-lg overflow-hidden border border-dust aspect-video"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={`Carrossel ${i + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => handleRemove(i)}
              className="absolute top-1 right-1 w-6 h-6 bg-charcoal/70 text-pearl rounded-full
                         text-xs flex items-center justify-center opacity-0 group-hover:opacity-100
                         transition-opacity hover:bg-red-500 cursor-pointer"
            >
              ✕
            </button>
            <span className="absolute bottom-1 left-1 bg-charcoal/50 text-pearl text-[9px] px-1.5 py-0.5 rounded font-mono">
              {i + 1}
            </span>
          </div>
        ))}

        {/* Add button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="rounded-lg border-2 border-dashed border-dust/60 hover:border-cornflower/60
                     aspect-video flex flex-col items-center justify-center gap-1
                     transition-all cursor-pointer hover:bg-ice-blue/30 disabled:opacity-50"
        >
          {uploading ? (
            <div className="w-5 h-5 border-2 border-cornflower border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span className="text-lg opacity-40">+</span>
              <span className="text-[10px] text-stone/50 font-sans">Adicionar</span>
            </>
          )}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
          e.target.value = "";
        }}
        className="hidden"
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Settings Page
// ═══════════════════════════════════════════════════════════════

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"geral" | "conteudo" | "avancado">("geral");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          // Format weddingDate for datetime-local input
          if (data.weddingDate) {
            const d = new Date(data.weddingDate);
            data.weddingDate = d.toISOString().slice(0, 16);
          }
          setSettings({ ...defaultSettings, ...data });
        }
      } catch {
        /* no-op */
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const update = (key: keyof Settings, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }
      toast("Configurações salvas com sucesso! ✓", "success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      toast(`Erro ao salvar: ${msg}`, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="skeleton w-48 h-8" />
        <div className="skeleton w-full h-12" />
        <div className="skeleton w-full h-12" />
        <div className="skeleton w-full h-12" />
      </div>
    );
  }

  const tabs = [
    { key: "geral" as const, label: "⚙️ Geral", desc: "Nomes, data e cores" },
    { key: "conteudo" as const, label: "📝 Conteúdo", desc: "Textos, imagens e jogo" },
    { key: "avancado" as const, label: "💰 PIX & Rodapé", desc: "Pagamentos e footer" },
  ];

  return (
    <div className="flex flex-col gap-6 pb-24 relative">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl text-charcoal">Configurações</h1>
        <p className="text-stone text-xs font-sans mt-0.5">
          Personalize todos os textos, imagens e funcionalidades do site.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-sky-wash p-1 rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 px-3 py-2.5 text-xs font-sans font-medium rounded-lg transition-all duration-200 cursor-pointer
              ${
                activeTab === tab.key
                  ? "bg-pearl text-charcoal shadow-sm"
                  : "text-stone hover:text-charcoal hover:bg-pearl/50"
              }`}
          >
            <span className="block">{tab.label}</span>
            <span className="block text-[10px] mt-0.5 opacity-60">{tab.desc}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex flex-col gap-6">
        {/* ─── TAB: GERAL ─── */}
        {activeTab === "geral" && (
          <>
            <SectionCard
              icon="💍"
              title="Identificação do Casal"
              description="Nome que aparece no hero, navbar e footer do site."
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nome do Casal"
                  value={settings.heroTitle}
                  onChange={(e) => update("heroTitle", e.target.value)}
                  placeholder="Luiza & Lucas"
                />
                <Input
                  label="Subtítulo / Data Exibida"
                  value={settings.heroSubtitle}
                  onChange={(e) => update("heroSubtitle", e.target.value)}
                  placeholder="15 de Novembro de 2026"
                />
              </div>
            </SectionCard>

            <SectionCard
              icon="📅"
              title="Data do Casamento"
              description="Usado no countdown regressivo e no footer. Altere aqui para atualizar automaticamente."
            >
              <Input
                label="Data e Hora do Casamento"
                type="datetime-local"
                value={settings.weddingDate}
                onChange={(e) => update("weddingDate", e.target.value)}
              />
            </SectionCard>

            <SectionCard
              icon="🎨"
              title="Paleta de Cores"
              description="Cores que definem o visual do site. Afetam partículas, botões e destaques."
            >
              <div className="grid grid-cols-2 gap-6">
                <ColorPicker
                  label="Cor Primária"
                  value={settings.primaryColor}
                  onChange={(v) => update("primaryColor", v)}
                />
                <ColorPicker
                  label="Cor Secundária"
                  value={settings.secondaryColor}
                  onChange={(v) => update("secondaryColor", v)}
                />
              </div>
            </SectionCard>
          </>
        )}

        {/* ─── TAB: CONTEÚDO ─── */}
        {activeTab === "conteudo" && (
          <>
            <SectionCard
              icon="🖼️"
              title="Seção Hero (Topo do Site)"
              description="Imagens que aparecem no carrossel de fundo do cabeçalho."
            >
              <ImageUploader
                label="Imagem Principal"
                value={settings.heroImage}
                onChange={(url) => update("heroImage", url)}
                preset="hero"
                aspectRatio="16/9"
                hint="Imagem de fundo principal do topo. Será otimizada para 1920×1080."
              />

              <div className="flex flex-col gap-2">
                <label className="text-xs font-sans font-medium text-stone uppercase tracking-wider">
                  Imagens do Carrossel
                </label>
                <p className="text-[10px] text-stone/50 font-sans -mt-1">
                  Adicione várias imagens para o slideshow do hero. Cada imagem será otimizada automaticamente.
                </p>
                <HeroCarouselUploader
                  value={settings.heroImages}
                  onChange={(v) => update("heroImages", v)}
                />
              </div>
            </SectionCard>

            <SectionCard
              icon="📖"
              title="Nossa História"
              description="Texto de introdução e foto da seção 'Nossa História'. Os marcos da timeline são gerenciados em Grandes Momentos."
            >
              <Textarea
                label="Texto da História"
                value={settings.storyText}
                onChange={(v) => update("storyText", v)}
                placeholder="Conte a história do casal..."
                rows={5}
              />
              <ImageUploader
                label="Foto da História"
                value={settings.storyImage}
                onChange={(url) => update("storyImage", url)}
                preset="story"
                aspectRatio="4/3"
                hint="Imagem da seção 'Nossa História'. Será otimizada para 800×600."
              />
            </SectionCard>

            <SectionCard
              icon="🎮"
              title="Mini-Game (Surpresa)"
              description='Mensagem secreta que o convidado vê quando completa o jogo. Aparece na tela de vitória junto com confetes.'
            >
              <Textarea
                label="Mensagem Secreta"
                value={settings.secretMessage}
                onChange={(v) => update("secretMessage", v)}
                placeholder="Obrigado por estar nessa jornada com a gente! Cada pessoa que estará presente faz parte da nossa história..."
                rows={4}
                hint="Esta mensagem é revelada quando o convidado completa o mini-game do Hero."
              />
            </SectionCard>
          </>
        )}

        {/* ─── TAB: PIX & RODAPÉ ─── */}
        {activeTab === "avancado" && (
          <>
            <SectionCard
              icon="💰"
              title="Configuração PIX"
              description="Chave PIX para receber contribuições dos presentes. Pode ser CPF, e-mail, telefone ou chave aleatória."
            >
              <Input
                label="Chave PIX"
                value={settings.pixKey}
                onChange={(e) => update("pixKey", e.target.value)}
                placeholder="seu-email@gmail.com ou CPF ou chace aleatória"
              />
              <p className="text-[10px] text-stone/60 font-sans -mt-2">
                Esta chave será utilizada nos QR Codes gerados para pagamento de presentes.
              </p>
            </SectionCard>

            <SectionCard
              icon="📋"
              title="Rodapé do Site"
              description="Texto e informações que aparecem no final de cada página."
            >
              <Input
                label="Texto do Rodapé"
                value={settings.footerText}
                onChange={(e) => update("footerText", e.target.value)}
                placeholder="Feito com 💙"
              />
              <div className="bg-parchment rounded-lg p-4 border border-dust/50">
                <p className="text-[10px] text-stone/60 font-sans uppercase tracking-wider mb-2">
                  Pré-visualização do Rodapé
                </p>
                <div className="text-center">
                  <p className="font-display italic text-base text-navy-deep">
                    {settings.heroTitle || "Luiza & Lucas"}
                  </p>
                  <p className="text-[10px] text-stone font-sans mt-1">
                    {settings.heroSubtitle || "15 de Novembro de 2026"} · {settings.footerText || "Feito com 💙"}
                  </p>
                  <p className="text-[9px] text-stone/40 font-sans mt-2">
                    © 2026 FragaCom — Wedding Experience
                  </p>
                </div>
              </div>
            </SectionCard>
          </>
        )}
      </div>

      {/* Save Button — always visible */}
      <div className="sticky bottom-4 z-10">
        <Button
          variant="primary"
          size="lg"
          onClick={handleSave}
          loading={saving}
          className="w-full shadow-hover"
        >
          Salvar Configurações ✓
        </Button>
      </div>
    </div>
  );
}
