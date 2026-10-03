import React, { useState } from 'react';
import HardwareViewer from '../components/Hardware/HardwareViewer';
import SchemaBuilder from '../components/Hardware/SchemaBuilder';
import DataIngestion from '../components/Hardware/DataIngestion';
import SlottedPageViewer from '../components/Hardware/SlottedPageViewer';
import { PRESET_DATASETS } from '../utils/hardwareDatasets';
import { HardDrive } from 'lucide-react';

export default function StorageHardwarePage() {
  const [hardwareMode, setHardwareMode] = useState('HDD');
  const [blockSize, setBlockSize] = useState(4096);
  const [currentDatasetName, setCurrentDatasetName] = useState('Students_VIT');

  // Starter dataset initialization
  const defaultPreset = PRESET_DATASETS.Students_VIT;
  const [schema, setSchema] = useState(defaultPreset.schema);
  const [records, setRecords] = useState(() => defaultPreset.generateRows());
  const [selectedBlockIndex, setSelectedBlockIndex] = useState(0);

  // Switch preloaded dataset
  const handleSelectPreset = (presetKey) => {
    const preset = PRESET_DATASETS[presetKey];
    if (preset) {
      setCurrentDatasetName(preset.name);
      setSchema(preset.schema);
      setRecords(preset.generateRows());
      setSelectedBlockIndex(0);
    }
  };

  // Custom File Upload Ingestion
  const handleIngestCustomData = (filename, newRows, headers) => {
    setCurrentDatasetName(filename.replace(/\.[^/.]+$/, ''));
    setRecords(newRows);
    setSelectedBlockIndex(0);

    // Derive schema from headers and first row samples
    const derivedSchema = headers.map(header => {
      const sampleVal = newRows[0] ? newRows[0][header] : '';
      let type = 'VARCHAR';
      let bytes = 32;

      if (!isNaN(Number(sampleVal)) && sampleVal !== '') {
        if (Number.isInteger(Number(sampleVal))) {
          type = 'INTEGER';
          bytes = 4;
        } else {
          type = 'FLOAT';
          bytes = 8;
        }
      } else if (typeof sampleVal === 'string' && sampleVal.length <= 16) {
        type = 'CHAR';
        bytes = 16;
      }

      return {
        name: header,
        type,
        bytes
      };
    });

    setSchema(derivedSchema);
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 py-8 space-y-8">
      
      {/* Header section */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono bg-[#161718] border border-[#23252a] text-[#e4f222] mb-3">
          <HardDrive size={14} />
          <span>Physical Storage &bull; Teacher Requirement 2 Architecture</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-[510] tracking-[-0.022em] text-[#ffffff] font-sans">
          Hardware & Slotted-Page Mapper
        </h1>
        <p className="text-sm md:text-base text-[#8a8f98] mt-1.5 max-w-3xl leading-relaxed">
          Interactive mechanical HDD vs. semiconductor SSD simulator, customizable relational schema builder, mathematical blocking factor calculator, and slotted-page memory visualizer.
        </p>
      </div>

      {/* 1. Hardware Media Simulation Component */}
      <section>
        <HardwareViewer
          hardwareMode={hardwareMode}
          onToggleMode={setHardwareMode}
        />
      </section>

      {/* 2. Custom Table Schema Builder & Sizing HUD */}
      <section>
        <SchemaBuilder
          schema={schema}
          onUpdateSchema={setSchema}
          blockSize={blockSize}
          onChangeBlockSize={setBlockSize}
          totalRecords={records.length}
        />
      </section>

      {/* 3. Table Data Ingestion & Preloaded Benchmarks */}
      <section>
        <DataIngestion
          onIngestData={handleIngestCustomData}
          onSelectPreset={handleSelectPreset}
          currentDatasetName={currentDatasetName}
          totalRows={records.length}
        />
      </section>

      {/* 4. Interactive Slotted-Page Block Architecture Visualizer */}
      <section>
        <SlottedPageViewer
          blockSize={blockSize}
          schema={schema}
          records={records}
          selectedBlockIndex={selectedBlockIndex}
          onSelectBlock={setSelectedBlockIndex}
        />
      </section>

    </div>
  );
}
