import React, { useState } from 'react';
import { Zap, RefreshCw, Disc, Activity, Layers, AlertCircle } from 'lucide-react';

export default function HardwareViewer({ hardwareMode, onToggleMode }) {
  const [rpm, setRpm] = useState(7200);
  const [activeTrack, setActiveTrack] = useState(2);
  const [isRotating, setIsRotating] = useState(true);

  // SSD interactive state
  const [ssdPages, setSsdPages] = useState(() => {
    // Generate 4 blocks x 16 pages = 64 pages
    return Array.from({ length: 64 }).map((_, i) => ({
      id: i,
      blockId: Math.floor(i / 16),
      pageInBlock: i % 16,
      status: i < 28 ? 'valid' : i < 42 ? 'invalid' : 'free',
      data: i < 28 ? `Tuple_Page_${i}` : i < 42 ? `Stale_${i}` : null,
      eraseCycles: Math.floor(Math.random() * 12) + 1,
    }));
  });

  const [wafHostWrites, setWafHostWrites] = useState(128);
  const [wafNandWrites, setWafNandWrites] = useState(240);

  // HDD Mathematical Calculations
  const rps = rpm / 60; // rotations per second
  const rotLatencyMs = Number(((1 / (2 * rps)) * 1000).toFixed(2)); // Tr in ms
  const seekTimeMs = 8.5; // average Ts in ms
  const transferTimeMs = 0.05; // Ttransfer in ms
  const totalAccessTimeMs = Number((seekTimeMs + rotLatencyMs + transferTimeMs).toFixed(2));

  // SSD Simulation Handlers
  const handleRandomWrites = () => {
    setSsdPages(prev => {
      const next = [...prev];
      // Mark 4 valid pages as invalid (stale)
      const validIndices = next.map((p, idx) => p.status === 'valid' ? idx : null).filter(i => i !== null);
      for (let k = 0; k < Math.min(3, validIndices.length); k++) {
        const randValid = validIndices[Math.floor(Math.random() * validIndices.length)];
        next[randValid] = { ...next[randValid], status: 'invalid', data: `Stale_${next[randValid].id}` };
      }
      // Allocate into 3 free pages
      const freeIndices = next.map((p, idx) => p.status === 'free' ? idx : null).filter(i => i !== null);
      for (let k = 0; k < Math.min(3, freeIndices.length); k++) {
        const randFree = freeIndices[k];
        next[randFree] = { 
          ...next[randFree], 
          status: 'valid', 
          data: `New_Tuple_${next[randFree].id}`,
          eraseCycles: next[randFree].eraseCycles 
        };
      }
      return next;
    });
    setWafHostWrites(prev => prev + 12);
    setWafNandWrites(prev => prev + 24);
  };

  const handleGarbageCollection = () => {
    setSsdPages(prev => {
      // Find block with highest number of invalid pages
      const blockInvalidCounts = [0, 1, 2, 3].map(bId => 
        prev.filter(p => p.blockId === bId && p.status === 'invalid').length
      );
      const targetBlockId = blockInvalidCounts.indexOf(Math.max(...blockInvalidCounts));

      return prev.map(p => {
        if (p.blockId === targetBlockId) {
          // Erase block completely: if valid, it moves elsewhere (simulated); now all become free
          return {
            ...p,
            status: 'free',
            data: null,
            eraseCycles: p.eraseCycles + 1
          };
        }
        return p;
      });
    });
    setWafNandWrites(prev => prev + 64);
  };

  const waf = (wafNandWrites / wafHostWrites).toFixed(2);

  return (
    <div className="bg-[#0f1011] border border-[#23252a] rounded-xl p-5 md:p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] space-y-6">
      
      {/* Top Header & Segmented Media Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#23252a]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#e4f222]"></span>
            <h2 className="text-sm font-semibold tracking-wide text-[#ffffff] uppercase font-mono">
              Physical Storage Media Simulation
            </h2>
          </div>
          <p className="text-xs text-[#8a8f98] mt-0.5">
            Compare mechanical magnetic platters with semiconductor solid-state flash cells.
          </p>
        </div>

        {/* Segmented Mode Button */}
        <div className="inline-flex rounded-lg bg-[#161718] p-1 border border-[#23252a] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onToggleMode('HDD')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
              hardwareMode === 'HDD'
                ? 'bg-[#08090a] text-[#ffffff] border border-[#e4f222] shadow-[0_0_10px_rgba(228,242,34,0.15)]'
                : 'text-[#8a8f98] hover:text-[#d0d6e0]'
            }`}
          >
            <Disc size={14} className={hardwareMode === 'HDD' ? 'text-[#e4f222]' : 'text-[#8a8f98]'} />
            <span>Magnetic HDD (Platters)</span>
          </button>
          <button
            type="button"
            onClick={() => onToggleMode('SSD')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
              hardwareMode === 'SSD'
                ? 'bg-[#08090a] text-[#ffffff] border border-[#e4f222] shadow-[0_0_10px_rgba(228,242,34,0.15)]'
                : 'text-[#8a8f98] hover:text-[#d0d6e0]'
            }`}
          >
            <Zap size={14} className={hardwareMode === 'SSD' ? 'text-[#e4f222]' : 'text-[#8a8f98]'} />
            <span>NAND Flash SSD (Cells)</span>
          </button>
        </div>
      </div>

      {/* 1. MAGNETIC HDD VIEW */}
      {hardwareMode === 'HDD' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left: Interactive Mechanical Platter Graphic (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-4 bg-[#08090a] rounded-xl border border-[#23252a] relative overflow-hidden">
            <div className="absolute top-3 left-3 text-[10px] font-mono text-[#8a8f98] uppercase">
              Spindle Assembly &bull; Track {activeTrack} Selected
            </div>

            {/* Platter SVG Graphic */}
            <div className="relative w-64 h-64 md:w-72 md:h-72 my-2 flex items-center justify-center select-none">
              
              {/* Outer Platter Ring */}
              <div 
                className={`absolute inset-0 rounded-full border-4 border-[#23252a] bg-gradient-to-tr from-[#161718] via-[#0f1011] to-[#1a1c1e] shadow-2xl ${
                  isRotating ? 'animate-spin' : ''
                }`}
                style={{ animationDuration: `${60 / rpm}s` }}
              >
                {/* Concentric Tracks */}
                <div className="absolute inset-4 rounded-full border border-dashed border-[#383b3f]/60" />
                <div className="absolute inset-10 rounded-full border border-[#23252a]" />
                <div className="absolute inset-16 rounded-full border border-dashed border-[#383b3f]/60" />
                <div className="absolute inset-22 rounded-full border border-[#23252a]" />

                {/* Sector Dividers */}
                <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-[#23252a]/80" />
                <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-[#23252a]/80" />
                <div className="absolute inset-0 rotate-45 border-t border-b border-[#23252a]/60" />
                <div className="absolute inset-0 -rotate-45 border-t border-b border-[#23252a]/60" />

                {/* Sector Numbers */}
                <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] font-mono text-[#62666d]">Sec 0</span>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-mono text-[#62666d]">Sec 2</span>
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-mono text-[#62666d]">Sec 4</span>
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] font-mono text-[#62666d]">Sec 6</span>
              </div>

              {/* Spindle Center */}
              <div className="w-14 h-14 rounded-full bg-[#23252a] border-2 border-[#e4f222]/60 z-10 flex items-center justify-center shadow-lg">
                <div className="w-5 h-5 rounded-full bg-[#08090a] border border-[#383b3f]" />
              </div>

              {/* Actuator Arm & Read/Write Head */}
              <div 
                className="absolute top-4 left-6 w-36 h-3.5 bg-gradient-to-r from-[#383b3f] to-[#e4f222] origin-left rounded-r-full shadow-lg z-20 transition-transform duration-300 pointer-events-none"
                style={{ 
                  transform: `rotate(${activeTrack === 1 ? '18deg' : activeTrack === 2 ? '30deg' : '42deg'})` 
                }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#ffffff] border border-[#08090a] shadow-[0_0_8px_#ffffff]" />
              </div>

            </div>

            {/* Platter Controls */}
            <div className="w-full flex flex-wrap items-center justify-between gap-3 pt-3 mt-1 border-t border-[#23252a]/80 text-xs">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsRotating(!isRotating)}
                  className="px-2.5 py-1 rounded bg-[#161718] border border-[#23252a] hover:border-[#383b3f] text-[#d0d6e0] font-mono text-[11px]"
                >
                  {isRotating ? 'Pause Platter' : 'Spin Platter'}
                </button>
                <div className="flex items-center gap-1 font-mono text-[11px] text-[#8a8f98]">
                  <span>Track:</span>
                  {[1, 2, 3].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setActiveTrack(t)}
                      className={`w-5 h-5 rounded flex items-center justify-center border ${
                        activeTrack === t 
                          ? 'bg-[#e4f222] text-[#08090a] border-[#e4f222] font-bold' 
                          : 'bg-[#161718] text-[#8a8f98] border-[#23252a]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[#8a8f98]">
                <span>Speed:</span>
                <select
                  value={rpm}
                  onChange={(e) => setRpm(Number(e.target.value))}
                  className="bg-[#161718] border border-[#23252a] text-[#ffffff] rounded px-2 py-0.5 font-mono text-xs focus:border-[#e4f222] outline-none"
                >
                  <option value={5400}>5400 RPM (Laptop)</option>
                  <option value={7200}>7200 RPM (Desktop / Server)</option>
                  <option value={10000}>10000 RPM (Enterprise SCSI)</option>
                  <option value={15000}>15000 RPM (High-End SAS)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right: Real-Time Latency Metrics Card (5 cols) */}
          <div className="lg:col-span-5 space-y-3.5">
            <div className="p-4 rounded-xl bg-[#08090a] border border-[#23252a]">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#e4f222] font-semibold block mb-1">
                Mechanical Latency Breakdown
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#23252a]/60">
                  <span className="text-[#8a8f98]">Rotational Speed</span>
                  <span className="font-mono text-[#ffffff] font-medium">{rpm} RPM ({rps} rev/sec)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#23252a]/60">
                  <span className="text-[#8a8f98]">Avg Rotational Delay (<span className="font-mono">T_r</span>)</span>
                  <span className="font-mono text-[#e4f222] font-medium">{rotLatencyMs} ms</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#23252a]/60">
                  <span className="text-[#8a8f98]">Avg Seek Time (<span className="font-mono">T_s</span>)</span>
                  <span className="font-mono text-[#ffffff] font-medium">{seekTimeMs} ms</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#23252a]/60">
                  <span className="text-[#8a8f98]">Transfer Time (<span className="font-mono">T_tr</span>)</span>
                  <span className="font-mono text-[#ffffff] font-medium">{transferTimeMs} ms</span>
                </div>
                <div className="flex justify-between pt-1.5 font-bold text-sm">
                  <span className="text-[#ffffff]">Total Access Time (<span className="font-mono">T_a</span>)</span>
                  <span className="font-mono text-[#e4f222]">{totalAccessTimeMs} ms</span>
                </div>
              </div>
            </div>

            {/* Formula Reference */}
            <div className="p-3.5 rounded-xl bg-[#161718] border border-[#23252a] text-xs space-y-1.5">
              <span className="font-mono text-[11px] text-[#8a8f98] uppercase block">
                Standard DBMS Latency Formula
              </span>
              <div className="font-mono text-[12px] text-[#ffffff] bg-[#08090a] p-2 rounded border border-[#23252a] text-center">
                T_access = T_seek + [ 1 / (2 &times; RPS) ] + (Bytes / Rate)
              </div>
              <p className="text-[11px] text-[#8a8f98] leading-relaxed">
                Magnetic disks require physical arm translation (seek) and rotation to align target sectors under the head, creating a massive ~10ms latency floor compared to ~0.05ms in SSDs.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* 2. NAND FLASH SSD VIEW */}
      {hardwareMode === 'SSD' && (
        <div className="space-y-6">
          
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 rounded-lg bg-[#08090a] border border-[#23252a]">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[#ffffff] font-medium">NAND Architecture:</span>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-[2px] bg-[#ffffff]" />
                  <span>Valid Page</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-[2px] bg-[#eb5757]/60 border border-[#eb5757]" />
                  <span>Invalid (Stale)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-[2px] bg-[#161718] border border-[#383b3f]" />
                  <span>Erased / Free</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRandomWrites}
                className="px-3 py-1.5 rounded-[6px] bg-[#161718] border border-[#23252a] hover:border-[#383b3f] text-[#d0d6e0] hover:text-[#ffffff] text-xs font-medium transition-colors"
              >
                + Trigger Host Writes (Creates Stale Pages)
              </button>
              <button
                type="button"
                onClick={handleGarbageCollection}
                className="px-3 py-1.5 rounded-[6px] bg-[#e4f222] text-[#08090a] hover:brightness-105 text-xs font-[510] transition-all flex items-center gap-1.5"
              >
                <RefreshCw size={12} strokeWidth={2.5} />
                <span>Run Garbage Collection & Erase</span>
              </button>
            </div>
          </div>

          {/* 4 NAND Flash Erase Blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map(bId => {
              const blockPages = ssdPages.filter(p => p.blockId === bId);
              const validCount = blockPages.filter(p => p.status === 'valid').length;
              const invalidCount = blockPages.filter(p => p.status === 'invalid').length;
              const freeCount = blockPages.filter(p => p.status === 'free').length;
              const avgErase = Math.round(blockPages.reduce((acc, p) => acc + p.eraseCycles, 0) / blockPages.length);

              return (
                <div key={bId} className="p-4 rounded-xl bg-[#08090a] border border-[#23252a] space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#23252a]/60">
                    <div>
                      <h4 className="text-xs font-mono font-bold text-[#ffffff]">Erase Block {bId}</h4>
                      <span className="text-[10px] font-mono text-[#8a8f98]">16 Pages (64 KB)</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161718] text-[#e4f222] border border-[#23252a]">
                      {avgErase} P/E Cycles
                    </span>
                  </div>

                  {/* 4x4 Grid of Pages */}
                  <div className="grid grid-cols-4 gap-1.5">
                    {blockPages.map(page => {
                      let cellClass = 'bg-[#161718] border border-[#23252a] text-[#62666d]';
                      if (page.status === 'valid') {
                        cellClass = 'bg-[#ffffff] text-[#08090a] font-bold border-[#ffffff]';
                      } else if (page.status === 'invalid') {
                        cellClass = 'bg-[#eb5757]/20 border border-[#eb5757]/60 text-[#eb5757] line-through';
                      }

                      return (
                        <div
                          key={page.id}
                          className={`aspect-square rounded-[3px] flex items-center justify-center text-[9px] font-mono transition-all ${cellClass}`}
                          title={`Page ${page.id} (Block ${bId}): ${page.status.toUpperCase()} [${page.eraseCycles} Cycles]`}
                        >
                          {page.pageInBlock}
                        </div>
                      );
                    })}
                  </div>

                  {/* Block Mini Telemetry */}
                  <div className="pt-2 border-t border-[#23252a]/60 flex justify-between text-[10px] font-mono text-[#8a8f98]">
                    <span>Valid: <strong className="text-[#ffffff]">{validCount}</strong></span>
                    <span>Stale: <strong className="text-[#eb5757]">{invalidCount}</strong></span>
                    <span>Free: <strong className="text-[#27a644]">{freeCount}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* SSD Core Architecture Principles Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="p-4 rounded-xl bg-[#08090a] border border-[#23252a] space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#ffffff]">
                <Layers size={14} className="text-[#e4f222]" />
                <span>Asymmetric Read/Write vs. Erase</span>
              </div>
              <p className="text-xs text-[#8a8f98] leading-relaxed">
                NAND flash allows reading and programming (writing) at <strong className="text-[#ffffff]">Page level (4KB)</strong>, but erasing can ONLY occur at whole <strong className="text-[#ffffff]">Block level (2MB - 4MB)</strong>. Flash cells must be cleared back to 1s before writing.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#08090a] border border-[#23252a] space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#ffffff]">
                <Activity size={14} className="text-[#27a644]" />
                <span>Wear Leveling Algorithms</span>
              </div>
              <p className="text-xs text-[#8a8f98] leading-relaxed">
                Flash cells endure finite Program/Erase (P/E) cycles (~1,000 to 10,000 for TLC/QLC). SSD controllers employ Dynamic and Static Wear Leveling to distribute write cycles uniformly across the entire pool of flash blocks.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#08090a] border border-[#23252a] space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#ffffff]">
                <AlertCircle size={14} className="text-[#eb5757]" />
                <span>Write Amplification Factor (WAF)</span>
              </div>
              <div className="font-mono text-xs text-[#e4f222] bg-[#161718] p-1.5 rounded border border-[#23252a] flex justify-between">
                <span>WAF = NAND / Host</span>
                <span className="font-bold">{waf}x</span>
              </div>
              <p className="text-[11px] text-[#8a8f98] leading-relaxed">
                Because stale pages must be relocated during block erasures, total bytes written to flash exceed host data, accelerating drive wear.
              </p>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
