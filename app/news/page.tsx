"use client";

import { ChevronRight, SlidersHorizontal, Brain, Sparkles, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NewsPage() {
  const router = useRouter();

  return (
    <div className="min-h-dvh bg-neutral-900">
      <div className="max-w-2xl mx-auto w-full px-4 py-6">

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-white font-semibold text-lg">Your Business AI Assistant</h1>
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center transition-colors flex-shrink-0"
            aria-label="Go back"
          >
            <ChevronRight size={18} className="text-neutral-300" />
          </button>
        </div>

        <div className="flex flex-col gap-3">

          {/* Card 1 — Voice-Powered AI Documents */}
          <div className="bg-neutral-800 rounded-xl px-4 py-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles size={18} className="text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold mb-1">Voice-Powered AI Documents</p>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  Just speak to the app to instantly auto-generate proposals, bids, quotes, and
                  invoices. It handles the formatting and emails them directly to your clients
                  from wherever you are.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 — Your Ultimate Internal Assistant */}
          <div className="bg-neutral-800 rounded-xl px-4 py-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Brain size={18} className="text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold mb-1">Your Ultimate Internal Assistant</p>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  Connect your ERP, CRM, emails, and internal docs into one intelligent hub. It
                  knows your business inside and out, ensuring your team never hits a roadblock or
                  wastes time hunting for answers.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3 — Custom For Your Operations */}
          <div className="bg-neutral-800 rounded-xl px-4 py-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: "rgba(179,135,75,0.12)" }}>
                <SlidersHorizontal size={18} className="text-crown-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold mb-1">Custom For Your Operations</p>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  Ready to build a custom AI agent tailored to your exact operations? Let's
                  systemize your business and give your team the ultimate advantage.
                </p>
              </div>
            </div>
          </div>

          {/* Card 4 — Randeep Dhesi */}
          <div className="bg-neutral-800 rounded-xl px-4 py-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <User size={18} className="text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold mb-2">Call / Text Randeep</p>
                <div className="flex flex-row w-full gap-3">
                  <a
                    href="tel:+16043489097"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-neutral-700 hover:border-[#b3874b] bg-neutral-700 hover:bg-[#b3874b]/10 text-sm font-medium transition-colors text-neutral-200"
                  >
                    📞 Call
                  </a>
                  <a
                    href="sms:+16043489097"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-neutral-700 hover:border-[#b3874b] bg-neutral-700 hover:bg-[#b3874b]/10 text-sm font-medium transition-colors text-neutral-200"
                  >
                    💬 Text
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
