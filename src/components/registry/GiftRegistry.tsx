"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import { toast } from "@/components/ui/Toast";

interface PixData {
  payload: string;       // PIX copia e cola
  qrCodeBase64: string;  // data:image/png;base64,...
  pixKey: string;
  amount: number;
}

// ═══════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════

interface GiftItem {
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
  createdAt: string;
}

type SortOption = "most-wanted" | "price-asc" | "price-desc" | "newest";

const CATEGORIES = [
  "Todos",
  "Cozinha",
  "Quarto e Banho",
  "Casa",
  "Aventuras",
  "Fundo de Experiência",
  "Outros",
];

const PRICE_RANGES = [
  { label: "Qualquer valor", min: 0, max: Infinity },
  { label: "Até R$ 100", min: 0, max: 100 },
  { label: "R$ 100 – R$ 300", min: 100, max: 300 },
  { label: "Acima de R$ 300", min: 300, max: Infinity },
];

// ═══════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════

export default function GiftRegistry() {
  const [gifts, setGifts] = useState<GiftItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [category, setCategory] = useState("Todos");
  const [priceRange, setPriceRange] = useState(0);
  const [hideReceived, setHideReceived] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>("most-wanted");
  const [showFilters, setShowFilters] = useState(false);

  // Modals
  const [selectedGift, setSelectedGift] = useState<GiftItem | null>(null);
  const [pixGift, setPixGift] = useState<GiftItem | null>(null);
  const [contribAmount, setContribAmount] = useState("");
  const [contribName, setContribName] = useState("");
  const [contribEmail, setContribEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch gifts
  useEffect(() => {
    async function fetchGifts() {
      try {
        const res = await fetch("/api/registry");
        if (res.ok) {
          const data = await res.json();
          setGifts(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchGifts();
  }, []);

  // Restore contributor from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("rsvp_guest");
      if (saved) {
        const parsed = JSON.parse(saved);
        setContribName(parsed.name || "");
        setContribEmail(parsed.email || "");
      }
    } catch { /* no-op */ }
  }, []);

  // Filtered + sorted
  const filtered = useMemo(() => {
    const range = PRICE_RANGES[priceRange];
    let result = gifts.filter((g) => {
      if (category !== "Todos" && g.category !== category) return false;
      if (g.price < range.min || g.price > range.max) return false;
      if (hideReceived && g.isPurchased) return false;
      return true;
    });

    switch (sortBy) {
      case "most-wanted":
        result = [...result].sort((a, b) => (b.isMostWanted ? 1 : 0) - (a.isMostWanted ? 1 : 0));
        break;
      case "price-asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result = [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }
    return result;
  }, [gifts, category, priceRange, hideReceived, sortBy]);

  // Determine if a gift should be a large tile (2x2)
  const isLargeTile = useCallback((gift: GiftItem) => {
    return gift.isGroupGift || gift.price > 1000 || gift.isMostWanted;
  }, []);

  // PIX data state
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [pixLoading, setPixLoading] = useState(false);
  const [pixCopied, setPixCopied] = useState(false);

  // Open PIX flow — generate real PIX payload from server
  const handleContribute = useCallback(async (gift: GiftItem) => {
    setSelectedGift(null);
    setPixGift(gift);
    setPixData(null);
    setPixCopied(false);
    const amount = gift.isGroupGift ? 0 : gift.price;
    setContribAmount(gift.isGroupGift ? "" : gift.price.toString());

    if (!gift.isGroupGift && amount > 0) {
      setPixLoading(true);
      try {
        const res = await fetch("/api/pix/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount,
            giftTitle: gift.title,
            transactionId: `G${gift.id}T${Date.now().toString(36)}`,
          }),
        });
        if (res.ok) {
          setPixData(await res.json());
        } else {
          const err = await res.json();
          toast(err.error || "Erro ao gerar PIX", "error");
        }
      } catch {
        toast("Erro ao gerar PIX. Tente novamente.", "error");
      } finally {
        setPixLoading(false);
      }
    }
  }, []);

  // For group gifts, generate PIX when user sets the amount
  const handleGenerateGroupPix = useCallback(async () => {
    if (!pixGift || !contribAmount || parseFloat(contribAmount) <= 0) return;
    setPixLoading(true);
    setPixData(null);
    setPixCopied(false);
    try {
      const res = await fetch("/api/pix/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(contribAmount),
          giftTitle: pixGift.title,
          transactionId: `G${pixGift.id}T${Date.now().toString(36)}`,
        }),
      });
      if (res.ok) {
        setPixData(await res.json());
      } else {
        const err = await res.json();
        toast(err.error || "Erro ao gerar PIX", "error");
      }
    } catch {
      toast("Erro ao gerar PIX. Tente novamente.", "error");
    } finally {
      setPixLoading(false);
    }
  }, [pixGift, contribAmount]);

  // Submit contribution record
  const handleSubmitContribution = useCallback(async () => {
    if (!pixGift || !contribName || !contribEmail || !contribAmount) return;
    setSubmitting(true);

    try {
      localStorage.setItem("rsvp_guest", JSON.stringify({ name: contribName, email: contribEmail }));

      const res = await fetch("/api/registry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          giftItemId: pixGift.id,
          contributorName: contribName,
          contributorEmail: contribEmail,
          amount: parseFloat(contribAmount),
          paymentMethod: "pix",
        }),
      });

      if (!res.ok) throw new Error("Erro ao registrar contribuição");

      toast("Contribuição registrada com sucesso! 🎉", "success");
      setPixGift(null);
      setPixData(null);

      const updated = await fetch("/api/registry");
      if (updated.ok) setGifts(await updated.json());
    } catch {
      toast("Erro ao registrar contribuição. Tente novamente.", "error");
    } finally {
      setSubmitting(false);
    }
  }, [pixGift, contribName, contribEmail, contribAmount]);

  const handleCopyPixPayload = useCallback(() => {
    if (!pixData?.payload) return;
    navigator.clipboard.writeText(pixData.payload);
    setPixCopied(true);
    toast("PIX Copia e Cola copiado! 📋", "success");
    setTimeout(() => setPixCopied(false), 3000);
  }, [pixData]);

  const resetFilters = useCallback(() => {
    setCategory("Todos");
    setPriceRange(0);
    setHideReceived(true);
    setSortBy("most-wanted");
  }, []);

  return (
    <section id="presentes" className="relative w-full py-20 md:py-32 bg-sky-wash">
      {/* Watercolor decoration */}
      <div
        className="absolute top-0 left-0 w-1/2 h-1/3 pointer-events-none opacity-30"
        style={{ background: "radial-gradient(ellipse at 20% 20%, rgba(107,127,212,0.12) 0%, transparent 60%)" }}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* ── Section Header ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <h2 className="font-display italic font-light text-navy-deep mb-3">
            Lista de Presentes
          </h2>
          <p className="text-stone text-sm font-sans max-w-lg mx-auto">
            O maior presente é a sua presença. Mas se desejar nos presentear, ficaremos muito felizes
            com qualquer contribuição para a nossa nova vida juntos.
          </p>
        </motion.div>

        {/* ── Filters Bar ─────────────────────────────────── */}
        <div className="mb-8">
          {/* Category pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-4 py-2 rounded-pill text-xs font-sans font-medium tracking-wide
                            transition-all duration-300 cursor-pointer
                            ${category === c
                              ? "bg-cornflower text-pearl shadow-sm"
                              : "bg-pearl text-stone border border-dust hover:border-cornflower hover:text-cornflower"
                            }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Toggle filters */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-xs text-stone font-sans hover:text-cornflower transition-colors cursor-pointer flex items-center gap-1"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
              </svg>
              {showFilters ? "Ocultar filtros" : "Mais filtros"}
            </button>

            {(category !== "Todos" || priceRange !== 0 || !hideReceived) && (
              <button
                onClick={resetFilters}
                className="text-xs text-blush font-sans hover:underline transition-colors cursor-pointer"
              >
                Limpar filtros
              </button>
            )}
          </div>

          {/* Expanded filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap items-center justify-center gap-6 mt-4 p-4 bg-pearl rounded-xl shadow-card">
                  {/* Price range */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-sans text-stone uppercase tracking-wider">Faixa de preço</span>
                    <select
                      value={priceRange}
                      onChange={(e) => setPriceRange(Number(e.target.value))}
                      className="text-sm font-sans text-charcoal bg-transparent border-b border-dust
                                 focus:border-cornflower outline-none pb-1 cursor-pointer"
                    >
                      {PRICE_RANGES.map((r, i) => (
                        <option key={i} value={i}>{r.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Sort */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-sans text-stone uppercase tracking-wider">Ordenar por</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="text-sm font-sans text-charcoal bg-transparent border-b border-dust
                                 focus:border-cornflower outline-none pb-1 cursor-pointer"
                    >
                      <option value="most-wanted">Mais desejados</option>
                      <option value="price-asc">Preço (menor)</option>
                      <option value="price-desc">Preço (maior)</option>
                      <option value="newest">Recém adicionados</option>
                    </select>
                  </div>

                  {/* Toggle received */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div
                      className={`w-9 h-5 rounded-pill transition-colors duration-200 relative
                                  ${hideReceived ? "bg-cornflower" : "bg-dust"}`}
                      onClick={() => setHideReceived(!hideReceived)}
                    >
                      <div
                        className={`absolute top-0.5 w-4 h-4 rounded-full bg-pearl shadow transition-transform duration-200
                                    ${hideReceived ? "translate-x-4" : "translate-x-0.5"}`}
                      />
                    </div>
                    <span className="text-xs font-sans text-stone">Só disponíveis</span>
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Bento Grid ──────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={`skeleton ${i < 2 ? "sm:col-span-2 sm:row-span-2 aspect-square" : "aspect-square"}`} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <span className="text-5xl">🎁</span>
            <p className="text-stone font-sans text-center">
              Nenhum presente encontrado com esses filtros.
            </p>
            <button
              onClick={resetFilters}
              className="text-sm text-cornflower font-sans font-medium hover:underline cursor-pointer"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-[280px]"
          >
            {filtered.map((gift) => {
              const large = isLargeTile(gift);
              return (
                <motion.div
                  key={gift.id}
                  variants={fadeInUp}
                  layout
                  onClick={() => setSelectedGift(gift)}
                  className={`
                    group relative rounded-xl overflow-hidden cursor-pointer
                    shadow-card hover:shadow-hover transition-shadow duration-300
                    ${large ? "sm:col-span-2 sm:row-span-2" : ""}
                  `}
                >
                  {/* Image */}
                  {gift.imageUrl ? (
                    <Image
                      src={gift.imageUrl}
                      alt={gift.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes={large ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 25vw"}
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-dust/30 flex items-center justify-center">
                      <span className="text-4xl opacity-40">🎁</span>
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-charcoal/70 via-charcoal/20 to-transparent
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Always-visible bottom info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4
                                  bg-linear-to-t from-charcoal/60 to-transparent">
                    <h4 className="font-serif text-sm md:text-base text-pearl leading-tight line-clamp-2 mb-1">
                      {gift.title}
                    </h4>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-sans text-sm font-semibold text-gold-light">
                        R$ {gift.price.toLocaleString("pt-BR")}
                      </span>
                      <span className="text-[10px] text-pearl/70 font-sans uppercase tracking-wider">
                        {gift.category}
                      </span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {gift.isMostWanted && <Badge variant="gold" size="sm">★ Mais desejado</Badge>}
                    {gift.isGroupGift && <Badge variant="default" size="sm">Vaquinha</Badge>}
                    {gift.isPurchased && <Badge variant="success" size="sm">Recebido ✓</Badge>}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* ═══ Gift Detail Modal ═══════════════════════════════ */}
      <Modal
        isOpen={!!selectedGift}
        onClose={() => setSelectedGift(null)}
        title={selectedGift?.title}
        size="lg"
      >
        {selectedGift && (
          <div className="flex flex-col gap-5">
            {/* Image */}
            {selectedGift.imageUrl && (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                <Image
                  src={selectedGift.imageUrl}
                  alt={selectedGift.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 600px"
                  unoptimized
                />
              </div>
            )}

            {/* Info */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-serif text-2xl text-gold-leaf font-medium">
                R$ {selectedGift.price.toLocaleString("pt-BR")}
              </span>
              <Badge variant={selectedGift.isPurchased ? "success" : "default"}>
                {selectedGift.isPurchased ? "Recebido ✓" : "Disponível"}
              </Badge>
              {selectedGift.isMostWanted && <Badge variant="gold">★ Mais desejado</Badge>}
            </div>

            {selectedGift.description && (
              <p className="text-stone text-sm font-sans leading-relaxed">
                {selectedGift.description}
              </p>
            )}

            {/* Group gift progress */}
            {selectedGift.isGroupGift && selectedGift.targetAmount && (
              <ProgressBar
                value={selectedGift.raisedAmount}
                max={selectedGift.targetAmount}
                labelFormat="currency"
                variant="gold"
              />
            )}

            {/* Actions */}
            <div className="flex gap-3 mt-2">
              {selectedGift.isPurchased ? (
                <p className="text-stone font-sans text-sm italic">
                  Este presente já foi recebido. Obrigado pela intenção! 💙
                </p>
              ) : (
                <>
                  <Button
                    variant="primary"
                    size="lg"
                    className="flex-1"
                    onClick={() => handleContribute(selectedGift)}
                  >
                    Contribuir via PIX
                  </Button>
                  {selectedGift.externalUrl && (
                    <a
                      href={selectedGift.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-5 py-3
                                 border-[1.5px] border-dust rounded-pill text-sm font-sans font-medium text-stone
                                 hover:border-cornflower hover:text-cornflower transition-all duration-300"
                    >
                      Ver na loja ↗
                    </a>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* ═══ PIX Checkout Modal ══════════════════════════════ */}
      <Modal
        isOpen={!!pixGift}
        onClose={() => { setPixGift(null); setPixData(null); }}
        title="Contribuir via PIX"
        size="md"
      >
        {pixGift && (
          <div className="flex flex-col gap-5">
            {/* Summary */}
            <div className="bg-sky-wash rounded-lg p-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-serif text-base text-charcoal leading-snug">{pixGift.title}</p>
                <p className="text-xs text-stone font-sans mt-0.5">{pixGift.category}</p>
              </div>
              {contribAmount && parseFloat(contribAmount) > 0 && (
                <span className="font-serif text-xl text-gold-leaf font-medium shrink-0 whitespace-nowrap">
                  R$&nbsp;{parseFloat(contribAmount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              )}
            </div>

            {/* Contributor info */}
            <Input
              label="Seu Nome"
              value={contribName}
              onChange={(e) => setContribName(e.target.value)}
              placeholder="Nome completo"
            />

            <Input
              label="Seu E-mail"
              type="email"
              value={contribEmail}
              onChange={(e) => setContribEmail(e.target.value)}
              placeholder="seu@email.com"
            />

            {/* Group gift: custom amount + generate button */}
            {pixGift.isGroupGift && (
              <div className="flex flex-col gap-2">
                <Input
                  label="Valor da contribuição"
                  type="number"
                  value={contribAmount}
                  onChange={(e) => { setContribAmount(e.target.value); setPixData(null); }}
                  placeholder="Ex: 100.00"
                  hint="Digite o valor que deseja contribuir."
                />
                {parseFloat(contribAmount || "0") > 0 && !pixData && (
                  <Button
                    variant="secondary"
                    onClick={handleGenerateGroupPix}
                    loading={pixLoading}
                    disabled={pixLoading}
                    className="w-full"
                  >
                    Gerar PIX para R$ {parseFloat(contribAmount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </Button>
                )}
              </div>
            )}

            {/* PIX Payment Area */}
            <div className="bg-parchment rounded-xl p-5 flex flex-col items-center gap-4 border border-dust">
              {pixLoading ? (
                <div className="flex flex-col items-center gap-3 py-6">
                  <div className="w-8 h-8 border-2 border-cornflower border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-stone font-sans">Gerando PIX...</p>
                </div>
              ) : pixData ? (
                <>
                  {/* QR Code Image */}
                  <div className="w-52 h-52 bg-pearl rounded-xl border border-dust/60 flex items-center justify-center p-2 shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={pixData.qrCodeBase64}
                      alt="QR Code PIX"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="text-center">
                    <p className="text-sm font-sans font-semibold text-charcoal">
                      R$ {pixData.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-stone font-sans mt-1">
                      Escaneie o QR Code acima no app do seu banco
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-3 w-full">
                    <div className="flex-1 h-px bg-dust" />
                    <span className="text-[10px] text-stone/60 font-sans uppercase tracking-wider">ou</span>
                    <div className="flex-1 h-px bg-dust" />
                  </div>

                  {/* PIX Copia e Cola */}
                  <div className="w-full">
                    <label className="text-[10px] text-stone font-sans uppercase tracking-wider mb-1 block">
                      PIX Copia e Cola
                    </label>
                    <div className="flex w-full gap-2">
                      <input
                        type="text"
                        readOnly
                        value={pixData.payload}
                        className="flex-1 px-3 py-2.5 text-[10px] font-mono text-stone bg-pearl
                                   border border-dust rounded-md truncate select-all"
                        onClick={(e) => (e.target as HTMLInputElement).select()}
                      />
                      <button
                        onClick={handleCopyPixPayload}
                        className={`px-4 py-2.5 text-xs font-sans font-medium rounded-md
                                    transition-all cursor-pointer shrink-0
                                    ${pixCopied
                                      ? "bg-sage text-pearl"
                                      : "bg-cornflower text-pearl hover:bg-cornflower-600"
                                    }`}
                      >
                        {pixCopied ? "Copiado ✓" : "Copiar"}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-3 py-6 text-center">
                  <span className="text-4xl">💰</span>
                  <p className="text-xs text-stone font-sans">
                    {pixGift.isGroupGift
                      ? "Defina o valor acima e clique em \"Gerar PIX\" para visualizar o QR Code."
                      : "Configure a chave PIX no painel admin para gerar o pagamento."}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => { setPixGift(null); setPixData(null); }}
                className="px-5 py-3 text-sm text-stone font-sans font-medium hover:text-cornflower transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <Button
                variant="primary"
                size="lg"
                className="flex-1"
                onClick={handleSubmitContribution}
                loading={submitting}
                disabled={!contribName || !contribEmail || !contribAmount || !pixData}
              >
                Confirmar Pagamento ✓
              </Button>
            </div>

            <p className="text-[10px] text-stone/60 font-sans text-center">
              100% do valor vai diretamente para os noivos. Taxa zero.
            </p>
          </div>
        )}
      </Modal>
    </section>
  );
}
