"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError("Senha incorreta. Tente novamente.");
      }
    } catch {
      setError("Erro ao tentar fazer login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-parchment p-6">
      {/* Watercolor decorations */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 30% 40%, rgba(107,127,212,0.08) 0%, transparent 60%)" }}
      />
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 70% 70%, rgba(214,228,247,0.12) 0%, transparent 55%)" }}
      />

      <div className="w-full max-w-sm bg-pearl shadow-hover rounded-2xl p-8 border border-dust relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display italic text-3xl text-navy-deep mb-1">
            FragaCom
          </h1>
          <p className="text-stone text-xs font-sans uppercase tracking-[0.2em]">
            Painel de Administração
          </p>
        </div>

        {/* Divider */}
        <div className="w-12 h-px bg-gold-leaf mx-auto mb-8" />

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <Input
            label="Palavra-passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            error={error}
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            }
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            disabled={!password}
            className="w-full"
          >
            Entrar →
          </Button>
        </form>

        <p className="text-[10px] text-stone/50 font-sans text-center mt-6">
          Acesso restrito aos noivos.
        </p>
      </div>
    </div>
  );
}
