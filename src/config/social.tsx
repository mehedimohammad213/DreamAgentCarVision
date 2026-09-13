import { siteConfig } from "@/config/site";
import { menuItemsFromCms, type CmsMenu } from "@/lib/cms";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 11 20"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M7.2 20V10.9h2.7l.4-3.3H7.2V5.5c0-1 .2-1.6 1.6-1.6h1.7V.9C10.1.8 9.1.7 8 .7 5.5.7 3.9 2.2 3.9 4.9v2.3H1.4v3.3h2.5V20h3.3z" />
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <rect
        x="3"
        y="6"
        width="18"
        height="12"
        rx="2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M10 9.5v5l5-2.5-5-2.5z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M4.5 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM1 7h3v12H1V7zm5 0h2.9v1.6h.04c.4-.8 1.4-1.6 2.9-1.6 3.1 0 3.7 2 3.7 4.7V19h-3v-5.5c0-1.3-.02-3-1.8-3-1.8 0-2.1 1.4-2.1 2.8V19H6V7z" />
    </svg>
  );
}

export function getSocialLinks(
  social: { facebook: string; youtube: string; linkedin: string } = siteConfig.social,
) {
  return [
    { icon: FacebookIcon, label: "Facebook", href: social.facebook },
    { icon: YouTubeIcon, label: "YouTube", href: social.youtube },
    { icon: LinkedInIcon, label: "LinkedIn", href: social.linkedin },
  ];
}

function iconForLabel(label: string) {
  const key = label.toLowerCase();

  if (key.includes("facebook")) return FacebookIcon;
  if (key.includes("youtube")) return YouTubeIcon;
  if (key.includes("linkedin")) return LinkedInIcon;

  return FacebookIcon;
}

export function getSocialLinksFromMenu(menu?: CmsMenu | null) {
  return menuItemsFromCms(menu).map(({ label, href }) => ({
    icon: iconForLabel(label),
    label,
    href,
  }));
}

/** @deprecated Prefer getSocialLinks(settings.social) for CMS-backed URLs */
export const socialLinks = getSocialLinks();
