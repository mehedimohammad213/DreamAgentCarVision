/**
 * Browser-side inventory (cars) API helpers.
 * Hits https://backend.dreamagentcarvision.com/api/cars so DevTools shows the request.
 */

import { siteConfig } from "@/config/site";
import type { Car, CarsApiResponse } from "@/lib/types";
import {
  carMatchesLocalFilters,
  filterOptionsFromCars,
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

function buildCarsQuery(params?: Omit<CarQueryParams, "body">): string {
  const query = new URLSearchParams();
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });
  const qs = query.toString();
  return qs ? `?${qs}` : "";
}

function paginateCars(
  cars: Car[],
  page = 1,
  perPage = 15,
): { cars: Car[]; total: number; lastPage: number } {
  const total = cars.length;
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(page, 1), lastPage);
  const start = (safePage - 1) * perPage;
  return {
    cars: cars.slice(start, start + perPage),
    total,
    lastPage,
  };
}

async function fetchCarsFromApi(
  params?: Omit<CarQueryParams, "body">,
): Promise<{
  cars: Car[];
  total: number;
  lastPage: number;
}> {
  const response = await fetchCarsApi<CarsApiResponse>(
    `/cars${buildCarsQuery(params)}`,
  );
  return normalizeCarsResponse(response);
}

export async function fetchCarsBrowser(params?: CarQueryParams): Promise<{
  cars: Car[];
  total: number;
  lastPage: number;
}> {
  const { body, model, feature, page = 1, per_page = 15, ...apiParams } =
    params ?? {};
  const localFilters = { body, model, feature };
  const needsLocal = Boolean(body || model || feature);

  if (!needsLocal) {
    return fetchCarsFromApi({ ...apiParams, page, per_page });
  }

  const first = await fetchCarsFromApi({ ...apiParams, page: 1, per_page: 100 });
  const pages =
    first.lastPage <= 1
      ? []
      : await Promise.all(
          Array.from({ length: first.lastPage - 1 }, (_, i) =>
            fetchCarsFromApi({ ...apiParams, page: i + 2, per_page: 100 }),
          ),
        );

  const allCars = [first.cars, ...pages.map((p) => p.cars)].flat();
  const filtered = allCars.filter((car) =>
    carMatchesLocalFilters(car, localFilters),
  );

  return paginateCars(filtered, page, per_page);
}

async function fetchAllCarsForFilters(): Promise<Car[]> {
  const first = await fetchCarsFromApi({ page: 1, per_page: 100 });
  if (first.lastPage <= 1) return first.cars;

  const pages = await Promise.all(
    Array.from({ length: first.lastPage - 1 }, (_, i) =>
      fetchCarsFromApi({ page: i + 2, per_page: 100 }),
    ),
  );

  return [first.cars, ...pages.map((p) => p.cars)].flat();
}

export async function fetchFilterOptionsBrowser(): Promise<FilterOptions> {
  const cars = await fetchAllCarsForFilters();
  return filterOptionsFromCars(cars);
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
