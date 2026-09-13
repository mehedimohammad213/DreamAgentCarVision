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
  years: number[];
  transmissions: string[];
  fuels: string[];
  colors: string[];
  categories: { id: number; name: string }[];
}

export async function getFilterOptions(): Promise<FilterOptions> {
  const response = await fetchApi<{
    success: boolean;
    data: Partial<FilterOptions>;
  }>("/cars/filter/options");

  return {
    makes: response?.data?.makes ?? [],
    models: response?.data?.models ?? [],
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
