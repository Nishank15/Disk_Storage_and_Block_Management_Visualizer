import { useState, useCallback } from 'react';

export const GRID_DIMENSIONS = [
  { dimension: 6, totalBlocks: 36, label: '6 × 6 (36 Blocks)' },
  { dimension: 8, totalBlocks: 64, label: '8 × 8 (64 Blocks)' },
  { dimension: 10, totalBlocks: 100, label: '10 × 10 (100 Blocks)' },
  { dimension: 12, totalBlocks: 144, label: '12 × 12 (144 Blocks)' },
];

export const BLOCK_SIZES = [
  { bytes: 512, label: '512 Bytes (Legacy Sector)' },
  { bytes: 1024, label: '1024 Bytes (1 KB Standard)' },
  { bytes: 2048, label: '2048 Bytes (2 KB Embedded)' },
  { bytes: 4096, label: '4096 Bytes (4 KB DBMS Ext4)' },
  { bytes: 8192, label: '8192 Bytes (8 KB PostgreSQL)' },
];

export const ALLOCATION_STRATEGIES = {
  CONTIGUOUS_FIRST_FIT: 'Contiguous (First-Fit)',
  CONTIGUOUS_BEST_FIT: 'Contiguous (Best-Fit)',
  CONTIGUOUS_WORST_FIT: 'Contiguous (Worst-Fit)',
  LINKED: 'Linked',
  INDEXED: 'Indexed',
};

const FILE_COLORS = [
  '#6366F1', // Indigo / Violet
  '#06B6D4', // Cyan
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#F43F5E', // Rose
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#2DD4BF', // Teal
  '#E4F222', // Acid Lime
  '#3B82F6', // Blue
];

const createEmptyBlocks = (count) =>
  Array.from({ length: count }).map((_, i) => ({
    id: i,
    status: 'free',
    fileId: null,
    type: null,
    next: null,
    pointers: [],
  }));

