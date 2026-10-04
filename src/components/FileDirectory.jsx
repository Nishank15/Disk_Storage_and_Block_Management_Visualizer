import React from 'react';
import { Trash2, Search, File as FileIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FileDirectory({ 
  files, 
  onDelete, 
  onSeek,
  hoveredFileId = null,
  onHoverFile,
}) {
  const totalAllocatedBlocks = files.reduce((acc, f) => acc + (f.size || 0), 0);

  if (files.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[320px] text-[#62666d] border border-dashed border-[#23252a] rounded-[8px] p-6 text-center">
        <FileIcon size={32} className="mb-2.5 opacity-40 text-[#8a8f98]" />
        <p className="text-xs font-medium text-[#d0d6e0]">No active file allocations in FAT</p>
        <p className="text-[11px] text-[#62666d] mt-1 font-mono">Use the allocation panel above or upload a dataset to stage files.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-between h-full space-y-3">
      {/* Scrollable File List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[460px] min-h-[320px]">
        <AnimatePresence>
          {files.map((file) => {
            const isHovered = hoveredFileId === file.name;

            return (
              <motion.div
                key={file.name}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onMouseEnter={() => onHoverFile && onHoverFile(file.name)}
                onMouseLeave={() => onHoverFile && onHoverFile(null)}
                className={`flex items-center justify-between p-3 rounded-[6px] border transition-all cursor-pointer ${
                  isHovered
                    ? 'bg-[#1c1e22] border-[#e4f222] shadow-[0_0_12px_rgba(228,242,34,0.15)]'
                    : 'bg-[#161718] border-[#23252a] hover:border-[#383b3f]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div 
                    className="w-2.5 h-2.5 rounded-full shrink-0" 
                    style={{ backgroundColor: file.color || '#e4f222' }}
                  />
                  <div className="min-w-0">
                    <h4 className="font-mono text-xs font-semibold text-[#ffffff] truncate">{file.name}</h4>
                    <p className="text-[10px] font-mono text-[#8a8f98] uppercase tracking-wider">
                      {file.strategy} &bull; {file.size} BLOCKS
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onSeek(file); }}
                    className="p-1.5 text-[#8a8f98] hover:text-[#e4f222] hover:bg-[#23252a] rounded-[4px] transition-colors"
                    title="Simulate Disk Seek"
                  >
                    <Search size={14} />
                  </button>
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onDelete(file.name); }}
                    className="p-1.5 text-[#8a8f98] hover:text-[#eb5757] hover:bg-[#eb5757]/10 rounded-[4px] transition-colors"
                    title="Delete File"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Directory Footer Telemetry */}
      <div className="pt-3 border-t border-[#23252a] flex items-center justify-between text-[11px] font-mono text-[#8a8f98]">
        <span>FAT Entries: <strong className="text-[#ffffff]">{files.length} Files</strong></span>
        <span>Allocated: <strong className="text-[#e4f222]">{totalAllocatedBlocks} Blocks</strong></span>
      </div>
    </div>
  );
}
