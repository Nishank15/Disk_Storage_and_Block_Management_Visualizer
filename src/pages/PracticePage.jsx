import React, { useState } from 'react';
import DiskSchedulingWorkbench from '../components/Practice/DiskSchedulingWorkbench';
import InodeCapacityWorkbench from '../components/Practice/InodeCapacityWorkbench';
import BlockingFactorWorkbench from '../components/Practice/BlockingFactorWorkbench';
import { Bot, Disc, Key, Database, HelpCircle } from 'lucide-react';

export default function PracticePage() {
  const [activeTab, setActiveTab] = useState('scheduling'); // 'scheduling' | 'inode' | 'blocking'

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 py-8 space-y-8">
      
      {/* Header section */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono bg-[#161718] border border-[#23252a] text-[#e4f222] mb-3">
          <Bot size={14} />
          <span>Interactive Student Workbench &bull; Teacher Requirement 3</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-[510] tracking-[-0.022em] text-[#ffffff] font-sans">
          AI Storage Practice Sandbox
        </h1>
        <p className="text-sm md:text-base text-[#8a8f98] mt-1.5 max-w-3xl leading-relaxed">
          Interactive mathematical workbench where students practice and verify Disk Head Scheduling, UNIX Inode File Capacity calculations, and DBMS Blocking Factor formulas with instant AI step-by-step derivations.
        </p>
      </div>

      {/* Domain Navigation Tabs */}
      <div className="flex flex-wrap gap-2.5 border-b border-[#23252a] pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('scheduling')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs md:text-sm font-medium transition-all ${
            activeTab === 'scheduling'
              ? 'bg-[#161718] text-[#ffffff] border border-[#e4f222] shadow-[0_0_12px_rgba(228,242,34,0.15)]'
              : 'bg-[#0f1011] text-[#8a8f98] hover:text-[#d0d6e0] border border-[#23252a] hover:border-[#383b3f]'
          }`}
        >
          <Disc size={15} className={activeTab === 'scheduling' ? 'text-[#e4f222]' : 'text-[#8a8f98]'} />
          <span>1. Disk Head Scheduling (SSTF, SCAN, LOOK)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('inode')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs md:text-sm font-medium transition-all ${
            activeTab === 'inode'
              ? 'bg-[#161718] text-[#ffffff] border border-[#e4f222] shadow-[0_0_12px_rgba(228,242,34,0.15)]'
              : 'bg-[#0f1011] text-[#8a8f98] hover:text-[#d0d6e0] border border-[#23252a] hover:border-[#383b3f]'
          }`}
        >
          <Key size={15} className={activeTab === 'inode' ? 'text-[#e4f222]' : 'text-[#8a8f98]'} />
          <span>2. UNIX Inode File Capacity</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('blocking')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs md:text-sm font-medium transition-all ${
            activeTab === 'blocking'
              ? 'bg-[#161718] text-[#ffffff] border border-[#e4f222] shadow-[0_0_12px_rgba(228,242,34,0.15)]'
              : 'bg-[#0f1011] text-[#8a8f98] hover:text-[#d0d6e0] border border-[#23252a] hover:border-[#383b3f]'
          }`}
        >
          <Database size={15} className={activeTab === 'blocking' ? 'text-[#e4f222]' : 'text-[#8a8f98]'} />
          <span>3. DBMS Blocking Factor (Bfr)</span>
        </button>
      </div>

      {/* Active Practice Module */}
      <section>
        {activeTab === 'scheduling' && <DiskSchedulingWorkbench />}
        {activeTab === 'inode' && <InodeCapacityWorkbench />}
        {activeTab === 'blocking' && <BlockingFactorWorkbench />}
      </section>

      {/* Pedagogical Guidelines Footnote */}
      <div className="p-4 rounded-xl bg-[#0f1011] border border-[#23252a] text-xs text-[#8a8f98] flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <HelpCircle size={15} className="text-[#e4f222] shrink-0" />
          <span>
            Practice tip: Use the <strong>"Randomize"</strong> button to generate fresh examination variables, attempt the problem with pen and paper, and verify your answers against the system.
          </span>
        </div>
        <span className="font-mono text-[11px] text-[#62666d] shrink-0 hidden sm:inline">
          GATE CSE &bull; Semester 3 DBMS
        </span>
      </div>

    </div>
  );
}
