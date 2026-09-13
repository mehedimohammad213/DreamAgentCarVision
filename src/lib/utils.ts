import type { Car } from "@/lib/types";

export function formatPrice(car: Car): string {
  if (car.price_formatted) return car.price_formatted;
  if (car.price_amount == null) return "Price on request";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: car.price_currency || "USD",
    maximumFractionDigits: 0,
  }).format(car.price_amount);
}

export function getCarImage(car: Car): string {
  if (car.primary_photo_url) return car.primary_photo_url;
  const primary = car.photos?.find((p) => p.is_primary);
  if (primary?.url) return primary.url;
  if (car.photos?.[0]?.url) return car.photos[0].url;
  return "/car-placeholder.svg";
}

export function formatMileage(km?: number): string {
  if (km == null) return "—";
  return `${new Intl.NumberFormat("en-US").format(km)} km`;
}

export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
