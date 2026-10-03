import React, { useState } from 'react';
import { ALLOCATION_STRATEGIES } from '../hooks/useDiskEngine';
import { Plus, RotateCw, AlertTriangle, BatteryCharging, RotateCcw } from 'lucide-react';

export default function AllocationControl({ onAllocate, onDefragment, onClear, blocks }) {
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(1);
  const [strategy, setStrategy] = useState(ALLOCATION_STRATEGIES.CONTIGUOUS_FIRST_FIT);

  const handleAllocate = (e) => {
    e.preventDefault();
    const success = onAllocate(fileName, fileSize, strategy);
    if (success) {
      setFileName('');
      setFileSize(1);
    }
  };

  const handleFragmentationPreset = () => {
    onClear();
    setTimeout(() => {
      onAllocate('A', 5, ALLOCATION_STRATEGIES.CONTIGUOUS_FIRST_FIT);
      onAllocate('B', 3, ALLOCATION_STRATEGIES.CONTIGUOUS_FIRST_FIT);
      onAllocate('C', 4, ALLOCATION_STRATEGIES.CONTIGUOUS_FIRST_FIT);
      onAllocate('D', 2, ALLOCATION_STRATEGIES.CONTIGUOUS_FIRST_FIT);
    }, 100);
  };

  const handleSaturationPreset = () => {
    onClear();
    setTimeout(() => {
      for (let i = 1; i <= 9; i++) {
        onAllocate(`File_${i}`, 10, ALLOCATION_STRATEGIES.CONTIGUOUS_BEST_FIT);
      }
    }, 100);
  };

  const usedBlocks = blocks.filter(b => b.status === 'allocated').length;
  const totalBlocks = blocks.length;
  const usagePercentage = Math.round((usedBlocks / totalBlocks) * 100);

  return (
    <div className="flex flex-col gap-6">
      
      {/* Storage Usage Metric */}
      <div>
        <div className="flex justify-between text-xs font-mono mb-2">
          <span className="text-[#8a8f98]">CAPACITY USAGE</span>
          <span className="text-[#ffffff] font-medium">{usedBlocks} / {totalBlocks} ({usagePercentage}%)</span>
        </div>
        <div className="w-full h-2 bg-[#161718] border border-[#23252a] rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#e4f222] transition-all duration-500 ease-out"
            style={{ width: `${usagePercentage}%` }}
          />
        </div>
      </div>

      {/* Allocation Form */}
      <form onSubmit={handleAllocate} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-medium text-[#8a8f98] mb-1.5 uppercase tracking-wider">
            File / Table Identifier
          </label>
          <input 
            type="text" 
            required 
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="w-full bg-[#161718] border border-[#23252a] text-[#ffffff] rounded-[6px] px-3 py-2 text-sm placeholder-[#62666d] focus:border-[#e4f222] focus:outline-none transition-colors"
            placeholder="e.g. Users.tbl, Index_01"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#8a8f98] mb-1.5 uppercase tracking-wider">
              Size (Blocks)
            </label>
            <input 
              type="number" 
              required 
              min="1" 
              max="100"
              value={fileSize}
              onChange={(e) => setFileSize(e.target.value)}
              className="w-full bg-[#161718] border border-[#23252a] text-[#ffffff] font-mono rounded-[6px] px-3 py-2 text-sm placeholder-[#62666d] focus:border-[#e4f222] focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#8a8f98] mb-1.5 uppercase tracking-wider">
              Strategy
            </label>
            <select 
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
              className="w-full bg-[#161718] border border-[#23252a] text-[#ffffff] rounded-[6px] px-3 py-2 text-sm focus:border-[#e4f222] focus:outline-none transition-colors"
            >
              {Object.values(ALLOCATION_STRATEGIES).map(s => (
                <option key={s} value={s} className="bg-[#161718] text-[#ffffff]">{s}</option>
              ))}
            </select>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-[#e4f222] hover:brightness-105 active:scale-[0.99] text-[#08090a] font-[510] py-2 rounded-[6px] flex items-center justify-center gap-2 transition-all shadow-sm mt-1"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>Allocate Blocks</span>
        </button>
      </form>

      <div className="h-px bg-[#23252a]" />

      {/* Control Actions */}
      <div className="grid grid-cols-2 gap-2.5">
        <button 
          type="button"
          onClick={onDefragment}
          className="bg-transparent hover:bg-[#161718] text-[#d0d6e0] hover:text-[#ffffff] border border-[#23252a] hover:border-[#383b3f] py-2 px-3 rounded-[6px] flex items-center justify-center gap-2 text-xs font-medium transition-all"
        >
          <RotateCw size={14} className="text-[#27a644]" />
          <span>Defragment</span>
        </button>
        <button 
          type="button"
          onClick={onClear}
          className="bg-transparent hover:bg-[#161718] text-[#eb5757] hover:text-[#eb5757] border border-[#23252a] hover:border-[#eb5757]/40 py-2 px-3 rounded-[6px] flex items-center justify-center gap-2 text-xs font-medium transition-all"
        >
          <RotateCcw size={14} />
          <span>Reset Disk</span>
        </button>
        <button 
          type="button"
          onClick={handleFragmentationPreset}
          className="col-span-2 bg-transparent hover:bg-[#161718] text-[#d0d6e0] hover:text-[#ffffff] border border-[#23252a] hover:border-[#383b3f] py-2 px-3 rounded-[6px] flex items-center justify-center gap-2 text-xs font-medium transition-all"
        >
          <AlertTriangle size={14} className="text-[#e4f222]" />
          <span>Preset: Simulate Fragmentation</span>
        </button>
        <button 
          type="button"
          onClick={handleSaturationPreset}
          className="col-span-2 bg-transparent hover:bg-[#161718] text-[#d0d6e0] hover:text-[#ffffff] border border-[#23252a] hover:border-[#383b3f] py-2 px-3 rounded-[6px] flex items-center justify-center gap-2 text-xs font-medium transition-all"
        >
          <BatteryCharging size={14} className="text-[#8a8f98]" />
          <span>Preset: 90% Saturation</span>
        </button>
      </div>
      
    </div>
  );
}
