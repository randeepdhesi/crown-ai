import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Crown AI — Crown Building Supplies",
  description:
    "Your intelligent building supplies assistant. Ask about products, pricing, specs, and more.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-neutral-950">{children}</body>
    </html>
  );
}
