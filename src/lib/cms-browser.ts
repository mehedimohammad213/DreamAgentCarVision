/**
 * Browser-side CMS fetch helpers.
 * Used by page client components so each route hits its own API in DevTools.
 */

const CMS_API_URL =
  process.env.NEXT_PUBLIC_CMS_API_URL || "http://127.0.0.1:8000/api";
const CMS_SITE_KEY = process.env.NEXT_PUBLIC_CMS_SITE_KEY || "";

export async function fetchCmsPageBrowser<T = unknown>(
  slug: string,
): Promise<T | null> {
  if (!CMS_SITE_KEY) return null;

  try {
    const res = await fetch(`${CMS_API_URL}/public/pages/${slug}`, {
      headers: {
        Accept: "application/json",
        "X-Headless-Site-Key": CMS_SITE_KEY,
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function fetchCmsBrowser<T = unknown>(
  path: string,
): Promise<T | null> {
  if (!CMS_SITE_KEY) return null;

  try {
    const res = await fetch(`${CMS_API_URL}${path}`, {
      headers: {
        Accept: "application/json",
        "X-Headless-Site-Key": CMS_SITE_KEY,
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
