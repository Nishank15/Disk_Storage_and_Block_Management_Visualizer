import React, { useState } from 'react';
import { Database, RotateCw, CheckCircle2, XCircle, Sparkles } from 'lucide-react';

export default function BlockingFactorWorkbench() {
  const [totalRecords, setTotalRecords] = useState(20000);
  const [recordSize, setRecordSize] = useState(100);
  const [blockSize, setBlockSize] = useState(1024);
  const [spanned, setSpanned] = useState(false); // false = unspanned (standard)

  // Student practice
  const [userBfr, setUserBfr] = useState('');
  const [userBlocks, setUserBlocks] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Derivations
  const bfr = spanned 
    ? Number((blockSize / recordSize).toFixed(2)) 
    : Math.floor(blockSize / recordSize);

  const internalFragPerBlock = spanned ? 0 : blockSize - (bfr * recordSize);
  const totalBlocks = Math.ceil(totalRecords / bfr);
  const totalWastedBytes = spanned ? 0 : totalBlocks * internalFragPerBlock;
  const utilization = Number(((bfr * recordSize) / blockSize * 100).toFixed(1));

  const handleRandomize = () => {
    const blockSizes = [512, 1024, 2048, 4096, 8192];
    const recSizes = [64, 80, 100, 128, 150, 200, 250];
    const recordCounts = [5000, 10000, 15000, 20000, 50000];

    const randBlock = blockSizes[Math.floor(Math.random() * blockSizes.length)];
    const randRec = recSizes[Math.floor(Math.random() * recSizes.length)];
    const randN = recordCounts[Math.floor(Math.random() * recordCounts.length)];

    setBlockSize(randBlock);
    setRecordSize(randRec);
    setTotalRecords(randN);
    setSpanned(false);
    setUserBfr('');
    setUserBlocks('');
    setVerificationResult(null);
    setShowExplanation(false);
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (!userBfr.trim() || !userBlocks.trim()) return;

    const bfrCorrect = Number(userBfr.trim()) === Math.floor(bfr);
    const blocksCorrect = Number(userBlocks.trim()) === totalBlocks;

    if (bfrCorrect && blocksCorrect) {
      setVerificationResult('correct');
    } else {
      setVerificationResult('incorrect');
    }
    setShowExplanation(true);
  };

  return (
    <div className="bg-[#0f1011] border border-[#23252a] rounded-xl p-5 md:p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] space-y-6">
      
      {/* Title & Randomize */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#23252a]">
        <div>
          <div className="flex items-center gap-2">
            <Database size={16} className="text-[#e4f222]" />
            <h3 className="text-sm font-semibold tracking-wide text-[#ffffff] uppercase font-mono">
              DBMS Blocking Factor & Storage Overhead Solver
            </h3>
          </div>
          <p className="text-xs text-[#8a8f98] mt-0.5">
            Compute blocking factor Bfr, internal fragmentation, and total required storage blocks.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRandomize}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#161718] border border-[#23252a] hover:border-[#383b3f] text-[#d0d6e0] hover:text-[#ffffff] text-xs font-mono transition-all self-start sm:self-auto"
        >
          <RotateCw size={13} className="text-[#e4f222]" />
          <span>Randomize Problem</span>
        </button>
      </div>

      {/* Input Parameters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
        <div>
          <label className="block text-[#8a8f98] mb-1 uppercase">Total Records (N)</label>
          <input
            type="number"
            min="100"
            max="1000000"
            value={totalRecords}
            onChange={(e) => { setTotalRecords(Number(e.target.value)); setVerificationResult(null); }}
            className="w-full bg-[#161718] border border-[#23252a] text-[#ffffff] rounded-md px-3 py-2 outline-none focus:border-[#e4f222]"
          />
        </div>

        <div>
          <label className="block text-[#8a8f98] mb-1 uppercase">Record Size (R bytes)</label>
          <input
            type="number"
            min="10"
            max="4096"
            value={recordSize}
            onChange={(e) => { setRecordSize(Number(e.target.value)); setVerificationResult(null); }}
            className="w-full bg-[#161718] border border-[#23252a] text-[#ffffff] rounded-md px-3 py-2 outline-none focus:border-[#e4f222]"
          />
        </div>

        <div>
          <label className="block text-[#8a8f98] mb-1 uppercase">Block Size (B bytes)</label>
          <select
            value={blockSize}
            onChange={(e) => { setBlockSize(Number(e.target.value)); setVerificationResult(null); }}
            className="w-full bg-[#161718] border border-[#23252a] text-[#ffffff] rounded-md px-3 py-2 outline-none focus:border-[#e4f222]"
          >
            <option value={512}>512 Bytes</option>
            <option value={1024}>1024 Bytes (1 KB)</option>
            <option value={2048}>2048 Bytes (2 KB)</option>
            <option value={4096}>4096 Bytes (4 KB)</option>
            <option value={8192}>8192 Bytes (8 KB)</option>
          </select>
        </div>

        <div>
          <label className="block text-[#8a8f98] mb-1 uppercase">Organization Mode</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setSpanned(false); setVerificationResult(null); }}
              className={`flex-1 py-2 text-xs rounded-md border transition-all ${
                !spanned ? 'bg-[#08090a] text-[#ffffff] border-[#e4f222]' : 'bg-[#161718] text-[#8a8f98] border-[#23252a]'
              }`}
            >
              Unspanned
            </button>
            <button
              type="button"
              onClick={() => { setSpanned(true); setVerificationResult(null); }}
              className={`flex-1 py-2 text-xs rounded-md border transition-all ${
                spanned ? 'bg-[#08090a] text-[#ffffff] border-[#e4f222]' : 'bg-[#161718] text-[#8a8f98] border-[#23252a]'
              }`}
            >
              Spanned
            </button>
          </div>
        </div>
      </div>

      {/* Student Challenge Input Form */}
      <form onSubmit={handleVerify} className="p-4 rounded-xl bg-[#08090a] border border-[#23252a] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-[#ffffff] font-sans">Student Challenge:</span>
            <p className="text-[11px] text-[#8a8f98] mt-0.5">
              Enter the calculated Blocking Factor (Bfr) and Total Blocks (b) for N={totalRecords}, R={recordSize}B, B={blockSize}B.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              required
              placeholder="Bfr"
              value={userBfr}
              onChange={(e) => setUserBfr(e.target.value)}
              className="w-20 bg-[#161718] border border-[#23252a] text-[#ffffff] rounded-md px-2.5 py-1.5 text-xs font-mono placeholder-[#62666d] focus:border-[#e4f222] outline-none text-center"
              title="Blocking Factor"
            />
            <input
              type="number"
              required
              placeholder="Total Blocks (b)"
              value={userBlocks}
              onChange={(e) => setUserBlocks(e.target.value)}
              className="w-28 bg-[#161718] border border-[#23252a] text-[#ffffff] rounded-md px-2.5 py-1.5 text-xs font-mono placeholder-[#62666d] focus:border-[#e4f222] outline-none text-center"
              title="Total Blocks required"
            />
            <button
              type="submit"
              className="bg-[#e4f222] hover:brightness-105 active:scale-[0.98] text-[#08090a] font-[510] text-xs px-4 py-1.5 rounded-md transition-all shrink-0"
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
                  ? `Correct! Bfr = ${bfr} records/block and Total Blocks = ${totalBlocks.toLocaleString()}.`
                  : `Incorrect. Expected Bfr = ${bfr} and Total Blocks = ${totalBlocks.toLocaleString()}.`}
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

      {/* Real-time Storage Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3 rounded-lg bg-[#08090a] border border-[#23252a]">
          <span className="text-[#8a8f98] text-[10px] block mb-1">BLOCKING FACTOR (BFR)</span>
          <span className="text-[#e4f222] font-bold text-base">{bfr} records</span>
          <span className="text-[10px] text-[#62666d] block mt-0.5">&lfloor; {blockSize} / {recordSize} &rfloor;</span>
        </div>

        <div className="p-3 rounded-lg bg-[#08090a] border border-[#23252a]">
          <span className="text-[#8a8f98] text-[10px] block mb-1">INTERNAL FRAGMENTATION</span>
          <span className="text-[#eb5757] font-bold text-base">{internalFragPerBlock} Bytes</span>
          <span className="text-[10px] text-[#62666d] block mt-0.5">Wasted slack per block</span>
        </div>

        <div className="p-3 rounded-lg bg-[#08090a] border border-[#23252a]">
          <span className="text-[#8a8f98] text-[10px] block mb-1">TOTAL BLOCKS (b)</span>
          <span className="text-[#ffffff] font-bold text-base">{totalBlocks.toLocaleString()}</span>
          <span className="text-[10px] text-[#62666d] block mt-0.5">&lceil; {totalRecords} / {bfr} &rceil;</span>
        </div>

        <div className="p-3 rounded-lg bg-[#08090a] border border-[#23252a]">
          <span className="text-[#8a8f98] text-[10px] block mb-1">TOTAL WASTED SPACE</span>
          <span className="text-[#ffffff] font-bold text-base">{(totalWastedBytes / 1024).toFixed(1)} KB</span>
          <span className="text-[10px] text-[#27a644] block mt-0.5">{utilization}% utilization</span>
        </div>
      </div>

      {/* Collapsible Step-by-Step AI Derivation */}
      {(showExplanation || verificationResult) && (
        <div className="p-4 rounded-xl bg-[#161718] border border-[#23252a] space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between text-[#ffffff] font-semibold border-b border-[#23252a] pb-2">
            <span className="flex items-center gap-1.5 text-[#e4f222]">
              <Sparkles size={14} />
              <span>Step-by-Step Mathematical Derivation</span>
            </span>
            <span className="text-[11px] text-[#8a8f98]">Mode: {spanned ? 'Spanned' : 'Unspanned'}</span>
          </div>

          <div className="space-y-2 text-[11px] text-[#d0d6e0] leading-relaxed">
            <p>1. In {spanned ? 'spanned' : 'unspanned'} organization, records {spanned ? 'can' : 'cannot'} cross block boundaries.</p>
            <p>2. Blocking Factor: <code className="text-[#ffffff]">Bfr = &lfloor; Block Size / Record Size &rfloor; = &lfloor; {blockSize} / {recordSize} &rfloor; = {bfr}</code> records per block.</p>
            <p>3. Internal Fragmentation per block: <code className="text-[#ffffff]">Block Size - (Bfr &times; Record Size) = {blockSize} - ({bfr} &times; {recordSize}) = {internalFragPerBlock} Bytes</code>.</p>
            <p>4. Total Blocks needed: <code className="text-[#ffffff]">b = &lceil; Total Records / Bfr &rceil; = &lceil; {totalRecords} / {bfr} &rceil; = {totalBlocks} Blocks</code>.</p>
            <p>5. Net Wasted Space across table: <code className="text-[#ffffff]">{totalBlocks} &times; {internalFragPerBlock} Bytes = {totalWastedBytes.toLocaleString()} Bytes</code> ({(totalWastedBytes / 1024).toFixed(1)} KB).</p>
          </div>
        </div>
      )}

    </div>
  );
}
