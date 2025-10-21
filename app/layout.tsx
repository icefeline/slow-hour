import type { Metadata } from "next";
import { Reenie_Beanie } from "next/font/google";
import "./globals.css";

const reenieBeanie = Reenie_Beanie({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-reenie-beanie',
});

export const metadata: Metadata = {
  title: "Daily Tarot - Your Daily Card Reading",
  description: "Discover your daily tarot card and reflect on its wisdom",
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
