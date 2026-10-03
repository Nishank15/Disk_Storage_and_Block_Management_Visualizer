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
    <div 
      className="bg-[#08090a] text-[#d0d6e0] font-mono text-xs p-3.5 rounded-[6px] border border-[#23252a] h-64 overflow-y-auto" 
      ref={scrollRef}
    >
      {logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-[#62666d]">
          <Terminal size={20} className="mb-2 opacity-50" />
          <p className="text-[11px]">StorageOS kernel ready. Awaiting allocation instructions...</p>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {logs.map((log, i) => {
            let color = 'text-[#d0d6e0]';
            if (log.type === 'error' || log.type === 'warning') color = 'text-[#eb5757]';
            if (log.type === 'success') color = 'text-[#27a644]';
            if (log.type === 'info') color = 'text-[#e4f222]';

            return (
              <div key={i} className="flex gap-2.5 py-0.5 border-b border-[#161718] last:border-0 leading-relaxed">
                <span className="text-[#62666d] shrink-0 font-mono text-[11px]">[{log.time}]</span>
                <span className={`${color} text-[11px] break-all`}>{log.message}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
