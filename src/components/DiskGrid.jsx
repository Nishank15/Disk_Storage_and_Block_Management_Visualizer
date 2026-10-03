import React, { useState, useRef, useEffect } from 'react';
import BlockCard from './BlockCard';

const createBezierPath = (p1, p2) => {
  const dx = p2.x - p1.x;
  // Curve intensity based on distance
  const cx1 = p1.x + dx * 0.2;
  const cy1 = p1.y - 35;
  const cx2 = p2.x - dx * 0.2;
  const cy2 = p2.y - 35;
  return `M ${p1.x},${p1.y} C ${cx1},${cy1} ${cx2},${cy2} ${p2.x},${p2.y}`;
};

export default function DiskGrid({ blocks, seekAnimation }) {
  const [hoveredFile, setHoveredFile] = useState(null);
  const [svgPaths, setSvgPaths] = useState([]);
  const gridRef = useRef(null);

  // Calculates the SVG path lines when a file is hovered
  useEffect(() => {
    if (!hoveredFile || !gridRef.current) {
      setSvgPaths([]);
      return;
    }

    const gridEl = gridRef.current;
    const blockEls = gridEl.querySelectorAll('.block-card');
    if (blockEls.length === 0) return;

    const fileBlocks = blocks.filter(b => b.fileId === hoveredFile);
    if (fileBlocks.length === 0) return;

    const getCenter = (id) => {
      const el = blockEls[id];
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const gridRect = gridEl.getBoundingClientRect();
      return {
        x: rect.left - gridRect.left + rect.width / 2,
        y: rect.top - gridRect.top + rect.height / 2
      };
    };

    const paths = [];

    fileBlocks.forEach(block => {
      const start = getCenter(block.id);
      if (!start) return;

      // Draw linked pointer
      if (block.next !== null && block.next !== -1) {
        const end = getCenter(block.next);
        if (end) {
          paths.push(createBezierPath(start, end));
        }
      }

      // Draw index pointers
      if (block.type === 'index' && block.pointers && block.pointers.length > 0) {
        block.pointers.forEach(targetId => {
          const end = getCenter(targetId);
          if (end) {
            paths.push(createBezierPath(start, end));
          }
        });
      }
    });

    setSvgPaths(paths);
  }, [hoveredFile, blocks]);

  return (
    <div className="relative w-full" ref={gridRef}>
      <div className="grid grid-cols-10 gap-2 md:gap-2.5">
        {blocks.map((block) => {
          const isHovered = hoveredFile === block.fileId;
          const isSeekActive = seekAnimation && seekAnimation.name === block.fileId;

          return (
            <div key={block.id} className="block-card">
              <BlockCard 
                block={block} 
                isHovered={isHovered} 
                onHover={setHoveredFile} 
                isSeekActive={isSeekActive}
              />
            </div>
          );
        })}
      </div>

      {/* SVG Overlay for Vector Pointers */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible">
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#e4f222" />
          </marker>
        </defs>
        {svgPaths.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="#e4f222"
            strokeWidth="2"
            strokeDasharray="4,4"
            markerEnd="url(#arrowhead)"
            className="opacity-90 animate-pulse drop-shadow-[0_0_6px_rgba(228,242,34,0.4)]"
          />
        ))}
      </svg>
    </div>
  );
}
