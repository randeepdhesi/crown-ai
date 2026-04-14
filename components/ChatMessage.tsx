"use client";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

function renderWithSwatches(content: string): string {
  return content.replace(/\[#([0-9a-fA-F]{6})\]/g, (_, hex) =>
    `<span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:#${hex};border:1px solid rgba(0,0,0,0.15);vertical-align:middle;margin:0 3px 1px 2px;flex-shrink:0;"></span>`
  );
}

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={`flex gap-3 animate-fade-in ${isUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      <div className="flex-shrink-0 mt-1">
        {isUser ? (
          <div className="w-8 h-8 rounded-full bg-crown-charcoal flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f5f3f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-crown-gold/10 flex items-center justify-center">
            <svg width="18" height="15" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 14L0 8L4 2L7 7L10 0L13 7L16 2L20 8L20 14Z" fill="#b3874b"/>
              <rect x="0" y="14" width="20" height="2" rx="1" fill="#b3874b"/>
            </svg>
          </div>
        )}
      </div>

      {/* Message bubble */}
      <div
        className={`max-w-[90%] rounded-2xl px-5 py-4 ${
          isUser
            ? "bg-crown-charcoal text-white rounded-tr-md"
            : "bg-white text-crown-charcoal shadow-sm border-l-[3px] border-crown-gold rounded-tl-md"
        }`}
      >
        {isUser ? (
          <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{content}</p>
        ) : (
          <div className="message-content text-sm sm:text-base leading-relaxed">
            <ReactMarkdown
              rehypePlugins={[rehypeRaw]}
              components={{
                table: ({ children }) => (
                  <div className="table-wrapper">
                    <table>{children}</table>
                  </div>
                ),
              }}
            >
              {renderWithSwatches(content)}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
