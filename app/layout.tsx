import type { Metadata, Viewport } from "next";
import { Reenie_Beanie, VT323, Instrument_Serif, DM_Mono, BIZ_UDMincho } from "next/font/google";
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

const dmMono = DM_Mono({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  variable: '--font-dm-mono',
});

const bizUdMincho = BIZ_UDMincho({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-biz-udmincho',
});

const instrumentSerif = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-instrument-serif',
});


export const metadata: Metadata = {
  // Required for Open Graph: without it Next emits relative image paths, which
  // most link scrapers refuse to resolve, so the preview silently shows nothing.
  metadataBase: new URL("https://slowww.garden"),
  title: "slow garden",
  description: "one card. one moment. one day.",
  manifest: "/manifest.webmanifest",
  // Declared here rather than as <link>s in <head> so Next owns the tags and
  // they can't drift from the manifest. The spec sheet's 01 · original is the
  // single installed icon on every platform; maskable-512 carries the 80% safe
  // zone for Android's mask.
  icons: {
    icon: [
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-180.png", sizes: "180x180", type: "image/png" }],
  },
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
        {/* the design system's background, matching the manifest's theme_color */}
        <meta name="theme-color" content="#172211" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="slow garden" />
      </head>
      <body className={`${reenieBeanie.variable} ${vt323.variable} ${instrumentSerif.variable} ${dmMono.variable} ${bizUdMincho.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
