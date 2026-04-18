"use client";

import { ChevronRight, SlidersHorizontal, Brain, Sparkles, Phone, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NewsPage() {
  const router = useRouter();

  return (
    <div className="min-h-dvh bg-neutral-900">
      <div className="max-w-2xl mx-auto w-full px-4 py-6">

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-white font-semibold text-lg">Your Business AI Operator</h1>
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
                <p className="text-white text-sm font-semibold mb-1">Instant Document Generation</p>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  Speak to generate quotes, proposals, and invoices on the spot. Formatted and ready to send without any typing or templates.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 — Your Ultimate Internal AI Operator */}
          <div className="bg-neutral-800 rounded-xl px-4 py-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Brain size={18} className="text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold mb-1">One System, Every Answer</p>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  Your ERP, CRM, email, and product data all in one place. Your team gets instant answers without digging through tabs or waiting on colleagues.
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
                <p className="text-white text-sm font-semibold mb-1">Built for Your Business</p>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  Every operator is custom-built for your industry, your tools, and your team. No generic software, just a system that knows your operation inside out.
                </p>
              </div>
            </div>
          </div>

          {/* Card 4 — Contact Randeep */}
          <div className="bg-neutral-800 rounded-xl px-4 py-5">
            <p className="text-white text-sm font-semibold mb-0.5">Randeep Dhesi</p>
            <p className="text-neutral-500 text-xs mb-4">604-348-9097</p>
            <div className="flex gap-2.5">
              <a
                href="tel:+16043489097"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-neutral-700 hover:bg-crown-gold/15 border border-neutral-600 hover:border-crown-gold/40 text-neutral-200 hover:text-crown-gold text-xs font-semibold uppercase tracking-wide transition-colors"
              >
                <Phone size={13} />
                Call
              </a>
              <a
                href="sms:+16043489097"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-neutral-700 hover:bg-crown-gold/15 border border-neutral-600 hover:border-crown-gold/40 text-neutral-200 hover:text-crown-gold text-xs font-semibold uppercase tracking-wide transition-colors"
              >
                <MessageSquare size={13} />
                Text
              </a>
            </div>
          </div>

          {/* Industry section */}
          <p className="text-crown-gold text-xs uppercase tracking-widest font-semibold mt-2">
            Built for the Best in the Industry
          </p>
          <div className="flex flex-wrap gap-2">
            {["Building Supply", "Construction", "Distribution", "Manufacturing", "Wholesale", "Real Estate", "Professional Services", "Trucking & Logistics"].map((industry) => (
              <span
                key={industry}
                className="text-neutral-400 text-xs bg-neutral-800 border border-neutral-700 px-3 py-1.5 rounded-full"
              >
                {industry}
              </span>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
