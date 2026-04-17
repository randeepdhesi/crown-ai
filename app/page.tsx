"use client";

import { useRef, useEffect } from "react";
import { useChatContext } from "@/components/ChatProvider";
import ChatMessage from "@/components/ChatMessage";
import TypingIndicator from "@/components/TypingIndicator";
import SuggestedQuestions from "@/components/SuggestedQuestions";
import CrownLogo from "@/components/CrownLogo";

export default function Home() {
  const { messages, isLoading, append } = useChatContext();
  const mainRef = useRef<HTMLDivElement>(null);
  const lastUserMsgRef = useRef<HTMLDivElement>(null);
  const prevLastUserMsgIdRef = useRef<string | undefined>(undefined);

  const hasMessages = messages.length > 0;
  const showTypingIndicator =
    isLoading && messages[messages.length - 1]?.role === "user";

  const lastUserMsgId = messages.filter((m) => m.role === "user").at(-1)?.id;
  const lastAssistantMsgId = messages.at(-1)?.role === "assistant"
    ? messages.at(-1)?.id
    : undefined;

  // On new user message: scroll it to near the top of the viewport
  useEffect(() => {
    if (!lastUserMsgId || lastUserMsgId === prevLastUserMsgIdRef.current) return;
    prevLastUserMsgIdRef.current = lastUserMsgId;

    requestAnimationFrame(() => {
      const el = lastUserMsgRef.current;
      const container = mainRef.current;
      if (!el || !container) return;
      const top = el.offsetTop - container.offsetTop - 16;
      container.scrollTo({ top, behavior: "smooth" });
    });
  }, [lastUserMsgId]);

  // Reset scroll when conversation is cleared
  useEffect(() => {
    if (hasMessages) return;
    const reset = () => {
      if (mainRef.current) mainRef.current.scrollTop = 0;
    };
    window.visualViewport?.addEventListener("resize", reset);
    return () => window.visualViewport?.removeEventListener("resize", reset);
  }, [hasMessages]);

  return (
    <div
      ref={mainRef}
      className={`chat-scroll h-[calc(100dvh-152px)] ${hasMessages ? "overflow-y-auto" : "overflow-hidden"}`}
    >
      <div className="max-w-2xl mx-auto px-4 py-3 sm:py-6">
        {!hasMessages ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="flex flex-col items-center gap-2">
              <CrownLogo size={200} className="w-[140px] sm:w-[200px] h-auto" />
              <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-crown-gold">
                Crown Building Supplies
              </p>
              <h2 className="text-lg md:text-xl font-medium text-white mt-3">
                Welcome to Crown AI
              </h2>
              <p className="text-sm text-neutral-400 text-center max-w-sm mt-1 mb-3">
                Your intelligent product assistant for pricing,<br />
                specs, colors, and availability.
              </p>
            </div>
            <div className="mt-4 w-full">
              <SuggestedQuestions
                onSelect={(q) => append({ role: "user", content: q })}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                isStreaming={isLoading && msg.id === lastAssistantMsgId}
                scrollRef={msg.id === lastUserMsgId ? lastUserMsgRef : undefined}
              />
            ))}
            {showTypingIndicator && <TypingIndicator />}
          </div>
        )}
      </div>
    </div>
  );
}
