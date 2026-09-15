import React, { useState } from 'react';
import { ALLOCATION_STRATEGIES } from '../hooks/useDiskEngine';
import { Plus, RotateCw, AlertTriangle, BatteryCharging, Eraser } from 'lucide-react';

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
    // Attempt to trigger external fragmentation
    onClear();
    setTimeout(() => {
      onAllocate('A', 5, ALLOCATION_STRATEGIES.CONTIGUOUS_FIRST_FIT);
      onAllocate('B', 3, ALLOCATION_STRATEGIES.CONTIGUOUS_FIRST_FIT);
      onAllocate('C', 4, ALLOCATION_STRATEGIES.CONTIGUOUS_FIRST_FIT);
      onAllocate('D', 2, ALLOCATION_STRATEGIES.CONTIGUOUS_FIRST_FIT);
      
      // Delete B and D to create holes of 3 and 2
      // Then try to allocate size 5 -> should trigger Fragmentation
      // We will do this via timeout so the engine state updates in sequence if needed
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
      
      {/* Metrics */}
      <div>
        <div className="flex justify-between text-sm font-medium mb-2">
          <span>Storage Usage</span>
          <span>{usedBlocks} / {totalBlocks} ({usagePercentage}%)</span>
        </div>
        <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-brand-violet transition-all duration-500 ease-out"
            style={{ width: `${usagePercentage}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleAllocate} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">File / Table Name</label>
          <input 
            type="text" 
            required 
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-cyan focus:outline-none transition-shadow"
            placeholder="e.g., Users.tbl"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Size (Blocks)</label>
            <input 
              type="number" 
              required 
              min="1" 
              max="100"
              value={fileSize}
              onChange={(e) => setFileSize(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-cyan focus:outline-none transition-shadow"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Strategy</label>
            <select 
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-cyan focus:outline-none transition-shadow"
            >
              {Object.values(ALLOCATION_STRATEGIES).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-brand-violet hover:bg-indigo-600 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md mt-2"
        >
          <Plus size={18} /> Allocate Blocks
        </button>
      </form>

      <hr className="border-light-border dark:border-dark-border" />

      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={onDefragment}
          className="bg-brand-emerald/10 hover:bg-brand-emerald/20 text-brand-emerald border border-brand-emerald/30 font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
        >
          <RotateCw size={16} /> Defragment
        </button>
        <button 
          onClick={onClear}
          className="bg-brand-rose/10 hover:bg-brand-rose/20 text-brand-rose border border-brand-rose/30 font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
        >
          <Eraser size={16} /> Factory Reset
        </button>
        <button 
          onClick={handleFragmentationPreset}
          className="col-span-2 bg-brand-warning/10 hover:bg-brand-warning/20 text-amber-600 dark:text-amber-500 border border-brand-warning/30 font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
        >
          <AlertTriangle size={16} /> Preset: Trigger Fragmentation
        </button>
        <button 
          onClick={handleSaturationPreset}
          className="col-span-2 bg-brand-cyan/10 hover:bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30 font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
        >
          <BatteryCharging size={16} /> Preset: 90% Saturation
        </button>
      </div>
      
    </div>
  );
}
