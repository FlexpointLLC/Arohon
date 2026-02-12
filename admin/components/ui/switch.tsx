"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const TRACK_WIDTH = 44;
const TRACK_HEIGHT = 24;
const THUMB_SIZE = 18;
const PADDING = 3;
const TRAVEL = TRACK_WIDTH - THUMB_SIZE - PADDING * 2;

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, checked, onCheckedChange, disabled, ...props }, ref) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      ref={ref}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex shrink-0 cursor-pointer items-center rounded-full border-0 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-[var(--primary)]" : "bg-slate-600",
        className
      )}
      style={{
        width: TRACK_WIDTH,
        height: TRACK_HEIGHT,
      }}
      {...props}
    >
      <span
        className="pointer-events-none absolute rounded-full bg-white shadow-md transition-transform duration-200"
        style={{
          width: THUMB_SIZE,
          height: THUMB_SIZE,
          left: PADDING,
          top: (TRACK_HEIGHT - THUMB_SIZE) / 2,
          transform: checked ? `translateX(${TRAVEL}px)` : "translateX(0)",
        }}
      />
    </button>
  )
);
Switch.displayName = "Switch";

export { Switch };
