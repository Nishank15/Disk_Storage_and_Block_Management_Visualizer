import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowDown, ArrowUp } from 'lucide-react';

export default function SlottedPageViewer({ 
  blockSize, 
  schema, 
  records, 
  selectedBlockIndex, 
  onSelectBlock 
}) {
  const [highlightedSlot, setHighlightedSlot] = useState(null);

  // Calculate parameters
  const sumFieldBytes = schema.reduce((acc, f) => acc + Number(f.bytes), 0);
  const recordHeaderBytes = 4;
  const tupleBytes = sumFieldBytes + recordHeaderBytes; // R
  const blockingFactor = Math.max(1, Math.floor(blockSize / tupleBytes));
  const totalBlocks = Math.max(1, Math.ceil(records.length / blockingFactor));

  // Active block records slice
  const activeBlock = Math.min(selectedBlockIndex, totalBlocks - 1);
  const blockStartIndex = activeBlock * blockingFactor;
  const blockRecords = records.slice(blockStartIndex, blockStartIndex + blockingFactor);
  const numTuples = blockRecords.length;

  // Header geometry
  const pageHeaderBytes = 24; // Page ID (4B), LSN (8B), Slot Count (2B), Free Space Pointer (2B), Flags (8B)
  const slotEntryBytes = 4; // Offset (2B) + Length (2B)
  const slotDirectoryBytes = numTuples * slotEntryBytes;
  const tuplesTotalBytes = numTuples * tupleBytes;
  const totalUsedBytes = pageHeaderBytes + slotDirectoryBytes + tuplesTotalBytes;
  const freeSpaceBytes = Math.max(0, blockSize - totalUsedBytes);

  // Compute byte offsets for records (growing upwards from end of block: blockSize - tupleBytes, etc.)
  const slotsData = blockRecords.map((rec, idx) => {
    const recordOffset = blockSize - ((idx + 1) * tupleBytes);
    return {
      slotId: idx,
      recordOffset,
      length: tupleBytes,
      record: rec,
      globalIndex: blockStartIndex + idx
    };
  });

  const freeSpaceStart = pageHeaderBytes + slotDirectoryBytes;
  const freeSpaceEnd = blockSize - tuplesTotalBytes;

  return (
    <div className="bg-[#0f1011] border border-[#23252a] rounded-xl p-5 md:p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] space-y-6">
      
      {/* Header & Block Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#23252a]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#e4f222]"></span>
            <h2 className="text-sm font-semibold tracking-wide text-[#ffffff] uppercase font-mono">
              Slotted-Page Block Architecture Visualizer
            </h2>
          </div>
          <p className="text-xs text-[#8a8f98] mt-0.5">
            Internal physical layout of Block {activeBlock}: Header, Slot Directory, Free Space gap, and packed Tuples.
          </p>
        </div>

        {/* Block Stepper Navigator */}
        <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-xs">
          <button
            type="button"
            disabled={activeBlock === 0}
            onClick={() => onSelectBlock(Math.max(0, activeBlock - 1))}
            className="p-1.5 rounded bg-[#161718] border border-[#23252a] text-[#d0d6e0] hover:text-[#ffffff] disabled:opacity-30 disabled:hover:text-[#d0d6e0] transition-colors"
            title="Previous Block"
          >
            <ChevronLeft size={16} />
          </button>
          
          <span className="px-3 py-1 rounded bg-[#161718] border border-[#23252a] text-[#ffffff] font-medium">
            Block <strong className="text-[#e4f222]">{activeBlock}</strong> of {totalBlocks - 1} ({numTuples} tuples)
          </span>

          <button
            type="button"
            disabled={activeBlock >= totalBlocks - 1}
            onClick={() => onSelectBlock(Math.min(totalBlocks - 1, activeBlock + 1))}
            className="p-1.5 rounded bg-[#161718] border border-[#23252a] text-[#d0d6e0] hover:text-[#ffffff] disabled:opacity-30 disabled:hover:text-[#d0d6e0] transition-colors"
            title="Next Block"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Physical Block Anatomy Diagram (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#8a8f98]">
            <span>PHYSICAL BLOCK MEMORY LAYOUT</span>
            <span>CAPACITY: {blockSize} BYTES</span>
          </div>

          <div className="bg-[#08090a] border border-[#23252a] rounded-xl p-4 space-y-3 font-mono text-xs">
            
            {/* 1. Page Header (Top) */}
            <div className="p-3 rounded-lg bg-[#161718] border border-[#23252a] space-y-1.5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#e4f222]"></div>
              <div className="flex items-center justify-between text-[#ffffff] font-semibold text-xs">
                <span>Page Header (Offset 0x0000 &rarr; 0x0018)</span>
                <span className="text-[10px] text-[#e4f222] font-mono">{pageHeaderBytes} Bytes</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[10px] text-[#8a8f98] pt-1">
                <div>Page ID: <strong className="text-[#ffffff]">P_{activeBlock}</strong></div>
                <div>Slot Count: <strong className="text-[#ffffff]">{numTuples}</strong></div>
                <div>Free Ptr: <strong className="text-[#27a644]">0x{freeSpaceStart.toString(16).toUpperCase()}</strong></div>
              </div>
            </div>

            {/* 2. Slot Directory (Grows Downwards) */}
            <div className="p-3 rounded-lg bg-[#161718]/60 border border-[#23252a] space-y-2">
              <div className="flex items-center justify-between text-[#ffffff] text-xs">
                <span className="flex items-center gap-1.5">
                  <ArrowDown size={14} className="text-[#27a644]" />
                  <span>Slot Directory (Array of Pointers &mdash; Grows &darr;)</span>
                </span>
                <span className="text-[10px] text-[#8a8f98]">{slotDirectoryBytes} Bytes</span>
              </div>

              {slotsData.length === 0 ? (
                <div className="text-[11px] text-[#62666d] py-1">No tuples assigned to this block.</div>
              ) : (
                <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                  {slotsData.map((slot) => {
                    const isSelected = highlightedSlot === slot.slotId;
                    return (
                      <div
                        key={slot.slotId}
                        onMouseEnter={() => setHighlightedSlot(slot.slotId)}
                        onMouseLeave={() => setHighlightedSlot(null)}
                        className={`flex items-center justify-between p-1.5 rounded text-[11px] border cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-[#e4f222]/10 border-[#e4f222] text-[#ffffff]'
                            : 'bg-[#08090a] border-[#23252a] text-[#8a8f98] hover:border-[#383b3f]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[#e4f222] font-bold">Slot[{slot.slotId}]</span>
                          <span>&rarr; Offset: <strong className="text-[#ffffff]">0x{slot.recordOffset.toString(16).toUpperCase()}</strong></span>
                        </div>
                        <span className="text-[10px] text-[#8a8f98]">Len: {slot.length}B</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 3. Free Space Zone (Middle) */}
            <div className="p-4 rounded-lg bg-[#0f1011] border border-dashed border-[#383b3f] flex flex-col items-center justify-center text-center space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#8a8f98]">
                <span>Unallocated Free Space Gap</span>
              </div>
              <div className="text-base font-bold text-[#27a644] font-mono">
                {freeSpaceBytes} Bytes Available
              </div>
              <span className="text-[10px] text-[#62666d]">
                Range: [0x{freeSpaceStart.toString(16).toUpperCase()} &bull;&bull; 0x{freeSpaceEnd.toString(16).toUpperCase()}]
              </span>
            </div>

            {/* 4. Tuple Payload Records (Grows Upwards from Bottom) */}
            <div className="p-3 rounded-lg bg-[#161718]/60 border border-[#23252a] space-y-2">
              <div className="flex items-center justify-between text-[#ffffff] text-xs">
                <span className="flex items-center gap-1.5">
                  <ArrowUp size={14} className="text-[#e4f222]" />
                  <span>Tuple Records Payload (Packed Bottom-Up &uarr;)</span>
                </span>
                <span className="text-[10px] text-[#8a8f98]">{tuplesTotalBytes} Bytes</span>
              </div>

              {slotsData.length === 0 ? (
                <div className="text-[11px] text-[#62666d] py-1">No tuples packed.</div>
              ) : (
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  {/* Reverse order to visualize packed from bottom */}
                  {[...slotsData].reverse().map((slot) => {
                    const isSelected = highlightedSlot === slot.slotId;
                    return (
                      <div
                        key={slot.slotId}
                        onMouseEnter={() => setHighlightedSlot(slot.slotId)}
                        onMouseLeave={() => setHighlightedSlot(null)}
                        className={`p-2 rounded text-[11px] border cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-[#e4f222]/10 border-[#e4f222] text-[#ffffff]'
                            : 'bg-[#08090a] border-[#23252a] text-[#8a8f98] hover:border-[#383b3f]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[#ffffff] font-semibold">
                            Tuple #{slot.globalIndex + 1} (Mapped by Slot {slot.slotId})
                          </span>
                          <span className="text-[10px] text-[#e4f222] font-mono">
                            Offset @ 0x{slot.recordOffset.toString(16).toUpperCase()}
                          </span>
                        </div>
                        <div className="text-[10px] text-[#8a8f98] truncate">
                          Payload: {JSON.stringify(slot.record)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Right: Ingested Tuples in this Block (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#8a8f98]">
            <span>RELATIONAL TUPLE INSPECTION</span>
            <span>HOVER TUPLE TO HIGHLIGHT SLOT</span>
          </div>

          <div className="p-4 rounded-xl bg-[#08090a] border border-[#23252a] space-y-3">
            <div className="text-xs text-[#8a8f98] leading-relaxed">
              In slotted-page architectures, relational tuples are never directly addressed by volatile memory pointers. Instead, external indices reference a stable <strong className="text-[#ffffff]">Record ID (RID = Page ID : Slot ID)</strong>.
            </div>

            {/* Table of Records in Block */}
            <div className="overflow-x-auto max-h-[460px] overflow-y-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-[#23252a] text-[#8a8f98] text-[11px]">
                    <th className="py-2 px-2.5">Slot ID</th>
                    {schema.map(f => (
                      <th key={f.name} className="py-2 px-2.5 text-[#ffffff] capitalize">{f.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#23252a] text-[11px]">
                  {slotsData.map((slot) => {
                    const isSelected = highlightedSlot === slot.slotId;
                    return (
                      <tr
                        key={slot.slotId}
                        onMouseEnter={() => setHighlightedSlot(slot.slotId)}
                        onMouseLeave={() => setHighlightedSlot(null)}
                        className={`transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#e4f222]/15 text-[#ffffff]'
                            : 'hover:bg-[#161718] text-[#d0d6e0]'
                        }`}
                      >
                        <td className="py-2.5 px-2.5 text-[#e4f222] font-bold">
                          Slot {slot.slotId}
                        </td>
                        {schema.map(f => (
                          <td key={f.name} className="py-2.5 px-2.5 text-[#8a8f98] truncate max-w-[120px]">
                            {slot.record[f.name] !== undefined ? String(slot.record[f.name]) : '-'}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Selected Tuple Details Box */}
            <div className="p-3 rounded-lg bg-[#161718] border border-[#23252a] text-xs font-mono space-y-1">
              <div className="flex items-center justify-between text-[#ffffff]">
                <span>Active Tuple Pointer:</span>
                <span className="text-[#e4f222]">
                  {highlightedSlot !== null ? `RID = Page ${activeBlock} : Slot ${highlightedSlot}` : 'Hover a row or slot above'}
                </span>
              </div>
              <div className="text-[11px] text-[#8a8f98]">
                {highlightedSlot !== null ? (
                  <span>
                    Pointed Byte Offset: <strong className="text-[#ffffff]">0x{slotsData[highlightedSlot]?.recordOffset.toString(16).toUpperCase()}</strong> ({slotsData[highlightedSlot]?.recordOffset} Bytes)
                  </span>
                ) : (
                  <span>Enables tuple relocation within a page without updating external B+Tree index pointers.</span>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
