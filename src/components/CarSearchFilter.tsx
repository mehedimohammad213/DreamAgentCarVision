"use client";

import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import SearchableSelect from "@/components/SearchableSelect";
import type { FilterOptions } from "@/lib/api";
import { cn } from "@/lib/utils";

const CONDITIONS = ["All", "New", "Pre owned"] as const;

type Condition = (typeof CONDITIONS)[number];

const BRAND_LOGOS: Record<string, string> = {
  Honda: "/brands/honda.svg",
  Nissan: "/brands/nissan.svg",
  Toyota: "/brands/toyota.svg",
};

type CarSearchFilterProps = {
  options: FilterOptions;
  className?: string;
};

export default function CarSearchFilter({
  options,
  className,
}: CarSearchFilterProps) {
  const router = useRouter();
  const [condition, setCondition] = useState<Condition>("All");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");

  const makes = options.makes;

  const brandOptions = useMemo(
    () =>
      makes.map((item) => ({
        value: item,
        label: item,
        count: options.makeCounts?.[item],
      })),
    [makes, options.makeCounts],
  );

  const modelOptions = useMemo(() => {
    if (!make) return [];
    const modelsForMake =
      options.modelsByMake?.[make]?.length > 0
        ? options.modelsByMake[make]
        : [];
    const counts = options.modelCountsByMake?.[make] ?? {};
    return modelsForMake.map((item) => ({
      value: item,
      label: item,
      count: counts[item],
    }));
  }, [make, options.modelCountsByMake, options.modelsByMake]);

  const brandLogos = useMemo(
    () => (makes.length > 0 ? makes : ["Honda", "Nissan", "Toyota"]),
    [makes],
  );

  function buildCarsUrl(overrides?: { make?: string; model?: string }) {
    const params = new URLSearchParams();
    const selectedMake = overrides?.make ?? make;
    const selectedModel = overrides?.model ?? model;

    if (selectedMake) params.set("make", selectedMake);
    if (selectedModel) params.set("model", selectedModel);

    const qs = params.toString();
    return qs ? `/cars?${qs}` : "/cars";
  }

  function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    router.push(buildCarsUrl());
  }

  function handleMakeChange(nextMake: string) {
    setMake(nextMake);
    setModel("");
  }

  return (
    <div className={cn("mx-auto w-full max-w-3xl text-center", className)}>
      <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
        Find Your <span className="text-primary">Car</span>
      </h1>

      <div
        className="mt-5 flex items-center justify-center gap-6 sm:gap-8"
        role="tablist"
        aria-label="Vehicle condition"
      >
        {CONDITIONS.map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={condition === item}
            onClick={() => setCondition(item)}
            className={cn(
              "relative text-sm font-semibold transition-colors sm:text-base",
              condition === item
                ? "text-primary"
                : "text-white hover:text-white",
            )}
          >
            {item}
            {condition === item ? (
              <span className="absolute -bottom-2 left-1/2 h-0 w-0 -translate-x-1/2 border-x-[5px] border-b-[6px] border-x-transparent border-b-primary" />
            ) : null}
          </button>
        ))}
      </div>

      <form
        onSubmit={handleSearch}
        className="relative z-20 mt-8 flex flex-col gap-3 rounded-2xl bg-dark/55 p-3 backdrop-blur-md sm:flex-row sm:items-start sm:rounded-full sm:p-2"
      >
        <SearchableSelect
          label="Brand"
          placeholder="All Brands"
          value={make}
          options={brandOptions}
          onChange={handleMakeChange}
        />

        <SearchableSelect
          label="Model"
          placeholder={make ? "All Models" : "Select brand first"}
          value={model}
          options={modelOptions}
          disabled={!make}
          onChange={setModel}
        />

        <button
          type="submit"
          aria-label="Search cars"
          className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary text-white transition-colors hover:bg-brand sm:w-12 sm:shrink-0 sm:rounded-full"
        >
          <Search className="h-5 w-5" />
        </button>
      </form>

      <div className="mt-8 pb-2 sm:mt-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/90">
          Authorized Dealer For
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-5 sm:gap-x-14">
          {brandLogos.map((brand) => {
            const logoSrc = BRAND_LOGOS[brand];
            return (
              <button
                key={brand}
                type="button"
                onClick={() =>
                  router.push(buildCarsUrl({ make: brand, model: "" }))
                }
                className="group inline-flex items-center justify-center text-white transition-all hover:scale-105"
                aria-label={`Browse ${brand} cars`}
              >
                {logoSrc ? (
                  <span className="relative h-10 w-10 sm:h-12 sm:w-12">
                    <Image
                      src={logoSrc}
                      alt={`${brand} logo`}
                      fill
                      className="object-contain brightness-0 invert"
                      sizes="48px"
                    />
                  </span>
                ) : (
                  <span className="text-sm font-bold tracking-wide sm:text-base">
                    {brand}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
