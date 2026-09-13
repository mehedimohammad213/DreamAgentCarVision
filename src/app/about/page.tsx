import type { Metadata } from "next";
import AboutPageClient from "@/components/AboutPageClient";
import ContactCTA from "@/components/ContactCTA";
import PageLocationMap from "@/components/PageLocationMap";
import { getCmsPage } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPage("about");
  return {
    title: page?.head?.title ?? "About - Dream Agent Car Vision",
    description:
      page?.head?.meta_description ??
      "Learn about Dream Agent Car Vision — your trusted source for high-quality Japanese reconditioned vehicles in Bangladesh.",
  };
}

export default async function AboutPage() {
  const page = await getCmsPage("about");

  return (
    <>
      <AboutPageClient initialPage={page} />
      <ContactCTA />
      <PageLocationMap page={page} />
    </>
  );
}
