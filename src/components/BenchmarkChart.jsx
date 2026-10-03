import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#161718] border border-[#23252a] text-[#ffffff] p-3 rounded-[6px] shadow-xl text-xs font-mono">
        <p className="font-bold text-[#ffffff] mb-1">{label}</p>
        <p className="text-[#8a8f98]">Strategy: <span className="text-[#e4f222]">{data.strategy}</span></p>
        <p className="text-[#8a8f98]">Seek Distance: <span className="text-[#ffffff] font-bold">{data.hops} hops</span></p>
      </div>
    );
  }
  return null;
};

export default function BenchmarkChart({ benchmarkData }) {
  if (benchmarkData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-[#62666d]">
        <p className="text-xs">Allocate files to generate seek distance benchmark data.</p>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={benchmarkData}
          margin={{ top: 15, right: 20, left: -25, bottom: 5 }}
        >
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#8a8f98', fontSize: 11, fontFamily: 'JetBrains Mono' }} 
            axisLine={{ stroke: '#23252a' }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: '#8a8f98', fontSize: 11, fontFamily: 'JetBrains Mono' }} 
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }} />
          <Bar dataKey="hops" radius={[4, 4, 0, 0]}>
            {benchmarkData.map((entry, index) => {
              let color = '#27a644'; // Contiguous
              if (entry.strategy === 'Linked') color = '#f59e0b';
              if (entry.strategy === 'Indexed') color = '#e4f222';
              return <Cell key={`cell-${index}`} fill={color} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap justify-center gap-6 mt-2 text-xs text-[#8a8f98]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#27a644] rounded-[2px]" />
          <span>Contiguous (1 hop)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#f59e0b] rounded-[2px]" />
          <span>Linked (N hops)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#e4f222] rounded-[2px]" />
          <span>Indexed (N+1 hops)</span>
        </div>
      </div>
    </div>
  );
}
