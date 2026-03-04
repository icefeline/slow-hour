import type { Metadata, Viewport } from "next";
import { Reenie_Beanie, VT323 } from "next/font/google";
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

export const metadata: Metadata = {
  title: "slow hour",
  description: "one card. one moment. one day.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "slow hour",
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
        <meta name="apple-mobile-web-app-title" content="slow hour" />
      </head>
      <body className={`${reenieBeanie.variable} ${vt323.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
