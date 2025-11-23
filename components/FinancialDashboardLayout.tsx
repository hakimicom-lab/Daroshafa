

import React, { useState, useRef, useEffect } from 'react';
import { 
  Calculator, PieChart, ShieldCheck, HeartHandshake, Filter, 
  X, Check, ChevronDown, Search, ArrowLeft, LayoutDashboard
} from 'lucide-react';

export type FinancialTab = 'overview' | 'budget' | 'performance' | 'audit' | 'csr';

interface FinancialDashboardLayoutProps {
  activeTab: FinancialTab;
  onTabChange: (tab: FinancialTab) => void;
  children: React.ReactNode;
  onApplyFilters?: (filters: any) => void;
}

// --- Reusable Filter Components ---

const FilterSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-6">
    <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">{title}</h4>
    <div className="space-y-3">
      {children}
    </div>
  </div>
);

const CheckboxGroup: React.FC<{ options: string[]; name: string }> = ({ options, name }) => (
  <div className="space-y-2">
    {options.map((opt, idx) => (
      <label key={idx} className="flex items-center gap-2 cursor-pointer group">
        <div className="w-4 h-4 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 flex items-center justify-center transition-colors group-hover:border-primary-500">
          <input type="checkbox" className="hidden peer" />
          <Check size={10} className="text-white opacity-0 peer-checked:opacity-100 bg-primary-600 rounded-sm w-full h-full p-0.5" />
        </div>
        <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{opt}</span>
      </label>
    ))}
  </div>
);

