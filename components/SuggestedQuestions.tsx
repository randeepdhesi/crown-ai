"use client";

const suggestions = [
  "Colors for Norwegian Fluted siding?",
  "Price on 16ft Belgian Fluted boards?",
  "Trim pieces for NewTechWood siding?",
  "Do you carry ROCKWOOL insulation?",
  "What scaffolding options do you carry?",
  "Which Crown locations are in Alberta?",
];

interface Props {
  onSelect: (question: string) => void;
}

export default function SuggestedQuestions({ onSelect }: Props) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <p className="text-[11px] font-semibold tracking-widest uppercase text-crown-gold/70 text-center mb-2">
        Try asking
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
        {suggestions.map((q, i) => (
          <button
            key={i}
            onClick={() => onSelect(q)}
            className="text-left text-sm font-medium px-3 py-2.5 sm:px-4 sm:py-3
                       rounded-lg border border-crown-gold/25 border-l-[3px] border-l-crown-gold
                       bg-neutral-900 hover:bg-neutral-800 hover:border-crown-gold/50
                       transition-all duration-150 text-neutral-200"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
