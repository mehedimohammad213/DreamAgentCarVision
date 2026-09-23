import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { contactCtaFromPage, getCmsPage, getCmsSiteSettings } from "@/lib/cms";

export default async function ContactCTA() {
  const [settings, contactPage, homePage] = await Promise.all([
    getCmsSiteSettings(),
    getCmsPage("contact"),
    getCmsPage("home"),
  ]);

  const cta = {
    ...contactCtaFromPage(homePage),
    ...Object.fromEntries(
      Object.entries(contactCtaFromPage(contactPage)).filter(
        ([, value]) => Boolean(value),
      ),
    ),
  };

  const phone = settings.contact.phone;
  const phonePrefix = cta.phone_prefix ?? "Call @";
  const description = cta.description;
  const ctaLabel = cta.button_label ?? "Contact Us";
  const ctaHref = cta.button_href ?? "/contact";
  const image = cta.image;

  if (!phone && !description) return null;

  return (
    <section className="bg-section-cream section-padding">
      <div className="page-container">
        <div className="overflow-hidden rounded-2xl bg-dark sm:rounded-3xl">
          <div className="grid md:grid-cols-5">
            <div className="flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-12 md:col-span-3 lg:px-12 lg:py-16">
              {phone ? (
                <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                  {phonePrefix} {phone}
                </h2>
              ) : null}
              {description ? (
                <p className="mt-3 max-w-md text-sm text-slate-300 sm:mt-4 sm:text-base">
                  {description}
                </p>
              ) : null}
              <Link
                href={ctaHref}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary transition-colors hover:text-white"
              >
                {ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            {image ? (
              <div className="relative min-h-[200px] md:col-span-2 md:min-h-[280px]">
                <Image
                  src={image}
                  alt=""
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 40vw"
                  unoptimized={image.startsWith("http")}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/20 to-transparent md:bg-gradient-to-r md:from-dark md:via-dark/40 md:to-transparent" />
              </div>
            ) : (
              <div className="min-h-[200px] bg-dark md:col-span-2 md:min-h-[280px]" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
