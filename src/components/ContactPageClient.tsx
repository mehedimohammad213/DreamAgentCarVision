"use client";

import Image from "next/image";
import ContactForm from "@/components/ContactForm";
import { useCmsPage } from "@/hooks/useCmsPage";
import {
  contactFromPage,
  formBuilderFromPage,
  type CmsFormBuilder,
  type CmsPage,
  type CmsSiteSettings,
} from "@/lib/cms";

function SidebarSection({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`section-padding ${className}`}>
      <div className="page-container">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {title}
            </h2>
          </div>
          <div className="lg:col-span-8">{children}</div>
        </div>
      </div>
    </section>
  );
}

type ContactPageClientProps = {
  initialPage: CmsPage | null;
  settings: CmsSiteSettings;
};

export default function ContactPageClient({
  initialPage,
  settings,
}: ContactPageClientProps) {
  const page = useCmsPage("contact", initialPage);

  const content = contactFromPage(page);
  const office = {
    ...settings.offices.corporate,
    ...content.office,
  };
  const businessHours =
    content.businessHours ?? settings.contact.businessHours;

  const contactForm: CmsFormBuilder | null = formBuilderFromPage(page);

  const heroTitle = content.hero?.title ?? "Contact Us";
  const heroImage =
    content.hero?.image ??
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&q=80";

  return (
    <>
      <section className="relative flex min-h-[220px] items-center overflow-hidden sm:min-h-[300px] lg:min-h-[360px]">
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          className="object-cover blur-sm scale-105"
          sizes="100vw"
          aria-hidden
          unoptimized={heroImage.startsWith("http")}
        />
        <div className="absolute inset-0 bg-dark/70" />
        <div className="page-container relative">
          <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl xl:text-6xl">
            {heroTitle}
          </h1>
          {content.hero?.subtitle ? (
            <p className="mt-3 max-w-2xl text-sm text-slate-200 sm:text-base">
              {content.hero.subtitle}
            </p>
          ) : null}
        </div>
      </section>

      <SidebarSection
        title={content.help_title ?? "What can we help you with?"}
        className="bg-white"
      >
        {content.help_description ? (
          <p className="mb-6 text-sm text-muted sm:text-base">
            {content.help_description}
          </p>
        ) : null}
        <ContactForm form={contactForm} />
      </SidebarSection>

      <SidebarSection
        title={content.office_title ?? "Office Locations"}
        className="bg-section-blue"
      >
        <div>
          <h3 className="font-semibold">{office.name}</h3>
          <address className="mt-4 space-y-1 not-italic text-sm leading-relaxed text-muted">
            <p>{office.address}</p>
            {office.phone ? (
              <p>
                <a
                  href={`tel:${office.phone.replace(/\s/g, "")}`}
                  className="transition-colors hover:text-primary"
                >
                  {office.phone}
                </a>
              </p>
            ) : null}
            {office.email ? (
              <p>
                <a
                  href={`mailto:${office.email}`}
                  className="transition-colors hover:text-primary"
                >
                  {office.email}
                </a>
              </p>
            ) : null}
          </address>
        </div>
      </SidebarSection>

      <SidebarSection
        title={content.hours_title ?? "Business Hours"}
        className="bg-white"
      >
        <ul className="divide-y divide-border rounded-xl border border-border bg-white">
          {businessHours.map(({ day, hours }) => (
            <li
              key={day}
              className="flex items-center justify-between gap-4 px-4 py-3 text-sm sm:px-5"
            >
              <span className="font-medium">{day}</span>
              <span
                className={
                  hours === "Closed"
                    ? "text-muted"
                    : "font-medium text-primary-dark"
                }
              >
                {hours}
              </span>
            </li>
          ))}
        </ul>
      </SidebarSection>
    </>
  );
}
