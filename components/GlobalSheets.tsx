"use client";

import { useUIState } from "./UIStateProvider";
import { BottomSheet } from "./BottomSheet";
import { SheetCatalogSelector } from "./SheetCatalogSelector";
import { SheetSettings } from "./SheetSettings";

export function GlobalSheets() {
  const { openSheet, setOpenSheet } = useUIState();

  return (
    <>
      <BottomSheet isOpen={openSheet === "settings"} onClose={() => setOpenSheet(null)} heightClass="h-[90vh]">
        <SheetSettings onClose={() => setOpenSheet(null)} />
      </BottomSheet>

      <BottomSheet isOpen={openSheet === "catalog"} onClose={() => setOpenSheet(null)} heightClass="h-2/3">
        <SheetCatalogSelector onClose={() => setOpenSheet(null)} />
      </BottomSheet>
    </>
  );
}
