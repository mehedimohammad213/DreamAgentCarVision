import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Fuel,
  Gauge,
  MapPin,
  Palette,
  Settings2,
} from "lucide-react";
import CarImageGallery from "@/components/CarImageGallery";
import InquireContactButton from "@/components/InquireContactButton";
import { getCar } from "@/lib/api";
import { formatMileage, formatPrice, getCarImage } from "@/lib/utils";
interface CarDetailPageProps {
  params: { id: string };
}

export async function generateMetadata({
  params: { id },
}: CarDetailPageProps): Promise<Metadata> {
  const car = await getCar(id);
  if (!car) return { title: "Car Not Found" };
  return {
    title: `${car.make} ${car.model} ${car.year}`,
    description: `View details for ${car.make} ${car.model} (${car.year}) — ${formatPrice(car)}`,
  };
}

export default async function CarDetailPage({
  params: { id },
}: CarDetailPageProps) {
  const car = await getCar(id);
  if (!car) notFound();

  const image = getCarImage(car);
  const photos = car.photos?.length
    ? car.photos
    : [{ id: 0, car_id: car.id, url: image, is_primary: true, sort_order: 0 }];

  const specs = [
    { icon: Calendar, label: "Year", value: car.year },
    { icon: Gauge, label: "Mileage", value: formatMileage(car.mileage_km) },
    { icon: Fuel, label: "Fuel", value: car.fuel },
    { icon: Settings2, label: "Transmission", value: car.transmission },
    { icon: Palette, label: "Color", value: car.color },
    { icon: MapPin, label: "Location", value: car.location },
  ].filter((s) => s.value);

  return (
    <>
      <section className="border-b border-border bg-surface py-4 sm:py-6">
        <div className="page-container">
          <Link
            href="/cars"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to inventory
          </Link>
        </div>
      </section>

      <section className="py-8 sm:py-10">
        <div className="page-container">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
            <CarImageGallery
              images={photos.map((photo) => ({
                id: photo.id,
                url: photo.url,
                alt: `${car.make} ${car.model}`,
              }))}
            />

            <div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted sm:text-sm">
                    {car.make}
                    {car.ref_no ? ` · ${car.ref_no}` : ""}
                  </p>
                  <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                    {car.model}
                    {car.variant ? ` ${car.variant}` : ""}
                  </h1>
                  {car.category?.name && (
                    <p className="mt-2 text-muted">{car.category.name}</p>
                  )}
                </div>
                {car.status && (
                  <span className="shrink-0 rounded-full bg-primary-light px-3 py-1 text-xs font-semibold capitalize text-primary-dark">
                    {car.status}
                  </span>
                )}
              </div>

              <p className="mt-4 text-2xl font-bold text-primary-dark sm:mt-6 sm:text-3xl">
                {formatPrice(car)}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:grid-cols-3 sm:gap-4">
                {specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="rounded-xl border border-border bg-white p-4"
                  >
                    <spec.icon className="h-4 w-4 text-muted" />
                    <p className="mt-2 text-xs text-muted">{spec.label}</p>
                    <p className="mt-0.5 text-sm font-semibold">{spec.value}</p>
                  </div>
                ))}
              </div>

              {(() => {
                const extra = [
                  car.engine_cc ? { label: "Engine", value: `${car.engine_cc} cc` } : null,
                  car.seats ? { label: "Seats", value: String(car.seats) } : null,
                  car.drive ? { label: "Drive", value: car.drive } : null,
                  car.steering ? { label: "Steering", value: car.steering } : null,
                  car.grade_overall
                    ? { label: "Grade", value: String(car.grade_overall) }
                    : null,
                  car.grade_exterior
                    ? { label: "Exterior grade", value: car.grade_exterior }
                    : null,
                  car.grade_interior
                    ? { label: "Interior grade", value: car.grade_interior }
                    : null,
                  car.package ? { label: "Package", value: car.package } : null,
                  car.body ? { label: "Body", value: car.body } : null,
                  car.type ? { label: "Type", value: car.type } : null,
                  car.chassis_no_masked
                    ? { label: "Chassis", value: car.chassis_no_masked }
                    : null,
                  car.engine_number
                    ? { label: "Engine no.", value: car.engine_number }
                    : null,
                  car.number_of_keys
                    ? { label: "Keys", value: String(car.number_of_keys) }
                    : null,
                  car.country_origin
                    ? { label: "Origin", value: car.country_origin }
                    : null,
                  car.subcategory?.name
                    ? { label: "Subcategory", value: car.subcategory.name }
                    : null,
                ].filter((row): row is { label: string; value: string } =>
                  Boolean(row?.value),
                );

                if (extra.length === 0) return null;

                return (
                  <div className="mt-6 rounded-xl border border-border bg-surface p-5">
                    <h2 className="font-semibold">Additional Details</h2>
                    <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
                      {extra.map((row) => (
                        <div key={row.label} className="contents">
                          <dt className="text-muted">{row.label}</dt>
                          <dd className="font-medium">{row.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                );
              })()}

              {car.keys_feature ? (
                <div className="mt-6 rounded-xl border border-border bg-white p-5">
                  <h2 className="font-semibold">Features</h2>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {car.keys_feature
                      .split(",")
                      .map((feature) => feature.trim())
                      .filter(Boolean)
                      .map((feature) => (
                        <li
                          key={feature}
                          className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium"
                        >
                          {feature}
                        </li>
                      ))}
                  </ul>
                </div>
              ) : null}

              {car.notes && (
                <div className="mt-6 rounded-xl border border-border bg-white p-5">
                  <h2 className="font-semibold">Notes</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {car.notes}
                  </p>
                </div>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <InquireContactButton
                  carLabel={`${car.make} ${car.model}${car.year ? ` (${car.year})` : ""}${car.ref_no ? ` · Ref ${car.ref_no}` : ""}`}
                />
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-xl border border-border px-6 py-3.5 font-semibold transition-colors hover:bg-surface"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
