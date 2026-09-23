"use client";

import Image from "next/image";
import Link from "next/link";
import { useCmsPage } from "@/hooks/useCmsPage";
import { aboutFromPage, type CmsPage } from "@/lib/cms";

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

function FullWidthSection({
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
        <h2 className="mb-8 text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}

export default function AboutPageClient({
  initialPage,
}: {
  initialPage: CmsPage | null;
}) {
  const page = useCmsPage("about", initialPage);
  const content = aboutFromPage(page);

  const heroTitle = content.hero?.title ?? page?.page_name_en ?? "About Us";
  const heroSubtitle = content.hero?.subtitle;
  const heroImage = content.hero?.image;
  const whyBuy = content.whyBuy;
  const whyBuyItems = whyBuy?.items ?? [];
  const brands = content.brands;
  const cta = content.cta;

  return (
    <>
      <section className="relative flex min-h-[220px] items-center overflow-hidden sm:min-h-[300px] lg:min-h-[360px]">
        {heroImage ? (
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
        ) : (
          <div className="absolute inset-0 bg-dark" />
        )}
        <div className="absolute inset-0 bg-dark/70" />
        <div className="page-container relative">
          <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl xl:text-6xl">
            {heroTitle}
          </h1>
          {heroSubtitle ? (
            <p className="mt-3 max-w-2xl text-sm text-slate-200 sm:text-base">
              {heroSubtitle}
            </p>
          ) : null}
        </div>
      </section>

      {whyBuy?.title || whyBuyItems.length > 0 ? (
        <FullWidthSection
          title={whyBuy?.title ?? "Why Buy"}
          className="bg-section-warm"
        >
          {whyBuy?.intro ? (
            <p className="mb-8 text-sm leading-relaxed text-muted">
              {whyBuy.intro}
            </p>
          ) : null}
          {whyBuyItems.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {whyBuyItems.map((item, i) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-border bg-white p-6 transition-shadow hover:shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white text-sm font-bold">
                      {i + 1}
                    </span>
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                  </div>
                  {item.description ? (
                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      {item.description}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </FullWidthSection>
      ) : null}

      {brands?.title || brands?.paragraphs?.length ? (
        <SidebarSection
          title={brands?.title ?? "Brands"}
          className="bg-section-grey"
        >
          {brands?.paragraphs?.length ? (
            <div className="space-y-4 text-sm leading-relaxed text-muted">
              {brands.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </div>
          ) : null}

          {brands?.list?.length ? (
            <div className="mt-8 rounded-2xl bg-white p-6">
              {brands.list_label ? (
                <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted">
                  {brands.list_label}
                </p>
              ) : null}
              <div className="flex flex-wrap gap-3">
                {brands.list.map((brand) => (
                  <span
                    key={brand}
                    className="rounded-full border border-border bg-section-grey px-4 py-2 text-xs font-medium text-foreground"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </SidebarSection>
      ) : null}

      {cta?.title || cta?.description ? (
        <section className="bg-dark section-padding">
          <div className="page-container text-center">
            {cta.title ? (
              <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                {cta.title}
              </h2>
            ) : null}
            {cta.description ? (
              <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-300 sm:text-base">
                {cta.description}
              </p>
            ) : null}
            {cta.button_href && cta.button_label ? (
              <Link
                href={cta.button_href}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                {cta.button_label}
              </Link>
            ) : null}
          </div>
        </section>
      ) : null}
    </>
  );
}
