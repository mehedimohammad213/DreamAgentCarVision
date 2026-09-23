import { siteConfig as fallbackSiteConfig } from "@/config/site";

const CMS_API_URL =
  process.env.NEXT_PUBLIC_CMS_API_URL || "http://127.0.0.1:8000/api";
const CMS_SITE_KEY = process.env.NEXT_PUBLIC_CMS_SITE_KEY || "";

export type CmsPage = {
  id: number;
  slug: string;
  type?: string;
  page_name_en?: string;
  page_name_bn?: string;
  head?: {
    title?: string;
    meta_description?: string;
    [key: string]: unknown;
  };
  body?: unknown;
  additional?: Record<string, unknown> | null;
  sliders_headless?: CmsSlider[];
  cards_headless?: CmsCard[];
  navbars_headless?: CmsNavbar[];
  footers_headless?: CmsFooter[];
  menus_headless?: CmsMenu[];
  medias_headless?: { id: number; file_path?: string; title?: string }[];
};

export type CmsSlider = {
  id: number;
  title_en?: string;
  description_en?: string;
  type?: string;
  media_ids?: number[];
  additional?: {
    eyebrow?: string;
    headline?: string;
    subheadline?: string;
    primary_cta?: { label: string; href: string };
    secondary_cta?: { label: string; href: string };
    slides?: { id: string | number; image: string; alt: string }[];
    [key: string]: unknown;
  } | null;
  medias?: { id: number; file_path: string; title?: string }[];
};

export type CmsBodyComponent = {
  _id?: string;
  type?: string;
  id?: number | string;
  value?: string | null;
  _headless?: Record<string, unknown> | null;
  [key: string]: unknown;
};

export type CmsBodySection = {
  _id?: string;
  data?: CmsBodyComponent[];
  [key: string]: unknown;
};

function getBodySections(page: CmsPage | null | undefined): CmsBodySection[] {
  if (!page?.body || !Array.isArray(page.body)) return [];
  return page.body as CmsBodySection[];
}

export function findBodyComponent(
  page: CmsPage | null | undefined,
  componentId: string,
): CmsBodyComponent | null {
  for (const section of getBodySections(page)) {
    for (const component of section.data ?? []) {
      if (component._id === componentId) return component;
    }
  }
  return null;
}

export function findBodySection(
  page: CmsPage | null | undefined,
  sectionId: string,
): CmsBodySection | null {
  return (
    getBodySections(page).find((section) => section._id === sectionId) ?? null
  );
}

/** Prefer live `value` (what the page editor saves) over cached `_headless.text`. */
export function textFromComponent(
  component: CmsBodyComponent | null | undefined,
): string | null {
  if (!component) return null;

  const fromValue = stripHtml(component.value);
  if (fromValue) return fromValue;

  const headless = component._headless;
  if (headless && typeof headless === "object") {
    const text = headless.text;
    if (typeof text === "string" && text.trim()) return stripHtml(text);
    const title = headless.title;
    if (typeof title === "string" && title.trim()) return stripHtml(title);
  }

  return null;
}

export function headlessOf(
  component: CmsBodyComponent | null | undefined,
): Record<string, unknown> | null {
  const headless = component?._headless;
  if (headless && typeof headless === "object") return headless;
  return null;
}

const LINKED_HEADLESS_KEYS: Partial<
  Record<string, keyof Pick<CmsPage, "cards_headless" | "footers_headless" | "medias_headless" | "menus_headless" | "navbars_headless" | "sliders_headless">>
> = {
  card: "cards_headless",
  footer: "footers_headless",
  media: "medias_headless",
  menu: "menus_headless",
  navbar: "navbars_headless",
  slider: "sliders_headless",
};

/** Prefer live linked entity data from the page API over stale embedded `_headless`. */
export function linkedHeadlessOf(
  page: CmsPage | null | undefined,
  component: CmsBodyComponent | null | undefined,
): Record<string, unknown> | null {
  if (!component) return null;

  const type = String(component.type ?? "");
  const listKey = LINKED_HEADLESS_KEYS[type];
  const componentId = component.id;

  if (listKey && page && componentId != null) {
    const list = page[listKey] as { id: number }[] | undefined;
    const live = list?.find((item) => item.id === componentId);
    if (live) return live as Record<string, unknown>;
  }

  return headlessOf(component);
}

