import type { CmsFindUsContent } from "@/lib/cms";

export default function LocationMapBlock({
  findUs,
}: {
  findUs: CmsFindUsContent;
}) {
  return (
    <section className="border-t border-border bg-section-grey section-padding">
      <div className="page-container">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            {findUs.eyebrow}
          </p>
          <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
            {findUs.heading}
          </h2>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-border shadow-sm sm:mt-10">
          <iframe
            title={`Map showing ${findUs.placeName}`}
            src={findUs.embedUrl}
            className="h-[240px] w-full border-0 xs:h-[280px] sm:h-[360px] lg:h-[420px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
