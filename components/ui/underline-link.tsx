"use client";

import React from "react";
import { TransitionLink, TransitionLinkProps } from "@/components/layout/transition-link";
import { cn } from "@/lib/utils";

export interface UnderlineLinkProps extends TransitionLinkProps {
  children: React.ReactNode;
  underlineClassName?: string;
}

/**
 * UnderlineLink is an accessible TransitionLink wrapper featuring an interactive
 * drawing underline: draws in from the left on hover/focus, and exits to the right on leave.
 */
export function UnderlineLink({
  href,
  children,
  className,
  underlineClassName,
  ...rest
}: UnderlineLinkProps) {
  return (
    <TransitionLink
      href={href}
      className={cn(
        "h-12 px-2 inline-flex items-center text-sm font-medium text-foreground relative group select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm",
        className
      )}
      {...rest}
    >
      <span>{children}</span>
      <span
        aria-hidden="true"
        className={cn(
          "absolute bottom-2 inset-x-2 h-px bg-current scale-x-0 origin-right transition-transform duration-300 ease-out group-hover:scale-x-100 group-hover:origin-left group-focus-visible:scale-x-100 group-focus-visible:origin-left pointer-events-none",
          underlineClassName
        )}
      />
    </TransitionLink>
  );
}

export default UnderlineLink;
