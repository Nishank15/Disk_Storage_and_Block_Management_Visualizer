import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Generates an off-screen high-resolution Donut / Pie Chart image representing
 * Allocated Blocks vs Available Free Blocks
 */
const generatePieChartImage = (usedBlocks, freeBlocks) => {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const total = (usedBlocks + freeBlocks) || 1;
    const usedAngle = (usedBlocks / total) * 2 * Math.PI;

    // Background
    ctx.fillStyle = '#0f1011';
    ctx.fillRect(0, 0, 400, 400);

    // Free wedge (Slate #23252a) - full circular base
    ctx.beginPath();
    ctx.moveTo(200, 200);
    ctx.arc(200, 200, 150, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fillStyle = '#23252a';
    ctx.fill();

    // Used wedge (Acid Lime #e4f222)
    if (usedBlocks > 0) {
      ctx.beginPath();
      ctx.moveTo(200, 200);
      // Start dial at top (-PI/2)
      ctx.arc(200, 200, 150, -Math.PI / 2, -Math.PI / 2 + usedAngle);
      ctx.closePath();
      ctx.fillStyle = '#e4f222';
      ctx.fill();
    }

    // Donut hole
    ctx.beginPath();
    ctx.arc(200, 200, 85, 0, 2 * Math.PI);
    ctx.fillStyle = '#0f1011';
    ctx.fill();

    // Center text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.round((usedBlocks / total) * 100)}%`, 200, 190);
    ctx.fillStyle = '#8a8f98';
    ctx.font = '20px sans-serif';
    ctx.fillText('USED', 200, 225);

    return canvas.toDataURL('image/png');
  } catch (err) {
    console.warn('Canvas pie chart generation failed:', err);
    return null;
  }
};

