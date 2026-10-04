import React, { useState } from 'react';
import { Disc, Layers, Cpu, RefreshCw } from 'lucide-react';

const FILE_THEMES = [
  { fill: '#e4f222', bg: 'rgba(228, 242, 34, 0.25)', border: '#e4f222', text: '#e4f222' },
  { fill: '#27a644', bg: 'rgba(39, 166, 68, 0.25)', border: '#27a644', text: '#27a644' },
  { fill: '#4096ff', bg: 'rgba(64, 150, 255, 0.25)', border: '#4096ff', text: '#4096ff' },
  { fill: '#eb5757', bg: 'rgba(235, 87, 87, 0.25)', border: '#eb5757', text: '#eb5757' },
  { fill: '#f59e0b', bg: 'rgba(245, 158, 11, 0.25)', border: '#f59e0b', text: '#f59e0b' },
  { fill: '#a855f7', bg: 'rgba(168, 85, 247, 0.25)', border: '#a855f7', text: '#a855f7' },
  { fill: '#2dd4bf', bg: 'rgba(45, 212, 191, 0.25)', border: '#2dd4bf', text: '#2dd4bf' },
];

const getFileTheme = (fileId) => {
  if (!fileId) return null;
  const hash = fileId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return FILE_THEMES[hash % FILE_THEMES.length];
};

