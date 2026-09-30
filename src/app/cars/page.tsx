import type { Metadata } from "next";
import CarsPageClient from "@/components/CarsPageClient";
import { getCars, getFilterOptions } from "@/lib/api";
import { aboutFromPage, getCmsPage } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Car Inventory",
  description: "Browse our full inventory of available vehicles.",
};

interface CarsPageProps {
  searchParams: {
    page?: string;
    search?: string;
    make?: string;
    model?: string;
    year?: string;
    body?: string;
    fuel?: string;
    transmission?: string;
    color?: string;
    drive?: string;
    feature?: string;
    price_from?: string;
    price_to?: string;
    mileage_from?: string;
    mileage_to?: string;
    sort_by?: string;
    sort_direction?: string;
  };
}

export default async function CarsPage({ searchParams: params }: CarsPageProps) {
  const page = Number(params.page) || 1;
  const [{ cars, lastPage }, filterOptions, aboutPage] = await Promise.all([
    getCars({
      page,
      per_page: 15,
      search: params.search,
      make: params.make,
      model: params.model,
      year: params.year,
      body: params.body,
      fuel: params.fuel,
      transmission: params.transmission,
      color: params.color,
      drive: params.drive,
      feature: params.feature,
      price_from: params.price_from,
      price_to: params.price_to,
      mileage_from: params.mileage_from,
      mileage_to: params.mileage_to,
      sort_by: params.sort_by,
      sort_direction: params.sort_direction,
    }),
    getFilterOptions(),
    getCmsPage("about"),
  ]);
  const heroImage = aboutFromPage(aboutPage).hero?.image;

  return (
    <CarsPageClient
      searchParams={params}
      initialCars={cars}
      initialLastPage={lastPage}
      initialFilterOptions={filterOptions}
      heroImage={heroImage}
    />
  );
}
