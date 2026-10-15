"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CopyButton } from "@/components/ui/copy-button";
import { DotPattern } from "@/components/brand/dot-pattern";
import { CONTACT_PAGE } from "@/lib/contact";
import { CONTACT } from "@/lib/constants";
import { usePageReady } from "@/lib/transition";
import { cn } from "@/lib/utils";

const easeCurve = [0.16, 1, 0.3, 1] as const;

export function DirectCard({ className }: { className?: string }) {
  const [isReady, setIsReady] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  usePageReady(() => {
    setIsReady(true);
  });

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(media.matches);
    const onChange = () => setPrefersReducedMotion(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const whatsappDigits = (CONTACT.whatsapp ?? "").replace(/\D/g, "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{
        opacity: isReady || prefersReducedMotion ? 1 : 0,
        y: isReady || prefersReducedMotion ? 0 : 24,
      }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.8,
        ease: easeCurve,
      }}
      className={cn(
        "theme-ink bg-card text-card-foreground border border-border rounded-2xl p-6 md:p-8 min-h-[300px] flex flex-col relative overflow-hidden select-text w-full max-w-[540px]",
        className
      )}
    >
      {/* Corner decoration: DotPattern bleed crop at ~45% bottom-right of the card */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 right-0 w-[45%] h-[45%] pointer-events-none overflow-hidden select-none"
        style={{ opacity: 0.12 }}
      >
        <DotPattern
          bleed
          crop={{ col: 4, row: 0, cols: 4, rows: 4 }}
          tone="paper"
          showBlue={false}
          className="w-full h-full"
        />
      </div>

      {/* Top Row: Direct label left, Byte code right */}
      <div className="flex items-center justify-between w-full relative z-10">
        <span className="label-mono text-muted-foreground">
          {CONTACT_PAGE.direct.label}
        </span>
        <span className="data-mono text-muted-foreground select-none">
          01101101 = m
        </span>
      </div>

      {/* Middle: Email with drawing underline */}
      <div className="mt-auto pt-10 pb-4 relative z-10 flex flex-col items-start gap-4">
        <a
          href={`mailto:${CONTACT.email}`}
          className="group relative inline-block font-mono text-[clamp(1.25rem,3vw,1.75rem)] text-foreground tracking-tight break-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm w-fit"
        >
          <span>{CONTACT.email}</span>
          <span
            aria-hidden="true"
            className="absolute bottom-0 inset-x-0 h-px bg-current scale-x-0 origin-right transition-transform duration-300 ease-out group-hover:scale-x-100 group-hover:origin-left group-focus-visible:scale-x-100 group-focus-visible:origin-left pointer-events-none"
          />
        </a>

        {/* Action Row: Copy email + optional phone */}
        <div className="flex flex-wrap items-center gap-3">
          <CopyButton
            value={CONTACT.email}
            label="Copy email"
            copiedLabel="Copied"
            className="h-11 px-5 rounded-full border-border text-foreground hover:border-foreground hover:bg-foreground/10 text-sm font-medium"
          />

          {CONTACT.phone && (
            <a
              href={`tel:${CONTACT.phone}`}
              className="h-11 px-5 rounded-full border border-border text-sm font-mono inline-flex items-center text-foreground hover:border-foreground hover:bg-foreground/10 transition-colors"
            >
              <span>{CONTACT.phone}</span>
            </a>
          )}
        </div>

        {/* Response time notice */}
        <p className="label-mono text-muted-foreground mt-1">
          {CONTACT_PAGE.direct.response}
        </p>

        {/* Optional Booking and WhatsApp pills */}
        {(CONTACT.bookingUrl || CONTACT.whatsapp) && (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {CONTACT.bookingUrl && (
              <a
                href={CONTACT.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 px-4 rounded-full border border-border text-xs font-mono inline-flex items-center text-foreground hover:border-foreground hover:bg-foreground/10 transition-colors"
              >
                <span>{CONTACT_PAGE.direct.booking}</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}

            {CONTACT.whatsapp && (
              <a
                href={`https://wa.me/${whatsappDigits}`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 px-4 rounded-full border border-border text-xs font-mono inline-flex items-center text-foreground hover:border-foreground hover:bg-foreground/10 transition-colors"
              >
                <span>{CONTACT_PAGE.direct.whatsapp}</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
          </div>
        )}

        {/* Optional location */}
        {CONTACT.location && (
          <p className="label-mono text-muted-foreground pt-1">
            {CONTACT.location}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default DirectCard;
