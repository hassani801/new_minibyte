"use client";

import React, { useState, useEffect } from "react";

/**
 * FooterYear safely renders the current year.
 * Evaluates new Date() inside useEffect to comply with Next.js 16 prerendering and cache rules.
 */
export function FooterYear() {
  const [year, setYear] = useState<number>(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return <span>{year}</span>;
}

export default FooterYear;
