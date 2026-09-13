import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCmsPage, getCmsSiteSettings, stripHtml } from "@/lib/cms";

export default async function ContactCTA() {
  const [settings, contactPage, homePage] = await Promise.all([
    getCmsSiteSettings(),
    getCmsPage("contact"),
    getCmsPage("home"),
  ]);

  const contactCta = (
    contactPage?.additional as
      | {
          cta?: {
            phone_prefix?: string;
            description?: string;
            button_label?: string;
            button_href?: string;
            image?: string;
          };
        }
      | undefined
  )?.cta;

  const homeCta = (
    homePage?.additional as
      | {
          cta?: {
            phone_prefix?: string;
            description?: string;
            button_label?: string;
            button_href?: string;
            image?: string;
          };
        }
      | undefined
  )?.cta;

  const homeCtaCard = homePage?.cards_headless?.find(
    (card) => card.additional?.section === "contact_cta",
  );

  const phone = settings.contact.phone;
  const phonePrefix =
    contactCta?.phone_prefix ??
    homeCta?.phone_prefix ??
    (homeCtaCard?.additional?.phone_prefix as string | undefined) ??
    "Call @";
  const description =
    contactCta?.description ||
    homeCta?.description ||
    stripHtml(homeCtaCard?.description_en) ||
    "Our team is ready to help with inventory inquiries, test drives, financing options, and dealership support. Reach out anytime during business hours.";
  const ctaLabel =
    contactCta?.button_label ||
    homeCta?.button_label ||
    (homeCtaCard?.additional?.cta_label as string | undefined) ||
    "Contact Us";
  const ctaHref =
    contactCta?.button_href ||
    homeCta?.button_href ||
    homeCtaCard?.link_url ||
    "/contact";
  const image =
    contactCta?.image ||
    homeCta?.image ||
    (homeCtaCard?.additional?.image as string | undefined) ||
    "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80";

  return (
    <section className="bg-section-cream section-padding">
      <div className="page-container">
        <div className="overflow-hidden rounded-2xl bg-dark sm:rounded-3xl">
          <div className="grid md:grid-cols-5">
            <div className="flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-12 md:col-span-3 lg:px-12 lg:py-16">
              <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                {phonePrefix} {phone}
              </h2>
              <p className="mt-3 max-w-md text-sm text-slate-300 sm:mt-4 sm:text-base">
                {description}
              </p>
              <Link
                href={ctaHref}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary transition-colors hover:text-white"
              >
                {ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="relative min-h-[200px] md:col-span-2 md:min-h-[280px]">
              <Image
                src={image}
                alt="Luxury car"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 40vw"
                unoptimized={image.startsWith("http")}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/20 to-transparent md:bg-gradient-to-r md:from-dark md:via-dark/40 md:to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
