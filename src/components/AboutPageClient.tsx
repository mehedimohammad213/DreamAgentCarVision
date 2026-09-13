"use client";

import Image from "next/image";
import Link from "next/link";
import { useCmsPage } from "@/hooks/useCmsPage";
import { aboutFromPage, type CmsPage } from "@/lib/cms";

type WhyBuyItem = {
  icon?: string;
  title: string;
  description: string;
};

function SidebarSection({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`section-padding ${className}`}>
      <div className="page-container">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {title}
            </h2>
          </div>
          <div className="lg:col-span-8">{children}</div>
        </div>
      </div>
    </section>
  );
}

function FullWidthSection({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`section-padding ${className}`}>
      <div className="page-container">
        <h2 className="mb-8 text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}

const fallbackWhyBuy: WhyBuyItem[] = [
  {
    icon: "ShieldCheck",
    title: "Registered & Trusted",
    description:
      "We are the most reliable and trustworthy car importers in Bangladesh. The company is registered and member of Bangladesh Reconditioned Vehicles Importers and Dealers Association. Our company fulfilled all the requirements of the government.",
  },
  {
    icon: "CheckCircle",
    title: "Quality Assured",
    description:
      "We only import cars that have auction point, original mileage (ODO reading), and passed the JAAI inspection. This means that the car has been rigorously tested.",
  },
  {
    icon: "Car",
    title: "Wide Selection",
    description:
      "We offer a wide selection of cars from some of the most popular Japanese brands.",
  },
  {
    icon: "Users",
    title: "Dedicated Team",
    description:
      "We have a team of dedicated and experienced professionals who always help our customers. Moreover, we offer after-sales service for our customers.",
  },
  {
    icon: "Target",
    title: "Best Prices",
    description:
      "We offer the best prices in Bangladesh for Japanese Reconditioned Cars.",
  },
];

export default function AboutPageClient({
  initialPage,
}: {
  initialPage: CmsPage | null;
}) {
  const page = useCmsPage("about", initialPage);
  const content = aboutFromPage(page);

  const heroTitle = content.hero?.title ?? "About Us";
  const heroSubtitle = content.hero?.subtitle;
  const heroImage =
    content.hero?.image ??
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&q=80";
  const whyBuy = content.whyBuy;

  const whyBuyFromCards =
    page?.cards_headless
      ?.filter((card) => card.additional?.section === "why_buy")
      .sort(
        (a, b) =>
          Number(a.additional?.order ?? 0) - Number(b.additional?.order ?? 0),
      )
      .map((card) => ({
        icon: (card.additional?.icon as string | undefined) ?? undefined,
        title: card.title_en ?? "",
        description: (card.description_en ?? "")
          .replace(/<[^>]*>/g, "")
          .trim(),
      }))
      .filter((item) => item.title) ?? [];

  const whyBuyItems =
    whyBuy?.items?.length
      ? whyBuy.items
      : whyBuyFromCards.length
        ? whyBuyFromCards
        : fallbackWhyBuy;
  const brands = content.brands;
  const cta = content.cta;

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
          {heroSubtitle ? (
            <p className="mt-3 max-w-2xl text-sm text-slate-200 sm:text-base">
              {heroSubtitle}
            </p>
          ) : null}
        </div>
      </section>

      <FullWidthSection
        title={
          whyBuy?.title ?? "Why Buy a Car from Dream Agent Car Vision?"
        }
        className="bg-section-warm"
      >
        <p className="mb-8 text-sm leading-relaxed text-muted">
          {whyBuy?.intro ??
            "There are several reasons why someone might want to buy a car from Dream Agent Car Vision."}
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {whyBuyItems.map((item, i) => (
            <div
              key={item.title}
              className="rounded-2xl border border-border bg-white p-6 transition-shadow hover:shadow-lg"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white text-sm font-bold">
                  {i + 1}
                </span>
                <h3 className="font-semibold text-foreground">{item.title}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </FullWidthSection>

      <SidebarSection
        title={
          brands?.title ?? "Deals with all Japanese & European Brands"
        }
        className="bg-section-grey"
      >
        <div className="space-y-4 text-sm leading-relaxed text-muted">
          {(
            brands?.paragraphs ?? [
              "Dream Agent Car Vision specializes in importing vehicles from all major Japanese brands. Our extensive inventory includes popular brands such as Toyota, Honda, Nissan, Suzuki, Mazda, and Subaru, among others. We focus on providing high-quality reconditioned cars that meet the diverse needs of our customers. Each vehicle comes with authentic auction sheets, ensuring transparency and trust. By offering a wide range of models, Dream Agent Car Vision ensures that customers can find the perfect vehicle that suits their preferences and lifestyle.",
              "Dream Agent Car Vision also offers a pre-order service for European Brand New cars, allowing customers to secure their preferred models before they arrive in Bangladesh. This service caters to enthusiasts and buyers looking for specific European brands such as BMW, Mercedes-Benz, Audi, Volkswagen, and Volvo.",
            ]
          ).map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-8 rounded-2xl bg-white p-6">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted">
            {brands?.list_label ?? "Brands we deal with"}
          </p>
          <div className="flex flex-wrap gap-3">
            {(
              brands?.list ?? [
                "Toyota",
                "Honda",
                "Nissan",
                "Suzuki",
                "Mazda",
                "Subaru",
                "Mitsubishi",
                "BMW",
                "Mercedes-Benz",
                "Audi",
                "Volkswagen",
                "Volvo",
              ]
            ).map((brand) => (
              <span
                key={brand}
                className="rounded-full border border-border bg-section-grey px-4 py-2 text-xs font-medium text-foreground"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </SidebarSection>

      <section className="bg-dark section-padding">
        <div className="page-container text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
            {cta?.title ??
              "So why late? Be a family member of Dream Agent Car Vision"}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-300 sm:text-base">
            {cta?.description ??
              "Join thousands of satisfied customers who trust us for their vehicle needs. Experience transparency, quality, and exceptional service."}
          </p>
          <Link
            href={cta?.button_href ?? "/cars"}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            {cta?.button_label ?? "Browse Our Cars"}
          </Link>
        </div>
      </section>
    </>
  );
}
