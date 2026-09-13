import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header, { type NavLink } from "@/components/Header";
import Footer from "@/components/Footer";
import FollowUsSidebar from "@/components/FollowUsSidebar";
import { siteConfig } from "@/config/site";
import {
  getCmsFooter,
  getCmsNavbars,
  getCmsSiteSettings,
  navLinksFromNavbars,
} from "@/lib/cms";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCmsSiteSettings();

  return {
    title: {
      default: `${settings.name} | ${settings.tagline}`,
      template: `%s | ${settings.name}`,
    },
    description: settings.description,
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
        { url: "/favicon-48x48.png", type: "image/png", sizes: "48x48" },
      ],
      apple: "/apple-touch-icon.png",
    },
  };
}

const fallbackNav: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/cars", label: "Inventory" },
  { href: "/about", label: "About" },
  { href: "/career", label: "Career" },
  { href: "/contact", label: "Contact" },
];

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, navbars, footer] = await Promise.all([
    getCmsSiteSettings(),
    getCmsNavbars(),
    getCmsFooter(),
  ]);

  const fromNav = navLinksFromNavbars(navbars);
  const navLinks: NavLink[] = fromNav.length > 0 ? fromNav : fallbackNav;
  const logo =
    navbars[0]?.logo?.file_path || settings.logo || siteConfig.logo;

  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Header
          navLinks={navLinks}
          phone={settings.contact.phone}
          logo={logo}
          siteName={settings.name}
        />
        <FollowUsSidebar />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} initialFooter={footer} />
      </body>
    </html>
  );
}
