import React from 'react';
import { motion } from 'framer-motion';
import { File, Key, ArrowRight } from 'lucide-react';

// Curated high-contrast technical palette for allocated files (Linear aesthetic)
const FILE_THEMES = [
  { bg: 'rgba(228, 242, 34, 0.08)', border: '#e4f222', text: '#e4f222', badge: 'rgba(228, 242, 34, 0.2)' },
  { bg: 'rgba(39, 166, 68, 0.08)', border: '#27a644', text: '#27a644', badge: 'rgba(39, 166, 68, 0.2)' },
  { bg: 'rgba(64, 150, 255, 0.08)', border: '#4096ff', text: '#4096ff', badge: 'rgba(64, 150, 255, 0.2)' },
  { bg: 'rgba(235, 87, 87, 0.08)', border: '#eb5757', text: '#eb5757', badge: 'rgba(235, 87, 87, 0.2)' },
  { bg: 'rgba(245, 158, 11, 0.08)', border: '#f59e0b', text: '#f59e0b', badge: 'rgba(245, 158, 11, 0.2)' },
  { bg: 'rgba(168, 85, 247, 0.08)', border: '#a855f7', text: '#a855f7', badge: 'rgba(168, 85, 247, 0.2)' },
  { bg: 'rgba(45, 212, 191, 0.08)', border: '#2dd4bf', text: '#2dd4bf', badge: 'rgba(45, 212, 191, 0.2)' },
];

export default function BlockCard({ 
  block, 
  isHovered, 
  onHover, 
  isSeekActive, 
  dimension = 10,
  hoveredBlockId = null,
  hoveredFileId = null,
}) {
  const { id, status, fileId, type, next, pointers } = block;

  const isAllocated = status === 'allocated';
  const isIndex = type === 'index';
  const isCompact = dimension >= 12 || id >= 100;
  
  // Cross-component sync
  const isDirectlyHovered = isHovered || hoveredBlockId === id || (hoveredFileId && hoveredFileId === fileId);

  // Hash fileId to get consistent theme
  let theme = null;
  if (isAllocated && fileId) {
    const hash = fileId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    theme = FILE_THEMES[hash % FILE_THEMES.length];
  }

  return (
    <motion.div
      layout
      onMouseEnter={() => onHover && onHover(id, fileId)}
      onMouseLeave={() => onHover && onHover(null, null)}
      style={
        isAllocated && theme
          ? {
              backgroundColor: isSeekActive ? 'rgba(228, 242, 34, 0.2)' : theme.bg,
              borderColor: isSeekActive ? '#e4f222' : isDirectlyHovered ? '#ffffff' : theme.border,
            }
          : undefined
      }
      className={`relative flex flex-col items-center justify-center aspect-square rounded-[6px] border transition-all duration-150 cursor-pointer group ${
        !isAllocated 
          ? isDirectlyHovered 
            ? 'bg-[#161718] border-[#ffffff] text-[#ffffff] ring-1 ring-[#ffffff]' 
            : 'bg-[#0f1011] border-[#23252a] text-[#62666d] hover:border-[#383b3f]' 
          : 'text-[#ffffff]'
      } ${
        isSeekActive
          ? 'ring-2 ring-[#e4f222] shadow-[0_0_15px_rgba(228,242,34,0.4)] z-20 scale-105'
          : isDirectlyHovered && isAllocated
          ? 'ring-1 ring-[#ffffff] shadow-[0_0_12px_rgba(255,255,255,0.2)] z-10 scale-[1.02]'
          : ''
      }`}
    >
      {/* Block Address in Monospace */}
      <span className={`${isCompact ? 'text-[7.5px]' : 'text-[9px]'} font-mono absolute top-0.5 sm:top-1 left-1 opacity-60 select-none`}>
        {String(id).padStart(2, '0')}
      </span>
      
      {isAllocated ? (
        <div className="flex flex-col items-center justify-center w-full px-1">
          {isIndex ? (
            <Key size={isCompact ? 11 : 14} className="text-[#e4f222] mb-0.5" />
          ) : (
            <File size={isCompact ? 11 : 14} style={{ color: theme?.text }} className="mb-0.5" />
          )}
          <span 
            className={`${isCompact ? 'text-[7.5px]' : 'text-[9px]'} font-mono font-medium truncate w-full text-center px-0.5`}
            style={{ color: theme?.text }}
          >
            {fileId}
          </span>
        </div>
      ) : (
        <span className={`${isCompact ? 'w-1 h-1' : 'w-1.5 h-1.5'} rounded-full bg-[#23252a] group-hover:bg-[#383b3f] transition-colors`}></span>
      )}

      {/* Hover Tooltip */}
      {isAllocated && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#161718] border border-[#23252a] text-[#ffffff] text-xs py-1.5 px-3 rounded-[6px] opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-30 transition-all shadow-xl font-mono">
          <div className="font-semibold text-[#ffffff] mb-0.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme?.text }} />
            {fileId} <span className="text-[#8a8f98] font-normal">(Block {id})</span>
          </div>
          {type && <div className="text-[11px] text-[#8a8f98]">Type: <span className="text-[#e4f222]">{type}</span></div>}
          {next !== null && next !== -1 && (
            <div className="text-[11px] text-[#8a8f98] flex items-center gap-1">
              Pointer: <ArrowRight size={10} className="text-[#e4f222]"/> {next}
            </div>
          )}
          {pointers && pointers.length > 0 && (
            <div className="text-[11px] text-[#8a8f98]">Pointers: [{pointers.join(', ')}]</div>
          )}
          {next === -1 && <div className="text-[11px] text-[#eb5757] font-bold">EOF (End of File)</div>}
        </div>
      )}
    </motion.div>
  );
}
