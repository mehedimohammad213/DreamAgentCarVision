import type { Metadata } from "next";
import CarsPageClient from "@/components/CarsPageClient";
import { getCars, getFilterOptions } from "@/lib/api";

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
    category_id?: string;
    fuel?: string;
    transmission?: string;
    price_from?: string;
    price_to?: string;
    sort_by?: string;
    sort_direction?: string;
  };
}

export default async function CarsPage({ searchParams: params }: CarsPageProps) {
  const page = Number(params.page) || 1;
  const [{ cars, total, lastPage }, filterOptions] = await Promise.all([
    getCars({
      page,
      per_page: 15,
      search: params.search,
      make: params.make,
      model: params.model,
      year: params.year,
      category_id: params.category_id,
      fuel: params.fuel,
      transmission: params.transmission,
      price_from: params.price_from,
      price_to: params.price_to,
      sort_by: params.sort_by,
      sort_direction: params.sort_direction,
    }),
    getFilterOptions(),
  ]);

  return (
    <CarsPageClient
      searchParams={params}
      initialCars={cars}
      initialTotal={total}
      initialLastPage={lastPage}
      initialFilterOptions={filterOptions}
    />
  );
}
