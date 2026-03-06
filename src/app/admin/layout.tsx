import Link from "next/link";
import { logout } from "@/lib/auth";
import { redirect } from "next/navigation";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: "📊" },
  { name: "Convidados", href: "/admin/guests", icon: "👥" },
  { name: "Presentes", href: "/admin/registry", icon: "🎁" },
  { name: "Momentos", href: "/admin/timeline", icon: "📖" },
  { name: "Itinerário", href: "/admin/itinerary", icon: "📋" },
  { name: "Configurações", href: "/admin/settings", icon: "⚙️" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-parchment flex flex-col font-sans">
      {/* Admin Navbar */}
      <header className="w-full bg-pearl border-b border-dust sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6 md:gap-8">
            {/* Logo */}
            <Link href="/admin" className="flex items-center gap-2">
              <span className="font-display italic text-xl text-gold-leaf">Aeterna</span>
              <span className="text-[10px] font-sans text-stone uppercase tracking-wider bg-sky-wash px-2 py-0.5 rounded-pill">
                Admin
              </span>
            </Link>

            {/* Nav links (desktop) */}
            <nav className="hidden md:flex gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-1.5 text-xs font-sans font-medium text-stone
                             hover:text-cornflower hover:bg-ice-blue/40
                             rounded-md transition-all duration-200"
                >
                  <span className="mr-1.5">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-[10px] font-sans text-stone hover:text-cornflower transition-colors
                         uppercase tracking-wider"
            >
              Ver Site ↗
            </Link>
            <form action={async () => {
              "use server";
              await logout();
              redirect("/admin/login");
            }}>
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-sans font-medium text-stone
                           hover:text-blush hover:bg-blush/10 rounded-md transition-all cursor-pointer"
              >
                Sair
              </button>
            </form>
          </div>
        </div>

        {/* Mobile nav (scrollable) */}
        <nav className="md:hidden flex overflow-x-auto gap-1 px-4 pb-2 no-scrollbar">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-1.5 text-[10px] font-sans font-medium text-stone whitespace-nowrap
                         hover:text-cornflower hover:bg-ice-blue/40
                         rounded-md transition-all duration-200 shrink-0"
            >
              <span className="mr-1">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
      </header>

      {/* Main Content */}
      <main className="grow max-w-7xl mx-auto w-full px-4 md:px-6 py-6 md:py-8">
        {children}
      </main>
    </div>
  );
}
