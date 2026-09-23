import Image from "next/image";
import { TrendingUp } from "lucide-react";

type CareerSectionProps = {
  title: string;
  description: string;
  email: string;
  applyLabel: string;
  applySubject: string;
  images: {
    team: string;
    desk: string;
  };
  accentColor?: "primary" | "amber";
};

export default function CareerSection({
  title,
  description,
  email,
  applyLabel,
  applySubject,
  images,
  accentColor = "primary",
}: CareerSectionProps) {
  const accentBlockClass =
    accentColor === "amber" ? "bg-amber-400" : "bg-primary";
  const stepsBlockClass =
    accentColor === "amber" ? "bg-amber-100" : "bg-primary-light";

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12 xl:gap-16">
      <div>
          {title ? (
            <h2 className="text-xl font-bold leading-snug text-foreground sm:text-2xl lg:text-3xl">
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="mt-5 text-sm leading-relaxed text-muted sm:text-base">
              {description}
            </p>
          ) : null}
          {email ? (
            <p className="mt-6 text-sm text-foreground">
              E-mail:{" "}
              <a
                href={`mailto:${email}`}
                className="font-medium text-primary transition-colors hover:text-primary-dark"
              >
                {email}
              </a>
            </p>
          ) : null}
          {email && applyLabel ? (
            <a
              href={`mailto:${email}?subject=${encodeURIComponent(applySubject)}`}
              className="mt-6 inline-block bg-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-primary-dark sm:text-sm"
            >
              {applyLabel}
            </a>
          ) : null}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {images.team ? (
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={images.team}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 50vw, 25vw"
              unoptimized={images.team.startsWith("http")}
            />
          </div>
        ) : (
          <div className="aspect-square bg-surface" />
        )}
        <div className={`aspect-square ${accentBlockClass}`} />
        <div
          className={`flex aspect-square items-center justify-center ${stepsBlockClass}`}
        >
          <TrendingUp
            className={`h-16 w-16 sm:h-20 sm:w-20 ${
              accentColor === "amber" ? "text-amber-600" : "text-primary"
            }`}
            strokeWidth={1.5}
          />
        </div>
        {images.desk ? (
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={images.desk}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 50vw, 25vw"
              unoptimized={images.desk.startsWith("http")}
            />
          </div>
        ) : (
          <div className="aspect-square bg-surface" />
        )}
      </div>
    </div>
  );
}