export default function PhysicalHardwareAllocation({
  blocks,
  totalBlocks = 100,
  staleBlocks = [],
  eraseCycles = 0,
  onTriggerSSDErase,
  lastAccessedBlock = 0,
  hoveredBlockId = null,
  hoveredFileId = null,
  onHoverSector,
  onHoverPage,
  seekAnimation = null,
}) {
  const [activeTab, setActiveTab] = useState('both'); // 'both' | 'hdd' | 'ssd'
  const [tooltipData, setTooltipData] = useState(null);

  // HDD Sector & Track Geometry Configuration
  const numTracks = 4;
  const sectorsPerTrack = Math.ceil(totalBlocks / numTracks);

  // SVG Geometry for Platter
  const cx = 170;
  const cy = 170;
  const rInner = 36;
  const rOuter = 145;
  const trackWidth = (rOuter - rInner) / numTracks;

  // Track target block for simulated read/write head
  const targetBlockId = hoveredBlockId !== null ? hoveredBlockId : lastAccessedBlock;
  const targetTrack = Math.floor(targetBlockId / sectorsPerTrack);
  const targetSector = targetBlockId % sectorsPerTrack;
  const targetRadius = rInner + (targetTrack + 0.5) * trackWidth;
  const targetAngle = (targetSector + 0.5) * ((2 * Math.PI) / sectorsPerTrack) - Math.PI / 2;
  const headTargetX = cx + targetRadius * Math.cos(targetAngle);
  const headTargetY = cy + targetRadius * Math.sin(targetAngle);

  // Pivot for Head Arm
  const armPivotX = 310;
  const armPivotY = 40;

  // Build sector paths
  const sectors = [];
  for (let t = 0; t < numTracks; t++) {
    const rIn = rInner + t * trackWidth + 1.5;
    const rOut = rInner + (t + 1) * trackWidth - 1.5;
    const angleStep = (2 * Math.PI) / sectorsPerTrack;
    const pad = 0.02;

    for (let s = 0; s < sectorsPerTrack; s++) {
      const blockId = t * sectorsPerTrack + s;
      if (blockId >= totalBlocks) break;

      const block = blocks[blockId] || { id: blockId, status: 'free' };
      const isAllocated = block.status === 'allocated';
      const theme = getFileTheme(block.fileId);

      const theta1 = s * angleStep + pad - Math.PI / 2;
      const theta2 = (s + 1) * angleStep - pad - Math.PI / 2;

      const x1 = cx + rIn * Math.cos(theta1);
      const y1 = cy + rIn * Math.sin(theta1);
      const x2 = cx + rOut * Math.cos(theta1);
      const y2 = cy + rOut * Math.sin(theta1);
      const x3 = cx + rOut * Math.cos(theta2);
      const y3 = cy + rOut * Math.sin(theta2);
      const x4 = cx + rIn * Math.cos(theta2);
      const y4 = cy + rIn * Math.sin(theta2);

      const d = `M ${x1} ${y1} L ${x2} ${y2} A ${rOut} ${rOut} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${rIn} ${rIn} 0 0 0 ${x1} ${y1} Z`;

      const isHovered = hoveredBlockId === blockId || (hoveredFileId && hoveredFileId === block.fileId);
      const isTarget = targetBlockId === blockId;

      sectors.push({
        blockId,
        track: t,
        sector: s,
        d,
        isAllocated,
        fileId: block.fileId,
        theme,
        isHovered,
        isTarget,
      });
    }
  }

  // SSD Page & Erase Block Configuration
  const numEraseBlocks = 4;
  const pagesPerBlock = Math.ceil(totalBlocks / numEraseBlocks);

  const eraseBlocks = [];
  for (let b = 0; b < numEraseBlocks; b++) {
    const startIdx = b * pagesPerBlock;
    const endIdx = Math.min((b + 1) * pagesPerBlock, totalBlocks);
    const pages = [];
    for (let p = startIdx; p < endIdx; p++) {
      const block = blocks[p] || { id: p, status: 'free' };
      const isStale = staleBlocks.includes(p);
      const isAllocated = block.status === 'allocated';
      const theme = getFileTheme(block.fileId);
      const isHovered = hoveredBlockId === p || (hoveredFileId && hoveredFileId === block.fileId);

      pages.push({
        id: p,
        eraseBlockId: b,
        pageInBlock: p - startIdx,
        status: isAllocated ? 'valid' : isStale ? 'stale' : 'free',
        fileId: block.fileId,
        theme,
        isHovered,
      });
    }
    eraseBlocks.push({
      id: b,
      startIdx,
      endIdx: endIdx - 1,
      pages,
    });
  }

  // SSD Metrics
  const validPagesCount = blocks.filter(b => b.status === 'allocated').length;
  const stalePagesCount = staleBlocks.length;
  const freePagesCount = Math.max(0, totalBlocks - validPagesCount - stalePagesCount);

  return (
    <div className="bg-[#0f1011] border border-[#23252a] rounded-[12px] p-5 md:p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] space-y-6">
      
      {/* Header section & Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#23252a]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-mono bg-[#161718] border border-[#23252a] text-[#e4f222] mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e4f222]"></span>
            Physical Hardware Media Allocation
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-[#ffffff] font-sans">
            HDD Sectors &amp; SSD Flash Pages Mapper
          </h2>
          <p className="text-xs text-[#8a8f98] mt-0.5 max-w-2xl">
            Real-time physical mapping of logical blocks onto magnetic HDD concentric sectors and solid-state NAND flash erase blocks.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center bg-[#161718] p-1 rounded-lg border border-[#23252a] text-xs font-mono self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('both')}
            className={`px-3 py-1.5 rounded transition-all ${
              activeTab === 'both' ? 'bg-[#08090a] text-[#ffffff] font-semibold border border-[#23252a]' : 'text-[#8a8f98] hover:text-[#ffffff]'
            }`}
          >
            Dual View
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('hdd')}
            className={`px-3 py-1.5 rounded transition-all ${
              activeTab === 'hdd' ? 'bg-[#08090a] text-[#ffffff] font-semibold border border-[#23252a]' : 'text-[#8a8f98] hover:text-[#ffffff]'
            }`}
          >
            HDD Platter
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ssd')}
            className={`px-3 py-1.5 rounded transition-all ${
              activeTab === 'ssd' ? 'bg-[#08090a] text-[#ffffff] font-semibold border border-[#23252a]' : 'text-[#8a8f98] hover:text-[#ffffff]'
            }`}
          >
            NAND SSD
          </button>
        </div>
      </div>

      {/* Grid: HDD Platter (Left) and SSD Erase Blocks (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ======================================================== */}
        {/* A. MAGNETIC HDD CONCENTRIC SECTOR & TRACK MAPPER */}
        {/* ======================================================== */}
        {(activeTab === 'both' || activeTab === 'hdd') && (
          <div className={`${activeTab === 'both' ? 'lg:col-span-6' : 'lg:col-span-12'} bg-[#08090a] border border-[#23252a] rounded-xl p-4 md:p-5 flex flex-col justify-between space-y-4 relative overflow-hidden`}>
            
            <div className="flex items-center justify-between pb-3 border-b border-[#23252a]">
              <div className="flex items-center gap-2">
                <Disc size={16} className={`text-[#e4f222] ${seekAnimation ? 'animate-spin' : ''}`} />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#ffffff] font-mono">
                  Magnetic HDD Platter &amp; Sectors
                </h3>
              </div>
              <span className="text-[11px] font-mono text-[#8a8f98]">
                {numTracks} Tracks &bull; {sectorsPerTrack} Sectors/Track
              </span>
            </div>

            {/* Logical to Physical Monospace Formula */}
            <div className="bg-[#161718] border border-[#23252a] p-2.5 rounded-[6px] text-[11px] font-mono text-[#8a8f98] flex flex-wrap items-center justify-between gap-2">
              <span className="text-[#ffffff]">LBA Translation:</span>
              <span>
                Track = &lfloor;Block / {sectorsPerTrack}&rfloor;, Sector = Block % {sectorsPerTrack}
              </span>
            </div>

            {/* Concentric Platter SVG Canvas */}
            <div className="relative w-full flex items-center justify-center py-2">
              <svg 
                viewBox="0 0 340 340" 
                className="w-full max-w-[320px] aspect-square overflow-visible select-none drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
              >
                {/* Platter Outer Bezel & Shadow */}
                <circle cx={cx} cy={cy} r={rOuter + 6} fill="#0d0e10" stroke="#23252a" strokeWidth="2" />
                <circle cx={cx} cy={cy} r={rOuter + 1} fill="#141518" stroke="#1f2125" strokeWidth="1" />

                {/* Concentric Track Guidelines */}
                {Array.from({ length: numTracks + 1 }).map((_, i) => (
                  <circle
                    key={`track-guide-${i}`}
                    cx={cx}
                    cy={cy}
                    r={rInner + i * trackWidth}
                    fill="none"
                    stroke="#23252a"
                    strokeWidth="0.8"
                    strokeDasharray="2 2"
                  />
                ))}

                {/* Render All Sectors */}
                {sectors.map((sec) => {
                  let fillColor = '#141518';
                  let strokeColor = '#23252a';
                  let strokeWidth = '1';

                  if (sec.isAllocated && sec.theme) {
                    fillColor = sec.theme.bg;
                    strokeColor = sec.theme.border;
                  }

                  if (sec.isHovered) {
                    strokeColor = '#ffffff';
                    strokeWidth = '2';
                    fillColor = sec.theme ? sec.theme.fill : 'rgba(255,255,255,0.2)';
                  } else if (sec.isTarget) {
                    strokeColor = '#e4f222';
                    strokeWidth = '1.8';
                  }

                  return (
                    <path
                      key={`sector-${sec.blockId}`}
                      d={sec.d}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      className="cursor-pointer transition-colors duration-150"
                      onMouseEnter={(e) => {
                        if (onHoverSector) {
                          onHoverSector(sec.blockId, sec.fileId);
                        }
                        setTooltipData({
                          blockId: sec.blockId,
                          track: sec.track,
                          sector: sec.sector,
                          fileId: sec.fileId,
                          x: e.clientX,
                          y: e.clientY,
                        });
                      }}
                      onMouseLeave={() => {
                        if (onHoverSector) {
                          onHoverSector(null, null);
                        }
                        setTooltipData(null);
                      }}
                    />
                  );
                })}

                {/* Spindle Hub (Center Hole) */}
                <circle cx={cx} cy={cy} r={rInner} fill="#1b1c20" stroke="#23252a" strokeWidth="2" />
                <circle cx={cx} cy={cy} r={rInner - 12} fill="#0b0c0e" stroke="#e4f222" strokeWidth="1" />
                <circle cx={cx} cy={cy} r={4} fill="#e4f222" />

                {/* Simulated Read/Write Head Arm */}
                <g className="transition-all duration-300 ease-out pointer-events-none">
                  {/* Actuator Base */}
                  <circle cx={armPivotX} cy={armPivotY} r={16} fill="#161718" stroke="#383b3f" strokeWidth="2" />
                  <circle cx={armPivotX} cy={armPivotY} r={6} fill="#e4f222" />

                  {/* Actuator Arm Lever */}
                  <line
                    x1={armPivotX}
                    y1={armPivotY}
                    x2={headTargetX}
                    y2={headTargetY}
                    stroke="#8a8f98"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="drop-shadow-md"
                  />
                  {/* Read/Write Head Slider Tip */}
                  <circle cx={headTargetX} cy={headTargetY} r={5} fill="#08090a" stroke="#e4f222" strokeWidth="2" />
                  <circle cx={headTargetX} cy={headTargetY} r={2} fill="#e4f222" className="animate-ping" />
                </g>
              </svg>
            </div>

            {/* Platter Legend & Arm Telemetry */}
            <div className="pt-3 border-t border-[#23252a] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#8a8f98]">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-[2px] bg-[#141518] border border-[#23252a]"></span>
                  Free Sector
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-[2px] bg-[#e4f222]/40 border border-[#e4f222]"></span>
                  Allocated Sector
                </span>
              </div>
              <div className="text-[11px] text-[#ffffff] flex items-center gap-1.5">
                <span className="text-[#8a8f98]">Head Arm:</span>
                <span className="text-[#e4f222]">Track {targetTrack}, Sector {targetSector} (Block {targetBlockId})</span>
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* B. NAND FLASH SSD PAGE & ERASE BLOCK MAPPER */}
        {/* ======================================================== */}
        {(activeTab === 'both' || activeTab === 'ssd') && (
          <div className={`${activeTab === 'both' ? 'lg:col-span-6' : 'lg:col-span-12'} bg-[#08090a] border border-[#23252a] rounded-xl p-4 md:p-5 flex flex-col justify-between space-y-4`}>
            
            <div className="flex items-center justify-between pb-3 border-b border-[#23252a]">
              <div className="flex items-center gap-2">
                <Layers size={16} className="text-[#27a644]" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#ffffff] font-mono">
                  NAND Flash SSD Erase Blocks &amp; Pages
                </h3>
              </div>
              <span className="text-[11px] font-mono text-[#8a8f98]">
                {numEraseBlocks} Erase Blocks &bull; {pagesPerBlock} Pages/Block
              </span>
            </div>

            {/* SSD Telemetry HUD */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
              <div className="p-2 rounded bg-[#161718] border border-[#23252a]">
                <span className="text-[10px] text-[#8a8f98] block">VALID PAGES</span>
                <span className="text-sm font-semibold text-[#27a644]">{validPagesCount}</span>
              </div>
              <div className="p-2 rounded bg-[#161718] border border-[#23252a]">
                <span className="text-[10px] text-[#8a8f98] block">STALE PAGES</span>
                <span className="text-sm font-semibold text-[#eb5757]">{stalePagesCount}</span>
              </div>
              <div className="p-2 rounded bg-[#161718] border border-[#23252a]">
                <span className="text-[10px] text-[#8a8f98] block">FREE PAGES</span>
                <span className="text-sm font-semibold text-[#ffffff]">{freePagesCount}</span>
              </div>
              <div className="p-2 rounded bg-[#161718] border border-[#23252a]">
                <span className="text-[10px] text-[#8a8f98] block">ERASE CYCLES</span>
                <span className="text-sm font-semibold text-[#e4f222]">{eraseCycles}</span>
              </div>
            </div>

            {/* FTL Trim / Garbage Collection Banner */}
            <div className="flex items-center justify-between p-2.5 rounded-[6px] bg-[#161718] border border-[#23252a] text-xs font-mono">
              <div className="flex items-center gap-2">
                <Cpu size={14} className="text-[#2dd4bf]" />
                <span className="text-[#8a8f98]">FTL Status:</span>
                <span className={stalePagesCount > 0 ? 'text-[#eb5757] font-semibold' : 'text-[#27a644]'}>
                  {stalePagesCount > 0 ? `${stalePagesCount} Stale Pages (Garbage Collection Recommended)` : 'Optimal (Clean Cells)'}
                </span>
              </div>
              {stalePagesCount > 0 && onTriggerSSDErase && (
                <button
                  type="button"
                  onClick={onTriggerSSDErase}
                  className="px-2.5 py-1 rounded bg-[#27a644]/20 hover:bg-[#27a644]/30 border border-[#27a644]/40 text-[#27a644] text-[11px] font-medium transition-colors flex items-center gap-1"
                >
                  <RefreshCw size={11} />
                  <span>TRIM / Erase Dirty Blocks</span>
                </button>
              )}
            </div>

            {/* Erase Blocks Sub-Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {eraseBlocks.map((eb) => (
                <div key={`eb-${eb.id}`} className="p-3 rounded-[8px] bg-[#121316] border border-[#23252a] space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="font-semibold text-[#ffffff]">Erase Block {eb.id}</span>
                    <span className="text-[#62666d]">Pages {String(eb.startIdx).padStart(2, '0')}-{String(eb.endIdx).padStart(2, '0')}</span>
                  </div>

                  {/* Flash Pages Grid inside this Erase Block */}
                  <div 
                    className="grid gap-1"
                    style={{
                      gridTemplateColumns: `repeat(${eb.pages.length <= 9 ? 3 : eb.pages.length <= 16 ? 4 : 5}, minmax(0, 1fr))`
                    }}
                  >
                    {eb.pages.map((page) => {
                      const isStale = page.status === 'stale';
                      const isValid = page.status === 'valid';

                      return (
                        <div
                          key={`page-${page.id}`}
                          onMouseEnter={() => {
                            if (onHoverPage) {
                              onHoverPage(page.id, page.fileId);
                            }
                          }}
                          onMouseLeave={() => {
                            if (onHoverPage) {
                              onHoverPage(null, null);
                            }
                          }}
                          style={
                            isValid && page.theme
                              ? {
                                  backgroundColor: page.theme.bg,
                                  borderColor: page.isHovered ? '#ffffff' : page.theme.border,
                                  color: page.theme.text,
                                }
                              : undefined
                          }
                          className={`relative aspect-square rounded-[4px] border flex flex-col items-center justify-center text-[9px] font-mono transition-all cursor-pointer ${
                            isValid
                              ? 'text-[#ffffff] font-medium'
                              : isStale
                              ? 'bg-[#eb5757]/15 border-[#eb5757]/50 text-[#eb5757]'
                              : 'bg-[#08090a] border-[#23252a] text-[#62666d] hover:border-[#383b3f]'
                          } ${page.isHovered ? 'ring-1 ring-[#ffffff] z-10 scale-105' : ''}`}
                          title={`Page ${page.id}: ${page.status.toUpperCase()}${page.fileId ? ` (${page.fileId})` : ''}`}
                        >
                          <span>{String(page.id).padStart(2, '0')}</span>
                          {/* Stale strikethrough slash */}
                          {isStale && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <span className="text-[12px] text-[#eb5757] font-bold select-none">&times;</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* SSD Legend */}
            <div className="pt-3 border-t border-[#23252a] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#8a8f98]">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-[2px] bg-[#08090a] border border-[#23252a]"></span>
                  Free/Erased
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-[2px] bg-[#27a644]/30 border border-[#27a644]"></span>
                  Valid Programmed
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-[2px] bg-[#eb5757]/20 border border-[#eb5757] text-[#eb5757] flex items-center justify-center text-[8px] font-bold">&times;</span>
                  Stale / Invalid
                </span>
              </div>
              <span className="text-[11px] text-[#62666d]">NAND Out-of-Place Writes</span>
            </div>

          </div>
        )}

      </div>

      {/* Floating Hover Tooltip */}
      {tooltipData && (
        <div 
          className="fixed pointer-events-none z-50 px-3 py-1.5 rounded-[6px] bg-[#161718] border border-[#23252a] text-[#ffffff] font-mono text-xs shadow-2xl space-y-0.5"
          style={{
            left: `${tooltipData.x + 12}px`,
            top: `${tooltipData.y + 12}px`,
          }}
        >
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#e4f222]">Block #{tooltipData.blockId}</span>
            <span className="text-[#8a8f98]">(LBA: 0x{tooltipData.blockId.toString(16).toUpperCase()})</span>
          </div>
          <div className="text-[11px] text-[#8a8f98]">
            Track: <span className="text-[#ffffff]">{tooltipData.track}</span> &bull; Sector: <span className="text-[#ffffff]">{tooltipData.sector}</span>
          </div>
          {tooltipData.fileId ? (
            <div className="text-[11px] text-[#27a644]">
              File: <span className="font-medium text-[#ffffff]">{tooltipData.fileId}</span>
            </div>
          ) : (
            <div className="text-[11px] text-[#8a8f98]">Status: Free Sector</div>
          )}
        </div>
      )}

    </div>
  );
}
