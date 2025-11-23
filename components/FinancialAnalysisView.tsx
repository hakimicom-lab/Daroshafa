
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { BarChart3, Banknote, TrendingUp, ChevronDown, ChevronUp, Check, Filter, Activity, X, CalendarRange, History } from 'lucide-react';

// --- Types ---
interface MonthData {
  id: string;
  name: string;
  value: number;
}

interface YearData {
  id: string;
  year: number;
  value: number;
  months: MonthData[];
}

interface ServiceNode {
  id: string;
  title: string;
  unit: string;
  years: YearData[];
  totalValue: number; // Full historical total
}

interface CategoryNode {
  id: string;
  title: string;
  services: ServiceNode[];
}

// --- Revenue Types ---
interface RevenueBreakdown {
    total: number;
    basic: number;
    supplementary: number;
    free: number;
}

interface RevenueMonthData extends RevenueBreakdown {
    id: string;
    name: string;
}

interface RevenueYearData extends RevenueBreakdown {
    id: string;
    year: number;
    months: RevenueMonthData[];
}

interface RevenueServiceNode {
    id: string;
    title: string;
    code: string;
    years: RevenueYearData[];
    total: RevenueBreakdown; // Full historical total
}

interface RevenueCategoryNode {
    id: string;
    title: string;
    code: string;
    services: RevenueServiceNode[];
}

// --- Data Generation Helpers ---
const MONTH_NAMES = [
  '1', '2', '3', '4', '5', '6',
  '7', '8', '9', '10', '11', '12'
];

const generateYearlyData = (startYear: number, endYear: number, baseValue: number, growthRate: number): YearData[] => {
  const years: YearData[] = [];
  let currentValue = baseValue;

  for (let y = startYear; y <= endYear; y++) {
    const noise = (Math.random() - 0.5) * 0.2; 
    currentValue = currentValue * (1 + growthRate + noise);
    const yearTotal = Math.round(currentValue);

    const months: MonthData[] = MONTH_NAMES.map((m, idx) => {
       return { id: `m-${y}-${idx}`, name: m, value: 0 };
    });
    
    const totalWeight = 12.5;
    
    months.forEach((m, idx) => {
        let weight = 1;
        if (idx === 0) weight = 0.5;
        if (idx === 5 || idx === 6) weight = 1.2;
        m.value = Math.round((yearTotal * weight) / totalWeight);
    });
    
    years.push({
      id: `y-${y}`,
      year: y,
      value: yearTotal, 
      months
    });
  }
  return years.reverse();
};

const generateRevenueData = (startYear: number, endYear: number, baseTotal: number, growthRate: number): RevenueYearData[] => {
    const years: RevenueYearData[] = [];
    let currentTotal = baseTotal;

    for (let y = startYear; y <= endYear; y++) {
        const noise = (Math.random() - 0.5) * 0.1;
        currentTotal = currentTotal * (1 + growthRate + noise);
        
        const total = Math.round(currentTotal);
        
        const months: RevenueMonthData[] = MONTH_NAMES.map((m, idx) => {
             let weight = 1;
             if (idx === 5 || idx === 6) weight = 1.1;
             
             const mTotal = Math.round((total * weight) / 12.2);
             const mBasic = Math.round(mTotal * 0.30);
             const mSupp = Math.round(mTotal * 0.45);
             const mFree = mTotal - mBasic - mSupp;

             return {
                 id: `rev-m-${y}-${idx}`,
                 name: m,
                 total: mTotal,
                 basic: mBasic,
                 supplementary: mSupp,
                 free: mFree
             };
        });

        const yTotal = months.reduce((sum, m) => sum + m.total, 0);
        const yBasic = months.reduce((sum, m) => sum + m.basic, 0);
        const ySupp = months.reduce((sum, m) => sum + m.supplementary, 0);
        const yFree = months.reduce((sum, m) => sum + m.free, 0);

        years.push({
            id: `rev-y-${y}`,
            year: y,
            total: yTotal,
            basic: yBasic,
            supplementary: ySupp,
            free: yFree,
            months
        });
    }
    return years.reverse();
};

