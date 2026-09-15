import React, { useState } from 'react';
import { Moon, Sun, Download, BookOpen, HelpCircle, Users } from 'lucide-react';
import LearnModal from './Modals/LearnModal';
import HelpModal from './Modals/HelpModal';
import DevelopedByModal from './Modals/DevelopedByModal';

export default function Navbar({ darkMode, toggleTheme, onDownloadPDF }) {
  const [isLearnOpen, setIsLearnOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isDevelopedByOpen, setIsDevelopedByOpen] = useState(false);

  return (
    <>
      <nav className="bg-light-surface dark:bg-dark-surface rounded-2xl p-4 shadow-elevated border border-light-border dark:border-dark-border flex justify-between items-center transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-violet rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-brand-violet/50">
            DB
          </div>
          <h1 className="text-xl font-bold font-sans tracking-tight">
            Disk Storage Visualizer <span className="text-sm font-normal text-slate-500 hidden md:inline ml-2">DBMS Edition</span>
          </h1>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={() => setIsLearnOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <BookOpen size={18} className="text-brand-cyan" />
            <span className="hidden md:inline font-medium text-sm">Learn</span>
          </button>

          <button 
            onClick={() => setIsHelpOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <HelpCircle size={18} className="text-brand-emerald" />
            <span className="hidden md:inline font-medium text-sm">Help</span>
          </button>

          <button 
            onClick={() => setIsDevelopedByOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Users size={18} className="text-brand-rose" />
            <span className="hidden md:inline font-medium text-sm">Credits</span>
          </button>

          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>

          <button 
            onClick={onDownloadPDF}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg hover:opacity-90 transition-opacity font-medium text-sm shadow-md"
          >
            <Download size={16} />
            <span className="hidden md:inline">Report</span>
          </button>

          <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-slate-700" />}
          </button>
        </div>
      </nav>

      {/* Modals */}
      <LearnModal isOpen={isLearnOpen} onClose={() => setIsLearnOpen(false)} />
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <DevelopedByModal isOpen={isDevelopedByOpen} onClose={() => setIsDevelopedByOpen(false)} />
    </>
  );
}
