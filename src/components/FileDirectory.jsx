import React from 'react';
import { Trash2, Search, File as FileIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FileDirectory({ files, onDelete, onSeek }) {
  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-[#62666d]">
        <FileIcon size={28} className="mb-2 opacity-50" />
        <p className="text-xs">No active file allocations in directory.</p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto max-h-64 pr-1 space-y-2">
      <AnimatePresence>
        {files.map((file) => (
          <motion.div
            key={file.name}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center justify-between p-2.5 bg-[#161718] rounded-[6px] border border-[#23252a] hover:border-[#383b3f] transition-colors"
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
                onClick={() => onSeek(file)}
                className="p-1.5 text-[#8a8f98] hover:text-[#e4f222] hover:bg-[#23252a] rounded-[4px] transition-colors"
                title="Simulate Disk Seek"
              >
                <Search size={14} />
              </button>
              <button 
                type="button"
                onClick={() => onDelete(file.name)}
                className="p-1.5 text-[#8a8f98] hover:text-[#eb5757] hover:bg-[#eb5757]/10 rounded-[4px] transition-colors"
                title="Delete File"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
