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

  const hasMessages = messages.length > 0;
  const showTypingIndicator =
    isLoading && messages[messages.length - 1]?.role === "user";

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = mainRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div
      ref={mainRef}
      className="overflow-y-auto chat-scroll h-[calc(100dvh-152px)]"
    >
      <div className="max-w-2xl mx-auto px-4 py-3 sm:py-6">
        {!hasMessages ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 sm:gap-6">
            <div className="flex flex-col items-center gap-2 sm:gap-3">
              <CrownLogo size={157} className="w-[105px] sm:w-[157px] h-auto" />
              <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-crown-gold">
                Crown Building Supplies
              </p>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Welcome to Crown AI
              </h2>
              <p className="text-sm sm:text-base text-neutral-400 text-center max-w-sm">
                Your intelligent product assistant for pricing, specs, colors,
                and availability.
              </p>
            </div>
            <SuggestedQuestions
              onSelect={(q) => append({ role: "user", content: q })}
            />
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {showTypingIndicator && <TypingIndicator />}
          </div>
        )}
      </div>
    </div>
  );
}
