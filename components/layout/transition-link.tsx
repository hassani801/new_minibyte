"use client";

import React, { forwardRef } from "react";
import Link, { LinkProps } from "next/link";
import { usePageTransition } from "@/components/providers/page-transition";
import { useLenis } from "@/components/providers/smooth-scroll";
import { isPreloaderDone } from "@/lib/preloader";

export interface TransitionLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>,
    LinkProps {
  children?: React.ReactNode;
}

/**
 * Checks if a destination URL points to an external origin or non-HTTP protocol.
 */
function isExternalUrl(urlStr: string): boolean {
  if (
    urlStr.startsWith("mailto:") ||
    urlStr.startsWith("tel:") ||
    urlStr.startsWith("sms:") ||
    urlStr.startsWith("javascript:")
  ) {
    return true;
  }
  if (urlStr.startsWith("http://") || urlStr.startsWith("https://")) {
    try {
      const url = new URL(urlStr, window.location.href);
      return url.origin !== window.location.origin;
    } catch {
      return true;
    }
  }
  return false;
}

/**
 * TransitionLink intercepts internal navigation to trigger the brand Ink curtain transition.
 * Keeps Next.js prefetching and standard accessibility intact.
 */
export const TransitionLink = forwardRef<HTMLAnchorElement, TransitionLinkProps>(
  function TransitionLink(
    { href, onClick, target, download, ...rest },
    ref
  ) {
    const { navigate, isTransitioning } = usePageTransition();
    const lenis = useLenis();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Call user onClick handler first if supplied
      if (onClick) {
        onClick(e);
      }

      // 1. Let browser/Next handle normally if:
      // - Modifier keys pressed (Cmd/Ctrl/Shift/Alt click for new tab/window)
      // - Non-primary mouse button (e.g. middle click)
      // - Target is not _self
      // - Download link
      // - Default was already prevented
      if (
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        e.button !== 0 ||
        (target && target !== "_self") ||
        download !== undefined ||
        e.defaultPrevented
      ) {
        return;
      }

      // Convert href to string representation
      const hrefStr =
        typeof href === "object"
          ? (href.pathname || "") +
            (href.search ? `?${href.search}` : "") +
            (href.hash || "")
          : href;

      // 2. Ignore if external
      if (isExternalUrl(hrefStr)) {
        return;
      }

      // 3. If preloader is still running, let normal navigation handle it
      if (!isPreloaderDone()) {
        return;
      }

      // 4. Block new clicks while a transition is already in flight
      if (isTransitioning) {
        e.preventDefault();
        return;
      }

      // 5. In-page hash link on the same page (e.g. "#section")
      if (hrefStr.startsWith("#")) {
        e.preventDefault();
        if (lenis) {
          lenis.scrollTo(hrefStr, { offset: -80 });
        } else {
          const targetEl = document.querySelector(hrefStr);
          targetEl?.scrollIntoView({ behavior: "smooth" });
        }
        return;
      }

      // 6. Check if target has the same pathname and search as current URL
      let targetUrl: URL | null = null;
      try {
        targetUrl = new URL(hrefStr, window.location.href);
      } catch {
        targetUrl = null;
      }

      if (targetUrl) {
        const isSamePath = targetUrl.pathname === window.location.pathname;
        const isSameSearch = targetUrl.search === window.location.search;

        if (isSamePath && isSameSearch) {
          e.preventDefault();
          if (targetUrl.hash) {
            if (lenis) {
              lenis.scrollTo(targetUrl.hash, { offset: -80 });
            } else {
              const targetEl = document.querySelector(targetUrl.hash);
              targetEl?.scrollIntoView({ behavior: "smooth" });
            }
          } else {
            if (lenis) {
              lenis.scrollTo(0);
            } else {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }
          return;
        }
      }

      // 7. Full internal route change: intercept and run brand curtain animation
      e.preventDefault();
      navigate(hrefStr);
    };

    return (
      <Link
        ref={ref}
        href={href}
        target={target}
        download={download}
        onClick={handleClick}
        {...rest}
      />
    );
  }
);

TransitionLink.displayName = "TransitionLink";

export default TransitionLink;
