import Hero from "@/components/Hero";
import FeaturedCars from "@/components/FeaturedCars";
import ContactCTA from "@/components/ContactCTA";
import PageLocationMap from "@/components/PageLocationMap";
import { getCmsPage } from "@/lib/cms";

export default async function HomePage() {
  const homePage = await getCmsPage("home");

  return (
    <>
      <Hero />
      <FeaturedCars />
      <ContactCTA />
      <PageLocationMap page={homePage} />
    </>
  );
}
