import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Zap, Copy, ThumbsUp, ThumbsDown, RotateCcw } from "lucide-react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}

interface ChatViewProps {
  conversation: Conversation | null;
  onSendMessage: (content: string) => void;
  isLoading: boolean;
}

const SUGGESTED_PROMPTS = [
  "Bu ay elektrik tüketim raporunu özetle",
  "Fatura verilerini analiz et ve tasarruf önerileri sun",
  "Bakım takvimi için hatırlatıcı oluştur",
  "Teknik rapor şablonu hazırla",
];

function MessageBubble({ message }: { message: Message }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex gap-3 group ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{
          background: isUser ? "#0B1F3A" : "linear-gradient(135deg, #E8841A, #F5A93A)",
        }}
      >
        {isUser ? (
          <User size={14} color="white" />
        ) : (
          <img src="/SIPAlogo.png?v=2" alt="SIPA" className="w-5 h-5 object-contain" />
        )}
      </div>

      {/* Bubble */}
      <div className={`flex flex-col max-w-[78%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          className="px-4 py-3 rounded-2xl text-sm leading-relaxed"
          style={{
            background: isUser ? "#0B1F3A" : "#ffffff",
            color: isUser ? "#ffffff" : "#0B1F3A",
            borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
            boxShadow: isUser ? "none" : "0 1px 4px rgba(11,31,58,0.08)",
            border: isUser ? "none" : "1px solid rgba(11,31,58,0.08)",
            whiteSpace: "pre-wrap",
          }}
        >
          {message.content}
        </div>

        {/* Actions */}
        <div
          className={`flex items-center gap-1 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity ${
            isUser ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <span className="text-xs mr-1" style={{ color: "#8AAAC8" }}>
            {message.timestamp.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
          </span>
          {!isUser && (
            <>
              <button
                onClick={handleCopy}
                className="p-1 rounded-md transition-colors"
                style={{ color: copied ? "#E8841A" : "#8AAAC8" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#E8841A")}
                onMouseLeave={(e) => (e.currentTarget.style.color = copied ? "#E8841A" : "#8AAAC8")}
                title="Kopyala"
              >
                <Copy size={12} />
              </button>
              <button
                className="p-1 rounded-md transition-colors"
                style={{ color: "#8AAAC8" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#22c55e")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#8AAAC8")}
                title="Beğen"
              >
                <ThumbsUp size={12} />
              </button>
              <button
                className="p-1 rounded-md transition-colors"
                style={{ color: "#8AAAC8" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#8AAAC8")}
                title="Beğenme"
              >
                <ThumbsDown size={12} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: "linear-gradient(135deg, #E8841A, #F5A93A)" }}
      >
        <img src="/SIPAlogo.png?v=2" alt="SIPA" className="w-5 h-5 object-contain" />
      </div>
      <div
        className="px-4 py-3 rounded-2xl"
        style={{
          background: "#ffffff",
          border: "1px solid rgba(11,31,58,0.08)",
          borderRadius: "18px 18px 18px 4px",
        }}
      >
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="inline-block w-1.5 h-1.5 rounded-full animate-bounce"
              style={{ background: "#E8841A", animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ChatView({ conversation, onSendMessage, isLoading }: ChatViewProps) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages, isLoading]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    setInput("");
    onSendMessage(trimmed);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
  };

  const isEmpty = !conversation || conversation.messages.length === 0;

  return (
    <div className="flex flex-col h-full" style={{ background: "#F4F6FA" }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-6 py-4 flex-shrink-0"
        style={{ background: "#ffffff", borderBottom: "1px solid rgba(11,31,58,0.08)" }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #E8841A, #F5A93A)" }}
        >
          <img src="/SIPAlogo.png?v=2" alt="SIPA" className="w-5 h-5 object-contain" />
        </div>
        <div>
          <h2 className="text-sm" style={{ color: "#0B1F3A", fontWeight: 600 }}>
            SIPA Asistan
          </h2>
          <div className="flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#22c55e", display: "inline-block" }}
            />
            <span className="text-xs" style={{ color: "#5A6880" }}>
              Çevrimiçi
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-6 py-6 space-y-5"
        style={{ scrollbarWidth: "none" }}
      >
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: "linear-gradient(135deg, #0B1F3A, #1A4A7A)" }}
            >
              <img src="/SIPAlogo.png?v=2" alt="SIPA" className="w-10 h-10 object-contain" />
            </div>
            <h3 className="mb-2" style={{ color: "#0B1F3A", fontWeight: 600 }}>
              SIPA'ya Hoş Geldiniz
            </h3>
            <p className="text-sm max-w-sm mb-8" style={{ color: "#5A6880" }}>
              İstanbul Enerji yapay zeka asistanı. Belgelerinizi analiz edin, raporlar oluşturun ve anlık destek alın.
            </p>
            <div className="grid grid-cols-2 gap-3 w-full max-w-md">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => onSendMessage(prompt)}
                  className="text-left px-4 py-3 rounded-xl text-sm transition-all"
                  style={{
                    background: "#ffffff",
                    color: "#0B1F3A",
                    border: "1px solid rgba(11,31,58,0.1)",
                    fontWeight: 400,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#E8841A";
                    e.currentTarget.style.background = "#FFF8F2";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(11,31,58,0.1)";
                    e.currentTarget.style.background = "#ffffff";
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {conversation.messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isLoading && <TypingIndicator />}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div
        className="flex-shrink-0 px-6 py-4"
        style={{ background: "#ffffff", borderTop: "1px solid rgba(11,31,58,0.08)" }}
      >
        <div
          className="flex items-end gap-3 rounded-2xl px-4 py-3"
          style={{ background: "#F4F6FA", border: "1px solid rgba(11,31,58,0.12)" }}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Neye ihtiyacınız vardı?"
            className="flex-1 bg-transparent outline-none resize-none text-sm leading-relaxed"
            style={{
              color: "#0B1F3A",
              minHeight: "24px",
              maxHeight: "160px",
              scrollbarWidth: "none",
            }}
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
            style={{
              background: input.trim() && !isLoading ? "#E8841A" : "rgba(11,31,58,0.1)",
              color: input.trim() && !isLoading ? "#ffffff" : "#8AAAC8",
              cursor: input.trim() && !isLoading ? "pointer" : "not-allowed",
            }}
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-center text-xs mt-2" style={{ color: "#8AAAC8" }}>
          SIPA bir yapay zeka asistanı, hataları olabilir. Önemli bilgileri doğrulayın.
        </p>
      </div>
    </div>
  );
}
