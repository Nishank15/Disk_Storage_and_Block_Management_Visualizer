import React from 'react';
import { motion } from 'framer-motion';
import { File, Key, ArrowRight } from 'lucide-react';

export default function BlockCard({ block, isHovered, onHover, isSeekActive }) {
  const { id, status, fileId, type, next, pointers } = block;

  const isAllocated = status === 'allocated';
  const isIndex = type === 'index';
  
  // Base classes for the block
  let bgClass = 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400';
  if (isAllocated) {
    // Generate a consistent color based on fileId string
    const hue = fileId ? fileId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360 : 0;
    bgClass = `bg-[hsl(${hue},70%,90%)] dark:bg-[hsl(${hue},70%,20%)] border-[hsl(${hue},70%,50%)] text-[hsl(${hue},70%,30%)] dark:text-[hsl(${hue},70%,80%)] shadow-sm`;
  }

  if (isSeekActive) {
    bgClass = 'bg-brand-warning/30 border-brand-warning text-brand-warning shadow-[0_0_15px_rgba(245,158,11,0.5)]';
  } else if (isHovered && isAllocated) {
    bgClass += ' ring-2 ring-brand-cyan ring-offset-2 ring-offset-light-surface dark:ring-offset-dark-surface';
  }

  return (
    <motion.div
      layout
      onMouseEnter={() => onHover(fileId)}
      onMouseLeave={() => onHover(null)}
      className={`relative flex flex-col items-center justify-center aspect-square rounded-xl border-2 transition-colors cursor-pointer group ${bgClass}`}
    >
      <span className="text-[10px] font-bold absolute top-1 left-1 opacity-50">{id}</span>
      
      {isAllocated && (
        <>
          {isIndex ? (
            <Key size={16} className="mb-1" />
          ) : (
            <File size={16} className="mb-1" />
          )}
          <span className="text-[10px] truncate w-full text-center px-1 font-medium hidden md:block">
            {fileId}
          </span>
        </>
      )}

      {/* Hover Tooltip */}
      {isAllocated && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10 transition-opacity">
          <div><strong>{fileId}</strong> (Block {id})</div>
          {type && <div>Type: {type}</div>}
          {next !== null && next !== -1 && <div className="flex items-center gap-1">Next <ArrowRight size={12}/> {next}</div>}
          {pointers && pointers.length > 0 && <div>Pointers: [{pointers.join(', ')}]</div>}
          {next === -1 && <div className="text-brand-rose">EOF</div>}
        </div>
      )}
    </motion.div>
  );
}
