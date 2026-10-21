"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { usePathname } from "next/navigation";
import { motion, LayoutGroup } from "framer-motion";
import gsap from "gsap";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Dot } from "@/components/brand/dot";
import { DotPattern } from "@/components/brand/dot-pattern";
import { TransitionLink } from "@/components/layout/transition-link";
import { ScrambleText } from "@/components/ui/scramble-text";
import { useLenis } from "@/components/providers/smooth-scroll";
import { usePageReady, PAGE_READY_EVENT } from "@/lib/transition";
import { NAV_ITEMS, MENU_ITEMS, CONTACT } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Global Minibyte Navbar
 *
 * Features:
 * - Desktop: Left logo, centered solid pill nav with ScrambleText hover & Framer Motion active lamp, right Contact CTA.
 * - Mobile: Left logo, right MENU/CLOSE button with 2-line rotating icon; full-screen Radix Dialog menu with clip-path wipe.
 * - Theme Detection: Automatically flips to .theme-ink when over sections declaring data-nav-theme="ink".
 * - Smart Scroll Hide/Show: Hides on scroll down (> 160px), reveals on scroll up.
 * - Page Ready Intro: Fades and slides in only after the preloader / page curtain has lifted.
 */
export function Navbar() {
  const pathname = usePathname();
  const lenis = useLenis();

  // State
  const [theme, setTheme] = useState<"paper" | "ink" | "blue">("paper");
  const [isReady, setIsReady] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolledMobile, setIsScrolledMobile] = useState(false);
  const [hoveredNavIdx, setHoveredNavIdx] = useState<number | null>(null);

  // Refs
  const headerRef = useRef<HTMLElement>(null);
  const menuContentRef = useRef<HTMLDivElement>(null);
  const menuListRef = useRef<HTMLDivElement>(null);
  const lastScrollYRef = useRef(0);
  const isGracePeriodRef = useRef(true);

  // Intro animation: listen for page ready
  usePageReady(() => {
    setIsReady(true);
    isGracePeriodRef.current = true;
    setTimeout(() => {
      isGracePeriodRef.current = false;
    }, 600);
  });

  // GSAP Intro slide-in when page becomes ready
  useEffect(() => {
    if (!isReady || !headerRef.current) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      headerRef.current.style.opacity = "1";
      headerRef.current.style.transform = "translateY(0)";
      return;
    }

    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: -16 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "cubic-bezier(0.16, 1, 0.3, 1)",
      }
    );
  }, [isReady]);

  // THEME DETECTION: Evaluate element under y = 36px (navbar center)
  const updateTheme = useCallback(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-nav-theme]");
    let activeTheme: "paper" | "ink" | "blue" = "paper";

    for (let i = 0; i < elements.length; i++) {
      const rect = elements[i].getBoundingClientRect();
      if (rect.top <= 36 && rect.bottom >= 36) {
        const attr = elements[i].getAttribute("data-nav-theme");
        if (attr === "ink" || attr === "paper" || attr === "blue") {
          activeTheme = attr;
          break;
        }
      }
    }

    setTheme((prev) => (prev !== activeTheme ? activeTheme : prev));
  }, []);

  // SCROLL HANDLER: Theme check, hide/show on scroll, mobile background
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentY = window.scrollY;
          const delta = currentY - lastScrollYRef.current;
          lastScrollYRef.current = currentY;

          // Theme detection
          updateTheme();

          // Mobile solid background past 8px
          setIsScrolledMobile(currentY > 8);

          // Show/Hide calculations
          const hasFocus = headerRef.current?.contains(document.activeElement);
          const isUnderGrace =
            isGracePeriodRef.current ||
            (typeof window !== "undefined" &&
              typeof (window as unknown as { __mbNavGrace?: number }).__mbNavGrace === "number" &&
              performance.now() < ((window as unknown as { __mbNavGrace?: number }).__mbNavGrace ?? 0));

          // Always visible if: menu open, element inside focused, or grace period
          if (isOpen || hasFocus || isUnderGrace) {
            setIsHidden(false);
          } else if (currentY <= 160) {
            setIsHidden(false);
          } else if (delta > 4) {
            // Scrolling down past 160px
            setIsHidden(true);
          } else if (delta < -4) {
            // Scrolling up
            setIsHidden(false);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    if (lenis) {
      lenis.on("scroll", handleScroll);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateTheme, { passive: true });
    window.addEventListener(PAGE_READY_EVENT, updateTheme);

    // Initial check
    updateTheme();

    return () => {
      if (lenis) {
        lenis.off("scroll", handleScroll);
      }
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateTheme);
      window.removeEventListener(PAGE_READY_EVENT, updateTheme);
    };
  }, [lenis, isOpen, updateTheme]);

  // Re-check theme on route change
  useEffect(() => {
    updateTheme();
  }, [pathname, updateTheme]);

  // MOBILE MENU: Lock Lenis scroll while open
  useEffect(() => {
    if (isOpen) {
      if (lenis) lenis.stop();
    } else {
      if (lenis) lenis.start();
    }
  }, [isOpen, lenis]);

  // MOBILE MENU: Auto-close on pathname change or window resize >= 768px
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // MOBILE MENU ANIMATION: Clip-path reveal + staggered links
  useEffect(() => {
    if (!isOpen) return;

    const contentEl = menuContentRef.current;
    const listEl = menuListRef.current;
    if (!contentEl || !listEl) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      contentEl.style.clipPath = "inset(0 0 0% 0)";
      return;
    }

    const tl = gsap.timeline();
    tl.fromTo(
      contentEl,
      { clipPath: "inset(0 0 100% 0)" },
      { clipPath: "inset(0 0 0% 0)", duration: 0.55, ease: "power3.inOut" }
    );

    const items = listEl.querySelectorAll(".mobile-menu-item");
    if (items.length > 0) {
      tl.fromTo(
        items,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.06,
          ease: "cubic-bezier(0.16, 1, 0.3, 1)",
        },
        "-=0.25"
      );
    }

    return () => {
      tl.kill();
    };
  }, [isOpen]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <header
        id="site-header"
        ref={headerRef}
        data-nav-theme={isOpen ? "ink" : theme}
        className={cn(
          "fixed top-0 inset-x-0 h-[var(--nav-h)] transition-colors duration-300",
          isOpen
            ? "z-[70] theme-ink bg-background border-b border-border"
            : "z-50",
          !isOpen && (theme === "ink" || theme === "blue") && "theme-ink",
          !isReady && "opacity-0 pointer-events-none",
          isHidden && !isOpen && "-translate-y-full",
          "transition-transform duration-300 ease-out",
          !isOpen && (
            isScrolledMobile
              ? theme === "blue"
                ? "max-md:bg-ink max-md:border-b max-md:border-border"
                : "max-md:bg-background max-md:border-b max-md:border-border"
              : "max-md:bg-transparent max-md:border-transparent"
          ),
          "md:bg-transparent md:border-transparent"
        )}
      >
        <div className="mx-auto max-w-[1280px] h-full px-4 sm:px-6 md:px-8 flex items-center justify-between md:grid md:grid-cols-[auto_1fr_auto]">
          {/* LEFT: Logo */}
          <div className="flex items-center">
            <Logo
              asLink
              href="/"
              variant="logo"
              size="1.125rem"
              tone={isOpen ? "paper" : theme === "blue" ? "mono" : theme === "ink" ? "paper" : "ink"}
              className={theme === "blue" && !isOpen ? "text-white" : undefined}
              onClick={() => {
                if (isOpen) setIsOpen(false);
              }}
            />
          </div>

          {/* CENTER (desktop): Pill Navigation */}
          <nav
            aria-label="Primary"
            className="hidden md:inline-flex justify-self-center items-center gap-1 p-1 rounded-full border border-border bg-card text-sm font-medium select-none"
          >
            <LayoutGroup id="desktop-nav-pill">
              {NAV_ITEMS.map((item, idx) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(item.href + "/");
                const isHovered = hoveredNavIdx === idx;

                return (
                  <TransitionLink
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    onMouseEnter={() => setHoveredNavIdx(idx)}
                    onMouseLeave={() => setHoveredNavIdx(null)}
                    onFocus={() => setHoveredNavIdx(idx)}
                    onBlur={() => setHoveredNavIdx(null)}
                    className={cn(
                      "relative px-4 py-2 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isActive
                        ? "text-foreground bg-muted"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {/* Active Lamp Indicator */}
                    {isActive && (
                      <motion.span
                        layoutId="nav-lamp"
                        className="absolute -top-px left-1/2 -translate-x-1/2 w-6 h-[2px] rounded-full bg-foreground pointer-events-none"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}

                    {/* Scrambled label on hover */}
                    <ScrambleText trigger={isHovered}>
                      {item.name}
                    </ScrambleText>
                  </TransitionLink>
                );
              })}
            </LayoutGroup>
          </nav>

          {/* RIGHT (desktop): Contact CTA */}
          <div className="hidden md:flex items-center justify-end">
            <TransitionLink
              href="/contact"
              aria-current={pathname.startsWith("/contact") ? "page" : undefined}
              className="inline-flex h-10 items-center gap-2 rounded-full px-5 text-sm font-medium bg-primary text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors group select-none"
            >
              <span>Contact</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </TransitionLink>
          </div>

          {/* MOBILE (below md): Menu Button */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            className={cn(
              "md:hidden rounded-full h-10 px-4 border text-xs font-mono uppercase tracking-[0.08em] flex items-center gap-2.5 transition-all select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95",
              isOpen
                ? "border-border bg-card text-foreground"
                : theme === "blue"
                ? "border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                : "border-border bg-card text-foreground hover:bg-muted"
            )}
          >
            <span className="font-medium">{isOpen ? "CLOSE" : "MENU"}</span>
            <span
              className="relative w-[14px] h-[10px] flex items-center justify-center pointer-events-none"
              aria-hidden="true"
            >
              <span
                className={cn(
                  "absolute w-[14px] h-[1.5px] rounded-full transition-transform duration-200 ease-out",
                  isOpen
                    ? "bg-foreground rotate-45 translate-y-0"
                    : theme === "blue"
                    ? "bg-white -translate-y-[3px]"
                    : "bg-foreground -translate-y-[3px]"
                )}
              />
              <span
                className={cn(
                  "absolute w-[14px] h-[1.5px] rounded-full transition-transform duration-200 ease-out",
                  isOpen
                    ? "bg-foreground -rotate-45 translate-y-0"
                    : theme === "blue"
                    ? "bg-white translate-y-[3px]"
                    : "bg-foreground translate-y-[3px]"
                )}
              />
            </span>
          </button>
        </div>
      </header>

      {/* FULL-SCREEN MOBILE MENU MODAL */}
      <Dialog.Portal>
        <Dialog.Content
          id="mobile-menu"
          ref={menuContentRef}
          onEscapeKeyDown={() => setIsOpen(false)}
          className="fixed inset-0 z-[60] theme-ink bg-background text-foreground pt-[calc(var(--nav-h)+16px)] px-5 sm:px-6 pb-6 flex flex-col justify-between overflow-y-auto overscroll-contain outline-none min-h-[100dvh] [-webkit-overflow-scrolling:touch]"
        >
          <Dialog.Title className="sr-only">Site Navigation</Dialog.Title>
          <Dialog.Description className="sr-only">
            Primary site navigation links and laboratory contact details
          </Dialog.Description>

          {/* Menu Items List */}
          <div ref={menuListRef} className="flex flex-col w-full my-auto">
            {MENU_ITEMS.map((item, idx) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(item.href + "/");
              const numStr = String(idx + 1).padStart(2, "0");

              return (
                <div key={item.href} className="mobile-menu-item w-full">
                  <TransitionLink
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between py-3.5 sm:py-4 border-b border-border w-full group transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[52px]"
                  >
                    <span className="flex items-baseline gap-3 sm:gap-4">
                      <span className="font-mono text-xs text-muted-foreground tabular-nums select-none">
                        {numStr}
                      </span>
                      <span className="text-[clamp(1.625rem,7vw,2.5rem)] font-medium tracking-tight text-foreground transition-transform duration-200 group-hover:translate-x-1">
                        {item.name}
                      </span>
                    </span>

                    {/* Blue dot after active item exclusively */}
                    {isActive ? (
                      <span className="flex items-center gap-2">
                        <span className="sr-only">(current page)</span>
                        <Dot
                          color="blue"
                          className="text-2xl"
                        />
                      </span>
                    ) : (
                      <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" />
                    )}
                  </TransitionLink>
                </div>
              );
            })}
          </div>

          {/* Bottom Decoration & Lab Tagline */}
          <div className="pt-6 sm:pt-8 flex flex-col min-[400px]:flex-row min-[400px]:items-end justify-between gap-4 border-t border-border/40 mt-6 sm:mt-8 pb-[max(1rem,env(safe-area-inset-bottom,1rem))] shrink-0">
            <div className="space-y-1">
              <div className="label-mono text-muted-foreground text-[10px] sm:text-[11px]">
                AI RESEARCH LAB
              </div>
              <a
                href={`mailto:${CONTACT.email}`}
                className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors select-all block"
              >
                {CONTACT.email}
              </a>
            </div>

            <div
              className="opacity-50 pointer-events-none select-none hidden min-[440px]:block shrink-0"
              aria-hidden="true"
            >
              <DotPattern
                crop={{ col: 0, row: 0, cols: 8, rows: 2 }}
                tone="paper"
                style={{ width: "104px", height: "26px" }}
              />
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default Navbar;
