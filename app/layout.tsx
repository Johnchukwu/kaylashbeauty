import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Parisienne } from "next/font/google";
import "./globals.css";

const serif = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const script = Parisienne({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "Kaylash Beauty Place | Lipgloss & Lip Care",
  description: "High-shine lipgloss and nourishing lip care made for every shade of you.",
  openGraph: {
    title: "Kaylash Beauty Place",
    description: "Shine in every shade.",
    images: [{ url: "/og.png", width: 1730, height: 909, alt: "Kaylash Beauty Place lipgloss collection" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kaylash Beauty Place",
    description: "Shine in every shade.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${serif.variable} ${sans.variable} ${script.variable}`}>{children}</body>
    </html>
  );
}