export type CmsHeroContent = {
  eyebrow?: string;
  headline?: string;
  subheadline?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  slides?: { id: string | number; image: string; alt: string }[];
};

/** Build hero slides from slider.additional.slides or medias. */
export function slidesFromSlider(
  slider: CmsSlider | null | undefined,
): { id: string | number; image: string; alt: string }[] {
  if (!slider) return [];

  const fromAdditional = slider.additional?.slides;
  if (Array.isArray(fromAdditional) && fromAdditional.length > 0) {
    return fromAdditional.map((slide) => ({
      id: slide.id,
      image: slide.image,
      alt: slide.alt,
    }));
  }

  const medias = slider.medias ?? [];
  if (medias.length === 0) return [];

  const ordered =
    Array.isArray(slider.media_ids) && slider.media_ids.length > 0
      ? slider.media_ids
          .map((id) => medias.find((m) => m.id === id))
          .filter((m): m is NonNullable<typeof m> => Boolean(m))
      : medias;

  return ordered.map((media) => ({
    id: media.id,
    image: media.file_path,
    alt: media.title || "Slide",
  }));
}

export function heroFromPage(page: CmsPage | null): CmsHeroContent | null {
  const section = findBodySection(page, "section-home-hero");
  const homeHero = page?.additional?.hero as
    | {
        eyebrow?: string;
        headline?: string;
        subheadline?: string;
        primary_cta?: { label: string; href: string };
        secondary_cta?: { label: string; href: string };
      }
    | undefined;

  const eyebrow =
    textFromComponent(findBodyComponent(page, "home-hero-eyebrow")) ??
    homeHero?.eyebrow;
  const headline =
    textFromComponent(findBodyComponent(page, "home-hero-headline")) ??
    homeHero?.headline;
  const subheadline =
    textFromComponent(findBodyComponent(page, "home-hero-subheadline")) ??
    homeHero?.subheadline;

  const ctaHeadless = headlessOf(findBodyComponent(page, "home-hero-ctas"));
  const primaryCta = (ctaHeadless?.primary_cta as
    | { label: string; href: string }
    | undefined) ?? homeHero?.primary_cta;
  const secondaryCta = (ctaHeadless?.secondary_cta as
    | { label: string; href: string }
    | undefined) ?? homeHero?.secondary_cta;

  const sliderHeadless = linkedHeadlessOf(
    page,
    findBodyComponent(page, "home-hero-slider"),
  );
  const sliderAdditional = (sliderHeadless?.additional ?? null) as
    | CmsSlider["additional"]
    | null;
  const slidesFromBody = sliderAdditional?.slides;

  const linkedSlider =
    (sliderHeadless as CmsSlider | null) ??
    page?.sliders_headless?.find(
      (s) => s.id === (sliderHeadless?.id as number | undefined),
    ) ??
    page?.sliders_headless?.[0];
  const slides =
    (slidesFromBody && slidesFromBody.length > 0
      ? slidesFromBody
      : slidesFromSlider(linkedSlider)) ?? [];

  if (
    !section?.data?.length &&
    !eyebrow &&
    !headline &&
    !subheadline &&
    slides.length === 0
  ) {
    return null;
  }

  return {
    eyebrow: eyebrow ?? sliderAdditional?.eyebrow,
    headline: headline ?? sliderAdditional?.headline,
    subheadline: subheadline ?? sliderAdditional?.subheadline,
    primaryCta: primaryCta ?? sliderAdditional?.primary_cta,
    secondaryCta: secondaryCta ?? sliderAdditional?.secondary_cta,
    slides,
  };
}

export type CmsCard = {
  id: number;
  page_name?: string;
  title_en?: string;
  description_en?: string;
  link_url?: string | null;
  additional?: Record<string, unknown> | null;
};

export type CmsMenuItem = {
  id: number;
  title: string;
  title_bn?: string;
  link?: string;
};

export type CmsMenu = {
  id: number;
  name: string;
  menu_item_ids?: number[];
  menu_items?: CmsMenuItem[];
};

export type CmsNavbar = {
  id: number;
  title_en?: string;
  menu_item_ids?: Array<number | string>;
  menu_items?: CmsMenuItem[];
  menu?: CmsMenu & {
    menu_items_headless?: CmsMenuItem[];
  };
  logo?: { file_path?: string };
};

