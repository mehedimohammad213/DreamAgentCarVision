import { siteConfig } from "@/config/site";
import type { Car, CarsApiResponse } from "@/lib/types";

const API_BASE = siteConfig.apiUrl;

async function fetchApi<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
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

export interface CarQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  make?: string;
  model?: string;
  year?: string;
  status?: string;
  category_id?: string;
  transmission?: string;
  fuel?: string;
  color?: string;
  price_from?: string;
  price_to?: string;
  sort_by?: string;
  sort_direction?: string;
}

export async function getCars(
  params?: CarQueryParams,
): Promise<{ cars: Car[]; total: number; lastPage: number }> {
  const query = new URLSearchParams();
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });

  const qs = query.toString();
  const response = await fetchApi<CarsApiResponse>(`/cars${qs ? `?${qs}` : ""}`);
  return normalizeCarsResponse(response);
}

export interface FilterOptions {
  makes: string[];
  models: string[];
  modelsByMake: Record<string, string[]>;
  makeCounts: Record<string, number>;
  modelCounts: Record<string, number>;
  modelCountsByMake: Record<string, Record<string, number>>;
  years: number[];
  transmissions: string[];
  fuels: string[];
  colors: string[];
  categories: { id: number; name: string }[];
}

function uniqueSorted(values: Iterable<string>): string[] {
  return [...new Set([...values].filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  );
}

/** Build make/model lists and counts from car inventory records. */
export function makeModelOptionsFromCars(cars: Car[]): {
  makes: string[];
  models: string[];
  modelsByMake: Record<string, string[]>;
  makeCounts: Record<string, number>;
  modelCounts: Record<string, number>;
  modelCountsByMake: Record<string, Record<string, number>>;
} {
  const modelsByMakeMap = new Map<string, Set<string>>();
  const makeCounts: Record<string, number> = {};
  const modelCounts: Record<string, number> = {};
  const modelCountsByMake: Record<string, Record<string, number>> = {};

  for (const car of cars) {
    const make = car.make?.trim();
    const model = car.model?.trim();
    if (!make) continue;

    makeCounts[make] = (makeCounts[make] ?? 0) + 1;
    if (!modelsByMakeMap.has(make)) modelsByMakeMap.set(make, new Set());
    if (!modelCountsByMake[make]) modelCountsByMake[make] = {};

    if (model) {
      modelsByMakeMap.get(make)!.add(model);
      modelCounts[model] = (modelCounts[model] ?? 0) + 1;
      modelCountsByMake[make][model] =
        (modelCountsByMake[make][model] ?? 0) + 1;
    }
  }

  const modelsByMake: Record<string, string[]> = {};
  for (const [make, models] of modelsByMakeMap) {
    modelsByMake[make] = [...models].sort((a, b) => a.localeCompare(b));
  }

  const makes = uniqueSorted(modelsByMakeMap.keys());
  const models = uniqueSorted(
    Object.values(modelsByMake).flatMap((list) => list),
  );

  return {
    makes,
    models,
    modelsByMake,
    makeCounts,
    modelCounts,
    modelCountsByMake,
  };
}

async function getAllCarsForFilters(): Promise<Car[]> {
  const first = await getCars({ page: 1, per_page: 100 });
  if (first.lastPage <= 1) return first.cars;

  const pages = await Promise.all(
    Array.from({ length: first.lastPage - 1 }, (_, i) =>
      getCars({ page: i + 2, per_page: 100 }),
    ),
  );

  return [first.cars, ...pages.map((p) => p.cars)].flat();
}

export async function getFilterOptions(): Promise<FilterOptions> {
  const [response, cars] = await Promise.all([
    fetchApi<{
      success: boolean;
      data: Partial<FilterOptions>;
    }>("/cars/filter/options"),
    getAllCarsForFilters(),
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

export async function getCar(id: string): Promise<Car | null> {
  const response = await fetchApi<{
    success: boolean;
    data: Car | { car: Car };
  }>(`/cars/${id}`);

  if (!response?.data) return null;

  // API returns { data: { car: {...} } }; tolerate a flat { data: car } too
  if ("car" in response.data && response.data.car) {
    return response.data.car;
  }

  return response.data as Car;
}

export async function getFeaturedCars(limit = 6): Promise<Car[]> {
  const { cars } = await getCars({ per_page: limit, status: "available" });
  return cars;
}
