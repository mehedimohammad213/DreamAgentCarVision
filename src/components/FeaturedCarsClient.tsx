"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import CarCard from "@/components/CarCard";
import { fetchFeaturedCarsBrowser } from "@/lib/cars-browser";
import type { Car } from "@/lib/types";

type FeaturedCopy = {
  title?: string;
  subtitle?: string;
  cta_label?: string;
  cta_href?: string;
};

const fallbackFeatured: Required<FeaturedCopy> = {
  title: "Featured Inventory",
  subtitle: "Browse our latest available vehicles",
  cta_label: "View all",
  cta_href: "/cars",
};

type FeaturedCarsClientProps = {
  initialCars: Car[];
  featured?: FeaturedCopy;
};

export default function FeaturedCarsClient({
  initialCars,
  featured,
}: FeaturedCarsClientProps) {
  const [cars, setCars] = useState(initialCars);
  const copy = { ...fallbackFeatured, ...featured };

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const data = await fetchFeaturedCarsBrowser(6);
      if (!cancelled && data.length > 0) setCars(data);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="bg-section-blue section-padding">
      <div className="page-container">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              {copy.title}
            </h2>
            <p className="mt-2 text-muted">{copy.subtitle}</p>
          </div>
          <Link
            href={copy.cta_href}
            className="hidden items-center gap-1.5 text-sm font-semibold text-primary-dark transition-colors hover:text-primary sm:inline-flex"
          >
            {copy.cta_label}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {cars.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} href="/cars" />
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
            href={copy.cta_href}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-dark"
          >
            {copy.cta_label}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
