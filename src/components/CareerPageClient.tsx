"use client";

import Image from "next/image";
import CareerSection from "@/components/CareerSection";
import { useCmsPage } from "@/hooks/useCmsPage";
import {
  careerFromPage,
  type CmsPage,
  type CmsSiteSettings,
} from "@/lib/cms";

type CareerPageClientProps = {
  initialPage: CmsPage | null;
  settings: CmsSiteSettings;
};

export default function CareerPageClient({
  initialPage,
  settings,
}: CareerPageClientProps) {
  const page = useCmsPage("career", initialPage);
  const content = careerFromPage(page);

  const heroTitle = content.hero?.title ?? page?.page_name_en ?? "Career";
  const heroImage = content.hero?.image;
  const email = content.email ?? settings.career.email;
  const title = content.title;
  const description = content.description;

  if (!title && !description && !email) return null;

  return (
    <>
      <section className="relative flex min-h-[220px] items-center overflow-hidden sm:min-h-[300px] lg:min-h-[360px]">
        {heroImage ? (
          <Image
            src={heroImage}
            alt=""
            fill
            priority
            className="object-cover blur-sm scale-105"
            sizes="100vw"
            aria-hidden
            unoptimized={heroImage.startsWith("http")}
          />
        ) : (
          <div className="absolute inset-0 bg-dark" />
        )}
        <div className="absolute inset-0 bg-dark/70" />
        <div className="page-container relative">
          <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl xl:text-6xl">
            {heroTitle}
          </h1>
          {content.hero?.subtitle ? (
            <p className="mt-3 max-w-2xl text-sm text-slate-200 sm:text-base">
              {content.hero.subtitle}
            </p>
          ) : null}
        </div>
      </section>

      <div className="bg-section-warm">
        <section className="page-container section-padding">
          <CareerSection
            title={title ?? ""}
            description={description ?? ""}
            email={email}
            applyLabel={content.apply_label ?? "Apply"}
            applySubject={content.apply_subject ?? "Career Application"}
            accentColor={content.accent_color ?? "primary"}
            images={{
              team: content.images?.team ?? "",
              desk: content.images?.desk ?? "",
            }}
          />
        </section>
      </div>
    </>
  );
}
