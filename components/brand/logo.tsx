import React from "react";
import { TransitionLink } from "@/components/layout/transition-link";
import { ByteMark } from "./byte-mark";
import { toBits } from "@/lib/byte";
import { cn } from "@/lib/utils";


export interface LogoProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Logo layout variant:
   * - "logo": Standard horizontal logo with ByteMark + "minibyte" wordmark (default).
   * - "signature": Monospace 8-column layout with 8 bits aligned directly under each letter.
   * - "mark": Standalone ByteMark for avatars, favicons, and tight spaces.
   */
  variant?: "logo" | "signature" | "mark";
  /**
   * Color tone:
   * - "ink": ink dots and text with Bit Blue accent (default).
   * - "paper": paper dots and text with Bit Blue accent.
   * - "mono": currentColor throughout for monochromatic contexts.
   */
  tone?: "ink" | "paper" | "mono";
  /**
   * Base font size (number in px or CSS string). Scales all internal em units accordingly. Default: "1rem".
   */
  size?: string | number;
  /**
   * Whether to wrap the logo in a Next.js Link pointing to `href`.
   */
  asLink?: boolean;
  /**
   * Target destination when `asLink` is true. Defaults to "/".
   */
  href?: string;
  /**
   * For variant="logo", adds clear-space padding (0.15em) equal to one large dot.
   */
  clearSpace?: boolean;
  className?: string;
}

/**
 * Minibyte Brand Logo.
 * 
 * Scaled strictly via font-size and relative `em` values without gradients or shadows.
 */
export function Logo({
  variant = "logo",
  tone = "ink",
  size = "1rem",
  asLink = false,
  href = "/",
  clearSpace = false,
  className,
  style,
  ...rest
}: LogoProps) {
  const textColor =
    tone === "mono"
      ? "currentColor"
      : tone === "paper"
      ? "var(--paper)"
      : "var(--ink)";
  const blueColor = "var(--bit-blue)";

  const fontSizeVal = typeof size === "number" ? `${size}px` : size;

  const rootStyle: React.CSSProperties = {
    fontSize: fontSizeVal,
    color: textColor,
    ...style,
  };

  const renderContent = () => {
    switch (variant) {
      case "mark": {
        return (
          <span
            className="inline-flex items-center justify-center"
            style={{ minWidth: 24 }}
          >
            <ByteMark
              tone={tone}
              style={{ width: "1em", height: "0.5em", minWidth: 24 }}
            />
          </span>
        );
      }

      case "signature": {
        // "m" = 109 = 01101101: 8 bits
        const mBits = toBits(109);
        const letters = "minibyte".split("");

        return (
          <span
            className="inline-grid select-none"
            style={{
              minWidth: 160,
              gridTemplateColumns: "repeat(8, 1ch)",
              rowGap: "0.35em",
              fontFamily: "var(--font-mono)",
              lineHeight: 1,
            }}
          >
            {/* Row 1: 8 Letters */}
            {letters.map((char, idx) => (
              <span
                key={`char-${idx}`}
                className="text-center font-normal lowercase tracking-normal"
                style={{ width: "1ch" }}
              >
                {char}
              </span>
            ))}

            {/* Row 2: 8 Bits under each letter */}
            {mBits.map((bit, idx) => {
              const isLarge = bit;
              const isBlue = tone !== "mono" && idx === 7;
              const dotSize = isLarge ? "0.2em" : "0.07em";
              const dotColor = isBlue ? blueColor : textColor;

              return (
                <span
                  key={`dot-${idx}`}
                  className="flex items-center justify-center"
                  style={{ width: "1ch", height: "0.25em" }}
                >
                  <span
                    className="rounded-full inline-block shrink-0"
                    style={{
                      width: dotSize,
                      height: dotSize,
                      backgroundColor: dotColor,
                    }}
                  />
                </span>
              );
            })}
          </span>
        );
      }

      case "logo":
      default: {
        return (
          <span
            className="inline-flex items-center"
            style={{
              minWidth: 120,
              gap: "0.44em",
              padding: clearSpace ? "0.15em" : undefined,
            }}
          >
            <ByteMark
              tone={tone}
              style={{
                width: "1.54em",
                height: "0.77em",
                minWidth: "1.54em",
              }}
            />
            <span
              className="font-mono font-normal lowercase tracking-normal select-none"
              style={{
                fontFamily: "var(--font-mono)",
                lineHeight: 1,
                fontSize: "1em",
              }}
            >
              minibyte
            </span>
          </span>
        );
      }
    }
  };

  const commonClasses = cn(
    "inline-flex items-center no-underline transition-opacity",
    asLink &&
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm",
    className
  );

  if (asLink) {
    return (
      <TransitionLink
        href={href}
        aria-label="minibyte home"
        className={commonClasses}
        style={rootStyle}
        {...rest}
      >
        {renderContent()}
      </TransitionLink>
    );
  }


  return (
    <span
      role="img"
      aria-label="minibyte"
      className={commonClasses}
      style={rootStyle}
      {...rest}
    >
      {renderContent()}
    </span>
  );
}

/**
 * Shorthand for Logo with variant="mark".
 */
export const LogoMark = (props: Omit<LogoProps, "variant">) => (
  <Logo variant="mark" {...props} />
);
