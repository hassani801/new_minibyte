"use client";

import React, { useState, useRef } from "react";
import { useInView } from "framer-motion";
import { Dot } from "@/components/brand/dot";
import { WordsPullUp } from "@/components/ui/words-pull-up";
import { UnderlineLink } from "@/components/ui/underline-link";
import { ContactForm } from "@/components/sections/contact/contact-form";
import { CONTACT_PAGE } from "@/lib/contact";
import { LEGAL } from "@/lib/constants";

export function FormSkeleton() {
  return (
    <section
      aria-hidden="true"
      className="theme-ink bg-background text-foreground py-24 lg:py-32 scroll-mt-[calc(var(--nav-h)+24px)] select-none"
    >
      <div className="mx-auto max-w-[1280px] w-full px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[4fr_8fr] gap-12 lg:gap-20">
          {/* Skeleton Left */}
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-paper shrink-0 inline-block" />
              <span className="label-mono text-muted-foreground">
                {CONTACT_PAGE.form.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-medium tracking-[-0.03em] mt-6 text-foreground">
              {CONTACT_PAGE.form.headline}
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-[380px] mt-6 leading-relaxed">
              {CONTACT_PAGE.form.privacy}
            </p>
          </div>

          {/* Skeleton Right Card */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-10 min-h-[620px] flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-12 bg-muted/40 rounded-xl" />
              <div className="h-12 bg-muted/40 rounded-xl" />
              <div className="h-12 bg-muted/40 rounded-xl" />
              <div className="h-12 bg-muted/40 rounded-xl" />
              <div className="h-40 md:col-span-2 bg-muted/40 rounded-xl" />
            </div>
            <div className="h-14 w-44 bg-muted/40 rounded-full mt-2" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function FormSection() {
  const [isSuccess, setIsSuccess] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-10% 0px" });

  const privacyPolicy = LEGAL.find(
    (item) => item.name.toLowerCase() === "privacy"
  );
  const isPrivacyEnabled = privacyPolicy?.enabled ?? false;

  return (
    <section
      id="form"
      ref={sectionRef}
      data-nav-theme="ink"
      aria-labelledby="form-title"
      style={{ scrollMarginTop: "calc(var(--nav-h) + 24px)" }}
      className="theme-ink bg-background text-foreground py-24 lg:py-32 relative select-text"
    >
      <div className="mx-auto max-w-[1280px] w-full px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[4fr_8fr] gap-12 lg:gap-20">
          {/* LEFT COLUMN (lg:sticky self-start) */}
          <div className="lg:sticky lg:top-[calc(var(--nav-h)+48px)] self-start flex flex-col items-start">
            {/* Eyebrow: label-mono + 6px Paper dot */}
            <div className="flex items-center gap-2 select-none">
              <span
                className="w-1.5 h-1.5 rounded-full bg-paper shrink-0 inline-block"
                aria-hidden="true"
              />
              <span className="label-mono text-muted-foreground">
                {CONTACT_PAGE.form.eyebrow}
              </span>
            </div>

            {/* H2 Headline: WordsPullUp + Dot (Bit Blue turns to currentColor when success panel is active) */}
            <h2
              id="form-title"
              className="text-[clamp(2.25rem,5vw,3.75rem)] font-medium tracking-[-0.035em] leading-[1.05] mt-6 text-foreground text-balance"
            >
              <WordsPullUp
                text={CONTACT_PAGE.form.headline}
                play={inView}
                stagger={0.08}
                lastWordAddon={
                  <Dot
                    color={isSuccess ? "current" : "blue"}
                    aria-hidden="true"
                  />
                }
              />
            </h2>

            {/* Privacy copy */}
            <p className="text-sm md:text-base text-muted-foreground max-w-[380px] mt-6 leading-relaxed">
              {CONTACT_PAGE.form.privacy}
            </p>

            {/* Legal Privacy Link if enabled */}
            {isPrivacyEnabled && (
              <div className="mt-4">
                <UnderlineLink
                  href="/privacy"
                  className="px-0 text-sm font-medium text-foreground"
                >
                  Privacy policy
                </UnderlineLink>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: The Form Card */}
          <div className="w-full">
            <ContactForm onSuccessChange={setIsSuccess} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default FormSection;
