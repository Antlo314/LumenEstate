"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import GeminiTerminal from "@/components/GeminiTerminal";

export default function Home() {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [targetAddress, setTargetAddress] = useState("");
  const [initialPrompt, setInitialPrompt] = useState("");
  const [activeTargetsCount, setActiveTargetsCount] = useState<number | string>("---");
  
  const containerRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    // Fetch live targets count
    fetch("/api/properties")
      .then(res => res.json())
      .then(data => {
        if (data.count !== undefined) setActiveTargetsCount(data.count);
      })
      .catch(console.error);

    // Premium elegant entry animation
    gsap.fromTo(".gsap-stagger", 
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.5, stagger: 0.1, ease: "power2.out", delay: 0.2 }
    );

    // Slow, ambient background gradient movement
    gsap.to(glowRef.current, {
      backgroundPosition: "200% 50%",
      duration: 20,
      repeat: -1,
      ease: "linear"
    });
  }, []);

  const handleAcquireTarget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAddress.trim()) return;
    setInitialPrompt(`Analyze the property at ${targetAddress} for acquisition viability and provide the 70% rule MAO.`);
    setIsTerminalOpen(true);
  };

  return (
    <div ref={containerRef} className="flex flex-col flex-1 items-center justify-start font-[family-name:var(--font-outfit)] w-full min-h-screen relative overflow-y-auto bg-[#0A0A0A]">
      
      {/* Ambient Premium Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#1A1500] via-[#0A0A0A] to-[#050505] opacity-80"></div>
        <div 
          ref={glowRef}
          className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.03)_0%,_transparent_50%)] bg-[length:100%_100%]"
        ></div>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[100px]"></div>
      </div>

      <main className="relative z-10 flex flex-col w-full max-w-6xl p-8 lg:p-16 mt-10 mb-20 bg-white/[0.02] border border-white/[0.05] rounded-2xl backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        
        {/* Top telemetry bar */}
        <div className="gsap-stagger flex justify-between w-full border-b border-white/[0.08] pb-6 mb-16 font-light text-[10px] sm:text-xs text-[#D4AF37]/60 tracking-[0.3em] uppercase">
          <span>Lumen Wealth Desk</span>
          <span>Institutional Access</span>
          <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse"></span> SECURE CONNECTION</span>
        </div>

        <div className="flex flex-col items-center text-center gap-4 mb-20">
          <h1 className="gsap-stagger font-[family-name:var(--font-playfair)] text-5xl lg:text-7xl font-normal tracking-tight text-[#F5F5F5]">
            Property Intelligence <span className="italic text-[#D4AF37]">Desk</span>
          </h1>
          <p className="gsap-stagger text-[#E5E4E2]/60 text-lg sm:text-xl font-light tracking-[0.1em] mt-4 max-w-2xl">
            Autonomous valuation, underwriting, and off-market asset discovery powered by institutional-grade AI.
          </p>
        </div>

        {/* Target Acquisition Search Bar */}
        <div className="gsap-stagger flex justify-center w-full mb-24">
          <form onSubmit={handleAcquireTarget} className="flex w-full max-w-3xl items-center bg-black/40 border border-white/10 rounded-full p-2 shadow-[0_0_30px_rgba(212,175,55,0.05)] transition-all duration-500 hover:border-[#D4AF37]/40 hover:shadow-[0_0_40px_rgba(212,175,55,0.1)] focus-within:border-[#D4AF37]/60 focus-within:bg-black/60">
            <input 
              type="text" 
              value={targetAddress}
              onChange={(e) => setTargetAddress(e.target.value)}
              placeholder="Enter property address for immediate underwriting..." 
              className="flex-1 bg-transparent text-[#F5F5F5] font-light text-base px-8 py-4 focus:outline-none placeholder:text-white/30"
            />
            <button 
              type="submit"
              className="px-10 py-4 bg-[#D4AF37] hover:bg-[#F2D06B] text-black rounded-full font-medium tracking-wide transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)]"
            >
              Analyze Asset
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {/* Token Ledger Module */}
          <div className="gsap-stagger p-10 border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent rounded-2xl flex flex-col gap-8 group hover:border-[#D4AF37]/30 transition-all duration-500 hover:shadow-[0_10px_40px_rgba(212,175,55,0.05)]">
            <h2 className="text-[#D4AF37] font-[family-name:var(--font-playfair)] text-xl italic tracking-wide">
              Token Ledger
            </h2>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-white/40 text-[11px] uppercase tracking-widest mb-3">Available Capital</p>
                <p className="text-5xl font-light text-[#F5F5F5] group-hover:text-[#D4AF37] transition-colors duration-500">---</p>
              </div>
              <button className="px-6 py-2 bg-transparent hover:bg-white/5 border border-white/20 text-[#E5E4E2] rounded-full text-[11px] tracking-widest uppercase transition-all duration-300 hover:border-[#D4AF37] hover:text-[#D4AF37]">
                Manage
              </button>
            </div>
          </div>

          {/* Active Properties Module */}
          <div className="gsap-stagger p-10 border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent rounded-2xl flex flex-col gap-8 group hover:border-[#D4AF37]/30 transition-all duration-500 hover:shadow-[0_10px_40px_rgba(212,175,55,0.05)]">
            <h2 className="text-[#D4AF37] font-[family-name:var(--font-playfair)] text-xl italic tracking-wide">
              Asset Portfolio
            </h2>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-white/40 text-[11px] uppercase tracking-widest mb-3">Monitored Deals</p>
                <p className="text-5xl font-light text-[#F5F5F5] group-hover:text-[#D4AF37] transition-colors duration-500">{activeTargetsCount}</p>
              </div>
              <button className="px-6 py-2 bg-transparent hover:bg-white/5 border border-white/20 text-[#E5E4E2] rounded-full text-[11px] tracking-widest uppercase transition-all duration-300 hover:border-[#D4AF37] hover:text-[#D4AF37]">
                View Ledger
              </button>
            </div>
          </div>
        </div>

        <div className="gsap-stagger flex flex-col mb-16 w-full">
          <h3 className="text-[#D4AF37]/80 text-sm tracking-[0.2em] uppercase mb-8 border-b border-white/10 pb-4 text-center">
            Institutional Command Modules
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="p-8 bg-black/20 border border-white/5 rounded-xl hover:border-[#D4AF37]/40 transition-colors group cursor-pointer">
              <h4 className="text-[#F5F5F5] font-[family-name:var(--font-playfair)] text-lg mb-3 group-hover:text-[#D4AF37] transition-colors">Predictive Deal Engine</h4>
              <p className="text-white/50 text-sm font-light leading-relaxed">
                Interact with the intelligence core to evaluate proprietary Acquisition Viability Scores and parse off-market distress signals.
              </p>
            </div>

            <div className="p-8 bg-black/20 border border-white/5 rounded-xl hover:border-[#D4AF37]/40 transition-colors group cursor-pointer">
              <h4 className="text-[#F5F5F5] font-[family-name:var(--font-playfair)] text-lg mb-3 group-hover:text-[#D4AF37] transition-colors">Financial Underwriting</h4>
              <p className="text-white/50 text-sm font-light leading-relaxed">
                Autonomously calculate Estimated Repairs, After Repair Value (ARV), and Max Allowable Offers (MAO) with strict institutional rigor.
              </p>
            </div>

            <div className="p-8 bg-black/20 border border-white/5 rounded-xl hover:border-[#D4AF37]/40 transition-colors group cursor-pointer">
              <h4 className="text-[#F5F5F5] font-[family-name:var(--font-playfair)] text-lg mb-3 group-hover:text-[#D4AF37] transition-colors">Omnichannel Agent</h4>
              <p className="text-white/50 text-sm font-light leading-relaxed">
                Dispatch hyper-personalized cold outreach via synthesized real-time voice calls or SMS, driven by behavioral analysis.
              </p>
            </div>

            <div className="p-8 bg-black/20 border border-white/5 rounded-xl hover:border-[#D4AF37]/40 transition-colors group cursor-pointer">
              <h4 className="text-[#F5F5F5] font-[family-name:var(--font-playfair)] text-lg mb-3 group-hover:text-[#D4AF37] transition-colors">Autonomous Negotiation</h4>
              <p className="text-white/50 text-sm font-light leading-relaxed">
                Intercept inbound prospect replies and let the intelligence engine autonomously negotiate terms based on deal parameters.
              </p>
            </div>

          </div>
        </div>

        <div className="gsap-stagger w-full flex justify-center mt-8">
          <button 
            onClick={() => { setInitialPrompt(""); setIsTerminalOpen(true); }}
            className="px-12 py-4 bg-transparent border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black rounded-full font-medium tracking-[0.1em] transition-all duration-500 shadow-[0_0_20px_rgba(212,175,55,0.1)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
          >
            Access Intelligence Core
          </button>
        </div>
      </main>

      {isTerminalOpen && <GeminiTerminal initialPrompt={initialPrompt} onClose={() => { setIsTerminalOpen(false); setInitialPrompt(""); }} />}
    </div>
  );
}
