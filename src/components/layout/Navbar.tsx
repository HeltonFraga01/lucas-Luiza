"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hide navbar on admin routes (after hooks to comply with Rules of Hooks)
  if (pathname.startsWith("/admin")) return null;

  const navLinks = [
    { name: "Nossa História", href: "#historia" },
    { name: "Grandes Momentos", href: "#momentos" },
    { name: "Programação", href: "#itinerario" },
    { name: "Presença", href: "#rsvp" },
    { name: "Presentes", href: "#presentes" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-parchment/90 backdrop-blur-md shadow-card py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo / Initials */}
        <Link
          href="/"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`text-2xl font-display italic font-light tracking-tight transition-colors duration-300 ${
            scrolled ? "text-navy-deep" : "text-pearl drop-shadow-md"
          }`}
        >
          L&L
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`text-xs font-sans font-medium tracking-widest uppercase 
                          transition-colors duration-300 hover:text-cornflower
                          relative after:content-[''] after:absolute after:-bottom-1 
                          after:left-0 after:w-0 after:h-[1.5px] after:bg-cornflower 
                          after:transition-all after:duration-300 hover:after:w-full
                          ${scrolled ? "text-stone" : "text-pearl/90 drop-shadow-sm"}`}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 rounded-md focus:outline-hidden cursor-pointer"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={mobileMenuOpen}
        >
          <div className="w-6 h-5 flex flex-col justify-between">
            <span
              className={`block w-full h-0.5 transition-all duration-300 origin-center ${
                scrolled ? "bg-charcoal" : "bg-pearl"
              } ${mobileMenuOpen ? "rotate-45 translate-y-2 bg-charcoal" : ""}`}
            />
            <span
              className={`block w-full h-0.5 transition-all duration-300 ${
                scrolled ? "bg-charcoal" : "bg-pearl"
              } ${mobileMenuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-full h-0.5 transition-all duration-300 origin-center ${
                scrolled ? "bg-charcoal" : "bg-pearl"
              } ${mobileMenuOpen ? "-rotate-45 -translate-y-2 bg-charcoal" : ""}`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Nav Menu */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-parchment/95 backdrop-blur-md 
                    shadow-hover transition-all duration-300 origin-top ${
          mobileMenuOpen
            ? "scale-y-100 opacity-100"
            : "scale-y-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col py-4 px-6 gap-1">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-sm font-sans font-medium text-charcoal py-3 px-2
                         border-b border-dust/50 last:border-0
                         hover:text-cornflower hover:bg-ice-blue/30 rounded-md
                         transition-all duration-200"
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
