"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  FormEvent,
  ChangeEvent,
} from "react";
import { useSearchParams } from "next/navigation";
import { motion, useInView } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { ByteMark } from "@/components/brand/byte-mark";
import { CopyButton } from "@/components/ui/copy-button";
import {
  CONTACT_PAGE,
  TOPICS,
  contactSchema,
  TopicValue,
} from "@/lib/contact";
import { CONTACT } from "@/lib/constants";
import { cn } from "@/lib/utils";

const DRAFT_KEY = "mb-contact-draft";
const REQUEST_TIMEOUT_MS = 15000;

interface FormValues {
  name: string;
  email: string;
  company: string;
  topic: string;
  message: string;
  website: string;
}

const initialValues: FormValues = {
  name: "",
  email: "",
  company: "",
  topic: "",
  message: "",
  website: "",
};

export interface ContactFormProps {
  onSuccessChange?: (success: boolean) => void;
}

export function ContactForm({ onSuccessChange }: ContactFormProps) {
  const searchParams = useSearchParams();
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-10% 0px" });

  const [values, setValues] = useState<FormValues>(initialValues);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Form container height freeze to avoid jump on swap
  const [cardMinHeight, setCardMinHeight] = useState<number | undefined>(undefined);

  // Success ByteMark animation state
  const [successByte, setSuccessByte] = useState<number>(0);
  // Submitting loader ByteMark state
  const [loaderByte, setLoaderByte] = useState<number>(0);

  // Refs
  const startedAtRef = useRef<number>(0);
  const isSubmittingFlagRef = useRef<boolean>(false);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const draftTimerRef = useRef<NodeJS.Timeout | null>(null);
  const loaderIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const rafIdRef = useRef<number | null>(null);

  // 1. Initialize startedAt on mount
  useEffect(() => {
    startedAtRef.current = Date.now();
  }, []);

  // 2. Reduced motion detection
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(media.matches);
    const onChange = () => setPrefersReducedMotion(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  // 3. Restore draft from sessionStorage after mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setValues((prev) => ({
          ...prev,
          name: typeof parsed.name === "string" ? parsed.name : prev.name,
          email: typeof parsed.email === "string" ? parsed.email : prev.email,
          company: typeof parsed.company === "string" ? parsed.company : prev.company,
          topic: typeof parsed.topic === "string" ? parsed.topic : prev.topic,
          message: typeof parsed.message === "string" ? parsed.message : prev.message,
        }));
      }
    } catch {
      // ignore storage access issues
    }
  }, []);

  // 4. Topic prefill from ?topic=slug (if present and matching a topic)
  useEffect(() => {
    const topicQuery = searchParams.get("topic");
    if (topicQuery) {
      const match = TOPICS.find((t) => t.value === topicQuery);
      if (match) {
        setValues((prev) => ({
          ...prev,
          topic: match.value,
        }));
      }
    }
  }, [searchParams]);

  // 5. Debounced draft persistence to sessionStorage (400ms)
  useEffect(() => {
    if (submissionId) return; // Do not persist after success

    if (draftTimerRef.current) {
      clearTimeout(draftTimerRef.current);
    }

    draftTimerRef.current = setTimeout(() => {
      try {
        const payload = {
          name: values.name,
          email: values.email,
          company: values.company,
          topic: values.topic,
          message: values.message,
        };
        sessionStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
      } catch {
        // ignore storage errors
      }
    }, 400);

    return () => {
      if (draftTimerRef.current) {
        clearTimeout(draftTimerRef.current);
      }
    };
  }, [values, submissionId]);

  // 6. Submitting mini loader cycle (0..255 every 120ms)
  useEffect(() => {
    if (isSubmitting && !prefersReducedMotion) {
      loaderIntervalRef.current = setInterval(() => {
        setLoaderByte((prev) => (prev + 37) % 256);
      }, 120);
    } else {
      if (loaderIntervalRef.current) {
        clearInterval(loaderIntervalRef.current);
      }
    }

    return () => {
      if (loaderIntervalRef.current) {
        clearInterval(loaderIntervalRef.current);
      }
    };
  }, [isSubmitting, prefersReducedMotion]);

  // 7. Success state entrance animation & focus
  useEffect(() => {
    if (!submissionId) return;

    onSuccessChange?.(true);

    // Focus success title for screen readers
    setTimeout(() => {
      successHeadingRef.current?.focus();
    }, 100);

    if (prefersReducedMotion) {
      setSuccessByte(109);
      return;
    }

    setSuccessByte(0);
    const startTime = performance.now();
    const duration = 1100;

    const animateSuccess = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease in out quad
      const ease =
        progress < 0.5
          ? 2 * progress * progress
          : -1 + (4 - 2 * progress) * progress;
      const current = Math.round(ease * 109);
      setSuccessByte(current);

      if (progress < 1) {
        rafIdRef.current = requestAnimationFrame(animateSuccess);
      }
    };

    rafIdRef.current = requestAnimationFrame(animateSuccess);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [submissionId, prefersReducedMotion, onSuccessChange]);

  // Validate single field
  const validateField = useCallback((field: keyof FormValues, val: string) => {
    let errorMsg = "";
    if (field === "name") {
      if (!val.trim()) errorMsg = "Please enter your name";
      else if (val.trim().length < 2) errorMsg = "Please enter your name (at least 2 characters)";
      else if (val.length > 80) errorMsg = "Name cannot exceed 80 characters";
    } else if (field === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!val.trim()) errorMsg = "Please enter your email";
      else if (!emailRegex.test(val.trim())) errorMsg = "Please enter a valid email";
      else if (val.length > 120) errorMsg = "Email cannot exceed 120 characters";
    } else if (field === "company") {
      if (val.length > 120) errorMsg = "Company name cannot exceed 120 characters";
    } else if (field === "topic") {
      if (!val) errorMsg = "Please choose a topic";
      else if (!TOPICS.some((t) => t.value === val)) errorMsg = "Please choose a valid topic";
    } else if (field === "message") {
      if (!val.trim()) errorMsg = "Please write a message";
      else if (val.trim().length < 20) errorMsg = "Please write at least 20 characters";
      else if (val.length > 4000) errorMsg = "Message cannot exceed 4000 characters";
    }

    setFieldErrors((prev) => {
      const updated = { ...prev };
      if (errorMsg) updated[field] = errorMsg;
      else delete updated[field];
      return updated;
    });

    return errorMsg;
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    // If touched, re-validate dynamically
    if (touched[name]) {
      validateField(name as keyof FormValues, value);
    }
  };

  const handleBlur = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name as keyof FormValues, value);
  };

  const executeSubmit = async () => {
    if (isSubmittingFlagRef.current) return;

    // Full validation using contactSchema
    const parseResult = contactSchema.safeParse({
      ...values,
      topic: values.topic as TopicValue,
      startedAt: startedAtRef.current || Date.now(),
    });

    if (!parseResult.success) {
      const newErrors: Record<string, string> = {};
      const newTouched: Record<string, boolean> = {};

      for (const issue of parseResult.error.issues) {
        const fieldName = issue.path[0] as string;
        if (!newErrors[fieldName]) {
          newErrors[fieldName] = issue.message;
        }
        newTouched[fieldName] = true;
      }

      setFieldErrors(newErrors);
      setTouched((prev) => ({ ...prev, ...newTouched }));

      // Focus first invalid element
      const firstInvalidField = Object.keys(newErrors)[0];
      if (firstInvalidField) {
        const invalidEl = document.getElementById(`field-${firstInvalidField}`);
        if (invalidEl) {
          invalidEl.focus();
        } else {
          errorSummaryRef.current?.focus();
        }
      }
      return;
    }

    // Measure height before starting submission to prevent CLS on swap
    if (cardRef.current) {
      setCardMinHeight(cardRef.current.offsetHeight);
    }

    isSubmittingFlagRef.current = true;
    setIsSubmitting(true);
    setServerError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          startedAt: startedAtRef.current,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.status === 200) {
        const data = await res.json();
        const id = data.id || "MB-" + Math.random().toString(36).slice(2, 8).toUpperCase();
        try {
          sessionStorage.removeItem(DRAFT_KEY);
        } catch {}
        setSubmissionId(id);
      } else if (res.status === 400) {
        const data = await res.json();
        if (data.errors) {
          setFieldErrors(data.errors);
          const firstKey = Object.keys(data.errors)[0];
          if (firstKey) {
            document.getElementById(`field-${firstKey}`)?.focus();
          }
        } else {
          setServerError(CONTACT_PAGE.form.error.text);
        }
      } else if (res.status === 429) {
        setServerError("Too many messages. Please try again later or write to us directly.");
      } else {
        setServerError(CONTACT_PAGE.form.error.text);
      }
    } catch {
      setServerError(CONTACT_PAGE.form.error.text);
    } finally {
      clearTimeout(timeoutId);
      isSubmittingFlagRef.current = false;
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await executeSubmit();
  };

  const handleResetForm = () => {
    setValues(initialValues);
    setTouched({});
    setFieldErrors({});
    setServerError(null);
    setSubmissionId(null);
    setCardMinHeight(undefined);
    startedAtRef.current = Date.now();
    onSuccessChange?.(false);
  };

  const errorEntries = Object.entries(fieldErrors);
  const errorCount = errorEntries.length;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 16 }}
      animate={{
        opacity: isInView || prefersReducedMotion ? 1 : 0,
        y: isInView || prefersReducedMotion ? 0 : 16,
      }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.6,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={cardMinHeight ? { minHeight: cardMinHeight } : undefined}
      className="bg-card border border-border rounded-2xl p-6 md:p-10 flex flex-col justify-center transition-all duration-300 relative w-full"
    >
      {/* SUCCESS PANEL */}
      {submissionId ? (
        <div
          role="status"
          aria-live="polite"
          className="flex flex-col items-start gap-6 py-6 md:py-10 animate-fade-in"
        >
          {/* Top meta */}
          <div className="flex items-center justify-between w-full">
            <span className="label-mono text-muted-foreground">SENT</span>
            <span className="data-mono text-muted-foreground select-none">
              01101101 = m
            </span>
          </div>

          {/* ByteMark animated 0 -> 109 with last dot Bit Blue */}
          <div
            className="my-2 select-none"
            style={{ ["--ink" as string]: "var(--foreground)" }}
          >
            <ByteMark
              animated={!prefersReducedMotion}
              value={successByte}
              tone="ink"
              blueLast={true}
              className="w-20"
            />
          </div>

          {/* Success Title */}
          <h3
            ref={successHeadingRef}
            tabIndex={-1}
            className="text-2xl md:text-3xl font-medium tracking-tight text-foreground focus-visible:outline-none"
          >
            {CONTACT_PAGE.form.success.title}
          </h3>

          <p className="text-base text-muted-foreground max-w-[500px] leading-relaxed">
            {CONTACT_PAGE.form.success.text}
          </p>

          {/* Reference row */}
          <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-background border border-border w-full max-w-[460px] select-text">
            <span className="label-mono text-muted-foreground shrink-0">
              {CONTACT_PAGE.form.success.ref}
            </span>
            <span className="data-mono font-medium text-foreground text-sm">
              {submissionId}
            </span>
            <div className="ml-auto">
              <CopyButton
                value={submissionId}
                label="Copy ref"
                copiedLabel="Copied"
                className="h-8 px-3 rounded-md border-border text-xs text-foreground hover:bg-foreground/10 hover:border-foreground"
              />
            </div>
          </div>

          {/* Send another message action */}
          <button
            type="button"
            onClick={handleResetForm}
            className="group relative inline-flex items-center text-sm font-medium text-foreground select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm pt-4"
          >
            <span>{CONTACT_PAGE.form.success.again}</span>
            <span
              aria-hidden="true"
              className="absolute bottom-0 inset-x-0 h-px bg-current scale-x-0 origin-right transition-transform duration-300 ease-out group-hover:scale-x-100 group-hover:origin-left group-focus-visible:scale-x-100 group-focus-visible:origin-left pointer-events-none"
            />
          </button>
        </div>
      ) : (
        /* FORM COMPONENT */
        <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Honeypot field (hidden from view, accessible to naive bots) */}
          <div
            className="absolute -left-[9999px]"
            aria-hidden="true"
            tabIndex={-1}
          >
            <label htmlFor="field-website">Website (leave blank)</label>
            <input
              id="field-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={values.website}
              onChange={handleChange}
            />
          </div>

          {/* Grid Layout: 2 columns on md+ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
            {/* 1. NAME */}
            <div className="flex flex-col gap-2">
              <label htmlFor="field-name" className="label-mono text-muted-foreground">
                {CONTACT_PAGE.form.labels.name}
              </label>
              <input
                id="field-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={Boolean(fieldErrors.name)}
                aria-describedby={fieldErrors.name ? "name-error" : undefined}
                placeholder="Jane Doe"
                className={cn(
                  "h-12 rounded-xl border bg-background px-4 text-base text-foreground transition-colors",
                  "placeholder:text-muted-foreground/60",
                  "[@media(hover:hover)]:hover:border-foreground/40",
                  "focus:border-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0",
                  fieldErrors.name ? "border-foreground" : "border-border"
                )}
              />
              {fieldErrors.name && (
                <div
                  id="name-error"
                  className="flex items-center gap-1.5 text-sm text-foreground mt-0.5"
                >
                  <span
                    className="w-1.5 h-1.5 bg-foreground shrink-0 inline-block"
                    aria-hidden="true"
                  />
                  <span>{fieldErrors.name}</span>
                </div>
              )}
            </div>

            {/* 2. EMAIL */}
            <div className="flex flex-col gap-2">
              <label htmlFor="field-email" className="label-mono text-muted-foreground">
                {CONTACT_PAGE.form.labels.email}
              </label>
              <input
                id="field-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={fieldErrors.email ? "email-error" : undefined}
                placeholder="jane@company.com"
                className={cn(
                  "h-12 rounded-xl border bg-background px-4 text-base text-foreground transition-colors",
                  "placeholder:text-muted-foreground/60",
                  "[@media(hover:hover)]:hover:border-foreground/40",
                  "focus:border-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0",
                  fieldErrors.email ? "border-foreground" : "border-border"
                )}
              />
              {fieldErrors.email && (
                <div
                  id="email-error"
                  className="flex items-center gap-1.5 text-sm text-foreground mt-0.5"
                >
                  <span
                    className="w-1.5 h-1.5 bg-foreground shrink-0 inline-block"
                    aria-hidden="true"
                  />
                  <span>{fieldErrors.email}</span>
                </div>
              )}
            </div>

            {/* 3. COMPANY (Optional) */}
            <div className="flex flex-col gap-2">
              <label htmlFor="field-company" className="label-mono text-muted-foreground">
                {CONTACT_PAGE.form.labels.company}{" "}
                <span className="font-normal opacity-70">
                  ({CONTACT_PAGE.form.labels.companyHint})
                </span>
              </label>
              <input
                id="field-company"
                name="company"
                type="text"
                autoComplete="organization"
                value={values.company}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={Boolean(fieldErrors.company)}
                aria-describedby={fieldErrors.company ? "company-error" : undefined}
                placeholder="Acme Inc."
                className={cn(
                  "h-12 rounded-xl border bg-background px-4 text-base text-foreground transition-colors",
                  "placeholder:text-muted-foreground/60",
                  "[@media(hover:hover)]:hover:border-foreground/40",
                  "focus:border-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0",
                  fieldErrors.company ? "border-foreground" : "border-border"
                )}
              />
              {fieldErrors.company && (
                <div
                  id="company-error"
                  className="flex items-center gap-1.5 text-sm text-foreground mt-0.5"
                >
                  <span
                    className="w-1.5 h-1.5 bg-foreground shrink-0 inline-block"
                    aria-hidden="true"
                  />
                  <span>{fieldErrors.company}</span>
                </div>
              )}
            </div>

            {/* 4. TOPIC */}
            <div className="flex flex-col gap-2 relative">
              <label htmlFor="field-topic" className="label-mono text-muted-foreground">
                {CONTACT_PAGE.form.labels.topic}
              </label>
              <div className="relative">
                <select
                  id="field-topic"
                  name="topic"
                  required
                  value={values.topic}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={Boolean(fieldErrors.topic)}
                  aria-describedby={fieldErrors.topic ? "topic-error" : undefined}
                  className={cn(
                    "h-12 w-full appearance-none rounded-xl border bg-background px-4 pr-10 text-base text-foreground transition-colors cursor-pointer",
                    values.topic ? "text-foreground" : "text-muted-foreground/60",
                    "[@media(hover:hover)]:hover:border-foreground/40",
                    "focus:border-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0",
                    fieldErrors.topic ? "border-foreground" : "border-border"
                  )}
                >
                  <option value="" disabled>
                    Choose a topic
                  </option>
                  {TOPICS.map((topic) => (
                    <option
                      key={topic.value}
                      value={topic.value}
                      className="bg-background text-foreground"
                    >
                      {topic.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="w-4 h-4 text-muted-foreground absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
              </div>
              {fieldErrors.topic && (
                <div
                  id="topic-error"
                  className="flex items-center gap-1.5 text-sm text-foreground mt-0.5"
                >
                  <span
                    className="w-1.5 h-1.5 bg-foreground shrink-0 inline-block"
                    aria-hidden="true"
                  />
                  <span>{fieldErrors.topic}</span>
                </div>
              )}
            </div>

            {/* 5. MESSAGE (Full width) */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <div className="flex items-center justify-between w-full">
                <label htmlFor="field-message" className="label-mono text-muted-foreground">
                  {CONTACT_PAGE.form.labels.message}
                </label>
                <span
                  className={cn(
                    "data-mono text-xs select-none",
                    values.message.length > 3800
                      ? "text-foreground font-medium"
                      : "text-muted-foreground"
                  )}
                  aria-hidden="true"
                >
                  {values.message.length} / 4000
                </span>
              </div>
              <textarea
                id="field-message"
                name="message"
                rows={6}
                required
                value={values.message}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={Boolean(fieldErrors.message)}
                aria-describedby={fieldErrors.message ? "message-error" : undefined}
                placeholder={CONTACT_PAGE.form.labels.messageHint}
                className={cn(
                  "min-h-[160px] rounded-xl border bg-background p-4 text-base text-foreground transition-colors resize-y",
                  "placeholder:text-muted-foreground/60",
                  "[@media(hover:hover)]:hover:border-foreground/40",
                  "focus:border-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0",
                  fieldErrors.message ? "border-foreground" : "border-border"
                )}
              />
              {fieldErrors.message && (
                <div
                  id="message-error"
                  className="flex items-center gap-1.5 text-sm text-foreground mt-0.5"
                >
                  <span
                    className="w-1.5 h-1.5 bg-foreground shrink-0 inline-block"
                    aria-hidden="true"
                  />
                  <span>{fieldErrors.message}</span>
                </div>
              )}
            </div>
          </div>

          {/* ERROR SUMMARY (Role alert, focused on failed submit) */}
          {errorCount > 0 && (
            <div
              ref={errorSummaryRef}
              role="alert"
              tabIndex={-1}
              className="border border-border rounded-xl p-4 bg-background text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <p className="font-medium mb-1">
                Please fix {errorCount} {errorCount === 1 ? "field" : "fields"}:
              </p>
              <ul className="list-disc list-inside space-y-0.5 text-muted-foreground text-xs">
                {errorEntries.map(([field, msg]) => (
                  <li key={field}>
                    <button
                      type="button"
                      onClick={() => document.getElementById(`field-${field}`)?.focus()}
                      className="underline hover:text-foreground text-left"
                    >
                      {msg}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* SERVER / NETWORK ERROR PANEL (Inline above submit button) */}
          {serverError && (
            <div
              role="alert"
              className="border border-border rounded-xl p-5 bg-background text-foreground flex flex-col gap-3"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 bg-foreground rounded-none inline-block shrink-0"
                  aria-hidden="true"
                />
                <h4 className="text-base font-medium">
                  {CONTACT_PAGE.form.error.title}
                </h4>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {serverError}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={executeSubmit}
                  className="h-10 px-4 rounded-full border border-border text-sm font-medium hover:border-foreground hover:bg-foreground/10 transition-colors"
                >
                  {CONTACT_PAGE.form.error.retry}
                </button>
                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="text-sm font-mono underline hover:text-muted-foreground"
                  >
                    {CONTACT.email}
                  </a>
                  <CopyButton
                    value={CONTACT.email}
                    label="Copy email"
                    copiedLabel="Copied"
                    className="h-8 px-3 rounded-md border-border text-xs text-foreground hover:bg-foreground/10 hover:border-foreground"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SUBMIT BUTTON ROW */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className={cn(
                "h-14 px-7 rounded-full bg-primary text-primary-foreground inline-flex items-center justify-center gap-3 text-base font-medium transition-all duration-200 select-none group w-full sm:w-auto",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "active:scale-[0.98] [@media(hover:hover)]:hover:-translate-y-px",
                "disabled:opacity-75 disabled:pointer-events-none"
              )}
            >
              {isSubmitting ? (
                prefersReducedMotion ? (
                  <span>Sending…</span>
                ) : (
                  <>
                    <span>SENDING</span>
                    <ByteMark
                      animated
                      value={loaderByte}
                      tone="mono"
                      blueLast={false}
                      className="w-8 shrink-0 text-primary-foreground"
                      aria-hidden="true"
                    />
                  </>
                )
              ) : (
                <>
                  <span>{CONTACT_PAGE.form.submit}</span>
                  <span
                    aria-hidden="true"
                    className="w-8 h-8 rounded-full bg-primary-foreground text-primary grid place-items-center shrink-0 transition-transform duration-200 group-hover:translate-x-[3px]"
                  >
                    <ArrowRight className="w-[18px] h-[18px]" />
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </motion.div>
  );
}

export default ContactForm;
