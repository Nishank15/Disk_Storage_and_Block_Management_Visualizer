import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BitmapViewer({ blocks }) {
  // Bitmap: 1 = Free, 0 = Allocated (Standard conventions may vary, but prompt specified 1=Free, 0=Allocated)
  
  return (
    <div className="w-full overflow-hidden">
      <div className="flex flex-wrap gap-1 font-mono text-xs select-none">
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
                  color: isFree ? '#10B981' : '#64748B', // Emerald for 1, Slate for 0
                  backgroundColor: isFree ? 'rgba(16, 185, 129, 0.1)' : 'rgba(100, 116, 139, 0.1)'
                }}
                transition={{ duration: 0.3 }}
                className={`w-4 h-5 flex items-center justify-center rounded-[2px] transition-colors`}
                title={`Block ${block.id}: ${isFree ? 'Free' : 'Allocated'}`}
              >
                {bit}
              </motion.span>
            );
          })}
        </AnimatePresence>
      </div>
      <div className="mt-4 flex gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-brand-emerald/20 text-brand-emerald flex items-center justify-center font-mono">1</span> = Free Space
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-slate-500/20 text-slate-500 flex items-center justify-center font-mono">0</span> = Allocated
        </div>
      </div>
    </div>
  );
}
