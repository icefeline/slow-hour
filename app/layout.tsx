import type { Metadata } from "next";
import { Reenie_Beanie } from "next/font/google";
import "./globals.css";

const reenieBeanie = Reenie_Beanie({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-reenie-beanie',
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
      <body className={`${reenieBeanie.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
