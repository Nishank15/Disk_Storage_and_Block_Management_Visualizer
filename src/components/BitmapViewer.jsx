import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BitmapViewer({ blocks }) {
  const totalBits = blocks.length;
  const dimension = Math.round(Math.sqrt(totalBits)) || 10;
  const freeCount = blocks.filter(b => b.status === 'free').length;
  const allocCount = totalBits - freeCount;

  // Group into clean rows matching the matrix dimension
  const rowSize = dimension;
  const rows = [];
  for (let i = 0; i < totalBits; i += rowSize) {
    rows.push({
      startIndex: i,
      endIndex: Math.min(i + rowSize - 1, totalBits - 1),
      bits: blocks.slice(i, i + rowSize)
    });
  }

  return (
    <div className="w-full space-y-3">
      {/* Bit Vector Header Telemetry */}
      <div className="flex flex-wrap items-center justify-between text-xs font-mono pb-2 border-b border-[#23252a]/60">
        <div className="flex items-center gap-2">
          <span className="text-[#8a8f98]">REGISTER:</span>
          <span className="text-[#ffffff] font-semibold">{totalBits}-Bit Vector</span>
          <span className="text-[#62666d]">({dimension} × {dimension})</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[#27a644] font-medium">{freeCount} Free (1s)</span>
          <span className="text-[#62666d]">&bull;</span>
          <span className="text-[#8a8f98] font-medium">{allocCount} Used (0s)</span>
        </div>
      </div>

      {/* Row-by-Row Dynamic Bit Matrix */}
      <div className="space-y-1.5 select-none font-mono">
        <AnimatePresence>
          {rows.map(({ startIndex, endIndex, bits }) => (
            <div key={`row-${startIndex}`} className="flex items-center gap-2">
              <span className="text-[10px] text-[#62666d] font-mono shrink-0 w-16 text-right">
                [{String(startIndex).padStart(2, '0')}-{String(endIndex).padStart(2, '0')}]:
              </span>
              <div className="flex flex-wrap gap-1 items-center flex-1">
                {bits.map((block) => {
                  const isFree = block.status === 'free';
                  const bit = isFree ? '1' : '0';

                  return (
                    <motion.span
                      key={block.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ 
                        opacity: 1, 
                        scale: 1,
                        color: isFree ? '#27a644' : '#8a8f98',
                        backgroundColor: isFree ? 'rgba(39, 166, 68, 0.12)' : 'rgba(35, 37, 42, 0.6)'
                      }}
                      transition={{ duration: 0.15 }}
                      className={`w-4 h-5 flex items-center justify-center rounded-[3px] border font-mono text-[11px] transition-colors ${
                        isFree 
                          ? 'border-[#27a644]/40 font-semibold' 
                          : 'border-[#23252a] text-[#62666d]'
                      }`}
                      title={`Block ${block.id}: ${isFree ? '1 (Free)' : `0 (Allocated to ${block.fileId})`}`}
                    >
                      {bit}
                    </motion.span>
                  );
                })}
              </div>
            </div>
          ))}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="mt-3 pt-3 border-t border-[#23252a] flex flex-wrap items-center justify-between gap-4 text-xs text-[#8a8f98]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-[3px] bg-[#27a644]/15 border border-[#27a644]/40 text-[#27a644] flex items-center justify-center font-mono text-[10px] font-bold">1</span>
            <span>Free Block (Bit Set)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-[3px] bg-[#23252a] border border-[#383b3f] text-[#62666d] flex items-center justify-center font-mono text-[10px] font-bold">0</span>
            <span>Allocated (Bit Cleared)</span>
          </div>
        </div>
        <span className="text-[11px] text-[#62666d] font-mono">
          Memory footprint: {Math.ceil(totalBits / 8)} Bytes
        </span>
      </div>
    </div>
  );
}
