"use client";

import { useEffect, useState } from "react";
import HeroSlider, { type HeroSlide } from "@/components/HeroSlider";
import { fetchCmsPageBrowser } from "@/lib/cms-browser";
import {
  heroFromPage,
  slidesFromSlider,
  type CmsPage,
} from "@/lib/cms";

const fallbackSlides: HeroSlide[] = [
  {
    id: "banner-1",
    image: "/banners/banner-1.png",
    alt: "Premium white SUV in showroom",
  },
  {
    id: "banner-2",
    image: "/banners/banner-2.png",
    alt: "Luxury black sedan",
  },
  {
    id: "banner-3",
    image: "/banners/banner-3.png",
    alt: "Red sports car",
  },
];

const fallbackCopy = {
  eyebrow: "Dream Agent Car Vision",
  headline: "Find Your Next Car,\nthe Smart Way",
  subheadline:
    "Browse quality vehicles with transparent specs, photos, and pricing — all in one place.",
  primaryCta: { label: "Browse Inventory", href: "/cars" },
  secondaryCta: { label: "Contact Us", href: "/contact" },
};

type HeroClientProps = {
  initialPage: CmsPage | null;
};

export default function HeroClient({ initialPage }: HeroClientProps) {
  const [homePage, setHomePage] = useState<CmsPage | null>(initialPage);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const page = await fetchCmsPageBrowser<CmsPage>("home");
      if (!cancelled && page) setHomePage(page);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const fromBody = heroFromPage(homePage);

  const heroSlider =
    homePage?.sliders_headless?.find((s) => slidesFromSlider(s).length > 0) ??
    homePage?.sliders_headless?.[0];

  const extra = heroSlider?.additional;
  const bodySlides = fromBody?.slides ?? [];
  const sliderSlides = slidesFromSlider(heroSlider);
  const slides: HeroSlide[] =
    bodySlides.length > 0
      ? bodySlides
      : sliderSlides.length > 0
        ? sliderSlides
        : fallbackSlides;

  return (
    <HeroSlider
      slides={slides}
      eyebrow={fromBody?.eyebrow ?? extra?.eyebrow ?? fallbackCopy.eyebrow}
      headline={fromBody?.headline ?? extra?.headline ?? fallbackCopy.headline}
      subheadline={
        fromBody?.subheadline ??
        extra?.subheadline ??
        fallbackCopy.subheadline
      }
      primaryCta={
        fromBody?.primaryCta ?? extra?.primary_cta ?? fallbackCopy.primaryCta
      }
      secondaryCta={
        fromBody?.secondaryCta ??
        extra?.secondary_cta ??
        fallbackCopy.secondaryCta
      }
    />
  );
}
