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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-8">
      <div 
        ref={terminalRef}
        className="w-full max-w-5xl h-full max-h-[90vh] bg-[#050505] border border-[#00F0FF]/30 rounded-lg flex flex-col overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.1)] relative"
      >
        {/* Terminal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#00F0FF]/20 bg-[#00F0FF]/5">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-[#00F0FF] animate-pulse shadow-[0_0_8px_#00F0FF]"></span>
            <span className="font-[family-name:var(--font-space-mono)] text-[#00F0FF] text-xs tracking-[0.2em]">TERMINAL // PREDICTIVE_ENGINE</span>
          </div>
          <div className="flex gap-4 items-center">
            {messages.length > 2 && (
              <button 
                onClick={handleSaveTarget}
                disabled={isSaving}
                className="text-[#4A00E0] hover:text-white border border-[#4A00E0]/50 hover:bg-[#4A00E0] font-[family-name:var(--font-space-mono)] text-xs transition-all px-3 py-1 mr-4"
              >
                [ SAVE TARGET ]
              </button>
            )}
            <button 
              onClick={onClose}
              className="text-zinc-500 hover:text-[#00F0FF] font-[family-name:var(--font-space-mono)] text-sm transition-colors"
            >
              [ CLOSE ]
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 font-[family-name:var(--font-outfit)] scrollbar-thin scrollbar-thumb-[#00F0FF]/20 scrollbar-track-transparent">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex flex-col max-w-[85%] ${msg.role === "user" ? "self-end items-end" : "self-start items-start"}`}>
              <span className={`text-[10px] font-[family-name:var(--font-space-mono)] tracking-widest uppercase mb-1 ${msg.role === "user" ? "text-[#4A00E0]" : "text-[#00F0FF]"}`}>
                {msg.role === "user" ? "OPERATOR" : "SYSTEM"}
              </span>
              <div className={`p-4 rounded-md text-sm leading-relaxed ${msg.role === "user" ? "bg-[#4A00E0]/10 border border-[#4A00E0]/30 text-white" : "bg-[#00F0FF]/5 border border-[#00F0FF]/20 text-zinc-300"}`}>
                <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-headings:text-[#00F0FF] prose-a:text-[#00F0FF] prose-strong:text-white prose-table:border-collapse prose-th:border prose-th:border-[#00F0FF]/30 prose-th:p-2 prose-td:border prose-td:border-[#00F0FF]/20 prose-td:p-2">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="self-start flex items-center gap-2 text-[#00F0FF] font-[family-name:var(--font-space-mono)] text-xs">
              <span className="animate-spin">|</span> PROCESSING...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-[#00F0FF]/20 bg-black">
          <form onSubmit={handleSubmit} className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="ENTER COMMAND..."
              className="flex-1 bg-transparent border-b border-[#00F0FF]/30 text-white font-[family-name:var(--font-space-mono)] text-sm px-2 py-3 focus:outline-none focus:border-[#00F0FF] transition-colors placeholder:text-zinc-700"
              autoFocus
            />
            <button 
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-8 py-3 bg-[#00F0FF]/10 border border-[#00F0FF]/50 text-[#00F0FF] font-[family-name:var(--font-space-mono)] text-xs tracking-widest uppercase hover:bg-[#00F0FF] hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              EXECUTE
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
