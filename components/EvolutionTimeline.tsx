

import React, { useRef, useState } from 'react';
import { 
  Sprout, Hammer, Building2, Award, Cpu, Rocket, Zap, 
  X, Image as ImageIcon, GripHorizontal,
  History, Microscope, Stethoscope
} from 'lucide-react';

// --- Types ---
interface EvolutionEvent {
  id: string;
  year: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  colorFrom: string;
  colorTo: string;
  images?: string[];
}

// --- Data ---
const EVOLUTION_DATA: EvolutionEvent[] = [
  {
    id: 'e1',
    year: '۱۳۶۹',
    title: 'بارقه امید',
    subtitle: 'شکل‌گیری ایده اولیه',
    description: 'اندیشه تأسیس مرکزی جهت التیام دردهای مردم در زمینی که بوی ایثار می‌داد. جرقه‌ای که به شعله‌ای فروزان تبدیل شد.',
    icon: <Sprout size={24} className="text-white" />,
    colorFrom: 'from-emerald-500',
    colorTo: 'to-emerald-300',
    images: ['https://picsum.photos/seed/e1/600/400']
  },
  {
    id: 'e2',
    year: '۱۳۷۵',
    title: 'خشت اول',
    subtitle: 'آغاز عملیات عمرانی',
    description: 'کلنگ‌زنی پروژه عظیم دارالشفاء با همت خیرین و تلاش شبانه‌روزی برای برپایی ستون‌هایی که پناهگاه دردمندان باشد.',
    icon: <Hammer size={24} className="text-white" />,
    colorFrom: 'from-teal-500',
    colorTo: 'to-teal-300',
    images: ['https://picsum.photos/seed/e2/600/400']
  },
  {
    id: 'e3',
    year: '۱۳۸۳',
    title: 'تولد یک نماد',
    subtitle: 'افتتاح رسمی مجموعه',
    description: 'روشن شدن چراغ‌های دارالشفاء و پذیرش اولین بیماران. آغازی بر پایان سفرهای درمانی مردم منطقه به شهرهای دیگر.',
    icon: <Building2 size={24} className="text-white" />,
    colorFrom: 'from-cyan-500',
    colorTo: 'to-cyan-300',
    images: ['https://picsum.photos/seed/e3/600/400']
  },
  {
    id: 'e4',
    year: '۱۳۹۰',
    title: 'عصر تخصص',
    subtitle: 'توسعه دپارتمان‌ها',
    description: 'گذار به مرکز ریفرال تخصصی. جذب نخبگان پزشکی و راه‌اندازی بخش‌های فوق تخصصی قرنیه و شبکیه.',
    icon: <Award size={24} className="text-white" />,
    colorFrom: 'from-blue-500',
    colorTo: 'to-blue-300',
    images: ['https://picsum.photos/seed/e4/600/400']
  },
  {
    id: 'e5',
    year: '۱۳۹۸',
    title: 'تحول دیجیتال',
    subtitle: 'نوسازی و فناوری',
    description: 'ورود به عصر دیجیتال با تجهیز به دستگاه‌های لیزری پیشرفته، سیستم‌های تصویربرداری مدرن و پرونده الکترونیک سلامت.',
    icon: <Cpu size={24} className="text-white" />,
    colorFrom: 'from-indigo-500',
    colorTo: 'to-indigo-300',
    images: ['https://picsum.photos/seed/e5/600/400']
  },
  // Multiple Events for 1401
  {
    id: 'e1401-1',
    year: '۱۴۰۱',
    title: 'افتتاح فاز توسعه',
    subtitle: 'گسترش فضای فیزیکی',
    description: 'افزودن ۲۰۰۰ متر مربع به فضای درمانی و افتتاح بخش‌های جدید بستری.',
    icon: <Building2 size={24} className="text-white" />,
    colorFrom: 'from-violet-500',
    colorTo: 'to-violet-300',
    images: ['https://picsum.photos/seed/e1401a/600/400']
  },
  {
    id: 'e1401-2',
    year: '۱۴۰۱',
    title: 'تجهیز اتاق‌های عمل',
    subtitle: 'مدرن‌سازی جراحی',
    description: 'خرید و نصب جدیدترین دستگاه‌های فیکو و میکروسکوپ‌های جراحی زایس.',
    icon: <Microscope size={24} className="text-white" />,
    colorFrom: 'from-purple-500',
    colorTo: 'to-purple-300',
    images: ['https://picsum.photos/seed/e1401b/600/400']
  },
  {
    id: 'e1401-3',
    year: '۱۴۰۱',
    title: 'واحد تحقیقات',
    subtitle: 'توسعه علمی',
    description: 'راه‌اندازی واحد پژوهش و ثبت ۳ مقاله بین‌المللی توسط تیم پزشکی.',
    icon: <Stethoscope size={24} className="text-white" />,
    colorFrom: 'from-fuchsia-500',
    colorTo: 'to-fuchsia-300',
    images: ['https://picsum.photos/seed/e1401c/600/400']
  },
  {
    id: 'e6',
    year: '۱۴۰۲',
    title: 'اوج شکوفایی',
    subtitle: 'استانداردهای جهانی',
    description: 'دستیابی به رکوردهای بی‌نظیر در رضایت‌مندی بیماران و استقرار کامل استانداردهای اعتباربخشی ملی و بین‌المللی.',
    icon: <Zap size={24} className="text-white" />,
    colorFrom: 'from-pink-500',
    colorTo: 'to-pink-300',
    images: ['https://picsum.photos/seed/e6/600/400']
  },
  {
    id: 'e7',
    year: '۱۴۰۳',
    title: 'هوش مصنوعی',
    subtitle: 'تشخیص هوشمند',
    description: 'پیاده‌سازی الگوریتم‌های هوش مصنوعی برای غربالگری رتینوپاتی دیابتی.',
    icon: <Cpu size={24} className="text-white" />,
    colorFrom: 'from-rose-500',
    colorTo: 'to-rose-300',
    images: ['https://picsum.photos/seed/e7/600/400']
  },
  {
    id: 'e8',
    year: '۱۴۰۴',
    title: 'افق آینده',
    subtitle: 'قطب علمی منطقه',
    description: 'چشم‌انداز نهایی: تبدیل شدن به قطب علمی و درمانی برتر چشم‌پزشکی در سطح منطقه و خاورمیانه.',
    icon: <Rocket size={24} className="text-white" />,
    colorFrom: 'from-orange-500',
    colorTo: 'to-orange-300',
    images: ['https://picsum.photos/seed/e8/600/400']
  }
];

