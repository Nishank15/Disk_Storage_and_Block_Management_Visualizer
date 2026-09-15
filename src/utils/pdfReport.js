import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generatePDFReport = (diskEngine) => {
  const { blocks, files, logs } = diskEngine;

  try {
    const doc = new jsPDF();
    
    // Metrics
    const totalBlocks = blocks.length;
    const usedBlocks = blocks.filter(b => b.status === 'allocated').length;
    const freeBlocks = totalBlocks - usedBlocks;
    const usagePercentage = Math.round((usedBlocks / totalBlocks) * 100);
    const hasExternalFragmentation = freeBlocks > 0 && files.length > 0; // Simplified assumption for report
    
    // Title & Metadata
    doc.setFontSize(16);
    doc.setTextColor(30, 41, 59); // slate-800
    doc.text('Disk Storage & Block Management Visualizer - Audit Report', 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(`Generation Timestamp: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Course: DBMS Physical Storage & File Organization`, 14, 36);
    doc.text(`Target Disk: 100 Blocks (10x10)`, 14, 42);
    
    // Summary Metrics
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text('Storage Metrics Summary', 14, 52);
    
    autoTable(doc, {
      startY: 56,
      head: [['Metric', 'Value']],
      body: [
        ['Total Blocks', totalBlocks.toString()],
        ['Used Blocks', `${usedBlocks}`],
        ['Free Blocks', freeBlocks.toString()],
        ['Storage Utilization %', `${usagePercentage}%`],
        ['External Fragmentation', hasExternalFragmentation ? 'Potential' : 'None'],
        ['Total Files Allocated', files.length.toString()]
      ],
      theme: 'grid',
      headStyles: { fillColor: [99, 102, 241] } // brand-violet
    });

    // File Allocation Table
    doc.text('File Allocation Table', 14, doc.lastAutoTable.finalY + 14);
    
    const fileData = files.map(f => {
      let startBlock = '-';
      let endOrIndex = '-';
      if (f.allocatedBlocks.length > 0) {
        startBlock = f.allocatedBlocks[0].toString();
        endOrIndex = f.allocatedBlocks[f.allocatedBlocks.length - 1].toString();
        if (f.strategy === 'Indexed') {
           startBlock = '-'; // Index block is the first one
           endOrIndex = `Index: ${f.allocatedBlocks[0]}`;
        }
      }
      return [
        f.name,
        f.strategy,
        f.size.toString(),
        f.allocatedBlocks.join(', '),
        startBlock,
        endOrIndex
      ];
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 18,
      head: [['File Name', 'Strategy', 'Size (Blocks)', 'Allocated Block IDs', 'Start Block', 'End/Index Block Pointer']],
      body: fileData.length > 0 ? fileData : [['No files', '-', '-', '-', '-', '-']],
      theme: 'striped',
      headStyles: { fillColor: [16, 185, 129] } // brand-emerald
    });

    // Bitmap Snapshot
    doc.addPage();
    doc.text('Free Space Bitmap Snapshot', 14, 22);
    
    doc.setFontSize(9);
    doc.setFont('courier', 'normal');
    const bitmapString = blocks.map(b => b.status === 'free' ? '1' : '0').join('');
    
    // Split into chunks of 10 for readability
    const chunks = bitmapString.match(/.{1,10}/g) || [];
    let y = 30;
    for (let i = 0; i < chunks.length; i += 5) {
      const rowChunks = chunks.slice(i, i + 5).join('  ');
      doc.text(rowChunks, 14, y);
      y += 6;
    }

    // Audit Logs
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text('Complete Audit Trail', 14, y + 10);
    
    const logData = logs.map(l => [l.time, l.type.toUpperCase(), l.message]);
    
    autoTable(doc, {
      startY: y + 14,
      head: [['Timestamp', 'Type', 'Event Description']],
      body: logData.length > 0 ? logData : [['-', '-', 'No logs available']],
      theme: 'plain',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [244, 63, 94] } // brand-rose
    });

    doc.save('Disk_Storage_Report.pdf');
  } catch (error) {
    console.error('PDF Generation Error:', error);
    alert('PDF Generation failed. Downloading fallback TXT report instead.');
    
    // Fallback TXT Generation
    let txtContent = `Disk Storage & Block Management Visualizer - Audit Report\n`;
    txtContent += `Generation Timestamp: ${new Date().toLocaleString()}\n`;
    txtContent += `Course: DBMS Physical Storage & File Organization\n`;
    txtContent += `Target Disk: 100 Blocks (10x10)\n\n`;
    
    txtContent += `--- Storage Metrics Summary ---\n`;
    txtContent += `Total Blocks: ${blocks.length}\n`;
    const used = blocks.filter(b => b.status === 'allocated').length;
    txtContent += `Used Blocks: ${used}\n`;
    txtContent += `Free Blocks: ${blocks.length - used}\n`;
    txtContent += `Storage Utilization %: ${Math.round((used / blocks.length) * 100)}%\n`;
    txtContent += `Total Files Allocated: ${files.length}\n\n`;

    txtContent += `--- File Allocation Table ---\n`;
    if (files.length === 0) {
      txtContent += `No files allocated.\n`;
    } else {
      files.forEach(f => {
        txtContent += `Name: ${f.name} | Strategy: ${f.strategy} | Size: ${f.size}\n`;
        txtContent += `Allocated Blocks: ${f.allocatedBlocks.join(', ')}\n\n`;
      });
    }

    txtContent += `--- Complete Audit Trail ---\n`;
    if (logs.length === 0) {
      txtContent += `No logs available.\n`;
    } else {
      logs.forEach(l => {
        txtContent += `[${l.time}] [${l.type.toUpperCase()}] ${l.message}\n`;
      });
    }

    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Disk_Storage_Report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};
