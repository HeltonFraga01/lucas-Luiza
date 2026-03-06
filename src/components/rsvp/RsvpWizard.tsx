"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function RsvpWizard() {
  const [step, setStep] = useState(1);
  const [query, setQuery] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [guestData, setGuestData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [confirmed, setConfirmed] = useState<boolean | null>(null);
  const [dietary, setDietary] = useState("");
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/rsvp?query=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Convite não encontrado. Cheque o termo buscado.");
      const data = await res.json();
      setGuestData(data.guest);
      setStep(2);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestId: guestData.id,
          confirmed,
          notes: dietary,
        }),
      });
      if (!res.ok) throw new Error("Erro ao confirmar presença");
      setStep(3);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const variants = {
    enter: { opacity: 0, x: 50 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <section id="rsvp" className="w-full max-w-2xl mx-auto py-24 px-6 min-h-[60vh] flex flex-col items-center justify-center">
      <h2 className="text-4xl font-serif text-center mb-12 text-zinc-900 ">
        Confirme sua Presença
      </h2>
      
      <div className="w-full relative bg-white  shadow-2xl rounded-2xl p-8 overflow-hidden min-h-[350px] border border-zinc-100 ">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.form 
              key="step1"
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              onSubmit={handleSearch}
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-zinc-700 ">
                  Por favor, insira seu e-mail ou telefone para buscar seu convite
                </label>
                <input 
                  type="text" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="seu@email.com ou (11) 99999-9999"
                  required
                  className="w-full p-4 rounded-xl border border-zinc-200  bg-zinc-50  focus:ring-2 focus:ring-[#d4af37] outline-none transition-all"
                />
              </div>
              {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 mt-4 rounded-xl bg-zinc-900  text-white  font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50"
              >
                {loading ? "Buscando..." : "Buscar Convite"}
              </button>
            </motion.form>
          )}

          {step === 2 && guestData && (
            <motion.div 
              key="step2"
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-8"
            >
              <h3 className="text-2xl font-serif text-center">
                Olá, {guestData.name}!
              </h3>
              
              <div className="flex flex-col gap-4">
                <p className="text-center text-zinc-600 ">Você poderá comparecer ao nosso casamento?</p>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setConfirmed(true)}
                    className={`p-4 rounded-xl border-2 transition-all font-medium ${confirmed === true ? 'border-[#d4af37] bg-[#d4af37]/10 text-[#a08226]' : 'border-zinc-200  text-zinc-600  hover:border-[#d4af37]/50'}`}
                  >
                    Sim, eu vou!
                  </button>
                  <button 
                    onClick={() => setConfirmed(false)}
                    className={`p-4 rounded-xl border-2 transition-all font-medium ${confirmed === false ? 'border-zinc-900  bg-zinc-100 ' : 'border-zinc-200  text-zinc-600  hover:border-zinc-400'}`}
                  >
                    Não poderei
                  </button>
                </div>
              </div>

              {confirmed && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  className="flex flex-col gap-2 overflow-hidden"
                >
                  <label className="text-sm font-medium text-zinc-700 ">
                    Você possui alguma restrição alimentar? (Opcional)
                  </label>
                  <textarea 
                    value={dietary}
                    onChange={(e) => setDietary(e.target.value)}
                    placeholder="Ex: Sou vegetariano, tenho alergia a amendoim..."
                    className="w-full p-4 rounded-xl border border-zinc-200  bg-zinc-50  focus:ring-2 focus:ring-[#d4af37] outline-none transition-all resize-none h-24"
                  />
                </motion.div>
              )}

              <button 
                onClick={handleSubmit} 
                disabled={loading || confirmed === null}
                className="w-full py-4 rounded-xl bg-[#d4af37] text-white font-medium hover:bg-[#c4a030] transition-colors disabled:opacity-50"
              >
                {loading ? "Enviando..." : "Confirmar Resposta"}
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center gap-6 text-center h-full min-h-[300px]"
            >
              <div className="w-20 h-20 rounded-full bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37] mb-4">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="text-3xl font-serif">Obrigado!</h3>
              <p className="text-zinc-600  text-lg">
                Sua resposta foi registrada com sucesso. Estamos ansiosos!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
