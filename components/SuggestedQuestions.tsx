"use client";

const suggestions = [
  "Generate a quote for 50 sheets of 5/8\" Type X and 200 bags of R22 for Pacific Coast Builders",
  "Check stock on Norwegian Fluted Siding in Teak across all locations",
  "Draft an email to Jim at Pacific Coast about his pending drywall order",
  "Pull up the account for Pacific Coast Builders",
];

interface Props {
  onSelect: (question: string) => void;
}

export default function SuggestedQuestions({ onSelect }: Props) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <p className="text-[11px] font-semibold tracking-widest uppercase text-crown-gold/70 text-center mb-3">
        Try asking
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {suggestions.map((q, i) => (
          <button
            key={i}
            onClick={() => onSelect(q)}
            className="text-left text-sm font-medium px-4 py-3 rounded-xl
                       bg-neutral-800/50 border border-white/5 border-l-[3px] border-l-[#b3874b]
                       hover:bg-neutral-700 transition-all duration-150 text-neutral-200"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
