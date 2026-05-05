import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User } from "lucide-react";

interface ChatMessage {
  role: "user" | "bot";
  content: string;
}

const GREETING = `Hello! Welcome to EP BRAND. I'm your AI assistant. How can I help you today?

You can ask me about:
- Our products and collections
- Sizes and fit guide
- Shipping and returns
- Order status
- Or anything else!`;

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "bot", content: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getBotResponse = (userMessage: string): string => {
    const lower = userMessage.toLowerCase();

    if (lower.includes("price") || lower.includes("cost") || lower.includes("rs")) {
      return "Our T-shirts range from Rs. 699 to Rs. 1499. We offer premium quality at affordable prices. Check out our Shop page for current prices and discounts!";
    }
    if (lower.includes("size") || lower.includes("fit")) {
      return "We offer sizes from S to XXL. Our Oversized collection has a relaxed, boxy fit, while our Plain and Casual collections have a regular fit. Check the size guide on each product page!";
    }
    if (lower.includes("ship") || lower.includes("delivery")) {
      return "We offer free shipping on orders over Rs. 2000. Delivery typically takes 3-5 business days within Gujarat and 5-7 days for other states.";
    }
    if (lower.includes("return") || lower.includes("exchange")) {
      return "We have a 7-day hassle-free return policy. If you're not satisfied with your purchase, you can return it within 7 days for a full refund or exchange.";
    }
    if (lower.includes("order") || lower.includes("track")) {
      return "You can track your order by contacting us on WhatsApp at +91 9173832830 with your order number. We'll update you on the status right away!";
    }
    if (lower.includes("material") || lower.includes("fabric") || lower.includes("cotton")) {
      return "All our T-shirts are made from 100% organic cotton. They're pre-shrunk, garment-washed for softness, and feature reinforced seams for durability.";
    }
    if (lower.includes("discount") || lower.includes("sale") || lower.includes("offer")) {
      return "We regularly run sales and promotions! Subscribe to our newsletter for exclusive discount codes and early access to sales. Current discounts are visible on product cards with the 'Sale' badge.";
    }
    if (lower.includes("contact") || lower.includes("phone") || lower.includes("whatsapp")) {
      return "You can reach us at +91 9727930374 (call) or +91 9173832830 (WhatsApp). Our address is Kadiyabid, Bhavnagar, Gujarat, India. Visit our Contact page for more details!";
    }
    if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
      return "Hello there! Welcome to EP BRAND. How can I assist you today?";
    }
    if (lower.includes("thank")) {
      return "You're welcome! If you have any other questions, feel free to ask. Happy shopping!";
    }

    return "That's a great question! I'd be happy to help. Could you provide a bit more detail, or you can reach out to our team directly on WhatsApp at +91 9173832830 for personalized assistance.";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = getBotResponse(userMsg);
      setMessages((prev) => [...prev, { role: "bot", content: botResponse }]);
      setIsTyping(false);
    }, 600 + Math.random() * 400);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-6 z-50 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:bg-black/80 transition-colors"
          title="AI Assistant"
        >
          <Bot className="w-5 h-5" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] h-[480px] bg-white border border-black/10 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="bg-black text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <div>
                <p className="text-sm font-medium">EP Assistant</p>
                <p className="text-[10px] text-white/60">AI Powered</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 ${
                  msg.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`w-7 h-7 flex-shrink-0 flex items-center justify-center ${
                    msg.role === "bot" ? "bg-black/5" : "bg-black"
                  }`}
                >
                  {msg.role === "bot" ? (
                    <Bot className="w-4 h-4 text-black/60" />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] p-3 text-sm leading-relaxed ${
                    msg.role === "bot"
                      ? "bg-[#f3f3f3] text-black"
                      : "bg-black text-white"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2">
                <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center bg-black/5">
                  <Bot className="w-4 h-4 text-black/60" />
                </div>
                <div className="bg-[#f3f3f3] p-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-black/20 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-black/20 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-black/20 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-black/10 p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 bg-[#f3f3f3] border-0 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              />
              <button
                onClick={handleSend}
                className="p-2 bg-black text-white hover:bg-black/80 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
