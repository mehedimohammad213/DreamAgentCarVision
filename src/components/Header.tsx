"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { Menu, Phone, Search, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { fetchCmsBrowser } from "@/lib/cms-browser";
import { navLinksFromNavbars, type CmsNavbar } from "@/lib/cms";
import { cn } from "@/lib/utils";

export type NavLink = { href: string; label: string };

const defaultNavLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/cars", label: "Inventory" },
  { href: "/about", label: "About" },
  { href: "/career", label: "Career" },
  { href: "/contact", label: "Contact" },
];

const searchableRoutes = [
  { href: "/", label: "Home", keywords: ["home", "main"] },
  { href: "/cars", label: "Inventory", keywords: ["inventory", "cars", "auto", "vehicle", "browse"] },
  { href: "/about", label: "About", keywords: ["about", "company", "us"] },
  { href: "/career", label: "Career", keywords: ["career", "jobs", "internship", "hiring", "work"] },
  { href: "/contact", label: "Contact", keywords: ["contact", "phone", "email", "reach"] },
];

function isActiveLink(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function navLinkClasses(pathname: string, href: string, variant: "desktop" | "mobile") {
  const active = isActiveLink(pathname, href);

  if (variant === "desktop") {
    return cn(
      "relative px-3.5 py-2 text-sm font-bold transition-colors",
      active
        ? "text-primary after:absolute after:bottom-0 after:left-1/2 after:h-1.5 after:w-1.5 after:-translate-x-1/2 after:rounded-full after:bg-primary after:content-['']"
        : "text-foreground/80 hover:text-primary",
    );
  }

  return cn(
    "rounded-lg px-3 py-2.5 text-sm font-bold transition-colors",
    active ? "text-primary" : "text-muted hover:text-primary",
  );
}

function filterRoutes(query: string, routes: NavLink[]) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  const catalog = routes.map((route) => {
    const defaults = searchableRoutes.find((r) => r.href === route.href);
    return {
      ...route,
      keywords: defaults?.keywords ?? [route.label.toLowerCase()],
    };
  });

  return catalog.filter((route) => {
    const labelMatch = route.label.toLowerCase().includes(normalized);
    const hrefMatch = route.href.toLowerCase().includes(normalized);
    const keywordMatch = route.keywords.some(
      (keyword) => keyword.includes(normalized) || normalized.includes(keyword),
    );
    return labelMatch || hrefMatch || keywordMatch;
  });
}

type HeaderProps = {
  navLinks?: NavLink[];
  phone?: string;
  logo?: string;
  siteName?: string;
};

export default function Header({
  navLinks: initialNavLinks = defaultNavLinks,
  phone = siteConfig.contact.phone,
  logo: initialLogo = siteConfig.logo,
  siteName = siteConfig.name,
}: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [navLinks, setNavLinks] = useState<NavLink[]>(initialNavLinks);
  const [logo, setLogo] = useState(initialLogo);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const searchResults = useMemo(
    () => filterRoutes(searchQuery, navLinks),
    [searchQuery, navLinks],
  );

  useEffect(() => {
    let cancelled = false;

    async function loadNavbars() {
      const data = await fetchCmsBrowser<CmsNavbar[] | CmsNavbar>(
        "/public/navbars",
      );
      if (cancelled || !data) return;

      const links = navLinksFromNavbars(data);
      if (links.length > 0) setNavLinks(links);

      const navbar = Array.isArray(data) ? data[0] : data;
      const logoPath = navbar?.logo?.file_path;
      if (logoPath) setLogo(logoPath);
    }

    void loadNavbars();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        closeSearch();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchOpen]);

  function closeSearch() {
    setSearchOpen(false);
    setSearchQuery("");
  }

  function navigateToRoute(href: string) {
    router.push(href);
    closeSearch();
    setMobileOpen(false);
  }

  function handleSearchKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      closeSearch();
    }
    if (e.key === "Enter" && searchResults.length > 0) {
      e.preventDefault();
      navigateToRoute(searchResults[0].href);
    }
  }

  function SearchPanel({ className }: { className?: string }) {
    return (
      <div className={cn("rounded-sm border border-border bg-white p-4 shadow-lg", className)}>
        <input
          ref={searchInputRef}
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          placeholder="Search pages..."
          aria-label="Search pages"
          className="w-full border border-primary/30 px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary"
        />

        {searchQuery.trim() && (
          <div className="mt-4">
            <p className="text-sm text-muted">Search Results ...</p>
            <ul className="mt-2">
              {searchResults.length > 0 ? (
                searchResults.map((route) => (
                  <li key={route.href}>
                    <button
                      type="button"
                      onClick={() => navigateToRoute(route.href)}
                      className="block w-full py-1.5 text-left text-sm font-bold text-foreground transition-colors hover:text-primary"
                    >
                      {route.label}
                    </button>
                  </li>
                ))
              ) : (
                <li className="py-1.5 text-sm text-muted">No results found</li>
              )}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:h-20 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logo}
            alt={siteName}
            fetchPriority="high"
            className="h-12 w-auto max-w-[min(100vw-7rem,420px)] sm:h-14 md:h-16"
          />
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex xl:gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={navLinkClasses(pathname, link.href, "desktop")}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex xl:gap-4">
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="flex items-center gap-2 text-sm font-bold text-foreground/80 transition-colors hover:text-primary"
          >
            <Phone className="h-4 w-4 stroke-[2.5]" />
            <span className="hidden xl:inline">{phone}</span>
          </a>

          <div ref={searchContainerRef} className="relative">
            <button
              type="button"
              onClick={() => setSearchOpen((open) => !open)}
              aria-label={searchOpen ? "Close search" : "Open search"}
              aria-expanded={searchOpen}
              className={cn(
                "rounded-lg p-2 transition-colors",
                searchOpen ? "text-primary" : "text-foreground/80 hover:text-primary",
              )}
            >
              <Search className="h-5 w-5 stroke-[2.5]" />
            </button>

            {searchOpen && (
              <SearchPanel className="absolute right-0 top-full z-50 mt-2 w-72 sm:w-80" />
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="rounded-lg p-2 text-foreground/80 transition-colors hover:text-primary"
            aria-label={`Call ${phone}`}
          >
            <Phone className="h-5 w-5 stroke-[2.5]" />
          </a>
          <button
            type="button"
            className="rounded-lg p-2 text-muted"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6 stroke-[2.5]" /> : <Menu className="h-6 w-6 stroke-[2.5]" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-white px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={navLinkClasses(pathname, link.href, "mobile")}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-bold text-foreground/80 transition-colors hover:text-primary"
            >
              <Phone className="h-4 w-4 stroke-[2.5]" />
              {phone}
            </a>
            <div className="mt-2">
              <SearchPanel />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
