import { useState, useCallback } from 'react';

const GRID_SIZE = 100;

export const ALLOCATION_STRATEGIES = {
  CONTIGUOUS_FIRST_FIT: 'Contiguous (First-Fit)',
  CONTIGUOUS_BEST_FIT: 'Contiguous (Best-Fit)',
  CONTIGUOUS_WORST_FIT: 'Contiguous (Worst-Fit)',
  LINKED: 'Linked',
  INDEXED: 'Indexed',
};

const FILE_COLORS = [
  '#6366F1', // Violet
  '#06B6D4', // Cyan
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#F43F5E', // Rose
  '#8B5CF6', // Purple
  '#EC4899', // Pink
];

export function useDiskEngine() {
  const [blocks, setBlocks] = useState(() => 
    Array.from({ length: GRID_SIZE }).map((_, i) => ({
      id: i,
      status: 'free',
      fileId: null,
      type: null,
      next: null,
      pointers: [],
    }))
  );

  const [files, setFiles] = useState([]);
  const [logs, setLogs] = useState([]);
  const [benchmarkData, setBenchmarkData] = useState([]);
  const [seekAnimation, setSeekAnimation] = useState(null);

  const addLog = (type, message) => {
    setLogs((prev) => [...prev, { time: new Date().toLocaleTimeString(), type, message }]);
  };

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
      
      // Update blocks
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

    setBlocks(currentBlocks);
    setFiles(prev => [...prev, newFile]);
    
    // Add Benchmark Data based on theoretical Seek Distance (hops)
    let hops = 0;
    if (strategy.startsWith('Contiguous')) hops = 1; // 1 seek to start, sequential read
    else if (strategy === ALLOCATION_STRATEGIES.LINKED) hops = numSize; // n random seeks
    else if (strategy === ALLOCATION_STRATEGIES.INDEXED) hops = 1 + numSize; // 1 to index, n to data

    setBenchmarkData(prev => [...prev, { name, hops, strategy }]);

    addLog('success', `Allocated ${name} using ${strategy} (${requiredSize} blocks).`);
    return true;
  }, [blocks, files]);

  const deleteFile = useCallback((fileName) => {
    setBlocks(prev => prev.map(b => {
      if (b.fileId === fileName) {
        return { id: b.id, status: 'free', fileId: null, type: null, next: null, pointers: [] };
      }
      return b;
    }));
    setFiles(prev => prev.filter(f => f.name !== fileName));
    setBenchmarkData(prev => prev.filter(b => b.name !== fileName));
    addLog('info', `Deleted file ${fileName}.`);
  }, []);

  const clearDisk = useCallback(() => {
    setBlocks(Array.from({ length: GRID_SIZE }).map((_, i) => ({
      id: i, status: 'free', fileId: null, type: null, next: null, pointers: []
    })));
    setFiles([]);
    setBenchmarkData([]);
    addLog('info', 'Disk formatted and reset to factory settings.');
  }, []);

  const defragment = useCallback(() => {
    if (files.length === 0) return;
    addLog('info', 'Starting defragmentation...');
    
    let newBlocks = Array.from({ length: GRID_SIZE }).map((_, i) => ({
      id: i, status: 'free', fileId: null, type: null, next: null, pointers: []
    }));

    let currentOffset = 0;
    let newFiles = [];

    // During defragmentation, we can convert everything to contiguous to represent true defrag, 
    // or just pack them based on their old strategy. Let's pack them but preserve their conceptual identity.
    // However, defrag usually makes scattered blocks contiguous. Let's make them contiguous!
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
          let nextIdx = i < newAllocatedIndices.length - 1 ? newAllocatedIndices[i+1] : -1;
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

    setBlocks(newBlocks);
    setFiles(newFiles);
    addLog('success', 'Defragmentation complete. External fragmentation eliminated.');
  }, [files]);

  const triggerSeekSimulation = useCallback((file) => {
    setSeekAnimation(file);
    addLog('info', `Simulating seek for ${file.name}...`);
    setTimeout(() => {
      setSeekAnimation(null);
    }, 2000); // 2 second animation
  }, []);

  return {
    blocks,
    files,
    logs,
    benchmarkData,
    allocateFile,
    deleteFile,
    clearDisk,
    defragment,
    seekAnimation,
    triggerSeekSimulation,
  };
}
