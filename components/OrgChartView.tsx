import React, { useState } from 'react';
import { ChevronDown, ChevronLeft, X, Briefcase, User, Shield, Stethoscope, Coins, GraduationCap, Building2, Star, Layers, Activity, Users, Wrench, FileText, Lock } from 'lucide-react';

// --- Types ---
interface OrgNode {
  id: string;
  title: string;
  level: 1 | 2 | 3 | 4 | 5 | 6; // سطح سازمانی
  holderName?: string;
  icon?: React.ReactNode;
  children?: OrgNode[];
  tasks?: string[];
}

// --- Data Structure (Based on your detailed list) ---
const ORG_DATA: OrgNode[] = [
  {
    id: 'board-trustees', title: 'هیات امناء', level: 1, holderName: 'تولیت و معتمدین', icon: <Star size={20}/>,
    children: [
      {
        id: 'board-directors', title: 'هیات مدیره', level: 2, holderName: 'اعضای منتخب', icon: <Users size={20}/>,
        children: [
          {
            id: 'ceo', title: 'مدیرعامل (ریاست)', level: 3, holderName: 'دکتر سید علیرضا عارف', icon: <Shield size={24}/>,
            children: [
              // --- واحدهای مستقیم زیر نظر مدیرعامل ---
              { id: 'office', title: 'مسئول دفتر', level: 5, children: [] },
              { id: 'social-work', title: 'مددکاری', level: 5, children: [] },
              { id: 'tech-officers', title: 'مسئولین فنی', level: 5, children: [] },
              { id: 'cultural', title: 'مسئول فرهنگی', level: 5, children: [] },

              // --- معاونت درمان ---
              {
                id: 'vp-treatment', title: 'معاونت درمان', level: 4, icon: <Stethoscope size={20}/>,
                children: [
                  {
                    id: 'mgr-clinic', title: 'مدیر درمانگاه', level: 5,
                    children: [
                      { id: 't-1', title: 'سوپروایزر', level: 6 },
                      { id: 't-2', title: 'سرپرست اطلاعات', level: 6 },
                      { id: 't-3', title: 'سرپرست پذیرش', level: 6 },
                      { id: 't-4', title: 'سرپرست منشی‌ها', level: 6 },
                      { id: 't-5', title: 'متصدی پذیرش', level: 6 },
                      { id: 't-6', title: 'منشی‌ها', level: 6 },
                      { id: 't-7', title: 'پرستاران', level: 6 },
                      { id: 't-8', title: 'بهیار - کمک بهیار', level: 6 },
                      { id: 't-9', title: 'خدمتگزار', level: 6 },
                    ]
                  },
                  {
                    id: 'mgr-dental', title: 'مدیر دندانپزشکی', level: 5,
                    children: [
                      { id: 'd-1', title: 'سوپروایزر', level: 6 },
                      { id: 'd-2', title: 'پذیرش دندانپزشکی', level: 6 },
                      { id: 'd-3', title: 'منشی', level: 6 },
                      { id: 'd-4', title: 'CSR', level: 6 },
                      { id: 'd-5', title: 'خدمتگزار', level: 6 },
                    ]
                  },
                  {
                    id: 'mgr-imaging', title: 'مدیر تصویربرداری', level: 5,
                    children: [
                      { id: 'i-1', title: 'سوپروایزر', level: 6 },
                      { id: 'i-2', title: 'اطلاعات', level: 6 },
                      { id: 'i-3', title: 'سرپرست پذیرش', level: 6 },
                      { id: 'i-4', title: 'سرپرست تایپ', level: 6 },
                      { id: 'i-5', title: 'کاردان و کارشناسان', level: 6 },
                      { id: 'i-6', title: 'متصدی پذیرش', level: 6 },
                      { id: 'i-7', title: 'منشی‌ها', level: 6 },
                      { id: 'i-8', title: 'اپراتور رایانه', level: 6 },
                      { id: 'i-9', title: 'بهیار', level: 6 },
                      { id: 'i-10', title: 'خدمتگزار', level: 6 },
                    ]
                  },
                  {
                    id: 'mgr-lab', title: 'مدیر آزمایشگاه', level: 5,
                    children: [
                      { id: 'l-1', title: 'سوپروایزر', level: 6 },
                      { id: 'l-2', title: 'پذیرش آزمایشگاه', level: 6 },
                      { id: 'l-3', title: 'کاردان و کارشناسان', level: 6 },
                      { id: 'l-4', title: 'تکنیسین آزمایشگاه', level: 6 },
                      { id: 'l-5', title: 'خدمتگزار آزمایشگاه', level: 6 },
                    ]
                  },
                  {
                    id: 'mgr-pharma', title: 'مدیر داروخانه', level: 5,
                    children: [
                      { id: 'p-1', title: 'سوپروایزر', level: 6 },
                      { id: 'p-2', title: 'پذیرش نسخ', level: 6 },
                      { id: 'p-3', title: 'نسخه پیچ', level: 6 },
                      { id: 'p-4', title: 'متصدی انبار دارویی', level: 6 },
                      { id: 'p-5', title: 'متصدی امور نسخ', level: 6 },
                      { id: 'p-6', title: 'خدمتگزار', level: 6 },
                    ]
                  },
                  {
                    id: 'mgr-physio', title: 'مدیر فیزیوتراپی', level: 5,
                    children: [
                      { id: 'ph-1', title: 'سوپروایزر', level: 6 },
                      { id: 'ph-2', title: 'کارشناسان', level: 6 },
                      { id: 'ph-3', title: 'پذیرش فیزیوتراپی', level: 6 },
                      { id: 'ph-4', title: 'منشی', level: 6 },
                      { id: 'ph-5', title: 'خدمتگزار', level: 6 },
                    ]
                  },
                  {
                    id: 'mgr-dayclinic', title: 'مدیر دی‌کلینیک', level: 5,
                    children: [
                      { id: 'dc-1', title: 'سوپروایزر', level: 6 },
                      { id: 'dc-2', title: 'پذیرش و ترخیص', level: 6 },
                      { id: 'dc-3', title: 'کاردان و کارشناس اتاق عمل', level: 6 },
                      { id: 'dc-4', title: 'کاردان و کارشناس بیهوشی', level: 6 },
                      { id: 'dc-5', title: 'پرستاران', level: 6 },
                      { id: 'dc-6', title: 'بهیاران - کمک بهیاران', level: 6 },
                      { id: 'dc-7', title: 'CSR', level: 6 },
                      { id: 'dc-8', title: 'خدمتگزار', level: 6 },
                    ]
                  },
                  {
                    id: 'mgr-health', title: 'مسئول بهداشت', level: 5,
                    children: [
                      { id: 'h-1', title: 'کارشناس بهداشت محیط', level: 6 },
                      { id: 'h-2', title: 'کارشناس بهداشت حرفه‌ای', level: 6 },
                      { id: 'h-3', title: 'خدمات پسماند', level: 6 },
                    ]
                  },
                  {
                    id: 'mgr-equip', title: 'مسئول تجهیزات پزشکی', level: 5,
                    children: [
                      { id: 'e-1', title: 'کارشناس', level: 6 },
                      { id: 'e-2', title: 'متصدی امور دفتری', level: 6 },
                    ]
                  },
                  {
                    id: 'mgr-records', title: 'مدیر آمار و مدارک پزشکی', level: 5,
                    children: [
                      { id: 'r-1', title: 'مسئول رسیدگی به نسخ', level: 6 },
                      { id: 'r-2', title: 'متصدی بررسی نسخ', level: 6 },
                    ]
                  },
                ]
              },

              // --- معاونت اداری و مالی ---
              {
                id: 'vp-admin', title: 'معاونت اداری و مالی', level: 4, icon: <Briefcase size={20}/>,
                children: [
                  {
                    id: 'mgr-admin', title: 'مدیر اداری', level: 5,
                    children: [
                      { id: 'a-1', title: 'مسئول کارگزینی', level: 6 },
                      { id: 'a-2', title: 'متصدی امور دفتری و بایگانی', level: 6 },
                    ]
                  },
                  {
                    id: 'mgr-finance', title: 'مدیر مالی', level: 5,
                    children: [
                      { id: 'f-1', title: 'مسئول درآمد و صندوق', level: 6 },
                      { id: 'f-2', title: 'کارشناس حسابداری', level: 6 },
                      { id: 'f-3', title: 'مسئول امور قراردادها', level: 6 },
                      { id: 'f-4', title: 'امین اموال', level: 6 },
                      { id: 'f-5', title: 'صندوقداران', level: 6 },
                      { id: 'f-6', title: 'متصدی امور مالی', level: 6 },
                    ]
                  },
                  {
                    id: 'mgr-support', title: 'مدیر پشتیبانی', level: 5,
                    children: [
                      { id: 's-1', title: 'مسئول انبار', level: 6 },
                      { id: 's-2', title: 'مسئول تدارکات', level: 6 },
                      { id: 's-3', title: 'مسئول خدمات', level: 6 },
                      { id: 's-4', title: 'تکنیسین تاسیسات', level: 6 },
                      { id: 's-5', title: 'تکنیسین برق', level: 6 },
                      { id: 's-6', title: 'اپراتور مخابرات', level: 6 },
                      { id: 's-7', title: 'راننده', level: 6 },
                      { id: 's-8', title: 'کارپرداز', level: 6 },
                      { id: 's-9', title: 'خدمتگذاران', level: 6 },
                      { id: 's-10', title: 'لاندری', level: 6 },
                    ]
                  },
                  {
                    id: 'mgr-it', title: 'مدیر فناوری اطلاعات', level: 5,
                    children: [
                      { id: 'it-1', title: 'کارشناس نرم‌افزار', level: 6 },
                      { id: 'it-2', title: 'کارشناس سخت افزار', level: 6 },
                      { id: 'it-3', title: 'کارشناس شبکه', level: 6 },
                      { id: 'it-4', title: 'کارشناس سایت - پرتال', level: 6 },
                    ]
                  },
                  {
                    id: 'mgr-security', title: 'مدیر حراست', level: 5,
                    children: [
                      { id: 'sec-1', title: 'انتظامات', level: 6 },
                    ]
                  },
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

// --- Components ---

const LevelBadge: React.FC<{ level: number }> = ({ level }) => {
    const colors = {
        1: 'bg-slate-800 text-white', // Trustee
        2: 'bg-slate-700 text-white', // Directors
        3: 'bg-primary-600 text-white', // CEO
        4: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300', // VP
        5: 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700', // Manager
        6: 'bg-slate-50 text-slate-500', // Staff
    };
    return null; // We use specific styling in the component instead of a badge
};

const Modal: React.FC<{ node: OrgNode; onClose: () => void }> = ({ node, onClose }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={onClose}></div>
            <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
                    <h3 className="font-black text-lg">{node.title}</h3>
                    <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-red-500" /></button>
                </div>
                <div className="p-6">
                    {node.holderName && (
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center text-primary-500">
                                <User size={28} />
                            </div>
                            <div>
                                <span className="text-xs text-slate-400 block">متصدی فعلی:</span>
                                <span className="font-bold text-lg text-slate-800 dark:text-white">{node.holderName}</span>
                            </div>
                        </div>
                    )}
                    <div className="space-y-4">
                        <button className="w-full py-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-right flex items-center justify-between transition-colors group">
                            <span className="font-bold text-sm text-slate-600 dark:text-slate-300 group-hover:text-primary-600">شرح وظایف</span>
                            <Briefcase size={16} className="text-slate-400" />
                        </button>
                        <button className="w-full py-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-right flex items-center justify-between transition-colors group">
                            <span className="font-bold text-sm text-slate-600 dark:text-slate-300 group-hover:text-primary-600">تاریخچه و متصدیان سابق</span>
                            <Activity size={16} className="text-slate-400" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Recursive Node Renderer ---
const OrgNodeRenderer: React.FC<{ node: OrgNode; isLast?: boolean }> = ({ node, isLast }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  // 1. Level 1, 2, 3: Top Tier Cards (Strategic)
  if (node.level <= 3) {
      const bgClass = node.level === 1 ? 'bg-slate-900 text-white' : 
                      node.level === 2 ? 'bg-slate-700 text-white' : 
                      'bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/20';
      
      return (
          <div className="flex flex-col items-center w-full mb-6 relative z-10">
              {/* Connecting Line Up (if not level 1) */}
              {node.level > 1 && <div className="h-6 w-px bg-slate-300 dark:bg-slate-700"></div>}
              
              <div 
                onClick={() => setShowModal(true)}
                className={`${bgClass} w-full max-w-md p-4 rounded-2xl flex items-center gap-4 cursor-pointer hover:scale-[1.02] transition-transform duration-200 relative overflow-hidden`}
              >
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      {node.icon || <User size={24} />}
                  </div>
                  <div className="flex-1">
                      <div className="text-xs opacity-70 mb-1 font-medium">سطح {node.level}</div>
                      <div className="font-black text-lg">{node.title}</div>
                      {node.holderName && <div className="text-sm opacity-90 mt-1">{node.holderName}</div>}
                  </div>
                  <div className="opacity-50"><Briefcase size={18}/></div>
              </div>

              {/* Children Container */}
              {hasChildren && (
                  <div className="w-full flex flex-col items-center relative">
                      <div className="h-6 w-px bg-slate-300 dark:bg-slate-700"></div>
                      <div className="w-full grid grid-cols-1 gap-4">
                          {node.children?.map(child => <OrgNodeRenderer key={child.id} node={child} />)}
                      </div>
                  </div>
              )}
              {showModal && <Modal node={node} onClose={() => setShowModal(false)} />}
          </div>
      );
  }

  // 2. Level 4: Vice Presidencies (Section Headers)
  if (node.level === 4) {
      return (
          <div className="mt-4 mb-2">
              <div 
                onClick={() => setShowModal(true)}
                className="flex items-center gap-3 p-4 bg-indigo-50 dark:bg-indigo-900/20 border-r-4 border-indigo-500 rounded-lg mb-4 cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
              >
                  <div className="text-indigo-600 dark:text-indigo-400">{node.icon || <Building2/>}</div>
                  <div className="font-black text-lg text-indigo-900 dark:text-indigo-100">{node.title}</div>
              </div>
              <div className="pr-4 border-r border-dashed border-indigo-200 dark:border-indigo-800 space-y-3">
                  {node.children?.map(child => <OrgNodeRenderer key={child.id} node={child} />)}
              </div>
              {showModal && <Modal node={node} onClose={() => setShowModal(false)} />}
          </div>
      );
  }

  // 3. Level 5: Managers (Expandable Cards)
  if (node.level === 5) {
      // Separate Level 6 children (Staff)
      const staffMembers = node.children || [];
      const hasStaff = staffMembers.length > 0;

      return (
          <div className="relative">
              <div 
                  className={`
                      group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 flex items-center justify-between cursor-pointer transition-all
                      ${isOpen ? 'ring-2 ring-primary-500/20 border-primary-500' : 'hover:border-primary-300'}
                  `}
                  onClick={() => {
                      if (hasStaff) setIsOpen(!isOpen);
                      else setShowModal(true);
                  }}
              >
                  <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${hasStaff ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>
                          {hasStaff ? <Users size={20} /> : <User size={20} />}
                      </div>
                      <div className="flex flex-col">
                          <span className="font-bold text-slate-800 dark:text-white text-sm">{node.title}</span>
                          {hasStaff && <span className="text-[10px] text-slate-400">{staffMembers.length} جایگاه زیرمجموعه</span>}
                      </div>
                  </div>

                  <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setShowModal(true); }}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400 transition-colors"
                        title="جزئیات"
                      >
                          <Briefcase size={16} />
                      </button>
                      {hasStaff && (
                          <div className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                              <ChevronDown size={18} />
                          </div>
                      )}
                  </div>
              </div>

              {/* Level 6: Staff Grid (Inside Level 5) */}
              {isOpen && hasStaff && (
                  <div className="mt-2 mr-4 pr-4 border-r border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-2 py-2 animate-in slide-in-from-top-2 duration-200">
                      {staffMembers.map((staff) => (
                          <div key={staff.id} className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800">
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{staff.title}</span>
                          </div>
                      ))}
                  </div>
              )}
              
              {showModal && <Modal node={node} onClose={() => setShowModal(false)} />}
          </div>
      );
  }

  return null;
};

// --- Main View ---
const OrgChartView: React.FC = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-[80vh] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 md:p-10">
        <div className="max-w-3xl mx-auto">
            {/* Render Root Node */}
            {ORG_DATA.map(node => <OrgNodeRenderer key={node.id} node={node} />)}
        </div>
    </div>
  );
};

export default OrgChartView;