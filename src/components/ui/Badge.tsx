"use client";

import { type ReactNode } from "react";

type BadgeVariant = "default" | "success" | "warning" | "error" | "gold" | "vip";
type BadgeSize = "sm" | "md";

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-ice-blue text-cornflower",
  success: "bg-sage/15 text-sage",
  warning: "bg-amber/15 text-amber",
  error: "bg-blush/15 text-blush",
  gold: "bg-gradient-to-r from-gold-leaf to-gold-light text-charcoal shadow-[0_2px_8px_rgba(201,168,76,0.4)]",
  vip: "bg-gradient-to-r from-gold-leaf to-gold-light text-charcoal",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-3 py-1 text-xs",
};

export default function Badge({
  variant = "default",
  size = "md",
  children,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center font-sans font-medium
        rounded-pill leading-none tracking-wide uppercase
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
