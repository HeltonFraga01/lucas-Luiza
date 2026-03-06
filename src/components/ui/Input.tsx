"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-sans font-medium text-stone uppercase tracking-wider"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone pointer-events-none">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full px-4 py-3 min-h-12
              text-base font-sans text-charcoal
              bg-pearl
              border-[1.5px] rounded-md
              placeholder:text-stone/60
              transition-all duration-300 ease-out
              focus:outline-none focus:ring-2 focus:ring-periwinkle focus:border-periwinkle
              disabled:opacity-50 disabled:cursor-not-allowed
              ${icon ? "pl-10" : ""}
              ${error
                ? "border-blush focus:ring-blush focus:border-blush"
                : "border-dust hover:border-stone"
              }
              ${className}
            `}
            aria-invalid={!!error}
            aria-describedby={
              error
                ? `${inputId}-error`
                : hint
                ? `${inputId}-hint`
                : undefined
            }
            {...props}
          />
        </div>
        {error && (
          <p
            id={`${inputId}-error`}
            className="text-sm text-blush font-sans"
            role="alert"
          >
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={`${inputId}-hint`} className="text-sm text-stone font-sans">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
