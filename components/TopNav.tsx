"use client";

import { usePathname, useRouter } from "next/navigation";
import { UserCircle, Newspaper, MessageCircle, Grid2x2, Settings } from "lucide-react";
import { useUIState } from "./UIStateProvider";

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { openSheet, setOpenSheet } = useUIState();

  const isOnProfile = pathname === "/profile";

  const isChatActive = pathname === "/";
  const isCatalogActive = pathname === "/catalog";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur-sm border-b border-white/5" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
      <div className="flex items-center justify-between h-14 w-full px-4">
        {/* Left: Profile nav or Settings toggle when on /profile */}
        <button
          onClick={() =>
            isOnProfile
              ? setOpenSheet(openSheet === "settings" ? null : "settings")
              : router.push("/profile")
          }
          className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center transition-colors"
          aria-label={isOnProfile ? "Settings" : "Profile"}
        >
          {isOnProfile ? (
            <Settings size={18} className="text-neutral-300" />
          ) : (
            <UserCircle size={18} className="text-neutral-300" />
          )}
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

        {/* Right: News toggle */}
        <button
          onClick={() => router.push(pathname === "/news" ? "/" : "/news")}
          className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center transition-colors"
          aria-label="News"
        >
          <Newspaper size={18} className="text-neutral-300" />
        </button>
      </div>
    </header>
  );
}