// --- Static Data Definition ---
const QUANTITY_DATA: CategoryNode[] = [
  {
    id: 'cat-1', title: 'خدمات کلینیکی', services: [
      { id: 'srv-1-1', title: 'ویزیت متخصص چشم / فوق تخصص', unit: 'نفر-مراجعه', years: generateYearlyData(1383, 1403, 4500, 0.05), totalValue: 0 }
    ]
  },
  {
    id: 'cat-2', title: 'خدمات پاراکلینیکی', services: [
      { id: 'srv-2-1', title: 'بینایی‌سنجی (اپتومتری)*', unit: 'نفر-خدمت', years: generateYearlyData(1383, 1403, 4000, 0.04), totalValue: 0 },
      { id: 'srv-2-2', title: 'پریمتری، بیومتری، آنژیوگرافی و...', unit: 'نفر-خدمت', years: generateYearlyData(1391, 1403, 800, 0.08), totalValue: 0 }
    ]
  },
  {
    id: 'cat-3', title: 'خدمات جراحی', services: [
      { id: 'srv-3-1', title: 'مجموع اعمال جراحی چشم', unit: 'عمل جراحی', years: generateYearlyData(1393, 1403, 100, 0.15), totalValue: 0 }
    ]
  },
  {
    id: 'cat-4', title: 'خدمات مرتبط', services: [
      { id: 'srv-4-1', title: 'خدمات واحد عینک‌سازی', unit: 'نفر-خدمت', years: generateYearlyData(1388, 1403, 1200, 0.06), totalValue: 0 }
    ]
  }
];

QUANTITY_DATA.forEach(cat => {
    cat.services.forEach(srv => {
        srv.totalValue = srv.years.reduce((acc, y) => acc + y.value, 0);
    });
});

const REVENUE_DATA: RevenueCategoryNode[] = [
    {
        id: 'rev-cat-1', title: 'خدمات کلینیکی', code: '01', services: [
            { id: 'rev-srv-1-1', title: 'ویزیت متخصص چشم / فوق تخصص', code: '01-1', years: generateRevenueData(1383, 1403, 400000000, 0.15), total: {total:0, basic:0, supplementary:0, free:0} }
        ]
    },
    {
        id: 'rev-cat-2', title: 'خدمات پاراکلینیکی', code: '02', services: [
            { id: 'rev-srv-2-1', title: 'بینایی‌سنجی (اپتومتری)*', code: '02-1', years: generateRevenueData(1383, 1403, 500000000, 0.14), total: {total:0, basic:0, supplementary:0, free:0} },
            { id: 'rev-srv-2-2', title: 'پریمتری، بیومتری، آنژیوگرافی و...', code: '02-2', years: generateRevenueData(1391, 1403, 300000000, 0.18), total: {total:0, basic:0, supplementary:0, free:0} }
        ]
    },
    {
        id: 'rev-cat-3', title: 'خدمات جراحی', code: '03', services: [
            { id: 'rev-srv-3-1', title: 'مجموع اعمال جراحی چشم', code: '03-1', years: generateRevenueData(1393, 1403, 1200000000, 0.20), total: {total:0, basic:0, supplementary:0, free:0} }
        ]
    },
    {
        id: 'rev-cat-4', title: 'خدمات مرتبط', code: '04', services: [
            { id: 'rev-srv-4-1', title: 'خدمات واحد عینک‌سازی', code: '04-1', years: generateRevenueData(1388, 1403, 800000000, 0.10), total: {total:0, basic:0, supplementary:0, free:0} }
        ]
    }
];

REVENUE_DATA.forEach(cat => {
    cat.services.forEach(srv => {
        srv.total = srv.years.reduce((acc, y) => ({
            total: acc.total + y.total,
            basic: acc.basic + y.basic,
            supplementary: acc.supplementary + y.supplementary,
            free: acc.free + y.free
        }), { total: 0, basic: 0, supplementary: 0, free: 0 });
    });
});

const AVAILABLE_YEARS = QUANTITY_DATA[0].services[0].years.map(y => y.year).sort((a, b) => b - a);

