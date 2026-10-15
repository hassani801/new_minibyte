export const PRELOADER_EVENT = "preloader:done";

declare global {
  interface Window {
    __mbPreloaderDone?: boolean;
    __mbLenis?: import("lenis").default | null;
  }
}

/**
 * Checks whether the preloader has finished.
 * Verifies the window flag and html data-preloader attribute.
 */
export function isPreloaderDone(): boolean {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return false;
  }
  return (
    window.__mbPreloaderDone === true ||
    document.documentElement.dataset.preloader === "done"
  );
}

/**
 * Executes callback when the preloader finishes.
 * If already finished, invokes callback immediately.
 * Otherwise, subscribes to the 'preloader:done' event once.
 *
 * @returns Cleanup function to unsubscribe listener.
 */
export function onPreloaderDone(cb: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  if (isPreloaderDone()) {
    cb();
    return () => {};
  }

  const handler = () => {
    cb();
  };

  window.addEventListener(PRELOADER_EVENT, handler, { once: true });
  return () => {
    window.removeEventListener(PRELOADER_EVENT, handler);
  };
}
