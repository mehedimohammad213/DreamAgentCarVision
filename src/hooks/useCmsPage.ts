"use client";

import { useEffect, useState } from "react";
import { fetchCmsPageBrowser } from "@/lib/cms-browser";
import type { CmsPage } from "@/lib/cms";

/** Fetches a CMS page in the browser so the route shows up in DevTools Network. */
export function useCmsPage(slug: string, initialPage: CmsPage | null) {
  const [page, setPage] = useState<CmsPage | null>(initialPage);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const data = await fetchCmsPageBrowser<CmsPage>(slug);
      if (!cancelled && data) setPage(data);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return page;
}
