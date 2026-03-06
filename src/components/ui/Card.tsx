"use client";

import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
  onClick?: () => void;
}

const paddingStyles = {
  sm: "p-3",
  md: "p-4 md:p-6",
  lg: "p-6 md:p-8",
};

export default function Card({
  children,
  className = "",
  hover = false,
  padding = "md",
  onClick,
}: CardProps) {
  return (
    <div
      className={`
        bg-pearl rounded-xl shadow-card
        ${paddingStyles[padding]}
        ${hover
          ? "cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-hover"
          : ""
        }
        ${className}
      `}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}
