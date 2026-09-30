"use client";

import { useEffect, useState } from "react";
import CarCard from "@/components/CarCard";
import CarsFilterLayout from "@/components/CarFilters";
import Pagination from "@/components/Pagination";
import {
  fetchCarsBrowser,
  fetchFilterOptionsBrowser,
} from "@/lib/cars-browser";
import type { FilterOptions } from "@/lib/api";
import type { Car } from "@/lib/types";

export type CarsSearchParams = {
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

type CarsPageClientProps = {
  searchParams: CarsSearchParams;
  initialCars: Car[];
  initialLastPage: number;
  initialFilterOptions: FilterOptions;
  heroImage?: string;
};

export default function CarsPageClient({
  searchParams: params,
  initialCars,
  initialLastPage,
  initialFilterOptions,
  heroImage,
}: CarsPageClientProps) {
  const page = Number(params.page) || 1;
  const [cars, setCars] = useState(initialCars);
  const [lastPage, setLastPage] = useState(initialLastPage);
  const [filterOptions, setFilterOptions] = useState(initialFilterOptions);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const [carsResult, options] = await Promise.all([
          fetchCarsBrowser({
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
          fetchFilterOptionsBrowser(),
        ]);

        if (cancelled) return;
        setCars(carsResult.cars);
        setLastPage(carsResult.lastPage);
        setFilterOptions(options);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [
    page,
    params.search,
    params.make,
    params.model,
    params.year,
    params.body,
    params.fuel,
    params.transmission,
    params.color,
    params.drive,
    params.feature,
    params.price_from,
    params.price_to,
    params.mileage_from,
    params.mileage_to,
    params.sort_by,
    params.sort_direction,
  ]);

  return (
        <CarsFilterLayout
          options={filterOptions}
          backgroundImage={heroImage}
      heading={
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Car Inventory
          </h1>
          <p className="mt-3 max-w-2xl text-sm font-medium text-white/80 sm:text-base">
            Auction-checked Japanese reconditioned cars with original mileage.
          </p>
        </div>
      }
    >
      <section className="page-container py-8 sm:py-10">
        <div className={loading ? "opacity-60 transition-opacity" : undefined}>
          {cars.length > 0 ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {cars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
              <Pagination
                currentPage={page}
                lastPage={lastPage}
                searchParams={params}
              />
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-surface p-16 text-center">
              <p className="text-lg font-medium">No cars found</p>
              <p className="mt-2 text-sm text-muted">
                Try adjusting your search filters or check back later.
              </p>
            </div>
          )}
        </div>
      </section>
    </CarsFilterLayout>
  );
}
