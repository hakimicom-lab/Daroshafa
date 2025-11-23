

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { User, ChevronDown, ChevronUp, Check, Search, Filter, X } from 'lucide-react';

interface Colleague {
  id: number;
  name: string;
  specialty: string;
  startDate: string;
  endDate: string; // Empty if active
  isActive: boolean;
  imageUrl: string;
}

const MOCK_DATA: Colleague[] = [
  { id: 1, name: 'دکتر علی محمدی', specialty: 'متخصص چشم‌پزشکی', startDate: '۱۳۸۵/۰۵/۰۱', endDate: '', isActive: true, imageUrl: '' },
  { id: 2, name: 'دکتر سارا احمدی', specialty: 'فوق تخصص شبکیه', startDate: '۱۳۹۰/۰۲/۱۵', endDate: '', isActive: true, imageUrl: '' },
  { id: 3, name: 'دکتر رضا کریمی', specialty: 'متخصص چشم‌پزشکی', startDate: '۱۳۸۳/۰۱/۰۱', endDate: '۱۳۹۵/۱۲/۲۹', isActive: false, imageUrl: '' },
  { id: 4, name: 'دکتر مریم حسینی', specialty: 'فوق تخصص قرنیه', startDate: '۱۳۸۸/۰۷/۱۰', endDate: '', isActive: true, imageUrl: '' },
  { id: 5, name: 'دکتر حسن رضایی', specialty: 'مسئول فنی', startDate: '۱۳۸۴/۰۶/۲۰', endDate: '۱۳۹۸/۰۴/۱۵', isActive: false, imageUrl: '' },
  { id: 6, name: 'دکتر زهرا نعمتی', specialty: 'مسئول فنی', startDate: '۱۳۹۵/۰۱/۲۰', endDate: '', isActive: true, imageUrl: '' },
  { id: 7, name: 'دکتر کامران وفایی', specialty: 'متخصص چشم‌پزشکی', startDate: '۱۳۹۲/۰۸/۰۵', endDate: '۱۴۰۲/۱۰/۳۰', isActive: false, imageUrl: '' },
  { id: 8, name: 'دکتر بیتا شمس', specialty: 'فوق تخصص شبکیه', startDate: '۱۳۸۶/۰۳/۱۲', endDate: '۱۴۰۰/۰۵/۰۵', isActive: false, imageUrl: '' },
];

const TRUSTEES_DATA: Colleague[] = [
  { id: 101, name: 'دکتر محمد حسین رضایی', specialty: 'رئیس هیات امناء', startDate: '---', endDate: '', isActive: true, imageUrl: '' },
  { id: 102, name: 'دکتر سید علی یزدی خواه', specialty: 'عضو هیات امناء', startDate: '---', endDate: '', isActive: true, imageUrl: '' },
  { id: 103, name: 'جناب آقای دکتر طاهر درودی', specialty: 'عضو هیات امناء', startDate: '---', endDate: '', isActive: true, imageUrl: '' },
  { id: 104, name: 'دکتر حسین توکلی کجانی', specialty: 'عضو هیات امناء', startDate: '---', endDate: '', isActive: true, imageUrl: '' },
  { id: 105, name: 'دکتر سید علیرضا عارف', specialty: 'عضو هیات امناء', startDate: '---', endDate: '', isActive: true, imageUrl: '' },
  { id: 106, name: 'دکتر سید جواد میراسماعیلی', specialty: 'عضو هیات امناء', startDate: '---', endDate: '', isActive: true, imageUrl: '' },
];

const DIRECTORS_DATA: Colleague[] = [
  { id: 201, name: 'جناب آقای جواد علی اکبریان', specialty: 'رئیس هیات مدیره', startDate: '---', endDate: '', isActive: true, imageUrl: '' },
  { id: 202, name: 'دکتر سید علیرضا عارف', specialty: 'رئیس دارالشفاء', startDate: '---', endDate: '', isActive: true, imageUrl: '' },
  { id: 203, name: 'دکتر سید جواد میر اسماعیلی', specialty: 'عضو هیات مدیره', startDate: '---', endDate: '', isActive: true, imageUrl: '' },
  { id: 204, name: 'دکتر حسین توکلی کجانی', specialty: 'عضو هیات مدیره', startDate: '---', endDate: '', isActive: true, imageUrl: '' },
  { id: 205, name: 'دکتر رضا پایدار', specialty: 'عضو هیات مدیره', startDate: '---', endDate: '', isActive: true, imageUrl: '' },
];