const formatNumber = (num: number) => new Intl.NumberFormat('fa-IR').format(num);
const formatCurrency = (num: number) => new Intl.NumberFormat('fa-IR').format(num);

// --- Internal Components ---

const MultiSelectDropdown: React.FC<{
    title: string;
    options: { label: string; value: string }[];
    selectedValues: string[];
    onChange: (newValues: string[]) => void;
    inline?: boolean;
  }> = ({ title, options, selectedValues, onChange, inline = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
  
    const toggleOption = (value: string) => {
      if (selectedValues.includes(value)) {
        onChange(selectedValues.filter(v => v !== value));
      } else {
        onChange([...selectedValues, value]);
      }
    };
  
    const selectAll = () => {
        if (selectedValues.length === options.length) onChange([]);
        else onChange(options.map(o => o.value));
    };
  
    return (
      <div className={`relative ${inline ? 'w-full' : ''}`} ref={ref} onClick={e => e.stopPropagation()}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-between gap-2 px-3 py-3 rounded-xl border text-sm font-bold transition-all shadow-sm
            ${isOpen || selectedValues.length > 0 
              ? 'bg-white dark:bg-slate-800 border-primary-500 text-primary-700 dark:text-primary-300 ring-1 ring-primary-500' 
              : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}
            ${inline ? 'w-full' : 'min-w-[160px]'}
          `}
        >
          <span className="truncate font-bold">
            {selectedValues.length === 0 
              ? title 
              : selectedValues.length === options.length 
                ? `همه (${title})` 
                : `${title} (${selectedValues.length})`}
          </span>
          <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
  
        {isOpen && (
          <div className={`
             z-50 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200
             ${inline 
                ? 'relative w-full mt-2 border border-slate-200 dark:border-slate-700 rounded-xl shadow-none bg-slate-50 dark:bg-slate-900/50' 
                : 'absolute top-full mt-2 right-0 md:left-0 md:right-auto w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl max-h-80'}
          `}>
             <div className="p-2 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                <button onClick={selectAll} className="text-xs text-primary-600 dark:text-primary-400 hover:underline w-full text-right px-2 font-bold">
                    {selectedValues.length === options.length ? 'لغو انتخاب همه' : 'انتخاب همه'}
                </button>
             </div>
            <div className={`overflow-y-auto p-2 space-y-1 flex-1 ${inline ? 'max-h-60' : ''}`}>
              {options.map(option => {
                 const isSelected = selectedValues.includes(option.value);
                 return (
                    <div 
                      key={option.value} 
                      onClick={() => toggleOption(option.value)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm font-medium
                        ${isSelected ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-800 dark:text-primary-200' : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'}
                      `}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors
                         ${isSelected ? 'bg-primary-600 border-primary-600 text-white' : 'border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-800'}
                      `}>
                        {isSelected && <Check size={10} strokeWidth={3} />}
                      </div>
                      <span>{option.label}</span>
                    </div>
                 );
              })}
            </div>
            {!inline && (
              <div className="p-2 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
              <button 
                onClick={() => setIsOpen(false)}
                className="w-full py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <Check size={14} />
                <span>اعمال فیلتر</span>
              </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
};

// --- Expandable Card ---
const ExpandableServiceCard: React.FC<{ 
    service: any, 
    type: 'quantity' | 'revenue',
    selectedYearIds: string[],
    isExpanded: boolean,
    onToggle: () => void
}> = ({ service, type, selectedYearIds, isExpanded, onToggle }) => {
    const [chartMode, setChartMode] = useState<'monthly' | 'overall'>('monthly');

    const isRev = type === 'revenue';
    
    const activeYears = service.years.filter((y: any) => selectedYearIds.includes(y.id));
    const dynamicTotal = activeYears.reduce((sum: number, y: any) => sum + (isRev ? y.total : y.value), 0);
    const allMonthlyValues = activeYears.flatMap((y: any) => y.months.map((m: any) => isRev ? m.total : m.value));
    const maxMonthlyValue = Math.max(...allMonthlyValues, 1);

    const getIntensityColor = (val: number) => {
        const percent = val / maxMonthlyValue;
        if (isRev) {
             if (percent > 0.8) return 'bg-green-600 text-white';
             if (percent > 0.6) return 'bg-green-500 text-white';
             if (percent > 0.4) return 'bg-green-400 text-white';
             if (percent > 0.2) return 'bg-green-300 text-green-900';
             if (percent > 0) return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300';
             return 'bg-slate-50 text-slate-400 dark:bg-slate-800 dark:text-slate-600';
        } else {
             if (percent > 0.8) return 'bg-primary-600 text-white';
             if (percent > 0.6) return 'bg-primary-500 text-white';
             if (percent > 0.4) return 'bg-primary-400 text-white';
             if (percent > 0.2) return 'bg-primary-300 text-primary-900';
             if (percent > 0) return 'bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-300';
             return 'bg-slate-50 text-slate-400 dark:bg-slate-800 dark:text-slate-600';
        }
    };

    return (
        <div className={`
            border rounded-xl shadow-sm transition-all overflow-hidden
            ${isExpanded 
               ? 'bg-primary-50 dark:bg-slate-800 border-primary-500 dark:border-primary-400 shadow-md ring-1 ring-primary-500/20 dark:ring-primary-400/20' 
               : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-800 hover:shadow-md'}
        `}>
            <div className="p-5 flex justify-between items-start cursor-pointer" onClick={onToggle}>
                <div className="flex-1">
                     <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-bold text-base transition-colors ${isExpanded ? 'text-primary-900 dark:text-primary-100' : 'text-slate-800 dark:text-slate-100'}`}>{service.title}</h4>
                        <div className={`p-1 rounded-full ${isExpanded ? 'bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400' : 'bg-slate-100 dark:bg-slate-700'}`}>
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} className="text-slate-500" />}
                        </div>
                     </div>
                     <div className="text-xs text-slate-400 font-mono mb-3">
                        {isRev ? `کد: ${service.code}` : service.unit}
                     </div>

                     <div className="flex items-end gap-2">
                        <div className="text-2xl font-black text-slate-900 dark:text-white leading-none transition-all">
                             {isRev ? formatCurrency(dynamicTotal) : formatNumber(dynamicTotal)}
                        </div>
                        <span className="text-[10px] font-normal text-slate-400 mb-0.5">
                            {activeYears.length === 1 ? `(سال ${activeYears[0].year})` : `(مجموع ${activeYears.length} سال)`}
                        </span>
                     </div>
                </div>
            </div>

            {isExpanded && (
                <div className="border-t border-primary-200 dark:border-primary-800/50 bg-white/50 dark:bg-black/20 p-4 animate-in slide-in-from-top-2 duration-200">
                    {activeYears.length === 0 ? (
                        <div className="text-center text-slate-400 py-4 text-sm">سالی انتخاب نشده است.</div>
                    ) : (
                        <>
                            {/* Chart Toggle Tabs (Inline) */}
                            <div className="flex justify-center mb-6">
                                <div className="bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-600 flex gap-1 shadow-sm">
                                    <button 
                                        onClick={() => setChartMode('monthly')}
                                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1
                                            ${chartMode === 'monthly' 
                                                ? (isRev ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 shadow-sm' : 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300 shadow-sm') 
                                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}
                                        `}
                                    >
                                        <CalendarRange size={14} />
                                        <span>روند ماهانه</span>
                                    </button>
                                    <button 
                                        onClick={() => setChartMode('overall')}
                                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1
                                            ${chartMode === 'overall' 
                                                ? (isRev ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 shadow-sm' : 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300 shadow-sm') 
                                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}
                                        `}
                                    >
                                        <History size={14} />
                                        <span>روند کلی</span>
                                    </button>
                                </div>
                            </div>

                            <div className="mb-6 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                                <div className="h-40 w-full">
                                    {chartMode === 'monthly' && (() => {
                                        const chartYears = activeYears.slice(0, 3);
                                        const allMonthVals = chartYears.flatMap((y:any) => y.months.map((m:any) => isRev ? m.total : m.value));
                                        const yMax = Math.max(...allMonthVals, 1);
                                        
                                        const colors = isRev 
                                            ? ['#10b981', '#059669', '#047857'] 
                                            : ['#60a5fa', '#3b82f6', '#2563eb'];

                                        return (
                                            <svg viewBox="0 0 300 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                                                {/* Vertical Grid Lines */}
                                                {[...Array(12)].map((_, i) => (
                                                    <line key={i} x1={(i/11)*300} y1="0" x2={(i/11)*300} y2="100" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="2" />
                                                ))}
                                                
                                                {chartYears.map((y: any, idx: number) => {
                                                    const strokeStyle = isRev 
                                                        ? {} 
                                                        : { stroke: `var(--primary-${(idx % 3 === 0 ? 500 : (idx % 3 === 1 ? 400 : 600))})` };
                                                    
                                                    const fixedColor = isRev ? colors[idx % colors.length] : undefined;

                                                    const points = y.months.map((m: any, mIdx: number) => {
                                                        const val = isRev ? m.total : m.value;
                                                        const x = (mIdx / 11) * 300;
                                                        const h = (val / yMax) * 100;
                                                        return `${x},${100 - h}`;
                                                    }).join(' ');

                                                    return (
                                                        <polyline 
                                                            key={y.id} 
                                                            points={points} 
                                                            fill="none" 
                                                            stroke={fixedColor} 
                                                            style={strokeStyle}
                                                            strokeWidth="2" 
                                                            vectorEffect="non-scaling-stroke" 
                                                        />
                                                    );
                                                })}
                                                
                                                {/* X Axis Labels (1-12) */}
                                                {[...Array(12)].map((_, i) => (
                                                    <text key={i} x={(i/11)*300} y="115" textAnchor="middle" fontSize="8" className="fill-slate-400">{i + 1}</text>
                                                ))}
                                            </svg>
                                        );
                                    })()}

                                    {chartMode === 'overall' && (() => {
                                        const years = [...service.years].sort((a: any, b: any) => a.year - b.year);
                                        const values = years.map((y: any) => isRev ? y.total : y.value);
                                        const maxVal = Math.max(...values, 1);
                                        const points = values.map((val, i) => {
                                            const x = (i / (values.length - 1)) * 300;
                                            const h = (val / maxVal) * 100;
                                            return `${x},${100 - h}`;
                                        }).join(' ');

                                        return (
                                            <svg viewBox="0 0 300 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                                                <line x1="0" y1="100" x2="300" y2="100" stroke="#e2e8f0" strokeWidth="1" />
                                                <text x="0" y="115" fontSize="8" className="fill-slate-400">{years[0].year}</text>
                                                <text x="300" y="115" fontSize="8" textAnchor="end" className="fill-slate-400">{years[years.length-1].year}</text>
                                                <polyline 
                                                    points={points} 
                                                    fill="none" 
                                                    className={isRev ? 'stroke-green-500' : 'stroke-primary-500'} 
                                                    strokeWidth="2" 
                                                    vectorEffect="non-scaling-stroke" 
                                                />
                                            </svg>
                                        );
                                    })()}
                                </div>
                                <div className="flex justify-center gap-4 mt-5">
                                    {chartMode === 'monthly' && (
                                        activeYears.slice(0, 3).map((y: any, idx: number) => {
                                            const bgClass = isRev 
                                                ? ['bg-green-500', 'bg-green-400', 'bg-green-600'][idx % 3]
                                                : ['bg-primary-500', 'bg-primary-400', 'bg-primary-600'][idx % 3];
                                            return (
                                                <div key={y.id} className="flex items-center gap-1">
                                                    <span className={`w-2 h-2 rounded-full ${bgClass}`}></span>
                                                    <span className="text-[10px] text-slate-500">{y.year}</span>
                                                </div>
                                            )
                                        })
                                    )}
                                </div>
                            </div>

                            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                                <table className="w-full text-xs text-center">
                                    <thead>
                                        <tr className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                                            <th className="p-2 font-bold text-slate-600 dark:text-slate-300 text-right min-w-[80px]">ماه</th>
                                            {activeYears.map((y: any) => (
                                                <th key={y.id} className="p-2 font-bold text-slate-700 dark:text-slate-200 min-w-[80px]">
                                                    {y.year}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {MONTH_NAMES.map((month, idx) => (
                                            <tr key={idx} className="border-b border-slate-100 dark:border-slate-700 last:border-0">
                                                <td className="p-2 font-medium text-slate-500 dark:text-slate-400 text-right bg-slate-50 dark:bg-slate-900/50 border-l border-slate-100 dark:border-slate-700">
                                                    {idx + 1}
                                                </td>
                                                {activeYears.map((y: any) => {
                                                    const mData = y.months[idx];
                                                    const val = isRev ? mData.total : mData.value;
                                                    const colorClass = getIntensityColor(val);
                                                    
                                                    return (
                                                        <td key={`${y.id}-${idx}`} className="p-1">
                                                            <div className={`w-full h-full rounded py-1.5 px-1 flex flex-col items-center justify-center gap-0.5 ${colorClass}`}>
                                                                <span className="font-bold">{isRev ? formatCurrency(val) : formatNumber(val)}</span>
                                                                {isRev && val > 0 && (
                                                                <div className="flex h-1 w-full max-w-[40px] gap-px opacity-60">
                                                                    <div style={{ flex: mData.basic }} className="bg-slate-900 h-full rounded-sm" title="پایه"></div>
                                                                    <div style={{ flex: mData.supplementary }} className="bg-white h-full rounded-sm" title="تکمیلی"></div>
                                                                    <div style={{ flex: mData.free }} className="bg-orange-300 h-full rounded-sm" title="آزاد"></div>
                                                                </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                        <tr className="bg-slate-50 dark:bg-slate-900 font-bold border-t-2 border-slate-200 dark:border-slate-600">
                                            <td className="p-2 text-right">مجموع</td>
                                            {activeYears.map((y: any) => (
                                                <td key={y.id} className="p-2 text-slate-800 dark:text-white">
                                                    {isRev ? formatCurrency(y.total) : formatNumber(y.value)}
                                                </td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

// --- Main Dashboard Component ---
interface FinancialAnalysisViewProps {
    embedded?: boolean;
    isFilterOpen?: boolean;
    onFilterClose?: () => void;
    isEditing?: boolean;
}

const FinancialAnalysisView: React.FC<FinancialAnalysisViewProps> = ({ embedded = false, isFilterOpen, onFilterClose, isEditing = false }) => {
  const [activeTab, setActiveTab] = useState<'quantity' | 'revenue'>('quantity');
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);
  
  const [internalFilterOpen, setInternalFilterOpen] = useState(false);

  const isSidebarVisible = embedded ? !!isFilterOpen : internalFilterOpen;
  const closeSidebar = embedded ? (onFilterClose || (() => {})) : () => setInternalFilterOpen(false);
  
  // Global Year Filter State
  const [selectedYears, setSelectedYears] = useState<string[]>(
      AVAILABLE_YEARS.slice(0, 3).map(y => y.toString())
  );

  const handleToggleAccordion = (srvId: string) => {
      setExpandedServiceId(prev => prev === srvId ? null : srvId);
  }

  return (
    <div className={`${embedded ? 'bg-transparent' : 'bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm'} min-h-[50vh]`}>
      
      {/* Minimal Header */}
      <div className={`${embedded ? 'p-0 pb-4' : 'p-6 border-b border-slate-200 dark:border-slate-700'}`}>
         {/* Unified Distinct Filter Bar */}
         <div className="flex flex-col sm:flex-row items-center gap-4 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm relative">
             {/* Accent Line */}
             <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-primary-500 rounded-r-2xl"></div>

             {/* Filter Trigger */}
             {!embedded && (
                 <div className="flex items-center gap-3 px-3 shrink-0 w-full sm:w-auto">
                    <button 
                        onClick={() => setInternalFilterOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
                    >
                        <Filter size={18} />
                        <span className="font-bold text-sm">فیلترها</span>
                    </button>
                 </div>
             )}
             
             {!embedded && (
                <>
                <div className="h-8 w-px bg-slate-100 dark:bg-slate-800 hidden sm:block"></div>
                <div className="w-full h-px bg-slate-100 dark:bg-slate-800 sm:hidden"></div>
                </>
             )}
             
             <div className="flex-1 flex items-center justify-end gap-4 w-full">
                 
                 {/* Tabs */}
                 <div className="flex p-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl w-full sm:w-auto">
                     <button
                       onClick={() => setActiveTab('quantity')}
                       className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all
                         ${activeTab === 'quantity' 
                           ? 'bg-white dark:bg-slate-700 text-primary-700 dark:text-primary-300 shadow-sm' 
                           : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}
                       `}
                     >
                        <BarChart3 size={14} />
                        <span>عملکرد کمی</span>
                     </button>
                     <button
                       onClick={() => setActiveTab('revenue')}
                       className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all
                         ${activeTab === 'revenue' 
                           ? 'bg-white dark:bg-green-900/20 text-green-700 dark:text-green-300 shadow-sm ring-1 ring-green-100 dark:ring-green-800' 
                           : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}
                       `}
                     >
                        <Banknote size={14} />
                        <span>عملکرد درآمدی</span>
                     </button>
                 </div>
             </div>
         </div>
      </div>

      {/* Filter Sidebar (Drawer) */}
      {isSidebarVisible && (
        <div className="fixed inset-0 z-[100] isolate">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={closeSidebar}
          ></div>
          
          <div className="absolute top-0 left-0 h-full w-80 bg-white dark:bg-slate-900 shadow-2xl border-r border-slate-200 dark:border-slate-800 flex flex-col animate-in slide-in-from-left duration-300">
             <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white">فیلترهای پیشرفته</h3>
                <button 
                  onClick={closeSidebar}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
             </div>

             <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
                 <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-3 block">سال‌های مالی</label>
                    <MultiSelectDropdown 
                         title="انتخاب سال"
                         options={AVAILABLE_YEARS.map(y => ({ label: y.toString(), value: y.toString() }))}
                         selectedValues={selectedYears}
                         onChange={setSelectedYears}
                         inline={true}
                     />
                 </div>
             </div>

             <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <div className="flex gap-3">
                   {(selectedYears.length > 0) && (
                      <button 
                          onClick={() => setSelectedYears([])}
                          className="px-4 py-3 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-xl font-bold text-sm transition-colors"
                      >
                          حذف همه
                      </button>
                   )}
                   <button 
                      onClick={closeSidebar}
                      className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-sm transition-colors shadow-md shadow-primary-500/20"
                   >
                      مشاهده نتایج
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Dashboard Grid */}
      <div className={`${embedded ? 'p-0 pt-4' : 'p-4 bg-slate-50/50 dark:bg-slate-900/20'}`}>
         <div className="space-y-6">
             {(activeTab === 'quantity' ? QUANTITY_DATA : REVENUE_DATA).map((cat: any) => (
                 <div key={cat.id} className="animate-in slide-in-from-bottom-2 duration-500">
                     <h3 className="text-base font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                        <span className={`w-1.5 h-6 rounded-full ${activeTab === 'quantity' ? 'bg-primary-500' : 'bg-green-500'}`}></span>
                        {cat.title}
                     </h3>
                     
                     <div className="grid grid-cols-1 gap-4">
                         {cat.services.map((srv: any) => {
                             const relevantIds = srv.years.filter((y:any) => selectedYears.includes(y.year.toString())).map((y:any) => y.id);
                             
                             return (
                                 <ExpandableServiceCard 
                                    key={srv.id} 
                                    service={srv} 
                                    type={activeTab}
                                    selectedYearIds={relevantIds}
                                    isExpanded={expandedServiceId === srv.id}
                                    onToggle={() => handleToggleAccordion(srv.id)}
                                 />
                             );
                         })}
                     </div>
                 </div>
             ))}
         </div>
      </div>

    </div>
  );
};

export default FinancialAnalysisView;
