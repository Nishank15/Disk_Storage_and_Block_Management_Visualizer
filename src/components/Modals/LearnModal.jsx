import React, { useState } from 'react';
import { X, Book, PlayCircle, ExternalLink, HardDrive, Layout, Link as LinkIcon, Key, Binary } from 'lucide-react';

const VIDEOS = {
  CONTIGUOUS: 'https://www.youtube.com/embed/ADeA2hVVw-E',
  INDEXED: 'https://www.youtube.com/embed/ugU0Z9UwT2g',
  LINKED: 'https://www.youtube.com/embed/WkybVuAlZVA',
};

export default function LearnModal({ isOpen, onClose }) {
  const [activeVideo, setActiveVideo] = useState('CONTIGUOUS');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-light-surface dark:bg-dark-surface w-full max-w-5xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-light-border dark:border-dark-border">
        
        <div className="flex justify-between items-center p-6 border-b border-light-border dark:border-dark-border bg-slate-50 dark:bg-slate-900/50">
          <h2 className="text-2xl font-bold flex items-center gap-3 text-brand-cyan">
            <Book size={28} className="text-brand-violet" />
            Physical Storage & File Organization
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-8">
          
          {/* Video Section */}
          <div className="bg-slate-100 dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-inner">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="aspect-video w-full rounded-xl overflow-hidden border-2 border-slate-300 dark:border-slate-700 bg-black shadow-lg">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={VIDEOS[activeVideo]} 
                    title="Storage and File Structures" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
              <div className="w-full md:w-64 flex flex-col gap-3 justify-center">
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                  <PlayCircle size={20} className="text-brand-rose" /> Video Lectures
                </h3>
                <button 
                  onClick={() => setActiveVideo('CONTIGUOUS')}
                  className={`px-4 py-3 rounded-xl text-left font-medium transition-all ${activeVideo === 'CONTIGUOUS' ? 'bg-brand-violet text-white shadow-md scale-105' : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                >
                  Contiguous Allocation
                </button>
                <button 
                  onClick={() => setActiveVideo('LINKED')}
                  className={`px-4 py-3 rounded-xl text-left font-medium transition-all ${activeVideo === 'LINKED' ? 'bg-brand-warning text-white shadow-md scale-105' : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                >
                  Linked Allocation
                </button>
                <button 
                  onClick={() => setActiveVideo('INDEXED')}
                  className={`px-4 py-3 rounded-xl text-left font-medium transition-all ${activeVideo === 'INDEXED' ? 'bg-brand-emerald text-white shadow-md scale-105' : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                >
                  Indexed Allocation
                </button>
              </div>
            </div>
          </div>

          {/* Theory Section */}
          <div className="space-y-8 text-slate-800 dark:text-slate-200 leading-relaxed">
            
            <section>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-brand-cyan">
                <HardDrive size={24} /> Physical Storage & Block Abstraction
              </h3>
              <p className="mb-2"><strong>Physical disk architecture:</strong> Hard disk drives (HDDs) consist of spinning platters, circular tracks, and angular sectors. A read/write head moves across the platters attached to an actuator arm, requiring mechanical positioning (Cylinder-Head-Sector).</p>
              <p><strong>Logical block addressing (LBA):</strong> To abstract away the complex mechanical geometry, the Operating System and DBMS map the physical disk into a linear one-dimensional array of fixed-size logical blocks (typically 4KB to 8KB pages). The disk controller translates the LBA back to the physical CHS coordinates.</p>
            </section>

            <section>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-brand-violet">
                <Layout size={24} /> Contiguous Block Allocation
              </h3>
              <p className="mb-2"><strong>Operating Principle:</strong> Slices of data are stored in an unbroken sequence of consecutive physical blocks on the disk.</p>
              <p className="mb-2"><strong>Directory Record:</strong> Stores <code>(File Name, Start Block Address, Length)</code>.</p>
              <p className="mb-2"><strong>Advantages:</strong> Maximum sequential throughput, zero pointer traversal overhead, and requires only a single disk seek operation to read the entire file.</p>
              <p className="mb-3"><strong>Critical Limitations:</strong> Suffers from severe <strong>External Fragmentation</strong> over time as files are deleted, leaving small gaps that cannot accommodate new large files. Files cannot expand dynamically without expensive full-disk compaction.</p>
              <div className="bg-slate-100 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold mb-2">Search Heuristics:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>First-Fit:</strong> Allocates the first available free gap that is large enough (fastest search).</li>
                  <li><strong>Best-Fit:</strong> Allocates the smallest gap that is large enough (minimizes leftover space but leaves tiny, unusable fragments).</li>
                  <li><strong>Worst-Fit:</strong> Allocates the largest available gap (leaves the largest remaining chunks for future allocations).</li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-brand-warning">
                <LinkIcon size={24} /> Linked (Chained) Allocation
              </h3>
              <p className="mb-2"><strong>Operating Principle:</strong> Blocks are scattered anywhere across the storage matrix. Each block embeds a hidden pointer address connecting it to the succeeding block.</p>
              <p className="mb-2"><strong>Directory Record:</strong> Stores <code>(File Name, Start Block Address, End Block Address)</code>. The last block holds an End-of-File marker (EOF = -1).</p>
              <p className="mb-2"><strong>Advantages:</strong> 100% immune to external fragmentation. Files can grow dynamically without pre-allocating contiguous segments.</p>
              <p><strong>Critical Limitations:</strong> Inability to perform true random/direct access (requires $O(N)$ sequential pointer traversal). Causes severe disk head thrashing during sequential reads. Highly vulnerable to pointer corruption (often mitigated by extracting pointers into in-memory File Allocation Tables / FAT).</p>
            </section>

            <section>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-brand-emerald">
                <Key size={24} /> Indexed Allocation
              </h3>
              <p className="mb-2"><strong>Operating Principle:</strong> A dedicated Index Block stores an ordered array of physical pointers pointing to all individual data blocks assigned to the file.</p>
              <p className="mb-2"><strong>Directory Record:</strong> Stores <code>(File Name, Index Block Address)</code>.</p>
              <p className="mb-2"><strong>Advantages:</strong> Rapid direct access to any block $k$ without contiguous constraints. Complete elimination of external fragmentation.</p>
              <p><strong>Critical Limitations:</strong> Carries a block overhead penalty for small files (consuming 1 extra full block purely for pointers). File size ceilings are strictly defined by the index block's pointer capacity (resolved in enterprise systems via linked indexes, two-level indexing, or UNIX Inodes).</p>
            </section>

            <section>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-brand-cyan">
                <Binary size={24} /> Free Space Management (Bitmap / Bit Vector)
              </h3>
              <p className="mb-2"><strong>Mechanics:</strong> A compact, packed array of bits where <code>1 = Free Block</code> and <code>0 = Allocated Block</code>.</p>
              <p className="mb-2"><strong>Formula for block address calculation:</strong> <code>Block ID = (Word Offset &times; 32) + Bit Position</code>.</p>
              <p><strong>Hardware acceleration:</strong> Modern CPUs possess dedicated bitwise scanning instructions (e.g., finding the first set bit) allowing the OS to search for free space at extremely high speeds, making bitmaps the industry standard for modern file systems (Ext4, NTFS).</p>
            </section>

            {/* Comparison Table */}
            <section>
              <h3 className="text-xl font-bold mb-4">Comparative Performance Matrix</h3>
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                <table className="w-full text-left text-sm border-collapse bg-white dark:bg-slate-900">
                  <thead className="bg-slate-100 dark:bg-slate-800">
                    <tr>
                      <th className="p-3 border-b dark:border-slate-700">Scheme</th>
                      <th className="p-3 border-b dark:border-slate-700">Sequential Read</th>
                      <th className="p-3 border-b dark:border-slate-700">Direct/Random Access</th>
                      <th className="p-3 border-b dark:border-slate-700">External Fragmentation</th>
                      <th className="p-3 border-b dark:border-slate-700">Metadata Overhead</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b dark:border-slate-800">
                      <td className="p-3 font-semibold text-brand-violet">Contiguous</td>
                      <td className="p-3">Excellent (1 Seek)</td>
                      <td className="p-3">Excellent ($O(1)$)</td>
                      <td className="p-3 text-brand-rose">High</td>
                      <td className="p-3">Minimal</td>
                    </tr>
                    <tr className="border-b dark:border-slate-800">
                      <td className="p-3 font-semibold text-brand-warning">Linked</td>
                      <td className="p-3">Poor ($N$ Seeks)</td>
                      <td className="p-3 text-brand-rose">Poor ($O(N)$)</td>
                      <td className="p-3 text-brand-emerald">None</td>
                      <td className="p-3">Per-Block Pointer</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-brand-emerald">Indexed</td>
                      <td className="p-3">Moderate</td>
                      <td className="p-3 text-brand-emerald">Excellent ($O(1)$)</td>
                      <td className="p-3 text-brand-emerald">None</td>
                      <td className="p-3 text-brand-rose">High (Whole Block)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

          </div>

          <div className="bg-slate-100 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <ExternalLink size={20} className="text-brand-rose" /> Mandatory Academic References
            </h3>
            <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300 list-none">
              <li className="flex gap-2">
                <span className="text-brand-rose">&bull;</span>
                <em>Database System Concepts</em> (7th/8th Ed.) by Silberschatz, Korth, and Sudarshan (Storage & File Structure).
              </li>
              <li className="flex gap-2">
                <span className="text-brand-rose">&bull;</span>
                <em>Operating System Concepts</em> (10th Ed.) by Silberschatz, Galvin, and Gagne.
              </li>
              <li className="flex gap-2">
                <span className="text-brand-rose">&bull;</span>
                <em>Modern Operating Systems</em> (4th Ed.) by Andrew S. Tanenbaum.
              </li>
            </ul>
          </div>
          
        </div>
      </div>
    </div>
  );
}
