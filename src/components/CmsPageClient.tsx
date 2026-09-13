"use client";

import Image from "next/image";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import HeroSlider from "@/components/HeroSlider";
import { useCmsPage } from "@/hooks/useCmsPage";
import {
  findUsFromSection,
  formBuilderFromPage,
  headlessOf,
  normalizeComponentType,
  slidesFromSlider,
  stripHtml,
  textFromComponent,
  type CmsBodyComponent,
  type CmsBodySection,
  type CmsCard,
  type CmsFormBuilder,
  type CmsPage,
  type CmsSlider,
} from "@/lib/cms";

type CmsPageClientProps = {
  slug: string;
  initialPage: CmsPage | null;
};

function resolveMediaSrc(filePath?: string | null): string {
  if (!filePath) return "/car-placeholder.svg";
  if (/^https?:\/\//i.test(filePath)) return filePath;
  return filePath.startsWith("/") ? filePath : `/${filePath.replace(/^\//, "")}`;
}

function htmlFromComponent(component: CmsBodyComponent | null | undefined): string {
  if (!component) return "";
  if (typeof component.value === "string" && component.value.trim()) {
    return component.value;
  }
  const headless = headlessOf(component);
  if (typeof headless?.text === "string") return headless.text;
  if (typeof headless?.content === "string") return headless.content;
  return "";
}

function findSliderOnPage(
  page: CmsPage | null,
  component: CmsBodyComponent,
): CmsSlider | null {
  const embedded = headlessOf(component) as CmsSlider | null;
  if (embedded?.medias?.length || embedded?.additional?.slides?.length) {
    return embedded;
  }

  const sliderId = component.id ?? embedded?.id;
  if (sliderId != null) {
    const linked = page?.sliders_headless?.find((slider) => slider.id === sliderId);
    if (linked) return linked;
  }

  return embedded;
}

function findCardOnPage(
  page: CmsPage | null,
  component: CmsBodyComponent,
): CmsCard | null {
  const embedded = headlessOf(component) as CmsCard | null;
  if (embedded?.title_en) return embedded;

  const cardId = component.id ?? embedded?.id;
  if (cardId != null) {
    const linked = page?.cards_headless?.find((card) => card.id === cardId);
    if (linked) return linked;
  }

  return embedded;
}

function CmsComponentBlock({
  component,
  page,
}: {
  component: CmsBodyComponent;
  page: CmsPage | null;
}) {
  const type = normalizeComponentType(component.type);

  if (!type || type === "navbar" || type === "footer" || type === "menu") {
    return null;
  }

  if (type === "title") {
    const html = htmlFromComponent(component);
    const text = textFromComponent(component);
    if (!html && !text) return null;
    return html ? (
      <div
        className="prose prose-slate max-w-none [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:text-xl [&_h3]:font-semibold"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    ) : (
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{text}</h2>
    );
  }

  if (type === "description") {
    const html = htmlFromComponent(component);
    if (!html) return null;
    return (
      <div
        className="prose prose-slate max-w-none text-muted leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  if (type === "titledescription") {
    const headless = headlessOf(component);
    const title =
      (typeof headless?.title === "string" && headless.title) ||
      stripHtml(String(headless?.altTitle ?? ""));
    const description =
      (typeof headless?.description === "string" && headless.description) ||
      "";
    const link =
      (typeof headless?.link === "string" && headless.link) || undefined;

    if (!title && !description) return null;

    return (
      <div className="space-y-3">
        {title ? (
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
        ) : null}
        {description ? (
          <div
            className="prose prose-slate max-w-none text-muted leading-relaxed"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        ) : null}
        {link ? (
          <Link
            href={link}
            className="inline-flex font-semibold text-primary transition-colors hover:text-primary-dark"
          >
            Learn more
          </Link>
        ) : null}
      </div>
    );
  }

  if (type === "slider") {
    const slider = findSliderOnPage(page, component);
    const slides = slidesFromSlider(slider);
    const additional = slider?.additional;

    if (slides.length === 0) return null;

    return (
      <HeroSlider
        slides={slides}
        eyebrow={additional?.eyebrow}
        headline={additional?.headline ?? slider?.title_en}
        subheadline={additional?.subheadline ?? slider?.description_en}
        primaryCta={additional?.primary_cta}
        secondaryCta={additional?.secondary_cta}
      />
    );
  }

  if (type === "card") {
    const card = findCardOnPage(page, component);
    if (!card) return null;

    const imagePath =
      (card.additional?.image as string | undefined) ||
      (card.additional?.media as { file_path?: string } | undefined)?.file_path;

    return (
      <article className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        {imagePath ? (
          <div className="relative aspect-[16/10] w-full">
            <Image
              src={resolveMediaSrc(imagePath)}
              alt={card.title_en ?? "Card image"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              unoptimized={resolveMediaSrc(imagePath).startsWith("http")}
            />
          </div>
        ) : null}
        <div className="p-6">
          {card.title_en ? (
            <h3 className="text-lg font-semibold text-foreground">{card.title_en}</h3>
          ) : null}
          {card.description_en ? (
            <div
              className="prose prose-sm prose-slate mt-3 max-w-none text-muted"
              dangerouslySetInnerHTML={{ __html: card.description_en }}
            />
          ) : null}
          {card.link_url ? (
            <Link
              href={card.link_url.split("?")[0]}
              className="mt-4 inline-flex text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
            >
              View details
            </Link>
          ) : null}
        </div>
      </article>
    );
  }

  if (type === "media") {
    const headless = headlessOf(component);
    const media =
      (headless?.media as { file_path?: string; title?: string } | undefined) ??
      (headless as { file_path?: string; title?: string } | null);
    const filePath = media?.file_path;
    if (!filePath) return null;

    return (
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl">
        <Image
          src={resolveMediaSrc(filePath)}
          alt={media?.title ?? "Media"}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 80vw"
          unoptimized={resolveMediaSrc(filePath).startsWith("http")}
        />
      </div>
    );
  }

  if (type === "form") {
    const formData = component.data as
      | (CmsFormBuilder & { formId?: number })
      | undefined;
    const form =
      formData?.elements
        ? {
            id: formData.formId ?? formData.id,
            title: formData.title,
            description: formData.description,
            attributes: formData.attributes,
            elements: formData.elements,
          }
        : formBuilderFromPage(page);

    return (
      <div className="rounded-2xl border border-border bg-white p-6 sm:p-8">
        {form?.title ? (
          <h2 className="text-2xl font-bold tracking-tight">{form.title}</h2>
        ) : null}
        {form?.description ? (
          <p className="mt-2 text-sm text-muted">{form.description}</p>
        ) : null}
        <div className="mt-6">
          <ContactForm form={form} />
        </div>
      </div>
    );
  }

  if (type === "button") {
    const headless = headlessOf(component);
    const label =
      (typeof headless?.label === "string" && headless.label) ||
      textFromComponent(component) ||
      "Learn more";
    const href =
      (typeof headless?.url === "string" && headless.url) ||
      (typeof headless?.link === "string" && headless.link) ||
      "#";

    return (
      <Link
        href={href}
        className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark"
      >
        {label}
      </Link>
    );
  }

  const fallback = textFromComponent(component) || htmlFromComponent(component);
  if (!fallback) return null;

  return (
    <div
      className="prose prose-slate max-w-none"
      dangerouslySetInnerHTML={{ __html: fallback }}
    />
  );
}

const DEFAULT_HERO_IMAGE =
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&q=80";

function pageHeroFromCms(page: CmsPage | null) {
  const additional = page?.additional as
    | {
        hero?: { title?: string; subtitle?: string; image?: string };
        hero_title?: string;
        hero_subtitle?: string;
        hero_image?: string;
      }
    | null
    | undefined;

  const title =
    additional?.hero?.title ||
    additional?.hero_title ||
    page?.page_name_en ||
    page?.head?.title ||
    "Page";
  const subtitle =
    additional?.hero?.subtitle ||
    additional?.hero_subtitle ||
    undefined;
  const image =
    additional?.hero?.image ||
    additional?.hero_image ||
    DEFAULT_HERO_IMAGE;

  return { title, subtitle, image };
}

function CmsSectionBlock({
  section,
  page,
}: {
  section: CmsBodySection;
  page: CmsPage | null;
}) {
  // Maps are rendered once at the page level (like About/Contact/Career).
  if (
    findUsFromSection(
      section,
      page?.additional as
        | {
            find_us?: {
              eyebrow?: string;
              heading?: string;
              placeName?: string;
              embedUrl?: string;
              mapUrl?: string;
              zoom?: number;
              coordinates?: { lat?: number; lng?: number };
            };
          }
        | null
        | undefined,
    )
  ) {
    return null;
  }

  const components = section.data ?? [];
  if (components.length === 0) return null;

  const hasHeroSlider = components.some(
    (component) => normalizeComponentType(component.type) === "slider",
  );

  return (
    <section
      className={
        hasHeroSlider
          ? "overflow-hidden"
          : "section-padding border-b border-border/60 last:border-b-0"
      }
    >
      <div className={hasHeroSlider ? "" : "page-container space-y-8"}>
        {components.map((component) => (
          <CmsComponentBlock
            key={component._id ?? `${component.type}-${component.id}`}
            component={component}
            page={page}
          />
        ))}
      </div>
    </section>
  );
}

export default function CmsPageClient({ slug, initialPage }: CmsPageClientProps) {
  const page = useCmsPage(slug, initialPage);
  const sections = Array.isArray(page?.body) ? (page.body as CmsBodySection[]) : [];
  const hero = pageHeroFromCms(page);

  const hasSliderHero = sections.some((section) =>
    (section.data ?? []).some(
      (component) => normalizeComponentType(component.type) === "slider",
    ),
  );

  const contentSections = sections.filter(
    (section) =>
      !findUsFromSection(
        section,
        page?.additional as
          | {
              find_us?: {
                eyebrow?: string;
                heading?: string;
                placeName?: string;
                embedUrl?: string;
                mapUrl?: string;
                zoom?: number;
                coordinates?: { lat?: number; lng?: number };
              };
            }
          | null
          | undefined,
      ),
  );

  return (
    <div className="bg-white">
      {!hasSliderHero ? (
        <section className="relative flex min-h-[220px] items-center overflow-hidden sm:min-h-[300px] lg:min-h-[360px]">
          <Image
            src={hero.image}
            alt=""
            fill
            priority
            className="object-cover blur-sm scale-105"
            sizes="100vw"
            aria-hidden
            unoptimized={hero.image.startsWith("http")}
          />
          <div className="absolute inset-0 bg-dark/70" />
          <div className="page-container relative">
            <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl xl:text-6xl">
              {hero.title}
            </h1>
            {hero.subtitle ? (
              <p className="mt-3 max-w-2xl text-sm text-slate-200 sm:text-base">
                {hero.subtitle}
              </p>
            ) : null}
          </div>
        </section>
      ) : null}

      {contentSections.length === 0 ? (
        <section className="section-padding">
          <div className="page-container">
            <p className="text-muted">
              This page is published but has no content sections yet.
            </p>
          </div>
        </section>
      ) : (
        contentSections.map((section) => (
          <CmsSectionBlock
            key={section._id ?? section.data?.[0]?._id ?? hero.title}
            section={section}
            page={page}
          />
        ))
      )}
    </div>
  );
}
