"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

export default function Home() {
  const containerRef = useRef(null);
  const zionNodeRef = useRef(null);
  const textRefs = useRef<(HTMLSpanElement | HTMLHeadingElement | HTMLParagraphElement | HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Premium entry animation
    const tl = gsap.timeline();
    
    // Abstract Radar HUD floating/spinning
    tl.to(zionNodeRef.current, {
      rotation: 360,
      duration: 120,
      repeat: -1,
      ease: "linear"
    });

    // Staggered text entrance
    gsap.fromTo(textRefs.current, 
      { y: 40, opacity: 0, filter: "blur(10px)" },
      { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.2, stagger: 0.15, ease: "power3.out", delay: 0.2 }
    );
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col flex-1 items-center justify-center font-[family-name:var(--font-outfit)] w-full h-screen relative">
      
      {/* Background Cybernetic Radar */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-30 mix-blend-screen pointer-events-none">
        <Image 
          ref={zionNodeRef}
          src="/diagnostic_nano_node.png" 
          alt="Zion Node" 
          width={1000} 
          height={1000}
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505]"></div>
      </div>

      <main className="relative z-10 flex flex-col w-full max-w-6xl p-8 lg:p-16 border border-[#00F0FF]/10 bg-[#050505]/60 backdrop-blur-3xl shadow-[0_0_50px_rgba(0,240,255,0.03)]">
        
        {/* Top telemetry bar */}
        <div className="flex justify-between w-full border-b border-[#00F0FF]/20 pb-4 mb-12 font-[family-name:var(--font-space-mono)] text-[10px] sm:text-xs text-[#00F0FF]/70 tracking-widest uppercase">
          <span ref={(el) => { textRefs.current[0] = el; }}>SYSTEM: ONLINE</span>
          <span ref={(el) => { textRefs.current[1] = el; }}>NODE: ZION-DIAGNOSTIC</span>
          <span ref={(el) => { textRefs.current[2] = el; }} className="animate-pulse">LATENCY: 12ms</span>
        </div>

        <div className="flex flex-col gap-2 mb-16">
          <h1 ref={(el) => { textRefs.current[3] = el; }} className="text-5xl lg:text-7xl font-light tracking-tighter text-white uppercase">
            BESPOKE <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-[#4A00E0]">OPERATING</span> SYSTEM
          </h1>
          <p ref={(el) => { textRefs.current[4] = el; }} className="text-[#4A00E0] text-lg sm:text-xl font-light tracking-[0.3em] uppercase mt-4">
            [ Real Estate Autonomous Engine ]
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Token Ledger Module */}
          <div ref={(el) => { textRefs.current[5] = el; }} className="p-8 border-l border-[#00F0FF]/50 bg-black/40 flex flex-col gap-8 group hover:bg-[#00F0FF]/5 transition-colors duration-500 backdrop-blur-md">
            <h2 className="text-[#00F0FF] font-medium text-sm flex items-center gap-3 font-[family-name:var(--font-space-mono)] uppercase tracking-[0.2em]">
              <span className="w-1.5 h-1.5 bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]"></span>
              [ Token Ledger ]
            </h2>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-zinc-600 text-[10px] font-[family-name:var(--font-space-mono)] uppercase tracking-widest mb-2">Available Credits</p>
                <p className="text-5xl font-[family-name:var(--font-space-mono)] text-white group-hover:text-[#00F0FF] transition-colors duration-500 font-light">---</p>
              </div>
              <button className="px-6 py-2.5 bg-transparent hover:bg-[#00F0FF] border border-[#00F0FF]/30 text-[#00F0FF] hover:text-black font-[family-name:var(--font-space-mono)] text-[10px] tracking-widest uppercase transition-all duration-300">
                Manage
              </button>
            </div>
          </div>

          {/* Active Properties Module */}
          <div ref={(el) => { textRefs.current[6] = el; }} className="p-8 border-l border-[#4A00E0]/50 bg-black/40 flex flex-col gap-8 group hover:bg-[#4A00E0]/10 transition-colors duration-500 backdrop-blur-md">
            <h2 className="text-[#4A00E0] font-medium text-sm flex items-center gap-3 font-[family-name:var(--font-space-mono)] uppercase tracking-[0.2em]">
              <span className="w-1.5 h-1.5 bg-[#4A00E0] shadow-[0_0_8px_#4A00E0]"></span>
              [ Active Targets ]
            </h2>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-zinc-600 text-[10px] font-[family-name:var(--font-space-mono)] uppercase tracking-widest mb-2">Monitored Assets</p>
                <p className="text-5xl font-[family-name:var(--font-space-mono)] text-white group-hover:text-[#4A00E0] transition-colors duration-500 font-light">---</p>
              </div>
              <button className="px-6 py-2.5 bg-transparent hover:bg-[#4A00E0] border border-[#4A00E0]/30 text-[#4A00E0] hover:text-white font-[family-name:var(--font-space-mono)] text-[10px] tracking-widest uppercase transition-all duration-300">
                View All
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col mb-10 w-full" ref={(el) => { textRefs.current[7] = el; }}>
          <h3 className="text-[#00F0FF] text-xs font-[family-name:var(--font-space-mono)] uppercase tracking-[0.3em] mb-6 border-b border-[#00F0FF]/20 pb-4">
            Available Command Modules
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="p-6 bg-zinc-900/40 border border-zinc-800/50 hover:border-[#00F0FF]/50 transition-colors group cursor-pointer">
              <h4 className="text-white font-medium text-sm mb-2 group-hover:text-[#00F0FF] transition-colors">1. Predictive Deal Engine</h4>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Chat interface with Gemini to calculate proprietary Acquisition Viability Scores based on simulated distress signals (probate, tax delinquency).
              </p>
            </div>

            <div className="p-6 bg-zinc-900/40 border border-zinc-800/50 hover:border-[#00F0FF]/50 transition-colors group cursor-pointer">
              <h4 className="text-white font-medium text-sm mb-2 group-hover:text-[#00F0FF] transition-colors">2. Deep Financial Analysis</h4>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Automatically calculate Estimated Repairs, After Repair Value (ARV), and Max Allowable Offers strictly adhering to the 70% rule.
              </p>
            </div>

            <div className="p-6 bg-zinc-900/40 border border-zinc-800/50 hover:border-[#4A00E0]/50 transition-colors group cursor-pointer">
              <h4 className="text-white font-medium text-sm mb-2 group-hover:text-[#4A00E0] transition-colors">3. Outbound Omnichannel Agent</h4>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Dispatch AI-generated cold text scripts via Twilio, or deploy synthesized real-time voice calls via ElevenLabs to motivated sellers.
              </p>
            </div>

            <div className="p-6 bg-zinc-900/40 border border-zinc-800/50 hover:border-[#4A00E0]/50 transition-colors group cursor-pointer">
              <h4 className="text-white font-medium text-sm mb-2 group-hover:text-[#4A00E0] transition-colors">4. Inbound Negotiation Mode</h4>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Catch inbound SMS replies via Twilio webhooks and let the Gemini engine autonomously negotiate and respond within the property's context.
              </p>
            </div>

          </div>
        </div>

        <div ref={(el) => { textRefs.current[8] = el; }} className="w-full flex justify-center mt-4">
          <button className="px-14 py-5 bg-white hover:bg-[#00F0FF] text-black font-[family-name:var(--font-space-mono)] text-xs tracking-[0.3em] font-bold transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,240,255,0.4)] w-full md:w-auto">
            INITIALIZE DEAL ENGINE
          </button>
        </div>
      </main>
    </div>
  );
}
