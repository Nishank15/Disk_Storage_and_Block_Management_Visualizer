import React, { useState } from 'react';
import { Key, RotateCw, CheckCircle2, XCircle, Sparkles } from 'lucide-react';

export default function InodeCapacityWorkbench() {
  const [blockSize, setBlockSize] = useState(4096); // in Bytes
  const [pointerSize, setPointerSize] = useState(4); // in Bytes
  const [directPointers, setDirectPointers] = useState(12);
  const [singleIndirect, setSingleIndirect] = useState(1);
  const [doubleIndirect, setDoubleIndirect] = useState(1);
  const [tripleIndirect, setTripleIndirect] = useState(1);

  // Student Practice inputs
  const [userAnswerGb, setUserAnswerGb] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Derivations
  const P = Math.floor(blockSize / pointerSize); // pointers per block
  const directCapacityBytes = directPointers * blockSize;
  const singleCapacityBytes = singleIndirect * P * blockSize;
  const doubleCapacityBytes = doubleIndirect * Math.pow(P, 2) * blockSize;
  const tripleCapacityBytes = tripleIndirect * Math.pow(P, 3) * blockSize;
  const totalCapacityBytes = directCapacityBytes + singleCapacityBytes + doubleCapacityBytes + tripleCapacityBytes;

  const totalCapacityGb = Number((totalCapacityBytes / Math.pow(1024, 3)).toFixed(2));
  const totalCapacityTb = Number((totalCapacityBytes / Math.pow(1024, 4)).toFixed(3));

  const handleRandomize = () => {
    const blockSizes = [1024, 2048, 4096, 8192];
    const pointerSizes = [4, 8];
    const randBlock = blockSizes[Math.floor(Math.random() * blockSizes.length)];
    const randPtr = pointerSizes[Math.floor(Math.random() * pointerSizes.length)];
    const randDirect = Math.floor(Math.random() * 8) + 8; // 8 to 15

    setBlockSize(randBlock);
    setPointerSize(randPtr);
    setDirectPointers(randDirect);
    setSingleIndirect(1);
    setDoubleIndirect(1);
    setTripleIndirect(1);
    setUserAnswerGb('');
    setVerificationResult(null);
    setShowExplanation(false);
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (!userAnswerGb.trim()) return;
    const userVal = Number(userAnswerGb.trim());
    // Accept within 5% numerical margin or rounded value
    const isCorrect = Math.abs(userVal - totalCapacityGb) < Math.max(1, totalCapacityGb * 0.05) ||
                      Math.abs(userVal - Math.round(totalCapacityGb)) <= 1;

    setVerificationResult(isCorrect ? 'correct' : 'incorrect');
    setShowExplanation(true);
  };

  return (
    <div className="bg-[#0f1011] border border-[#23252a] rounded-xl p-5 md:p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] space-y-6">
      
      {/* Title & Randomize Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#23252a]">
        <div>
          <div className="flex items-center gap-2">
            <Key size={16} className="text-[#e4f222]" />
            <h3 className="text-sm font-semibold tracking-wide text-[#ffffff] uppercase font-mono">
              UNIX Inode Maximum File Size Capacity Calculator
            </h3>
          </div>
          <p className="text-xs text-[#8a8f98] mt-0.5">
            Derive multi-level indirect block indexing capacities tested in GATE CSE.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRandomize}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#161718] border border-[#23252a] hover:border-[#383b3f] text-[#d0d6e0] hover:text-[#ffffff] text-xs font-mono transition-all self-start sm:self-auto"
        >
          <RotateCw size={13} className="text-[#e4f222]" />
          <span>Randomize Parameters</span>
        </button>
      </div>

      {/* Input Parameters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
        <div>
          <label className="block text-[#8a8f98] mb-1 uppercase">Block Size (B)</label>
          <select
            value={blockSize}
            onChange={(e) => { setBlockSize(Number(e.target.value)); setVerificationResult(null); }}
            className="w-full bg-[#161718] border border-[#23252a] text-[#ffffff] rounded-md px-3 py-2 outline-none focus:border-[#e4f222]"
          >
            <option value={1024}>1024 Bytes (1 KB)</option>
            <option value={2048}>2048 Bytes (2 KB)</option>
            <option value={4096}>4096 Bytes (4 KB)</option>
            <option value={8192}>8192 Bytes (8 KB)</option>
          </select>
        </div>

        <div>
          <label className="block text-[#8a8f98] mb-1 uppercase">Block Pointer Size</label>
          <select
            value={pointerSize}
            onChange={(e) => { setPointerSize(Number(e.target.value)); setVerificationResult(null); }}
            className="w-full bg-[#161718] border border-[#23252a] text-[#ffffff] rounded-md px-3 py-2 outline-none focus:border-[#e4f222]"
          >
            <option value={4}>4 Bytes (32-bit addressable)</option>
            <option value={8}>8 Bytes (64-bit addressable)</option>
          </select>
        </div>

        <div>
          <label className="block text-[#8a8f98] mb-1 uppercase">Direct Pointers</label>
          <input
            type="number"
            min="1"
            max="32"
            value={directPointers}
            onChange={(e) => { setDirectPointers(Number(e.target.value)); setVerificationResult(null); }}
            className="w-full bg-[#161718] border border-[#23252a] text-[#ffffff] rounded-md px-3 py-2 outline-none focus:border-[#e4f222]"
          />
        </div>

        <div>
          <label className="block text-[#8a8f98] mb-1 uppercase">Indirect Structure</label>
          <div className="py-2 px-3 bg-[#161718] border border-[#23252a] rounded-md text-[#d0d6e0] text-[11px]">
            1 Single &bull; 1 Double &bull; 1 Triple
          </div>
        </div>
      </div>

      {/* Student Challenge Input */}
      <form onSubmit={handleVerify} className="p-4 rounded-xl bg-[#08090a] border border-[#23252a] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-[#ffffff] font-sans">Student Challenge:</span>
            <p className="text-[11px] text-[#8a8f98] mt-0.5">
              Given Block Size = {blockSize}B, Pointer = {pointerSize}B, and {directPointers} direct pointers, calculate the max file size in <strong>Gigabytes (GB)</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              step="any"
              required
              placeholder="e.g. 4096"
              value={userAnswerGb}
              onChange={(e) => setUserAnswerGb(e.target.value)}
              className="w-36 bg-[#161718] border border-[#23252a] text-[#ffffff] rounded-md px-3 py-1.5 text-xs font-mono placeholder-[#62666d] focus:border-[#e4f222] outline-none text-center"
            />
            <span className="text-xs font-mono text-[#8a8f98]">GB</span>
            <button
              type="submit"
              className="bg-[#e4f222] hover:brightness-105 active:scale-[0.98] text-[#08090a] font-[510] text-xs px-4 py-1.5 rounded-md transition-all shrink-0 ml-1"
            >
              Verify Answer
            </button>
          </div>
        </div>

        {/* Verification Result Feedback */}
        {verificationResult && (
          <div className={`p-3 rounded-lg border text-xs font-mono flex items-center justify-between transition-all ${
            verificationResult === 'correct'
              ? 'bg-[#27a644]/10 border-[#27a644]/40 text-[#27a644]'
              : 'bg-[#eb5757]/10 border-[#eb5757]/40 text-[#eb5757]'
          }`}>
            <div className="flex items-center gap-2">
              {verificationResult === 'correct' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
              <span>
                {verificationResult === 'correct' 
                  ? `Correct! Maximum file size is approximately ${totalCapacityGb} GB (~${totalCapacityTb} TB).`
                  : `Incorrect. You entered ${userAnswerGb} GB, but the computed capacity is ${totalCapacityGb} GB (~${totalCapacityTb} TB).`}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowExplanation(!showExplanation)}
              className="text-xs underline hover:opacity-80 font-sans"
            >
              {showExplanation ? 'Hide Solution' : 'View AI Derivation'}
            </button>
          </div>
        )}
      </form>

      {/* Capacity Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3 rounded-lg bg-[#08090a] border border-[#23252a]">
          <span className="text-[#8a8f98] text-[10px] block mb-1">DIRECT POINTERS ({directPointers})</span>
          <span className="text-[#ffffff] font-bold">{(directCapacityBytes / 1024).toFixed(1)} KB</span>
          <span className="text-[10px] text-[#62666d] block mt-0.5">{directPointers} &times; {blockSize}B</span>
        </div>

        <div className="p-3 rounded-lg bg-[#08090a] border border-[#23252a]">
          <span className="text-[#8a8f98] text-[10px] block mb-1">SINGLE INDIRECT (P = {P})</span>
          <span className="text-[#ffffff] font-bold">{(singleCapacityBytes / (1024 * 1024)).toFixed(1)} MB</span>
          <span className="text-[10px] text-[#62666d] block mt-0.5">{P} &times; {blockSize}B</span>
        </div>

        <div className="p-3 rounded-lg bg-[#08090a] border border-[#23252a]">
          <span className="text-[#8a8f98] text-[10px] block mb-1">DOUBLE INDIRECT (P&sup2;)</span>
          <span className="text-[#ffffff] font-bold">{(doubleCapacityBytes / (1024 * 1024 * 1024)).toFixed(2)} GB</span>
          <span className="text-[10px] text-[#62666d] block mt-0.5">{P}&sup2; &times; {blockSize}B</span>
        </div>

        <div className="p-3 rounded-lg bg-[#08090a] border border-[#23252a]">
          <span className="text-[#8a8f98] text-[10px] block mb-1">TRIPLE INDIRECT (P&sup3;)</span>
          <span className="text-[#e4f222] font-bold">{totalCapacityTb} TB</span>
          <span className="text-[10px] text-[#62666d] block mt-0.5">{P}&sup3; &times; {blockSize}B</span>
        </div>
      </div>

      {/* Collapsible Step-by-Step AI Derivation */}
      {(showExplanation || verificationResult) && (
        <div className="p-4 rounded-xl bg-[#161718] border border-[#23252a] space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between text-[#ffffff] font-semibold border-b border-[#23252a] pb-2">
            <span className="flex items-center gap-1.5 text-[#e4f222]">
              <Sparkles size={14} />
              <span>Mathematical Inode Derivation Proof</span>
            </span>
            <span className="text-[11px] text-[#8a8f98]">Pointers/Block P = {P}</span>
          </div>

          <div className="space-y-2 text-[11px] text-[#d0d6e0] leading-relaxed">
            <p>1. Pointers per index block <code className="text-[#ffffff]">P = Block Size / Pointer Size = {blockSize} / {pointerSize} = {P}</code> pointers.</p>
            <p>2. Direct capacity = <code className="text-[#ffffff]">{directPointers} &times; {blockSize}B = {directCapacityBytes} Bytes</code> ({(directCapacityBytes / 1024).toFixed(1)} KB).</p>
            <p>3. Single indirect capacity = <code className="text-[#ffffff]">{P} &times; {blockSize}B = {singleCapacityBytes} Bytes</code> ({(singleCapacityBytes / (1024 * 1024)).toFixed(1)} MB).</p>
            <p>4. Double indirect capacity = <code className="text-[#ffffff]">{P}&sup2; &times; {blockSize}B = {P * P} &times; {blockSize} = {doubleCapacityBytes} Bytes</code> ({(doubleCapacityBytes / (1024 * 1024 * 1024)).toFixed(2)} GB).</p>
            <p>5. Triple indirect capacity = <code className="text-[#ffffff]">{P}&sup3; &times; {blockSize}B = {Math.pow(P, 3)} &times; {blockSize} = {tripleCapacityBytes} Bytes</code> ({totalCapacityTb} TB).</p>
            <div className="p-2.5 rounded bg-[#08090a] border border-[#23252a] font-bold text-[#e4f222] flex justify-between">
              <span>Total File Capacity (Dominant Term &asymp; P&sup3; &times; B):</span>
              <span>{totalCapacityGb} GB ({totalCapacityTb} TB)</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
