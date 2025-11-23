
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { CheckCircle, Award, Eye, ArrowDown, Calendar, TrendingUp, Filter, ChevronDown, ChevronUp, Check, X, Image as ImageIcon, FileText, Download, Moon, Sun, Clock, Loader2, Map, Plus, Edit2, Trash2, Save } from 'lucide-react';
import ImageUploader from './ImageUploader';

interface TimelineItem {
  id: string;
  date: string;      // Shamsi Date
  dateLunar: string; // Lunar Date (Hijri Qamari)
  title: string;
  description: string;
  type: 'milestone' | 'equipment' | 'expansion';
  status: 'done' | 'in_progress' | 'future'; // New status field
  images?: string[];
  docs?: string[];
}

const OPHTHALMOLOGY_EVENTS: TimelineItem[] = [
  {
    id: 'future-1',
    date: '۱۴۰۵/۰۱/۱۵',
    dateLunar: '۱۴۴۷/۱۰/۱۵',
    title: 'طرح توسعه فاز ۳ کلینیک',
    description: 'برنامه احداث ساختمان جدید جهت افزایش ظرفیت پذیرش به دو برابر.',
    type: 'expansion',
    status: 'future',
    images: [],
    docs: []
  },
  {
    id: '1',
    date: '۱۴۰۲/۰۸/۱۵',
    dateLunar: '۱۴۴۵/۰۴/۲۱', // Rabi' al-Thani
    title: 'دستیابی به رکورد ۱۰,۰۰۰ عمل جراحی در سال',
    description: 'با تلاش شبانه‌روزی کادر درمان، رکورد انجام عمل‌های جراحی در یک سال شکسته شد.',
    type: 'milestone',
    status: 'done',
    images: ['https://picsum.photos/seed/event1/600/400'],
    docs: ['گزارش_عملکرد.pdf']
  },
  {
    id: 'current-1',
    date: '۱۴۰۲/۱۲/۰۱',
    dateLunar: '۱۴۴۵/۰۸/۱۰', 
    title: 'به‌روزرسانی سامانه نوبت‌دهی هوشمند',
    description: 'پروژه در حال اجرا جهت یکپارچه‌سازی سیستم نوبت‌دهی کلینیک با وب‌سایت.',
    type: 'expansion',
    status: 'in_progress',
    images: [],
    docs: []
  },
  {
    id: 'ev-1401-1',
    date: '۱۴۰۱/۰۲/۱۰',
    dateLunar: '۱۴۴۳/۱۰/۰۱',
    title: 'خرید و نصب لیزر اگزایمر پیشرفته',
    description: 'تجهیز مرکز به جدیدترین فناوری لیزر برای جراحی‌های لازک و پی‌آر‌کی.',
    type: 'equipment',
    status: 'done',
    images: ['https://picsum.photos/seed/1401e1/500/300'],
    docs: []
  },
  {
    id: 'ev-1401-2',
    date: '۱۴۰۱/۰۶/۱۵',
    dateLunar: '۱۴۴۴/۰۲/۱۰',
    title: 'کسب درجه یک عالی اعتباربخشی',
    description: 'موفقیت در ارزیابی‌های وزارت بهداشت و دریافت گواهینامه درجه یک.',
    type: 'milestone',
    status: 'done',
    images: ['https://picsum.photos/seed/1401e2/500/300'],
    docs: ['گواهینامه.pdf']
  },
  {
    id: 'ev-1401-3',
    date: '۱۴۰۱/۱۱/۲۲',
    dateLunar: '۱۴۴۴/۰۷/۲۱',
    title: 'افتتاح بخش VIP بیماران بین‌الملل',
    description: 'راه‌اندازی دپارتمان IPD برای پذیرش بیماران خارجی.',
    type: 'expansion',
    status: 'done',
    images: ['https://picsum.photos/seed/1401e3/500/300'],
    docs: []
  },
  {
    id: '2',
    date: '۱۴۰۰/۰۲/۱۰',
    dateLunar: '۱۴۴۲/۰۹/۱۸', // Ramadan
    title: 'نصب و راه‌اندازی دستگاه فمتو لیزیک',
    description: 'تجهیز اتاق عمل به پیشرفته‌ترین دستگاه لیزر جهت انجام عمل‌های رفراکتیو دقیق.',
    type: 'equipment',
    status: 'done',
    images: ['https://picsum.photos/seed/event2/600/400'],
    docs: ['کاتالوگ_فنی.pdf', 'قرارداد_خرید.pdf']
  },
  {
    id: '3',
    date: '۱۳۹۸/۱۱/۲۲',
    dateLunar: '۱۴۴۱/۰۶/۱۶', // Jumada al-Thani
    title: 'بازسازی کامل و مدرن‌سازی کلینیک',
    description: 'افزایش تعداد اتاق‌های معاینه به ۱۲ باب و اصلاح جریان بیمار در بخش.',
    type: 'expansion',
    status: 'done',
    images: ['https://picsum.photos/seed/event3/600/400'],
    docs: []
  },
  {
    id: '4',
    date: '۱۳۹۵/۰۶/۰۱',
    dateLunar: '۱۴۳۷/۱۱/۱۹', // Dhu al-Qi'dah
    title: 'راه‌اندازی واحد تصویربرداری شبکیه (OCT)',
    description: 'استقلال واحد پاراکلینیک چشم و خرید دستگاه‌های تصویربرداری پیشرفته زایس.',
    type: 'equipment',
    status: 'done',
    images: [],
    docs: ['مجوز_بهداشت.pdf']
  },
  {
    id: '5',
    date: '۱۳۹۰/۰۴/۱۵',
    dateLunar: '۱۴۳۲/۰۸/۰۴', // Sha'ban
    title: 'افتتاح بخش جراحی‌های محدود',
    description: 'شروع به کار رسمی دی‌کلینیک با تمرکز بر عمل‌های کاتاراکت (آب مروارید).',
    type: 'expansion',
    status: 'done',
    images: ['https://picsum.photos/seed/event5/600/400'],
    docs: []
  },
  {
    id: '6',
    date: '۱۳۸۵/۰۹/۲۰',
    dateLunar: '۱۴۲۷/۱۱/۱۹', // Dhu al-Qi'dah
    title: 'جذب اولین گروه فوق‌تخصص',
    description: 'تکمیل کادر پزشکی با حضور اساتید دانشگاهی در رشته‌های قرنیه و شبکیه.',
    type: 'milestone',
    status: 'done',
    images: [],
    docs: []
  },
  {
    id: '7',
    date: '۱۳۸۳/۰۷/۰۱',
    dateLunar: '۱۴۲۵/۰۸/۰۸', // Sha'ban
    title: 'تأسیس دپارتمان چشم‌پزشکی',
    description: 'آغاز فعالیت دارالشفاء کوثر با دو یونیت معاینه و یک متخصص چشم.',
    type: 'milestone',
    status: 'done',
    images: ['https://picsum.photos/seed/event7/600/400'],
    docs: ['سند_تاسیس.pdf']
  }
];

