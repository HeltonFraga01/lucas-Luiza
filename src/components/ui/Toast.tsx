"use client";

import { useState, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ToastVariant = "success" | "error" | "info";

interface ToastData {
  id: string;
  message: string;
  variant: ToastVariant;
}

const variantStyles: Record<ToastVariant, { bg: string; icon: string }> = {
  success: { bg: "bg-sage text-pearl", icon: "✓" },
  error: { bg: "bg-blush text-pearl", icon: "✗" },
  info: { bg: "bg-cornflower text-pearl", icon: "ℹ" },
};

// ── Toast Store (simple pub/sub) ────────────────────────────────
type ToastListener = (toast: ToastData) => void;
const listeners: Set<ToastListener> = new Set();

export function toast(message: string, variant: ToastVariant = "success") {
  const toastData: ToastData = {
    id: Date.now().toString(),
    message,
    variant,
  };
  listeners.forEach((listener) => listener(toastData));
}

// ── Toast Provider ──────────────────────────────────────────────
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    const listener: ToastListener = (toastData) => {
      setToasts((prev) => [...prev, toastData]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toastData.id));
      }, 3500);
    };

    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return (
    <>
      {children}
      <div className="fixed bottom-6 right-6 z-200 flex flex-col gap-2" aria-live="polite">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={`
                flex items-center gap-2 px-4 py-3 rounded-lg shadow-hover
                font-sans text-sm font-medium
                ${variantStyles[t.variant].bg}
              `}
            >
              <span className="text-lg">{variantStyles[t.variant].icon}</span>
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
