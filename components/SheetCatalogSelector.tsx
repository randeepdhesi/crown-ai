"use client";

import { Package, FileText, Layers, Lock, Check } from "lucide-react";
import { useUIState } from "./UIStateProvider";

const SOURCES = [
  { id: "all", label: "All Inventory", Icon: Package, locked: false },
  { id: "newtech", label: "NewTechWood Specs", Icon: FileText, locked: true },
  { id: "cgc", label: "CGC Drywall", Icon: FileText, locked: true },
  { id: "rockwool", label: "ROCKWOOL Guides", Icon: Layers, locked: true },
] as const;

export function SheetCatalogSelector({ onClose }: { onClose: () => void }) {
  const { selectedSource, setSelectedSource } = useUIState();

  return (
    <div className="px-4 pb-8">
      <p className="text-white font-semibold text-base mb-4">Data Source</p>
      <div className="flex flex-col gap-2">
        {SOURCES.map(({ id, label, Icon, locked }) => {
          const isActive = selectedSource === label;
          return (
            <button
              key={id}
              disabled={locked}
              onClick={() => {
                if (!locked) {
                  setSelectedSource(label);
                  onClose();
                }
              }}
              className="flex items-center gap-3 bg-neutral-800/50 rounded-xl px-4 py-3 w-full text-left"
            >
              <Icon
                size={18}
                className={isActive ? "text-crown-gold" : "text-neutral-400"}
              />
              <span
                className={`flex-1 text-sm font-medium ${
                  isActive
                    ? "text-crown-gold"
                    : locked
                    ? "text-neutral-500"
                    : "text-white"
                }`}
              >
                {label}
              </span>
              {locked ? (
                <Lock size={14} className="text-neutral-500" />
              ) : isActive ? (
                <Check size={14} className="text-crown-gold" />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
