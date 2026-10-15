"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CopyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
}

/**
 * CopyButton provides a robust, accessible copy-to-clipboard action.
 * Features:
 * - navigator.clipboard API with fallback to hidden textarea execCommand and mailto navigation.
 * - aria-live status element announcing "Email copied" to assistive tech.
 * - Icon and text feedback swap for 1.6s with timer reset protection.
 * - Safe unmount cleanup.
 */
export function CopyButton({
  value,
  label,
  copiedLabel = "Copied",
  className,
  ...rest
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleCopy = useCallback(async () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    let success = false;

    // 1. Modern clipboard API
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(value);
        success = true;
      } catch {
        success = false;
      }
    }

    // 2. Legacy fallback
    if (!success && typeof document !== "undefined") {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = value;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        success = document.execCommand("copy");
        document.body.removeChild(textarea);
      } catch {
        success = false;
      }
    }

    // 3. Fallback to mailto link if copy completely fails
    if (!success && typeof window !== "undefined") {
      window.location.href = `mailto:${value}`;
      return;
    }

    if (success) {
      setCopied(true);
      setStatusMessage("Email copied");

      timerRef.current = setTimeout(() => {
        setCopied(false);
        setStatusMessage("");
      }, 1600);
    }
  }, [value]);

  const displayLabel = copied ? copiedLabel : (label ?? value);

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copy email address ${value}`}
      className={cn(
        "inline-flex h-14 items-center justify-center gap-3 rounded-full px-6 text-base font-medium select-none cursor-pointer transition-colors duration-200",
        "border border-[var(--cta-line)] text-white",
        "[@media(hover:hover)]:hover:border-white [@media(hover:hover)]:hover:bg-white/[0.08]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bit-blue)]",
        "active:scale-[0.98]",
        className
      )}
      {...rest}
    >
      {/* Icon feedback */}
      <span className="shrink-0 transition-transform duration-200" aria-hidden="true">
        {copied ? (
          <Check className="w-4 h-4 text-white" />
        ) : (
          <Copy className="w-4 h-4 text-white" />
        )}
      </span>

      {/* Label in Geist Mono */}
      <span className="font-mono text-[15px] tracking-tight truncate">
        {displayLabel}
      </span>

      {/* Accessible live status for screen readers */}
      <span role="status" aria-live="polite" className="sr-only">
        {statusMessage}
      </span>
    </button>
  );
}

export default CopyButton;
