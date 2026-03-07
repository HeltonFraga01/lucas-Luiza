import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

// ═══════════════════════════════════════════════════════════════
// StatCard Component
// ═══════════════════════════════════════════════════════════════

function StatCard({
  label,
  value,
  detail,
  icon,
  color = "cornflower",
  href,
}: {
  label: string;
  value: string | number;
  detail?: string;
  icon: string;
  color?: "cornflower" | "sage" | "gold" | "blush";
  href?: string;
}) {
  const colorMap = {
    cornflower: "bg-ice-blue text-cornflower",
    sage: "bg-sage/15 text-sage",
    gold: "bg-gold-leaf/10 text-gold-leaf",
    blush: "bg-blush/10 text-blush",
  };

  const content = (
    <div className={`
      bg-pearl rounded-xl border border-dust p-5 flex flex-col gap-3
      ${href ? "hover:shadow-hover hover:border-cornflower/30 transition-all duration-300 cursor-pointer" : ""}
    `}>
      <div className="flex items-center justify-between">
        <span className={`w-9 h-9 rounded-lg ${colorMap[color]} flex items-center justify-center text-lg`}>
          {icon}
        </span>
        {href && <span className="text-xs text-stone">→</span>}
      </div>
      <div>
        <p className="text-2xl font-serif font-medium text-charcoal">{value}</p>
        <p className="text-xs font-sans text-stone mt-0.5">{label}</p>
      </div>
      {detail && (
        <p className="text-[10px] font-sans text-stone/70">{detail}</p>
      )}
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

// ═══════════════════════════════════════════════════════════════
// Dashboard Page
// ═══════════════════════════════════════════════════════════════

export default async function AdminDashboard() {
  let totalGuests = 0, totalRsvps = 0, confirmedRsvps = 0, declinedRsvps = 0;
  let totalGifts = 0, purchasedGifts = 0, totalRaised = 0, totalEvents = 0;
  let recentRsvps: Awaited<ReturnType<typeof prisma.rsvp.findMany<{ include: { guest: true } }>>> = [];

  try {
    const [
      _totalGuests, _totalRsvps, _confirmedRsvps, _declinedRsvps,
      _totalGifts, _purchasedGifts, totalRaisedResult, _recentRsvps, _totalEvents,
    ] = await Promise.all([
      prisma.guest.count(),
      prisma.rsvp.count(),
      prisma.rsvp.count({ where: { confirmed: true } }),
      prisma.rsvp.count({ where: { confirmed: false } }),
      prisma.giftItem.count(),
      prisma.giftItem.count({ where: { isPurchased: true } }),
      prisma.giftItem.aggregate({ _sum: { raisedAmount: true } }),
      prisma.rsvp.findMany({ take: 8, orderBy: { submittedAt: "desc" }, include: { guest: true } }),
      prisma.event.count(),
    ]);

    totalGuests = _totalGuests; totalRsvps = _totalRsvps;
    confirmedRsvps = _confirmedRsvps; declinedRsvps = _declinedRsvps;
    totalGifts = _totalGifts; purchasedGifts = _purchasedGifts;
    totalRaised = totalRaisedResult._sum.raisedAmount || 0;
    recentRsvps = _recentRsvps;
    totalEvents = _totalEvents;
  } catch {
    // DB not available at build time — render with zero defaults
  }

  const pendingRsvps = totalGuests - totalRsvps;
  const confirmedPct = totalGuests > 0 ? ((confirmedRsvps / totalGuests) * 100).toFixed(1) : "0";
  const giftsPct = totalGifts > 0 ? ((purchasedGifts / totalGifts) * 100).toFixed(0) : "0";



  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl md:text-3xl text-charcoal">Visão Geral</h1>
        <p className="text-stone text-sm font-sans mt-1">
          Acompanhe o progresso do casamento em tempo real.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          icon="👥"
          label="Total de Convidados"
          value={totalGuests}
          color="cornflower"
          href="/admin/guests"
        />
        <StatCard
          icon="✅"
          label="RSVPs Confirmados"
          value={confirmedRsvps}
          detail={`${confirmedPct}% do total`}
          color="sage"
          href="/admin/guests"
        />
        <StatCard
          icon="⏳"
          label="RSVPs Pendentes"
          value={pendingRsvps}
          detail={`${declinedRsvps} recusaram`}
          color="gold"
        />
        <StatCard
          icon="💰"
          label="Arrecadação PIX"
          value={`R$ ${totalRaised.toLocaleString("pt-BR")}`}
          detail={`${purchasedGifts}/${totalGifts} presentes recebidos (${giftsPct}%)`}
          color="gold"
          href="/admin/registry"
        />
      </div>

      {/* Two columns: Recent RSVPs + Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Recent RSVPs */}
        <div className="lg:col-span-2 bg-pearl rounded-xl border border-dust p-5">
          <h3 className="font-serif text-lg text-charcoal mb-4">Últimas Respostas</h3>

          {recentRsvps.length === 0 ? (
            <p className="text-sm text-stone font-sans py-8 text-center">
              Nenhuma resposta ainda. Compartilhe o link do site com seus convidados! 💌
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-sans">
                <thead>
                  <tr className="border-b border-dust text-left">
                    <th className="pb-2 text-[10px] text-stone uppercase tracking-wider font-medium">Nome</th>
                    <th className="pb-2 text-[10px] text-stone uppercase tracking-wider font-medium">Email</th>
                    <th className="pb-2 text-[10px] text-stone uppercase tracking-wider font-medium">Status</th>
                    <th className="pb-2 text-[10px] text-stone uppercase tracking-wider font-medium">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRsvps.map((rsvp) => (
                    <tr key={rsvp.id} className="border-b border-dust/50 last:border-0">
                      <td className="py-2.5 text-charcoal font-medium">{rsvp.guest.name}</td>
                      <td className="py-2.5 text-stone">{rsvp.guest.email}</td>
                      <td className="py-2.5">
                        <span className={`
                          inline-flex px-2 py-0.5 rounded-pill text-[10px] font-semibold uppercase tracking-wider
                          ${rsvp.confirmed ? "bg-sage/15 text-sage" : "bg-blush/10 text-blush"}
                        `}>
                          {rsvp.confirmed ? "Confirmado" : "Recusou"}
                        </span>
                      </td>
                      <td className="py-2.5 text-stone text-xs">
                        {new Date(rsvp.submittedAt).toLocaleDateString("pt-BR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col gap-3">
          <QuickLink
            href="/admin/guests"
            icon="👥"
            title="Gerenciar Convidados"
            description="Adicionar, editar e gerenciar RSVPs"
          />
          <QuickLink
            href="/admin/registry"
            icon="🎁"
            title="Lista de Presentes"
            description="Adicionar via URL e gerenciar"
          />
          <QuickLink
            href="/admin/timeline"
            icon="📖"
            title="Grandes Momentos"
            description="Editar timeline da história"
          />
          <QuickLink
            href="/admin/itinerary"
            icon="📋"
            title="Itinerário"
            description={`${totalEvents} eventos cadastrados`}
          />
          <QuickLink
            href="/admin/settings"
            icon="⚙️"
            title="Configurações"
            description="Textos, imagens e chave PIX"
          />
        </div>
      </div>
    </div>
  );
}

function QuickLink({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 p-4 bg-pearl rounded-xl border border-dust
                 hover:border-cornflower/30 hover:shadow-card transition-all duration-300"
    >
      <span className="text-xl">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="font-sans font-medium text-sm text-charcoal group-hover:text-cornflower transition-colors">
          {title}
        </p>
        <p className="text-[10px] text-stone font-sans truncate">{description}</p>
      </div>
      <span className="text-stone/40 group-hover:text-cornflower group-hover:translate-x-1 transition-all">→</span>
    </Link>
  );
}
