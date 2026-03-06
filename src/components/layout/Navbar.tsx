"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Nossa História", href: "#historia" },
    { name: "Grandes Momentos", href: "#momentos" },
    { name: "Presença", href: "#rsvp" },
    { name: "Lista de Presentes", href: "#presentes" },
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm py-4"
          : "bg-transparent py-6"
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
          className={`text-2xl font-serif font-bold transition-colors ${
            scrolled ? "text-primary" : "text-white drop-shadow-md"
          }`}
          style={{ color: scrolled ? 'var(--primary, #6a8cb8)' : undefined }}
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
              className={`text-sm font-medium tracking-wide uppercase transition-colors hover:opacity-75 ${
                scrolled ? "text-zinc-600 " : "text-white drop-shadow-md"
              }`}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 rounded-md focus:outline-hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <div className="w-6 h-5 flex flex-col justify-between">
            <span
              className={`block w-full h-0.5 transition-all duration-300 ${
                scrolled ? "bg-zinc-800 " : "bg-white"
              } ${mobileMenuOpen ? "rotate-45 translate-y-2 bg-zinc-800 " : ""}`}
            />
            <span
              className={`block w-full h-0.5 transition-all duration-300 ${
                scrolled ? "bg-zinc-800 " : "bg-white"
              } ${mobileMenuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-full h-0.5 transition-all duration-300 ${
                scrolled ? "bg-zinc-800 " : "bg-white"
              } ${mobileMenuOpen ? "-rotate-45 -translate-y-2 bg-zinc-800 " : ""}`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Nav Menu */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-white shadow-lg transition-all duration-300 origin-top ${
          mobileMenuOpen
            ? "scale-y-100 opacity-100"
            : "scale-y-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col py-4 px-6 gap-4">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-base font-medium text-zinc-800  py-2 border-b border-zinc-100  last:border-0"
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
