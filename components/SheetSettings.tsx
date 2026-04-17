"use client";

import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUIState } from "./UIStateProvider";

export function SheetSettings({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const { setOpenSheet } = useUIState();

  function navigateToProfile() {
    setOpenSheet(null);
    router.push("/profile");
  }

  return (
    <div className="px-4 pb-8">
      <p className="text-white font-semibold text-base mb-6">Settings</p>

      {/* Account section */}
      <p className="text-crown-gold text-xs uppercase tracking-widest font-semibold mb-2">
        Account
      </p>
      <button
        onClick={navigateToProfile}
        className="flex items-center gap-3 bg-neutral-800/50 rounded-xl px-4 py-3 w-full text-left mb-6"
      >
        <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-semibold">R</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium">Randeep Dhesi</p>
          <p className="text-neutral-400 text-xs">randeep@buildmapper.com</p>
        </div>
        <ChevronRight size={16} className="text-neutral-400 flex-shrink-0" />
      </button>

      {/* Preferences section */}
      <p className="text-crown-gold text-xs uppercase tracking-widest font-semibold mb-2">
        Preferences
      </p>
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center gap-3 bg-neutral-800/50 rounded-xl px-4 py-3">
          <div className="flex-1">
            <p className="text-white text-sm font-medium">Notifications</p>
            <p className="text-neutral-400 text-xs">Manage alerts</p>
          </div>
          {/* Static toggle indicator — no real state wired */}
          <div className="w-10 h-6 bg-neutral-600 rounded-full relative flex-shrink-0">
            <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1" />
          </div>
        </div>
        <button className="flex items-center gap-3 bg-neutral-800/50 rounded-xl px-4 py-3 w-full text-left">
          <div className="flex-1">
            <p className="text-white text-sm font-medium">Language</p>
            <p className="text-neutral-400 text-xs">English</p>
          </div>
          <ChevronRight size={16} className="text-neutral-400 flex-shrink-0" />
        </button>
      </div>

      {/* Danger section */}
      <button className="flex items-center gap-3 bg-neutral-800/50 rounded-xl px-4 py-3 w-full text-left">
        <span className="text-red-500 text-sm font-medium">Log Out</span>
      </button>
    </div>
  );
}