interface HumanCapitalViewProps {
  embedded?: boolean;
  isFilterOpen?: boolean;
  onFilterClose?: () => void;
  departmentName?: string;
}

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
    <div className={`relative ${inline ? 'w-full' : ''}`} ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-2 px-4 py-3 rounded-xl border text-sm font-bold transition-all shadow-sm
          ${isOpen || selectedValues.length > 0 
            ? 'bg-white dark:bg-slate-800 border-primary-500 text-primary-700 dark:text-primary-300 ring-1 ring-primary-500' 
            : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary-300 dark:hover:border-primary-700'}
          ${inline ? 'w-full' : 'min-w-[160px]'}
        `}
      >
        <span className="truncate">
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
                : 'absolute top-full mt-2 right-0 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl max-h-80'}
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
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors text-xs font-medium
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

const ExpandablePersonCard: React.FC<{ person: Colleague, isExpanded: boolean, onToggle: () => void }> = ({ person, isExpanded, onToggle }) => {
  return (
    <div className={`
        border rounded-2xl shadow-sm transition-all overflow-hidden
        ${isExpanded 
           ? 'bg-primary-50 dark:bg-slate-800 border-primary-500 dark:border-primary-400 shadow-md ring-1 ring-primary-500/20 dark:ring-primary-400/20' 
           : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-800 hover:shadow-md'}
    `}>
        <div className="p-4 flex items-center justify-between cursor-pointer select-none" onClick={onToggle}>
             <div className="flex items-center gap-5 overflow-hidden">
                 {person.imageUrl ? (
                    <img 
                        src={person.imageUrl} 
                        alt={person.name} 
                        className="w-20 h-20 rounded-2xl object-cover border-2 border-white dark:border-slate-600 shadow-md shrink-0" 
                    />
                 ) : (
                    <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center border-2 border-white dark:border-slate-600 shadow-md shrink-0 text-slate-400 dark:text-slate-500">
                        <User size={32} strokeWidth={1.5} />
                    </div>
                 )}
                 
                 <div className="min-w-0 flex flex-col gap-1">
                     <div className="flex items-center gap-2 flex-wrap">
                         <h3 className={`font-bold text-lg transition-colors ${isExpanded ? 'text-primary-900 dark:text-primary-100' : 'text-slate-800 dark:text-slate-100'}`}>{person.name}</h3>
                         {person.isActive ? (
                           <span className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-[10px] px-2 py-0.5 rounded-full border border-green-100 dark:border-green-800 shrink-0 font-bold">فعال</span>
                         ) : (
                           <span className="bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-[10px] px-2 py-0.5 rounded-full shrink-0 font-bold">سابق</span>
                         )}
                     </div>
                     <p className="text-sm font-bold text-primary-600 dark:text-primary-400 truncate">{person.specialty}</p>
                 </div>
             </div>
             
             <div className={`p-1.5 rounded-full transition-colors shrink-0 hidden sm:block ${isExpanded ? 'bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400' : 'bg-slate-100 dark:bg-slate-700'}`}>
                 {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} className="text-slate-500" />}
             </div>
        </div>

        {isExpanded && (
            <div className="border-t border-primary-200 dark:border-primary-800/50 bg-white/50 dark:bg-black/20 p-5 animate-in slide-in-from-top-2 duration-200">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                     <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                         <span className="text-slate-500 dark:text-slate-400">تاریخ شروع همکاری</span>
                         <span className="font-mono font-bold text-slate-700 dark:text-slate-200">{person.startDate}</span>
                     </div>
                     {!person.isActive && (
                         <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                             <span className="text-slate-500 dark:text-slate-400">تاریخ پایان همکاری</span>
                             <span className="font-mono font-bold text-slate-700 dark:text-slate-200">{person.endDate}</span>
                         </div>
                     )}
                     <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                         <span className="text-slate-500 dark:text-slate-400">وضعیت</span>
                         <span className={person.isActive ? "font-bold text-green-600 dark:text-green-400" : "font-bold text-slate-500 dark:text-slate-400"}>
                             {person.isActive ? "مشغول به فعالیت" : "پایان یافته"}
                         </span>
                     </div>
                 </div>
            </div>
        )}
    </div>
  );
};


const HumanCapitalView: React.FC<HumanCapitalViewProps> = ({ embedded = false, isFilterOpen, onFilterClose, departmentName = '' }) => {
  
  // Determine Data Source
  const dataSource = useMemo(() => {
      if (departmentName.includes('هیات امناء')) return TRUSTEES_DATA;
      if (departmentName.includes('هیات مدیره')) return DIRECTORS_DATA;
      return MOCK_DATA;
  }, [departmentName]);

  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  
  const [internalFilterOpen, setInternalFilterOpen] = useState(false);

  // Derive visibility control from props if embedded, otherwise use local state
  const isFilterVisible = embedded ? !!isFilterOpen : internalFilterOpen;
  const closeFilter = embedded ? (onFilterClose || (() => {})) : () => setInternalFilterOpen(false);

  // Unique Specialties for filter
  const specialties = Array.from(new Set(dataSource.map(d => d.specialty)));

  const filteredData = dataSource.filter(item => {
    const specialtyMatch = selectedSpecialties.length === 0 || selectedSpecialties.includes(item.specialty);
    const statusMatch = statusFilter === 'all' 
      ? true 
      : statusFilter === 'active' ? item.isActive : !item.isActive;

    return specialtyMatch && statusMatch;
  });

  const handleToggle = (id: number) => {
      setExpandedId(prev => prev === id ? null : id);
  }

  return (
    <div className={`${embedded ? 'bg-transparent' : 'bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm'} min-h-[50vh]`}>
      
      {/* Header & Filters */}
      <div className={`${embedded ? 'p-0 pb-6' : 'p-6 border-b border-slate-200 dark:border-slate-700'}`}>
        
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm relative">
          <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-primary-500 rounded-r-2xl"></div>

           <div className="text-slate-500 dark:text-slate-400 text-sm px-4">
              {filteredData.length} نفر یافت شد
           </div>
          
          {!embedded && (
            <button 
                onClick={() => setInternalFilterOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-900/40 rounded-xl border border-primary-100 dark:border-primary-800 font-bold text-sm transition-all whitespace-nowrap"
            >
                <Filter size={18} />
                <span>فیلترها</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Sidebar (Drawer) */}
      {isFilterVisible && (
        <div className="fixed inset-0 z-[100] isolate">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={closeFilter}
          ></div>
          
          <div className="absolute top-0 left-0 h-full w-80 bg-white dark:bg-slate-900 shadow-2xl border-r border-slate-200 dark:border-slate-800 flex flex-col animate-in slide-in-from-left duration-300">
             <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white">فیلترهای پیشرفته</h3>
                <button 
                  onClick={closeFilter}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
             </div>

             <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
                 <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-3 block">سمت / تخصص</label>
                    <MultiSelectDropdown 
                        title="انتخاب..."
                        options={specialties.map(s => ({ label: s, value: s }))}
                        selectedValues={selectedSpecialties}
                        onChange={setSelectedSpecialties}
                        inline={true}
                    />
                 </div>

                 <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-3 block">وضعیت همکاری</label>
                    <div className="flex flex-col gap-2">
                        <button 
                        onClick={() => setStatusFilter('all')}
                        className={`w-full px-4 py-3 text-sm font-bold rounded-xl transition-all text-right border ${statusFilter === 'all' ? 'bg-primary-50 dark:bg-slate-800 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-slate-600' : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50'}`}
                        >همه</button>
                        <button 
                        onClick={() => setStatusFilter('active')}
                        className={`w-full px-4 py-3 text-sm font-bold rounded-xl transition-all text-right border ${statusFilter === 'active' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800' : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50'}`}
                        >فعال</button>
                        <button 
                        onClick={() => setStatusFilter('inactive')}
                        className={`w-full px-4 py-3 text-sm font-bold rounded-xl transition-all text-right border ${statusFilter === 'inactive' ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600' : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50'}`}
                        >سابق</button>
                    </div>
                 </div>
             </div>

             <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <div className="flex gap-3">
                   {(selectedSpecialties.length > 0 || statusFilter !== 'all') && (
                      <button 
                          onClick={() => { setSelectedSpecialties([]); setStatusFilter('all'); }}
                          className="px-4 py-3 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-xl font-bold text-sm transition-colors"
                      >
                          حذف همه
                      </button>
                   )}
                   <button 
                      onClick={closeFilter}
                      className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-sm transition-colors shadow-md shadow-primary-500/20"
                   >
                      مشاهده نتایج
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* List Content (Accordion Style) */}
      <div className={`${embedded ? 'p-0' : 'p-6'}`}>
         {filteredData.length === 0 ? (
            <div className="text-center text-slate-400 py-10 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">موردی یافت نشد.</div>
         ) : (
            <div className="space-y-4">
                {filteredData.map(person => (
                   <ExpandablePersonCard 
                      key={person.id} 
                      person={person} 
                      isExpanded={expandedId === person.id}
                      onToggle={() => handleToggle(person.id)}
                   />
                ))}
            </div>
         )}
      </div>
    </div>
  );
};

export default HumanCapitalView;
