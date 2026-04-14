"use client";

import { useState, useRef, useEffect } from "react";
import CrownLogo from "@/components/CrownLogo";
import ChatMessage from "@/components/ChatMessage";
import TypingIndicator from "@/components/TypingIndicator";
import SuggestedQuestions from "@/components/SuggestedQuestions";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height =
        Math.min(inputRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  async function sendMessage(content: string) {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: content.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) throw new Error("Failed to get response");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      setMessages([...newMessages, { role: "assistant", content: "" }]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                assistantContent += parsed.text;
                setMessages([
                  ...newMessages,
                  { role: "assistant", content: assistantContent },
                ]);
              }
            } catch {
              // skip malformed lines
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content:
            "I'm sorry, I ran into an issue processing your request. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-crown-charcoal border-b border-crown-charcoal-light px-4 py-2 sm:py-5 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <h1 className="text-white font-bold text-base sm:text-2xl tracking-tight">
            Crown AI
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-gray-400 text-xs">Online</span>
          </div>
        </div>
      </header>

      {/* Chat area */}
      <main className="flex-1 overflow-y-auto chat-scroll chat-bg">
        <div className="max-w-4xl mx-auto px-4 py-3 sm:py-6">
          {!hasMessages ? (
            /* Welcome screen */
            <div className="flex flex-col items-center justify-center min-h-0 sm:min-h-[60vh] gap-3 sm:gap-6">
              <div className="flex flex-col items-center gap-2 sm:gap-3">
                <CrownLogo size={157} className="w-[70px] sm:w-[157px] h-auto" />
                <h2 className="text-xl sm:text-2xl font-semibold text-crown-charcoal">
                  Welcome to Crown AI
                </h2>
                <p className="text-sm sm:text-base text-gray-500 text-center max-w-md">
                  Your intelligent product assistant. Ask me about building
                  supplies, pricing, specs, colors, and availability across all
                  Crown locations.
                </p>
              </div>
              <SuggestedQuestions onSelect={(q) => sendMessage(q)} />
            </div>
          ) : (
            /* Message list */
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <ChatMessage key={i} role={msg.role} content={msg.content} />
              ))}
              {isLoading &&
                messages[messages.length - 1]?.role === "user" && (
                  <TypingIndicator />
                )}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>
      </main>

      {/* Input area */}
      <footer className="border-t border-gray-200 bg-white px-3 py-2 sm:px-4 sm:py-3">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-2 sm:gap-3 input-glow rounded-xl border border-gray-200 bg-gray-50 px-3 sm:px-4 py-1.5 sm:py-2 transition-all">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about products, pricing, specs, colors..."
              rows={1}
              className="flex-1 bg-transparent resize-none outline-none text-sm text-crown-charcoal placeholder:text-gray-400 py-1.5"
              disabled={isLoading}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isLoading}
              className="flex-shrink-0 w-9 h-9 rounded-lg bg-crown-gold hover:bg-crown-gold-dark
                         disabled:bg-gray-300 disabled:cursor-not-allowed
                         flex items-center justify-center transition-colors"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
          <p className="text-[11px] text-gray-400 text-center mt-2">
            Crown AI may make mistakes. Verify important product details with your branch.
          </p>
        </div>
      </footer>
    </div>
  );
}
