"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { slideLeft } from "@/lib/motion";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

// ═══════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════

interface GuestData {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  group: string | null;
  isVip: boolean;
  plusOneAllowed: boolean;
  attendees: AttendeeData[];
  rsvp: { id: number; confirmed: boolean; plusOneName: string | null; notes: string | null } | null;
}

interface AttendeeData {
  id?: number;
  name: string;
  dietaryNeeds: string | null;
  checked?: boolean;
}

// ═══════════════════════════════════════════════════════════════
// Step Indicators
// ═══════════════════════════════════════════════════════════════

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`
            h-1.5 rounded-pill transition-all duration-500
            ${i + 1 === current
              ? "w-8 bg-cornflower"
              : i + 1 < current
                ? "w-4 bg-periwinkle/50"
                : "w-4 bg-dust"
            }
          `}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Step 1: Identificação
// ═══════════════════════════════════════════════════════════════

function StepIdentification({
  onNext,
}: {
  onNext: (guest: GuestData) => void;
}) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(query);
  const isPhone = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/.test(query.replace(/\s/g, ""));
  const isValid = isValidEmail || isPhone;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/rsvp?query=${encodeURIComponent(query)}`);
      if (!res.ok) {
        if (res.status === 404) {
          setError("Email ou telefone não encontrado. Verifique os dados ou entre em contato com os noivos.");
        } else {
          throw new Error("Erro ao buscar convite.");
        }
        return;
      }
      const data = await res.json();
      onNext(data.guest);
    } catch {
      setError("Ocorreu um erro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      key="step1"
      variants={slideLeft}
      initial="hidden"
      animate="visible"
      exit="exit"
      onSubmit={handleSearch}
      className="flex flex-col gap-6"
    >
      <div className="text-center mb-2">
        <h3 className="font-serif text-2xl text-charcoal mb-2">
          Encontre seu convite
        </h3>
        <p className="text-stone text-sm font-sans">
          Digite seu e-mail ou telefone cadastrado para buscar seu convite.
        </p>
      </div>

      <Input
        label="E-mail ou Telefone"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="seu@email.com ou (11) 99999-9999"
        error={error}
        icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        }
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={loading}
        disabled={!isValid}
        className="w-full"
      >
        Buscar Convite →
      </Button>
    </motion.form>
  );
}

// ═══════════════════════════════════════════════════════════════
// Step 2: Presença
// ═══════════════════════════════════════════════════════════════

function StepPresence({
  guestName,
  onConfirm,
  onDecline,
  onBack,
}: {
  guestName: string;
  onConfirm: () => void;
  onDecline: () => void;
  onBack: () => void;
}) {
  return (
    <motion.div
      key="step2"
      variants={slideLeft}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col gap-8"
    >
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-ice-blue mb-4">
          <span className="text-2xl">💌</span>
        </div>
        <h3 className="font-serif text-2xl text-charcoal mb-2">
          Olá, {guestName}!
        </h3>
        <p className="text-stone text-sm font-sans">
          Estamos muito felizes em convidá-lo(a) para o nosso casamento.
          <br />Você poderá comparecer?
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={onConfirm}
          className="group flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-dust
                     hover:border-cornflower hover:bg-ice-blue/30
                     transition-all duration-300 cursor-pointer active:scale-[0.98]"
        >
          <span className="text-3xl group-hover:scale-110 transition-transform">🎉</span>
          <span className="font-sans font-medium text-sm text-charcoal">Sim, com prazer!</span>
        </button>

        <button
          onClick={onDecline}
          className="group flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-dust
                     hover:border-stone hover:bg-dust/20
                     transition-all duration-300 cursor-pointer active:scale-[0.98]"
        >
          <span className="text-3xl group-hover:scale-110 transition-transform">😢</span>
          <span className="font-sans font-medium text-sm text-stone">Infelizmente, não posso</span>
        </button>
      </div>

      <button
        onClick={onBack}
        className="text-sm text-stone font-sans hover:text-cornflower transition-colors self-center cursor-pointer"
      >
        ← Voltar
      </button>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Step 3: Acompanhantes & Restrições
// ═══════════════════════════════════════════════════════════════

function StepAttendees({
  guest,
  attendees,
  setAttendees,
  dietary,
  setDietary,
  plusOneName,
  setPlusOneName,
  onNext,
  onBack,
}: {
  guest: GuestData;
  attendees: AttendeeData[];
  setAttendees: (a: AttendeeData[]) => void;
  dietary: string;
  setDietary: (s: string) => void;
  plusOneName: string;
  setPlusOneName: (s: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [error, setError] = useState("");

  const toggleAttendee = (index: number) => {
    const updated = [...attendees];
    updated[index] = { ...updated[index], checked: !updated[index].checked };
    setAttendees(updated);
  };

  const handleNext = () => {
    // At least one person must be checked (the main guest counts)
    setError("");
    onNext();
  };

  return (
    <motion.div
      key="step3"
      variants={slideLeft}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col gap-6"
    >
      <div className="text-center mb-2">
        <h3 className="font-serif text-2xl text-charcoal mb-2">
          Quem vem com você?
        </h3>
        <p className="text-stone text-sm font-sans">
          Selecione os acompanhantes que estarão presentes.
        </p>
      </div>

      {/* Main guest (always confirmed at this point) */}
      <div className="bg-ice-blue/30 rounded-xl p-4 flex items-center gap-3">
        <div className="w-5 h-5 rounded-sm bg-cornflower flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span className="font-sans font-medium text-charcoal">{guest.name}</span>
        <span className="text-xs text-stone ml-auto font-sans">(Titular)</span>
      </div>

      {/* Attendees checkboxes */}
      {attendees.length > 0 && (
        <div className="flex flex-col gap-2">
          {attendees.map((att, i) => (
            <button
              key={att.id || `att-${i}`}
              onClick={() => toggleAttendee(i)}
              className={`
                flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer
                ${att.checked
                  ? "border-cornflower bg-ice-blue/20"
                  : "border-dust hover:border-stone/50"
                }
              `}
            >
              <div
                className={`
                  w-5 h-5 rounded-sm border-2 flex items-center justify-center transition-all
                  ${att.checked ? "bg-cornflower border-cornflower" : "border-dust"}
                `}
              >
                {att.checked && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="font-sans text-sm text-charcoal">{att.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Plus one */}
      {guest.plusOneAllowed && (
        <Input
          label="Nome do(a) acompanhante"
          value={plusOneName}
          onChange={(e) => setPlusOneName(e.target.value)}
          placeholder="Nome completo do acompanhante"
          hint="Opcional — caso queira trazer alguém."
        />
      )}

      {/* Dietary restrictions */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-sans font-medium text-stone uppercase tracking-wider">
          Restrições Alimentares
        </label>
        <textarea
          value={dietary}
          onChange={(e) => setDietary(e.target.value.slice(0, 200))}
          placeholder="Ex: Sou vegetariano, tenho alergia a amendoim..."
          maxLength={200}
          className="w-full px-4 py-3 min-h-24 text-base font-sans text-charcoal bg-pearl
                     border-[1.5px] border-dust rounded-md placeholder:text-stone/60
                     focus:outline-none focus:ring-2 focus:ring-periwinkle focus:border-periwinkle
                     transition-all duration-300 resize-none"
        />
        <p className="text-xs text-stone/60 font-sans text-right">{dietary.length}/200</p>
      </div>

      {error && <p className="text-sm text-blush font-sans text-center">{error}</p>}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-5 py-3 text-sm text-stone font-sans font-medium hover:text-cornflower transition-colors cursor-pointer"
        >
          ← Voltar
        </button>
        <Button variant="primary" size="lg" className="flex-1" onClick={handleNext}>
          Próximo →
        </Button>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Step 4: Confirmação Final
// ═══════════════════════════════════════════════════════════════

function StepConfirmation({
  guest,
  confirmed,
  attendees,
  dietary,
  plusOneName,
  onSubmit,
  onBack,
  loading,
}: {
  guest: GuestData;
  confirmed: boolean;
  attendees: AttendeeData[];
  dietary: string;
  plusOneName: string;
  onSubmit: () => void;
  onBack: () => void;
  loading: boolean;
}) {
  const confirmedAttendees = attendees.filter((a) => a.checked);

  return (
    <motion.div
      key="step4"
      variants={slideLeft}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col gap-6"
    >
      <div className="text-center mb-2">
        <h3 className="font-serif text-2xl text-charcoal mb-2">
          Revise seus dados
        </h3>
        <p className="text-stone text-sm font-sans">
          Confira se tudo está correto antes de confirmar.
        </p>
      </div>

      {/* Summary Card */}
      <div className="bg-sky-wash rounded-xl p-5 flex flex-col gap-3">
        <SummaryRow label="Convidado" value={guest.name} />
        <SummaryRow label="E-mail" value={guest.email} />
        <SummaryRow
          label="Presença"
          value={confirmed ? "✅ Confirmada" : "❌ Não comparecerá"}
        />
        {confirmed && confirmedAttendees.length > 0 && (
          <SummaryRow
            label="Acompanhantes"
            value={confirmedAttendees.map((a) => a.name).join(", ")}
          />
        )}
        {confirmed && plusOneName && (
          <SummaryRow label="+1" value={plusOneName} />
        )}
        {confirmed && dietary && (
          <SummaryRow label="Restrições" value={dietary} />
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-5 py-3 text-sm text-stone font-sans font-medium hover:text-cornflower transition-colors cursor-pointer"
        >
          ← Editar
        </button>
        <Button
          variant="primary"
          size="lg"
          className="flex-1"
          onClick={onSubmit}
          loading={loading}
        >
          Confirmar ✓
        </Button>
      </div>
    </motion.div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-xs font-sans font-medium text-stone uppercase tracking-wider shrink-0">
        {label}
      </span>
      <span className="text-sm font-sans text-charcoal text-right">{value}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Step 5: Success Screen
// ═══════════════════════════════════════════════════════════════

function StepSuccess({ confirmed }: { confirmed: boolean }) {
  return (
    <motion.div
      key="step5"
      variants={slideLeft}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col items-center justify-center gap-6 text-center min-h-[300px]"
    >
      {/* Animated checkmark circle */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
        className={`
          w-20 h-20 rounded-full flex items-center justify-center
          ${confirmed ? "bg-sage/20" : "bg-ice-blue"}
        `}
      >
        {confirmed ? (
          <motion.svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#7BAE8A"
            strokeWidth="2.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
          >
            <motion.path
              d="M5 13l4 4L19 7"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
            />
          </motion.svg>
        ) : (
          <span className="text-3xl">💙</span>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="font-serif text-2xl md:text-3xl text-charcoal mb-2">
          {confirmed ? "Obrigado!" : "Sentiremos sua falta!"}
        </h3>
        <p className="text-stone font-sans leading-relaxed max-w-sm mx-auto">
          {confirmed
            ? "Sua presença foi confirmada com sucesso! Estamos ansiosos para celebrar com você em 16 de maio. 🎉"
            : "Agradecemos por nos informar. Esperamos que possamos nos ver em breve! 💙"}
        </p>
      </motion.div>

      <motion.a
        href="#hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-sm text-cornflower font-sans font-medium hover:text-navy-deep transition-colors mt-4"
      >
        ← Voltar ao site
      </motion.a>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Main RSVP Wizard
// ═══════════════════════════════════════════════════════════════

export default function RsvpWizard() {
  const [step, setStep] = useState(1);
  const [guest, setGuest] = useState<GuestData | null>(null);
  const [confirmed, setConfirmed] = useState(true);
  const [attendees, setAttendees] = useState<AttendeeData[]>([]);
  const [dietary, setDietary] = useState("");
  const [plusOneName, setPlusOneName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Direction: 1 = forward, -1 = backward
  const [direction, setDirection] = useState(1);

  const goForward = useCallback((target: number) => {
    setDirection(1);
    setStep(target);
  }, []);

  const goBack = useCallback((target: number) => {
    setDirection(-1);
    setStep(target);
  }, []);

  // Step 1 → 2: Guest found
  const handleGuestFound = useCallback((guestData: GuestData) => {
    setGuest(guestData);
    // Prepare attendees with checked state
    const att = guestData.attendees.map((a) => ({
      ...a,
      checked: true, // Default all checked
    }));
    setAttendees(att);
    // Restore previous RSVP data if exists
    if (guestData.rsvp) {
      setDietary(guestData.rsvp.notes || "");
      setPlusOneName(guestData.rsvp.plusOneName || "");
    }
    goForward(2);
  }, [goForward]);

  // Step 2 → 3: Confirmed
  const handleConfirm = useCallback(() => {
    setConfirmed(true);
    goForward(3);
  }, [goForward]);

  // Step 2 → 4: Declined
  const handleDecline = useCallback(() => {
    setConfirmed(false);
    goForward(4);
  }, [goForward]);

  // Submit RSVP
  const handleSubmit = useCallback(async () => {
    if (!guest) return;
    setLoading(true);
    setError("");

    try {
      const confirmedAttendees = confirmed
        ? attendees.filter((a) => a.checked).map((a) => ({
            id: a.id,
            name: a.name,
            dietaryNeeds: a.dietaryNeeds,
          }))
        : [];

      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestId: guest.id,
          confirmed,
          plusOneName: confirmed ? plusOneName : null,
          notes: confirmed ? dietary : null,
          attendees: confirmedAttendees,
        }),
      });

      if (!res.ok) throw new Error("Erro ao salvar RSVP.");
      goForward(5);
    } catch {
      setError("Ocorreu um erro ao salvar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [guest, confirmed, attendees, plusOneName, dietary, goForward]);

  const totalSteps = confirmed ? 4 : 2;
  const currentIndicator = Math.min(step, totalSteps);

  return (
    <section
      id="rsvp"
      className="relative w-full py-20 md:py-32 bg-parchment"
    >
      {/* Watercolor decoration */}
      <div
        className="absolute top-0 right-0 w-1/2 h-1/3 pointer-events-none opacity-40"
        style={{ background: "radial-gradient(ellipse at 80% 20%, rgba(214,228,247,0.4) 0%, transparent 70%)" }}
      />

      <div className="max-w-lg mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10"
        >
          <h2 className="font-display italic font-light text-navy-deep mb-3">
            Confirme sua Presença
          </h2>
          <p className="text-stone text-sm font-sans">
            Gostaríamos muito de contar com você neste dia tão especial.
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-pearl rounded-2xl shadow-card p-6 md:p-8 min-h-[400px] relative overflow-hidden"
        >
          {/* Step Indicator */}
          {step < 5 && (
            <StepIndicator current={currentIndicator} total={totalSteps} />
          )}

          {/* Error banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-blush/10 border border-blush/30 rounded-lg p-3 mb-4"
            >
              <p className="text-sm text-blush font-sans text-center">{error}</p>
            </motion.div>
          )}

          {/* Wizard Steps */}
          <AnimatePresence mode="wait" custom={direction}>
            {step === 1 && (
              <StepIdentification onNext={handleGuestFound} />
            )}

            {step === 2 && guest && (
              <StepPresence
                guestName={guest.name.split(" ")[0]}
                onConfirm={handleConfirm}
                onDecline={handleDecline}
                onBack={() => goBack(1)}
              />
            )}

            {step === 3 && guest && (
              <StepAttendees
                guest={guest}
                attendees={attendees}
                setAttendees={setAttendees}
                dietary={dietary}
                setDietary={setDietary}
                plusOneName={plusOneName}
                setPlusOneName={setPlusOneName}
                onNext={() => goForward(4)}
                onBack={() => goBack(2)}
              />
            )}

            {step === 4 && guest && (
              <StepConfirmation
                guest={guest}
                confirmed={confirmed}
                attendees={attendees}
                dietary={dietary}
                plusOneName={plusOneName}
                onSubmit={handleSubmit}
                onBack={() => goBack(confirmed ? 3 : 2)}
                loading={loading}
              />
            )}

            {step === 5 && (
              <StepSuccess confirmed={confirmed} />
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
