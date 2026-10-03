import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generatePDFReport = (diskEngine, hardwareConfig = {}) => {
  if (!diskEngine) {
    console.error('Cannot generate report: diskEngine is undefined');
    return;
  }

  const { blocks = [], files = [], logs = [] } = diskEngine;

  // Physical hardware parameters (defaults or passed via hardwareConfig)
  const blockSizeBytes = hardwareConfig.blockSize || 4096;
  const recordSizeBytes = hardwareConfig.recordSize || 128;
  const blockingFactor = Math.floor(blockSizeBytes / recordSizeBytes);
  const internalFragPerBlock = blockSizeBytes - (blockingFactor * recordSizeBytes);

  try {
    const doc = new jsPDF();
    
    // Metrics calculations
    const totalBlocks = blocks.length || 100;
    const usedBlocks = blocks.filter(b => b.status === 'allocated').length;
    const freeBlocks = totalBlocks - usedBlocks;
    const usagePercentage = Math.round((usedBlocks / totalBlocks) * 100);
    const hasExternalFragmentation = freeBlocks > 0 && files.length > 0;
    
    // Header & Metadata
    doc.setFontSize(16);
    doc.setTextColor(8, 9, 10); // Void canvas tone for crisp print
    doc.text('StorageOS - Physical Storage & File Organization Engine Report', 14, 20);
    
    doc.setFontSize(9);
    doc.setTextColor(80, 85, 95); // Muted metadata
    doc.text(`Execution Date & Time : ${new Date().toLocaleString()}`, 14, 28);
    doc.text(`Course Curriculum     : DBMS / OS Physical Storage (CSE2004)`, 14, 34);
    doc.text(`Faculty Evaluator     : Dr. Swaminathan A (SCOPE)`, 14, 40);
    doc.text(`Authors / Engineers   : Nishank Chhipa (25BCE1642) & Shourya Sharma (25BCE1780)`, 14, 46);
    
    // Horizontal hairline divider
    doc.setDrawColor(200, 205, 215);
    doc.line(14, 50, 196, 50);

    // ==========================================
    // SECTION 1: Active Disk Simulation Summary
    // ==========================================
    doc.setFontSize(12);
    doc.setTextColor(8, 9, 10);
    doc.text('Section 1: Active Disk Simulation Summary', 14, 58);
    
    autoTable(doc, {
      startY: 62,
      head: [['Metric', 'Value', 'System Status / Diagnostic Notes']],
      body: [
        ['Total Physical Blocks', `${totalBlocks} Blocks`, '10x10 Logical Matrix Addressing'],
        ['Allocated Blocks', `${usedBlocks} Blocks`, `${usagePercentage}% Storage Saturation`],
        ['Available Free Blocks', `${freeBlocks} Blocks`, `${100 - usagePercentage}% Free Capacity`],
        ['Storage Utilization', `${usagePercentage}%`, usagePercentage > 80 ? 'High Utilization' : 'Optimal Capacity'],
        ['External Fragmentation', hasExternalFragmentation ? 'Detected / Potential' : 'Zero Fragmentation', hasExternalFragmentation ? 'Compaction Recommended' : 'Clean Contiguous Extents'],
        ['Active Files in Directory', `${files.length} Files`, files.map(f => f.name).join(', ') || 'No active allocations']
      ],
      theme: 'grid',
      headStyles: { fillColor: [22, 23, 24], textColor: [228, 242, 34], fontStyle: 'bold' },
      styles: { fontSize: 8.5, cellPadding: 2.8 }
    });

    // File Allocation Table (FAT)
    const fatStartY = doc.lastAutoTable.finalY + 8;
    doc.setFontSize(11);
    doc.setTextColor(8, 9, 10);
    doc.text('File Allocation Table (FAT)', 14, fatStartY);
    
    const fileData = files.map(f => {
      let startBlock = '-';
      let endOrIndex = '-';
      if (f.allocatedBlocks && f.allocatedBlocks.length > 0) {
        startBlock = f.allocatedBlocks[0].toString();
        endOrIndex = f.allocatedBlocks[f.allocatedBlocks.length - 1].toString();
        if (f.strategy === 'Indexed') {
          startBlock = f.allocatedBlocks[0].toString(); // Inode Index Block
          endOrIndex = `Index Block: ${f.allocatedBlocks[0]}`;
        }
      }
      return [
        f.name,
        f.strategy,
        f.size.toString(),
        f.allocatedBlocks ? f.allocatedBlocks.join(', ') : '-',
        startBlock,
        endOrIndex
      ];
    });

    autoTable(doc, {
      startY: fatStartY + 3,
      head: [['File Name', 'Strategy', 'Size (Blocks)', 'Allocated Blocks', 'Start Block', 'Index / EOF Pointer']],
      body: fileData.length > 0 ? fileData : [['No files allocated in FAT', '-', '-', '-', '-', '-']],
      theme: 'striped',
      headStyles: { fillColor: [35, 37, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 8, cellPadding: 2.5 }
    });

    // ==========================================
    // SECTION 2: Physical Hardware Architecture
    // ==========================================
    const hwStartY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setTextColor(8, 9, 10);
    doc.text('Section 2: Physical Hardware & DBMS Storage Architecture', 14, hwStartY);

    autoTable(doc, {
      startY: hwStartY + 4,
      head: [['Hardware Architecture Parameter', 'Specification / Value', 'Pedagogical & DBMS Implication']],
      body: [
        ['Configured Block / Page Size (B)', `${blockSizeBytes} Bytes (${(blockSizeBytes / 1024).toFixed(1)} KB)`, 'Unit of I/O transfer between secondary disk and DBMS buffer pool'],
        ['Standard Record Size (R)', `${recordSizeBytes} Bytes`, 'Fixed or average slotted-page tuple width'],
        ['Blocking Factor (Bfr)', `${blockingFactor} Records / Block`, 'Bfr = floor(B / R) — determines storage packing density'],
        ['Internal Fragmentation per Block', `${internalFragPerBlock} Bytes (${((internalFragPerBlock / blockSizeBytes) * 100).toFixed(1)}%)`, 'Unused tail bytes per page under unspanned record organization'],
        ['Mechanical HDD Profile', '7200 RPM / 4.17ms Avg Latency', 'Rotational latency + seek arm travel dominate overall I/O access time'],
        ['Semiconductor SSD Profile', 'NAND Flash / 0.1ms Latency', 'Zero seek time, out-of-place writes require block erase wear-leveling'],
        ['Slotted-Page Memory Layout', 'Page Header + Slot Array + Tuples', 'Header at top grows downward; variable tuples grow upward from bottom']
      ],
      theme: 'grid',
      headStyles: { fillColor: [22, 23, 24], textColor: [228, 242, 34], fontStyle: 'bold' },
      styles: { fontSize: 8, cellPadding: 2.6 }
    });

    // New Page for Bitmap & Audit Trail
    doc.addPage();

    // Free Space Bitmap Snapshot
    doc.setFontSize(12);
    doc.setTextColor(8, 9, 10);
    doc.text('Free Space Bitmap Vector Snapshot (1 = Free, 0 = Allocated)', 14, 20);
    
    doc.setFontSize(8.5);
    doc.setFont('courier', 'normal');
    doc.setTextColor(60, 65, 75);
    const bitmapString = blocks.map(b => b.status === 'free' ? '1' : '0').join('');
    
    const chunks = bitmapString.match(/.{1,10}/g) || [];
    let y = 28;
    for (let i = 0; i < chunks.length; i += 2) {
      const rowLabel = `Blocks [${String(i * 10).padStart(2, '0')}-${String(Math.min((i + 2) * 10 - 1, 99)).padStart(2, '0')}]: `;
      const bitRow = chunks.slice(i, i + 2).join('   ');
      doc.text(rowLabel + bitRow, 14, y);
      y += 5.5;
    }

    // ==========================================
    // SECTION 3: Audit Trail
    // ==========================================
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(8, 9, 10);
    doc.text('Section 3: Kernel Execution Audit Trail', 14, y + 8);
    
    const logData = logs.map(l => [l.time || '-', (l.type || 'INFO').toUpperCase(), l.message || '']);
    
    autoTable(doc, {
      startY: y + 12,
      head: [['Timestamp', 'Operation Type', 'Kernel Execution Event Description']],
      body: logData.length > 0 ? logData : [['-', 'INITIALIZE', 'System initialized. No file allocation operations executed yet.']],
      theme: 'striped',
      styles: { fontSize: 7.5, cellPadding: 2.2 },
      headStyles: { fillColor: [35, 37, 42], textColor: [228, 242, 34], fontStyle: 'bold' }
    });

    doc.save('StorageOS_Audit_Report.pdf');
  } catch (error) {
    console.error('PDF Generation Error:', error);
    alert('PDF Generation encountered an issue. Downloading fallback text audit report instead.');
    
    // Fallback TXT Generation
    let txtContent = `========================================================================================\n`;
    txtContent += `StorageOS - Physical Storage & File Organization Engine Report\n`;
    txtContent += `========================================================================================\n`;
    txtContent += `Execution Date & Time : ${new Date().toLocaleString()}\n`;
    txtContent += `Course Curriculum     : DBMS / OS Physical Storage (CSE2004)\n`;
    txtContent += `Faculty Evaluator     : Dr. Swaminathan A (SCOPE)\n`;
    txtContent += `Authors / Engineers   : Nishank Chhipa (25BCE1642) & Shourya Sharma (25BCE1780)\n`;
    txtContent += `Target Virtual Disk   : 100 Blocks Matrix (10x10 Logical Grid)\n\n`;
    
    txtContent += `----------------------------------------------------------------------------------------\n`;
    txtContent += `SECTION 1: ACTIVE DISK SIMULATION SUMMARY\n`;
    txtContent += `----------------------------------------------------------------------------------------\n`;
    txtContent += `Total Physical Blocks : ${blocks.length}\n`;
    const used = blocks.filter(b => b.status === 'allocated').length;
    txtContent += `Allocated Blocks      : ${used} blocks (${Math.round((used / blocks.length) * 100)}% utilization)\n`;
    txtContent += `Free Capacity         : ${blocks.length - used} blocks\n`;
    txtContent += `External Frag Check   : ${used > 0 && blocks.length - used > 0 ? 'Detected / Potential (Compaction recommended)' : 'Zero fragmentation'}\n`;
    txtContent += `Active Files Count    : ${files.length}\n\n`;

    txtContent += `File Allocation Table (FAT):\n`;
    if (files.length === 0) {
      txtContent += `  No active files allocated in the directory.\n\n`;
    } else {
      files.forEach((f, idx) => {
        txtContent += `  [File ${idx + 1}] Name: ${f.name.padEnd(16)} | Strategy: ${f.strategy.padEnd(24)} | Size: ${f.size} Blocks\n`;
        txtContent += `            Allocated Blocks: [${f.allocatedBlocks.join(', ')}]\n`;
      });
      txtContent += `\n`;
    }

    txtContent += `----------------------------------------------------------------------------------------\n`;
    txtContent += `SECTION 2: PHYSICAL HARDWARE ARCHITECTURE\n`;
    txtContent += `----------------------------------------------------------------------------------------\n`;
    txtContent += `Configured Block Size : ${blockSizeBytes} Bytes\n`;
    txtContent += `Standard Record Size  : ${recordSizeBytes} Bytes\n`;
    txtContent += `Blocking Factor (Bfr) : ${blockingFactor} records/block [floor(B / R)]\n`;
    txtContent += `Internal Frag / Block : ${internalFragPerBlock} Bytes [B - (Bfr * R)]\n`;
    txtContent += `Hardware Profiles     : HDD (7200 RPM mechanical seek) vs. SSD (NAND flash wear leveling)\n`;
    txtContent += `Memory Layout         : Slotted-Page Architecture (Header + Slot Array + Tuple payload)\n\n`;

    txtContent += `----------------------------------------------------------------------------------------\n`;
    txtContent += `SECTION 3: KERNEL EXECUTION AUDIT TRAIL\n`;
    txtContent += `----------------------------------------------------------------------------------------\n`;
    if (logs.length === 0) {
      txtContent += `No operations recorded.\n`;
    } else {
      logs.forEach(l => {
        txtContent += `[${l.time}] [${(l.type || 'INFO').toUpperCase().padEnd(10)}] ${l.message}\n`;
      });
    }

    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'StorageOS_Audit_Report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};

// Export generateDiskReport as alias for backward compatibility
export const generateDiskReport = generatePDFReport;
