"use client";

import { ChevronLeft, Brain, Sparkles, Handshake } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NewsPage() {
  const router = useRouter();

  return (
    <div className="min-h-dvh bg-neutral-900">
      <div className="max-w-2xl mx-auto w-full px-4 py-6">

        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center transition-colors flex-shrink-0"
            aria-label="Go back"
          >
            <ChevronLeft size={18} className="text-neutral-300" />
          </button>
          <h1 className="text-white font-semibold text-lg">Why Custom AI?</h1>
        </div>

        <div className="flex flex-col gap-3">

          {/* Card 1 — Knowledge Hub */}
          <div className="bg-neutral-800 rounded-xl px-4 py-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: "rgba(179,135,75,0.12)" }}>
                <Brain size={18} className="text-crown-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold mb-1">Your Ultimate Internal Assistant</p>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  Connect your ERP, CRM, emails, and internal docs into one intelligent hub. It knows
                  your business inside and out, ensuring your team never hits a roadblock or wastes
                  time hunting for answers.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 — Speed Factor */}
          <div className="bg-neutral-800 rounded-xl px-4 py-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles size={18} className="text-blue-400" />
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

          {/* Card 3 — CTA */}
          <div className="bg-neutral-800 rounded-xl px-4 py-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Handshake size={18} className="text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold mb-1">Deploy This For Your Team</p>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  Ready to build a custom AI agent tailored to your exact operations? Get in touch
                  with Randeep Dhesi to productize your business.
                </p>
                <div className="flex flex-col gap-2 mt-4">
                  <a
                    href="tel:+16043489097"
                    className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-full border border-neutral-700 hover:border-[#b3874b] bg-neutral-800/50 hover:bg-[#b3874b]/10 text-sm transition-colors text-neutral-200"
                  >
                    📱 Call / Text: +1 (604) 348-9097
                  </a>
                  <a
                    href="mailto:randeep@buildmapper.com"
                    className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-full border border-neutral-700 hover:border-[#b3874b] bg-neutral-800/50 hover:bg-[#b3874b]/10 text-sm transition-colors text-neutral-200"
                  >
                    ✉️ randeep@buildmapper.com
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