export const generatePDFReport = (diskEngine, hardwareConfig = {}) => {
  if (!diskEngine) {
    console.error('Cannot generate report: diskEngine is undefined');
    return;
  }

  const { blocks = [], files = [], logs = [], diskDimension } = diskEngine;

  // Physical hardware parameters (defaults or passed via hardwareConfig)
  const blockSizeBytes = hardwareConfig.blockSize || diskEngine.blockSize || 4096;
  const recordSizeBytes = hardwareConfig.recordSize || 128;
  const blockingFactor = Math.floor(blockSizeBytes / recordSizeBytes);
  const internalFragPerBlock = blockSizeBytes - (blockingFactor * recordSizeBytes);

  const totalBlocks = blocks.length || 100;
  const dimension = diskDimension || Math.round(Math.sqrt(totalBlocks)) || 10;
  const usedBlocks = blocks.filter(b => b.status === 'allocated').length;
  const freeBlocks = totalBlocks - usedBlocks;
  const usagePercentage = Math.round((usedBlocks / totalBlocks) * 100);
  const hasExternalFragmentation = freeBlocks > 0 && files.length > 0;

  try {
    const doc = new jsPDF();
    
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
    doc.text(`Matrix Configuration  : ${dimension} × ${dimension} Grid (${totalBlocks} Blocks Total, ${blockSizeBytes}B / Block)`, 14, 52);
    
    // Horizontal hairline divider
    doc.setDrawColor(200, 205, 215);
    doc.line(14, 55, 196, 55);

    // ==========================================
    // SECTION 1: Active Disk Simulation Summary
    // ==========================================
    doc.setFontSize(12);
    doc.setTextColor(8, 9, 10);
    doc.text('Section 1: Active Disk Simulation Summary', 14, 62);

    // Generate & Embed Pie Chart Image
    const chartImg = generatePieChartImage(usedBlocks, freeBlocks);
    let summaryStartY = 66;

    if (chartImg) {
      try {
        // Donut Chart Image (34 x 34 mm)
        doc.addImage(chartImg, 'PNG', 14, 66, 34, 34);

        // Side-by-side color legend
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');

        // Filled box (#e4f222): Allocated
        doc.setFillColor(228, 242, 34); // #e4f222 Acid Lime
        doc.rect(54, 72, 4, 4, 'F');
        doc.setTextColor(8, 9, 10);
        doc.text(`Allocated (${usedBlocks} Blocks - ${usagePercentage}%)`, 61, 75.5);

        // Filled box (#23252a): Available
        doc.setFillColor(35, 37, 42); // #23252a Slate
        doc.rect(54, 80, 4, 4, 'F');
        doc.setTextColor(80, 85, 95);
        doc.text(`Available (${freeBlocks} Blocks - ${100 - usagePercentage}%)`, 61, 83.5);

        // Capacity Status subtitle
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(100, 105, 115);
        doc.text(`Total Physical Disk Space: ${totalBlocks} Blocks (${dimension}×${dimension} Logical Grid)`, 54, 91);
        doc.text(`Capacity Status: ${usagePercentage > 80 ? 'High Utilization / Saturation Alert' : 'Optimal Capacity Allocation'}`, 54, 96);

        summaryStartY = 104;
      } catch (imgErr) {
        console.warn('Could not embed pie chart image in PDF:', imgErr);
        summaryStartY = 66;
      }
    }
    
    autoTable(doc, {
      startY: summaryStartY,
      head: [['Metric', 'Value', 'System Status / Diagnostic Notes']],
      body: [
        ['Total Physical Blocks', `${totalBlocks} Blocks`, `${dimension}×${dimension} Logical Matrix Addressing`],
        ['Allocated Blocks', `${usedBlocks} Blocks`, `${usagePercentage}% Storage Saturation`],
        ['Available Free Blocks', `${freeBlocks} Blocks`, `${100 - usagePercentage}% Free Capacity`],
        ['Storage Utilization', `${usagePercentage}%`, usagePercentage > 80 ? 'High Utilization' : 'Optimal Capacity'],
        ['External Fragmentation', hasExternalFragmentation ? 'Detected / Potential' : 'Zero Fragmentation', hasExternalFragmentation ? 'Compaction Recommended' : 'Clean Contiguous Extents'],
        ['Active Files in Directory', `${files.length} Files`, files.map(f => f.name).join(', ') || 'No active allocations']
      ],
      theme: 'grid',
      headStyles: { fillColor: [22, 23, 24], textColor: [228, 242, 34], fontStyle: 'bold' },
      styles: { fontSize: 8.5, cellPadding: 2.4 },
      pageBreak: 'auto',
      showHead: 'everyPage'
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
      styles: { fontSize: 8, cellPadding: 2.3 },
      pageBreak: 'auto',
      showHead: 'everyPage'
    });

    // ==========================================
    // SECTION 2: Physical Hardware Architecture (Fresh Page)
    // ==========================================
    doc.addPage();

    doc.setFontSize(12);
    doc.setTextColor(8, 9, 10);
    doc.text('Section 2: Physical Hardware & DBMS Storage Architecture', 14, 20);

    autoTable(doc, {
      startY: 25,
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
      styles: { fontSize: 8, cellPadding: 2.6 },
      pageBreak: 'auto',
      showHead: 'everyPage'
    });

    // New Page for Bitmap & Audit Trail
    doc.addPage();

    // Free Space Bitmap Snapshot
    doc.setFontSize(12);
    doc.setTextColor(8, 9, 10);
    doc.text(`Free Space Bitmap Vector Snapshot (${dimension}×${dimension} Matrix, 1 = Free, 0 = Allocated)`, 14, 20);
    
    doc.setFontSize(8);
    doc.setFont('courier', 'normal');
    doc.setTextColor(60, 65, 75);
    const bitmapString = blocks.map(b => b.status === 'free' ? '1' : '0').join('');
    
    const chunks = bitmapString.match(new RegExp(`.{1,${dimension}}`, 'g')) || [];
    let y = 28;
    for (let i = 0; i < chunks.length; i++) {
      const startIdx = i * dimension;
      const endIdx = Math.min((i + 1) * dimension - 1, totalBlocks - 1);
      const rowLabel = `Blocks [${String(startIdx).padStart(2, '0')}-${String(endIdx).padStart(2, '0')}]: `;
      const bitRow = chunks[i].split('').join('   ');
      doc.text(rowLabel + bitRow, 14, y);
      y += 5;
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
      headStyles: { fillColor: [35, 37, 42], textColor: [228, 242, 34], fontStyle: 'bold' },
      pageBreak: 'auto',
      showHead: 'everyPage'
    });

    doc.save('StorageOS_Audit_Report.pdf');
  } catch (error) {
    console.error('PDF Generation Error:', error);
    if (typeof alert !== 'undefined') {
      alert('PDF Generation encountered an issue. Downloading fallback text audit report instead.');
    }
    
    // Fallback TXT Generation
    let txtContent = `========================================================================================\n`;
    txtContent += `StorageOS - Physical Storage & File Organization Engine Report\n`;
    txtContent += `========================================================================================\n`;
    txtContent += `Execution Date & Time : ${new Date().toLocaleString()}\n`;
    txtContent += `Course Curriculum     : DBMS / OS Physical Storage (CSE2004)\n`;
    txtContent += `Faculty Evaluator     : Dr. Swaminathan A (SCOPE)\n`;
    txtContent += `Authors / Engineers   : Nishank Chhipa (25BCE1642) & Shourya Sharma (25BCE1780)\n`;
    txtContent += `Target Virtual Disk   : ${totalBlocks} Blocks Matrix (${dimension}×${dimension} Logical Grid)\n\n`;
    
    txtContent += `----------------------------------------------------------------------------------------\n`;
    txtContent += `SECTION 1: ACTIVE DISK SIMULATION SUMMARY\n`;
    txtContent += `----------------------------------------------------------------------------------------\n`;
    txtContent += `Total Physical Blocks : ${totalBlocks} (${dimension}×${dimension})\n`;
    txtContent += `Allocated Blocks      : ${usedBlocks} blocks (${usagePercentage}% utilization)\n`;
    txtContent += `Free Capacity         : ${freeBlocks} blocks (${100 - usagePercentage}% free)\n`;
    txtContent += `External Frag Check   : ${hasExternalFragmentation ? 'Detected / Potential (Compaction recommended)' : 'Zero fragmentation'}\n`;
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
