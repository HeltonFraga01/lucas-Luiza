"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/motion";

// ═══════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════

interface EventData {
  id: number;
  title: string;
  description: string | null;
  location: string | null;
  datetime: string;
  isVipOnly: boolean;
  order: number;
}

interface ItineraryProps {
  events: EventData[];
  isVip?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  settings?: any;
}

// ═══════════════════════════════════════════════════════════════
// Time formatting
// ═══════════════════════════════════════════════════════════════

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

// ═══════════════════════════════════════════════════════════════
// Itinerary Component
// ═══════════════════════════════════════════════════════════════

export default function Itinerary({ events, isVip = false, settings }: ItineraryProps) {
  // Filter VIP events unless user is VIP
  const visibleEvents = events
    .filter((e) => !e.isVipOnly || isVip)
    .sort((a, b) => a.order - b.order);

  // Don't render section if there are no events
  if (visibleEvents.length === 0) return null;

  return (
    <section id="itinerario" className="relative w-full py-20 md:py-32 bg-sky-wash">
      {/* Watercolor decoration */}
      <div
        className="absolute bottom-0 left-0 w-1/3 h-1/2 pointer-events-none opacity-30"
        style={{ background: "radial-gradient(ellipse at 20% 80%, rgba(107,127,212,0.15) 0%, transparent 70%)" }}
      />

      <div className="max-w-3xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <h2 className="font-display italic font-light text-navy-deep mb-3">
            {settings?.itineraryTitle || "Programação do Dia"}
          </h2>
          <p className="text-stone text-sm font-sans max-w-md mx-auto">
            {settings?.itinerarySubtitle || "Cada momento foi pensado com carinho para que todos aproveitem ao máximo este dia especial."}
          </p>
        </motion.div>

        {/* Events */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="relative"
        >
          {/* Timeline line */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-dust" />

          <div className="flex flex-col gap-8 md:gap-12">
            {visibleEvents.map((event, index) => (
              <motion.div
                key={event.id}
                variants={fadeInUp}
                className="relative flex gap-6 md:gap-8"
              >
                {/* Time + dot */}
                <div className="flex flex-col items-center shrink-0 z-10">
                  <span className="font-serif text-sm md:text-base text-navy-deep font-medium mb-2 whitespace-nowrap">
                    {formatTime(event.datetime)}
                  </span>
                  <div
                    className={`
                      w-3 h-3 rounded-full border-[3px] border-parchment
                      ${index === 0
                        ? "bg-gold-leaf shadow-[0_0_15px_rgba(201,168,76,0.4)]"
                        : "bg-periwinkle shadow-[0_0_10px_rgba(107,127,212,0.25)]"
                      }
                    `}
                  />
                  {/* Connector line segment */}
                  {index < visibleEvents.length - 1 && (
                    <div className="w-px flex-1 bg-dust mt-2" />
                  )}
                </div>

                {/* Content */}
                <div className="bg-pearl rounded-xl shadow-card p-5 md:p-6 flex-1 hover:shadow-hover transition-shadow duration-300">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h4 className="font-serif text-lg md:text-xl text-charcoal">
                      {event.title}
                    </h4>
                    {event.isVipOnly && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-pill text-[10px] font-sans font-semibold
                                       bg-linear-to-r from-gold-leaf to-gold-light text-charcoal uppercase tracking-wider shrink-0">
                        VIP
                      </span>
                    )}
                  </div>

                  {event.description && (
                    <p className="text-stone text-sm font-sans leading-relaxed mb-3">
                      {event.description}
                    </p>
                  )}

                  {event.location && (
                    <div className="flex items-center gap-2 text-xs text-stone/80 font-sans">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
