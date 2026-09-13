import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import CmsPageClient from "@/components/CmsPageClient";
import ContactCTA from "@/components/ContactCTA";
import PageLocationMap from "@/components/PageLocationMap";
import {
  cmsPageFetchKey,
  hasCmsPageQueryParams,
  resolveCmsPageForPath,
} from "@/lib/cms";

interface DynamicCmsPageProps {
  params: { slug: string[] };
  searchParams: Record<string, string | string[] | undefined>;
}

export async function generateMetadata({
  params,
  searchParams,
}: DynamicCmsPageProps): Promise<Metadata> {
  const page = await resolveCmsPageForPath(params.slug, searchParams);
  if (!page) return { title: "Page Not Found" };

  return {
    title: page.head?.title ?? page.page_name_en ?? "Page",
    description: page.head?.meta_description,
  };
}

export default async function DynamicCmsPage({
  params,
  searchParams,
}: DynamicCmsPageProps) {
  const cleanPath = `/${params.slug.join("/")}`;

  if (hasCmsPageQueryParams(searchParams)) {
    redirect(cleanPath);
  }

  const page = await resolveCmsPageForPath(params.slug, searchParams);
  if (!page) notFound();

  return (
    <>
      <CmsPageClient slug={cmsPageFetchKey(page)} initialPage={page} />
      <ContactCTA />
      <PageLocationMap page={page} />
    </>
  );
}
