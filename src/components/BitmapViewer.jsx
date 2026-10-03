import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BitmapViewer({ blocks }) {
  // Bitmap convention: 1 = Free Space, 0 = Allocated
  return (
    <div className="w-full overflow-hidden">
      <div className="flex flex-wrap gap-1 font-mono text-[11px] select-none">
        <AnimatePresence>
          {blocks.map((block) => {
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
                  color: isFree ? '#27a644' : '#62666d',
                  backgroundColor: isFree ? 'rgba(39, 166, 68, 0.1)' : 'rgba(35, 37, 42, 0.6)'
                }}
                transition={{ duration: 0.2 }}
                className="w-4 h-5 flex items-center justify-center rounded-[3px] border border-[#23252a] font-mono transition-colors"
                title={`Block ${block.id}: ${isFree ? '1 (Free Space)' : '0 (Allocated)'}`}
              >
                {bit}
              </motion.span>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="mt-4 pt-3 border-t border-[#23252a] flex items-center gap-6 text-xs text-[#8a8f98]">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-[3px] bg-[#27a644]/15 border border-[#27a644]/30 text-[#27a644] flex items-center justify-center font-mono text-[10px] font-bold">1</span>
          <span>Free Block (Bit Set)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-[3px] bg-[#23252a] border border-[#383b3f] text-[#62666d] flex items-center justify-center font-mono text-[10px] font-bold">0</span>
          <span>Allocated Block (Bit Cleared)</span>
        </div>
      </div>
    </div>
  );
}
