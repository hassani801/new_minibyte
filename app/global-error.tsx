"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[minibyte global error]", error.message);
  }, [error]);

  return (
    <html lang="en">
      <head>
        <meta name="robots" content="noindex,nofollow" />
        <title>Error · minibyte</title>
      </head>
      <body className="bg-[#F3F4F1] text-[#0C0E12] font-sans antialiased min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full border border-black/10 p-8 bg-white/50 space-y-4">
          <div className="font-mono text-xs uppercase tracking-wider text-black/60">
            500 · System error
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Something went wrong
          </h1>
          <p className="text-sm text-black/70 leading-relaxed">
            A critical system error occurred. You can reload the application to recover.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium tracking-tight bg-[#0C0E12] text-[#F3F4F1] hover:opacity-90 transition-opacity rounded-sm focus-visible:outline-2 focus-visible:outline-[#4654FF]"
            >
              Reload application
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
