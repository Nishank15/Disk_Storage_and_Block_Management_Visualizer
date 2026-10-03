import React from 'react';
import { GraduationCap, Code, PenTool, Sparkles, ShieldCheck, Heart } from 'lucide-react';

export default function CreditsPage() {
  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 py-8">
      {/* Header section */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono bg-[#161718] border border-[#23252a] text-[#e4f222] mb-3">
          <Sparkles size={14} />
          <span>StorageOS Engineering Team &bull; Academic Edition</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-[510] tracking-[-0.022em] text-[#ffffff] font-sans">
          Project Contributors & Mentorship
        </h1>
        <p className="text-sm md:text-base text-[#8a8f98] mt-1.5 max-w-2xl leading-relaxed">
          Designed and developed for the Database Management Systems (Physical Storage & File Organization) curriculum.
        </p>
      </div>

      <div className="space-y-8">
        {/* Team Grid (2 Equal Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          
          {/* Member 1 Card: NISHANK CHHIPA */}
          <div className="bg-[#0f1011] border border-[#23252a] rounded-[12px] p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#e4f222] via-[#27a644] to-transparent"></div>
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-[8px] bg-[#161718] border border-[#23252a] flex items-center justify-center text-[#ffffff] font-mono font-bold text-xl shadow-inner">
                  NC
                </div>
                <span className="font-mono text-xs px-2.5 py-1 rounded-[6px] bg-[#161718] text-[#8a8f98] border border-[#23252a]">
                  25BCE1642
                </span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-[#ffffff] font-sans uppercase">
                Nishank Chhipa
              </h2>
              <p className="text-xs text-[#8a8f98] mt-0.5 mb-4">
                School of Computer Science and Engineering
              </p>
              
              <div className="flex items-center gap-2 text-xs text-[#d0d6e0] bg-[#161718] p-3 rounded-[6px] border border-[#23252a] mb-4">
                <Code size={16} className="text-[#e4f222] shrink-0" />
                <span className="font-medium">Core State Machine, Dynamic Allocation Algorithms & PDF Engine</span>
              </div>
              
              <p className="text-xs text-[#8a8f98] leading-relaxed">
                Architected the central 100-block virtual disk engine, Contiguous (First/Best/Worst-Fit) allocation loops, linked-list pointer tracking, inode indexed pointer arrays, external fragmentation diagnostics, defragmentation compaction algorithms, and the high-fidelity PDF audit export system.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#23252a] flex items-center justify-between text-[11px] text-[#62666d]">
              <span className="font-medium text-[#8a8f98]">Lead Systems Architect</span>
              <span className="font-mono text-[#62666d]">DBMS &bull; SEM 3</span>
            </div>
          </div>

          {/* Member 2 Card: SHOURYA SHARMA */}
          <div className="bg-[#0f1011] border border-[#23252a] rounded-[12px] p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#27a644] via-[#e4f222] to-transparent"></div>
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-[8px] bg-[#161718] border border-[#23252a] flex items-center justify-center text-[#ffffff] font-mono font-bold text-xl shadow-inner">
                  SS
                </div>
                <span className="font-mono text-xs px-2.5 py-1 rounded-[6px] bg-[#161718] text-[#8a8f98] border border-[#23252a]">
                  25BCE1780
                </span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-[#ffffff] font-sans uppercase">
                Shourya Sharma
              </h2>
              <p className="text-xs text-[#8a8f98] mt-0.5 mb-4">
                School of Computer Science and Engineering
              </p>
              
              <div className="flex items-center gap-2 text-xs text-[#d0d6e0] bg-[#161718] p-3 rounded-[6px] border border-[#23252a] mb-4">
                <PenTool size={16} className="text-[#27a644] shrink-0" />
                <span className="font-medium">UI Systems, Technical Documentation & Benchmark Visualizations</span>
              </div>
              
              <p className="text-xs text-[#8a8f98] leading-relaxed">
                Engineered the responsive 10x10 matrix UI, animated seek hops, dynamic SVG vector pointer overlays, free-space bitmap visualization, seek distance benchmark telemetry, academic knowledge base theory modules, and the Linear Midnight command-bar navigation system.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#23252a] flex items-center justify-between text-[11px] text-[#62666d]">
              <span className="font-medium text-[#8a8f98]">Lead UI/UX Designer</span>
              <span className="font-mono text-[#62666d]">DBMS &bull; SEM 3</span>
            </div>
          </div>

        </div>

        {/* Supervisor Card (Centered Below) */}
        <div className="bg-[#0f1011] border border-[#23252a] rounded-[12px] p-6 md:p-8 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] max-w-4xl mx-auto w-full">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="w-16 h-16 rounded-[10px] bg-[#161718] border border-[#23252a] flex items-center justify-center text-[#e4f222] shrink-0 shadow-inner">
              <GraduationCap size={32} />
            </div>
            <div className="flex-1">
              <span className="text-xs uppercase tracking-widest font-mono text-[#e4f222] font-semibold">Faculty Mentorship</span>
              <h2 className="text-2xl font-bold text-[#ffffff] font-sans mt-1">Dr. Swaminathan A</h2>
              <p className="text-sm font-medium text-[#d0d6e0] mt-0.5">
                Assistant Professor &bull; School of Computer Science and Engineering (SCOPE)
              </p>
              <p className="text-xs text-[#8a8f98] mt-2 max-w-2xl leading-relaxed">
                Academic supervision and curricular guidance in database internals, physical storage algorithms, slotted-page architectures, and pedagogical accuracy for undergraduate engineering education.
              </p>
            </div>
            <div className="shrink-0 flex flex-col items-center md:items-end gap-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[6px] bg-[#161718] text-xs text-[#ffffff] border border-[#23252a]">
                <ShieldCheck size={14} className="text-[#27a644]" />
                Academic Verified
              </span>
              <span className="text-[11px] font-mono text-[#62666d]">Course: CSE2004 / DBMS</span>
            </div>
          </div>
        </div>

        {/* Project Technical Specifications */}
        <div className="p-5 rounded-[12px] bg-[#0f1011] border border-[#23252a] flex flex-wrap items-center justify-between gap-4 text-xs text-[#8a8f98]">
          <div className="flex items-center gap-2">
            <span className="text-[#ffffff] font-medium">StorageOS Core Visualizer</span>
            <span>&bull;</span>
            <span>Linear Midnight UI Architecture</span>
            <span>&bull;</span>
            <span className="text-[#e4f222]">Production Release &bull; v1.0</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#62666d]">
            <span>Crafted with</span>
            <Heart size={12} className="text-[#eb5757] fill-[#eb5757]" />
            <span>for DBMS Students</span>
          </div>
        </div>

      </div>
    </div>
  );
}