const SelectBox: React.FC<{ label?: string; options: string[] }> = ({ label, options }) => (
  <div>
    {label && <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">{label}</label>}
    <div className="relative">
      <select className="w-full appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all">
        {options.map((opt, i) => (
          <option key={i} value={opt}>{opt}</option>
        ))}
      </select>
      <ChevronDown size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
  </div>
);

const RangeSlider: React.FC<{ label: string; min: string; max: string }> = ({ label, min, max }) => (
  <div>
    <div className="flex justify-between text-xs mb-2">
      <span className="text-slate-600 dark:text-slate-400">{label}</span>
    </div>
    <div className="flex gap-2 items-center">
      <input type="text" placeholder={min} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 text-xs text-center" />
      <span className="text-slate-400">-</span>
      <input type="text" placeholder={max} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 text-xs text-center" />
    </div>
  </div>
);

// --- Sidebar Content Logic ---

const SidebarContent: React.FC<{ tab: FinancialTab }> = ({ tab }) => {
  switch (tab) {
    case 'budget':
      return (
        <>
          <FilterSection title="دوره مالی">
            <SelectBox options={['۱۴۰۳ (جاری)', '۱۴۰۲ (قطعی)', '۱۴۰۱', '۱۴۰۰']} />
          </FilterSection>
          <FilterSection title="نوع بودجه">
            <CheckboxGroup name="budgetType" options={['جاری (هزینه‌ای)', 'عمرانی (سرمایه‌ای)', 'اختصاصی']} />
          </FilterSection>
          <FilterSection title="مرکز هزینه">
            <div className="relative mb-2">
              <input type="text" placeholder="جستجوی واحد..." className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-8 pr-3 py-2 text-xs focus:ring-1 focus:ring-primary-500 outline-none" />
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
            <div className="max-h-32 overflow-y-auto space-y-1 custom-scrollbar pr-1">
              <CheckboxGroup name="costCenter" options={['درمانگاه چشم', 'اتاق عمل', 'تاسیسات', 'اداری و مالی', 'داروخانه']} />
            </div>
          </FilterSection>
          <FilterSection title="وضعیت انحراف">
            <SelectBox options={['همه موارد', 'انحراف منفی (خطر)', 'مطابق بودجه', 'صرفه‌جویی']} />
          </FilterSection>
        </>
      );
    
    case 'performance':
      return (
        <>
          <FilterSection title="بازه زمانی">
             <div className="grid grid-cols-2 gap-2 mb-2">
                <button className="px-2 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-md text-xs font-bold border border-primary-200 dark:border-primary-800">سالانه</button>
                <button className="px-2 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md text-xs border border-slate-200 dark:border-slate-700 hover:bg-slate-100">فصلی</button>
             </div>
             <SelectBox options={['۱۴۰۳', '۱۴۰۲', '۱۴۰۱']} />
          </FilterSection>
          <FilterSection title="جریان درآمدی">
            <CheckboxGroup name="revenue" options={['بیمه پایه', 'بیمه تکمیلی', 'آزاد', 'قراردادهای خاص']} />
          </FilterSection>
          <FilterSection title="سرفصل هزینه">
            <CheckboxGroup name="cost" options={['حقوق و دستمزد', 'خرید دارو و لوازم', 'هتلینگ', 'انرژی و تاسیسات']} />
          </FilterSection>
        </>
      );

    case 'audit':
      return (
        <>
          <FilterSection title="سال مالی">
             <SelectBox options={['۱۴۰۲', '۱۴۰۱', '۱۴۰۰', '۱۳۹۹']} />
          </FilterSection>
          <FilterSection title="موسسه حسابرسی">
             <CheckboxGroup name="firm" options={['مفید راهبر', 'آگاهان تراز', 'سایر موسسات']} />
          </FilterSection>
          <FilterSection title="نوع اظهارنظر">
             <CheckboxGroup name="opinion" options={['مقبول (Clean)', 'مشروط (Qualified)', 'مردود (Adverse)', 'عدم اظهارنظر']} />
          </FilterSection>
          <FilterSection title="وضعیت بندها">
             <SelectBox options={['همه موارد', 'رفع شده', 'در دست اقدام', 'تکرار سنواتی']} />
          </FilterSection>
        </>
      );

    case 'csr':
      return (
        <>
          <FilterSection title="سال فعالیت">
             <SelectBox options={['۱۴۰۳', '۱۴۰۲', '۱۴۰۱']} />
          </FilterSection>
          <FilterSection title="نوع حمایت">
             <CheckboxGroup name="support" options={['درمان رایگان', 'تخفیف ویژه', 'کمک دارویی', 'اعزام تیم پزشکی']} />
          </FilterSection>
          <FilterSection title="گروه هدف">
             <CheckboxGroup name="target" options={['مددجویان کمیته امداد', 'بهزیستی', 'خانواده شهدا', 'مناطق محروم']} />
          </FilterSection>
          <FilterSection title="منبع تامین">
             <SelectBox options={['همه منابع', 'منابع داخلی بیمارستان', 'خیرین سلامت', 'وجوهات شرعی']} />
          </FilterSection>
        </>
      );

    default: // Overview
       return (
         <div className="text-center text-slate-400 py-10 text-sm px-4">
           در نمای کلی، تمامی شاخص‌های کلیدی به صورت خلاصه نمایش داده می‌شوند. برای فیلتر دقیق، یکی از تب‌های تخصصی را انتخاب کنید.
         </div>
       );
  }
};


const FinancialDashboardLayout: React.FC<FinancialDashboardLayoutProps> = ({ activeTab, onTabChange, children, onApplyFilters }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Tab Definitions
  const tabs = [
    { id: 'budget', label: 'نظام بودجه‌ریزی', icon: <Calculator size={18} /> },
    { id: 'performance', label: 'عملکرد', icon: <PieChart size={18} /> },
    { id: 'audit', label: 'حسابرسی و کنترل', icon: <ShieldCheck size={18} /> },
    { id: 'csr', label: 'مسئولیت اجتماعی', icon: <HeartHandshake size={18} /> },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 min-h-[85vh] rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col relative overflow-hidden transition-colors">
      
      {/* Top Bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20">
        <div className="flex items-center h-16 px-4 gap-4">
            
            {/* Left Toggle (Filter) */}
            <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary-600 dark:hover:text-primary-400 rounded-xl transition-colors relative group"
                title="فیلترها"
            >
                <Filter size={20} />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full border-2 border-white dark:border-slate-900 hidden group-hover:block"></span>
            </button>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2 hidden md:block"></div>

            {/* Dashboard / Overview Icon Tab */}
            <button 
                onClick={() => onTabChange('overview')}
                className={`p-2.5 rounded-xl transition-all mr-2 shrink-0
                  ${activeTab === 'overview' 
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 ring-1 ring-primary-200 dark:ring-primary-800' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}
                `}
                title="نمای کلی داشبورد"
            >
                <LayoutDashboard size={20} />
            </button>

            {/* Main Tabs */}
            <div className="flex-1 flex items-center gap-1 overflow-x-auto no-scrollbar mask-gradient-x">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id as FinancialTab)}
                        className={`
                            flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap
                            ${activeTab === tab.id 
                                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md transform scale-105' 
                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'}
                        `}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* Main Content & Sidebar Wrapper */}
      <div className="flex flex-1 relative overflow-hidden">
          
          {/* Context-Aware Sidebar (Drawer) */}
          {/* Backdrop */}
          <div 
            className={`absolute inset-0 bg-slate-900/20 dark:bg-black/50 backdrop-blur-sm z-30 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setIsSidebarOpen(false)}
          ></div>

          {/* Drawer Panel */}
          <aside className={`
              absolute left-0 top-0 bottom-0 w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-40 shadow-2xl transition-transform duration-300 flex flex-col
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}>
              {/* Sidebar Header */}
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="flex items-center gap-2">
                      <Filter size={18} className="text-primary-600 dark:text-primary-400" />
                      <span className="font-black text-slate-800 dark:text-slate-100">فیلترهای پیشرفته</span>
                  </div>
                  <button onClick={() => setIsSidebarOpen(false)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                      <X size={18} />
                  </button>
              </div>

              {/* Sidebar Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-5 custom-scrollbar" dir="rtl">
                  <SidebarContent tab={activeTab} />
              </div>

              {/* Sidebar Footer */}
              <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                  <button 
                    onClick={() => {
                        if (onApplyFilters) onApplyFilters({});
                        setIsSidebarOpen(false);
                    }}
                    className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-primary-600/20 transition-all flex items-center justify-center gap-2"
                  >
                      <Check size={18} />
                      <span>اعمال فیلترها</span>
                  </button>
              </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar scroll-smooth">
             <div className="max-w-7xl mx-auto">
                 {children}
             </div>
          </main>
      </div>

    </div>
  );
};

export default FinancialDashboardLayout;