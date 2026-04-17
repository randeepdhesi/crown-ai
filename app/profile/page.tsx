"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  return (
    <div className="min-h-dvh bg-neutral-900">
      <div className="max-w-2xl mx-auto w-full px-4 py-6">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center transition-colors flex-shrink-0"
            aria-label="Go back"
          >
            <ChevronLeft size={18} className="text-neutral-300" />
          </button>
          <h1 className="text-white font-semibold text-lg">Profile</h1>
        </div>

        {/* Account section */}
        <p className="text-crown-gold text-xs uppercase tracking-widest font-semibold mb-2">
          Account
        </p>
        <div className="flex items-center gap-3 bg-neutral-800 rounded-xl px-4 py-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-semibold">R</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium">Randeep Dhesi</p>
            <p className="text-neutral-400 text-xs">randeep@buildmapper.com</p>
          </div>
          <ChevronRight size={16} className="text-neutral-400 flex-shrink-0" />
        </div>

        {/* Intelligence Sources section */}
        <p className="text-crown-gold text-xs uppercase tracking-widest font-semibold mb-2">
          Intelligence Sources
        </p>
        <div className="flex flex-col gap-2">

          {/* WhatsApp */}
          <div className="flex items-center gap-3 bg-neutral-800 rounded-xl px-4 py-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "rgba(37,211,102,0.12)" }}>
              <span className="text-sm font-bold" style={{ color: "#25D366" }}>W</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium">WhatsApp</p>
              <p className="text-neutral-400 text-xs">Not connected</p>
            </div>
            <button className="text-xs font-medium px-3 py-1 rounded-full flex-shrink-0 text-crown-gold border border-crown-gold/30 hover:bg-crown-gold/10 transition-colors">
              Connect
            </button>
          </div>

          {/* Gmail */}
          <div className="flex items-center gap-3 bg-neutral-800 rounded-xl px-4 py-3">
            <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
              <span className="text-red-400 text-sm font-bold">G</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium">Gmail</p>
              <p className="text-neutral-400 text-xs">Not connected</p>
            </div>
            <button className="text-xs font-medium px-3 py-1 rounded-full flex-shrink-0 text-crown-gold border border-crown-gold/30 hover:bg-crown-gold/10 transition-colors">
              Connect
            </button>
          </div>

          {/* HubSpot */}
          <div className="flex items-center gap-3 bg-neutral-800 rounded-xl px-4 py-3">
            <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
              <span className="text-orange-400 text-sm font-bold">H</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium">HubSpot</p>
              <p className="text-neutral-400 text-xs">Not connected</p>
            </div>
            <button className="text-xs font-medium px-3 py-1 rounded-full flex-shrink-0 text-crown-gold border border-crown-gold/30 hover:bg-crown-gold/10 transition-colors">
              Connect
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
