import React, { useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';

export default function ExecutionLogs({ logs }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-slate-900 text-slate-300 font-mono text-xs p-4 rounded-xl h-64 overflow-y-auto custom-scrollbar shadow-inner" ref={scrollRef}>
      {logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-slate-600">
          <Terminal size={24} className="mb-2 opacity-50" />
          <p>System ready. Waiting for instructions...</p>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {logs.map((log, i) => {
            let color = 'text-slate-300';
            if (log.type === 'error' || log.type === 'warning') color = 'text-brand-rose';
            if (log.type === 'success') color = 'text-brand-emerald';
            if (log.type === 'info') color = 'text-brand-cyan';

            return (
              <div key={i} className="flex gap-3 py-1 border-b border-slate-800 last:border-0">
                <span className="text-slate-500 shrink-0">[{log.time}]</span>
                <span className={`${color}`}>{log.message}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
