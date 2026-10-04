import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Download, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/useTheme';

export default function Navbar({ onDownloadPDF, darkMode, toggleTheme: propToggleTheme }) {
  const { isDark, toggleTheme } = useTheme();
  
  const activeIsDark = isDark ?? darkMode ?? true;
  const activeToggle = toggleTheme || propToggleTheme;

  const navItems = [
    { name: 'Allocator', path: '/allocator' },
    { name: 'Hardware & Tables', path: '/storage-hardware' },
    { name: 'Learn', path: '/learn' },
    { name: 'AI Practice', path: '/practice' },
    { name: 'GATE / Exams', path: '/exams' },
    { name: 'Contributors', path: '/credits' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#08090a]/95 backdrop-blur-md border-b border-[#23252a]">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 flex items-center justify-between h-14">
        
        {/* Brand Identity (Left) */}
        <Link to="/allocator" className="flex items-center gap-3 shrink-0 group">
          {/* Geometric Disk Glyph */}
          <div className="w-7 h-7 rounded-[6px] bg-[#161718] border border-[#23252a] flex items-center justify-center text-[#ffffff] group-hover:border-[#e4f222]/50 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <ellipse cx="12" cy="5" rx="9" ry="3" />
              <path d="M3 5V19A9 3 0 0 0 21 19V5" />
              <path d="M3 12A9 3 0 0 0 21 12" />
            </svg>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[15px] font-[510] tracking-[-0.022em] text-[#ffffff] font-sans">
              StorageOS
            </span>
            <span className="hidden sm:inline-flex items-center bg-white/[0.05] text-[#8a8f98] text-[11px] font-mono rounded-full px-2 py-0.5 border border-[#23252a]">
              DBMS / OS Edition
            </span>
          </div>
        </Link>

        {/* Navigation Links (Center) */}
        <nav className="hidden lg:flex items-center gap-1 h-full">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative h-14 px-3 flex items-center text-xs font-medium transition-colors ${
                  isActive 
                    ? 'text-[#ffffff]' 
                    : 'text-[#8a8f98] hover:text-[#d0d6e0]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>{item.name}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#e4f222] shadow-[0_0_8px_rgba(228,242,34,0.5)]" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Utility Actions (Right) */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Download Report Button */}
          <button
            type="button"
            onClick={onDownloadPDF}
            className="flex items-center gap-2 px-3 py-1.5 rounded-[6px] border border-[#23252a] hover:border-[#383b3f] hover:bg-[#161718] text-[#d0d6e0] hover:text-[#ffffff] text-xs font-medium transition-all"
            title="Download Audit PDF Report"
          >
            <Download size={13} className="text-[#8a8f98]" />
            <span className="hidden sm:inline">Download Report</span>
            <span className="sm:hidden">Report</span>
          </button>

          {/* High-Contrast Theme / Mode Switch */}
          {activeToggle && (
            <button
              type="button"
              onClick={activeToggle}
              className="p-1.5 rounded-[6px] border border-[#23252a] hover:border-[#383b3f] hover:bg-[#161718] text-[#8a8f98] hover:text-[#ffffff] transition-colors"
              aria-label={activeIsDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={activeIsDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {activeIsDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          )}

        </div>

      </div>

      {/* Mobile Horizontal Sub-Navigation */}
      <div className="lg:hidden flex items-center gap-2 px-4 py-1.5 overflow-x-auto border-t border-[#23252a]/60 bg-[#08090a] scrollbar-none">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `relative px-2.5 py-1 text-xs whitespace-nowrap rounded-[4px] font-medium transition-colors ${
                isActive 
                  ? 'text-[#ffffff] bg-[#161718] border border-[#23252a]' 
                  : 'text-[#8a8f98] hover:text-[#d0d6e0]'
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </div>
    </header>
  );
}
