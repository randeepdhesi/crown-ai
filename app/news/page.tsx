"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NewsPage() {
  const router = useRouter();

  return (
    <div className="min-h-dvh bg-neutral-900">
      <div className="max-w-2xl mx-auto w-full px-4 py-6">

        {/* Header — back + title grouped left */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center transition-colors flex-shrink-0"
            aria-label="Go back"
          >
            <ChevronLeft size={18} className="text-neutral-300" />
          </button>
          <h1 className="text-white font-semibold text-lg">Updates</h1>
        </div>

        {/* Feed */}
        <div className="flex flex-col gap-3">

          {/* Welcome card */}
          <div className="bg-neutral-800 rounded-xl px-4 py-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: "rgba(179,135,75,0.12)" }}>
                <span className="text-crown-gold text-base leading-none">✦</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold mb-1">Welcome to Crown AI</p>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  This is your demo environment. Explore product queries, pricing,
                  and catalog lookups powered by Crown Building Supplies' real inventory.
                </p>
                <p className="text-neutral-500 text-xs mt-2">Today</p>
              </div>
            </div>
          </div>

          {/* Feature Update card */}
          <div className="bg-neutral-800 rounded-xl px-4 py-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-400 text-sm leading-none">⚡</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-white text-sm font-semibold">Feature Update: Live Quoting</p>
                  <span className="text-[10px] text-blue-400 border border-blue-400/30 px-2 py-0.5 rounded-full font-medium flex-shrink-0">
                    New
                  </span>
                </div>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  Crown AI can now generate draft quotes based on your conversation.
                  Ask for pricing on any product to get started.
                </p>
                <p className="text-neutral-500 text-xs mt-2">2 hours ago</p>
              </div>
            </div>
          </div>

          {/* New Catalog card */}
          <div className="bg-neutral-800 rounded-xl px-4 py-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-emerald-400 text-sm leading-none">📦</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold mb-1">New Catalog: NewTechWood 2025</p>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  The 2025 NewTechWood composite siding line is now in Crown AI —
                  Shou Sugi Ban, Norwegian Fluted, Belgian Fluted, and 4 new colorways.
                </p>
                <p className="text-neutral-500 text-xs mt-2">1 day ago</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
