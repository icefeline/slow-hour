import type { Metadata, Viewport } from "next";
import { Reenie_Beanie, VT323, Instrument_Serif, Gilda_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

const reenieBeanie = Reenie_Beanie({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-reenie-beanie',
});

const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-vt323',
});

const instrumentSerif = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-instrument-serif',
});

const gildaDisplay = Gilda_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-gilda-display',
});

export const metadata: Metadata = {
  // Required for Open Graph: without it Next emits relative image paths, which
  // most link scrapers refuse to resolve, so the preview silently shows nothing.
  metadataBase: new URL("https://slowww.garden"),
  title: "slow garden",
  description: "one card. one moment. one day.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "slow garden",
  },
  openGraph: {
    type: "website",
    siteName: "slow garden",
    title: "slow garden",
    description: "one card. one moment. one day.",
    url: "/",
    // the image itself comes from app/opengraph-image.tsx
  },
  twitter: {
    card: "summary_large_image",
    title: "slow garden",
    description: "one card. one moment. one day.",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#172211" />
        <link rel="apple-touch-icon" href="/icon-512.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icon-512.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="slow garden" />
      </head>
      <body className={`${reenieBeanie.variable} ${vt323.variable} ${instrumentSerif.variable} ${gildaDisplay.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
