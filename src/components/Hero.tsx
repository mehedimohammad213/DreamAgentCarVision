import HeroClient from "@/components/HeroClient";
import { getFilterOptions } from "@/lib/api";
import { getCmsPage } from "@/lib/cms";

export default async function Hero() {
  const [homePage, filterOptions] = await Promise.all([
    getCmsPage("home"),
    getFilterOptions(),
  ]);

  return (
    <HeroClient initialPage={homePage} initialFilterOptions={filterOptions} />
  );
}
