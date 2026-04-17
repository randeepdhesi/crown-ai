"use client";

import { useRef, useState } from "react";

type UploadState = "idle" | "uploading" | "done";

export default function CatalogPage() {
  const [state, setState] = useState<UploadState>("idle");
  const [fileName, setFileName] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setState("uploading");
    setTimeout(() => setState("done"), 1800);
  }

  function handleReset() {
    setState("idle");
    setFileName("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.xlsx,.xls,.json,.pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      {state === "idle" && (
        <>
          <h1 className="text-white font-semibold text-lg mb-2">Catalog</h1>
          <p className="text-neutral-400 text-sm max-w-xs leading-relaxed mb-6">
            Connect your inventory data to start querying specs, pricing, and availability.
          </p>
          <button
            onClick={() => inputRef.current?.click()}
            className="bg-[#b3874b] hover:bg-[#96703d] text-black text-sm font-semibold px-6 py-2.5 rounded-full transition-colors"
          >
            Upload Catalog
          </button>
        </>
      )}

      {state === "uploading" && (
        <>
          <h1 className="text-white font-semibold text-lg mb-2">Uploading…</h1>
          <p className="text-neutral-400 text-sm max-w-xs mb-6 truncate">{fileName}</p>
          <div className="flex gap-1.5 items-center">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-2 h-2 rounded-full bg-[#b3874b] animate-pulse"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
        </>
      )}

      {state === "done" && (
        <>
          <div className="w-12 h-12 rounded-full bg-emerald-500/15 flex items-center justify-center mb-4">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="text-white font-semibold text-lg mb-1">Catalog Uploaded</h1>
          <p className="text-neutral-400 text-sm max-w-xs mb-1 truncate">{fileName}</p>
          <p className="text-neutral-500 text-xs mb-6">Ready to query</p>
          <button
            onClick={handleReset}
            className="text-xs text-neutral-400 hover:text-neutral-300 underline underline-offset-2 transition-colors"
          >
            Upload another
          </button>
        </>
      )}
    </div>
  );
}
