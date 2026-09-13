import HeroClient from "@/components/HeroClient";
import { getCmsPage } from "@/lib/cms";

export default async function Hero() {
  const homePage = await getCmsPage("home");
  return <HeroClient initialPage={homePage} />;
}