export function useDiskEngine(initialDimension = 10, initialBlockSize = 4096) {
  const [diskDimension, setDiskDimension] = useState(initialDimension);
  const totalBlocks = diskDimension * diskDimension;

  // Configurable Block Size (512B - 8KB)
  const [blockSize, setBlockSizeState] = useState(initialBlockSize);

  const [blocks, setBlocks] = useState(() => createEmptyBlocks(initialDimension * initialDimension));
  const [files, setFiles] = useState([]);
  const [logs, setLogs] = useState([]);
  const [benchmarkData, setBenchmarkData] = useState([]);
  const [seekAnimation, setSeekAnimation] = useState(null);

  // Physical Media state tracking
  const [staleBlocks, setStaleBlocks] = useState([]); // SSD invalid/stale pages
  const [eraseCycles, setEraseCycles] = useState(0); // SSD wear-leveling cycles
  const [lastAccessedBlock, setLastAccessedBlock] = useState(0); // HDD Head pointer

  const addLog = useCallback((type, message) => {
    setLogs((prev) => [...prev, { time: new Date().toLocaleTimeString(), type, message }]);
  }, []);

  const setBlockSize = useCallback((newSize) => {
    const sizeNum = parseInt(newSize, 10);
    if (!BLOCK_SIZES.some(b => b.bytes === sizeNum)) return;
    setBlockSizeState(sizeNum);
    addLog('info', `Configured physical block size to ${sizeNum} Bytes (${sizeNum >= 1024 ? (sizeNum / 1024) + ' KB' : sizeNum + ' B'}).`);
  }, [addLog]);

  const setGridDimension = useCallback((newDimension) => {
    const newCount = newDimension * newDimension;
    setDiskDimension(newDimension);
    setBlocks(createEmptyBlocks(newCount));
    setFiles([]);
    setBenchmarkData([]);
    setSeekAnimation(null);
    setStaleBlocks([]);
    setLastAccessedBlock(0);
    addLog('info', `Grid resized to ${newDimension} × ${newDimension} (${newCount} Physical Blocks). Disk formatted.`);
  }, [addLog]);

  const clearDisk = useCallback(() => {
    const currentCount = diskDimension * diskDimension;
    setBlocks(createEmptyBlocks(currentCount));
    setFiles([]);
    setBenchmarkData([]);
    setSeekAnimation(null);
    setStaleBlocks([]);
    setEraseCycles(prev => prev + 1);
    setLastAccessedBlock(0);
    addLog('info', 'Disk formatted and reset to factory settings. SSD Erase Block cycle executed.');
  }, [diskDimension, addLog]);

  const getFreeBlocksCount = (currentBlocks) => currentBlocks.filter(b => b.status === 'free').length;

  const findContiguousBlocks = (currentBlocks, size, strategy) => {
    let freeChunks = [];
    let currentChunk = [];

    for (let i = 0; i < currentBlocks.length; i++) {
      if (currentBlocks[i].status === 'free') {
        currentChunk.push(i);
      } else {
        if (currentChunk.length > 0) {
          freeChunks.push([...currentChunk]);
          currentChunk = [];
        }
      }
    }
    if (currentChunk.length > 0) freeChunks.push(currentChunk);

    let validChunks = freeChunks.filter(chunk => chunk.length >= size);

    if (validChunks.length === 0) return null;

    if (strategy === ALLOCATION_STRATEGIES.CONTIGUOUS_FIRST_FIT) {
      return validChunks[0].slice(0, size);
    } else if (strategy === ALLOCATION_STRATEGIES.CONTIGUOUS_BEST_FIT) {
      validChunks.sort((a, b) => a.length - b.length);
      return validChunks[0].slice(0, size);
    } else if (strategy === ALLOCATION_STRATEGIES.CONTIGUOUS_WORST_FIT) {
      validChunks.sort((a, b) => b.length - a.length);
      return validChunks[0].slice(0, size);
    }
    return null;
  };

  const findScatteredBlocks = (currentBlocks, size) => {
    let freeIndices = [];
    for (let i = 0; i < currentBlocks.length; i++) {
      if (currentBlocks[i].status === 'free') freeIndices.push(i);
      if (freeIndices.length === size) break;
    }
    return freeIndices.length === size ? freeIndices : null;
  };

  const allocateFile = useCallback((name, size, strategy) => {
    const numSize = parseInt(size, 10);
    if (!name || isNaN(numSize) || numSize <= 0) {
      addLog('error', 'Invalid file name or size.');
      return false;
    }

    if (files.some(f => f.name === name)) {
      addLog('error', `File ${name} already exists.`);
      return false;
    }

    let currentBlocks = [...blocks];
    let allocatedIndices = [];
    let requiredSize = strategy === ALLOCATION_STRATEGIES.INDEXED ? numSize + 1 : numSize;

    if (getFreeBlocksCount(currentBlocks) < requiredSize) {
      addLog('error', `Insufficient total space for ${name}.`);
      return false;
    }

    if (strategy.startsWith('Contiguous')) {
      allocatedIndices = findContiguousBlocks(currentBlocks, numSize, strategy);
      if (!allocatedIndices) {
        addLog('warning', `External Fragmentation: Total free space is enough, but no contiguous chunk fits ${name}. Try Defragmentation or use Linked/Indexed allocation.`);
        return false;
      }
      
      allocatedIndices.forEach(idx => {
        currentBlocks[idx] = { ...currentBlocks[idx], status: 'allocated', fileId: name, type: 'data', next: -1 };
      });

    } else if (strategy === ALLOCATION_STRATEGIES.LINKED) {
      allocatedIndices = findScatteredBlocks(currentBlocks, numSize);
      if (!allocatedIndices) return false;

      for (let i = 0; i < allocatedIndices.length; i++) {
        let idx = allocatedIndices[i];
        let nextIdx = i < allocatedIndices.length - 1 ? allocatedIndices[i + 1] : -1;
        currentBlocks[idx] = { ...currentBlocks[idx], status: 'allocated', fileId: name, type: 'data', next: nextIdx };
      }

    } else if (strategy === ALLOCATION_STRATEGIES.INDEXED) {
      allocatedIndices = findScatteredBlocks(currentBlocks, requiredSize);
      if (!allocatedIndices) return false;

      let indexBlockIdx = allocatedIndices[0];
      let dataBlockIndices = allocatedIndices.slice(1);

      currentBlocks[indexBlockIdx] = { ...currentBlocks[indexBlockIdx], status: 'allocated', fileId: name, type: 'index', pointers: dataBlockIndices };

      dataBlockIndices.forEach(idx => {
        currentBlocks[idx] = { ...currentBlocks[idx], status: 'allocated', fileId: name, type: 'data', next: -1 };
      });
    }

    const color = FILE_COLORS[files.length % FILE_COLORS.length];
    const newFile = {
      id: name,
      name,
      size: numSize,
      strategy,
      allocatedBlocks: allocatedIndices,
      color,
    };

    // Reclaimed stale pages if re-written
    setStaleBlocks(prev => prev.filter(id => !allocatedIndices.includes(id)));
    if (allocatedIndices.length > 0) {
      setLastAccessedBlock(allocatedIndices[0]);
    }

    setBlocks(currentBlocks);
    setFiles(prev => [...prev, newFile]);
    
    // Add Benchmark Data based on theoretical Seek Distance (hops)
    let hops = 0;
    if (strategy.startsWith('Contiguous')) hops = 1;
    else if (strategy === ALLOCATION_STRATEGIES.LINKED) hops = numSize;
    else if (strategy === ALLOCATION_STRATEGIES.INDEXED) hops = 1 + numSize;

    setBenchmarkData(prev => [...prev, { name, hops, strategy }]);

    addLog('success', `Allocated ${name} using ${strategy} (${requiredSize} blocks).`);
    return true;
  }, [blocks, files, addLog]);

  // Direct Ingested File Allocation Helper
  const allocateUploadedFile = useCallback((fileName, fileSizeBytes, strategy) => {
    if (!fileName || !fileSizeBytes || fileSizeBytes <= 0) {
      addLog('error', 'Invalid file data or empty file.');
      return false;
    }
    const requiredBlocks = Math.max(1, Math.ceil(fileSizeBytes / blockSize));
    const success = allocateFile(fileName, requiredBlocks, strategy);
    if (success) {
      addLog('info', `Ingested file "${fileName}" (${(fileSizeBytes / 1024).toFixed(1)} KB) -> mapped to ${requiredBlocks} blocks (${blockSize}B/block).`);
    }
    return success;
  }, [blockSize, allocateFile, addLog]);

  const deleteFile = useCallback((fileName) => {
    // Find all blocks allocated to this file to mark them as stale in SSD flash
    const freedBlockIds = blocks.filter(b => b.fileId === fileName).map(b => b.id);

    setBlocks(prev => prev.map(b => {
      if (b.fileId === fileName) {
        return { id: b.id, status: 'free', fileId: null, type: null, next: null, pointers: [] };
      }
      return b;
    }));

    // SSD out-of-place writes: deleted blocks become stale/invalid pages until erased
    if (freedBlockIds.length > 0) {
      setStaleBlocks(prev => Array.from(new Set([...prev, ...freedBlockIds])));
    }

    setFiles(prev => prev.filter(f => f.name !== fileName));
    setBenchmarkData(prev => prev.filter(b => b.name !== fileName));
    addLog('info', `Deleted file ${fileName} (${freedBlockIds.length} blocks freed). Marked as stale pages in NAND flash.`);
  }, [blocks, addLog]);

  const defragment = useCallback(() => {
    if (files.length === 0) return;
    addLog('info', 'Starting defragmentation...');
    
    const currentCount = diskDimension * diskDimension;
    let newBlocks = createEmptyBlocks(currentCount);

    let currentOffset = 0;
    let newFiles = [];

    for (let file of files) {
      let requiredSize = file.allocatedBlocks.length;
      let newAllocatedIndices = [];

      for (let i = 0; i < requiredSize; i++) {
        newAllocatedIndices.push(currentOffset + i);
      }

      if (file.strategy === ALLOCATION_STRATEGIES.INDEXED) {
        let indexIdx = newAllocatedIndices[0];
        let dataIndices = newAllocatedIndices.slice(1);
        newBlocks[indexIdx] = { id: indexIdx, status: 'allocated', fileId: file.name, type: 'index', pointers: dataIndices };
        dataIndices.forEach(idx => {
          newBlocks[idx] = { id: idx, status: 'allocated', fileId: file.name, type: 'data', next: -1 };
        });
      } else if (file.strategy === ALLOCATION_STRATEGIES.LINKED) {
        for (let i = 0; i < newAllocatedIndices.length; i++) {
          let idx = newAllocatedIndices[i];
          let nextIdx = i < newAllocatedIndices.length - 1 ? newAllocatedIndices[i + 1] : -1;
          newBlocks[idx] = { id: idx, status: 'allocated', fileId: file.name, type: 'data', next: nextIdx };
        }
      } else {
        newAllocatedIndices.forEach(idx => {
          newBlocks[idx] = { id: idx, status: 'allocated', fileId: file.name, type: 'data', next: -1 };
        });
      }

      newFiles.push({ ...file, allocatedBlocks: newAllocatedIndices });
      currentOffset += requiredSize;
    }

    // Defrag reclaims all stale pages via garbage collection
    setStaleBlocks([]);
    setEraseCycles(prev => prev + 1);

    setBlocks(newBlocks);
    setFiles(newFiles);
    addLog('success', 'Defragmentation complete. External fragmentation eliminated & SSD dirty blocks erased.');
  }, [files, diskDimension, addLog]);

  // SSD FTL TRIM / Garbage Collect
  const triggerSSDErase = useCallback(() => {
    setStaleBlocks([]);
    setEraseCycles(prev => prev + 1);
    addLog('info', 'SSD Garbage Collection / TRIM: Block Erase cycle executed. All stale flash pages purged.');
  }, [addLog]);

  // ATOMIC 90% SATURATION PRESET
  const trigger90PercentSaturation = useCallback(() => {
    const currentTotal = diskDimension * diskDimension;
    const targetBlocks = Math.floor(currentTotal * 0.9);
    let newBlocks = createEmptyBlocks(currentTotal);
    let newFiles = [];
    let newBenchmarks = [];

    const chunkSize = Math.max(3, Math.min(10, Math.floor(currentTotal / 10)));
    let currentBlock = 0;
    let fileIndex = 1;

    while (currentBlock < targetBlocks) {
      const remaining = targetBlocks - currentBlock;
      const currentChunk = Math.min(chunkSize, remaining);
      if (currentChunk <= 0) break;

      const fileName = `File_${fileIndex}`;
      const allocatedIndices = [];
      for (let i = 0; i < currentChunk; i++) {
        const bIdx = currentBlock + i;
        allocatedIndices.push(bIdx);
        newBlocks[bIdx] = {
          id: bIdx,
          status: 'allocated',
          fileId: fileName,
          type: 'data',
          next: -1,
          pointers: [],
        };
      }

      const color = FILE_COLORS[(fileIndex - 1) % FILE_COLORS.length];
      newFiles.push({
        id: fileName,
        name: fileName,
        size: currentChunk,
        strategy: ALLOCATION_STRATEGIES.CONTIGUOUS_BEST_FIT,
        allocatedBlocks: allocatedIndices,
        color,
      });

      newBenchmarks.push({
        name: fileName,
        hops: 1,
        strategy: ALLOCATION_STRATEGIES.CONTIGUOUS_BEST_FIT,
      });

      currentBlock += currentChunk;
      fileIndex++;
    }

    setStaleBlocks([]);
    setBlocks(newBlocks);
    setFiles(newFiles);
    setBenchmarkData(newBenchmarks);
    setSeekAnimation(null);
    setLastAccessedBlock(0);
    addLog('success', `System saturated to ${targetBlocks}/${currentTotal} blocks (${Math.round((targetBlocks / currentTotal) * 100)}%).`);
  }, [diskDimension, addLog]);

  // ATOMIC FRAGMENTATION SIMULATION PRESET
  const triggerFragmentationPreset = useCallback(() => {
    const currentTotal = diskDimension * diskDimension;
    let newBlocks = createEmptyBlocks(currentTotal);

    const sizeA = Math.max(2, Math.floor(currentTotal * 0.15));
    const sizeB = Math.max(2, Math.floor(currentTotal * 0.15));
    const sizeC = Math.max(2, Math.floor(currentTotal * 0.15));
    const sizeD = Math.max(2, Math.floor(currentTotal * 0.15));

    // File A: contiguous range [0 .. sizeA - 1] (Active)
    const allocA = [];
    for (let i = 0; i < sizeA; i++) {
      allocA.push(i);
      newBlocks[i] = {
        id: i,
        status: 'allocated',
        fileId: 'File_A',
        type: 'data',
        next: -1,
        pointers: [],
      };
    }

    // Stale blocks from simulated deleted B and C
    const freedStale = [];
    for (let i = sizeA; i < sizeA + sizeB + sizeC; i++) {
      freedStale.push(i);
    }

    // File D: contiguous range [sizeA + sizeB + sizeC .. + sizeD - 1] (Active)
    const startD = sizeA + sizeB + sizeC;
    const allocD = [];
    for (let i = 0; i < sizeD; i++) {
      const bIdx = startD + i;
      if (bIdx < currentTotal) {
        allocD.push(bIdx);
        newBlocks[bIdx] = {
          id: bIdx,
          status: 'allocated',
          fileId: 'File_D',
          type: 'data',
          next: -1,
          pointers: [],
        };
      }
    }

    const newFiles = [
      {
        id: 'File_A',
        name: 'File_A',
        size: sizeA,
        strategy: ALLOCATION_STRATEGIES.CONTIGUOUS_FIRST_FIT,
        allocatedBlocks: allocA,
        color: FILE_COLORS[0],
      },
      {
        id: 'File_D',
        name: 'File_D',
        size: allocD.length,
        strategy: ALLOCATION_STRATEGIES.CONTIGUOUS_FIRST_FIT,
        allocatedBlocks: allocD,
        color: FILE_COLORS[3],
      },
    ];

    const newBenchmarks = [
      { name: 'File_A', hops: 1, strategy: ALLOCATION_STRATEGIES.CONTIGUOUS_FIRST_FIT },
      { name: 'File_D', hops: 1, strategy: ALLOCATION_STRATEGIES.CONTIGUOUS_FIRST_FIT },
    ];

    setStaleBlocks(freedStale);
    setBlocks(newBlocks);
    setFiles(newFiles);
    setBenchmarkData(newBenchmarks);
    setSeekAnimation(null);
    setLastAccessedBlock(0);
    addLog('warning', `Simulated external fragmentation: File_A (${sizeA} blocks) and File_D (${allocD.length} blocks) isolated with ${sizeB + sizeC} free hole blocks in between.`);
  }, [diskDimension, addLog]);

  const triggerSeekSimulation = useCallback((file) => {
    setSeekAnimation(file);
    if (file.allocatedBlocks && file.allocatedBlocks.length > 0) {
      setLastAccessedBlock(file.allocatedBlocks[0]);
    }
    addLog('info', `Simulating seek for ${file.name}...`);
    setTimeout(() => {
      setSeekAnimation(null);
    }, 2000);
  }, [addLog]);

  // Capacity calculations in bytes
  const totalDiskBytes = totalBlocks * blockSize;
  const usedBlocksCount = blocks.filter(b => b.status === 'allocated').length;
  const usedDiskBytes = usedBlocksCount * blockSize;
  const freeDiskBytes = totalDiskBytes - usedDiskBytes;

  return {
    blocks,
    files,
    logs,
    benchmarkData,
    allocateFile,
    allocateUploadedFile,
    deleteFile,
    clearDisk,
    defragment,
    seekAnimation,
    triggerSeekSimulation,
    // Dynamic Grid Size & Atomic Presets
    diskDimension,
    totalBlocks,
    setGridDimension,
    trigger90PercentSaturation,
    triggerFragmentationPreset,
    // Configurable Block Size & Byte Capacity
    blockSize,
    setBlockSize,
    totalDiskBytes,
    usedDiskBytes,
    freeDiskBytes,
    // Physical Hardware Simulation State
    staleBlocks,
    eraseCycles,
    triggerSSDErase,
    lastAccessedBlock,
    setLastAccessedBlock,
  };
}
