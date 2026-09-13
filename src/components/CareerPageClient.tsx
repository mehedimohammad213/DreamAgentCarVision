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

  const heroTitle = content.hero?.title ?? "Career";
  const heroImage =
    content.hero?.image ??
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80";

  return (
    <>
      <section className="relative flex min-h-[220px] items-center overflow-hidden sm:min-h-[300px] lg:min-h-[360px]">
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
            title={
              content.title ??
              "We hire brilliant minds and we help them thrive."
            }
            description={
              content.description ??
              "Since its inception, we have been maintaining our legacy without compromising our fundamental values. We always stand up for the ambitious ones who dream of accomplishing positive changes. We enable you to bring your creative ideas into play. We work together to achieve greatness."
            }
            email={content.email ?? settings.career.email}
            applyLabel={content.apply_label ?? "Apply for Executive"}
            applySubject={
              content.apply_subject ??
              "Executive Application — Dream Agent Car Vision"
            }
            accentColor={content.accent_color ?? "primary"}
            images={{
              team:
                content.images?.team ??
                "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
              desk:
                content.images?.desk ??
                "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
            }}
          />
        </section>
      </div>
    </>
  );
}
