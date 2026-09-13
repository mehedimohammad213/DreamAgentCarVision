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
  category_id?: string;
  fuel?: string;
  transmission?: string;
  price_from?: string;
  price_to?: string;
  sort_by?: string;
  sort_direction?: string;
};

type CarsPageClientProps = {
  searchParams: CarsSearchParams;
  initialCars: Car[];
  initialTotal: number;
  initialLastPage: number;
  initialFilterOptions: FilterOptions;
};

export default function CarsPageClient({
  searchParams: params,
  initialCars,
  initialTotal,
  initialLastPage,
  initialFilterOptions,
}: CarsPageClientProps) {
  const page = Number(params.page) || 1;
  const [cars, setCars] = useState(initialCars);
  const [total, setTotal] = useState(initialTotal);
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
            category_id: params.category_id,
            fuel: params.fuel,
            transmission: params.transmission,
            price_from: params.price_from,
            price_to: params.price_to,
            sort_by: params.sort_by,
            sort_direction: params.sort_direction,
          }),
          fetchFilterOptionsBrowser(),
        ]);

        if (cancelled) return;
        setCars(carsResult.cars);
        setTotal(carsResult.total);
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
    params.category_id,
    params.fuel,
    params.transmission,
    params.price_from,
    params.price_to,
    params.sort_by,
    params.sort_direction,
  ]);

  return (
    <section className="py-8 sm:py-10">
      <div className="page-container">
        <CarsFilterLayout
          options={filterOptions}
          heading={
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
                Car Inventory
              </h1>
              <p className="mt-0.5 text-sm font-medium text-muted">
                {total > 0
                  ? `${total} Vehicle${total !== 1 ? "s" : ""}`
                  : "Browse our collection of quality vehicles"}
              </p>
            </div>
          }
        >
          <div className={loading ? "opacity-60 transition-opacity" : undefined}>
            {cars.length > 0 ? (
              <>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
        </CarsFilterLayout>
      </div>
    </section>
  );
}
