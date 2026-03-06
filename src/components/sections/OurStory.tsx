"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function OurStory({ settings, timeline }: { settings?: any, timeline?: any[] }) {
  const containerRef = useRef<HTMLElement>(null);
  const textRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useGSAP(
    () => {
      // Scroll-triggered animations for text elements
      textRefs.current.forEach((el) => {
        if (!el) return;
        
        gsap.fromTo(
          el,
          { opacity: 0, y: 50, filter: "blur(10px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    },
    { scope: containerRef }
  );

  // Dynamic timeline items will be passed from props

  return (
    <section 
      id="historia"
      ref={containerRef} 
      className="relative w-full min-h-screen py-32 px-6 flex flex-col items-center max-w-4xl mx-auto"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-linear-to-b from-transparent via-zinc-300  to-transparent -z-10" />

      <h2 className="text-4xl md:text-5xl font-serif text-center mb-12 text-zinc-900 ">
        Nossa História
      </h2>

      {/* Dynamic Story Section from Settings */}
      {(settings?.storyText || settings?.storyImage) && (
        <div className="w-full flex flex-col md:flex-row items-center gap-12 mb-24">
          {settings?.storyImage && (
            <div className="w-full md:w-1/2 relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-zinc-200 ">
              <img 
                src={settings.storyImage} 
                alt="Nossa História"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          {settings?.storyText && (
            <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
              <p className="text-zinc-600  text-lg leading-relaxed whitespace-pre-wrap">
                {settings.storyText}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Timeline Section */}
      <h3 id="momentos" className="text-2xl font-serif text-center mb-12 text-zinc-800 ">
        Grandes Momentos
      </h3>
      <div className="w-full flex flex-col gap-24">
        {(timeline?.length ? timeline : []).map((item, index) => (
          <div 
            key={item.year}
            className={`w-full flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-16`}
          >
            {/* Content Side */}
            <div className={`w-full md:w-1/2 flex flex-col ${index % 2 === 0 ? 'md:items-end md:text-right' : 'md:items-start md:text-left'} items-center text-center`}>
              <div className="text-sm font-bold tracking-widest text-[#d4af37] mb-2">{item.year}</div>
              <h3 className="text-2xl font-serif mb-4 text-zinc-800 ">{item.title}</h3>
              <p 
                ref={(el) => { textRefs.current[index] = el; }}
                className="text-zinc-600  text-lg leading-relaxed max-w-sm"
              >
                {item.description}
              </p>
            </div>
            
            {/* Center Timeline Node */}
            <div className="hidden md:flex w-4 h-4 rounded-full bg-[#d4af37] absolute left-1/2 -translate-x-1/2 shadow-[0_0_15px_rgba(212,175,55,0.5)]" />
            
            {/* Empty Side for balance */}
            <div className="hidden md:block w-1/2" />
          </div>
        ))}
      </div>
    </section>
  );
}
