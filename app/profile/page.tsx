"use client";

import { Settings } from "lucide-react";
import { useUIState } from "@/components/UIStateProvider";

export default function ProfilePage() {
  const { setOpenSheet } = useUIState();

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <button
          onClick={() => setOpenSheet("settings")}
          className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center transition-colors"
          aria-label="Open settings"
        >
          <Settings size={18} className="text-neutral-300" />
        </button>
      </div>
      <p className="text-neutral-400 text-sm">Profile management coming soon.</p>
    </div>
  );
}
