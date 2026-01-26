import type { Metadata } from "next";
import { Reenie_Beanie, VT323 } from "next/font/google";
import "./globals.css";

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
  title: "slow hour - one card",
  description: "one card. one moment. one day.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${reenieBeanie.variable} ${vt323.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
