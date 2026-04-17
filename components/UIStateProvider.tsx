"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type SheetType = "settings" | "catalog" | null;

interface UIStateContextValue {
  openSheet: SheetType;
  setOpenSheet: (sheet: SheetType) => void;
  selectedSource: string;
  setSelectedSource: (source: string) => void;
}

const UIStateContext = createContext<UIStateContextValue | null>(null);

export function useUIState() {
  const ctx = useContext(UIStateContext);
  if (!ctx) throw new Error("useUIState must be used within UIStateProvider");
  return ctx;
}

export function UIStateProvider({ children }: { children: ReactNode }) {
  const [openSheet, setOpenSheet] = useState<SheetType>(null);
  const [selectedSource, setSelectedSource] = useState("All Inventory");

  return (
    <UIStateContext.Provider value={{ openSheet, setOpenSheet, selectedSource, setSelectedSource }}>
      {children}
    </UIStateContext.Provider>
  );
}
