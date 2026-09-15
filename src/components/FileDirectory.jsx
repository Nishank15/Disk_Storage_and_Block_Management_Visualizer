import React from 'react';
import { Trash2, Search, File as FileIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FileDirectory({ files, onDelete, onSeek }) {
  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-slate-400">
        <FileIcon size={32} className="mb-2 opacity-50" />
        <p className="text-sm">No files allocated yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto custom-scrollbar max-h-64 pr-2">
      <AnimatePresence>
        {files.map((file) => (
          <motion.div
            key={file.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex items-center justify-between p-3 mb-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: file.color }}
              />
              <div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{file.name}</h4>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                  {file.strategy} &bull; {file.size} BLOCKS
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => onSeek(file)}
                className="p-2 text-brand-cyan hover:bg-brand-cyan/10 rounded-lg transition-colors"
                title="Simulate Disk Seek"
              >
                <Search size={16} />
              </button>
              <button 
                onClick={() => onDelete(file.name)}
                className="p-2 text-brand-rose hover:bg-brand-rose/10 rounded-lg transition-colors"
                title="Delete File"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
