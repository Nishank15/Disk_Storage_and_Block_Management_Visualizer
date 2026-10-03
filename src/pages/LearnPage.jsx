import React, { useState } from 'react';
import { Download, BookOpen, HardDrive, Cpu, GitFork, Key, Binary, Table, BookMarked, Video, Play } from 'lucide-react';
import { generateDiskReport } from '../utils/pdfReport';

export default function LearnPage({ diskEngine, onDownloadPDF }) {
  const [activeVideoTab, setActiveVideoTab] = useState(0);

  const handleDownload = () => {
    if (onDownloadPDF) {
      onDownloadPDF();
    } else if (diskEngine) {
      generateDiskReport(diskEngine);
    } else {
      console.warn('No diskEngine available to generate report');
    }
  };

  const videoLectures = [
    {
      id: 'contiguous',
      title: 'Contiguous File Allocation',
      subtitle: 'Continuous extent placement, head travel minimization, and external fragmentation',
      embedUrl: 'https://www.youtube.com/embed/ADeA2hVVw-E',
      duration: 'GATE CS / OS Lecture',
      badge: 'Contiguous Strategy'
    },
    {
      id: 'indexed',
      title: 'Indexed File Allocation',
      subtitle: 'Index block pointer arrays, direct offset indexing, and inode structures',
      embedUrl: 'https://www.youtube.com/embed/ugU0Z9UwT2g',
      duration: 'GATE CS / OS Lecture',
      badge: 'Indexed Strategy'
    },
    {
      id: 'linked',
      title: 'Linked File Allocation',
      subtitle: 'Chained block pointers, EOF termination (-1), FAT tables, and sequential traversals',
      embedUrl: 'https://www.youtube.com/embed/WkybVuAlZVA',
      duration: 'GATE CS / OS Lecture',
      badge: 'Linked Strategy'
    }
  ];

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 py-8 space-y-8">
      
      {/* 1. Header Section */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono bg-[#161718] border border-[#23252a] text-[#e4f222] mb-3">
          <BookOpen size={14} />
          <span>DBMS & OS Curriculum &bull; Physical Storage Architecture</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-[510] tracking-[-0.022em] text-[#ffffff] font-sans">
          Storage & Allocation Knowledge Base
        </h1>
        <p className="text-sm md:text-base text-[#8a8f98] mt-1.5 max-w-3xl leading-relaxed">
          Physical block organization, placement heuristics, and performance trade-offs in DBMS and operating systems.
        </p>
      </div>

      {/* Report Download Banner (Mandated Requirement) */}
      <div className="bg-[#0f1011] border border-[#23252a] rounded-xl p-5 md:p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#e4f222] font-semibold mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e4f222]"></span>
            Audit Report Export Utility
          </div>
          <h3 className="text-base font-medium text-[#ffffff]">Export Active System Simulation Telemetry</h3>
          <p className="text-xs text-[#8a8f98] mt-0.5 leading-relaxed">
            Generate and export the active simulation audit trail, comprehensive block allocation tables (FAT), free-space bitmap state, and fragmentation statistics directly into an executive PDF audit report.
          </p>
        </div>
        <button
          type="button"
          onClick={handleDownload}
          className="shrink-0 bg-[#e4f222] hover:brightness-105 active:scale-[0.99] text-[#08090a] font-[510] text-xs md:text-sm py-2.5 px-4 rounded-md flex items-center gap-2 shadow-sm transition-all"
        >
          <Download size={16} strokeWidth={2.5} />
          <span>Download Storage Audit Report (PDF)</span>
        </button>
      </div>

      {/* 2. Comprehensive Theory Content (MUST APPEAR FIRST) */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-[#23252a]">
          <span className="w-2 h-2 rounded-full bg-[#e4f222]" />
          <h2 className="text-lg font-semibold tracking-tight text-[#ffffff] font-sans">
            Section 1: Academic Theory & Storage Internals
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Module 1 */}
          <div className="bg-[#0f1011] border border-[#23252a] rounded-xl p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono text-[#8a8f98] uppercase tracking-wider px-2 py-0.5 rounded bg-[#161718] border border-[#23252a]">
                  Module 01
                </span>
                <HardDrive size={16} className="text-[#e4f222]" />
              </div>
              <h3 className="text-lg font-semibold text-[#ffffff] font-sans mb-2">
                Physical vs. Logical Storage Abstraction
              </h3>
              <p className="text-xs text-[#8a8f98] leading-relaxed mb-4">
                Secondary storage devices (HDDs and SSDs) provide non-volatile persistence. Database management systems organize high-level relational tables into physical storage abstractions.
              </p>
              <div className="space-y-2.5 text-xs text-[#d0d6e0]">
                <div className="p-3 rounded-lg bg-[#161718] border border-[#23252a]">
                  <strong className="text-[#ffffff] block mb-1">Hardware Disk Geometry:</strong>
                  Physical magnetic disks consist of rotating <span className="text-[#e4f222]">platters</span> coated with magnetic media, concentric circular <span className="text-[#e4f222]">tracks</span>, subdivision <span className="text-[#e4f222]">sectors</span> (typically 512B or 4KB), and vertical track alignments known as <span className="text-[#e4f222]">cylinders</span>. Read/write heads are positioned across platters by a shared actuator arm.
                </div>
                <div className="p-3 rounded-lg bg-[#161718] border border-[#23252a]">
                  <strong className="text-[#ffffff] block mb-1">Logical Block Addressing (LBA):</strong>
                  Modern operating systems and DBMS engines abstract physical (Cylinder, Head, Sector) coordinates into a linear array of 1D block indices <code className="text-[#e4f222] font-mono">LBA 0, 1, ..., N</code>. DBMS buffer managers fetch entire physical blocks into database buffer pools to execute relational queries.
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#23252a] text-[11px] font-mono text-[#62666d]">
              Hardware Layer &bull; Physical Layer Mapping
            </div>
          </div>

          {/* Module 2 */}
          <div className="bg-[#0f1011] border border-[#23252a] rounded-xl p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono text-[#8a8f98] uppercase tracking-wider px-2 py-0.5 rounded bg-[#161718] border border-[#23252a]">
                  Module 02
                </span>
                <Cpu size={16} className="text-[#27a644]" />
              </div>
              <h3 className="text-lg font-semibold text-[#ffffff] font-sans mb-2">
                Contiguous Allocation & Fit Heuristics
              </h3>
              <p className="text-xs text-[#8a8f98] leading-relaxed mb-4">
                Contiguous allocation requires every file or table to occupy a continuous, unbroken linear range of physical disk blocks, defined simply by <code className="text-[#e4f222] font-mono">(Start Block, Length)</code>.
              </p>
              <div className="space-y-2 text-xs text-[#d0d6e0]">
                <div className="p-2.5 rounded-lg bg-[#161718] border border-[#23252a]">
                  <strong className="text-[#ffffff]">First-Fit:</strong> Scans from block 0 and allocates the very first free continuous segment that is large enough. Computationally fastest (<code className="text-[#27a644] font-mono">O(1) avg</code>).
                </div>
                <div className="p-2.5 rounded-lg bg-[#161718] border border-[#23252a]">
                  <strong className="text-[#ffffff]">Best-Fit:</strong> Searches the entire disk space to select the smallest free hole that can satisfy the requested size. Leaves the smallest remaining unused hole, but creates unusable tiny slivers.
                </div>
                <div className="p-2.5 rounded-lg bg-[#161718] border border-[#23252a]">
                  <strong className="text-[#ffffff]">Worst-Fit:</strong> Allocates into the largest free span on disk. Leaves behind larger, more usable remnants, but rapidly breaks up large contiguous expanses.
                </div>
                <div className="p-2.5 rounded-lg bg-[#161718] border border-[#eb5757]/30 text-[#eb5757]">
                  <strong>External Fragmentation:</strong> Over time, repeated file allocations and deletions leave holes scattered across disk. Although total free space is sufficient, no single contiguous hole fits the requested file without disk defragmentation.
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#23252a] text-[11px] font-mono text-[#62666d]">
              Placement Heuristics &bull; External Fragmentation
            </div>
          </div>

          {/* Module 3 */}
          <div className="bg-[#0f1011] border border-[#23252a] rounded-xl p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono text-[#8a8f98] uppercase tracking-wider px-2 py-0.5 rounded bg-[#161718] border border-[#23252a]">
                  Module 03
                </span>
                <GitFork size={16} className="text-[#f59e0b]" />
              </div>
              <h3 className="text-lg font-semibold text-[#ffffff] font-sans mb-2">
                Linked (Chained) Block Allocation
              </h3>
              <p className="text-xs text-[#8a8f98] leading-relaxed mb-3">
                Solves external fragmentation by scattering blocks arbitrarily across disk. Each allocated block embeds a 4-byte pointer (<code className="text-[#e4f222] font-mono">block.next</code>) referencing the subsequent block, terminated with <code className="text-[#eb5757] font-mono">EOF (-1)</code>.
              </p>
              <div className="space-y-2.5 text-xs text-[#d0d6e0]">
                <div className="p-3 rounded-lg bg-[#161718] border border-[#23252a]">
                  <strong className="text-[#27a644] block mb-0.5">Primary Advantages:</strong>
                  100% immune to external fragmentation. Any available free block can be allocated immediately. Files can grow dynamically without declaring fixed sizes in advance.
                </div>
                <div className="p-3 rounded-lg bg-[#161718] border border-[#23252a]">
                  <strong className="text-[#eb5757] block mb-0.5">Critical Limitations:</strong>
                  No direct/random access capability. To read block <span className="font-mono">k</span>, the storage engine must traverse <span className="font-mono">k-1</span> sequential pointers (<code className="text-[#eb5757] font-mono">O(N) seek overhead</code>). If blocks are physically dispersed, the actuator arm experiences extreme thrashing. Pointer corruption can break subsequent file blocks.
                </div>
                <div className="p-3 rounded-lg bg-[#161718] border border-[#23252a]">
                  <strong className="text-[#ffffff] block mb-0.5">FAT Optimization:</strong>
                  File Allocation Tables (FAT) cache all block pointers in memory in a centralized directory table, allowing pointer traversal without continuous physical disk reads.
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#23252a] text-[11px] font-mono text-[#62666d]">
              Chained Storage &bull; Sequential Pointer Traversal
            </div>
          </div>

          {/* Module 4 */}
          <div className="bg-[#0f1011] border border-[#23252a] rounded-xl p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono text-[#8a8f98] uppercase tracking-wider px-2 py-0.5 rounded bg-[#161718] border border-[#23252a]">
                  Module 04
                </span>
                <Key size={16} className="text-[#e4f222]" />
              </div>
              <h3 className="text-lg font-semibold text-[#ffffff] font-sans mb-2">
                Indexed Allocation & Inode Hierarchies
              </h3>
              <p className="text-xs text-[#8a8f98] leading-relaxed mb-3">
                Combines direct access capability with zero external fragmentation by assigning each file a dedicated <strong className="text-[#e4f222]">Index Block</strong> containing an array of direct pointers to all data blocks.
              </p>
              <div className="space-y-2.5 text-xs text-[#d0d6e0]">
                <div className="p-3 rounded-lg bg-[#161718] border border-[#23252a]">
                  <strong className="text-[#27a644] block mb-0.5">Direct Access Speed:</strong>
                  Direct random access to the <span className="font-mono">i-th</span> block is achieved in a single pointer lookup: <code className="text-[#e4f222] font-mono">Target = IndexBlock[i]</code>. No sequential hops required.
                </div>
                <div className="p-3 rounded-lg bg-[#161718] border border-[#23252a]">
                  <strong className="text-[#ffffff] block mb-0.5">Index Overhead & Sizing:</strong>
                  Every file consumes an extra block for its pointer table regardless of file size (internal pointer overhead). Very small files of 1 block waste an entire second block as the index.
                </div>
                <div className="p-3 rounded-lg bg-[#161718] border border-[#23252a]">
                  <strong className="text-[#ffffff] block mb-0.5">UNIX Inode Hierarchy:</strong>
                  For files exceeding a single index block's pointer capacity, UNIX filesystems employ multi-level indexing: Direct Pointers (0-11), Single Indirect Pointer, Double Indirect Pointer, and Triple Indirect Pointer.
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#23252a] text-[11px] font-mono text-[#62666d]">
              Index Tables &bull; UNIX Inodes &bull; Direct Offset Mapping
            </div>
          </div>

          {/* Module 5 */}
          <div className="bg-[#0f1011] border border-[#23252a] rounded-xl p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono text-[#8a8f98] uppercase tracking-wider px-2 py-0.5 rounded bg-[#161718] border border-[#23252a]">
                  Module 05
                </span>
                <Binary size={16} className="text-[#27a644]" />
              </div>
              <h3 className="text-lg font-semibold text-[#ffffff] font-sans mb-2">
                Free Space Management via Bitmaps
              </h3>
              <p className="text-xs text-[#8a8f98] leading-relaxed mb-3">
                Operating systems and disk controllers track physical disk block availability using a compact, bit-level vector map stored in reserved storage sectors.
              </p>
              <div className="space-y-3 text-xs text-[#d0d6e0]">
                <div className="p-3 rounded-lg bg-[#161718] border border-[#23252a]">
                  <strong className="text-[#ffffff] block mb-1">Standard Bitmap Encoding:</strong>
                  Each physical block is mapped directly to a single binary bit:
                  <div className="flex items-center gap-4 mt-2 font-mono">
                    <span className="px-2 py-1 rounded bg-[#27a644]/15 text-[#27a644] border border-[#27a644]/30">Bit 1 = Free Space</span>
                    <span className="px-2 py-1 rounded bg-[#23252a] text-[#8a8f98] border border-[#383b3f]">Bit 0 = Allocated</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#161718] border border-[#23252a]">
                  <strong className="text-[#ffffff] block mb-1">Standard Block Address Derivation Formula:</strong>
                  Given a 32-bit CPU memory word, the physical block address is calculated instantaneously:
                  <div className="my-2 p-2 rounded bg-[#08090a] border border-[#23252a] font-mono text-[#e4f222] text-center">
                    Block ID = (Word Index &times; 32) + Bit Offset
                  </div>
                  Bitwise operations (<code className="text-[#d0d6e0]">BitScanForward</code> / <code className="text-[#d0d6e0]">__builtin_ctz</code>) allow allocation searches in a single CPU instruction clock cycle.
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#23252a] text-[11px] font-mono text-[#62666d]">
              Bitmap Vector &bull; Bitwise Offsets &bull; O(1) Allocation
            </div>
          </div>

          {/* Module 6: Comparative Performance Matrix */}
          <div className="bg-[#0f1011] border border-[#23252a] rounded-xl p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono text-[#8a8f98] uppercase tracking-wider px-2 py-0.5 rounded bg-[#161718] border border-[#23252a]">
                  Module 06
                </span>
                <Table size={16} className="text-[#e4f222]" />
              </div>
              <h3 className="text-lg font-semibold text-[#ffffff] font-sans mb-2">
                Comparative Performance Matrix
              </h3>
              <p className="text-xs text-[#8a8f98] leading-relaxed mb-3">
                Direct side-by-side analysis of storage performance, seek hops, and fragmentation vulnerabilities.
              </p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono border-collapse">
                  <thead>
                    <tr className="border-b border-[#23252a] text-[#8a8f98]">
                      <th className="py-2 px-2">Metric</th>
                      <th className="py-2 px-2 text-[#ffffff]">Contiguous</th>
                      <th className="py-2 px-2 text-[#f59e0b]">Linked</th>
                      <th className="py-2 px-2 text-[#e4f222]">Indexed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#23252a] text-[11px]">
                    <tr>
                      <td className="py-2 px-2 text-[#8a8f98]">Sequential Read</td>
                      <td className="py-2 px-2 text-[#27a644] font-bold">Fastest (1 Hop)</td>
                      <td className="py-2 px-2 text-[#f59e0b]">Slow (N Hops)</td>
                      <td className="py-2 px-2 text-[#ffffff]">Moderate (N+1)</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 text-[#8a8f98]">Random Access</td>
                      <td className="py-2 px-2 text-[#27a644] font-bold">O(1) Direct</td>
                      <td className="py-2 px-2 text-[#eb5757] font-bold">O(N) Sequential</td>
                      <td className="py-2 px-2 text-[#27a644] font-bold">O(1) via Index</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 text-[#8a8f98]">External Frag.</td>
                      <td className="py-2 px-2 text-[#eb5757] font-bold">High Risk</td>
                      <td className="py-2 px-2 text-[#27a644] font-bold">Zero Risk</td>
                      <td className="py-2 px-2 text-[#27a644] font-bold">Zero Risk</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 text-[#8a8f98]">Internal Frag.</td>
                      <td className="py-2 px-2 text-[#ffffff]">Last Block Only</td>
                      <td className="py-2 px-2 text-[#ffffff]">Last Block Only</td>
                      <td className="py-2 px-2 text-[#eb5757]">Index Block Slack</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 text-[#8a8f98]">Metadata Space</td>
                      <td className="py-2 px-2 text-[#27a644]">Minimal (2 ints)</td>
                      <td className="py-2 px-2 text-[#8a8f98]">4B per block</td>
                      <td className="py-2 px-2 text-[#e4f222]">1 Full Index Block</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#23252a] text-[11px] font-mono text-[#62666d]">
              Evaluation Benchmark &bull; GATE Syllabus Standard
            </div>
          </div>

        </div>

        {/* Academic References Card */}
        <div className="bg-[#0f1011] border border-[#23252a] rounded-xl p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]">
          <div className="flex items-center gap-2 mb-3">
            <BookMarked size={16} className="text-[#e4f222]" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#ffffff] font-mono">
              Academic Curricular References
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#8a8f98]">
            <div className="p-3 rounded-lg bg-[#161718] border border-[#23252a]">
              <strong className="text-[#ffffff] block mb-1">Database System Concepts (7th/8th Ed.)</strong>
              Silberschatz, Korth, and Sudarshan &bull; Chapter 12: Physical Storage Internals, Record Organizations, and Block Allocation.
            </div>
            <div className="p-3 rounded-lg bg-[#161718] border border-[#23252a]">
              <strong className="text-[#ffffff] block mb-1">Operating System Concepts (10th Ed.)</strong>
              Silberschatz, Galvin, and Gagne &bull; Chapter 14: File System Implementation, Contiguous vs. Indexed Methods.
            </div>
            <div className="p-3 rounded-lg bg-[#161718] border border-[#23252a]">
              <strong className="text-[#ffffff] block mb-1">Modern Operating Systems (4th Ed.)</strong>
              Andrew S. Tanenbaum &bull; Chapter 4: File Systems, Inode Allocations, and Free Space Bitmaps.
            </div>
          </div>
        </div>
      </section>

      {/* 3. Educational Video Hub (MUST APPEAR BELOW THEORY) */}
      <section className="space-y-6 pt-4 border-t border-[#23252a]">
        <div className="flex items-center justify-between pb-2 border-b border-[#23252a]">
          <div className="flex items-center gap-2">
            <Video size={18} className="text-[#e4f222]" />
            <h2 className="text-lg font-semibold tracking-tight text-[#ffffff] font-sans">
              Section 2: Curated Video Masterclasses
            </h2>
          </div>
          <span className="text-xs font-mono text-[#8a8f98]">
            Visual Lecture Demonstrations
          </span>
        </div>

        {/* Video Tab Selector */}
        <div className="flex flex-wrap gap-2">
          {videoLectures.map((video, idx) => {
            const isActive = activeVideoTab === idx;
            return (
              <button
                key={video.id}
                type="button"
                onClick={() => setActiveVideoTab(idx)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs md:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#161718] text-[#ffffff] border border-[#e4f222] shadow-[0_0_12px_rgba(228,242,34,0.15)]'
                    : 'bg-[#0f1011] text-[#8a8f98] hover:text-[#d0d6e0] border border-[#23252a] hover:border-[#383b3f]'
                }`}
              >
                <Play size={14} className={isActive ? 'text-[#e4f222] fill-[#e4f222]' : 'text-[#8a8f98]'} />
                <span>{video.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Video Player Container */}
        <div className="bg-[#0f1011] border border-[#23252a] rounded-xl p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-4 mb-4 border-b border-[#23252a]">
            <div>
              <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded text-[11px] font-mono bg-[#161718] border border-[#23252a] text-[#e4f222] mb-1">
                {videoLectures[activeVideoTab].badge}
              </div>
              <h3 className="text-xl font-semibold text-[#ffffff] font-sans">
                {videoLectures[activeVideoTab].title}
              </h3>
              <p className="text-xs text-[#8a8f98] mt-0.5">
                {videoLectures[activeVideoTab].subtitle}
              </p>
            </div>
            <span className="text-xs font-mono text-[#62666d]">
              Curated Academic Lecture
            </span>
          </div>

          {/* Responsive 16:9 Aspect Video Embed */}
          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-[#08090a] border border-[#23252a]">
            <iframe
              className="absolute inset-0 w-full h-full"
              src={videoLectures[activeVideoTab].embedUrl}
              title={videoLectures[activeVideoTab].title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

    </div>
  );
}
