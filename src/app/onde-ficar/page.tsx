import Accommodations from "@/components/sections/Accommodations";

export const metadata = {
  title: "Onde Ficar — Luiza & Lucas",
  description: "Sugestões de hospedagem próximas ao evento para o casamento de Luiza & Lucas.",
};

export default function OndeNicarPage() {
  return (
    <main className="min-h-screen bg-parchment">
      {/* Spacer para a Navbar fixa */}
      <div className="h-20" />

      {/* Seção de acomodações (já tem header + grid internos) */}
      <Accommodations standalone />

      {/* Footer simples */}
      <footer className="w-full py-10 bg-parchment border-t border-dust mt-10">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="font-display italic text-lg text-navy-deep mb-2">Luiza & Lucas</p>
          <p className="text-xs text-stone font-sans">16 de Maio de 2026 · Feito com 💙</p>
          <p className="text-[10px] text-stone/40 font-sans mt-4">
            © 2026 FragaCom — Wedding Experience
          </p>
        </div>
      </footer>
    </main>
  );
}
