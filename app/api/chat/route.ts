import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { SYSTEM_PROMPT } from "@/lib/system-prompt";

export async function POST(req: Request) {
  const { messages } = await req.json();

  await new Promise((resolve) => setTimeout(resolve, 2000));

  const today = new Date().toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/Vancouver",
  });
  const system = SYSTEM_PROMPT.replace(/\{\{TODAY\}\}/g, today);

  const result = await streamText({
    model: anthropic("claude-sonnet-4-20250514"),
    system,
    messages,
    maxTokens: 2048,
    maxSteps: 3,
    tools: {
      search_catalog: {
        description:
          "Search the Crown Building Supplies product catalog. Use when the user asks about specific products, SKUs, pricing, or stock availability.",
        parameters: z.object({
          query: z
            .string()
            .describe("Product name, category, or SKU to search for"),
        }),
        execute: async ({ query: _query }) => [
          {
            id: "UH61-16",
            name: "Norwegian Fluted Siding 0.9\" × 7.73\" × 16'",
            price: 194.86,
            stock: 42,
            inStock: true,
          },
          {
            id: "UH58-16",
            name: "Belgian Fluted Siding 0.9\" × 7.73\" × 16'",
            price: 194.86,
            stock: 18,
            inStock: true,
          },
          {
            id: "UH67-16",
            name: "Shiplap Siding 0.5\" × 5.5\" × 16'",
            price: 61.05,
            stock: 0,
            inStock: false,
          },
        ],
      },
    },
  });

  return result.toDataStreamResponse();
}
