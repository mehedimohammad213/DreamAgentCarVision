"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, ReactNode, useCallback, useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import type { FilterOptions } from "@/lib/api";
import { cn } from "@/lib/utils";

const PRICE_RANGES = [
  { label: "Any", from: "", to: "" },
  { label: "Under $10,000", from: "0", to: "10000" },
  { label: "$10,000 – $20,000", from: "10000", to: "20000" },
  { label: "$20,000 – $30,000", from: "20000", to: "30000" },
  { label: "$30,000 – $50,000", from: "30000", to: "50000" },
  { label: "$50,000+", from: "50000", to: "1000000000" },
];

const SORT_OPTIONS = [
  { label: "Default", value: "" },
  { label: "Price: Low to High", value: "price_amount:asc" },
  { label: "Price: High to Low", value: "price_amount:desc" },
  { label: "Year: Newest First", value: "year:desc" },
  { label: "Mileage: Low to High", value: "mileage_km:asc" },
];

interface CarsFilterLayoutProps {
  options: FilterOptions;
  heading?: ReactNode;
  children: ReactNode;
}

export default function CarsFilterLayout({
  options,
  heading,
  children,
}: CarsFilterLayoutProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [groupQueries, setGroupQueries] = useState<Record<string, string>>({});

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const syncOpen = (matches: boolean) => setOpen(matches);

    syncOpen(mediaQuery.matches);
    const handleChange = (event: MediaQueryListEvent) => syncOpen(event.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  function toggleGroup(key: string) {
    setExpanded((current) => {
      const next = current === key ? null : key;
      if (current && current !== next) {
        setGroupQueries((queries) => {
          const { [current]: _, ...rest } = queries;
          return rest;
        });
      }
      return next;
    });
  }

  const setParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      params.delete("page");
      router.push(`/cars?${params.toString()}`);
    },
    [router, searchParams],
  );

  const currentSearch = searchParams.get("search") ?? "";
  const priceFrom = searchParams.get("price_from") ?? "";
  const priceTo = searchParams.get("price_to") ?? "";
  const activePrice =
    PRICE_RANGES.find((r) => r.from === priceFrom && r.to === priceTo) ??
    PRICE_RANGES[0];

  const activeCategoryId = searchParams.get("category_id") ?? "";
  const activeCategory =
    options.categories.find((c) => String(c.id) === activeCategoryId)?.name ??
    "";

  const currentSort = `${searchParams.get("sort_by") ?? ""}:${searchParams.get("sort_direction") ?? ""}`;
  const activeSort =
    SORT_OPTIONS.find((s) => s.value === currentSort)?.value ?? "";

  const hasActiveFilters =
    ["make", "model", "year", "category_id", "fuel", "transmission", "color", "price_from", "sort_by", "search"].some(
      (key) => searchParams.get(key),
    );

  function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const search = (form.elements.namedItem("search") as HTMLInputElement).value;
    setParams({ search: search.trim() });
  }

  const groups: {
    key: string;
    label: string;
    active: string;
    items: { label: string; onSelect: () => void; selected: boolean }[];
  }[] = [
    {
      key: "category_id",
      label: "Body Type",
      active: activeCategory,
      items: options.categories.map((c) => ({
        label: c.name,
        selected: String(c.id) === activeCategoryId,
        onSelect: () =>
          setParams({
            category_id:
              String(c.id) === activeCategoryId ? "" : String(c.id),
          }),
      })),
    },
    {
      key: "year",
      label: "Year",
      active: searchParams.get("year") ?? "",
      items: options.years.map((y) => ({
        label: String(y),
        selected: searchParams.get("year") === String(y),
        onSelect: () =>
          setParams({
            year: searchParams.get("year") === String(y) ? "" : String(y),
          }),
      })),
    },
    {
      key: "make",
      label: "Make",
      active: searchParams.get("make") ?? "",
      items: options.makes.map((m) => ({
        label: m,
        selected: searchParams.get("make") === m,
        onSelect: () =>
          setParams({ make: searchParams.get("make") === m ? "" : m }),
      })),
    },
    {
      key: "model",
      label: "Model",
      active: searchParams.get("model") ?? "",
      items: options.models.map((m) => ({
        label: m,
        selected: searchParams.get("model") === m,
        onSelect: () =>
          setParams({ model: searchParams.get("model") === m ? "" : m }),
      })),
    },
    {
      key: "fuel",
      label: "Fuel Type",
      active: searchParams.get("fuel") ?? "",
      items: options.fuels.map((f) => ({
        label: f,
        selected: searchParams.get("fuel") === f,
        onSelect: () =>
          setParams({ fuel: searchParams.get("fuel") === f ? "" : f }),
      })),
    },
    {
      key: "transmission",
      label: "Transmission",
      active: searchParams.get("transmission") ?? "",
      items: options.transmissions.map((t) => ({
        label: t,
        selected: searchParams.get("transmission") === t,
        onSelect: () =>
          setParams({
            transmission: searchParams.get("transmission") === t ? "" : t,
          }),
      })),
    },
    {
      key: "price",
      label: "Price Range",
      active: activePrice.from ? activePrice.label : "",
      items: PRICE_RANGES.map((r) => ({
        label: r.label,
        selected: r === activePrice,
        onSelect: () => setParams({ price_from: r.from, price_to: r.to }),
      })),
    },
  ];

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        {heading && <div className="min-w-0 flex-1">{heading}</div>}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-bold uppercase tracking-wide transition-colors",
              open
                ? "border-primary bg-primary-light text-primary"
                : "border-border bg-white text-foreground hover:border-primary hover:text-primary",
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => router.push("/cars")}
              className="rounded-lg bg-dark px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-black"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-start">
        {open && (
          <aside className="w-full shrink-0 rounded-xl border border-border bg-white max-lg:max-h-[70vh] max-lg:overflow-y-auto lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:w-72 lg:overflow-y-auto">
            <div className="border-b border-border p-4">
              <label
                htmlFor="car-search"
                className="text-xs font-semibold uppercase tracking-wide text-muted"
              >
                Search
              </label>
              <form onSubmit={handleSearch} className="relative mt-2">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  id="car-search"
                  name="search"
                  defaultValue={currentSearch}
                  placeholder="Make, model, ref no..."
                  className="w-full rounded-lg border border-border bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </form>
            </div>

            <div className="border-b border-border p-4">
              <label
                htmlFor="car-sort"
                className="text-xs font-semibold uppercase tracking-wide text-muted"
              >
                Sort By
              </label>
              <select
                id="car-sort"
                value={activeSort}
                onChange={(e) => {
                  const [sortBy, sortDirection] = e.target.value.split(":");
                  setParams({
                    sort_by: sortBy ?? "",
                    sort_direction: sortDirection ?? "",
                  });
                }}
                className="mt-2 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <p className="px-4 pt-4 text-sm font-bold text-foreground">
              Filters
            </p>

            <div className="p-2">
              {groups.map((group) => {
                const isExpanded = expanded === group.key;
                const query = groupQueries[group.key] ?? "";
                const filteredItems = group.items.filter((item) =>
                  item.label.toLowerCase().includes(query.trim().toLowerCase()),
                );

                return (
                  <div
                    key={group.key}
                    className="border-b border-border/70 last:border-b-0"
                  >
                    <button
                      type="button"
                      onClick={() => toggleGroup(group.key)}
                      aria-expanded={isExpanded}
                      className="flex w-full items-center justify-between gap-2 px-2 py-3.5 text-left"
                    >
                      <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                        {group.label}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            "text-sm",
                            group.active
                              ? "font-semibold text-primary"
                              : "text-foreground",
                          )}
                        >
                          {group.active || "All"}
                        </span>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-primary" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-primary" />
                        )}
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="pb-3">
                        <div className="relative px-2 pb-2">
                          <Search className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
                          <input
                            type="search"
                            value={query}
                            onChange={(e) =>
                              setGroupQueries((queries) => ({
                                ...queries,
                                [group.key]: e.target.value,
                              }))
                            }
                            placeholder={`Search ${group.label.toLowerCase()}...`}
                            aria-label={`Search ${group.label}`}
                            className="w-full rounded-lg border border-border bg-surface py-2 pl-8 pr-3 text-sm outline-none transition-colors placeholder:text-muted focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                          />
                        </div>

                        <div className="max-h-48 overflow-y-auto">
                          {group.items.length === 0 ? (
                            <p className="px-3 py-1.5 text-sm text-muted">
                              No options available
                            </p>
                          ) : filteredItems.length === 0 ? (
                            <p className="px-3 py-1.5 text-sm text-muted">
                              No matches for &ldquo;{query.trim()}&rdquo;
                            </p>
                          ) : (
                            filteredItems.map((item) => (
                              <button
                                key={item.label}
                                type="button"
                                onClick={item.onSelect}
                                className={cn(
                                  "block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors",
                                  item.selected
                                    ? "bg-primary-light font-semibold text-primary"
                                    : "text-foreground hover:bg-surface",
                                )}
                              >
                                {item.label}
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </aside>
        )}

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
