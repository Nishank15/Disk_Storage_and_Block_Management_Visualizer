import React from 'react';
import DiskGrid from '../components/DiskGrid';
import AllocationControl from '../components/AllocationControl';
import BitmapViewer from '../components/BitmapViewer';
import FileDirectory from '../components/FileDirectory';
import ExecutionLogs from '../components/ExecutionLogs';
import BenchmarkChart from '../components/BenchmarkChart';
import { Database, Binary, Sliders, FolderTree, BarChart3, TerminalSquare } from 'lucide-react';

export default function AllocatorPage({ diskEngine }) {
  const { blocks, files, logs, benchmarkData, seekAnimation, allocateFile, defragment, clearDisk, deleteFile, triggerSeekSimulation } = diskEngine;

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 py-6 space-y-6">
      
      {/* Top Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#23252a]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-mono bg-[#161718] border border-[#23252a] text-[#e4f222] mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e4f222]"></span>
            Active Matrix &bull; 100 Physical Blocks (10x10)
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#ffffff] font-sans">
            Block Allocation Engine
          </h1>
          <p className="text-xs md:text-sm text-[#8a8f98] mt-0.5">
            Real-time simulation of Contiguous, Linked List, and Inode-Indexed physical storage allocation algorithms.
          </p>
        </div>

        {/* Quick telemetry pills */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-[6px] bg-[#0f1011] border border-[#23252a] flex items-center gap-2">
            <span className="text-[#8a8f98]">ALLOCATED:</span>
            <span className="text-[#ffffff] font-semibold">
              {blocks.filter(b => b.status === 'allocated').length}
            </span>
          </div>
          <div className="px-3 py-1.5 rounded-[6px] bg-[#0f1011] border border-[#23252a] flex items-center gap-2">
            <span className="text-[#8a8f98]">FREE:</span>
            <span className="text-[#27a644] font-semibold">
              {blocks.filter(b => b.status === 'free').length}
            </span>
          </div>
          <div className="px-3 py-1.5 rounded-[6px] bg-[#0f1011] border border-[#23252a] flex items-center gap-2">
            <span className="text-[#8a8f98]">FILES:</span>
            <span className="text-[#e4f222] font-semibold">
              {files.length}
            </span>
          </div>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Disk Section - 8 cols */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* 10x10 Disk Grid Card */}
          <div className="bg-[#0f1011] border border-[#23252a] rounded-[12px] p-5 md:p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#23252a]">
              <div className="flex items-center gap-2.5">
                <Database size={16} className="text-[#e4f222]" />
                <h2 className="text-sm font-semibold tracking-wide text-[#ffffff] uppercase font-mono">
                  Disk Storage Matrix (10x10)
                </h2>
              </div>
              <span className="text-xs text-[#8a8f98] font-mono">Blocks 00 - 99</span>
            </div>
            <DiskGrid blocks={blocks} seekAnimation={seekAnimation} />
          </div>
          
          {/* Free Space Bitmap Card */}
          <div className="bg-[#0f1011] border border-[#23252a] rounded-[12px] p-5 md:p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#23252a]">
              <div className="flex items-center gap-2.5">
                <Binary size={16} className="text-[#27a644]" />
                <h2 className="text-sm font-semibold tracking-wide text-[#ffffff] uppercase font-mono">
                  Free Space Bitmap Vector
                </h2>
              </div>
              <span className="text-xs text-[#8a8f98] font-mono">1 = Free &bull; 0 = Allocated</span>
            </div>
            <BitmapViewer blocks={blocks} />
          </div>

        </div>

        {/* Sidebar Section - 4 cols */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Allocation Control Card */}
          <div className="bg-[#0f1011] border border-[#23252a] rounded-[12px] p-5 md:p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]">
            <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-[#23252a]">
              <Sliders size={16} className="text-[#e4f222]" />
              <h2 className="text-sm font-semibold tracking-wide text-[#ffffff] uppercase font-mono">
                Allocation Control
              </h2>
            </div>
            <AllocationControl 
              onAllocate={allocateFile} 
              onDefragment={defragment}
              onClear={clearDisk}
              blocks={blocks}
            />
          </div>
          
          {/* File Directory Card */}
          <div className="bg-[#0f1011] border border-[#23252a] rounded-[12px] p-5 md:p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] flex-1 min-h-[300px]">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#23252a]">
              <div className="flex items-center gap-2.5">
                <FolderTree size={16} className="text-[#d0d6e0]" />
                <h2 className="text-sm font-semibold tracking-wide text-[#ffffff] uppercase font-mono">
                  File Allocation Table (FAT)
                </h2>
              </div>
              <span className="text-xs font-mono text-[#8a8f98]">{files.length} active</span>
            </div>
            <FileDirectory 
              files={files} 
              onDelete={deleteFile}
              onSeek={triggerSeekSimulation}
            />
          </div>

        </div>
        
        {/* Bottom Row - Benchmark & Logs */}
        <div className="lg:col-span-6 bg-[#0f1011] border border-[#23252a] rounded-[12px] p-5 md:p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#23252a]">
            <div className="flex items-center gap-2.5">
              <BarChart3 size={16} className="text-[#e4f222]" />
              <h2 className="text-sm font-semibold tracking-wide text-[#ffffff] uppercase font-mono">
                Seek Latency Benchmark
              </h2>
            </div>
            <span className="text-xs font-mono text-[#8a8f98]">Hops per read request</span>
          </div>
          <BenchmarkChart benchmarkData={benchmarkData} />
        </div>

        <div className="lg:col-span-6 bg-[#0f1011] border border-[#23252a] rounded-[12px] p-5 md:p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#23252a]">
            <div className="flex items-center gap-2.5">
              <TerminalSquare size={16} className="text-[#27a644]" />
              <h2 className="text-sm font-semibold tracking-wide text-[#ffffff] uppercase font-mono">
                Kernel Execution Logs
              </h2>
            </div>
            <span className="text-xs font-mono text-[#8a8f98]">System Stream</span>
          </div>
          <ExecutionLogs logs={logs} />
        </div>

      </div>
    </div>
  );
}
