"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

type ConnectState = "idle" | "loading" | "connected";

const SOURCES = [
  {
    id: "buildmapper",
    name: "BuildMapper",
    iconBg: "rgba(34,197,94,0.12)",
    iconColor: "#22c55e",
    label: "B",
  },
  {
    id: "gmail",
    name: "Gmail",
    iconBg: "rgba(234,67,53,0.12)",
    iconColor: "#EA4335",
    label: "G",
  },
  {
    id: "gcal",
    name: "Google Calendar",
    iconBg: "rgba(66,133,244,0.12)",
    iconColor: "#4285F4",
    label: "C",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    iconBg: "rgba(37,211,102,0.12)",
    iconColor: "#25D366",
    label: "W",
  },
  {
    id: "epicor",
    name: "Epicor ERP",
    iconBg: "rgba(99,102,241,0.12)",
    iconColor: "#818cf8",
    label: "E",
  },
  {
    id: "spruce",
    name: "Spruce",
    iconBg: "rgba(20,184,166,0.12)",
    iconColor: "#14b8a6",
    label: "S",
  },
];

export default function ProfilePage() {
  const router = useRouter();
  const [states, setStates] = useState<Record<string, ConnectState>>({});

  function handleConnect(id: string) {
    if (states[id] === "connected") return;
    setStates((s) => ({ ...s, [id]: "loading" }));
    setTimeout(() => {
      setStates((s) => ({ ...s, [id]: "connected" }));
    }, 1500);
  }

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
            <span className="text-white text-sm font-semibold">C</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium">Crown AI Demo</p>
            <p className="text-neutral-400 text-xs">demo@crownbuildingsupplies.ca</p>
          </div>
          <ChevronRight size={16} className="text-neutral-400 flex-shrink-0" />
        </div>

        {/* Intelligence Sources section */}
        <p className="text-crown-gold text-xs uppercase tracking-widest font-semibold mb-2">
          Intelligence Sources
        </p>
        <div className="flex flex-col gap-2">
          {SOURCES.map(({ id, name, iconBg, iconColor, label }) => {
            const state = states[id] ?? "idle";
            return (
              <div key={id} className="flex items-center gap-3 bg-neutral-800 rounded-xl px-4 py-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: iconBg }}
                >
                  <span className="text-sm font-bold" style={{ color: iconColor }}>{label}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium">{name}</p>
                  <p className="text-neutral-400 text-xs">
                    {state === "connected" ? "Connected" : "Not connected"}
                  </p>
                </div>
                <button
                  onClick={() => handleConnect(id)}
                  disabled={state === "connected"}
                  className={`text-xs font-medium px-3 py-1 rounded-full flex-shrink-0 min-w-[72px] flex items-center justify-center transition-colors ${
                    state === "connected"
                      ? "text-emerald-400 border border-emerald-400/30 cursor-default"
                      : "text-crown-gold border border-crown-gold/30 hover:bg-crown-gold/10"
                  }`}
                >
                  {state === "loading" ? (
                    <span className="flex gap-[3px] items-center h-4">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="w-1 h-1 rounded-full bg-crown-gold animate-pulse"
                          style={{ animationDelay: `${i * 150}ms` }}
                        />
                      ))}
                    </span>
                  ) : state === "connected" ? (
                    "Connected"
                  ) : (
                    "Connect"
                  )}
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