// --- Helper Constants for Date Filtering ---
const toPersianDigits = (n: string) => n.replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d)]);

const PERSIAN_MONTHS = [
  { label: 'فروردین', value: '۰۱' },
  { label: 'اردیبهشت', value: '۰۲' },
  { label: 'خرداد', value: '۰۳' },
  { label: 'تیر', value: '۰۴' },
  { label: 'مرداد', value: '۰۵' },
  { label: 'شهریور', value: '۰۶' },
  { label: 'مهر', value: '۰۷' },
  { label: 'آبان', value: '۰۸' },
  { label: 'آذر', value: '۰۹' },
  { label: 'دی', value: '۱۰' },
  { label: 'بهمن', value: '۱۱' },
  { label: 'اسفند', value: '۱۲' },
];

const LUNAR_MONTHS = [
  { label: 'محرم', value: '۰۱' },
  { label: 'صفر', value: '۰۲' },
  { label: 'ربیع‌الاول', value: '۰۳' },
  { label: 'ربیع‌الثانی', value: '۰۴' },
  { label: 'جمادی‌الاول', value: '۰۵' },
  { label: 'جمادی‌الثانی', value: '۰۶' },
  { label: 'رجب', value: '۰۷' },
  { label: 'شعبان', value: '۰۸' },
  { label: 'رمضان', value: '۰۹' },
  { label: 'شوال', value: '۱۰' },
  { label: 'ذی‌القعده', value: '۱۱' },
  { label: 'ذی‌الحجه', value: '۱۲' },
];

