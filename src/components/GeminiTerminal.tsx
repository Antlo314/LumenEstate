"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import gsap from "gsap";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface GeminiTerminalProps {
  onClose: () => void;
  initialPrompt?: string;
}

export default function GeminiTerminal({ onClose, initialPrompt }: GeminiTerminalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "SYSTEM INITIALIZED. I am the Predictive Deal Engine. Please input an address, deal context, or request a specific strategic module (e.g. 'Calculate MAO for 123 Main St with $50k repairs and $300k ARV' or 'Draft an LOI for a Subject-To acquisition').",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  // GSAP Entrance Animation
  useEffect(() => {
    if (terminalRef.current) {
      gsap.fromTo(
        terminalRef.current,
        { opacity: 0, scale: 0.95, filter: "blur(10px)" },
        { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.8, ease: "power3.out" }
      );
    }
  }, []);

  // Handle Initial Prompt (e.g., from Dashboard Search)
  useEffect(() => {
    if (initialPrompt && !initialized.current) {
      initialized.current = true;
      setInput(initialPrompt);
      // We must use a slight timeout to let state settle before auto-submit if doing it directly
      setTimeout(() => {
        executeCommand(initialPrompt);
      }, 500);
    }
  }, [initialPrompt]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const executeCommand = async (commandText: string) => {
    if (!commandText.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: commandText };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/engine/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setMessages((prev) => [...prev, data]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: `**ERROR:** ${data.error}` }]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: "**SYSTEM FAILURE:** Could not connect to the intelligence core." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(input);
  };

  const handleSaveTarget = async () => {
    // Try to extract an address from the messages if possible, or just ask the user.
    // For MVP, we save the last user prompt as the 'address' if it contains 'Analyze the property at'
    const lastUserMsg = messages.filter(m => m.role === "user").pop()?.content || "Unknown Property";
    let addressToSave = lastUserMsg;
    if (addressToSave.includes("Analyze the property at")) {
      addressToSave = addressToSave.replace("Analyze the property at ", "").replace(" for acquisition viability and provide the 70% rule MAO.", "");
    }

    setIsSaving(true);
    try {
      await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: addressToSave })
      });
      setMessages(prev => [...prev, { role: "assistant", content: `✅ **SUCCESS**: Target [${addressToSave}] has been written to the Local Ledger.` }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: `❌ **ERROR**: Failed to write to Ledger.` }]);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 sm:p-8">
      <div 
        ref={terminalRef}
        className="w-full max-w-5xl h-full max-h-[90vh] bg-[#0A0A0A]/95 border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative"
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>

        {/* Header */}
        <div className="flex justify-between items-center px-8 py-5 border-b border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse shadow-[0_0_8px_#D4AF37]"></span>
            <span className="font-[family-name:var(--font-playfair)] text-[#E5E4E2] text-lg tracking-wide italic">Lumen Intelligence Core</span>
          </div>
          <div className="flex gap-6 items-center">
            {messages.length > 2 && (
              <button 
                onClick={handleSaveTarget}
                disabled={isSaving}
                className="text-[#D4AF37] hover:text-[#0A0A0A] border border-[#D4AF37]/30 hover:bg-[#D4AF37] font-medium text-xs tracking-widest uppercase transition-all px-4 py-2 rounded-full"
              >
                Save Target to Ledger
              </button>
            )}
            <button 
              onClick={onClose}
              className="text-white/40 hover:text-[#D4AF37] text-sm tracking-widest uppercase transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8 font-[family-name:var(--font-outfit)] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex flex-col max-w-[85%] ${msg.role === "user" ? "self-end items-end" : "self-start items-start"}`}>
              <span className={`text-[10px] tracking-widest uppercase mb-2 ${msg.role === "user" ? "text-white/40" : "text-[#D4AF37]/80"}`}>
                {msg.role === "user" ? "Client Query" : "Lumen Core"}
              </span>
              <div className={`p-6 rounded-2xl text-sm leading-relaxed ${msg.role === "user" ? "bg-white/5 border border-white/10 text-[#F5F5F5] rounded-tr-sm" : "bg-gradient-to-br from-[#D4AF37]/5 to-transparent border border-[#D4AF37]/10 text-[#E5E4E2] rounded-tl-sm shadow-[0_4px_20px_rgba(212,175,55,0.02)]"}`}>
                <div className="prose prose-invert prose-sm max-w-none prose-p:leading-loose prose-p:text-[#E5E4E2]/90 prose-headings:font-[family-name:var(--font-playfair)] prose-headings:text-[#D4AF37] prose-headings:font-normal prose-a:text-[#D4AF37] prose-strong:text-white prose-table:border-collapse prose-th:border-b prose-th:border-[#D4AF37]/20 prose-th:p-4 prose-th:text-left prose-th:font-medium prose-th:text-[#D4AF37] prose-td:border-b prose-td:border-white/5 prose-td:p-4">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="self-start flex items-center gap-3 text-[#D4AF37] text-xs tracking-widest uppercase mt-4">
              <span className="w-4 h-4 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin"></span> Processing Asset...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-white/5 bg-[#0A0A0A]/90">
          <form onSubmit={handleSubmit} className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter instructions for the intelligence core..."
              className="flex-1 bg-white/5 border border-white/10 rounded-full text-[#F5F5F5] font-light text-sm px-6 py-4 focus:outline-none focus:border-[#D4AF37]/50 transition-colors placeholder:text-white/30"
              autoFocus
            />
            <button 
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-8 py-4 bg-[#D4AF37] text-[#0A0A0A] rounded-full font-medium text-xs tracking-[0.1em] uppercase hover:bg-[#F2D06B] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(212,175,55,0.2)]"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
