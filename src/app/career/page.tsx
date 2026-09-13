import type { Metadata } from "next";
import CareerPageClient from "@/components/CareerPageClient";
import PageLocationMap from "@/components/PageLocationMap";
import { getCmsPage, getCmsSiteSettings } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPage("career");
  return {
    title: page?.head?.title ?? "Career",
    description:
      page?.head?.meta_description ??
      "Join the Dream Agent Car Vision team. Explore opportunities in automotive sales and dealership management.",
  };
}

export default async function CareerPage() {
  const [page, settings] = await Promise.all([
    getCmsPage("career"),
    getCmsSiteSettings(),
  ]);

  return (
    <>
      <CareerPageClient initialPage={page} settings={settings} />
      <PageLocationMap page={page} />
    </>
  );
}
