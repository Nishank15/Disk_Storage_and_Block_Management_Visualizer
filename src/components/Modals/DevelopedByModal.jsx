import React from 'react';
import { X, Users, GraduationCap, Code, PenTool } from 'lucide-react';

export default function DevelopedByModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-light-surface dark:bg-dark-surface w-full max-w-3xl rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-light-border dark:border-dark-border">
        
        <div className="flex justify-between items-center p-6 border-b border-light-border dark:border-dark-border bg-slate-50 dark:bg-slate-900/50">
          <h2 className="text-2xl font-bold flex items-center gap-3 text-brand-rose">
            <Users size={28} className="text-brand-rose" />
            Project Contributors & Mentorship
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 flex flex-col gap-8">
          
          {/* Team Members - 2 Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Team Member 1 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 w-full h-1 bg-brand-violet"></div>
              <div className="w-20 h-20 bg-brand-violet/10 rounded-full flex items-center justify-center mb-4 border border-brand-violet/30 text-brand-violet shadow-inner">
                <span className="text-3xl font-bold">NC</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white uppercase tracking-wide">Nishank Chhipa</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-mono mt-1 mb-4 bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-full">25BCE1642</p>
              
              <div className="mt-auto w-full bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl flex items-center justify-center gap-2 text-sm font-medium">
                <Code size={16} className="text-brand-violet" />
                <span>Core Engine & Architecture</span>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 w-full h-1 bg-brand-cyan"></div>
              <div className="w-20 h-20 bg-brand-cyan/10 rounded-full flex items-center justify-center mb-4 border border-brand-cyan/30 text-brand-cyan shadow-inner">
                <span className="text-3xl font-bold">SS</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white uppercase tracking-wide">Shourya Sharma</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-mono mt-1 mb-4 bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-full">25BCE1780</p>
              
              <div className="mt-auto w-full bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl flex items-center justify-center gap-2 text-sm font-medium">
                <PenTool size={16} className="text-brand-cyan" />
                <span>UI/UX & Visualization</span>
              </div>
            </div>

          </div>

          <div className="flex items-center gap-4">
            <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
            <span className="text-xs font-bold uppercase text-slate-400 tracking-widest">Mentorship</span>
            <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
          </div>

          {/* Faculty Supervisor */}
          <div className="bg-brand-emerald/5 dark:bg-brand-emerald/10 border border-brand-emerald/30 p-6 rounded-2xl text-center flex flex-col items-center max-w-lg mx-auto w-full">
            <div className="bg-brand-emerald/20 p-3 rounded-full text-brand-emerald mb-3">
              <GraduationCap size={28} />
            </div>
            <p className="text-sm font-bold uppercase tracking-wider text-brand-emerald mb-1">Guided By</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Dr. Swaminathan A</h3>
            <div className="flex flex-col gap-1 text-slate-600 dark:text-slate-300">
              <p className="font-medium text-lg">Assistant Professor</p>
              <p className="text-sm opacity-80">School of Computer Science and Engineering</p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
