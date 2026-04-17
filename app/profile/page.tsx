"use client";

import { Settings } from "lucide-react";
import { useUIState } from "@/components/UIStateProvider";

export default function ProfilePage() {
  const { setOpenSheet } = useUIState();

  return (
    <div className="w-full">
      {/* Gear at top-left */}
      <div className="px-4 pt-4 pb-2">
        <button
          onClick={() => setOpenSheet("settings")}
          className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center transition-colors"
          aria-label="Open settings"
        >
          <Settings size={18} className="text-neutral-300" />
        </button>
      </div>

      <div className="max-w-2xl mx-auto w-full px-4 py-4">
        <h1 className="text-2xl font-bold text-white mb-2">Profile</h1>
        <p className="text-neutral-400 text-sm">Profile management coming soon.</p>
      </div>
    </div>
  );
}
