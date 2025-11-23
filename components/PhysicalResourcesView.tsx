
import React, { useState, useRef, useEffect } from 'react';
import { Package, ChevronDown, ChevronUp, Check, Image as ImageIcon, Info, FileText, X, Download, Filter, AlertCircle, ShoppingCart, Archive, Plus, Edit2, Trash2, Save } from 'lucide-react';
import ImageUploader from './ImageUploader';

// --- Types ---
interface EquipmentItem {
  id: string;
  nameFa: string;
  nameEn: string;
  category: string;
  year: string;
  description: string;
  status: 'active' | 'retired' | 'planned'; 
  images: string[];
  docs: string[];
}

// --- Mock Data ---
const EQUIPMENTS: EquipmentItem[] = [
  { 
    id: 'future-1', 
    nameFa: 'دستگاه فمتوسکند لیزر جدید', 
    nameEn: 'Femtosecond Laser (Next Gen)', 
    category: 'لیزر درمانی', 
    year: '۱۴۰۴ (پیش‌بینی)', 
    description: 'برنامه خرید جهت جایگزینی سیستم‌های قدیمی و افزایش دقت عمل‌های رفراکتیو.', 
    status: 'planned',
    images: [], 
    docs: [] 
  },
  { 
    id: '1', 
    nameFa: 'میکروسکوپ جراحی چشم', 
    nameEn: 'Ophthalmic Surgical Microscope', 
    category: 'تجهیزات جراحی', 
    year: '۱۳۹۳', 
    description: 'زیرساخت اصلی برای آغاز عمل‌های جراحی.', 
    status: 'active',
    images: ['https://picsum.photos/seed/microscope/600/400'], 
    docs: ['کاتالوگ فنی.pdf', 'قرارداد خرید.pdf'] 
  },
  { 
    id: '2', 
    nameFa: 'دستگاه OCT', 
    nameEn: 'Optical Coherence Tomography', 
    category: 'تصویربرداری تشخیصی', 
    year: '۱۳۹۳', 
    description: 'تصویربرداری پیشرفته شبکیه و عصب بینایی.', 
    status: 'active',
    images: ['https://picsum.photos/seed/oct/600/400'], 
    docs: ['راهنمای کاربری.pdf'] 
  },
  { 
    id: '3', 
    nameFa: 'دستگاه A/B اسکن', 
    nameEn: 'A/B-Scan Ultrasound', 
    category: 'تصویربرداری تشخیصی', 
    year: '۱۳۹۳', 
    description: 'سونوگرافی چشم برای اندازه‌گیری و تشخیص.', 
    status: 'active',
    images: ['https://picsum.photos/seed/abscan/600/400'], 
    docs: [] 
  },
  { 
    id: '4', 
    nameFa: 'دستگاه VISUCAM', 
    nameEn: 'Fundus Camera with Angiography', 
    category: 'تصویربرداری تشخیصی', 
    year: '۱۳۹۳', 
    description: 'آنژیوگرافی دیجیتال چشم.', 
    status: 'active',
    images: ['https://picsum.photos/seed/visucam/600/400'], 
    docs: ['مجوز بهداشت.pdf'] 
  },
  { 
    id: '5', 
    nameFa: 'دستگاه پریمتری (مدل قدیمی)', 
    nameEn: 'Perimetry (Legacy)', 
    category: 'ارزیابی عملکردی', 
    year: '۱۳۸۵', 
    description: 'ارزیابی میدان بینایی (با مدل جدیدتر جایگزین شده است).', 
    status: 'retired',
    images: ['https://picsum.photos/seed/perimetry/600/400'], 
    docs: [] 
  },
  { 
    id: '6', 
    nameFa: 'دستگاه IOL Master', 
    nameEn: 'IOL Master', 
    category: 'ارزیابی عملکردی', 
    year: '۱۳۹۳', 
    description: 'محاسبات دقیق لنز داخل چشمی.', 
    status: 'active',
    images: ['https://picsum.photos/seed/iolmaster/600/400'], 
    docs: ['سند کالیبراسیون.pdf'] 
  },
  { 
    id: '7', 
    nameFa: 'دستگاه لیزر یاگ', 
    nameEn: 'YAG Laser', 
    category: 'لیزر درمانی', 
    year: '۱۳۹۳', 
    description: 'لیزر کپسولوتومی و ایریدوتومی.', 
    status: 'active',
    images: ['https://picsum.photos/seed/yag/600/400'], 
    docs: [] 
  },
  { 
    id: '8', 
    nameFa: 'دستگاه اسلیت لمپ', 
    nameEn: 'Slit Lamp', 
    category: 'تجهیزات معاینه', 
    year: '۱۳۹۳', 
    description: 'میکروسکوپ معاینه چشم.', 
    status: 'active',
    images: ['https://picsum.photos/seed/slitlamp/600/400'], 
    docs: [] 
  },
];

