import { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { Sun, Moon, Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import { useThemeStore } from '../../context/themeStore';

export default function DashboardLayout() {
  const { theme, toggleTheme } = useThemeStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <main className="flex-1 overflow-y-auto min-w-0">
        <header className="sticky top-0 z-10 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-transparent dark:border-slate-800/50 px-4 sm:px-8 py-3 sm:py-4 flex justify-between items-center transition-colors duration-200">
          {/* Mobile hamburger — hidden on md+ where sidebar is always visible */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm border border-slate-200 dark:border-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Spacer for desktop (pushes toggle to right) */}
          <div className="hidden md:block" />

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm border border-slate-200 dark:border-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            title="Toggle theme"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
        </header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
