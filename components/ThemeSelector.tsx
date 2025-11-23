
import React, { useState, useEffect, useRef } from 'react';
import { Palette, Check } from 'lucide-react';

export type Theme = 'forest' | 'ocean' | 'future' | 'luxury';

const themes: { id: Theme; label: string; color: string }[] = [
  { id: 'forest', label: 'جنگل (پیش‌فرض)', color: '#10b981' }, // Emerald-500
  { id: 'ocean', label: 'اقیانوس', color: '#0ea5e9' }, // Sky-500
  { id: 'future', label: 'آینده', color: '#8b5cf6' }, // Violet-500
  { id: 'luxury', label: 'لوکس', color: '#f59e0b' }, // Amber-500
];

const ThemeSelector: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme>('forest');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load theme from local storage or default to forest
    const savedTheme = localStorage.getItem('app_theme') as Theme;
    if (savedTheme && themes.some(t => t.id === savedTheme)) {
      setCurrentTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleThemeChange = (themeId: Theme) => {
    setCurrentTheme(themeId);
    localStorage.setItem('app_theme', themeId);
    document.documentElement.setAttribute('data-theme', themeId);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors flex items-center justify-center"
        title="تغییر تم رنگی"
      >
        <Palette size={20} className="text-primary-600 dark:text-primary-400" />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-2 space-y-1">
            <div className="px-3 py-2 text-xs font-bold text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 mb-1">
              انتخاب پوسته
            </div>
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleThemeChange(theme.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${currentTheme === theme.id 
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' 
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}
                `}
              >
                <div className="flex items-center gap-3">
                  <span 
                    className="w-4 h-4 rounded-full border border-slate-200 dark:border-slate-600 shadow-sm" 
                    style={{ backgroundColor: theme.color }}
                  ></span>
                  <span>{theme.label}</span>
                </div>
                {currentTheme === theme.id && <Check size={14} className="text-primary-600" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;
