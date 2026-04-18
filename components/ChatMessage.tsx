"use client";

import type { RefObject } from "react";
import { useState } from "react";
import type { Message, ToolInvocation } from "ai";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { Check, Copy, Package, Phone, Send } from "lucide-react";
import { useSmoothStream } from "@/hooks/useSmoothStream";

function renderWithSwatches(content: string): string {
  return content.replace(/\[#([0-9a-fA-F]{6})\]/g, (_, hex) =>
    `<span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:#${hex};border:1px solid rgba(0,0,0,0.15);vertical-align:middle;margin:0 3px 1px 2px;flex-shrink:0;"></span>`
  );
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  inStock: boolean;
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="flex items-center gap-3 bg-neutral-800 rounded-md border-l-[3px] border-crown-gold shadow-sm px-3 py-2.5">
      <div className="flex-shrink-0 w-12 h-12 rounded bg-neutral-700 flex items-center justify-center">
        <Package size={20} className="text-neutral-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{product.name}</p>
        <p className="text-sm font-semibold text-crown-gold">${product.price.toFixed(2)} CAD</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <div
            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
              product.inStock ? "bg-emerald-400" : "bg-red-400"
            }`}
          />
          <span className="text-xs text-neutral-400">
            {product.inStock ? `${product.stock} in stock` : "Out of stock"}
          </span>
        </div>
      </div>
      <button className="flex-shrink-0 text-xs font-medium text-crown-gold border border-crown-gold/40 rounded px-2.5 py-1.5 hover:bg-crown-gold/5 transition-colors whitespace-nowrap">
        View Specs
      </button>
    </div>
  );
}

function ToolResult({ invocation }: { invocation: ToolInvocation }) {
  if (invocation.state !== "result") {
    return (
      <p className="text-xs text-gray-400 italic">Searching catalog…</p>
    );
  }

  const products = invocation.result as Product[];

  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold tracking-widest uppercase text-crown-gold/70">
        Catalog Results
      </p>
      <div className="flex flex-col gap-2">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
  scrollRef?: RefObject<HTMLDivElement>;
  onSend?: () => void;
}

export default function ChatMessage({ message, isStreaming = false, scrollRef, onSend }: ChatMessageProps) {
  const isUser = message.role === "user";
  const smoothContent = useSmoothStream(message.content, !isStreaming);
  const showCallButton = !isUser && !isStreaming && message.content.includes("604-348-9097");
  const isEmailDraft = !isUser && !isStreaming && message.content.includes("Subject:");
  const showActions = !isUser && !isStreaming && !!message.content;
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!isUser && !message.content) return null;

  return (
    <div
      ref={scrollRef}
      className={`flex gap-3 animate-fade-in ${isUser ? "flex-row-reverse" : ""}`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 mt-1">
        {isUser ? (
          <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f5f3f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
            <img src="/icon-192.png" alt="Crown AI" width={32} height={32} className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* Bubble + actions column */}
      <div className="flex flex-col gap-2 max-w-[90%]">
        <div
          className={`rounded-2xl px-5 py-4 ${
            isUser
              ? "bg-neutral-800 text-white rounded-tr-md"
              : "bg-neutral-900 text-neutral-100 shadow-sm border-l-[3px] border-crown-gold rounded-tl-md"
          }`}
        >
          {isUser ? (
            <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          ) : (
            <div className="space-y-3">
              {smoothContent && (
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
                    {renderWithSwatches(smoothContent)}
                  </ReactMarkdown>
                </div>
              )}
              {message.toolInvocations?.map((inv) => (
                <ToolResult key={inv.toolCallId} invocation={inv} />
              ))}
              {showCallButton && (
                <a
                  href="tel:+16043489097"
                  className="inline-flex items-center gap-2 mt-1 px-4 py-2.5 bg-crown-gold text-black font-semibold text-sm rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Phone size={15} />
                  Call Randeep
                </a>
              )}
            </div>
          )}
        </div>

        {/* Action buttons */}
        {showActions && (
          <div className="flex items-center gap-2 px-1">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs text-neutral-600 hover:text-neutral-400 transition-colors"
            >
              {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
              <span className={copied ? "text-emerald-400" : ""}>{copied ? "Copied" : "Copy"}</span>
            </button>

            {isEmailDraft && onSend && (
              <button
                onClick={onSend}
                className="flex items-center gap-1.5 text-xs text-crown-gold border border-crown-gold/30 hover:bg-crown-gold/10 px-3 py-1 rounded-full transition-colors"
              >
                <Send size={11} />
                Send Email
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