export type CmsFooter = {
  id: number;
  title_en?: string;
  footer_status?: number | boolean;
  address1_title_en?: string;
  address1_description_en?: string;
  address1_status?: number | boolean;
  address2_title_en?: string;
  address2_description_en?: string;
  address2_status?: number | boolean;
  column2_status?: number | boolean;
  column3_status?: number | boolean;
  column4_status?: number | boolean;
  column4_title_en?: string;
  column4_text_en?: string;
  column4_description_en?: string;
  column2_menu?: CmsMenu;
  column3_menu?: CmsMenu;
  column4_menu?: CmsMenu;
  logo?: { file_path?: string };
};

export type CmsFormBuilderElement = {
  updated_on?: string;
  type?: string;
  element_type?: string;
  input_type?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  width?: "half" | "full" | string;
  name?: string;
  options?: { title?: string; value?: string }[];
  content?: string;
};

export type CmsFormBuilder = {
  id: number;
  title?: string;
  description?: string;
  attributes?: {
    action_url?: string;
    submit_text?: string;
    layout?: string;
    method?: string;
    [key: string]: unknown;
  } | null;
  elements?: CmsFormBuilderElement[];
  additional?: Record<string, unknown> | null;
  status?: number | boolean;
};

export type CmsSiteSettings = typeof fallbackSiteConfig & {
  messenger?: string;
  follow_us?: {
    label?: string;
    menu_id?: number;
  };
};

/** Unwrap list endpoints that return `{ data, meta }`. Single resources stay as-is. */
export function unwrapCmsPayload<T>(payload: unknown): T {
  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    (Array.isArray((payload as { data: unknown }).data) ||
      "meta" in payload)
  ) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

async function fetchCms<T>(path: string): Promise<T | null> {
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
    const json = await res.json();
    return unwrapCmsPayload<T>(json);
  } catch {
    return null;
  }
}

export async function getCmsPage(slug: string): Promise<CmsPage | null> {
  return fetchCms<CmsPage>(`/public/pages/${slug}`);
}

export async function getCmsSiteSettings(): Promise<CmsSiteSettings> {
  const page = await getCmsPage("site-settings");
  const fromCms = page?.additional as Partial<CmsSiteSettings> | null;

  if (!fromCms) return fallbackSiteConfig as CmsSiteSettings;

  return {
    ...fallbackSiteConfig,
    ...fromCms,
    contact: {
      ...fallbackSiteConfig.contact,
      ...(fromCms.contact ?? {}),
      googleMaps: {
        ...fallbackSiteConfig.contact.googleMaps,
        ...(fromCms.contact?.googleMaps ?? {}),
      },
      businessHours:
        fromCms.contact?.businessHours ??
        fallbackSiteConfig.contact.businessHours,
    },
    career: {
      ...fallbackSiteConfig.career,
      ...(fromCms.career ?? {}),
    },
    offices: {
      ...fallbackSiteConfig.offices,
      ...(fromCms.offices ?? {}),
      corporate: {
        ...fallbackSiteConfig.offices.corporate,
        ...(fromCms.offices?.corporate ?? {}),
      },
    },
    links: {
      ...fallbackSiteConfig.links,
      ...(fromCms.links ?? {}),
    },
    social: {
      ...fallbackSiteConfig.social,
      ...(fromCms.social ?? {}),
    },
    // Inventory API stays on the cars backend — never override from CMS.
    apiUrl: fallbackSiteConfig.apiUrl,
  };
}

export async function getCmsNavbars(): Promise<CmsNavbar[]> {
  const data = await fetchCms<CmsNavbar[] | CmsNavbar>(`/public/navbars`);
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
}

export async function getCmsSliders(): Promise<CmsSlider[]> {
  const data = await fetchCms<CmsSlider[] | CmsSlider>(`/public/sliders`);
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
}

export async function getCmsMenuItems(): Promise<CmsMenuItem[]> {
  const data = await fetchCms<CmsMenuItem[] | CmsMenuItem>(`/public/menuitems`);
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
}

export async function getCmsMenus(): Promise<CmsMenu[]> {
  const data = await fetchCms<CmsMenu[] | CmsMenu>(`/public/menus`);
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
}

export async function getCmsMenu(id: number): Promise<CmsMenu | null> {
  return fetchCms<CmsMenu>(`/public/menus/${id}`);
}

