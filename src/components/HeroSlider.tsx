"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface HeroSlide {
  id: string | number;
  image: string;
  alt: string;
}

interface HeroCta {
  label: string;
  href: string;
}

interface HeroSliderProps {
  slides: HeroSlide[];
  eyebrow?: string;
  headline?: string;
  subheadline?: string;
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
}

const SLIDE_INTERVAL = 5000;

export default function HeroSlider({
  slides,
  eyebrow = "Dream Agent Car Vision",
  headline = "Find Your Next Car,\nthe Smart Way",
  subheadline = "Browse quality vehicles with transparent specs, photos, and pricing — all in one place.",
  primaryCta = { label: "Browse Inventory", href: "/cars" },
  secondaryCta = { label: "Contact Us", href: "/contact" },
}: HeroSliderProps) {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const count = slides.length;

  const goTo = useCallback(
    (index: number) => {
      if (count === 0) return;
      setActive(((index % count) + count) % count);
    },
    [count],
  );

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  useEffect(() => {
    if (count <= 1 || isPaused) return;
    const timer = setInterval(next, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [count, isPaused, next]);

  if (count === 0) return null;

  return (
    <section
      className="relative w-full overflow-hidden bg-dark"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Featured cars image slider"
    >
      <div className="relative h-[300px] w-full xs:h-[340px] sm:h-[440px] lg:h-[520px]">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-[1200ms] ease-in-out",
              index === active ? "opacity-100" : "pointer-events-none opacity-0",
            )}
            aria-hidden={index !== active}
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              priority={index === 0}
              className="object-cover object-center"
              sizes="100vw"
              unoptimized={slide.image.startsWith("http")}
            />
          </div>
        ))}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />

        <div className="absolute inset-0 z-10 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary-light sm:text-sm">
                {eyebrow}
              </p>
              <h1 className="mt-2 whitespace-pre-line text-2xl font-bold leading-tight text-white xs:mt-3 xs:text-3xl sm:text-4xl lg:text-5xl">
                {headline}
              </h1>
              <p className="mt-4 hidden max-w-md text-sm leading-relaxed text-slate-200 sm:block sm:text-base">
                {subheadline}
              </p>
              <div className="mt-4 flex flex-col gap-2.5 xs:mt-6 xs:flex-row xs:flex-wrap xs:items-center xs:gap-3">
                <Link
                  href={primaryCta.href}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 hover:bg-primary-dark xs:px-6 xs:py-3"
                >
                  {primaryCta.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={secondaryCta.href}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/15 xs:px-6 xs:py-3"
                >
                  {secondaryCta.label}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {count > 1 && (
          <div className="absolute inset-x-0 bottom-4 z-20 sm:bottom-6">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
              <div className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto pb-1 sm:gap-2">
                {slides.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => goTo(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    aria-current={index === active ? "true" : undefined}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-500",
                      index === active
                        ? "w-10 bg-primary"
                        : "w-4 bg-white/40 hover:bg-white/70",
                    )}
                  />
                ))}
              </div>

              <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous slide"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/30 sm:h-10 sm:w-10"
                >
                  <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next slide"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/30 sm:h-10 sm:w-10"
                >
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
