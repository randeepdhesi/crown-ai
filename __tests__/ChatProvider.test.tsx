import { renderHook } from "@testing-library/react";
import { ChatProvider, useChatContext } from "@/components/ChatProvider";

jest.mock("ai/react", () => ({
  useChat: () => ({
    messages: [],
    input: "",
    handleInputChange: jest.fn(),
    handleSubmit: jest.fn(),
    isLoading: false,
    append: jest.fn(),
    setMessages: jest.fn(),
    setInput: jest.fn(),
  }),
}));

describe("ChatProvider", () => {
  it("exposes all required context values", () => {
    const { result } = renderHook(() => useChatContext(), { wrapper: ChatProvider });
    expect(result.current.messages).toEqual([]);
    expect(typeof result.current.input).toBe("string");
    expect(typeof result.current.handleSubmit).toBe("function");
    expect(typeof result.current.handleInputChange).toBe("function");
    expect(typeof result.current.append).toBe("function");
    expect(typeof result.current.setMessages).toBe("function");
    expect(typeof result.current.setInput).toBe("function");
    expect(typeof result.current.toggleListening).toBe("function");
    expect(typeof result.current.isSpeechSupported).toBe("boolean");
    expect(typeof result.current.isListening).toBe("boolean");
    expect(typeof result.current.clearChat).toBe("function");
  });

  it("isSpeechSupported is false in jsdom (no SpeechRecognition)", () => {
    const { result } = renderHook(() => useChatContext(), { wrapper: ChatProvider });
    expect(result.current.isSpeechSupported).toBe(false);
  });

  it("throws when used outside provider", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() => {
      renderHook(() => useChatContext());
    }).toThrow("useChatContext must be used within ChatProvider");
    spy.mockRestore();
  });
});
