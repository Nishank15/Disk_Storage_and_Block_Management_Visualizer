import React, { useRef, useState } from 'react';
import { Upload, FileText, Database, AlertCircle } from 'lucide-react';

export default function DataIngestion({ onIngestData, onSelectPreset, currentDatasetName, totalRows }) {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Parse CSV helper
  const parseCSV = (text) => {
    const lines = text.trim().split(/\r\n|\n/).filter(line => line.trim().length > 0);
    if (lines.length < 2) throw new Error('CSV must contain a header row and at least one data row.');

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, ''));
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/['"]/g, ''));
      if (values.length === headers.length) {
        const rowObj = {};
        headers.forEach((h, idx) => {
          rowObj[h] = values[idx];
        });
        rows.push(rowObj);
      }
    }

    return { headers, rows };
  };

  const handleFileUpload = (file) => {
    setErrorMsg(null);
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const headers = Object.keys(parsed[0]);
            onIngestData(file.name, parsed, headers);
          } else {
            throw new Error('JSON file must contain an array of objects.');
          }
        } else {
          // Assume CSV
          const { headers, rows } = parseCSV(content);
          if (rows.length === 0) throw new Error('No valid records parsed from CSV.');
          onIngestData(file.name, rows, headers);
        }
      } catch (err) {
        setErrorMsg(err.message || 'Failed to parse file.');
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-[#0f1011] border border-[#23252a] rounded-xl p-5 md:p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#23252a]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#e4f222]"></span>
            <h2 className="text-sm font-semibold tracking-wide text-[#ffffff] uppercase font-mono">
              Table Data Ingestion & Sample Datasets
            </h2>
          </div>
          <p className="text-xs text-[#8a8f98] mt-0.5">
            Ingest relational records via CSV/JSON or load preloaded academic database benchmarks.
          </p>
        </div>

        {/* Current Dataset Status Pill */}
        <div className="flex items-center gap-2 font-mono text-xs px-3 py-1.5 rounded-md bg-[#161718] border border-[#23252a] text-[#ffffff] self-start sm:self-auto">
          <Database size={13} className="text-[#e4f222]" />
          <span>Active: <strong className="text-[#e4f222]">{currentDatasetName}</strong> ({totalRows} rows)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: Drag and Drop Upload Zone (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileUpload(e.target.files[0])}
            accept=".csv, .json"
            className="hidden"
          />

          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex-1 border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
              dragOver 
                ? 'border-[#e4f222] bg-[#e4f222]/5' 
                : 'border-[#23252a] hover:border-[#383b3f] bg-[#08090a]'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-[#161718] border border-[#23252a] flex items-center justify-center text-[#e4f222] mb-3">
              <Upload size={18} />
            </div>
            <h4 className="text-xs font-semibold text-[#ffffff] mb-1">
              Upload CSV or JSON Dataset
            </h4>
            <p className="text-[11px] text-[#8a8f98] max-w-xs mb-3">
              Drag and drop file here, or click to browse from local computer.
            </p>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161718] text-[#62666d] border border-[#23252a]">
              Supports: .csv, .json (Max 5,000 rows)
            </span>
          </div>

          {errorMsg && (
            <div className="mt-2.5 p-2 rounded bg-[#eb5757]/10 border border-[#eb5757]/30 text-xs text-[#eb5757] flex items-center gap-1.5">
              <AlertCircle size={14} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Right: Preloaded 1-Click Academic Presets (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#8a8f98]">
              Preloaded Academic Benchmark Presets
            </span>
            <span className="text-[10px] font-mono text-[#62666d]">1-Click Schema & Rows</span>
          </div>

          <div className="space-y-2.5">
            
            {/* Preset 1: Students_VIT */}
            <div 
              onClick={() => onSelectPreset('Students_VIT')}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                currentDatasetName === 'Students_VIT'
                  ? 'bg-[#161718] border-[#e4f222] shadow-[0_0_12px_rgba(228,242,34,0.1)]'
                  : 'bg-[#08090a] border-[#23252a] hover:border-[#383b3f]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-[#161718] border border-[#23252a] flex items-center justify-center text-[#e4f222]">
                  <FileText size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#ffffff]">Preset 1: Students_VIT</h4>
                  <p className="text-[11px] text-[#8a8f98]">
                    100 rows &bull; RegNo, Name, Department, CGPA, Hosteller
                  </p>
                </div>
              </div>
              <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#161718] text-[#ffffff] border border-[#23252a]">
                100 Rows
              </span>
            </div>

            {/* Preset 2: ECommerce_Orders */}
            <div 
              onClick={() => onSelectPreset('ECommerce_Orders')}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                currentDatasetName === 'ECommerce_Orders'
                  ? 'bg-[#161718] border-[#e4f222] shadow-[0_0_12px_rgba(228,242,34,0.1)]'
                  : 'bg-[#08090a] border-[#23252a] hover:border-[#383b3f]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-[#161718] border border-[#23252a] flex items-center justify-center text-[#27a644]">
                  <FileText size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#ffffff]">Preset 2: ECommerce_Orders</h4>
                  <p className="text-[11px] text-[#8a8f98]">
                    250 rows &bull; OrderID, CustomerID, Amount, Status, CreatedAt
                  </p>
                </div>
              </div>
              <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#161718] text-[#ffffff] border border-[#23252a]">
                250 Rows
              </span>
            </div>

            {/* Preset 3: IoT_Sensor_Logs */}
            <div 
              onClick={() => onSelectPreset('IoT_Sensor_Logs')}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                currentDatasetName === 'IoT_Sensor_Logs'
                  ? 'bg-[#161718] border-[#e4f222] shadow-[0_0_12px_rgba(228,242,34,0.1)]'
                  : 'bg-[#08090a] border-[#23252a] hover:border-[#383b3f]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-[#161718] border border-[#23252a] flex items-center justify-center text-[#f59e0b]">
                  <FileText size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#ffffff]">Preset 3: IoT_Sensor_Logs</h4>
                  <p className="text-[11px] text-[#8a8f98]">
                    500 rows &bull; SensorID, Temperature, Humidity, Battery, Timestamp
                  </p>
                </div>
              </div>
              <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#161718] text-[#ffffff] border border-[#23252a]">
                500 Rows
              </span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