export async function getCmsFollowUsMenu(): Promise<CmsMenu | null> {
  const homePage = await getCmsPage("home");
  const fromHome = menuFromPageBody(homePage, "Follow Us");
  if (fromHome) return fromHome;

  const settings = await getCmsSiteSettings();
  const menuId = settings.follow_us?.menu_id;

  if (menuId) {
    const menu = await getCmsMenu(menuId);
    if (menu) return menu;
  }

  const menus = await getCmsMenus();
  return menus.find((menu) => menu.name === "Follow Us") ?? null;
}

export async function getCmsFollowUsLabel(): Promise<string> {
  const [homePage, settings] = await Promise.all([
    getCmsPage("home"),
    getCmsSiteSettings(),
  ]);

  return (
    followUsLabelFromPage(homePage) ??
    settings.follow_us?.label ??
    "Follow Us"
  );
}

export async function getCmsFooters(): Promise<CmsFooter[]> {
  const data = await fetchCms<CmsFooter[] | CmsFooter>(`/public/footers`);
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
}

export async function getCmsFooter(): Promise<CmsFooter | null> {
  return pickCmsFooter(await getCmsFooters());
}

export async function getCmsFormBuilder(id: number): Promise<CmsFormBuilder | null> {
  return fetchCms<CmsFormBuilder>(`/public/form_builder/${id}`);
}

export function formBuilderFromPage(page: CmsPage | null): CmsFormBuilder | null {
  if (!page?.body || !Array.isArray(page.body)) return null;

  for (const section of page.body as { data?: unknown[] }[]) {
    for (const component of section.data ?? []) {
      const c = component as {
        type?: string;
        data?: CmsFormBuilder & { formId?: number };
      };
      if (c.type === "form" && c.data?.elements) {
        return {
          id: c.data.formId ?? c.data.id,
          title: c.data.title,
          description: c.data.description,
          attributes: c.data.attributes,
          elements: c.data.elements,
        };
      }
    }
  }

  return null;
}

export function menuFromPageBody(
  page: CmsPage | null,
  menuName?: string,
): CmsMenu | null {
  if (!page?.body || !Array.isArray(page.body)) return null;

  for (const section of page.body as { data?: unknown[] }[]) {
    for (const component of section.data ?? []) {
      const c = component as {
        type?: string;
        id?: number;
        _headless?: CmsMenu;
      };
      if (c.type !== "menu") continue;

      const resolved = page.menus_headless?.find(
        (menu) =>
          menu.id === c.id && (!menuName || menu.name === menuName),
      );
      if (resolved) return resolved;

      const embedded = c._headless;
      if (embedded && (!menuName || embedded.name === menuName)) {
        return embedded;
      }
    }
  }

  if (menuName && page.menus_headless?.length) {
    return page.menus_headless.find((menu) => menu.name === menuName) ?? null;
  }

  return null;
}

export function followUsLabelFromPage(page: CmsPage | null): string | null {
  const additional = page?.additional as
    | { follow_us?: { label?: string } }
    | null
    | undefined;

  if (additional?.follow_us?.label) {
    return additional.follow_us.label;
  }

  if (!page?.body || !Array.isArray(page.body)) return null;

  for (const section of page.body as { _id?: string; data?: unknown[] }[]) {
    if (section._id !== "section-home-follow-us") continue;

    for (const component of section.data ?? []) {
      const c = component as {
        type?: string;
        value?: string;
        _headless?: { text?: string };
      };
      if (c.type === "title") {
        return c._headless?.text ?? c.value ?? null;
      }
    }
  }

  return null;
}

export type CmsGoogleMapData = {
  mapUrl?: string;
  embedUrl?: string;
  zoom?: number;
  coordinates?: { lat?: number; lng?: number };
  altTitle?: string;
  markers?: unknown[];
};

export type CmsFindUsContent = {
  eyebrow: string;
  heading: string;
  placeName: string;
  embedUrl: string;
};

function embedUrlFromGoogleMap(map: CmsGoogleMapData | null | undefined): string | null {
  if (!map) return null;
  if (map.embedUrl) return map.embedUrl;

  const lat = map.coordinates?.lat;
  const lng = map.coordinates?.lng;
  if (typeof lat === "number" && typeof lng === "number") {
    const zoom = map.zoom ?? 15;
    return `https://www.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`;
  }

  return null;
}

