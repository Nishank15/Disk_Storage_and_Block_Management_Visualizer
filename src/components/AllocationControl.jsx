import React, { useState, useRef } from 'react';
import { ALLOCATION_STRATEGIES, BLOCK_SIZES } from '../hooks/useDiskEngine';
import { Plus, RotateCw, AlertTriangle, BatteryCharging, RotateCcw, UploadCloud, FileText, CheckCircle2 } from 'lucide-react';

const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export default function AllocationControl({ 
  onAllocate, 
  onAllocateUploadedFile,
  onDefragment, 
  onClear, 
  onSaturationPreset, 
  onFragmentationPreset, 
  blocks,
  totalBlocks: passedTotalBlocks,
  blockSize = 4096,
  onSelectBlockSize,
}) {
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(1);
  const [strategy, setStrategy] = useState(ALLOCATION_STRATEGIES.CONTIGUOUS_FIRST_FIT);

  // File Upload Ingestion State
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadStrategy, setUploadStrategy] = useState(ALLOCATION_STRATEGIES.CONTIGUOUS_FIRST_FIT);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState('');
  const fileInputRef = useRef(null);

  const totalBlocks = passedTotalBlocks || blocks.length || 100;
  const usedBlocks = blocks.filter(b => b.status === 'allocated').length;
  const usagePercentage = Math.round((usedBlocks / totalBlocks) * 100);

  const totalDiskBytes = totalBlocks * blockSize;
  const usedDiskBytes = usedBlocks * blockSize;

  const handleAllocate = (e) => {
    e.preventDefault();
    const success = onAllocate(fileName, fileSize, strategy);
    if (success) {
      setFileName('');
      setFileSize(1);
    }
  };

  const processFile = (file) => {
    if (!file) return;
    const requiredBlocks = Math.max(1, Math.ceil(file.size / blockSize));
    setFileName(file.name);
    setFileSize(requiredBlocks);
    setUploadedFile({
      name: file.name,
      sizeBytes: file.size,
    });
    setUploadSuccessMessage('');
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const currentUploadedRequiredBlocks = uploadedFile 
    ? Math.max(1, Math.ceil(uploadedFile.sizeBytes / blockSize)) 
    : 1;

  const handleAllocateUploaded = () => {
    if (!uploadedFile) return;
    const success = onAllocateUploadedFile 
      ? onAllocateUploadedFile(uploadedFile.name, uploadedFile.sizeBytes, uploadStrategy)
      : onAllocate(uploadedFile.name, currentUploadedRequiredBlocks, uploadStrategy);

    if (success) {
      setUploadSuccessMessage(`Allocated ${uploadedFile.name} (${currentUploadedRequiredBlocks} blocks)`);
      setTimeout(() => {
        setUploadedFile(null);
        setUploadSuccessMessage('');
      }, 3500);
    }
  };

  const handleBlockSizeChange = (newSize) => {
    if (onSelectBlockSize) {
      onSelectBlockSize(newSize);
    }
    if (uploadedFile && fileName === uploadedFile.name) {
      const newRequired = Math.max(1, Math.ceil(uploadedFile.sizeBytes / newSize));
      setFileSize(newRequired);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* 1. Physical Block Sizing Selector */}
      <div className="p-3.5 rounded-[8px] bg-[#161718] border border-[#23252a] space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-[#ffffff] uppercase tracking-wider font-mono">
            Physical Block Sizing
          </label>
          <span className="text-[11px] font-mono text-[#e4f222]">
            {blockSize >= 1024 ? `${blockSize / 1024} KB` : `${blockSize} B`} / Block
          </span>
        </div>
        <select
          value={blockSize}
          onChange={(e) => handleBlockSizeChange(Number(e.target.value))}
          className="w-full bg-[#08090a] border border-[#23252a] text-[#ffffff] rounded-[6px] px-2.5 py-1.5 text-xs font-mono focus:border-[#e4f222] focus:outline-none transition-colors"
        >
          {BLOCK_SIZES.map(b => (
            <option key={b.bytes} value={b.bytes}>
              {b.label}
            </option>
          ))}
        </select>
        <p className="text-[10px] text-[#8a8f98] font-mono">
          Total Disk Capacity: {formatBytes(totalDiskBytes)} ({totalBlocks} blocks)
        </p>
      </div>

      {/* 2. Storage Usage Metric (Blocks + Bytes) */}
      <div>
        <div className="flex justify-between text-xs font-mono mb-1.5">
          <span className="text-[#8a8f98]">CAPACITY USAGE</span>
          <span className="text-[#ffffff] font-medium">
            {usedBlocks} / {totalBlocks} Blocks ({usagePercentage}%)
          </span>
        </div>
        <div className="flex justify-between text-[11px] font-mono text-[#8a8f98] mb-2">
          <span>VOLUME BYTES</span>
          <span className="text-[#e4f222]">
            {formatBytes(usedDiskBytes)} / {formatBytes(totalDiskBytes)}
          </span>
        </div>
        <div className="w-full h-2 bg-[#161718] border border-[#23252a] rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#e4f222] transition-all duration-500 ease-out"
            style={{ width: `${usagePercentage}%` }}
          />
        </div>
      </div>

      {/* 3. Manual Allocation Form */}
      <form onSubmit={handleAllocate} className="flex flex-col gap-3.5">
        <div>
          <label className="block text-xs font-medium text-[#8a8f98] mb-1.5 uppercase tracking-wider">
            File / Table Identifier
          </label>
          <input 
            type="text" 
            required 
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="w-full bg-[#161718] border border-[#23252a] text-[#ffffff] rounded-[6px] px-3 py-2 text-sm placeholder-[#62666d] focus:border-[#e4f222] focus:outline-none transition-colors font-mono"
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
              max={totalBlocks}
              value={fileSize}
              onChange={(e) => setFileSize(Math.min(totalBlocks, Math.max(1, parseInt(e.target.value, 10) || 1)))}
              className="w-full bg-[#161718] border border-[#23252a] text-[#ffffff] font-mono rounded-[6px] px-3 py-2 text-sm placeholder-[#62666d] focus:border-[#e4f222] focus:outline-none transition-colors"
            />
            <span className="text-[10px] text-[#8a8f98] font-mono mt-0.5 block">
              = {formatBytes(fileSize * blockSize)}
            </span>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#8a8f98] mb-1.5 uppercase tracking-wider">
              Strategy
            </label>
            <select 
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
              className="w-full bg-[#161718] border border-[#23252a] text-[#ffffff] rounded-[6px] px-2 py-2 text-xs focus:border-[#e4f222] focus:outline-none transition-colors"
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

      {/* 4. CSV / JSON File Ingestion Zone */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-[#8a8f98] uppercase tracking-wider flex items-center gap-1.5">
            <UploadCloud size={14} className="text-[#e4f222]" />
            <span>Upload File / Dataset</span>
          </label>
          <span className="text-[10px] font-mono text-[#62666d]">.csv, .json, .sql, .txt</span>
        </div>

        <input 
          ref={fileInputRef}
          type="file" 
          accept=".csv,.json,.sql,.txt"
          onChange={handleFileChange}
          className="hidden" 
        />

        {!uploadedFile ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-[8px] p-4 text-center cursor-pointer transition-all ${
              isDragging 
                ? 'border-[#e4f222] bg-[#e4f222]/10' 
                : 'border-[#23252a] hover:border-[#383b3f] bg-[#161718]/40 hover:bg-[#161718]'
            }`}
          >
            <UploadCloud size={20} className="mx-auto text-[#8a8f98] mb-1.5" />
            <p className="text-xs text-[#ffffff] font-medium">Click or drag & drop to ingest dataset</p>
            <p className="text-[10px] text-[#8a8f98] mt-0.5">Calculates blocks dynamically based on byte size</p>
          </div>
        ) : (
          <div className="p-3.5 rounded-[8px] bg-[#161718] border border-[#23252a] space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 overflow-hidden">
                <FileText size={18} className="text-[#e4f222] shrink-0" />
                <div className="truncate">
                  <p className="text-xs font-medium text-[#ffffff] truncate">{uploadedFile.name}</p>
                  <p className="text-[10px] font-mono text-[#8a8f98]">
                    {formatBytes(uploadedFile.sizeBytes)} &bull; {uploadedFile.sizeBytes.toLocaleString()} Bytes
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setUploadedFile(null)}
                className="text-[11px] text-[#eb5757] hover:underline shrink-0"
              >
                Clear
              </button>
            </div>

            {/* Derivation breakdown */}
            <div className="p-2 rounded bg-[#08090a] border border-[#23252a] text-[11px] font-mono text-[#8a8f98] space-y-0.5">
              <div className="flex justify-between">
                <span>Block Size:</span>
                <span className="text-[#ffffff]">{blockSize} Bytes</span>
              </div>
              <div className="flex justify-between">
                <span>Calculated Blocks:</span>
                <span className="text-[#e4f222] font-semibold">
                  &lceil;{uploadedFile.sizeBytes} / {blockSize}&rceil; = {currentUploadedRequiredBlocks} Blocks
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#8a8f98] mb-1 uppercase tracking-wider">
                Strategy
              </label>
              <select 
                value={uploadStrategy}
                onChange={(e) => setUploadStrategy(e.target.value)}
                className="w-full bg-[#08090a] border border-[#23252a] text-[#ffffff] rounded-[6px] px-2 py-1.5 text-xs focus:border-[#e4f222] focus:outline-none"
              >
                {Object.values(ALLOCATION_STRATEGIES).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleAllocateUploaded}
              className="w-full bg-[#e4f222] hover:brightness-105 active:scale-[0.99] text-[#08090a] font-[510] py-2 rounded-[6px] flex items-center justify-center gap-2 text-xs transition-all shadow-sm"
            >
              <CheckCircle2 size={14} />
              <span>Allocate Uploaded Dataset ({currentUploadedRequiredBlocks} Blocks)</span>
            </button>
          </div>
        )}

        {uploadSuccessMessage && (
          <div className="p-2 rounded bg-[#27a644]/15 border border-[#27a644]/40 text-[#27a644] text-xs font-mono flex items-center gap-1.5">
            <CheckCircle2 size={13} />
            <span>{uploadSuccessMessage}</span>
          </div>
        )}
      </div>

      <div className="h-px bg-[#23252a]" />

      {/* 5. Control Actions & Presets */}
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
          onClick={onFragmentationPreset}
          className="col-span-2 bg-transparent hover:bg-[#161718] text-[#d0d6e0] hover:text-[#ffffff] border border-[#23252a] hover:border-[#e4f222]/50 py-2 px-3 rounded-[6px] flex items-center justify-center gap-2 text-xs font-medium transition-all"
        >
          <AlertTriangle size={14} className="text-[#e4f222]" />
          <span>Preset: Simulate Fragmentation</span>
        </button>
        <button 
          type="button"
          onClick={onSaturationPreset}
          className="col-span-2 bg-transparent hover:bg-[#161718] text-[#d0d6e0] hover:text-[#ffffff] border border-[#23252a] hover:border-[#e4f222]/50 py-2 px-3 rounded-[6px] flex items-center justify-center gap-2 text-xs font-medium transition-all"
        >
          <BatteryCharging size={14} className="text-[#e4f222]" />
          <span>Preset: 90% Saturation</span>
        </button>
      </div>
      
    </div>
  );
}
