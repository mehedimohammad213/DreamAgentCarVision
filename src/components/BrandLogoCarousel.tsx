"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type BrandLogoItem = {
  name: string;
  logo?: string | null;
};

type BrandLogoCarouselProps = {
  brands: BrandLogoItem[];
  className?: string;
};

function BrandCard({ brand }: { brand: BrandLogoItem }) {
  return (
    <Link
      href={`/cars?make=${encodeURIComponent(brand.name)}`}
      data-brand-card
      className="flex h-20 w-[140px] shrink-0 items-center justify-center rounded-lg border border-border bg-white px-4 transition-transform hover:-translate-y-0.5 sm:h-24 sm:w-[168px] sm:rounded-xl"
      aria-label={`Browse ${brand.name} cars`}
    >
      {brand.logo ? (
        <Image
          src={brand.logo}
          alt={brand.name}
          width={120}
          height={48}
          className="h-10 w-auto max-w-full object-contain sm:h-12"
        />
      ) : (
        <span className="text-center text-sm font-bold uppercase tracking-wide text-dark sm:text-base">
          {brand.name}
        </span>
      )}
    </Link>
  );
}

export default function BrandLogoCarousel({
  brands,
  className,
}: BrandLogoCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || brands.length === 0) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) return;

    let raf = 0;
    const speed = 0.6;

    const tick = () => {
      if (!pausedRef.current) {
        el.scrollLeft += speed;
        // Content is duplicated — loop halfway
        const half = el.scrollWidth / 2;
        if (half > 0 && el.scrollLeft >= half) {
          el.scrollLeft -= half;
        }
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, [brands]);

  function pauseTemporarily(ms = 2500) {
    pausedRef.current = true;
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, ms);
  }

  function scrollByCards(direction: -1 | 1) {
    const el = scrollerRef.current;
    if (!el) return;
    pauseTemporarily();
    const card = el.querySelector<HTMLElement>("[data-brand-card]");
    const step = card ? card.offsetWidth + 16 : 200;
    el.scrollBy({ left: direction * step * 2, behavior: "smooth" });
  }

  if (brands.length === 0) return null;

  // Duplicate for seamless infinite scroll
  const loopBrands = [...brands, ...brands];

  return (
    <section className={cn("border-t border-border bg-brand-dark", className)}>
      <div className="page-container py-8 sm:py-10 lg:py-12">
        <div className="relative flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick={() => scrollByCards(-1)}
            aria-label="Previous brands"
            className="hidden h-10 w-10 shrink-0 items-center justify-center text-white transition-colors hover:text-primary sm:flex"
          >
            <ChevronLeft className="h-7 w-7" strokeWidth={1.75} />
          </button>

          <div
            ref={scrollerRef}
            onMouseEnter={() => {
              pausedRef.current = true;
            }}
            onMouseLeave={() => {
              pausedRef.current = false;
            }}
            onTouchStart={() => pauseTemporarily(4000)}
            className="flex min-w-0 flex-1 gap-3 overflow-x-auto px-1 py-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-4 [&::-webkit-scrollbar]:hidden"
          >
            {loopBrands.map((brand, index) => (
              <BrandCard
                key={`${brand.name}-${index}`}
                brand={brand}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollByCards(1)}
            aria-label="Next brands"
            className="hidden h-10 w-10 shrink-0 items-center justify-center text-white transition-colors hover:text-primary sm:flex"
          >
            <ChevronRight className="h-7 w-7" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </section>
  );
}
