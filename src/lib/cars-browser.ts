/**
 * Browser-side inventory (cars) API helpers.
 * Hits https://backend.dreamagentcarvision.com/api/cars so DevTools shows the request.
 */

import { siteConfig } from "@/config/site";
import type { Car, CarsApiResponse } from "@/lib/types";
import {
  makeModelOptionsFromCars,
  type CarQueryParams,
  type FilterOptions,
} from "@/lib/api";

const API_BASE = siteConfig.apiUrl;

async function fetchCarsApi<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function normalizeCarsResponse(response: CarsApiResponse | null): {
  cars: Car[];
  total: number;
  lastPage: number;
} {
  if (!response?.data) return { cars: [], total: 0, lastPage: 1 };

  if (Array.isArray(response.data)) {
    return { cars: response.data, total: response.data.length, lastPage: 1 };
  }

  return {
    cars: response.data.data ?? [],
    total: response.data.total ?? 0,
    lastPage: response.data.last_page ?? 1,
  };
}

function buildCarsQuery(params?: CarQueryParams): string {
  const query = new URLSearchParams();
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });
  const qs = query.toString();
  return qs ? `?${qs}` : "";
}

export async function fetchCarsBrowser(params?: CarQueryParams): Promise<{
  cars: Car[];
  total: number;
  lastPage: number;
}> {
  const response = await fetchCarsApi<CarsApiResponse>(
    `/cars${buildCarsQuery(params)}`,
  );
  return normalizeCarsResponse(response);
}

function uniqueSorted(values: Iterable<string>): string[] {
  return [...new Set([...values].filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  );
}

async function fetchAllCarsForFilters(): Promise<Car[]> {
  const first = await fetchCarsBrowser({ page: 1, per_page: 100 });
  if (first.lastPage <= 1) return first.cars;

  const pages = await Promise.all(
    Array.from({ length: first.lastPage - 1 }, (_, i) =>
      fetchCarsBrowser({ page: i + 2, per_page: 100 }),
    ),
  );

  return [first.cars, ...pages.map((p) => p.cars)].flat();
}

export async function fetchFilterOptionsBrowser(): Promise<FilterOptions> {
  const [response, cars] = await Promise.all([
    fetchCarsApi<{
      success: boolean;
      data: Partial<FilterOptions>;
    }>("/cars/filter/options"),
    fetchAllCarsForFilters(),
  ]);

  const fromCars = makeModelOptionsFromCars(cars);
  const makes = uniqueSorted([
    ...(response?.data?.makes ?? []),
    ...fromCars.makes,
  ]);
  const models = uniqueSorted([
    ...(response?.data?.models ?? []),
    ...fromCars.models,
  ]);

  return {
    makes: makes.length > 0 ? makes : fromCars.makes,
    models: models.length > 0 ? models : fromCars.models,
    modelsByMake: fromCars.modelsByMake,
    makeCounts: fromCars.makeCounts,
    modelCounts: fromCars.modelCounts,
    modelCountsByMake: fromCars.modelCountsByMake,
    years: response?.data?.years ?? [],
    transmissions: response?.data?.transmissions ?? [],
    fuels: response?.data?.fuels ?? [],
    colors: response?.data?.colors ?? [],
    categories: response?.data?.categories ?? [],
  };
}

export async function fetchCarBrowser(id: string): Promise<Car | null> {
  const response = await fetchCarsApi<{
    success: boolean;
    data: Car | { car: Car };
  }>(`/cars/${id}`);

  if (!response?.data) return null;

  if ("car" in response.data && response.data.car) {
    return response.data.car;
  }

  return response.data as Car;
}

export async function fetchFeaturedCarsBrowser(limit = 6): Promise<Car[]> {
  const { cars } = await fetchCarsBrowser({
    per_page: limit,
    status: "available",
  });
  return cars;
}
