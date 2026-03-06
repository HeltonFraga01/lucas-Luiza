import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, EB_Garamond, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScrolling from "@/components/layout/SmoothScrolling";
import Navbar from "@/components/layout/Navbar";
import { ToastProvider } from "@/components/ui/Toast";

// ── Display (títulos emocionais, nomes do casal) ──────────────
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

// ── Sans (corpo, UI, formulários) ─────────────────────────────
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
});

// ── Serif (subtítulos, datas, citações) ───────────────────────
const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-eb-garamond",
  display: "swap",
});

// ── Mono (admin, dados monetários) ────────────────────────────
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Luiza & Lucas — 16 de Maio de 2026",
  description: "Casamento de Luiza & Lucas — \"Nós amamos porque ELE nos amou primeiro.\" Uma experiência digital imersiva para celebrar o nosso amor.",
  keywords: ["casamento", "Luiza", "Lucas", "wedding", "16 de maio", "2026"],
  openGraph: {
    title: "Luiza & Lucas — 16 de Maio de 2026",
    description: "Uma experiência digital imersiva para o casamento de Luiza & Lucas.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`
        ${cormorant.variable}
        ${dmSans.variable}
        ${ebGaramond.variable}
        ${jetbrainsMono.variable}
      `}
    >
      <head>
        <meta name="color-scheme" content="light" />
      </head>
      <body className="antialiased overflow-x-hidden">
        <ToastProvider>
          <Navbar />
          <SmoothScrolling>{children}</SmoothScrolling>
        </ToastProvider>
      </body>
    </html>
  );
}
