import FeaturedCarsClient from "@/components/FeaturedCarsClient";
import { getFeaturedCars } from "@/lib/api";
import { getCmsPage } from "@/lib/cms";

export default async function FeaturedCars() {
  const [cars, homePage] = await Promise.all([
    getFeaturedCars(6),
    getCmsPage("home"),
  ]);

  const featured = homePage?.additional?.featured as
    | {
        title?: string;
        subtitle?: string;
        cta_label?: string;
        cta_href?: string;
      }
    | undefined;

  return <FeaturedCarsClient initialCars={cars} featured={featured} />;
}
