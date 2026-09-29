"use client";

import { useEffect, useState } from "react";
import HeroSlider, { type HeroSlide } from "@/components/HeroSlider";
import { fetchCmsPageBrowser } from "@/lib/cms-browser";
import { fetchFilterOptionsBrowser } from "@/lib/cars-browser";
import {
  heroFromPage,
  slidesFromSlider,
  type CmsPage,
} from "@/lib/cms";
import type { FilterOptions } from "@/lib/api";

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

type HeroClientProps = {
  initialPage: CmsPage | null;
  initialFilterOptions: FilterOptions;
};

export default function HeroClient({
  initialPage,
  initialFilterOptions,
}: HeroClientProps) {
  const [homePage, setHomePage] = useState<CmsPage | null>(initialPage);
  const [filterOptions, setFilterOptions] =
    useState<FilterOptions>(initialFilterOptions);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const [page, options] = await Promise.all([
        fetchCmsPageBrowser<CmsPage>("home"),
        fetchFilterOptionsBrowser(),
      ]);
      if (cancelled) return;
      if (page) setHomePage(page);
      setFilterOptions(options);
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

  const bodySlides = fromBody?.slides ?? [];
  const sliderSlides = slidesFromSlider(heroSlider);
  const slides: HeroSlide[] =
    bodySlides.length > 0
      ? bodySlides
      : sliderSlides.length > 0
        ? sliderSlides
        : fallbackSlides;

  return <HeroSlider slides={slides} filterOptions={filterOptions} />;
}
