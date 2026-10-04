import React, { useState } from 'react';
import DiskGrid from '../components/DiskGrid';
import AllocationControl from '../components/AllocationControl';
import BitmapViewer from '../components/BitmapViewer';
import FileDirectory from '../components/FileDirectory';
import ExecutionLogs from '../components/ExecutionLogs';
import BenchmarkChart from '../components/BenchmarkChart';
import PhysicalHardwareAllocation from '../components/PhysicalHardwareAllocation';
import { GRID_DIMENSIONS } from '../hooks/useDiskEngine';
import { Database, Binary, Sliders, FolderTree, BarChart3, TerminalSquare } from 'lucide-react';

const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export default function AllocatorPage({ diskEngine }) {
  const { 
    blocks, 
    files, 
    logs, 
    benchmarkData, 
    seekAnimation, 
    allocateFile, 
    allocateUploadedFile,
    defragment, 
    clearDisk, 
    deleteFile, 
    triggerSeekSimulation,
    diskDimension = 10,
    totalBlocks = 100,
    setGridDimension,
    trigger90PercentSaturation,
    triggerFragmentationPreset,
    blockSize = 4096,
    setBlockSize,
    totalDiskBytes = 409600,
    usedDiskBytes = 0,
    staleBlocks = [],
    eraseCycles = 0,
    triggerSSDErase,
    lastAccessedBlock = 0,
  } = diskEngine;

  // Cross-component hover synchronization state
  const [hoveredBlockId, setHoveredBlockId] = useState(null);
  const [hoveredFileId, setHoveredFileId] = useState(null);

  const handleHoverBlock = (blockId, fileId) => {
    setHoveredBlockId(blockId);
    setHoveredFileId(fileId || null);
  };

  const handleHoverFile = (fileId) => {
    setHoveredFileId(fileId);
    setHoveredBlockId(null);
  };

  const allocatedCount = blocks.filter(b => b.status === 'allocated').length;
  const freeCount = blocks.filter(b => b.status === 'free').length;

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 py-6 space-y-6">
      
      {/* Top Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#23252a]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-mono bg-[#161718] border border-[#23252a] text-[#e4f222] mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e4f222]"></span>
            Active Matrix &bull; {totalBlocks} Physical Blocks ({diskDimension}×{diskDimension}) &bull; {blockSize >= 1024 ? `${blockSize / 1024} KB` : `${blockSize} B`} Block Size
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#ffffff] font-sans">
            Block Allocation Engine
          </h1>
          <p className="text-xs md:text-sm text-[#8a8f98] mt-0.5">
            Real-time simulation of Contiguous, Linked List, and Inode-Indexed physical storage allocation with direct HDD sector &amp; SSD flash page mapping.
          </p>
        </div>

        {/* Quick telemetry pills */}
        <div className="flex items-center gap-2.5 text-xs font-mono flex-wrap">
          <div className="px-3 py-1.5 rounded-[6px] bg-[#0f1011] border border-[#23252a] flex items-center gap-2">
            <span className="text-[#8a8f98]">ALLOCATED:</span>
            <span className="text-[#ffffff] font-semibold">
              {allocatedCount} / {totalBlocks} Blocks
            </span>
          </div>
          <div className="px-3 py-1.5 rounded-[6px] bg-[#0f1011] border border-[#23252a] flex items-center gap-2">
            <span className="text-[#8a8f98]">VOLUME:</span>
            <span className="text-[#e4f222] font-semibold">
              {formatBytes(usedDiskBytes)} / {formatBytes(totalDiskBytes)}
            </span>
          </div>
          <div className="px-3 py-1.5 rounded-[6px] bg-[#0f1011] border border-[#23252a] flex items-center gap-2">
            <span className="text-[#8a8f98]">FREE:</span>
            <span className="text-[#27a644] font-semibold">
              {freeCount}
            </span>
          </div>
          <div className="px-3 py-1.5 rounded-[6px] bg-[#0f1011] border border-[#23252a] flex items-center gap-2">
            <span className="text-[#8a8f98]">FILES:</span>
            <span className="text-[#ffffff] font-semibold">
              {files.length}
            </span>
          </div>
        </div>
      </div>

      {/* 1. TOP ROW: Matrix (Left 8 cols) & Allocation Control (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Disk Section - 8 cols */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Configurable Disk Grid Card */}
          <div className="bg-[#0f1011] border border-[#23252a] rounded-[12px] p-5 md:p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[#23252a]">
              <div className="flex items-center gap-2.5">
                <Database size={16} className="text-[#e4f222]" />
                <h2 className="text-sm font-semibold tracking-wide text-[#ffffff] uppercase font-mono">
                  Disk Storage Matrix ({diskDimension}×{diskDimension})
                </h2>
              </div>

              {/* Dynamic Grid Size Segmented Selector */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-[#8a8f98] hidden sm:inline">GRID SIZE:</span>
                <div className="flex items-center bg-[#161718] p-0.5 rounded-[6px] border border-[#23252a]">
                  {GRID_DIMENSIONS.map(({ dimension, label }) => (
                    <button
                      key={dimension}
                      type="button"
                      onClick={() => setGridDimension && setGridDimension(dimension)}
                      className={`px-2.5 py-1 text-[11px] font-mono rounded-[4px] transition-all ${
                        diskDimension === dimension
                          ? 'bg-[#08090a] text-[#e4f222] font-semibold border border-[#23252a] shadow-sm'
                          : 'text-[#8a8f98] hover:text-[#d0d6e0]'
                      }`}
                      title={`${label}`}
                    >
                      {dimension}×{dimension}
                    </button>
                  ))}
                </div>
                <span className="text-xs text-[#8a8f98] font-mono hidden md:inline pl-1">
                  Blocks 00 - {String(totalBlocks - 1).padStart(2, '0')}
                </span>
              </div>
            </div>

            <DiskGrid 
              blocks={blocks} 
              seekAnimation={seekAnimation} 
              dimension={diskDimension}
              hoveredBlockId={hoveredBlockId}
              hoveredFileId={hoveredFileId}
              onHoverBlock={handleHoverBlock}
            />
          </div>

        </div>

        {/* Sidebar Section - 4 cols */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Allocation Control Card */}
          <div className="bg-[#0f1011] border border-[#23252a] rounded-[12px] p-5 md:p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]">
            <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-[#23252a]">
              <Sliders size={16} className="text-[#e4f222]" />
              <h2 className="text-sm font-semibold tracking-wide text-[#ffffff] uppercase font-mono">
                Allocation &amp; Ingestion Control
              </h2>
            </div>
            <AllocationControl 
              onAllocate={allocateFile} 
              onAllocateUploadedFile={allocateUploadedFile}
              onDefragment={defragment}
              onClear={clearDisk}
              onSaturationPreset={trigger90PercentSaturation}
              onFragmentationPreset={triggerFragmentationPreset}
              blocks={blocks}
              totalBlocks={totalBlocks}
              blockSize={blockSize}
              onSelectBlockSize={setBlockSize}
            />
          </div>

        </div>

      </div>

      {/* 2. MIDDLE SECTION: Physical Hardware Media Allocation (Directly Below Matrix) */}
      <section>
        <PhysicalHardwareAllocation
          blocks={blocks}
          totalBlocks={totalBlocks}
          staleBlocks={staleBlocks}
          eraseCycles={eraseCycles}
          onTriggerSSDErase={triggerSSDErase}
          lastAccessedBlock={lastAccessedBlock}
          hoveredBlockId={hoveredBlockId}
          hoveredFileId={hoveredFileId}
          onHoverSector={handleHoverBlock}
          onHoverPage={handleHoverBlock}
          seekAnimation={seekAnimation}
        />
      </section>

      {/* 3. BOTTOM SECTION: Free Space Bitmap & FAT Table (Equal Height), followed by Seek Benchmark & Kernel Logs */}
      <div className="space-y-6">
        
        {/* Equal-Height Row 1: Free Space Bitmap Vector (Left) & File Allocation Table (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          {/* Free Space Bitmap Card */}
          <div className="bg-[#0f1011] border border-[#23252a] rounded-[12px] p-5 md:p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] flex flex-col justify-between h-full">
            <div>
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

          {/* File Allocation Table (FAT) Card */}
          <div className="bg-[#0f1011] border border-[#23252a] rounded-[12px] p-5 md:p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] flex flex-col h-full">
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
              hoveredFileId={hoveredFileId}
              onHoverFile={handleHoverFile}
            />
          </div>

        </div>

        {/* Equal-Height Row 2: Seek Latency Benchmark (Left) & Kernel Execution Logs (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          {/* Seek Latency Benchmark Card */}
          <div className="bg-[#0f1011] border border-[#23252a] rounded-[12px] p-5 md:p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] flex flex-col justify-between h-full">
            <div>
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
          </div>

          {/* Kernel Execution Logs Card */}
          <div className="bg-[#0f1011] border border-[#23252a] rounded-[12px] p-5 md:p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] flex flex-col h-full">
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

    </div>
  );
}
