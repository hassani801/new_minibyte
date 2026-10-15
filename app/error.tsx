"use client";

import { useEffect } from "react";
import { PageHero } from "@/components/sections/page-hero";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log non-sensitive error details
    console.error("[minibyte error boundary]", error.message);
  }, [error]);

  return (
    <>
      <head>
        <meta name="robots" content="noindex,nofollow" />
        <title>Error · minibyte</title>
      </head>
      <PageHero
        id="app-error"
        theme="paper"
        dotColor="current"
        eyebrow="500"
        title="Something went wrong"
        lead="An unexpected error occurred while loading this view."
        actions={
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium tracking-tight bg-foreground text-background hover:opacity-90 transition-opacity rounded-sm focus-visible:outline-2 focus-visible:outline-bitBlue"
          >
            Try again
          </button>
        }
      />
    </>
  );
}