type CmsFindUsAdditional = {
  find_us?: {
    eyebrow?: string;
    heading?: string;
    placeName?: string;
    embedUrl?: string;
    mapUrl?: string;
    zoom?: number;
    coordinates?: { lat?: number; lng?: number };
  };
};

function sectionHasGoogleMap(section: CmsBodySection): boolean {
  return (section.data ?? []).some(
    (component) => String(component.type ?? "").toLowerCase() === "google-map",
  );
}

export function pageHasGoogleMap(page: CmsPage | null | undefined): boolean {
  if (!page?.body || !Array.isArray(page.body)) return false;
  return (page.body as CmsBodySection[]).some(sectionHasGoogleMap);
}

export function findUsFromSection(
  section: CmsBodySection,
  additional?: CmsFindUsAdditional | null,
): CmsFindUsContent | null {
  if (!sectionHasGoogleMap(section)) return null;

  let eyebrow: string | null = additional?.find_us?.eyebrow ?? null;
  let heading: string | null = additional?.find_us?.heading ?? null;
  let placeName: string | null = additional?.find_us?.placeName ?? null;
  let embedUrl: string | null = additional?.find_us?.embedUrl ?? null;
  let mapFromBody: CmsGoogleMapData | null = null;
  const titles: string[] = [];

  for (const component of section.data ?? []) {
    const type = String(component.type ?? "").toLowerCase();

    if (type === "title") {
      const text = textFromComponent(component);
      if (text) titles.push(text);
    }

    if (type === "google-map") {
      const headless = headlessOf(component) as CmsGoogleMapData | null;
      if (headless) {
        mapFromBody = headless;
        if (!placeName && headless.altTitle) {
          placeName = headless.altTitle;
        }
      }
    }
  }

  if (titles.length >= 1 && !eyebrow) eyebrow = titles[0];
  if (titles.length >= 2 && !heading) heading = titles[1];
  if (titles.length === 1 && !heading) heading = titles[0];

  embedUrl =
    embedUrlFromGoogleMap(mapFromBody) ??
    embedUrl ??
    embedUrlFromGoogleMap(additional?.find_us);

  if (!embedUrl) return null;

  return {
    eyebrow: eyebrow ?? "Find Us",
    heading: heading ?? "Our Location",
    placeName: placeName ?? "Our Location",
    embedUrl,
  };
}

export function findUsFromPage(page: CmsPage | null): CmsFindUsContent | null {
  if (!page?.body || !Array.isArray(page.body)) return null;

  const additional = page.additional as CmsFindUsAdditional | null | undefined;

  for (const section of page.body as CmsBodySection[]) {
    const findUs = findUsFromSection(section, additional);
    if (findUs) return findUs;
  }

  return null;
}

