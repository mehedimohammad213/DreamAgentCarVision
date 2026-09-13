"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Headphones, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/config/site";
import { fetchCmsBrowser } from "@/lib/cms-browser";
import {
  menuItemsFromCms,
  pickCmsFooter,
  type CmsFooter,
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

function isEnabled(value: number | boolean | undefined) {
  return value === undefined || value === true || value === 1;
}

type FooterProps = {
  settings?: CmsSiteSettings;
  initialFooter?: CmsFooter | null;
};

export default function Footer({
  settings: settingsProp,
  initialFooter = null,
}: FooterProps) {
  const settings = settingsProp ?? (siteConfig as CmsSiteSettings);
  const [cmsFooter, setCmsFooter] = useState<CmsFooter | null>(initialFooter);

  useEffect(() => {
    let cancelled = false;

    async function loadFooters() {
      const data = await fetchCmsBrowser<CmsFooter[] | CmsFooter>(
        "/public/footers",
      );
      if (cancelled || !data) return;
      const footer = pickCmsFooter(data);
      if (footer) setCmsFooter(footer);
    }

    void loadFooters();
    return () => {
      cancelled = true;
    };
  }, []);

  const phone = settings.contact.phone;
  const phoneHref = `tel:${phone.replace(/\s/g, "")}`;
  const email = settings.contact.email;
  const emailHref = `mailto:${email}`;

  const quickLinks = menuItemsFromCms(cmsFooter?.column2_menu);
  const helpLinks = menuItemsFromCms(cmsFooter?.column3_menu);
  const platformLinks = menuItemsFromCms(cmsFooter?.column4_menu);

  const resolvedQuick =
    isEnabled(cmsFooter?.column2_status) && quickLinks.length > 0
      ? quickLinks
      : fallbackQuickLinks;
  const resolvedHelp =
    isEnabled(cmsFooter?.column3_status) && helpLinks.length > 0
      ? helpLinks
      : fallbackHelpLinks;
  const resolvedPlatform =
    isEnabled(cmsFooter?.column4_status) && platformLinks.length > 0
      ? platformLinks
      : [
          {
            href: `${settings.appUrl}/login`,
            label: "Dealer Login",
            external: true,
          },
        ];

  const officeTitle =
    (isEnabled(cmsFooter?.address1_status) && cmsFooter?.address1_title_en) ||
    settings.offices.corporate.name;
  const officeAddress =
    (isEnabled(cmsFooter?.address1_status) &&
      cmsFooter?.address1_description_en) ||
    settings.offices.corporate.address;

  const contactTitle = cmsFooter?.column4_title_en || "Get In Touch";
  const contactText =
    cmsFooter?.column4_text_en ||
    `${settings.name} — car sales In Dhaka. Get in touch.`;
  const trustBadge =
    cmsFooter?.column4_description_en || "Trusted Dealership Platform";

  const logoSrc =
    cmsFooter?.logo?.file_path || settings.logoOnDark || settings.logo;

  const copyrightName = settings.name.toUpperCase();
  const year = new Date().getFullYear();

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
            <h3 className="text-sm font-bold text-white">Quick Links</h3>
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
              <h3 className="text-sm font-bold text-white">Can We Help?</h3>
              <ul className="mt-4 space-y-2.5">
                {resolvedHelp.map((link) => (
                  <li key={`${link.href}-${link.label}`}>
                    <FooterLink {...link} />
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Platform</h3>
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
          <p className="text-xs text-slate-500 sm:text-sm">
            © {year} {copyrightName}.
          </p>
          <p className="flex items-center gap-2 text-xs text-slate-500 sm:text-sm">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            {trustBadge}
          </p>
        </div>
      </div>
    </footer>
  );
}