// Sort and Group Data
const groupEventsByYear = (events: EvolutionEvent[]) => {
  const grouped: Record<string, EvolutionEvent[]> = {};
  events.forEach(event => {
    if (!grouped[event.year]) grouped[event.year] = [];
    grouped[event.year].push(event);
  });
  // Sort years
  return Object.entries(grouped).sort((a, b) => a[0].localeCompare(b[0]));
};

const EventCard: React.FC<{ 
  event: EvolutionEvent; 
  position: 'up' | 'down';
  onSelect: (e: EvolutionEvent) => void; 
  isGrouped?: boolean;
}> = ({ event, position, onSelect, isGrouped }) => {
  
  const isUp = position === 'up';
  
  return (
    <div 
      className={`
        relative flex flex-col items-center justify-end w-48 md:w-60 group select-none transition-all duration-500
        ${isUp ? 'mb-10 md:mb-14 justify-end' : 'mt-10 md:mt-14 justify-start'}
      `}
      onClick={() => onSelect(event)}
    >
       {/* Connector Line to Center */}
       <div 
         className={`
            absolute left-1/2 -translate-x-1/2 w-0.5 bg-slate-600 group-hover:bg-slate-400 transition-colors -z-10
            ${isUp ? '-bottom-10 md:-bottom-14 h-10 md:h-14' : '-top-10 md:-top-14 h-10 md:h-14'}
         `}
       ></div>

       {/* Card Box */}
       <div className={`
           bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl overflow-hidden shadow-lg 
           group-hover:shadow-2xl group-hover:border-slate-500 transition-all transform group-hover:scale-105 duration-300 cursor-pointer
           w-full
       `}>
           {/* Image - Reduced Height */}
           <div className="h-16 md:h-20 w-full relative overflow-hidden">
               <div className={`absolute inset-0 bg-gradient-to-br ${event.colorFrom} ${event.colorTo} opacity-20 mix-blend-overlay z-10`}></div>
               {event.images?.[0] ? (
                   <img src={event.images[0]} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 grayscale group-hover:grayscale-0" alt="" />
               ) : (
                   <div className="w-full h-full bg-slate-800"></div>
               )}
               <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur rounded-lg p-1 text-white shadow-sm z-20">
                   {React.cloneElement(event.icon as React.ReactElement<any>, { size: 12 })}
               </div>
           </div>
           
           {/* Text */}
           <div className="p-3 text-right border-t border-slate-700/50">
               <h3 className="font-bold text-white text-sm truncate mb-0.5">{event.title}</h3>
               <p className={`text-[10px] font-bold truncate bg-clip-text text-transparent bg-gradient-to-r ${event.colorFrom} ${event.colorTo}`}>
                 {event.subtitle}
               </p>
           </div>
       </div>
    </div>
  );
};

