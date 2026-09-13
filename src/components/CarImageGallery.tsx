"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation";

interface GalleryImage {
  id: string | number;
  url: string;
  alt: string;
}

interface CarImageGalleryProps {
  images: GalleryImage[];
}

export default function CarImageGallery({ images }: CarImageGalleryProps) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const count = images.length;

  const goTo = useCallback(
    (index: number) => {
      if (count === 0) return;
      setActive(((index % count) + count) % count);
    },
    [count],
  );

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  const openLightbox = (index: number) => {
    setActive(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const hasMultiple = count > 1;
  const { swipeHandlers: mainSwipeHandlers, shouldIgnoreClick } =
    useSwipeNavigation(prev, next, hasMultiple);
  const { swipeHandlers: lightboxSwipeHandlers } = useSwipeNavigation(
    prev,
    next,
    hasMultiple && lightboxOpen
  );

  useEffect(() => {
    if (!lightboxOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxOpen, next, prev]);

  if (count === 0) return null;

  const current = images[active];

  return (
    <>
      <div>
        <button
          type="button"
          onClick={() => {
            if (!shouldIgnoreClick()) openLightbox(active);
          }}
          className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary touch-pan-y select-none"
          aria-label="Open image gallery"
          {...(hasMultiple ? mainSwipeHandlers : {})}
        >
          <Image
            src={current.url}
            alt={current.alt}
            fill
            className="object-cover transition-transform duration-300 hover:scale-[1.02]"
            priority
            unoptimized={current.url.startsWith("http")}
          />
        </button>

        {count > 1 && (
          <div className="mt-3 grid grid-cols-4 gap-1.5 sm:mt-4 sm:gap-2">
            {images.slice(0, 4).map((photo, index) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => openLightbox(index)}
                className={cn(
                  "relative aspect-[4/3] overflow-hidden rounded-lg bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  active === index && "ring-2 ring-primary",
                )}
                aria-label={`View photo ${index + 1}`}
              >
                <Image
                  src={photo.url}
                  alt=""
                  fill
                  className="object-cover"
                  unoptimized={photo.url.startsWith("http")}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Car image gallery"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Close gallery"
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/30"
          >
            <X className="h-5 w-5" />
          </button>

          {count > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-primary transition-colors hover:bg-white/30 hover:text-primary-dark sm:left-6 sm:h-12 sm:w-12"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Next image"
                className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-primary transition-colors hover:bg-white/30 hover:text-primary-dark sm:right-6 sm:h-12 sm:w-12"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div
            className="relative h-[70vh] w-full max-w-5xl touch-pan-y select-none"
            onClick={(e) => e.stopPropagation()}
            {...(hasMultiple ? lightboxSwipeHandlers : {})}
          >
            <Image
              src={current.url}
              alt={current.alt}
              fill
              className="object-contain"
              sizes="100vw"
              unoptimized={current.url.startsWith("http")}
              priority
            />
          </div>

          {count > 1 && (
            <p className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
              {active + 1} / {count}
            </p>
          )}
        </div>
      )}
    </>
  );
}
