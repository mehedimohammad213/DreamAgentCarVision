"use client";

import { getSocialLinksFromMenu } from "@/config/social";
import { useCmsPage } from "@/hooks/useCmsPage";
import {
  followUsLabelFromPage,
  followUsMenuFromPage,
  type CmsPage,
} from "@/lib/cms";

export default function FollowUsSidebar({
  initialPage = null,
}: {
  initialPage?: CmsPage | null;
}) {
  const page = useCmsPage("home", initialPage);
  const socialLinks = getSocialLinksFromMenu(followUsMenuFromPage(page));
  const sidebarLabel = followUsLabelFromPage(page) ?? "Follow Us";

  if (socialLinks.length === 0) return null;

  return (
    <>
      <aside
        aria-label="Follow us on social media"
        className="fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 lg:flex"
      >
        <div className="flex flex-col items-center gap-5 rounded-l-2xl bg-primary-light px-3.5 py-7 shadow-lg">
          <span
            className="text-sm font-bold uppercase tracking-widest text-black"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            {sidebarLabel}
          </span>

          <div className="h-12 w-px bg-black" aria-hidden />

          <div className="flex flex-col items-center gap-5">
            {socialLinks.map(({ icon: Icon, label, href }) => (
              <a
                key={`${label}-${href}`}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-black transition-opacity hover:opacity-70"
              >
                <Icon className="h-[18px] w-[18px]" />
              </a>
            ))}
          </div>
        </div>
      </aside>

      <div
        aria-label="Follow us on social media"
        className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-4 rounded-full border border-border bg-white/95 px-5 py-2.5 shadow-lg backdrop-blur-sm lg:hidden"
      >
        <span className="text-xs font-bold uppercase tracking-wide text-foreground">
          {sidebarLabel}
        </span>
        <div className="flex items-center gap-3">
          {socialLinks.map(({ icon: Icon, label, href }) => (
            <a
              key={`${label}-${href}`}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light text-foreground transition-colors hover:bg-primary hover:text-white"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
