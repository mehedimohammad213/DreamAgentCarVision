import type { Metadata } from "next";
import ContactCTA from "@/components/ContactCTA";
import ContactPageClient from "@/components/ContactPageClient";
import PageLocationMap from "@/components/PageLocationMap";
import { getCmsPage, getCmsSiteSettings } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPage("contact");
  return {
    title: page?.head?.title ?? "Contact",
    description:
      page?.head?.meta_description ??
      "Get in touch with Dream Agent Car Vision.",
  };
}

export default async function ContactPage() {
  const [page, settings] = await Promise.all([
    getCmsPage("contact"),
    getCmsSiteSettings(),
  ]);

  return (
    <>
      <ContactPageClient initialPage={page} settings={settings} />
      <ContactCTA />
      <PageLocationMap page={page} />
    </>
  );
}
