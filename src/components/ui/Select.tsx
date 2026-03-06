"use client";

import { forwardRef, type SelectHTMLAttributes } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className = "", id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-sans font-medium text-stone uppercase tracking-wider"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`
            w-full px-4 py-3 min-h-12
            text-base font-sans text-charcoal
            bg-pearl
            border-[1.5px] rounded-md
            appearance-none
            bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%228%22%20viewBox%3D%220%200%2012%208%22%3E%3Cpath%20fill%3D%22%236B6B6B%22%20d%3D%22M1.41%200L6%204.58%2010.59%200%2012%201.41l-6%206-6-6z%22%2F%3E%3C%2Fsvg%3E')]
            bg-position-[right_12px_center]
            bg-no-repeat
            pr-10
            transition-all duration-300 ease-out
            focus:outline-none focus:ring-2 focus:ring-periwinkle focus:border-periwinkle
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error
              ? "border-blush focus:ring-blush focus:border-blush"
              : "border-dust hover:border-stone"
            }
            ${className}
          `}
          aria-invalid={!!error}
          aria-label={label || props["aria-label"]}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="text-sm text-blush font-sans" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
