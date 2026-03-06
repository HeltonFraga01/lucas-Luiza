"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-cornflower text-pearl hover:bg-cornflower-600 active:scale-[0.98] shadow-sm hover:shadow-md",
  secondary:
    "bg-transparent text-cornflower border-[1.5px] border-cornflower hover:bg-ice-blue active:scale-[0.98]",
  ghost:
    "bg-transparent text-cornflower hover:text-navy-deep underline-offset-4 hover:underline",
  danger:
    "bg-blush text-pearl hover:bg-blush/90 active:scale-[0.98]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm min-h-[36px]",
  md: "px-5 py-2.5 text-sm min-h-[44px]",
  lg: "px-6 py-3 text-base min-h-[48px]",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      icon,
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`
          inline-flex items-center justify-center gap-2
          font-sans font-medium tracking-wide
          rounded-pill
          transition-all duration-300 ease-out
          focus-visible:outline-2 focus-visible:outline-periwinkle focus-visible:outline-offset-2
          ${isDisabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer"}
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && icon}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
