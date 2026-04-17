"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";

interface ToggleProps {
  on: boolean;
  onToggle: () => void;
}

function Toggle({ on, onToggle }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full transition-colors duration-200 ${
        on ? "bg-[#b3874b]" : "bg-neutral-600"
      }`}
    >
      {/* Track is 44px wide, dot is 20px. Off: 2px from left. On: 22px from left → 2px from right. */}
      <span
        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ease-in-out mt-[2px] ${
          on ? "translate-x-[22px]" : "translate-x-[2px]"
        }`}
      />
    </button>
  );
}

export function SheetSettings({ onClose: _ }: { onClose: () => void }) {
  const [notifications, setNotifications] = useState(true);
  const [dataRetention, setDataRetention] = useState(false);

  return (
    <div className="px-4 pb-8">
      <p className="text-white font-semibold text-base mb-6">Settings</p>

      {/* Preferences section */}
      <p className="text-crown-gold text-xs uppercase tracking-widest font-semibold mb-2">
        Preferences
      </p>
      <div className="flex flex-col gap-2 mb-6">

        {/* Notifications — toggle */}
        <div className="flex items-center gap-3 bg-neutral-800/50 rounded-xl px-4 py-3">
          <div className="flex-1">
            <p className="text-white text-sm font-medium">Notifications</p>
            <p className="text-neutral-400 text-xs">Manage your alerts</p>
          </div>
          <Toggle on={notifications} onToggle={() => setNotifications((v) => !v)} />
        </div>

        {/* Theme — chevron */}
        <button className="flex items-center gap-3 bg-neutral-800/50 rounded-xl px-4 py-3 w-full text-left">
          <div className="flex-1">
            <p className="text-white text-sm font-medium">Theme</p>
            <p className="text-neutral-400 text-xs">System Default</p>
          </div>
          <ChevronRight size={16} className="text-neutral-400 flex-shrink-0" />
        </button>

        {/* Data Retention — toggle */}
        <div className="flex items-center gap-3 bg-neutral-800/50 rounded-xl px-4 py-3">
          <div className="flex-1">
            <p className="text-white text-sm font-medium">Data Retention</p>
            <p className="text-neutral-400 text-xs">Use queries to improve AI</p>
          </div>
          <Toggle on={dataRetention} onToggle={() => setDataRetention((v) => !v)} />
        </div>

        {/* Voice Input — chevron */}
        <button className="flex items-center gap-3 bg-neutral-800/50 rounded-xl px-4 py-3 w-full text-left">
          <div className="flex-1">
            <p className="text-white text-sm font-medium">Voice Input</p>
            <p className="text-neutral-400 text-xs">Manage language and speed</p>
          </div>
          <ChevronRight size={16} className="text-neutral-400 flex-shrink-0" />
        </button>

        {/* Export History — chevron */}
        <button className="flex items-center gap-3 bg-neutral-800/50 rounded-xl px-4 py-3 w-full text-left">
          <div className="flex-1">
            <p className="text-white text-sm font-medium">Export History</p>
            <p className="text-neutral-400 text-xs">Download your chat logs</p>
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
