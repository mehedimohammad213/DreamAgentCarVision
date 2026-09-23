import FeaturedCarsClient from "@/components/FeaturedCarsClient";
import { getFeaturedCars } from "@/lib/api";
import { featuredFromPage, getCmsPage } from "@/lib/cms";

export default async function FeaturedCars() {
  const [cars, homePage] = await Promise.all([
    getFeaturedCars(6),
    getCmsPage("home"),
  ]);

  return (
    <FeaturedCarsClient
      initialCars={cars}
      initialPage={homePage}
      featured={featuredFromPage(homePage)}
    />
  );
}
