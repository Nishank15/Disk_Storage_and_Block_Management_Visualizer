import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DiskGrid from './components/DiskGrid';
import AllocationControl from './components/AllocationControl';
import BitmapViewer from './components/BitmapViewer';
import FileDirectory from './components/FileDirectory';
import ExecutionLogs from './components/ExecutionLogs';
import BenchmarkChart from './components/BenchmarkChart';
import { useDiskEngine } from './hooks/useDiskEngine';
import { generatePDFReport } from './utils/pdfReport';

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const diskEngine = useDiskEngine();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const handleDownloadPDF = () => {
    generatePDFReport(diskEngine);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Navbar 
          darkMode={darkMode} 
          toggleTheme={toggleTheme} 
          onDownloadPDF={handleDownloadPDF} 
        />
        
        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Disk Section - 8 cols */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-light-surface dark:bg-dark-surface rounded-3xl p-6 shadow-elevated border border-light-border dark:border-dark-border">
              <h2 className="text-xl font-bold mb-4 font-sans text-brand-violet">Disk Storage (10x10)</h2>
              <DiskGrid blocks={diskEngine.blocks} seekAnimation={diskEngine.seekAnimation} />
            </div>
            
            <div className="bg-light-surface dark:bg-dark-surface rounded-3xl p-6 shadow-elevated border border-light-border dark:border-dark-border">
              <h2 className="text-xl font-bold mb-4 font-sans text-brand-cyan">Free Space Bitmap</h2>
              <BitmapViewer blocks={diskEngine.blocks} />
            </div>
          </div>

          {/* Sidebar Section - 4 cols */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-light-surface dark:bg-dark-surface rounded-3xl p-6 shadow-elevated border border-light-border dark:border-dark-border">
              <h2 className="text-xl font-bold mb-4 font-sans text-brand-emerald">Allocation Control</h2>
              <AllocationControl 
                onAllocate={diskEngine.allocateFile} 
                onDefragment={diskEngine.defragment}
                onClear={diskEngine.clearDisk}
                blocks={diskEngine.blocks}
              />
            </div>
            
            <div className="bg-light-surface dark:bg-dark-surface rounded-3xl p-6 shadow-elevated border border-light-border dark:border-dark-border flex-1 min-h-[300px]">
              <h2 className="text-xl font-bold mb-4 font-sans text-brand-warning">File Directory</h2>
              <FileDirectory 
                files={diskEngine.files} 
                onDelete={diskEngine.deleteFile}
                onSeek={diskEngine.triggerSeekSimulation}
              />
            </div>
          </div>
          
          {/* Bottom Row - Benchmark & Logs */}
          <div className="lg:col-span-6 bg-light-surface dark:bg-dark-surface rounded-3xl p-6 shadow-elevated border border-light-border dark:border-dark-border">
            <h2 className="text-xl font-bold mb-4 font-sans text-brand-rose">Seek Benchmark</h2>
            <BenchmarkChart benchmarkData={diskEngine.benchmarkData} />
          </div>

          <div className="lg:col-span-6 bg-light-surface dark:bg-dark-surface rounded-3xl p-6 shadow-elevated border border-light-border dark:border-dark-border">
            <h2 className="text-xl font-bold mb-4 font-sans text-slate-500 dark:text-slate-400">Execution Logs</h2>
            <ExecutionLogs logs={diskEngine.logs} />
          </div>

        </div>
      </div>
    </div>
  );
}
