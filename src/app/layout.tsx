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
  title: "Pray Slovenia",
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lora:ital,wght@0,400;0,500;1,400&family=Source+Sans+3:wght@300;400;500&display=swap" rel="stylesheet" />
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
        <main>{children}</main>
        <footer className="px-6 py-8 text-center font-sans text-[13px] text-mist">
          Pray Slovenia · Lifting up a nation in prayer
          <Link href="/admin" className="mt-2 block text-xs hover:text-ivory">Admin</Link>
        </footer>
      </body>
    </html>
  );
}