const CATEGORIES = Array.from(new Set(EQUIPMENTS.map(i => i.category)));

interface PhysicalResourcesViewProps {
  embedded?: boolean;
  isFilterOpen?: boolean;
  onFilterClose?: () => void;
  isEditing?: boolean;
}

// Internal MultiSelect Dropdown
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
            ${inline ? 'w-full' : 'min-w-[160px]'}
            `}
        >
          <span className="truncate">
            {selectedValues.length === 0 
              ? title 
              : selectedValues.length === options.length 
                ? `همه` 
                : `${title} (${selectedValues.length})`}
          </span>
          <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
  
        {isOpen && (
          <div className={`
             z-50 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200
             ${inline 
                ? 'relative w-full mt-2 border border-slate-200 dark:border-slate-700 rounded-xl shadow-none bg-slate-50 dark:bg-slate-900/50' 
                : 'absolute top-full mt-2 right-0 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl max-h-64'}
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

const ExpandableResourceCard: React.FC<{ 
    item: EquipmentItem, 
    isExpanded: boolean, 
    onToggle: () => void,
    onShowImages: (imgs: string[]) => void,
    isEditing: boolean,
    onEdit: (item: EquipmentItem) => void,
    onDelete: (id: string) => void
}> = ({ item, isExpanded, onToggle, onShowImages, isEditing, onEdit, onDelete }) => {
    
    const getStatusBadge = () => {
        switch(item.status) {
            case 'active': return (
                <span className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-800 shrink-0">
                    <Check size={10} strokeWidth={3} />
                    فعال
                </span>
            );
            case 'retired': return (
                <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 shrink-0">
                    <Archive size={10} />
                    خارج از رده
                </span>
            );
            case 'planned': return (
                <span className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-800 shrink-0">
                    <ShoppingCart size={10} />
                    برنامه خرید
                </span>
            );
        }
    };

    return (
        <div className={`
            border rounded-xl shadow-sm transition-all overflow-hidden relative
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
                 <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 overflow-hidden">
                     <div className="flex items-center gap-2">
                        <h3 className={`font-bold text-sm sm:text-base transition-colors truncate ${isExpanded ? 'text-primary-900 dark:text-primary-100' : 'text-slate-800 dark:text-slate-100'}`}>
                            {item.nameFa}
                        </h3>
                        {getStatusBadge()}
                     </div>
                     <span className="hidden sm:inline-block text-slate-300 dark:text-slate-600">•</span>
                     <span className="bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-[10px] px-2 py-0.5 rounded-md font-bold shrink-0 self-start sm:self-center border border-slate-200 dark:border-slate-600">{item.category}</span>
                 </div>
                 
                 <div className={`p-1 rounded-full transition-colors shrink-0 ${isExpanded ? 'bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400' : 'bg-slate-100 dark:bg-slate-700'}`}>
                     {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} className="text-slate-500" />}
                 </div>
            </div>
    
            {isExpanded && (
                <div className="border-t border-primary-200 dark:border-primary-800/50 bg-white/50 dark:bg-black/20 p-5 animate-in slide-in-from-top-2 duration-200">
                     <div className="flex flex-col gap-4">
                         <div>
                             <div className="flex items-center gap-2 mb-2">
                                 <span className="text-xs text-slate-400">نام انگلیسی:</span>
                                 <span className="text-xs font-mono text-slate-600 dark:text-slate-300" dir="ltr">{item.nameEn}</span>
                             </div>
                             <div className="flex items-center gap-2 mb-3">
                                 <span className="text-xs text-slate-400">سال بهره‌برداری:</span>
                                 <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-200">{item.year}</span>
                             </div>
                             <p className="text-sm text-slate-700 dark:text-slate-300 leading-7 bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                                 <span className="text-primary-600 dark:text-primary-400 font-bold ml-1">توضیحات:</span>
                                 {item.description}
                             </p>
                         </div>
                         
                         <div className="flex items-center gap-3 border-t border-slate-200 dark:border-slate-700 pt-4 mt-2">
                             {item.images.length > 0 && (
                                 <button 
                                   onClick={(e) => { e.stopPropagation(); onShowImages(item.images); }}
                                   className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-bold transition-colors"
                                 >
                                     <ImageIcon size={14} />
                                     <span>مشاهده تصاویر</span>
                                 </button>
                             )}
                             {item.docs.length > 0 && (
                                 <div className="flex items-center gap-2">
                                     {item.docs.map((doc, i) => (
                                         <a key={i} href="#" className="flex items-center gap-1 px-3 py-2 bg-white dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-orange-900/20 text-slate-600 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-bold transition-colors">
                                             <FileText size={14} />
                                             <span className="truncate max-w-[100px]">{doc}</span>
                                             <Download size={12} />
                                         </a>
                                     ))}
                                 </div>
                             )}
                         </div>
                     </div>
                </div>
            )}
        </div>
    );
};

const PhysicalResourcesView: React.FC<PhysicalResourcesViewProps> = ({ embedded = false, isFilterOpen, onFilterClose, isEditing = false }) => {
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);

  // Load Data
  useEffect(() => {
    const saved = localStorage.getItem('equipment_data');
    if (saved) {
        setEquipment(JSON.parse(saved));
    } else {
        setEquipment(EQUIPMENTS);
    }
  }, []);

  // Save Data
  useEffect(() => {
    localStorage.setItem('equipment_data', JSON.stringify(equipment));
  }, [equipment]);


  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [activeImage, setActiveImage] = useState<string[] | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [internalFilterOpen, setInternalFilterOpen] = useState(false);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EquipmentItem | null>(null);
  const [formData, setFormData] = useState<Partial<EquipmentItem>>({});

  // Derive visibility control from props if embedded, otherwise use local state
  const isFilterVisible = embedded ? !!isFilterOpen : internalFilterOpen;
  const closeFilter = embedded ? (onFilterClose || (() => {})) : () => setInternalFilterOpen(false);

  const statusOptions = [
    { label: 'فعال', value: 'active' },
    { label: 'خارج از رده', value: 'retired' },
    { label: 'برنامه خرید', value: 'planned' },
  ];

  const filteredData = equipment.filter(item => {
     const catMatch = selectedCategories.length === 0 || selectedCategories.includes(item.category);
     const statusMatch = selectedStatuses.length === 0 || selectedStatuses.includes(item.status);
     return catMatch && statusMatch;
  });

  const handleToggle = (id: string) => {
      setExpandedId(prev => prev === id ? null : id);
  };

  // CRUD
  const handleAddClick = () => {
    setEditingItem(null);
    setFormData({
        nameFa: '', nameEn: '', category: '', year: '', description: '', status: 'active', images: []
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (item: EquipmentItem) => {
      setEditingItem(item);
      setFormData({ ...item });
      setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
      if(window.confirm('آیا از حذف این مورد اطمینان دارید؟')) {
          setEquipment(prev => prev.filter(i => i.id !== id));
      }
  };

  const handleSaveForm = () => {
      if (!formData.nameFa) return alert('نام تجهیزات الزامی است');
      
      if (editingItem) {
          setEquipment(prev => prev.map(i => i.id === editingItem.id ? { ...i, ...formData } as EquipmentItem : i));
      } else {
          const newId = `eq-${Date.now()}`;
          const newItem = { ...formData, id: newId, docs: [] } as EquipmentItem;
          setEquipment(prev => [newItem, ...prev]);
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
    <div className={`${embedded ? 'bg-transparent' : 'bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm'} min-h-[50vh]`}>
       
       {/* Header & Filters */}
       <div className={`${embedded ? 'p-0 pb-6' : 'p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 rounded-t-2xl'}`}>
         
         {/* Toolbar */}
         <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm relative">
             <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-primary-500 rounded-r-2xl"></div>

             <div className="text-slate-500 dark:text-slate-400 text-sm px-4">
                {filteredData.length} مورد یافت شد
             </div>
             
             <div className="flex items-center gap-2">
                 {isEditing && (
                     <button 
                         onClick={handleAddClick}
                         className="flex items-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-sm transition-all shadow-sm"
                     >
                         <Plus size={18} />
                         <span>افزودن تجهیز</span>
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
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-3 block">وضعیت</label>
                    <MultiSelectDropdown 
                        title="انتخاب وضعیت"
                        options={statusOptions}
                        selectedValues={selectedStatuses}
                        onChange={setSelectedStatuses}
                        inline={true}
                    />
                 </div>

                 <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-3 block">دسته‌بندی</label>
                    <MultiSelectDropdown 
                        title="انتخاب دسته"
                        options={CATEGORIES.map(c => ({ label: c, value: c }))}
                        selectedValues={selectedCategories}
                        onChange={setSelectedCategories}
                        inline={true}
                    />
                 </div>
             </div>

             <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <div className="flex gap-3">
                   {(selectedCategories.length > 0 || selectedStatuses.length > 0) && (
                      <button 
                          onClick={() => { setSelectedCategories([]); setSelectedStatuses([]); }}
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

       {/* Content List (Accordion) */}
       <div className={`${embedded ? 'p-0' : 'p-6'}`}>
          {filteredData.length === 0 ? (
              <div className="text-center text-slate-400 py-16 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">موردی یافت نشد.</div>
          ) : (
              <div className="space-y-3">
                  {filteredData.map(item => (
                      <ExpandableResourceCard 
                          key={item.id} 
                          item={item}
                          isExpanded={expandedId === item.id}
                          onToggle={() => handleToggle(item.id)}
                          onShowImages={setActiveImage}
                          isEditing={isEditing}
                          onEdit={handleEditClick}
                          onDelete={handleDeleteClick}
                      />
                  ))}
              </div>
          )}
       </div>

       {/* Modal: Image Gallery */}
       {activeImage && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setActiveImage(null)}>
             <button className="absolute top-6 left-6 text-white/70 hover:text-white p-2 bg-white/10 rounded-full transition-colors"><X size={24} /></button>
             <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="grid grid-cols-1 gap-6">
                    {activeImage.map((src, idx) => (
                        <img key={idx} src={src} alt="Equipment" className="w-full h-auto rounded-xl shadow-2xl ring-1 ring-white/10" />
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
                       <h3 className="font-bold text-lg">{editingItem ? 'ویرایش تجهیزات' : 'افزودن تجهیزات جدید'}</h3>
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
                                        folder="equipment"
                                        onUpload={handleImageUpload}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">نام فارسی</label>
                            <input 
                              value={formData.nameFa || ''}
                              onChange={e => setFormData(prev => ({ ...prev, nameFa: e.target.value }))}
                              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">نام انگلیسی</label>
                            <input 
                              value={formData.nameEn || ''}
                              onChange={e => setFormData(prev => ({ ...prev, nameEn: e.target.value }))}
                              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 outline-none transition-all dir-ltr"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">دسته‌بندی</label>
                                <input 
                                value={formData.category || ''}
                                onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                placeholder="مثال: لیزر درمانی"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">سال بهره‌برداری</label>
                                <input 
                                value={formData.year || ''}
                                onChange={e => setFormData(prev => ({ ...prev, year: e.target.value }))}
                                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 outline-none transition-all text-center"
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
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">وضعیت</label>
                            <div className="flex bg-slate-50 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
                                {['active', 'retired', 'planned'].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setFormData(prev => ({ ...prev, status: s as any }))}
                                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${formData.status === s ? 'bg-white dark:bg-slate-700 shadow text-primary-600 dark:text-primary-400' : 'text-slate-500 dark:text-slate-400'}`}
                                    >
                                        {s === 'active' ? 'فعال' : s === 'retired' ? 'خارج از رده' : 'برنامه خرید'}
                                    </button>
                                ))}
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

export default PhysicalResourcesView;
