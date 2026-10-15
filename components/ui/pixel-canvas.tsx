"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

export interface PixelCanvasProps {
  /**
   * List of hex color strings to sample for pixels.
   * NOTE: Must be a stable reference (e.g. a module-level constant),
   * otherwise init() will re-run on every parent re-render.
   */
  colors: readonly string[] | string[];
  /**
   * Distance in px between pixel centers. Defaults to 5.
   */
  gap?: number;
  /**
   * Speed scalar between 1 and 100. Defaults to 30.
   */
  speed?: number;
  className?: string;
}

class Pixel {
  x: number;
  y: number;
  color: string;
  size: number = 0;
  maxSize: number;
  sizeStep: number;
  minSize: number = 0.5;
  speed: number;
  delay: number;
  counter: number = 0;
  counterStep: number;
  isIdle: boolean = true;
  private isShimmering: boolean = false;
  private shimmerDirection: number = 1;
  private ctx: CanvasRenderingContext2D;

  constructor(
    x: number,
    y: number,
    color: string,
    delay: number,
    baseSpeed: number,
    ctx: CanvasRenderingContext2D,
    reducedMotion: boolean
  ) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.delay = delay;
    this.ctx = ctx;

    this.maxSize = 0.5 + Math.random() * 1.5;
    this.sizeStep = Math.random() * 0.4;
    this.speed = (0.1 + Math.random() * 0.8) * baseSpeed;
    this.counterStep = reducedMotion ? 1000 : 2 + Math.random() * 2;
  }

  appear(): void {
    this.isIdle = false;

    if (this.counter <= this.delay) {
      this.counter += this.counterStep;
      return;
    }

    if (!this.isShimmering) {
      this.size += this.sizeStep;
      if (this.size >= this.maxSize) {
        this.size = this.maxSize;
        this.isShimmering = true;
      }
    } else {
      // Shimmer oscillation between minSize and maxSize
      if (this.size >= this.maxSize) {
        this.shimmerDirection = -1;
      } else if (this.size <= this.minSize) {
        this.shimmerDirection = 1;
      }
      this.size += this.shimmerDirection * this.speed;
    }

    this.draw();
  }

  disappear(): void {
    this.isShimmering = false;
    this.counter = 0;

    if (this.size > 0.1) {
      this.size -= 0.1;
      this.draw();
    } else {
      this.size = 0;
      this.isIdle = true;
    }
  }

  draw(): void {
    if (this.size <= 0) return;
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(
      this.x - this.size / 2,
      this.y - this.size / 2,
      this.size,
      this.size
    );
  }
}

/**
 * PixelCanvas renders an interactive canvas of shimmering pixels that ripple
 * outward from the center when the parent container is hovered or tapped.
 */
export function PixelCanvas({
  colors,
  gap = 5,
  speed = 30,
  className,
}: PixelCanvasProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const pixelsRef = useRef<Pixel[]>([]);
  const animationModeRef = useRef<"appear" | "disappear" | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const init = useCallback(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas || colors.length === 0) return;

    const rect = wrap.getBoundingClientRect();
    const width = Math.floor(rect.width);
    const height = Math.floor(rect.height);

    if (width === 0 || height === 0) return;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const centerX = width / 2;
    const centerY = height / 2;
    const baseSpeed = reducedMotion ? 0 : Math.min(speed, 100) * 0.001;

    const newPixels: Pixel[] = [];

    for (let x = 0; x < width; x += gap) {
      for (let y = 0; y < height; y += gap) {
        const dx = x - centerX;
        const dy = y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const delay = reducedMotion ? 0 : dist;
        const color = colors[Math.floor(Math.random() * colors.length)];

        newPixels.push(
          new Pixel(x, y, color, delay, baseSpeed, ctx, reducedMotion)
        );
      }
    }

    pixelsRef.current = newPixels;
  }, [colors, gap, speed]);

  const animateRef = useRef<() => void>(() => {});

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const mode = animationModeRef.current;
    if (!canvas || !mode) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const now = performance.now();
    // Cap at 60 fps (~16ms between frames)
    if (now - lastFrameTimeRef.current >= 16) {
      lastFrameTimeRef.current = now;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let allIdle = true;
      const pixels = pixelsRef.current;

      for (let i = 0; i < pixels.length; i++) {
        if (mode === "appear") {
          pixels[i].appear();
          allIdle = false;
        } else {
          pixels[i].disappear();
          if (!pixels[i].isIdle) {
            allIdle = false;
          }
        }
      }

      // Stop the loop when disappearing finishes and all pixels are idle
      if (mode === "disappear" && allIdle) {
        animationModeRef.current = null;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }
    }

    rafIdRef.current = requestAnimationFrame(() => animateRef.current());
  }, []);

  useEffect(() => {
    animateRef.current = animate;
  }, [animate]);

  const startAnimation = useCallback(
    (mode: "appear" | "disappear") => {
      animationModeRef.current = mode;
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      lastFrameTimeRef.current = 0;
      rafIdRef.current = requestAnimationFrame(animate);
    },
    [animate]
  );

  useEffect(() => {
    init();

    const wrap = wrapRef.current;
    if (!wrap) return;

    const parent = wrap.parentElement;
    if (!parent) return;

    // Attach hover to parent so canvas never intercepts pointer events
    const handleMouseEnter = () => startAnimation("appear");
    const handleMouseLeave = () => startAnimation("disappear");

    const handlePointerEnter = (e: PointerEvent) => {
      if (e.pointerType === "touch") {
        if (touchTimeoutRef.current) {
          clearTimeout(touchTimeoutRef.current);
        }
        startAnimation("appear");
        touchTimeoutRef.current = setTimeout(() => {
          startAnimation("disappear");
        }, 1200);
      }
    };

    parent.addEventListener("mouseenter", handleMouseEnter);
    parent.addEventListener("mouseleave", handleMouseLeave);
    parent.addEventListener("pointerenter", handlePointerEnter);

    // ResizeObserver to re-initialize grid when element dimensions change
    const resizeObserver = new ResizeObserver(() => {
      init();
    });
    resizeObserver.observe(wrap);

    return () => {
      parent.removeEventListener("mouseenter", handleMouseEnter);
      parent.removeEventListener("mouseleave", handleMouseLeave);
      parent.removeEventListener("pointerenter", handlePointerEnter);
      resizeObserver.disconnect();
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      if (touchTimeoutRef.current) {
        clearTimeout(touchTimeoutRef.current);
      }
    };
  }, [init, startAnimation]);

  return (
    <div
      ref={wrapRef}
      className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}

export default PixelCanvas;