const DAYS_LIST = Array.from({ length: 31 }, (_, i) => {
    const val = (i + 1).toString().padStart(2, '0');
    const faVal = toPersianDigits(val);
    return { label: faVal, value: faVal };
});


// Internal MultiSelect Dropdown (Reused Logic)
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
              ? 'border-primary-500 bg-white dark:bg-slate-800 text-primary-700 dark:text-primary-300 ring-1 ring-primary-500' 
              : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:border-primary-300 dark:hover:border-primary-700'}
            ${inline ? 'w-full' : 'min-w-[140px]'}
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
                : 'absolute top-full mt-2 right-0 md:right-auto md:left-auto w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl max-h-72'}
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
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors text-sm font-medium
                        ${isSelected ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-800 dark:text-primary-200' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}
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

const TimelineCard: React.FC<{ 
    item: TimelineItem, 
    isExpanded: boolean, 
    onToggle: () => void,
    onShowImages: (imgs: string[]) => void,
    calendarType: 'shamsi' | 'lunar',
    isEditing: boolean,
    onEdit: (item: TimelineItem) => void,
    onDelete: (id: string) => void
}> = ({ item, isExpanded, onToggle, onShowImages, calendarType, isEditing, onEdit, onDelete }) => {
    
    const getIcon = () => {
        switch(item.type) {
            case 'milestone': return <Award size={18} />;
            case 'equipment': return <TrendingUp size={18} />;
            case 'expansion': return <CheckCircle size={18} />;
        }
    };

    const getTypeName = () => {
        switch(item.type) {
            case 'milestone': return 'نقطه عطف';
            case 'equipment': return 'تجهیزات';
            case 'expansion': return 'توسعه';
        }
    };

    const getStatusBadge = () => {
        switch(item.status) {
            case 'done': return (
                <span className="flex items-center gap-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-[10px] px-2 py-0.5 rounded-full border border-green-200 dark:border-green-800">
                    <Check size={10} strokeWidth={3} />
                    انجام شده
                </span>
            );
            case 'in_progress': return (
                <span className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                    <Loader2 size={10} className="animate-spin" />
                    در حال انجام
                </span>
            );
            case 'future': return (
                <span className="flex items-center gap-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-[10px] px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                    <Map size={10} />
                    برنامه آتی
                </span>
            );
        }
    };

    const displayDate = calendarType === 'shamsi' ? item.date : item.dateLunar;

    return (
        <div className={`
            border rounded-xl shadow-sm transition-all overflow-hidden relative z-10
            ${isExpanded 
               ? 'bg-primary-50 dark:bg-slate-800 border-primary-500 dark:border-primary-400 shadow-md ring-1 ring-primary-500/20 dark:ring-primary-400/20' 
               : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-800 hover:shadow-md'}
        `}>
             {isEditing && (
                <div className="absolute top-2 left-2 flex gap-2 z-20">
                    <button 
                    onClick={(e) => { e.stopPropagation(); onEdit(item); }}
                    className="p-1.5 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full transition-colors"
                    >
                        <Edit2 size={14} />
                    </button>
                    <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                    className="p-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-full transition-colors"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            )}

            <div className="p-5 flex items-center justify-between cursor-pointer select-none" onClick={onToggle}>
                 <div className="flex flex-col">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className={`font-bold text-base transition-colors ${isExpanded ? 'text-primary-900 dark:text-primary-100' : 'text-slate-800 dark:text-slate-100'}`}>
                                {item.title}
                            </h3>
                            {getStatusBadge()}
                    </div>
                    {!isExpanded && (
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-slate-400">{getTypeName()}</span>
                            <span className="text-[10px] text-slate-300">•</span>
                            <span className="text-[10px] text-slate-500 font-mono">{displayDate}</span>
                        </div>
                    )}
                 </div>
                 
                 <div className={`p-1 rounded-full transition-colors shrink-0 ${isExpanded ? 'bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400' : 'bg-slate-100 dark:bg-slate-700'}`}>
                     {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} className="text-slate-500" />}
                 </div>
            </div>

            {isExpanded && (
                <div className="border-t border-primary-200 dark:border-primary-800/50 bg-white/50 dark:bg-black/20 p-5 animate-in slide-in-from-top-2 duration-200">
                     <div className="flex flex-col gap-4">
                         <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed text-justify bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                             {item.description}
                         </p>
                         
                         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs mt-2">
                             <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-mono font-bold">
                                    <Calendar size={14} />
                                    <span>{displayDate}</span>
                                    <span className="text-[10px] text-slate-400 font-normal mr-1">
                                        ({calendarType === 'shamsi' ? 'شمسی' : 'قمری'})
                                    </span>
                                </div>
                                
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 ${item.type === 'milestone' ? 'text-primary-600' : item.type === 'equipment' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                    {getIcon()}
                                    <span className="font-bold">{getTypeName()}</span>
                                </div>
                             </div>

                             {/* Attachments Actions */}
                             <div className="flex items-center gap-2 w-full sm:w-auto">
                                {item.images && item.images.length > 0 && (
                                    <button 
                                    onClick={(e) => { e.stopPropagation(); if(item.images) onShowImages(item.images); }}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-bold transition-colors"
                                    >
                                        <ImageIcon size={14} />
                                        <span>تصاویر</span>
                                    </button>
                                )}
                                {item.docs && item.docs.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        {item.docs.map((doc, i) => (
                                            <a key={i} href="#" className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-orange-900/20 text-slate-600 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-bold transition-colors">
                                                <FileText size={14} />
                                                <span className="truncate max-w-[80px]">{doc}</span>
                                                <Download size={12} />
                                            </a>
                                        ))}
                                    </div>
                                )}
                             </div>
                         </div>
                     </div>
                </div>
            )}
        </div>
    );
};

