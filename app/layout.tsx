import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ChatProvider } from "@/components/ChatProvider";
import { UIStateProvider } from "@/components/UIStateProvider";
import { TopNav } from "@/components/TopNav";
import { FloatingInput } from "@/components/FloatingInput";
import { GlobalSheets } from "@/components/GlobalSheets";
import { PageTransitionWrapper } from "@/components/PageTransitionWrapper";

export const viewport: Viewport = {
  themeColor: "#1a1a1a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Crown AI — Crown Building Supplies",
  description:
    "Your intelligent building supplies assistant. Ask about products, pricing, specs, and more.",
  manifest: "/manifest.json",
  icons: { icon: "/favicon.svg", apple: "/icon-192.png" },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Crown AI",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-screen bg-neutral-950 overflow-x-hidden">
        <ChatProvider>
          <UIStateProvider>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
              <TopNav />
              <PageTransitionWrapper>{children}</PageTransitionWrapper>
              <FloatingInput />
              <GlobalSheets />
            </ThemeProvider>
          </UIStateProvider>
        </ChatProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js');`,
          }}
        />
      </body>
    </html>
  );
}
