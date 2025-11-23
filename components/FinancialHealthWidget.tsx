
import React from 'react';
import { ArrowRight, TrendingUp, ShieldCheck, HeartHandshake, MoreHorizontal, Wallet } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

interface FinancialHealthWidgetProps {
  onNavigate: (topic: string) => void;
}

// Mock Data for Sparkline (Last 6 Months Operational Revenue)
const SPARKLINE_DATA = [
  { month: '1', value: 4200 },
  { month: '2', value: 3800 },
  { month: '3', value: 5100 },
  { month: '4', value: 4800 },
  { month: '5', value: 5600 },
  { month: '6', value: 6200 },
];

const FinancialHealthWidget: React.FC<FinancialHealthWidgetProps> = ({ onNavigate }) => {
  // KPI 1: Budget Realization (85%)
  const budgetPercentage = 85;
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (budgetPercentage / 100) * circumference;

  // KPI 2: Total Charity (Calculated from Phase 1 Data concept: ~28B Rials)
  const totalCharity = "۲۸,۰۰۰"; // In Millions
  
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-0 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 group relative overflow-hidden h-full flex flex-col">
      {/* Decorative Top Border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-emerald-600"></div>

      {/* Header */}
      <div className="p-5 pb-2 flex items-start justify-between">
        <div>
            <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Wallet size={20} className="text-emerald-600" />
                <span>نمای کلی مالی</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">وضعیت عملکرد و شفافیت</p>
        </div>
        <button onClick={() => onNavigate('گزارشات جامع مالی')} className="text-slate-400 hover:text-emerald-600 transition-colors">
            <MoreHorizontal size={20} />
        </button>
      </div>

      {/* KPIs Grid */}
      <div className="p-5 pt-2 grid grid-cols-3 gap-4 flex-1 items-end">
        
        {/* KPI 1: Budget Gauge */}
        <div className="flex flex-col items-center justify-end">
             <div className="relative w-16 h-16">
                <svg className="w-full h-full transform -rotate-90">
                    {/* Background Circle */}
                    <circle
                        cx="32"
                        cy="32"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="transparent"
                        className="text-slate-100 dark:text-slate-800"
                    />
                    {/* Progress Circle */}
                    <circle
                        cx="32"
                        cy="32"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="text-emerald-500 transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-xs font-black text-slate-700 dark:text-white">{budgetPercentage}٪</span>
                </div>
             </div>
             <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-2 text-center leading-tight">تحقق بودجه<br/>سرمایه‌ای</span>
        </div>

        {/* KPI 2: Charity Big Number */}
        <div className="flex flex-col items-center justify-end border-r border-l border-slate-100 dark:border-slate-800 px-2">
             <div className="p-2 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl mb-2">
                <HeartHandshake size={20} />
             </div>
             <div className="text-xl font-black text-slate-800 dark:text-white">{totalCharity}</div>
             <span className="text-[10px] text-slate-400 font-mono">میلیون ریال</span>
             <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-1 text-center">خدمات خیریه</span>
        </div>

        {/* KPI 3: Sparkline */}
        <div className="flex flex-col items-center justify-end h-full w-full">
             <div className="h-12 w-full mb-2">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={SPARKLINE_DATA}>
                        <defs>
                            <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#10b981" 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill="url(#colorVal)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
             </div>
             <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-bold bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded-md mb-1">
                 <TrendingUp size={10} />
                 <span>۱۲٪+</span>
             </div>
             <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 text-center">روند درآمد</span>
        </div>
      </div>

      {/* Footer Action & Status */}
      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
         <div className="flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
             <ShieldCheck size={14} className="text-emerald-600" />
             <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">حسابرسی ۱۴۰۲: مقبول</span>
         </div>

         <button 
            onClick={() => onNavigate('گزارشات جامع مالی')}
            className="flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
         >
             <span>مشاهده گزارشات</span>
             <ArrowRight size={14} />
         </button>
      </div>
    </div>
  );
};

export default FinancialHealthWidget;
