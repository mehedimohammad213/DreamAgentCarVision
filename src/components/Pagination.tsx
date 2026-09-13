import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  searchParams: Record<string, string | undefined>;
}

export default function Pagination({
  currentPage,
  lastPage,
  searchParams,
}: PaginationProps) {
  if (lastPage <= 1) return null;

  function buildHref(page: number) {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && key !== "page") params.set(key, value);
    });
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return `/cars${qs ? `?${qs}` : ""}`;
  }

  const pages = Array.from({ length: Math.min(lastPage, 5) }, (_, i) => {
    if (lastPage <= 5) return i + 1;
    if (currentPage <= 3) return i + 1;
    if (currentPage >= lastPage - 2) return lastPage - 4 + i;
    return currentPage - 2 + i;
  });

  return (
    <nav className="mt-8 flex flex-wrap items-center justify-center gap-1 sm:mt-10">
      <Link
        href={buildHref(currentPage - 1)}
        aria-disabled={currentPage <= 1}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg border border-border transition-colors hover:bg-surface",
          currentPage <= 1 && "pointer-events-none opacity-40",
        )}
      >
        <ChevronLeft className="h-4 w-4" />
      </Link>

      {pages.map((page) => (
        <Link
          key={page}
          href={buildHref(page)}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors",
            page === currentPage
              ? "bg-primary text-white"
              : "border border-border hover:bg-surface",
          )}
        >
          {page}
        </Link>
      ))}

      <Link
        href={buildHref(currentPage + 1)}
        aria-disabled={currentPage >= lastPage}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg border border-border transition-colors hover:bg-surface",
          currentPage >= lastPage && "pointer-events-none opacity-40",
        )}
      >
        <ChevronRight className="h-4 w-4" />
      </Link>
    </nav>
  );
}
