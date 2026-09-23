"use client";

import Image from "next/image";
import Link from "next/link";
import { Headphones, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useCmsPage } from "@/hooks/useCmsPage";
import {
  CMS_FOOTER_PAGE_SLUG,
  cmsPageFetchKey,
  footerFromPage,
  type CmsPage,
  type CmsSiteSettings,
} from "@/lib/cms";

const fallbackQuickLinks = [
  { href: "/", label: "Home" },
  { href: "/cars", label: "Car Inventory" },
  { href: "/about", label: "About Us" },
  { href: "/career", label: "Career" },
  { href: "/contact", label: "Contact" },
];

const fallbackHelpLinks = [
  { href: "/contact", label: "Contact Us" },
  { href: "/about", label: "About Us" },
];

function FooterLink({
  href,
  label,
  external,
}: {
  href: string;
  label: string;
  external?: boolean;
}) {
  const className =
    "text-sm text-slate-400 transition-colors hover:text-white";

  if (external) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

type FooterProps = {
  settings?: CmsSiteSettings;
  initialPage?: CmsPage | null;
};

export default function Footer({
  settings: settingsProp,
  initialPage = null,
}: FooterProps) {
  const settings = settingsProp ?? (siteConfig as CmsSiteSettings);
  const footerSlug = initialPage
    ? cmsPageFetchKey(initialPage)
    : CMS_FOOTER_PAGE_SLUG;
  const page = useCmsPage(footerSlug, initialPage);
  const cms = footerFromPage(page);

  const phone = cms.phone || settings.contact.phone;
  const phoneHref = `tel:${phone.replace(/\s/g, "")}`;
  const email = cms.email || settings.contact.email;
  const emailHref = `mailto:${email}`;

  const resolvedQuick =
    cms.quickLinks.length > 0 ? cms.quickLinks : fallbackQuickLinks;
  const resolvedHelp =
    cms.helpLinks.length > 0 ? cms.helpLinks : fallbackHelpLinks;
  const resolvedPlatform =
    cms.platformLinks.length > 0
      ? cms.platformLinks
      : [
          {
            href: `${settings.appUrl}/login`,
            label: "Dealer Login",
            external: true,
          },
        ];

  const officeTitle = cms.officeTitle || settings.offices.corporate.name;
  const officeAddress =
    cms.officeAddress || settings.offices.corporate.address;
  const quickTitle = cms.quickTitle || "Quick Links";
  const helpTitle = cms.helpTitle || "Can We Help?";
  const platformTitle = cms.platformTitle || "Platform";
  const contactTitle = cms.contactTitle || "Get In Touch";
  const contactText =
    cms.contactText ||
    `${settings.name} — car sales In Dhaka. Get in touch.`;
  const trustBadge = cms.trustBadge || "Trusted Dealership Platform";
  const logoSrc = cms.logoSrc || settings.logoOnDark || settings.logo;

  const year = new Date().getFullYear();
  const copyright =
    cms.copyright || `© ${year} ${settings.name.toUpperCase()}.`;

  return (
    <footer className="mt-auto bg-[#0f172a] pb-20 text-slate-300 lg:pb-0">
      <div className="page-container py-12 sm:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Brand & address */}
          <div>
            <Link href="/" className="inline-block">
              <Image
                src={logoSrc}
                alt={settings.name}
                width={2500}
                height={540}
                className="h-11 w-auto sm:h-12"
              />
            </Link>
            <div className="mt-8">
              <h3 className="text-sm font-bold text-white">{officeTitle}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {officeAddress}
              </p>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-bold text-white">{quickTitle}</h3>
            <ul className="mt-4 space-y-2.5">
              {resolvedQuick.map((link) => (
                <li key={`${link.href}-${link.label}`}>
                  <FooterLink {...link} />
                </li>
              ))}
            </ul>
          </div>

          {/* Help + platform */}
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-bold text-white">{helpTitle}</h3>
              <ul className="mt-4 space-y-2.5">
                {resolvedHelp.map((link) => (
                  <li key={`${link.href}-${link.label}`}>
                    <FooterLink {...link} />
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{platformTitle}</h3>
              <ul className="mt-4 space-y-2.5">
                {resolvedPlatform.map((link) => (
                  <li key={`${link.href}-${link.label}`}>
                    <FooterLink {...link} />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold text-white">{contactTitle}</h3>
            <a
              href={phoneHref}
              className="mt-5 inline-flex items-center gap-2.5 text-xl font-bold text-white transition-colors hover:text-primary sm:text-2xl"
            >
              <Headphones className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" />
              {phone}
            </a>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              {contactText}
            </p>
            <a
              href={emailHref}
              className="mt-3 inline-block text-sm text-slate-400 transition-colors hover:text-white"
            >
              {email}
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-700/60">
        <div className="page-container flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500 sm:text-sm">{copyright}</p>
          <p className="flex items-center gap-2 text-xs text-slate-500 sm:text-sm">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            {trustBadge}
          </p>
        </div>
      </div>
    </footer>
  );
}
