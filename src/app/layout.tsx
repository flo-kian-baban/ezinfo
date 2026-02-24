import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EZinfo | One Tap to Reviews and Everything Else",
  description:
    "EZinfo is an NFC + QR customer touchpoint card. Customers tap or scan, land on your branded page, and leave a Google Review - plus optional surveys, feedback, and contact actions.",
  openGraph: {
    title: "EZinfo | One Tap to Reviews and Everything Else",
    description:
      "NFC + QR touchpoint card for Google Reviews, surveys, feedback, and more.",
    type: "website",
    locale: "en_US",
    siteName: "EZinfo",
  },
  twitter: {
    card: "summary_large_image",
    title: "EZinfo | One Tap to Reviews and Everything Else",
    description:
      "NFC + QR touchpoint card for Google Reviews, surveys, feedback, and more.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}

