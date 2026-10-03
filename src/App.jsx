import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import AllocatorPage from './pages/AllocatorPage';
import StorageHardwarePage from './pages/StorageHardwarePage';
import LearnPage from './pages/LearnPage';
import PracticePage from './pages/PracticePage';
import ExamsPage from './pages/ExamsPage';
import CreditsPage from './pages/CreditsPage';
import { useDiskEngine } from './hooks/useDiskEngine';
import { generatePDFReport } from './utils/pdfReport';

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const diskEngine = useDiskEngine();

  useEffect(() => {
    // Keep dark mode class synced
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const handleDownloadPDF = () => {
    generatePDFReport(diskEngine);
  };

  return (
    <div className="min-h-screen bg-[#08090a] text-[#d0d6e0] flex flex-col font-sans selection:bg-[#e4f222]/20 selection:text-[#ffffff]">
      <Navbar 
        onDownloadPDF={handleDownloadPDF} 
        darkMode={darkMode} 
        toggleTheme={toggleTheme} 
      />
      
      <main className="flex-1 w-full pb-12">
        <Routes>
          <Route path="/" element={<Navigate to="/allocator" replace />} />
          <Route path="/allocator" element={<AllocatorPage diskEngine={diskEngine} />} />
          <Route path="/storage-hardware" element={<StorageHardwarePage />} />
          <Route path="/learn" element={<LearnPage diskEngine={diskEngine} onDownloadPDF={handleDownloadPDF} />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="/exams" element={<ExamsPage />} />
          <Route path="/credits" element={<CreditsPage />} />
          <Route path="*" element={<Navigate to="/allocator" replace />} />
        </Routes>
      </main>
    </div>
  );
}
