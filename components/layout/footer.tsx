import React from "react";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Dot } from "@/components/brand/dot";
import { UnderlineLink } from "@/components/ui/underline-link";
import { BackToTop } from "@/components/layout/back-to-top";
import { FooterSignature } from "@/components/layout/footer-signature";
import { FooterYear } from "@/components/layout/footer-year";
import { CONTACT, FOOTER, SOCIALS, LEGAL } from "@/lib/constants";

/**
 * Global Site Footer
 *
 * Server Component composing:
 * - Top zone: Brand logo, tagline, descriptor, and 4-column structured link grid.
 * - Back to top row: Brand byte equation + Lenis smooth scroll trigger.
 * - Bottom bar: Dynamic copyright year + legal page links.
 * - Footer signature: 20cqw grand monospace brand mark with decode animation.
 */
export function Footer() {
  const visibleSocials = SOCIALS.filter((item) => Boolean(item.href));
  const visibleLegal = LEGAL.filter((item) => item.enabled);

  return (
    <footer
      id="site-footer"
      data-nav-theme="ink"
      className="theme-ink bg-background text-foreground relative overflow-hidden"
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-8 pt-20 md:pt-28 pb-[max(24px,env(safe-area-inset-bottom))]">
        {/* TOP ZONE: Left Brand Column & Right Nav Columns */}
        <div className="grid gap-12 lg:grid-cols-[5fr_7fr] items-start">
          {/* LEFT: Logo, Tagline, Descriptor */}
          <div className="flex flex-col items-start max-w-sm">
            <Logo variant="logo" tone="paper" asLink href="/" size="1.5rem" />

            <p className="text-xl md:text-2xl font-medium tracking-[-0.02em] leading-snug mt-7 max-w-[18ch] text-foreground">
              {FOOTER.tagline}
              <Dot color="current" aria-hidden="true" />
            </p>

            <span className="label-mono text-muted-foreground mt-4 select-none">
              {FOOTER.descriptor}
            </span>
          </div>

          {/* RIGHT: Responsive Column Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-10 w-full">
            {/* Pages & Work with us Link Columns wrapped in semantic <nav> */}
            <nav aria-label="Footer" className="contents">
              {FOOTER.columns.map((column) => (
                <div key={column.title} className="flex flex-col items-start">
                  <h2 className="label-mono text-muted-foreground m-0 select-none">
                    {column.title}
                  </h2>

                  <ul
                    role="list"
                    className="mt-5 space-y-3 list-none p-0 m-0 w-full"
                  >
                    {column.links.map((link) => (
                      <li key={link.name}>
                        <UnderlineLink
                          href={link.href}
                          className="px-0 h-auto text-sm md:text-base text-foreground inline-flex items-center"
                          underlineClassName="bottom-0 inset-x-0"
                        >
                          {link.name}
                        </UnderlineLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>

            {/* Contact Column */}
            <div className="flex flex-col items-start">
              <h2 className="label-mono text-muted-foreground m-0 select-none">
                Contact
              </h2>

              <div className="mt-5 space-y-3 flex flex-col items-start">
                {CONTACT.email && (
                  <UnderlineLink
                    href={`mailto:${CONTACT.email}`}
                    className="px-0 h-auto font-mono text-sm data-mono text-foreground inline-flex items-center"
                    underlineClassName="bottom-0 inset-x-0"
                  >
                    {CONTACT.email}
                  </UnderlineLink>
                )}

                {CONTACT.phone && (
                  <UnderlineLink
                    href={`tel:${CONTACT.phone}`}
                    className="px-0 h-auto font-mono text-sm data-mono text-foreground inline-flex items-center"
                    underlineClassName="bottom-0 inset-x-0"
                  >
                    {CONTACT.phone}
                  </UnderlineLink>
                )}

                {FOOTER.address.length > 0 && (
                  <div className="text-sm text-muted-foreground space-y-0.5 pt-1">
                    {FOOTER.address.map((line, idx) => (
                      <div key={idx}>{line}</div>
                    ))}
                  </div>
                )}

                {!FOOTER.address.length && CONTACT.location && (
                  <div className="text-sm text-muted-foreground pt-1">
                    {CONTACT.location}
                  </div>
                )}
              </div>
            </div>

            {/* Follow Column (only rendered if at least one social link is active) */}
            {visibleSocials.length > 0 && (
              <div className="flex flex-col items-start">
                <h2 className="label-mono text-muted-foreground m-0 select-none">
                  Follow
                </h2>

                <ul
                  role="list"
                  className="mt-5 space-y-3 list-none p-0 m-0 w-full"
                >
                  {visibleSocials.map((social) => (
                    <li key={social.name}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1.5 text-sm md:text-base text-foreground hover:text-muted-foreground transition-colors duration-200"
                      >
                        <span>{social.name}</span>
                        <ArrowUpRight
                          className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity"
                          aria-hidden="true"
                        />
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* BACK TO TOP ROW */}
        <div className="mt-14 pt-6 border-t border-border flex items-center justify-between gap-4">
          <span className="hidden sm:block label-mono text-muted-foreground select-none tabular-nums">
            01101101 = m
          </span>

          <div className="ml-auto">
            <BackToTop />
          </div>
        </div>

        {/* BOTTOM BAR: Copyright & Legal */}
        <div className="py-6 border-t border-border flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 text-xs label-mono text-muted-foreground">
          <p className="m-0">
            © <FooterYear /> {FOOTER.legalName}. All rights reserved.
          </p>

          {visibleLegal.length > 0 && (
            <div className="flex items-center gap-3">
              {visibleLegal.map((item, idx) => (
                <React.Fragment key={item.name}>
                  {idx > 0 && (
                    <span
                      className="w-px h-3 bg-border inline-block"
                      aria-hidden="true"
                    />
                  )}
                  <UnderlineLink
                    href={item.href}
                    className="px-0 h-auto text-xs label-mono text-muted-foreground hover:text-foreground"
                    underlineClassName="bottom-0 inset-x-0"
                  >
                    {item.name}
                  </UnderlineLink>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        {/* GRAND SIGNATURE LOGO */}
        <FooterSignature />
      </div>
    </footer>
  );
}

export default Footer;
