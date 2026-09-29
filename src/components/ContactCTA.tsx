import BrandLogoCarousel, {
  type BrandLogoItem,
} from "@/components/BrandLogoCarousel";
import { getFilterOptions } from "@/lib/api";
import { aboutFromPage, getCmsPage } from "@/lib/cms";

const BRAND_LOGOS: Record<string, string> = {
  Honda: "/brands/honda.svg",
  Nissan: "/brands/nissan.svg",
  Toyota: "/brands/toyota.svg",
};

const FALLBACK_BRANDS = [
  "Honda",
  "Nissan",
  "Toyota",
  "Suzuki",
  "Mazda",
  "Subaru",
  "Mitsubishi",
  "Lexus",
];

function toBrandItems(names: string[]): BrandLogoItem[] {
  const unique = Array.from(
    new Set(names.map((name) => name.trim()).filter(Boolean)),
  );
  return unique.map((name) => {
    const logoKey = Object.keys(BRAND_LOGOS).find(
      (key) => key.toLowerCase() === name.toLowerCase(),
    );
    return {
      name,
      logo: logoKey ? BRAND_LOGOS[logoKey] : null,
    };
  });
}

/** Replaces the old contact CTA with a brand logo carousel. */
export default async function ContactCTA() {
  const [filterOptions, aboutPage] = await Promise.all([
    getFilterOptions(),
    getCmsPage("about"),
  ]);

  const aboutBrands = aboutFromPage(aboutPage).brands?.list ?? [];
  const apiMakes = filterOptions.makes ?? [];

  const brandNames =
    aboutBrands.length > 0
      ? aboutBrands
      : apiMakes.length > 0
        ? apiMakes
        : FALLBACK_BRANDS;

  const brands = toBrandItems(brandNames);

  return <BrandLogoCarousel brands={brands} />;
}
