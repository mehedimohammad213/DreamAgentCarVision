import Image from "next/image";
import Link from "next/link";
import { Calendar, Fuel, Gauge, Settings2 } from "lucide-react";
import type { Car } from "@/lib/types";
import { formatMileage, formatPrice, getCarImage } from "@/lib/utils";

interface CarCardProps {
  car: Car;
  href?: string;
}

export default function CarCard({ car, href }: CarCardProps) {
  const image = getCarImage(car);

  return (
    <Link
      href={href ?? `/cars/${car.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface">
        <Image
          src={image}
          alt={`${car.make} ${car.model}`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized={image.startsWith("http")}
        />
        {car.status && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold capitalize text-primary-dark backdrop-blur-sm">
            {car.status}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">
              {car.make}
            </p>
            <h3 className="mt-0.5 text-base font-bold text-foreground sm:text-lg">
              {car.model}
              {car.variant ? ` ${car.variant}` : ""}
            </h3>
          </div>
          <p className="text-lg font-bold text-primary-dark sm:shrink-0">
            {formatPrice(car)}
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {car.year}
          </span>
          <span className="flex items-center gap-1.5">
            <Gauge className="h-3.5 w-3.5" />
            {formatMileage(car.mileage_km)}
          </span>
          {car.fuel && (
            <span className="flex items-center gap-1.5">
              <Fuel className="h-3.5 w-3.5" />
              {car.fuel}
            </span>
          )}
          {car.transmission && (
            <span className="flex items-center gap-1.5">
              <Settings2 className="h-3.5 w-3.5" />
              {car.transmission}
            </span>
          )}
        </div>

        {car.category?.name && (
          <p className="mt-3 text-xs text-muted">{car.category.name}</p>
        )}
      </div>
    </Link>
  );
}
