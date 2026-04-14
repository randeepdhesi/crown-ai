"use client";

const suggestions = [
  "What colors does the Norwegian Fluted siding come in?",
  "What's the price on 16-foot Belgian Fluted boards?",
  "What trim pieces do I need for NewTechWood siding?",
  "Do you carry ROCKWOOL insulation?",
  "What scaffolding options are available?",
  "Which Crown locations are in Alberta?",
];

interface Props {
  onSelect: (question: string) => void;
}

export default function SuggestedQuestions({ onSelect }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl mx-auto">
      {suggestions.map((q, i) => (
        <button
          key={i}
          onClick={() => onSelect(q)}
          className="text-left text-sm px-3 py-2 sm:px-4 sm:py-3 rounded-xl border border-crown-gold/20
                     bg-white hover:border-crown-gold/50 hover:bg-crown-gold/5
                     transition-all duration-200 text-crown-charcoal/80
                     hover:text-crown-charcoal group"
        >
          <span className="text-crown-gold mr-2 group-hover:mr-3 transition-all">→</span>
          {q}
        </button>
      ))}
    </div>
  );
}
