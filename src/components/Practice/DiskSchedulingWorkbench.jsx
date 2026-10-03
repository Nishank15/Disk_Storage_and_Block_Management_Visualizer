import React, { useState, useMemo } from 'react';
import { RotateCw, CheckCircle2, XCircle, Disc, Sparkles } from 'lucide-react';

export default function DiskSchedulingWorkbench() {
  const [maxCylinder, setMaxCylinder] = useState(199);
  const [initialHead, setInitialHead] = useState(53);
  const [queueInput, setQueueInput] = useState('98, 183, 37, 122, 14, 124, 65, 67');
  const [direction, setDirection] = useState('Up'); // 'Up' or 'Down'
  const [algorithm, setAlgorithm] = useState('SSTF'); // FCFS, SSTF, SCAN, C-SCAN, LOOK, C-LOOK

  // Practice state
  const [userAnswer, setUserAnswer] = useState('');
  const [verificationResult, setVerificationResult] = useState(null); // 'correct' | 'incorrect'
  const [showExplanation, setShowExplanation] = useState(false);

  // Parse queue
  const requests = useMemo(() => {
    return queueInput
      .split(',')
      .map(s => Number(s.trim()))
      .filter(n => !isNaN(n) && n >= 0 && n <= maxCylinder);
  }, [queueInput, maxCylinder]);

  // Solver Engine
  const solution = useMemo(() => {
    const init = Number(initialHead);
    const reqs = [...requests];
    if (reqs.length === 0) return { sequence: [init], totalMovement: 0, steps: [] };

    let sequence = [init];
    let totalMovement = 0;
    const steps = [];

    if (algorithm === 'FCFS') {
      let current = init;
      reqs.forEach(req => {
        const dist = Math.abs(req - current);
        steps.push({ from: current, to: req, dist });
        totalMovement += dist;
        current = req;
        sequence.push(req);
      });
    } else if (algorithm === 'SSTF') {
      let current = init;
      const unvisited = [...reqs];
      while (unvisited.length > 0) {
        let nearestIdx = 0;
        let minDist = Math.abs(unvisited[0] - current);
        for (let i = 1; i < unvisited.length; i++) {
          const d = Math.abs(unvisited[i] - current);
          if (d < minDist) {
            minDist = d;
            nearestIdx = i;
          }
        }
        const next = unvisited.splice(nearestIdx, 1)[0];
        steps.push({ from: current, to: next, dist: minDist });
        totalMovement += minDist;
        current = next;
        sequence.push(next);
      }
    } else if (algorithm === 'SCAN') {
      let current = init;
      const higher = reqs.filter(r => r >= current).sort((a, b) => a - b);
      const lower = reqs.filter(r => r < current).sort((a, b) => b - a);

      if (direction === 'Up') {
        higher.forEach(r => {
          const dist = Math.abs(r - current);
          steps.push({ from: current, to: r, dist });
          totalMovement += dist;
          current = r;
          sequence.push(r);
        });
        if (lower.length > 0) {
          // Go to max boundary 199
          const distMax = Math.abs(maxCylinder - current);
          if (distMax > 0) {
            steps.push({ from: current, to: maxCylinder, dist: distMax, boundary: true });
            totalMovement += distMax;
            current = maxCylinder;
            sequence.push(maxCylinder);
          }
          lower.forEach(r => {
            const dist = Math.abs(r - current);
            steps.push({ from: current, to: r, dist });
            totalMovement += dist;
            current = r;
            sequence.push(r);
          });
        }
      } else {
        lower.forEach(r => {
          const dist = Math.abs(r - current);
          steps.push({ from: current, to: r, dist });
          totalMovement += dist;
          current = r;
          sequence.push(r);
        });
        if (higher.length > 0) {
          // Go to min boundary 0
          const distZero = Math.abs(0 - current);
          if (distZero > 0) {
            steps.push({ from: current, to: 0, dist: distZero, boundary: true });
            totalMovement += distZero;
            current = 0;
            sequence.push(0);
          }
          higher.forEach(r => {
            const dist = Math.abs(r - current);
            steps.push({ from: current, to: r, dist });
            totalMovement += dist;
            current = r;
            sequence.push(r);
          });
        }
      }
    } else if (algorithm === 'C-SCAN') {
      let current = init;
      const higher = reqs.filter(r => r >= current).sort((a, b) => a - b);
      const lower = reqs.filter(r => r < current).sort((a, b) => a - b);

      if (direction === 'Up') {
        higher.forEach(r => {
          const dist = Math.abs(r - current);
          steps.push({ from: current, to: r, dist });
          totalMovement += dist;
          current = r;
          sequence.push(r);
        });
        if (lower.length > 0) {
          // Travel to max boundary
          const distMax = Math.abs(maxCylinder - current);
          steps.push({ from: current, to: maxCylinder, dist: distMax, boundary: true });
          totalMovement += distMax;
          current = maxCylinder;
          sequence.push(maxCylinder);

          // Wrap to 0 without serving
          const distWrap = maxCylinder; // from 199 to 0
          steps.push({ from: current, to: 0, dist: distWrap, boundary: true, note: 'Circular Return' });
          totalMovement += distWrap;
          current = 0;
          sequence.push(0);

          lower.forEach(r => {
            const dist = Math.abs(r - current);
            steps.push({ from: current, to: r, dist });
            totalMovement += dist;
            current = r;
            sequence.push(r);
          });
        }
      } else {
        const lowerDesc = reqs.filter(r => r <= current).sort((a, b) => b - a);
        const higherDesc = reqs.filter(r => r > current).sort((a, b) => b - a);
        lowerDesc.forEach(r => {
          const dist = Math.abs(r - current);
          steps.push({ from: current, to: r, dist });
          totalMovement += dist;
          current = r;
          sequence.push(r);
        });
        if (higherDesc.length > 0) {
          const distZero = Math.abs(0 - current);
          steps.push({ from: current, to: 0, dist: distZero, boundary: true });
          totalMovement += distZero;
          current = 0;
          sequence.push(0);

          steps.push({ from: current, to: maxCylinder, dist: maxCylinder, boundary: true, note: 'Circular Return' });
          totalMovement += maxCylinder;
          current = maxCylinder;
          sequence.push(maxCylinder);

          higherDesc.forEach(r => {
            const dist = Math.abs(r - current);
            steps.push({ from: current, to: r, dist });
            totalMovement += dist;
            current = r;
            sequence.push(r);
          });
        }
      }
    } else if (algorithm === 'LOOK') {
      let current = init;
      const higher = reqs.filter(r => r >= current).sort((a, b) => a - b);
      const lower = reqs.filter(r => r < current).sort((a, b) => b - a);

      if (direction === 'Up') {
        higher.forEach(r => {
          const dist = Math.abs(r - current);
          steps.push({ from: current, to: r, dist });
          totalMovement += dist;
          current = r;
          sequence.push(r);
        });
        lower.forEach(r => {
          const dist = Math.abs(r - current);
          steps.push({ from: current, to: r, dist });
          totalMovement += dist;
          current = r;
          sequence.push(r);
        });
      } else {
        lower.forEach(r => {
          const dist = Math.abs(r - current);
          steps.push({ from: current, to: r, dist });
          totalMovement += dist;
          current = r;
          sequence.push(r);
        });
        higher.forEach(r => {
          const dist = Math.abs(r - current);
          steps.push({ from: current, to: r, dist });
          totalMovement += dist;
          current = r;
          sequence.push(r);
        });
      }
    } else if (algorithm === 'C-LOOK') {
      let current = init;
      const higher = reqs.filter(r => r >= current).sort((a, b) => a - b);
      const lower = reqs.filter(r => r < current).sort((a, b) => a - b);

      if (direction === 'Up') {
        higher.forEach(r => {
          const dist = Math.abs(r - current);
          steps.push({ from: current, to: r, dist });
          totalMovement += dist;
          current = r;
          sequence.push(r);
        });
        if (lower.length > 0) {
          const lowestReq = lower[0];
          const distJump = Math.abs(lowestReq - current);
          steps.push({ from: current, to: lowestReq, dist: distJump, note: 'Direct Circular Jump' });
          totalMovement += distJump;
          current = lowestReq;
          sequence.push(lowestReq);

          lower.slice(1).forEach(r => {
            const dist = Math.abs(r - current);
            steps.push({ from: current, to: r, dist });
            totalMovement += dist;
            current = r;
            sequence.push(r);
          });
        }
      } else {
        const lowerDesc = reqs.filter(r => r <= current).sort((a, b) => b - a);
        const higherAsc = reqs.filter(r => r > current).sort((a, b) => a - b);
        lowerDesc.forEach(r => {
          const dist = Math.abs(r - current);
          steps.push({ from: current, to: r, dist });
          totalMovement += dist;
          current = r;
          sequence.push(r);
        });
        if (higherAsc.length > 0) {
          const highestReq = higherAsc[higherAsc.length - 1];
          const distJump = Math.abs(highestReq - current);
          steps.push({ from: current, to: highestReq, dist: distJump, note: 'Direct Circular Jump' });
          totalMovement += distJump;
          current = highestReq;
          sequence.push(highestReq);

          higherAsc.slice(0, higherAsc.length - 1).reverse().forEach(r => {
            const dist = Math.abs(r - current);
            steps.push({ from: current, to: r, dist });
            totalMovement += dist;
            current = r;
            sequence.push(r);
          });
        }
      }
    }

    return { sequence, totalMovement, steps };
  }, [algorithm, initialHead, requests, direction, maxCylinder]);

  // Randomize Problem
  const handleRandomize = () => {
    const randHead = Math.floor(Math.random() * 140) + 30;
    const count = 8;
    const randReqs = [];
    while (randReqs.length < count) {
      const num = Math.floor(Math.random() * 195) + 2;
      if (!randReqs.includes(num) && num !== randHead) randReqs.push(num);
    }
    const algos = ['FCFS', 'SSTF', 'SCAN', 'C-SCAN', 'LOOK', 'C-LOOK'];
    const randAlgo = algos[Math.floor(Math.random() * algos.length)];
    const randDir = Math.random() > 0.5 ? 'Up' : 'Down';

    setInitialHead(randHead);
    setQueueInput(randReqs.join(', '));
    setAlgorithm(randAlgo);
    setDirection(randDir);
    setUserAnswer('');
    setVerificationResult(null);
    setShowExplanation(false);
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;
    const parsed = Number(userAnswer.trim());
    if (parsed === solution.totalMovement) {
      setVerificationResult('correct');
    } else {
      setVerificationResult('incorrect');
    }
    setShowExplanation(true);
  };

  return (
    <div className="bg-[#0f1011] border border-[#23252a] rounded-xl p-5 md:p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] space-y-6">
      
      {/* Title & Randomize Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#23252a]">
        <div>
          <div className="flex items-center gap-2">
            <Disc size={16} className="text-[#e4f222]" />
            <h3 className="text-sm font-semibold tracking-wide text-[#ffffff] uppercase font-mono">
              Disk Arm Scheduling Problem Solver & Practice
            </h3>
          </div>
          <p className="text-xs text-[#8a8f98] mt-0.5">
            Test cylinder seek optimization algorithms against GATE CSE examination scenarios.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRandomize}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#161718] border border-[#23252a] hover:border-[#383b3f] text-[#d0d6e0] hover:text-[#ffffff] text-xs font-mono transition-all self-start sm:self-auto"
        >
          <RotateCw size={13} className="text-[#e4f222]" />
          <span>Randomize Scenario</span>
        </button>
      </div>

      {/* Input Parameters Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-mono text-[#8a8f98] mb-1 uppercase">Algorithm</label>
          <select
            value={algorithm}
            onChange={(e) => { setAlgorithm(e.target.value); setVerificationResult(null); }}
            className="w-full bg-[#161718] border border-[#23252a] text-[#ffffff] rounded-md px-3 py-2 text-xs font-mono focus:border-[#e4f222] outline-none"
          >
            <option value="SSTF">SSTF (Shortest Seek Time First)</option>
            <option value="SCAN">SCAN (Elevator Algorithm)</option>
            <option value="C-SCAN">C-SCAN (Circular SCAN)</option>
            <option value="LOOK">LOOK (Boundary Optimized)</option>
            <option value="C-LOOK">C-LOOK (Circular LOOK)</option>
            <option value="FCFS">FCFS (First-Come, First-Served)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono text-[#8a8f98] mb-1 uppercase">Initial Head Position</label>
          <input
            type="number"
            min="0"
            max={maxCylinder}
            value={initialHead}
            onChange={(e) => { setInitialHead(Number(e.target.value)); setVerificationResult(null); }}
            className="w-full bg-[#161718] border border-[#23252a] text-[#ffffff] rounded-md px-3 py-2 text-xs font-mono focus:border-[#e4f222] outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-[#8a8f98] mb-1 uppercase">Head Arm Direction</label>
          <div className="flex gap-2">
            {['Up', 'Down'].map(dir => (
              <button
                key={dir}
                type="button"
                onClick={() => { setDirection(dir); setVerificationResult(null); }}
                className={`flex-1 py-2 text-xs font-mono rounded-md border transition-all ${
                  direction === dir
                    ? 'bg-[#08090a] text-[#ffffff] border-[#e4f222]'
                    : 'bg-[#161718] text-[#8a8f98] border-[#23252a]'
                }`}
              >
                {dir === 'Up' ? 'Towards Max (Up)' : 'Towards Zero (Down)'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-[#8a8f98] mb-1 uppercase">Disk Max Cylinder</label>
          <input
            type="number"
            min="50"
            max="10000"
            value={maxCylinder}
            onChange={(e) => { setMaxCylinder(Number(e.target.value)); setVerificationResult(null); }}
            className="w-full bg-[#161718] border border-[#23252a] text-[#ffffff] rounded-md px-3 py-2 text-xs font-mono focus:border-[#e4f222] outline-none"
          />
        </div>

        <div className="sm:col-span-2 lg:col-span-4">
          <label className="block text-xs font-mono text-[#8a8f98] mb-1 uppercase">Request Queue (Cylinders)</label>
          <input
            type="text"
            value={queueInput}
            onChange={(e) => { setQueueInput(e.target.value); setVerificationResult(null); }}
            placeholder="e.g. 98, 183, 37, 122, 14, 124, 65, 67"
            className="w-full bg-[#161718] border border-[#23252a] text-[#ffffff] rounded-md px-3 py-2 text-xs font-mono focus:border-[#e4f222] outline-none"
          />
        </div>
      </div>

      {/* Student Interactive Answer Box */}
      <form onSubmit={handleVerify} className="p-4 rounded-xl bg-[#08090a] border border-[#23252a] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-[#ffffff] font-sans">Student Challenge:</span>
            <p className="text-[11px] text-[#8a8f98] mt-0.5">
              Calculate total head movement for {algorithm} starting at cylinder {initialHead} (moving {direction}).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              required
              placeholder="e.g. 236"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="w-32 bg-[#161718] border border-[#23252a] text-[#ffffff] rounded-md px-3 py-1.5 text-xs font-mono placeholder-[#62666d] focus:border-[#e4f222] outline-none text-center"
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
                  ? `Correct! Total head movement is precisely ${solution.totalMovement} cylinders.`
                  : `Incorrect. You entered ${userAnswer} cylinders, but the computed movement is ${solution.totalMovement} cylinders.`}
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

      {/* Seek Sequence Path Bar */}
      <div className="p-4 rounded-xl bg-[#08090a] border border-[#23252a] space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-[#8a8f98]">VISITED CYLINDER TRAJECTORY:</span>
          <span className="text-[#e4f222] font-bold">Total: {solution.totalMovement} Cylinders</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          {solution.sequence.map((cyl, idx) => (
            <React.Fragment key={idx}>
              <span className={`px-2.5 py-1 rounded border ${
                idx === 0 
                  ? 'bg-[#e4f222] text-[#08090a] border-[#e4f222] font-bold' 
                  : cyl === 0 || cyl === maxCylinder
                  ? 'bg-[#eb5757]/20 border-[#eb5757]/40 text-[#eb5757]'
                  : 'bg-[#161718] text-[#ffffff] border-[#23252a]'
              }`}>
                {cyl}
              </span>
              {idx < solution.sequence.length - 1 && (
                <span className="text-[#62666d]">&rarr;</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Collapsible AI Step-by-Step Explanation */}
      {(showExplanation || verificationResult) && (
        <div className="p-4 rounded-xl bg-[#161718] border border-[#23252a] space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between text-[#ffffff] font-semibold border-b border-[#23252a] pb-2">
            <span className="flex items-center gap-1.5 text-[#e4f222]">
              <Sparkles size={14} />
              <span>AI Step-by-Step Seek Derivation</span>
            </span>
            <span className="text-[11px] text-[#8a8f98]">Algorithm: {algorithm}</span>
          </div>

          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {solution.steps.map((st, i) => (
              <div key={i} className="flex items-center justify-between py-1 border-b border-[#23252a]/60 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="text-[#8a8f98] w-5">#{i + 1}</span>
                  <span className="text-[#ffffff]">Cylinder {st.from}</span>
                  <span className="text-[#e4f222]">&rarr;</span>
                  <span className="text-[#ffffff]">Cylinder {st.to}</span>
                  {st.note && <span className="text-[#27a644] text-[10px]">({st.note})</span>}
                  {st.boundary && !st.note && <span className="text-[#eb5757] text-[10px]">(Boundary Limit)</span>}
                </div>
                <span className="text-[#e4f222] font-bold">|{st.to} - {st.from}| = {st.dist} cyl</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-[#23252a] flex justify-between font-bold text-xs text-[#ffffff]">
            <span>Net Sum of Head Traversals:</span>
            <span className="text-[#e4f222]">{solution.totalMovement} Cylinders</span>
          </div>
        </div>
      )}

    </div>
  );
}
