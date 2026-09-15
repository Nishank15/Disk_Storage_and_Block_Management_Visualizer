import React from 'react';
import { X, HelpCircle, HardDrive, MousePointerClick, Activity } from 'lucide-react';

export default function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-light-surface dark:bg-dark-surface w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-light-border dark:border-dark-border">
        
        <div className="flex justify-between items-center p-6 border-b border-light-border dark:border-dark-border">
          <h2 className="text-2xl font-bold flex items-center gap-3 text-brand-emerald">
            <HelpCircle size={24} />
            User Manual
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
          
          <div className="flex gap-4">
            <div className="mt-1 text-brand-violet"><HardDrive size={24} /></div>
            <div>
              <h3 className="font-bold text-lg mb-1">1. Allocating Files</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Use the <strong>Allocation Control</strong> panel to create files. Enter a unique name, the size (number of blocks), and choose a strategy. Watch as the blocks fill up on the disk grid.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="mt-1 text-brand-cyan"><Activity size={24} /></div>
            <div>
              <h3 className="font-bold text-lg mb-1">2. Understanding the Bitmap</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                The <strong>Free Space Bitmap</strong> below the grid shows `1` for Free and `0` for Allocated blocks. This is how the OS tracks available space.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="mt-1 text-brand-warning"><MousePointerClick size={24} /></div>
            <div>
              <h3 className="font-bold text-lg mb-1">3. Simulating Seeks & Links</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Hover over any allocated block on the grid to see pointer lines drawn to its next block. In the <strong>File Directory</strong>, click the <em>Seek</em> icon to simulate reading the file and watch the benchmark update.
              </p>
            </div>
          </div>

          <div className="bg-brand-rose/10 dark:bg-brand-rose/20 p-4 rounded-xl border border-brand-rose/30 mt-4">
            <h3 className="font-bold text-brand-rose mb-2">Resolving Fragmentation</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              If you receive an <strong>External Fragmentation</strong> error, it means total space is available, but no single continuous chunk fits the file. Click the <strong>Defragment</strong> button in the Allocation panel to pack all files to the beginning of the disk.
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}
