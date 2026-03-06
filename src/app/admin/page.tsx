import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  const totalGuests = await prisma.guest.count();
  const totalRsvps = await prisma.rsvp.count();
  const confirmedRsvps = await prisma.rsvp.count({ where: { confirmed: true } });
  const totalGifts = await prisma.giftItem.count();
  
  const raisedAmountResult = await prisma.giftItem.aggregate({
    _sum: { raisedAmount: true }
  });
  const totalRaised = raisedAmountResult._sum.raisedAmount || 0;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-serif text-zinc-900 dark:text-zinc-100">Visão Geral</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-2">Bem-vindos ao painel de controle do casamento.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric Cards */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col gap-2">
          <span className="text-sm font-medium text-zinc-500">Total de Convidados</span>
          <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{totalGuests}</span>
        </div>
        
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col gap-2">
          <span className="text-sm font-medium text-zinc-500">RSVPs (Respostas)</span>
          <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{totalRsvps}</span>
          <span className="text-xs text-green-600 font-medium">{confirmedRsvps} confirmados</span>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col gap-2">
          <span className="text-sm font-medium text-zinc-500">Presentes na Lista</span>
          <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{totalGifts}</span>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col gap-2">
          <span className="text-sm font-medium text-zinc-500">Arrecadação R$</span>
          <span className="text-3xl font-bold text-[#d4af37]">R$ {totalRaised.toLocaleString('pt-BR')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <Link href="/admin/guests" className="group p-6 bg-zinc-900 text-white rounded-2xl flex items-center justify-between hover:bg-zinc-800 transition-colors">
          <div className="flex flex-col">
            <span className="font-semibold text-lg">Gerenciar Convidados</span>
            <span className="text-zinc-400 text-sm">Adicionar convidados e checar RSVPs confirmados.</span>
          </div>
          <span className="text-2xl group-hover:translate-x-2 transition-transform">→</span>
        </Link>
        <Link href="/admin/registry" className="group p-6 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-2xl flex items-center justify-between hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
          <div className="flex flex-col">
            <span className="font-semibold text-lg">Atualizar Lista de Presentes</span>
            <span className="text-zinc-500 text-sm">Adicionar novos links de produtos via Scraping.</span>
          </div>
          <span className="text-2xl group-hover:translate-x-2 transition-transform">→</span>
        </Link>
      </div>
    </div>
  );
}
