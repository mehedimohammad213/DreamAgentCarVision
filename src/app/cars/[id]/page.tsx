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

              {(car.engine_cc || car.seats || car.drive || car.steering) && (
                <div className="mt-6 rounded-xl border border-border bg-surface p-5">
                  <h2 className="font-semibold">Additional Details</h2>
                  <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    {car.engine_cc && (
                      <>
                        <dt className="text-muted">Engine</dt>
                        <dd className="font-medium">{car.engine_cc} cc</dd>
                      </>
                    )}
                    {car.seats && (
                      <>
                        <dt className="text-muted">Seats</dt>
                        <dd className="font-medium">{car.seats}</dd>
                      </>
                    )}
                    {car.drive && (
                      <>
                        <dt className="text-muted">Drive</dt>
                        <dd className="font-medium">{car.drive}</dd>
                      </>
                    )}
                    {car.steering && (
                      <>
                        <dt className="text-muted">Steering</dt>
                        <dd className="font-medium">{car.steering}</dd>
                      </>
                    )}
                    {car.grade_overall && (
                      <>
                        <dt className="text-muted">Grade</dt>
                        <dd className="font-medium">{car.grade_overall}</dd>
                      </>
                    )}
                    {car.country_origin && (
                      <>
                        <dt className="text-muted">Origin</dt>
                        <dd className="font-medium">{car.country_origin}</dd>
                      </>
                    )}
                  </dl>
                </div>
              )}

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
