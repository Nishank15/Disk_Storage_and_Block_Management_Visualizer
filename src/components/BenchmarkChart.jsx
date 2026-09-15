import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function BenchmarkChart({ benchmarkData }) {
  if (benchmarkData.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-400">
        <p className="text-sm">Allocate files to see benchmark data.</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl border border-slate-700 text-xs">
          <p className="font-bold mb-1">{label}</p>
          <p>Strategy: <span className="text-brand-cyan">{data.strategy}</span></p>
          <p>Seek Distance: <span className="text-brand-rose font-bold">{data.hops} hops</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={benchmarkData}
          margin={{ top: 20, right: 30, left: -20, bottom: 5 }}
        >
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#64748B', fontSize: 12 }} 
            axisLine={{ stroke: '#334155' }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: '#64748B', fontSize: 12 }} 
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }} />
          <Bar dataKey="hops" radius={[4, 4, 0, 0]}>
            {benchmarkData.map((entry, index) => {
              // Color based on strategy
              let color = '#6366F1'; // Default Contiguous
              if (entry.strategy === 'Linked') color = '#F59E0B';
              if (entry.strategy === 'Indexed') color = '#10B981';
              return <Cell key={`cell-${index}`} fill={color} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-4 mt-2 text-xs text-slate-500">
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-[#6366F1] rounded-sm"></div> Contiguous (1 hop)</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-[#F59E0B] rounded-sm"></div> Linked (N hops)</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-[#10B981] rounded-sm"></div> Indexed (N+1 hops)</div>
      </div>
    </div>
  );
}
