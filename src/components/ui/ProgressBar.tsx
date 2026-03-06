"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

interface ProgressBarProps {
  /** Current value (0-100 or actual amount) */
  value: number;
  /** Maximum value */
  max: number;
  /** Show label with percentage */
  showLabel?: boolean;
  /** Label format: "percentage" | "currency" */
  labelFormat?: "percentage" | "currency";
  /** Animate on mount */
  animate?: boolean;
  /** Color variant */
  variant?: "gold" | "cornflower" | "sage";
  /** Size */
  size?: "sm" | "md";
  className?: string;
}

const gradientIds: Record<string, [string, string]> = {
  gold: ["#C9A84C", "#F0C665"],
  cornflower: ["#4A6FA5", "#6B7FD4"],
  sage: ["#6A9D7B", "#7BAE8A"],
};

export default function ProgressBar({
  value,
  max,
  showLabel = true,
  labelFormat = "percentage",
  animate = true,
  variant = "gold",
  size = "md",
  className = "",
}: ProgressBarProps) {
  const fillRef = useRef<SVGRectElement>(null);
  const percentage = Math.min((value / max) * 100, 100);
  const width = 300;
  const height = size === "sm" ? 6 : 8;
  const fillWidth = (percentage / 100) * width;
  const [color1, color2] = gradientIds[variant];
  const gradientId = `progress-gradient-${variant}`;

  useEffect(() => {
    if (animate && fillRef.current) {
      gsap.fromTo(
        fillRef.current,
        { attr: { width: 0 } },
        {
          attr: { width: fillWidth },
          duration: 1.2,
          ease: "power2.out",
          delay: 0.3,
        }
      );
    }
  }, [animate, fillWidth]);

  const formatLabel = () => {
    if (labelFormat === "currency") {
      return `R$ ${value.toLocaleString("pt-BR")} de R$ ${max.toLocaleString("pt-BR")} (${Math.round(percentage)}%)`;
    }
    return `${Math.round(percentage)}%`;
  };

  return (
    <div className={`w-full ${className}`}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={`Progresso: ${Math.round(percentage)}%`}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor={color1} />
            <stop offset="100%" stopColor={color2} />
          </linearGradient>
        </defs>
        {/* Track */}
        <rect
          x="0"
          y="0"
          width={width}
          height={height}
          rx={height / 2}
          fill="#E8E5E0"
        />
        {/* Fill */}
        <rect
          ref={fillRef}
          x="0"
          y="0"
          width={animate ? 0 : fillWidth}
          height={height}
          rx={height / 2}
          fill={`url(#${gradientId})`}
        />
      </svg>
      {showLabel && (
        <p className="text-sm font-sans text-stone mt-1">
          {formatLabel()}
        </p>
      )}
    </div>
  );
}
