"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import CarCard from "@/components/CarCard";
import { fetchFeaturedCarsBrowser } from "@/lib/cars-browser";
import { fetchCmsPageBrowser } from "@/lib/cms-browser";
import { featuredFromPage, type CmsPage } from "@/lib/cms";
import type { Car } from "@/lib/types";

type FeaturedCopy = {
  title?: string;
  subtitle?: string;
  cta_label?: string;
  cta_href?: string;
};

type FeaturedCarsClientProps = {
  initialCars: Car[];
  initialPage?: CmsPage | null;
  featured?: FeaturedCopy;
};

export default function FeaturedCarsClient({
  initialCars,
  initialPage = null,
  featured,
}: FeaturedCarsClientProps) {
  const [cars, setCars] = useState(initialCars);
  const [page, setPage] = useState<CmsPage | null>(initialPage);
  const fromPage = featuredFromPage(page);
  const copy = {
    title: fromPage.title ?? featured?.title,
    subtitle: fromPage.subtitle ?? featured?.subtitle,
    cta_label: fromPage.cta_label ?? featured?.cta_label,
    cta_href: fromPage.cta_href ?? featured?.cta_href,
  };

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const [data, cmsPage] = await Promise.all([
        fetchFeaturedCarsBrowser(6),
        fetchCmsPageBrowser<CmsPage>("home"),
      ]);
      if (cancelled) return;
      if (data.length > 0) setCars(data);
      if (cmsPage) setPage(cmsPage);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const title = copy.title ?? "Featured Inventory";
  const subtitle = copy.subtitle;
  const ctaHref = copy.cta_href ?? "/cars";
  const ctaLabel = copy.cta_label ?? "View all";

  return (
    <section className="bg-section-blue section-padding">
      <div className="page-container">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              {title}
            </h2>
            {subtitle ? <p className="mt-2 text-muted">{subtitle}</p> : null}
          </div>
          <Link
            href={ctaHref}
            className="hidden items-center gap-1.5 text-sm font-semibold text-primary-dark transition-colors hover:text-primary sm:inline-flex"
          >
            {ctaLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {cars.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-border bg-white p-12 text-center">
            <p className="text-muted">
              No vehicles available right now. Check back soon or contact us.
            </p>
            <Link
              href="/contact"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
            >
              Contact us
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        <div className="mt-8 sm:hidden">
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-dark"
          >
            {ctaLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
