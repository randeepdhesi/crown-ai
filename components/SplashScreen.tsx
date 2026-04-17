"use client";

import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [phase, setPhase] = useState<"in" | "hold" | "out" | "done">("in");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 400);
    const t2 = setTimeout(() => setPhase("out"), 1500);
    const t3 = setTimeout(() => setPhase("done"), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#1a1a1a]"
      style={{ transition: "opacity 0.5s ease", opacity: phase === "out" ? 0 : 1 }}
    >
      <div
        style={{
          transition: "opacity 0.4s ease, transform 0.4s ease",
          opacity: phase === "in" ? 0 : 1,
          transform: phase === "in" ? "scale(0.85)" : "scale(1)",
        }}
        className="flex flex-col items-center gap-5"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icon-512.png" alt="Crown AI" width={100} height={100} className="rounded-2xl" />
        <div className="flex flex-col items-center gap-1">
          <span className="text-white text-2xl font-bold tracking-tight">Crown AI</span>
          <span className="text-[#b3874b] text-xs font-medium tracking-widest uppercase">Crown Building Supplies</span>
        </div>
      </div>
    </div>
  );
}
