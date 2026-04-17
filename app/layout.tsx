import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ChatProvider } from "@/components/ChatProvider";
import { UIStateProvider } from "@/components/UIStateProvider";
import { TopNav } from "@/components/TopNav";
import { FloatingInput } from "@/components/FloatingInput";
import { GlobalSheets } from "@/components/GlobalSheets";
import { PageTransitionWrapper } from "@/components/PageTransitionWrapper";
import SplashScreen from "@/components/SplashScreen";

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
  icons: { icon: "/icon-192.png", apple: "/icon-192.png" },
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
        {/* iOS splash screens */}
        <link rel="apple-touch-startup-image" href="/splash-1290x2796.png" media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/splash-1179x2556.png" media="(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/splash-1284x2778.png" media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/splash-1170x2532.png" media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/splash-1125x2436.png" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/splash-750x1334.png"  media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" />
      </head>
      <body className="min-h-screen bg-neutral-950 overflow-x-hidden">
        <SplashScreen />
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
