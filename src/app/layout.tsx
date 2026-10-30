import type { Metadata, Viewport } from "next";
import { Figtree, Newsreader } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import SplashHider from "./splash-hider";
import TabBar from "@/components/TabBar";

const newsreader = Newsreader({
  subsets: ["latin", "latin-ext"],
  axes: ["opsz"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
});

const figtree = Figtree({
  subsets: ["latin", "latin-ext"],
  variable: "--font-figtree",
});

export const metadata: Metadata = {
  title: { default: "Pray Slovenia", template: "%s · Pray Slovenia" },
  description: "Join believers around the world in praying for Slovenia.",
};

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: "#0C1322",
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${newsreader.variable} ${figtree.variable}`}>
      <head>
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Pray Slovenia" />
      </head>
      <body>
        <SplashHider />
        <TabBar />
        <main className="flex flex-1 flex-col">{children}</main>
        <footer className="px-6 py-8 text-center font-sans text-[13px] text-mist">
          Pray Slovenia · Lifting up a nation in prayer
          <Link href="/admin" className="mt-2 block text-xs transition-colors hover:text-ivory">Admin</Link>
        </footer>
      </body>
    </html>
  );
}