interface TimelineViewProps {
    embedded?: boolean;
    isFilterOpen?: boolean;
    onFilterClose?: () => void;
    isEditing?: boolean;
}

const TimelineView: React.FC<TimelineViewProps> = ({ embedded = false, isFilterOpen, onFilterClose, isEditing = false }) => {
  const [eventsData, setEventsData] = useState<TimelineItem[]>([]);

  // Load Data
  useEffect(() => {
    const saved = localStorage.getItem('timeline_data');
    if (saved) {
        setEventsData(JSON.parse(saved));
    } else {
        setEventsData(OPHTHALMOLOGY_EVENTS);
    }
  }, []);

  // Save Data
  useEffect(() => {
    localStorage.setItem('timeline_data', JSON.stringify(eventsData));
  }, [eventsData]);

  const [calendarType, setCalendarType] = useState<'shamsi' | 'lunar'>('shamsi');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string[] | null>(null);
  
  const [internalFilterOpen, setInternalFilterOpen] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TimelineItem | null>(null);
  const [formData, setFormData] = useState<Partial<TimelineItem>>({});

  const isSidebarVisible = embedded ? !!isFilterOpen : internalFilterOpen;
  const closeSidebar = embedded ? (onFilterClose || (() => {})) : () => setInternalFilterOpen(false);

  // Reset filters when calendar type changes
  useEffect(() => {
      setSelectedYears([]);
      setSelectedMonths([]);
      setSelectedDays([]);
  }, [calendarType]);

  const typeOptions = [
      { label: 'نقطه عطف', value: 'milestone' },
      { label: 'تجهیزات', value: 'equipment' },
      { label: 'توسعه', value: 'expansion' }
  ];

  const statusOptions = [
      { label: 'انجام شده', value: 'done' },
      { label: 'در حال انجام', value: 'in_progress' },
      { label: 'برنامه آتی', value: 'future' }
  ];

  // Dynamic Options based on Calendar Type
  const uniqueDataYears = new Set<string>(eventsData.map(e => {
      const dateStr = calendarType === 'shamsi' ? e.date : e.dateLunar;
      return dateStr.split('/')[0];
  }));

  if (calendarType === 'shamsi') {
      ['1403', '1404', '1405', '1406', '1407', '1408'].forEach(y => uniqueDataYears.add(y));
  }

  const availableYears = Array.from(uniqueDataYears).sort((a, b) => b.localeCompare(a));
  const yearOptions = availableYears.map(y => ({ label: y, value: y }));
  const currentMonthOptions = calendarType === 'shamsi' ? PERSIAN_MONTHS : LUNAR_MONTHS;

  const filteredEvents = eventsData.filter(item => {
      const dateStr = calendarType === 'shamsi' ? item.date : item.dateLunar;
      const dateParts = dateStr.split('/');
      const itemYear = dateParts[0];
      const itemMonth = dateParts[1];
      const itemDay = dateParts[2];

      const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(item.type);
      const statusMatch = selectedStatuses.length === 0 || selectedStatuses.includes(item.status);
      const yearMatch = selectedYears.length === 0 || selectedYears.includes(itemYear);
      const monthMatch = selectedMonths.length === 0 || selectedMonths.includes(itemMonth);
      const dayMatch = selectedDays.length === 0 || selectedDays.includes(itemDay);
      
      return typeMatch && statusMatch && yearMatch && monthMatch && dayMatch;
  });

  // Group by Year
  const groupedEvents = useMemo(() => {
      const groups: Record<string, TimelineItem[]> = {};
      filteredEvents.forEach(event => {
          const dateStr = calendarType === 'shamsi' ? event.date : event.dateLunar;
          const year = dateStr.split('/')[0];
          if (!groups[year]) groups[year] = [];
          groups[year].push(event);
      });
      return groups;
  }, [filteredEvents, calendarType]);

  const sortedYears = Object.keys(groupedEvents).sort((a, b) => b.localeCompare(a));

  const handleToggle = (id: string) => {
      setExpandedId(prev => prev === id ? null : id);
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedStatuses([]);
    setSelectedYears([]);
    setSelectedMonths([]);
    setSelectedDays([]);
  };

  // CRUD
  const handleAddClick = () => {
      setEditingItem(null);
      setFormData({
          title: '', description: '', date: '', dateLunar: '', type: 'milestone', status: 'done', images: []
      });
      setIsModalOpen(true);
  };

  const handleEditClick = (item: TimelineItem) => {
      setEditingItem(item);
      setFormData({ ...item });
      setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
      if(window.confirm('آیا از حذف این رویداد اطمینان دارید؟')) {
          setEventsData(prev => prev.filter(i => i.id !== id));
      }
  };

  const handleSaveForm = () => {
      if (!formData.title) return alert('عنوان رویداد الزامی است');
      
      if (editingItem) {
          setEventsData(prev => prev.map(i => i.id === editingItem.id ? { ...i, ...formData } as TimelineItem : i));
      } else {
          const newId = `ev-${Date.now()}`;
          const newItem = { ...formData, id: newId, docs: [] } as TimelineItem;
          setEventsData(prev => [newItem, ...prev]);
      }
      setIsModalOpen(false);
  };

  const handleImageUpload = (url: string) => {
    setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), url]
    }));
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
        ...prev,
        images: prev.images?.filter((_, i) => i !== index)
    }));
  };


  return (
    <div className={`${embedded ? 'bg-transparent' : 'bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm'} min-h-[50vh]`}>
      
      {/* Header */}
       <div className={`${embedded ? 'p-0 pb-6' : 'p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 rounded-t-xl'}`}>
         {/* Header Toolbar */}
         <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm relative">
             <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-primary-500 rounded-r-2xl"></div>
             
             <div className="text-slate-500 dark:text-slate-400 text-sm px-4">
                {filteredEvents.length} رویداد یافت شد
             </div>
            
             <div className="flex items-center gap-2">
                 {isEditing && (
                     <button 
                         onClick={handleAddClick}
                         className="flex items-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-sm transition-all shadow-sm"
                     >
                         <Plus size={18} />
                         <span>افزودن رویداد</span>
                     </button>
                 )}

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
      </div>

      {/* Filter Sidebar (Drawer) */}
      {isSidebarVisible && (
        <div className="fixed inset-0 z-[100] isolate">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={closeSidebar}
          ></div>
          
          {/* Sidebar */}
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
                 
                 {/* Calendar Type */}
                 <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-3 block">تقویم</label>
                    <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
                       <button 
                          onClick={() => setCalendarType('shamsi')}
                          className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${calendarType === 'shamsi' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-700 dark:text-primary-300' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                       >
                           <Sun size={14} />
                           <span>شمسی</span>
                       </button>
                       <button 
                          onClick={() => setCalendarType('lunar')}
                          className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${calendarType === 'lunar' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-700 dark:text-primary-300' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                       >
                           <Moon size={14} />
                           <span>قمری</span>
                       </button>
                    </div>
                 </div>

                 <div className="space-y-4">
                     <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block">زمان</label>
                     <MultiSelectDropdown 
                         title="سال"
                         options={yearOptions}
                         selectedValues={selectedYears}
                         onChange={setSelectedYears}
                         inline={true}
                     />
                     <MultiSelectDropdown 
                         title="ماه"
                         options={currentMonthOptions}
                         selectedValues={selectedMonths}
                         onChange={setSelectedMonths}
                         inline={true}
                     />
                     <MultiSelectDropdown 
                         title="روز"
                         options={DAYS_LIST}
                         selectedValues={selectedDays}
                         onChange={setSelectedDays}
                         inline={true}
                     />
                 </div>

                 <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block">ویژگی‌ها</label>
                     <MultiSelectDropdown 
                         title="وضعیت پروژه"
                         options={statusOptions}
                         selectedValues={selectedStatuses}
                         onChange={setSelectedStatuses}
                         inline={true}
                     />

                     <MultiSelectDropdown 
                         title="نوع رویداد"
                         options={typeOptions}
                         selectedValues={selectedTypes}
                         onChange={setSelectedTypes}
                         inline={true}
                     />
                 </div>
             </div>

             <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <div className="flex gap-3">
                   {(selectedTypes.length > 0 || selectedStatuses.length > 0 || selectedYears.length > 0 || selectedMonths.length > 0 || selectedDays.length > 0) && (
                      <button 
                          onClick={clearFilters}
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

      {/* Content: Grouped by Year */}
      <div className={`${embedded ? 'p-0 pt-2' : 'p-6'}`}>
          {sortedYears.length === 0 ? (
               <div className="text-center text-slate-400 py-16 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">موردی یافت نشد.</div>
          ) : (
               <div className="space-y-8">
                  {sortedYears.map(year => (
                      <div key={year} className="animate-in slide-in-from-bottom-2 duration-500">
                          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                            <span className="w-1.5 h-6 rounded-full bg-primary-500"></span>
                            <span>سال {year} ({calendarType === 'shamsi' ? 'شمسی' : 'قمری'})</span>
                            <span className="text-xs font-normal text-slate-500 mr-2">
                                ({groupedEvents[year].length} رویداد)
                            </span>
                          </h3>
                          
                          <div className="relative border-r-2 border-slate-200 dark:border-slate-700 mr-3 pr-6 pb-4">
                              {groupedEvents[year].map(item => (
                                  <div key={item.id} className="relative mb-6 last:mb-0">
                                       {/* Timeline Dot */}
                                       <div className={`absolute -right-[31px] top-6 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 z-20 ${
                                            item.type === 'milestone' ? 'bg-primary-500' : 
                                            item.type === 'equipment' ? 'bg-emerald-500' : 'bg-amber-500'
                                       }`}></div>

                                      <TimelineCard 
                                          item={item}
                                          isExpanded={expandedId === item.id}
                                          onToggle={() => handleToggle(item.id)}
                                          onShowImages={setActiveImage}
                                          calendarType={calendarType}
                                          isEditing={isEditing}
                                          onEdit={handleEditClick}
                                          onDelete={handleDeleteClick}
                                      />
                                  </div>
                              ))}
                          </div>
                      </div>
                  ))}
               </div>
          )}
      </div>

       {/* Modal: Image Gallery */}
       {activeImage && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setActiveImage(null)}>
             <button className="absolute top-6 left-6 text-white/70 hover:text-white p-2 bg-white/10 rounded-full transition-colors"><X size={24} /></button>
             <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="grid grid-cols-1 gap-6">
                    {activeImage.map((src, idx) => (
                        <img key={idx} src={src} alt="Event Gallery" className="w-full max-h-[60vh] object-contain rounded-xl shadow-2xl ring-1 ring-white/10 mx-auto" />
                    ))}
                </div>
             </div>
          </div>
       )}

       {/* Modal: Add/Edit */}
       {isModalOpen && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
               <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
               <div className="relative bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
                   <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                       <h3 className="font-bold text-lg">{editingItem ? 'ویرایش رویداد' : 'افزودن رویداد جدید'}</h3>
                       <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-slate-400" /></button>
                   </div>
                   
                   <div className="p-6 overflow-y-auto space-y-4">
                        {/* Images Upload */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">تصاویر</label>
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {formData.images?.map((img, idx) => (
                                    <div key={idx} className="relative w-20 h-20 shrink-0">
                                        <img src={img} className="w-full h-full object-cover rounded-lg border border-slate-200" alt="" />
                                        <button onClick={() => handleRemoveImage(idx)} className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-full transform translate-x-1/2 -translate-y-1/2 shadow-sm"><X size={12}/></button>
                                    </div>
                                ))}
                                <div className="w-20 shrink-0">
                                    <ImageUploader 
                                        folder="events"
                                        onUpload={handleImageUpload}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">عنوان رویداد</label>
                            <input 
                              value={formData.title || ''}
                              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">تاریخ شمسی</label>
                                <input 
                                value={formData.date || ''}
                                onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 outline-none transition-all text-center"
                                placeholder="۱۴۰۳/۰۸/۰۱"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">تاریخ قمری</label>
                                <input 
                                value={formData.dateLunar || ''}
                                onChange={e => setFormData(prev => ({ ...prev, dateLunar: e.target.value }))}
                                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 outline-none transition-all text-center"
                                placeholder="۱۴۴۵/۰۴/۱۰"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">توضیحات</label>
                            <textarea 
                              value={formData.description || ''}
                              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 outline-none transition-all min-h-[100px]"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">نوع رویداد</label>
                                <select 
                                    value={formData.type}
                                    onChange={e => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 outline-none"
                                >
                                    <option value="milestone">نقطه عطف</option>
                                    <option value="equipment">تجهیزات</option>
                                    <option value="expansion">توسعه</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">وضعیت</label>
                                <select 
                                    value={formData.status}
                                    onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 outline-none"
                                >
                                    <option value="done">انجام شده</option>
                                    <option value="in_progress">در حال انجام</option>
                                    <option value="future">برنامه آتی</option>
                                </select>
                            </div>
                        </div>
                   </div>

                   <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-b-2xl flex gap-3">
                       <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors">انصراف</button>
                       <button onClick={handleSaveForm} className="flex-[2] py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2">
                           <Save size={18} />
                           <span>ذخیره تغییرات</span>
                       </button>
                   </div>
               </div>
           </div>
       )}
    </div>
  );
};

export default TimelineView;
