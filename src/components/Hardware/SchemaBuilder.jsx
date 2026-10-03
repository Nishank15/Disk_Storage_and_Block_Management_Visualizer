import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

const DATA_TYPES = [
  { type: 'INTEGER', defaultBytes: 4 },
  { type: 'VARCHAR', defaultBytes: 32 },
  { type: 'CHAR', defaultBytes: 16 },
  { type: 'FLOAT', defaultBytes: 8 },
  { type: 'TIMESTAMP', defaultBytes: 8 },
];

export default function SchemaBuilder({ 
  schema, 
  onUpdateSchema, 
  blockSize, 
  onChangeBlockSize, 
  totalRecords = 100 
}) {
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState('VARCHAR');
  const [newFieldBytes, setNewFieldBytes] = useState(32);

  const handleTypeChange = (selectedType) => {
    setNewFieldType(selectedType);
    const matched = DATA_TYPES.find(d => d.type === selectedType);
    if (matched) {
      setNewFieldBytes(matched.defaultBytes);
    }
  };

  const handleAddField = (e) => {
    e.preventDefault();
    if (!newFieldName.trim()) return;

    onUpdateSchema([
      ...schema,
      {
        name: newFieldName.trim().toLowerCase().replace(/\s+/g, '_'),
        type: newFieldType,
        bytes: Number(newFieldBytes) || 4
      }
    ]);
    setNewFieldName('');
  };

  const handleDeleteField = (index) => {
    if (schema.length <= 1) return; // Maintain at least 1 field
    onUpdateSchema(schema.filter((_, idx) => idx !== index));
  };

  // DBMS Mathematical Calculations
  const recordHeaderBytes = 4; // 4B tuple header (null bitmap & metadata)
  const sumFieldBytes = schema.reduce((acc, f) => acc + Number(f.bytes), 0);
  const recordSize = sumFieldBytes + recordHeaderBytes; // R
  const blockingFactor = Math.max(1, Math.floor(blockSize / recordSize)); // Bfr = floor(B / R)
  const wastedBytesPerBlock = blockSize - (blockingFactor * recordSize); // Internal Fragmentation
  const totalBlocksRequired = Math.ceil(totalRecords / blockingFactor); // b = ceil(N / Bfr)
  const utilizationPercentage = Number(((blockingFactor * recordSize) / blockSize * 100).toFixed(1));

  return (
    <div className="bg-[#0f1011] border border-[#23252a] rounded-xl p-5 md:p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] space-y-6">
      
      {/* Header & Block Size Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#23252a]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#e4f222]"></span>
            <h2 className="text-sm font-semibold tracking-wide text-[#ffffff] uppercase font-mono">
              Custom Table Schema & Block Sizing
            </h2>
          </div>
          <p className="text-xs text-[#8a8f98] mt-0.5">
            Configure record schema attributes and physical page dimensions to compute DBMS storage metrics.
          </p>
        </div>

        {/* Block Size Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-mono text-[#8a8f98]">Block Size (B):</label>
          <select
            value={blockSize}
            onChange={(e) => onChangeBlockSize(Number(e.target.value))}
            className="bg-[#161718] border border-[#23252a] text-[#ffffff] text-xs font-mono rounded-md px-3 py-1.5 focus:border-[#e4f222] focus:outline-none transition-colors"
          >
            <option value={512}>512 Bytes (Legacy Sector)</option>
            <option value={1024}>1024 Bytes (1 KB Page)</option>
            <option value={2048}>2048 Bytes (2 KB Page)</option>
            <option value={4096}>4096 Bytes (4 KB Standard DBMS)</option>
            <option value={8192}>8192 Bytes (8 KB PostgreSQL)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Field Schema Editor (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Active Field Rows List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#8a8f98] px-2 uppercase">
              <span>Attribute Name</span>
              <div className="flex items-center gap-8">
                <span>Data Type</span>
                <span>Bytes</span>
                <span className="w-6"></span>
              </div>
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {schema.map((field, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#161718] border border-[#23252a] text-xs font-mono group hover:border-[#383b3f] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e4f222]" />
                    <span className="text-[#ffffff] font-semibold">{field.name}</span>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <span className="px-2 py-0.5 rounded bg-[#08090a] text-[#d0d6e0] border border-[#23252a] text-[11px]">
                      {field.type}
                    </span>
                    <span className="text-[#e4f222] font-bold w-12 text-right">
                      {field.bytes} B
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteField(idx)}
                      disabled={schema.length <= 1}
                      className="p-1 text-[#8a8f98] hover:text-[#eb5757] disabled:opacity-30 disabled:hover:text-[#8a8f98] transition-colors"
                      title="Remove Field"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Attribute Form */}
          <form onSubmit={handleAddField} className="p-3 rounded-lg bg-[#08090a] border border-[#23252a] space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#8a8f98] block">
              + Append New Attribute
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
              <div className="sm:col-span-5">
                <input
                  type="text"
                  required
                  placeholder="field_name (e.g. phone)"
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  className="w-full bg-[#161718] border border-[#23252a] rounded px-2.5 py-1.5 text-[#ffffff] font-mono placeholder-[#62666d] focus:border-[#e4f222] outline-none"
                />
              </div>

              <div className="sm:col-span-4">
                <select
                  value={newFieldType}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="w-full bg-[#161718] border border-[#23252a] rounded px-2 py-1.5 text-[#ffffff] font-mono focus:border-[#e4f222] outline-none"
                >
                  {DATA_TYPES.map(d => (
                    <option key={d.type} value={d.type}>{d.type}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3 flex gap-2">
                <input
                  type="number"
                  min="1"
                  max="1024"
                  required
                  value={newFieldBytes}
                  onChange={(e) => setNewFieldBytes(Number(e.target.value))}
                  className="w-16 bg-[#161718] border border-[#23252a] rounded px-2 py-1.5 text-[#ffffff] font-mono text-center focus:border-[#e4f222] outline-none"
                  title="Bytes size"
                />
                <button
                  type="submit"
                  className="flex-1 bg-[#e4f222] hover:brightness-105 active:scale-[0.98] text-[#08090a] font-[510] rounded px-2 py-1.5 flex items-center justify-center transition-all"
                  title="Add Attribute"
                >
                  <Plus size={15} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </form>

        </div>

        {/* Right: Real-Time DBMS Storage Metrics HUD (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="p-4 rounded-xl bg-[#08090a] border border-[#23252a] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#23252a]/60">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#e4f222] font-semibold">
                DBMS Storage Metrics HUD
              </span>
              <span className="text-[10px] font-mono text-[#8a8f98]">{totalRecords} Ingested Rows</span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-[#23252a]/60">
                <span className="text-[#8a8f98]">Record Size (R):</span>
                <span className="text-[#ffffff] font-bold">
                  {recordSize} Bytes <span className="text-[10px] text-[#8a8f98] font-normal">({sumFieldBytes}B + 4B hdr)</span>
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-[#23252a]/60">
                <span className="text-[#8a8f98]">Blocking Factor (Bfr):</span>
                <span className="text-[#e4f222] font-bold">
                  {blockingFactor} records / block
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-[#23252a]/60">
                <span className="text-[#8a8f98]">Internal Fragmentation:</span>
                <span className="text-[#eb5757] font-bold">
                  {wastedBytesPerBlock} Bytes / block
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-[#23252a]/60">
                <span className="text-[#8a8f98]">Total Blocks Required (b):</span>
                <span className="text-[#ffffff] font-bold">
                  {totalBlocksRequired} Blocks
                </span>
              </div>

              <div className="flex justify-between pt-1">
                <span className="text-[#8a8f98]">Storage Space Utilization:</span>
                <span className="text-[#27a644] font-bold">
                  {utilizationPercentage}%
                </span>
              </div>
            </div>

            {/* Utilization Bar */}
            <div className="w-full h-2 bg-[#161718] rounded-full overflow-hidden border border-[#23252a]">
              <div 
                className="h-full bg-gradient-to-r from-[#27a644] to-[#e4f222] transition-all duration-300"
                style={{ width: `${utilizationPercentage}%` }}
              />
            </div>
          </div>

          {/* Mathematical Derivations Footnote */}
          <div className="p-3 rounded-lg bg-[#161718] border border-[#23252a] text-[11px] font-mono text-[#8a8f98] space-y-1">
            <div className="text-[#d0d6e0]">Bfr = &lfloor; Block Size / Record Size &rfloor;</div>
            <div className="text-[#d0d6e0]">Total Blocks = &lceil; Total Records / Bfr &rceil;</div>
          </div>
        </div>

      </div>

    </div>
  );
}
