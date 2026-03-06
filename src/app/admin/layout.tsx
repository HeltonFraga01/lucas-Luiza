import Link from "next/link";
import { logout } from "@/lib/auth";
import { redirect } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col font-sans">
      {/* Admin Navbar */}
      <header className="w-full bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="text-xl font-serif text-[#d4af37] font-bold">Aeterna</span>
            <nav className="hidden md:flex gap-6">
              <Link href="/admin" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link href="/admin/guests" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                Convidados & RSVP
              </Link>
              <Link href="/admin/registry" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                Lista de Presentes
              </Link>
              <Link href="/admin/timeline" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                Momentos
              </Link>
              <Link href="/admin/itinerary" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                Itinerário
              </Link>
              <Link href="/admin/settings" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                Configurações
              </Link>
            </nav>
          </div>
          
          <form action={async () => {
            "use server";
            await logout();
            redirect("/admin/login");
          }}>
            <button type="submit" className="text-sm font-medium text-zinc-500 hover:text-red-500 transition-colors">
              Sair
            </button>
          </form>
        </div>
      </header>

      {/* Main Content */}
      <main className="grow max-w-7xl mx-auto w-full p-6 py-8">
        {children}
      </main>
    </div>
  );
}