/** Strip CMS menu query params (`?pageId=…`) so nav URLs stay clean. */
export function cleanNavHref(href: string): string {
  if (/^https?:\/\//i.test(href)) return href;
  const [path] = href.split("?");
  return path || href;
}

export function menuPathFromLink(link: string): string {
  if (/^https?:\/\//i.test(link)) return link;
  return cleanNavHref(link);
}

export function pageIdFromMenuLink(link: string): string | null {
  const query = link.includes("?") ? link.split("?")[1] : "";
  if (!query) return null;
  const params = new URLSearchParams(query);
  return params.get("pageId") ?? params.get("page_id");
}

function menuItemsFromSource(
  source?: {
    menu_items?: CmsMenuItem[];
    menu_items_headless?: CmsMenuItem[];
    menu?: CmsMenu & { menu_items_headless?: CmsMenuItem[] };
  } | null,
): CmsMenuItem[] {
  return (
    source?.menu_items ??
    source?.menu_items_headless ??
    source?.menu?.menu_items ??
    source?.menu?.menu_items_headless ??
    []
  );
}

export function menuItemsFromCms(
  menu?: Parameters<typeof menuItemsFromSource>[0],
): {
  href: string;
  label: string;
  external?: boolean;
}[] {
  return menuItemsFromSource(menu)
    .filter((item) => item.link)
    .map((item) => {
      const rawHref = item.link as string;
      const external = /^https?:\/\//i.test(rawHref);
      const href = external ? rawHref : cleanNavHref(rawHref);
      return { href, label: item.title, external };
    });
}

export function navLinksFromNavbars(
  navbars: CmsNavbar[] | CmsNavbar | null | undefined,
): { href: string; label: string }[] {
  const list = !navbars ? [] : Array.isArray(navbars) ? navbars : [navbars];
  const navbar = list[0];
  return menuItemsFromCms(navbar).map(({ href, label }) => ({
    href,
    label,
  }));
}

export function pickCmsFooter(
  footers: CmsFooter[] | CmsFooter | null | undefined,
): CmsFooter | null {
  const list = !footers ? [] : Array.isArray(footers) ? footers : [footers];
  return (
    list.find((f) => f.footer_status !== 0 && f.footer_status !== false) ??
    list[0] ??
    null
  );
}

export type CmsContactPageContent = {
  hero?: { title?: string; subtitle?: string; image?: string };
  help_title?: string;
  help_description?: string;
  form_builder_id?: number;
  office_title?: string;
  office?: {
    name?: string;
    address?: string;
    phone?: string;
    email?: string;
  };
  hours_title?: string;
  businessHours?: { day: string; hours: string }[];
};

export function contactFromPage(page: CmsPage | null): CmsContactPageContent {
  return (page?.additional as CmsContactPageContent | undefined) ?? {};
}

export type CmsAboutContent = {
  hero?: { title?: string; subtitle?: string; image?: string };
  whyBuy?: {
    title?: string;
    intro?: string;
    items?: { icon?: string; title: string; description: string }[];
  };
  brands?: {
    title?: string;
    paragraphs?: string[];
    list?: string[];
    list_label?: string;
  };
  cta?: {
    title?: string;
    description?: string;
    button_label?: string;
    button_href?: string;
  };
};

export function aboutFromPage(page: CmsPage | null): CmsAboutContent {
  return (page?.additional as CmsAboutContent | undefined) ?? {};
}

export type CmsCareerPageContent = {
  hero?: { title?: string; subtitle?: string; image?: string };
  title?: string;
  description?: string;
  email?: string;
  apply_label?: string;
  apply_subject?: string;
  accent_color?: "primary" | "amber";
  images?: { team?: string; desk?: string };
};

export function careerFromPage(page: CmsPage | null): CmsCareerPageContent {
  return (page?.additional as CmsCareerPageContent | undefined) ?? {};
}

export function stripHtml(html: string | undefined | null): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
}

const RESERVED_PAGE_SLUGS = new Set(["home", "site-settings"]);

export function normalizeComponentType(type: unknown): string | null {
  if (!type) return null;
  if (typeof type === "object" && type !== null && "type" in type) {
    return String((type as { type: string }).type).toLowerCase();
  }
  return String(type).toLowerCase();
}

export function searchParamValue(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export function hasCmsPageQueryParams(
  searchParams: Record<string, string | string[] | undefined>,
): boolean {
  return Boolean(
    searchParamValue(searchParams.pageId) ??
      searchParamValue(searchParams.page_id) ??
      searchParamValue(searchParams.pageName) ??
      searchParamValue(searchParams.page_name),
  );
}

async function resolveCmsPageFromMenuPath(
  requestPath: string,
): Promise<CmsPage | null> {
  const menuItems = await getCmsMenuItems();

  for (const item of menuItems) {
    if (!item.link) continue;
    if (menuPathFromLink(item.link) !== requestPath) continue;

    const pageId = pageIdFromMenuLink(item.link);
    if (pageId) {
      const byMenuId = await getCmsPage(pageId);
      if (byMenuId) return byMenuId;
    }
  }

  return null;
}

/** Resolve a CMS page from a navbar/menu URL path and optional query params. */
export async function resolveCmsPageForPath(
  slugParts: string[],
  searchParams: Record<string, string | string[] | undefined> = {},
): Promise<CmsPage | null> {
  const pageId =
    searchParamValue(searchParams.pageId) ??
    searchParamValue(searchParams.page_id);

  if (pageId) {
    const byId = await getCmsPage(pageId);
    if (byId) return byId;
  }

  const lastSegment = slugParts[slugParts.length - 1];
  if (lastSegment && !RESERVED_PAGE_SLUGS.has(lastSegment)) {
    const bySlug = await getCmsPage(lastSegment);
    if (bySlug) return bySlug;
  }

  const requestPath = `/${slugParts.join("/")}`;
  return resolveCmsPageFromMenuPath(requestPath);
}

export function cmsPageFetchKey(page: CmsPage): string {
  return page.slug || String(page.id);
}
