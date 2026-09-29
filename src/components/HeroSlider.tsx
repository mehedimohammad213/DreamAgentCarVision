"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CarSearchFilter from "@/components/CarSearchFilter";
import type { FilterOptions } from "@/lib/api";
import { cn } from "@/lib/utils";

export interface HeroSlide {
  id: string | number;
  image: string;
  alt: string;
}

interface HeroSliderProps {
  slides: HeroSlide[];
  filterOptions: FilterOptions;
}

const SLIDE_INTERVAL = 4000;

export default function HeroSlider({
  slides,
  filterOptions,
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

  const next = useCallback(() => {
    setActive((prev) => (count <= 1 ? prev : (prev + 1) % count));
  }, [count]);

  const prev = useCallback(() => {
    setActive((prev) => (count <= 1 ? prev : (prev - 1 + count) % count));
  }, [count]);

  useEffect(() => {
    if (count <= 1 || isPaused) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) return;

    const timer = window.setInterval(next, SLIDE_INTERVAL);
    return () => window.clearInterval(timer);
  }, [count, isPaused, next]);

  if (count === 0) return null;

  return (
    <section
      className="relative w-full overflow-hidden bg-dark"
      aria-label="Find your car"
      aria-roledescription="carousel"
    >
      <div className="relative min-h-[440px] w-full xs:min-h-[480px] sm:min-h-[540px] lg:min-h-[600px]">
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

        <div className="absolute inset-0 bg-gradient-to-b from-dark/70 via-dark/55 to-dark/75" />

        <div className="relative z-10 flex min-h-[440px] items-center py-12 xs:min-h-[480px] sm:min-h-[540px] sm:py-14 lg:min-h-[600px]">
          <div className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 sm:pb-14 lg:px-8 lg:pb-12">
            <CarSearchFilter options={filterOptions} />
          </div>
        </div>

        {count > 1 && (
          <div
            className="absolute inset-x-0 bottom-4 z-20 sm:bottom-6"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocusCapture={() => setIsPaused(true)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                setIsPaused(false);
              }
            }}
          >
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
