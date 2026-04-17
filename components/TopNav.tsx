"use client";

import { usePathname, useRouter } from "next/navigation";
import { UserCircle, Newspaper, MessageCircle, Grid2x2 } from "lucide-react";
import { useUIState } from "./UIStateProvider";

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { setOpenSheet } = useUIState();

  const isChatActive = pathname === "/";
  const isCatalogActive = pathname === "/catalog";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-neutral-950/80 backdrop-blur-sm border-b border-white/5">
      <div className="flex items-center justify-between h-full w-full max-w-2xl mx-auto px-4">
        {/* Left: Profile → opens Settings sheet */}
        <button
          onClick={() => setOpenSheet("settings")}
          className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center"
          aria-label="Settings"
        >
          <UserCircle size={18} className="text-neutral-300" />
        </button>

        {/* Center: Chat / Catalog toggle */}
        <div className="bg-neutral-800/60 rounded-full p-1 flex gap-1">
          <button
            onClick={() => router.push("/")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              isChatActive ? "bg-neutral-700 text-white" : "text-neutral-400"
            }`}
          >
            <MessageCircle size={14} />
            Chat
          </button>
          <button
            onClick={() => router.push("/catalog")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              isCatalogActive ? "bg-neutral-700 text-white" : "text-neutral-400"
            }`}
          >
            <Grid2x2 size={14} />
            Catalog
          </button>
        </div>

        {/* Right: News */}
        <button
          onClick={() => router.push("/news")}
          className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center"
          aria-label="News"
        >
          <Newspaper size={18} className="text-neutral-300" />
        </button>
      </div>
    </header>
  );
}
