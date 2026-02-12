"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const CaretDown = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="shrink-0 opacity-70"
    aria-hidden
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export type SelectNativeVariant = "success" | "warning" | "danger" | "neutral";

export interface SelectNativeProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "className"> {
  className?: string;
  /** Option value → label; omit for default (value as label) */
  options: { value: string; label?: string }[] | string[];
  /** Map option values to badge-style colors (e.g. pending→warning, approved→success) */
  variantByValue?: Record<string, SelectNativeVariant>;
  /** When true, replaces the caret with a spinner (e.g. while saving) */
  loading?: boolean;
}

/**
 * Custom-styled native <select> with proper right padding so the caret
 * never touches the right edge. Matches AlignUI .input-sleek look.
 */
const variantClasses: Record<SelectNativeVariant, string> = {
  success:
    "border-emerald-500/40 bg-emerald-500/20 text-emerald-400 focus-within:border-emerald-500 focus-within:ring-emerald-500/30",
  warning:
    "border-amber-500/40 bg-amber-500/20 text-amber-400 focus-within:border-amber-500 focus-within:ring-amber-500/30",
  danger:
    "border-red-500/40 bg-red-500/20 text-red-400 focus-within:border-red-500 focus-within:ring-red-500/30",
  neutral:
    "border-slate-600 bg-slate-800/80 text-slate-100 focus-within:border-[var(--primary)] focus-within:ring-[var(--primary)]/30",
};

const SelectNative = React.forwardRef<HTMLSelectElement, SelectNativeProps>(
  ({ className, options, variantByValue, loading, children, ...props }, ref) => {
    const normalizedOptions = options.map((o) =>
      typeof o === "string" ? { value: o, label: o } : o
    );
    const value = props.value ?? "";
    const variant: SelectNativeVariant =
      (variantByValue && variantByValue[String(value)]) || "neutral";
    const variantStyle = variantClasses[variant];

    return (
      <div
        className={cn(
          "relative inline-flex w-full min-w-0 rounded-lg border text-sm font-medium",
          "focus-within:ring-1 disabled:opacity-50",
          variantStyle,
          className
        )}
      >
        <select
          ref={ref}
          className={cn(
            "w-full min-w-0 cursor-pointer appearance-none rounded-lg border-0 bg-transparent py-1.5 pl-2.5 pr-8 text-inherit",
            "focus:outline-none disabled:cursor-not-allowed [color-scheme:dark]"
          )}
          {...props}
        >
          {children ??
            normalizedOptions.map(({ value, label }) => (
              <option key={value} value={value}>
                {label ?? value}
              </option>
            ))}
        </select>
        <span
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center opacity-80"
          aria-hidden
        >
          {loading ? (
            <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
          ) : (
            <CaretDown />
          )}
        </span>
      </div>
    );
  }
);
SelectNative.displayName = "SelectNative";

export { SelectNative };
