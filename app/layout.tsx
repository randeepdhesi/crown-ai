import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ChatProvider } from "@/components/ChatProvider";
import { UIStateProvider } from "@/components/UIStateProvider";
import { TopNav } from "@/components/TopNav";
import { FloatingInput } from "@/components/FloatingInput";
import { PageTransitionWrapper } from "@/components/PageTransitionWrapper";

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
      <body className="min-h-screen bg-neutral-950">
        <ChatProvider>
          <UIStateProvider>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
              <TopNav />
              <PageTransitionWrapper>{children}</PageTransitionWrapper>
              <FloatingInput />
            </ThemeProvider>
          </UIStateProvider>
        </ChatProvider>
      </body>
    </html>
  );
}