const YearGroup: React.FC<{ 
  year: string; 
  events: EvolutionEvent[]; 
  index: number; 
  onSelect: (e: EvolutionEvent) => void 
}> = ({ year, events, index, onSelect }) => {
  
  const isEvenGroup = index % 2 === 0;
  const hasMultiple = events.length > 1;

  return (
    <div className="relative flex flex-col items-center justify-center mx-4 min-w-max h-full snap-center">
       
       {/* Central Year Bubble */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center justify-center group">
           <div className={`
             w-12 h-12 md:w-14 md:h-14 rounded-full border-[3px] border-slate-800 bg-slate-900 flex items-center justify-center
             shadow-[0_0_20px_rgba(0,0,0,0.6)] transition-all duration-300 hover:scale-110 hover:border-white
             relative z-20 cursor-default
           `}>
               <span className={`text-xs md:text-sm font-black font-mono tracking-wider text-white`}>{year}</span>
               {hasMultiple && (
                   <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center border-2 border-slate-900 text-xs font-bold text-white shadow-lg z-30 animate-pulse" title={`${events.length} رویداد`}>
                       {events.length}
                   </div>
               )}
           </div>
           {/* Glow */}
           <div className={`absolute inset-0 bg-white/5 rounded-full animate-pulse -z-10 blur-md`}></div>
       </div>

       {/* Cards Container */}
       <div className="flex flex-row items-center gap-4 md:gap-6 h-full pt-20 pb-20">
           {events.map((event, i) => {
               // Distribute events Alternating
               const pos = hasMultiple 
                  ? (i % 2 === 0 ? 'up' : 'down') 
                  : (isEvenGroup ? 'up' : 'down'); 

               return (
                  <div key={event.id} className={`flex flex-col h-full ${pos === 'up' ? 'justify-start' : 'justify-end'}`}>
                       <EventCard 
                          event={event} 
                          position={pos} 
                          onSelect={onSelect}
                          isGrouped={hasMultiple}
                       />
                  </div>
               );
           })}
       </div>

    </div>
  );
};

const EventModal: React.FC<{ event: EvolutionEvent | null; onClose: () => void }> = ({ event, onClose }) => {
    if (!event) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-8">
            <div 
                className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            ></div>

            <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl max-h-[85vh] rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                
                <button 
                    onClick={onClose}
                    className="absolute top-4 left-4 z-30 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="md:w-2/5 relative h-48 md:h-auto">
                    <div className={`absolute inset-0 bg-gradient-to-br ${event.colorFrom} ${event.colorTo} opacity-30 mix-blend-multiply z-10`}></div>
                     {event.images?.[0] && (
                        <img 
                        src={event.images[0]} 
                        alt={event.title} 
                        className="w-full h-full object-cover" 
                        />
                     )}
                     <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-900 to-transparent md:hidden z-20"></div>
                </div>

                <div className="md:w-3/5 p-6 md:p-10 flex flex-col overflow-y-auto text-right relative">
                    <div className={`absolute top-0 right-0 w-full h-1 bg-gradient-to-r ${event.colorFrom} ${event.colorTo}`}></div>
                    
                    <div className="flex items-center gap-3 mb-4">
                        <span className={`px-3 py-1 rounded-lg text-lg font-black text-white bg-gradient-to-r ${event.colorFrom} ${event.colorTo} shadow-lg font-mono`}>
                            {event.year}
                        </span>
                        <div className="p-1.5 bg-slate-800 rounded-lg text-slate-300 border border-slate-700">
                            {event.icon}
                        </div>
                    </div>

                    <h2 className="text-2xl font-black text-white mb-1">{event.title}</h2>
                    <h3 className={`text-sm font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r ${event.colorFrom} ${event.colorTo}`}>
                        {event.subtitle}
                    </h3>

                    <p className="text-slate-300 leading-loose text-sm mb-6 text-justify border-r-2 border-slate-700 pr-3">
                        {event.description}
                    </p>
                    
                    <div className="mt-auto pt-4 border-t border-slate-800">
                         <div className="flex items-center gap-2 text-slate-500 text-xs mb-2">
                             <ImageIcon size={14} />
                             <span>گالری تصاویر</span>
                         </div>
                         <div className="flex gap-2">
                             {event.images?.map((img, i) => (
                                 <div key={i} className="w-16 h-12 rounded-lg overflow-hidden border border-slate-700 cursor-pointer hover:border-slate-400 transition-colors">
                                     <img src={img} className="w-full h-full object-cover" alt="" />
                                 </div>
                             ))}
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const EvolutionTimeline: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedEvent, setSelectedEvent] = useState<EvolutionEvent | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const groupedData = groupEventsByYear(EVOLUTION_DATA);

  // Mouse Drag Handlers for Desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="relative h-screen bg-slate-950 overflow-hidden flex flex-col font-[Vazirmatn]">
         
         {/* Background */}
         <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
            <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-slate-950 to-transparent"></div>
            <div className="absolute top-0 w-full h-1/3 bg-gradient-to-b from-slate-950 to-transparent"></div>
         </div>

         {/* Header (Fixed) */}
         <div className="absolute top-0 left-0 w-full z-40 p-6 flex justify-between items-start pointer-events-none">
             <div>
                 <h1 className="text-3xl md:text-4xl font-black text-white drop-shadow-lg mb-1">مسیر تکامل</h1>
                 <div className="text-slate-400 text-sm font-bold flex items-center gap-2">
                    <History size={14} />
                    <span>روایت رشد و بالندگی از ۱۳۶۹ تا ۱۴۰۴</span>
                 </div>
             </div>
             
             <div className="bg-white/5 backdrop-blur px-4 py-2 rounded-full border border-white/10 text-slate-400 text-xs font-bold flex items-center gap-2 animate-pulse">
                 <GripHorizontal size={16} />
                 <span>بکشید یا اسکرول کنید</span>
             </div>
         </div>

         {/* Timeline Container */}
         <div 
            ref={scrollContainerRef}
            className={`
                flex-1 w-full overflow-x-auto overflow-y-hidden flex items-center custom-scrollbar
                ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
            `}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
         >
             {/* Inner Track */}
             <div className="relative flex items-center px-[10vw] md:px-[20vw] min-w-max h-full">
                
                {/* The Continuous Line */}
                <div className="absolute top-1/2 left-0 w-full h-1.5 bg-slate-800 rounded-full -z-20"></div>
                <div className="absolute top-1/2 left-0 w-full h-[3px] bg-gradient-to-r from-slate-800 via-primary-900 to-slate-800 -z-10 shadow-[0_0_15px_rgba(16,185,129,0.3)]"></div>
                <div className="absolute top-1/2 left-0 w-full h-px bg-white/10 -z-10 blur-[1px]"></div>

                {/* Start Marker */}
                <div className="mx-12 flex flex-col items-center opacity-50">
                    <div className="w-4 h-4 bg-slate-700 rounded-full mb-2 border-2 border-slate-600"></div>
                    <span className="text-xs text-slate-500 font-mono font-bold">START</span>
                </div>

                {/* Year Groups */}
                {groupedData.map(([year, events], idx) => (
                    <YearGroup 
                        key={year} 
                        year={year} 
                        events={events}
                        index={idx}
                        onSelect={(e) => !isDragging && setSelectedEvent(e)}
                    />
                ))}

                {/* Future Marker */}
                <div className="mx-12 flex flex-col items-center opacity-50">
                     <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-slate-700 border-b-[8px] border-b-transparent ml-1"></div>
                    <span className="text-xs text-slate-500 mt-2 font-mono font-bold">FUTURE</span>
                </div>

             </div>
         </div>

         {/* Footer Decoration */}
         <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-blue-500 to-rose-500 shadow-[0_-4px_20px_rgba(59,130,246,0.5)]"></div>

         <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />

    </div>
  );
};

export default EvolutionTimeline;
