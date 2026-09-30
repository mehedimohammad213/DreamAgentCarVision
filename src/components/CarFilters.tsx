"use client";

import { ReactNode, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Search } from "lucide-react";
import type { FilterOptions } from "@/lib/api";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { label: "Date Listed: Newest", sortBy: "created_at", sortDirection: "desc" },
  { label: "Price: Lowest", sortBy: "price_amount", sortDirection: "asc" },
  { label: "Price: Highest", sortBy: "price_amount", sortDirection: "desc" },
  { label: "Mileage: Lowest", sortBy: "mileage_km", sortDirection: "asc" },
  { label: "Mileage: Highest", sortBy: "mileage_km", sortDirection: "desc" },
];

const MILEAGE_RANGES = [
  { label: "Under 10,000 km", from: "0", to: "10000" },
  { label: "10,000 – 30,000 km", from: "10000", to: "30000" },
  { label: "30,000 – 50,000 km", from: "30000", to: "50000" },
  { label: "50,000+ km", from: "50000", to: "9999999" },
];

interface CarsFilterLayoutProps {
  options: FilterOptions;
  heading?: ReactNode;
  backgroundImage?: string;
  children: ReactNode;
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
  disabled = false,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="relative min-w-0">
      <select
        aria-label={label}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "h-11 w-full min-w-0 max-w-full appearance-none truncate rounded-lg border bg-white px-3 pr-9 text-sm outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:cursor-not-allowed disabled:bg-white disabled:text-dark disabled:opacity-100",
          value
            ? "border-brand font-semibold text-brand"
            : "border-border text-dark",
        )}
      >
        <option value="" className="bg-white font-normal text-dark">
          {label}
        </option>
        {options.map((option) => (
          <option key={option} value={option} className="bg-white font-normal text-dark">
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand" />
    </div>
  );
}

export default function CarsFilterLayout({
  options,
  heading,
  backgroundImage,
  children,
}: CarsFilterLayoutProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [minPrice, setMinPrice] = useState(searchParams.get("price_from") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("price_to") ?? "");
  const [keyword, setKeyword] = useState(searchParams.get("search") ?? "");

  useEffect(() => {
    setMinPrice(searchParams.get("price_from") ?? "");
    setMaxPrice(searchParams.get("price_to") ?? "");
    setKeyword(searchParams.get("search") ?? "");
  }, [searchParams]);

  const setParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });
      params.delete("page");
      const qs = params.toString();
      router.push(qs ? `/cars?${qs}` : "/cars");
    },
    [router, searchParams],
  );

  const make = searchParams.get("make") ?? "";
  const model = searchParams.get("model") ?? "";
  const models =
    make && options.modelsByMake?.[make]?.length
      ? options.modelsByMake[make]
      : options.models;

  const mileageFrom = searchParams.get("mileage_from") ?? "";
  const mileageTo = searchParams.get("mileage_to") ?? "";
  const mileageLabel =
    MILEAGE_RANGES.find(
      (range) => range.from === mileageFrom && range.to === mileageTo,
    )?.label ?? "";

  const hasActiveFilters = [
    "search",
    "make",
    "model",
    "body",
    "price_from",
    "price_to",
    "mileage_from",
    "drive",
    "fuel",
    "feature",
    "transmission",
    "color",
    "sort_by",
  ].some((key) => searchParams.get(key));

  const sortLabel =
    SORT_OPTIONS.find(
      (option) =>
        option.sortBy === (searchParams.get("sort_by") ?? "") &&
        option.sortDirection === (searchParams.get("sort_direction") ?? ""),
    )?.label ?? SORT_OPTIONS[0].label;

  function commitKeyword(nextKeyword = keyword) {
    const next = nextKeyword.trim();
    if (next === (searchParams.get("search") ?? "")) return;
    setParams({ search: next });
  }

  function commitPrices(nextFrom = minPrice, nextTo = maxPrice) {
    const from = nextFrom.trim();
    const to = nextTo.trim();
    if (
      from === (searchParams.get("price_from") ?? "") &&
      to === (searchParams.get("price_to") ?? "")
    ) {
      return;
    }
    setParams({ price_from: from, price_to: to });
  }

  return (
    <div>
      <section className="relative overflow-hidden">
        {backgroundImage ? (
          <Image
            src={backgroundImage}
            alt=""
            fill
            priority
            className="object-cover object-[72%_center] blur-sm scale-105"
            sizes="100vw"
            aria-hidden
            unoptimized={backgroundImage.startsWith("http")}
          />
        ) : (
          <div className="absolute inset-0 bg-dark" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-dark from-[18%] via-dark/55 to-transparent" />
        <div className="page-container relative py-8 sm:py-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          {heading ? <div className="min-w-0">{heading}</div> : <div />}
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={() => router.push("/cars")}
              className="self-start rounded-lg border border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white sm:self-auto"
            >
              Reset
            </button>
          ) : null}
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              commitKeyword();
            }}
            className="relative min-w-0 flex-1"
          >
            <input
              aria-label="Keyword"
              placeholder="Enter keyword"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              className="h-11 w-full rounded-lg border border-border bg-white px-4 pr-12 text-sm text-dark outline-none placeholder:text-dark/50 focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>

          <div className="relative min-w-[220px] shrink-0">
              <select
                id="car-sort"
                aria-label="Sort by"
                value={sortLabel}
                onChange={(event) => {
                  const option = SORT_OPTIONS.find(
                    (item) => item.label === event.target.value,
                  );
                  if (!option || option.sortBy === "created_at") {
                    setParams({ sort_by: "", sort_direction: "" });
                    return;
                  }
                  setParams({
                    sort_by: option.sortBy,
                    sort_direction: option.sortDirection,
                  });
                }}
                className="h-11 w-full appearance-none rounded-lg border border-border bg-white px-3 pr-9 text-sm font-medium text-brand outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              >
                {SORT_OPTIONS.map((option) => (
                  <option
                    key={option.label}
                    value={option.label}
                    className="bg-white font-normal text-dark"
                  >
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand" />
          </div>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <FilterSelect
            label="Brand"
            value={make}
            options={options.makes}
            onChange={(value) => setParams({ make: value, model: "" })}
          />
          <FilterSelect
            label="Model"
            value={model}
            options={make ? models : []}
            disabled={!make}
            onChange={(value) => setParams({ model: value })}
          />
          <FilterSelect
            label="Type"
            value={searchParams.get("body") ?? ""}
            options={options.bodies}
            onChange={(value) => setParams({ body: value })}
          />

          <div
            className={cn(
              "flex h-11 min-w-0 overflow-hidden rounded-lg border bg-white focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20",
              minPrice || maxPrice ? "border-brand" : "border-border",
            )}
          >
            <input
              aria-label="Min Price"
              inputMode="numeric"
              placeholder="Min Price"
              value={minPrice}
              onChange={(event) =>
                setMinPrice(event.target.value.replace(/[^\d]/g, ""))
              }
              onBlur={() => commitPrices()}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  commitPrices();
                }
              }}
              className="min-w-0 w-1/2 bg-transparent px-3 text-sm text-dark outline-none placeholder:text-dark/50"
            />
            <span className="w-px shrink-0 self-stretch bg-border" />
            <input
              aria-label="Max Price"
              inputMode="numeric"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(event) =>
                setMaxPrice(event.target.value.replace(/[^\d]/g, ""))
              }
              onBlur={() => commitPrices()}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  commitPrices();
                }
              }}
              className="min-w-0 w-1/2 bg-transparent px-3 text-sm text-dark outline-none placeholder:text-dark/50"
            />
          </div>

          <FilterSelect
            label="Mileage"
            value={mileageLabel}
            options={MILEAGE_RANGES.map((range) => range.label)}
            onChange={(label) => {
              const range = MILEAGE_RANGES.find((item) => item.label === label);
              setParams({
                mileage_from: range?.from ?? "",
                mileage_to: range?.to ?? "",
              });
            }}
          />

          <FilterSelect
            label="Drive Type"
            value={searchParams.get("drive") ?? ""}
            options={options.drives}
            onChange={(value) => setParams({ drive: value })}
          />
          <FilterSelect
            label="Fuel Type"
            value={searchParams.get("fuel") ?? ""}
            options={options.fuels}
            onChange={(value) => setParams({ fuel: value })}
          />
          <FilterSelect
            label="Features"
            value={searchParams.get("feature") ?? ""}
            options={options.features}
            onChange={(value) => setParams({ feature: value })}
          />
          <FilterSelect
            label="Transmission"
            value={searchParams.get("transmission") ?? ""}
            options={options.transmissions}
            onChange={(value) => setParams({ transmission: value })}
          />
          <FilterSelect
            label="Color"
            value={searchParams.get("color") ?? ""}
            options={options.colors}
            onChange={(value) => setParams({ color: value })}
          />
        </div>
        </div>
      </section>

      {children}
    </div>
  );
}
