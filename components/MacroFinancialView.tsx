
import React, { useState } from 'react';
import { 
  FileText, Download, ShieldCheck, PieChart, TrendingUp, AlertCircle, 
  CheckCircle, Calculator, X, Check, ChevronDown, ArrowRight, Briefcase, 
  HeartHandshake, DollarSign, Activity, BarChart3, LineChart as LineChartIcon, 
  ArrowUpRight, Users, MapPin, AlertTriangle, Clock
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, Cell 
} from 'recharts';
import { AuditLog, BudgetRecord, CSRRecord } from '../types';
import { AUDIT_DATA, BUDGET_DATA, CSR_DATA, PERFORMANCE_DATA, PERFORMANCE_TREND_DATA, REVENUE_COMPOSITION_DATA } from '../data/financialData';
import FinancialDashboardLayout, { FinancialTab } from './FinancialDashboardLayout';

// --- Helper Components ---

const StatusBadge: React.FC<{ status: string; text: string; type?: 'audit' | 'budget' | 'csr' }> = ({ status, text, type = 'audit' }) => {
  if (type === 'audit') {
    switch (status) {
      case 'Unqualified': return <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"><CheckCircle size={12} /> مقبول (Clean)</span>;
      case 'Qualified': return <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800"><AlertCircle size={12} /> مشروط</span>;
      case 'Adverse': return <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"><X size={12} /> مردود</span>;
      case 'Pending': return <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"><Clock size={12} /> در جریان</span>;
      case 'Resolved': return <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800"><Check size={12} /> رفع شده</span>;
      default: return <span className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-500">{text}</span>;
    }
  }
  if (type === 'budget') {
      const variance = parseFloat(status);
      if (Math.abs(variance) < 1) return <span className="text-xs font-bold text-slate-500">مطابق بودجه</span>;
      if (variance > 0) return <span className="text-xs font-bold text-rose-500 flex items-center gap-0.5"><TrendingUp size={12} /> {variance}% انحراف</span>;
      return <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5"><Check size={12} /> {Math.abs(variance)}% صرفه‌جویی</span>;
  }
  return <span className="text-xs">{text}</span>;
};

const formatCurrency = (amount: number) => new Intl.NumberFormat('fa-IR').format(amount);
const formatMillions = (amount: number) => new Intl.NumberFormat('fa-IR').format(Math.round(amount / 1000000));

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl text-xs">
        <p className="font-bold text-slate-700 dark:text-slate-200 mb-2">{label}</p>
        {payload.map((p: any, idx: number) => (
          <p key={idx} className="flex items-center gap-2 mb-1" style={{ color: p.color }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}></span>
            <span>{p.name}:</span>
            <span className="font-mono font-bold">{new Intl.NumberFormat('fa-IR').format(p.value)}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const MacroFinancialView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FinancialTab>('overview');
  const [expandedAuditId, setExpandedAuditId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>('variance');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Budget Sorting
  const sortedBudget = [...BUDGET_DATA].sort((a, b) => {
      if (sortField === 'variance') return sortDirection === 'asc' ? a.variancePercent - b.variancePercent : b.variancePercent - a.variancePercent;
      if (sortField === 'amount') return sortDirection === 'asc' ? a.approvedAmount - b.approvedAmount : b.approvedAmount - a.approvedAmount;
      return 0;
  });

  return (
    <FinancialDashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
        
        {/* --- TAB 1: BUDGET VIEW --- */}
        {activeTab === 'budget' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-6 flex items-center gap-2">
                            <BarChart3 size={18} className="text-primary-500" />
                            <span>مقایسه بودجه مصوب و عملکرد (میلیارد ریال)</span>
                        </h3>
                        <div className="h-72 w-full">
                             <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={BUDGET_DATA.map(i => ({
                                    name: i.costCenter.split(' ')[0] + '...', // Truncate
                                    full: i.costCenter,
                                    approved: i.approvedAmount / 1000000000,
                                    actual: i.actualAmount / 1000000000
                                }))} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" tick={{fontSize: 10, fill: '#94a3b8'}} />
                                    <YAxis tick={{fontSize: 10, fill: '#94a3b8'}} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend wrapperStyle={{fontSize: '12px', paddingTop: '10px'}} />
                                    <Bar name="بودجه مصوب" dataKey="approved" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={20} />
                                    <Bar name="عملکرد واقعی" dataKey="actual" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                                </BarChart>
                             </ResponsiveContainer>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-center">
                         <div className="text-center mb-6">
                             <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wide mb-2">مجموع انحراف بودجه</h3>
                             <div className="text-4xl font-black text-rose-500 dir-ltr font-mono flex justify-center items-center gap-2">
                                 <TrendingUp size={32} />
                                 <span>+4.2%</span>
                             </div>
                             <p className="text-xs text-slate-400 mt-2">وضعیت کلی: هشدار مدیریت هزینه</p>
                         </div>
                         <div className="space-y-3">
                             <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 border-b border-slate-100 dark:border-slate-700 pb-2">
                                 <span>بودجه عمرانی</span>
                                 <span className="font-bold text-emerald-600">۹۸٪ جذب</span>
                             </div>
                             <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 border-b border-slate-100 dark:border-slate-700 pb-2">
                                 <span>بودجه جاری</span>
                                 <span className="font-bold text-rose-500">۱۰۵٪ مصرف</span>
                             </div>
                             <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 pb-2">
                                 <span>تعداد مراکز هزینه</span>
                                 <span className="font-bold">۶ مرکز</span>
                             </div>
                         </div>
                    </div>
                </div>

                {/* Data Grid */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                           <FileText size={18} className="text-slate-400" />
                           ریز اقلام بودجه
                        </h3>
                        <div className="flex gap-2">
                            <button onClick={() => { setSortField('variance'); setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc'); }} className="text-xs flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:border-primary-400 transition-colors">
                                <ArrowUpRight size={14} className={sortField === 'variance' && sortDirection === 'desc' ? 'rotate-180 transition-transform' : 'transition-transform'} />
                                مرتب‌سازی: انحراف
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-right">
                            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="p-4 font-bold text-slate-600 dark:text-slate-300">مرکز هزینه</th>
                                    <th className="p-4 font-bold text-slate-600 dark:text-slate-300">نوع</th>
                                    <th className="p-4 font-bold text-slate-600 dark:text-slate-300 font-mono">مصوب (ریال)</th>
                                    <th className="p-4 font-bold text-slate-600 dark:text-slate-300 font-mono">عملکرد (ریال)</th>
                                    <th className="p-4 font-bold text-slate-600 dark:text-slate-300 text-center">وضعیت</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedBudget.map((item) => (
                                    <tr key={item.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-slate-800 dark:text-white">{item.costCenter}</div>
                                            <div className="text-xs text-slate-400 mt-0.5">{item.description}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`text-[10px] px-2 py-0.5 rounded border ${item.category === 'Capital' ? 'bg-purple-50 border-purple-100 text-purple-600 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-300' : 'bg-slate-100 border-slate-200 text-slate-500 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-400'}`}>
                                                {item.category === 'Capital' ? 'عمرانی' : 'جاری'}
                                            </span>
                                        </td>
                                        <td className="p-4 font-mono text-slate-600 dark:text-slate-300">{formatCurrency(item.approvedAmount)}</td>
                                        <td className="p-4 font-mono text-slate-600 dark:text-slate-300">{formatCurrency(item.actualAmount)}</td>
                                        <td className="p-4 text-center">
                                            <StatusBadge status={item.variancePercent.toString()} text="" type="budget" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}

        {/* --- TAB 2: PERFORMANCE VIEW --- */}
        {activeTab === 'performance' && (
             <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
                
                {/* Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-bold">حاشیه سود عملیاتی</p>
                            <h3 className="text-2xl font-black text-slate-800 dark:text-white font-mono">18.0%</h3>
                        </div>
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
                            <Activity size={24} />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-bold">نسبت جاری (Current Ratio)</p>
                            <h3 className="text-2xl font-black text-slate-800 dark:text-white font-mono">1.45</h3>
                        </div>
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-bold">نرخ بازده سرمایه (ROI)</p>
                            <h3 className="text-2xl font-black text-slate-800 dark:text-white font-mono">22%</h3>
                        </div>
                        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl">
                            <PieChart size={24} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Trend Chart */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-6 flex items-center gap-2">
                            <LineChartIcon size={18} className="text-primary-500" />
                            <span>روند ۵ ساله درآمد و هزینه (میلیارد ریال)</span>
                        </h3>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={PERFORMANCE_TREND_DATA} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="year" tick={{fontSize: 10, fill: '#94a3b8'}} />
                                    <YAxis tick={{fontSize: 10, fill: '#94a3b8'}} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend wrapperStyle={{fontSize: '12px', paddingTop: '10px'}} />
                                    <Line type="monotone" dataKey="revenue" name="درآمد عملیاتی" stroke="#10b981" strokeWidth={3} dot={{r: 4}} />
                                    <Line type="monotone" dataKey="expense" name="هزینه‌ها" stroke="#ef4444" strokeWidth={3} dot={{r: 4}} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Composition Chart */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-6 flex items-center gap-2">
                            <BarChart3 size={18} className="text-blue-500" />
                            <span>ترکیب منابع درآمدی (میلیارد ریال)</span>
                        </h3>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={REVENUE_COMPOSITION_DATA} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="year" tick={{fontSize: 10, fill: '#94a3b8'}} />
                                    <YAxis tick={{fontSize: 10, fill: '#94a3b8'}} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend wrapperStyle={{fontSize: '12px', paddingTop: '10px'}} />
                                    <Bar name="بیمه" dataKey="insurance" stackId="a" fill="#3b82f6" />
                                    <Bar name="خصوصی/آزاد" dataKey="private" stackId="a" fill="#8b5cf6" />
                                    <Bar name="کمک‌های مردمی" dataKey="donation" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
             </div>
        )}

        {/* --- TAB 3: AUDIT VIEW --- */}
        {activeTab === 'audit' && (
             <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
                 
                 {/* Audit Timeline & Status */}
                 <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-green-400 to-blue-500"></div>
                     
                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
                         <div>
                             <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">گزارش حسابرسی سال ۱۴۰۲</h2>
                             <p className="text-sm text-slate-500 dark:text-slate-400">موسسه حسابرسی مستقل: <span className="font-bold text-slate-700 dark:text-slate-300">مفید راهبر</span></p>
                         </div>
                         <div className="mt-4 md:mt-0">
                             <div className="flex items-center gap-3 px-5 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl">
                                 <ShieldCheck size={28} className="text-green-600 dark:text-green-400" />
                                 <div>
                                     <p className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider">اظهارنظر حسابرس</p>
                                     <p className="text-lg font-black text-green-700 dark:text-green-300">مقبول (Unqualified)</p>
                                 </div>
                             </div>
                         </div>
                     </div>

                     {/* Progress Steps */}
                     <div className="relative">
                         <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 dark:bg-slate-700 -translate-y-1/2 hidden md:block"></div>
                         <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
                             {[
                                 { label: 'شروع رسیدگی', date: '۱۴۰۳/۰۲/۰۱', status: 'done' },
                                 { label: 'پیش‌نویس گزارش', date: '۱۴۰۳/۰۳/۱۵', status: 'done' },
                                 { label: 'جلسه نهایی', date: '۱۴۰۳/۰۴/۱۰', status: 'done' },
                                 { label: 'صدور گزارش', date: '۱۴۰۳/۰۴/۱۵', status: 'done' },
                                 { label: 'مجمع عمومی', date: '۱۴۰۳/۰۴/۳۰', status: 'pending' },
                             ].map((step, idx) => (
                                 <div key={idx} className="flex md:flex-col items-center gap-4 md:gap-2 bg-white dark:bg-slate-800 p-2 md:p-0 rounded-lg">
                                     <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step.status === 'done' ? 'bg-primary-500 border-primary-500 text-white' : 'bg-white border-slate-300 text-slate-300 dark:bg-slate-800 dark:border-slate-600'}`}>
                                         {step.status === 'done' ? <Check size={14} strokeWidth={3} /> : <span className="text-xs">{idx + 1}</span>}
                                     </div>
                                     <div className="md:text-center">
                                         <p className={`text-xs font-bold ${step.status === 'done' ? 'text-slate-800 dark:text-white' : 'text-slate-400'}`}>{step.label}</p>
                                         <p className="text-[10px] text-slate-400 font-mono mt-0.5">{step.date}</p>
                                     </div>
                                 </div>
                             ))}
                         </div>
                     </div>
                 </div>

                 {/* Findings Table */}
                 <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                     <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                         <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                            <AlertTriangle size={18} className="text-amber-500" />
                            بندهای شرط و نکات حسابرس (سال‌های اخیر)
                         </h3>
                     </div>
                     <div className="overflow-x-auto">
                         <table className="w-full text-sm text-right">
                             <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                 <tr>
                                     <th className="p-4 font-bold text-slate-600 dark:text-slate-300">شرح بند / یافته</th>
                                     <th className="p-4 font-bold text-slate-600 dark:text-slate-300 w-32 text-center">سال</th>
                                     <th className="p-4 font-bold text-slate-600 dark:text-slate-300 w-32 text-center">اولویت</th>
                                     <th className="p-4 font-bold text-slate-600 dark:text-slate-300 w-32 text-center">وضعیت</th>
                                 </tr>
                             </thead>
                             <tbody>
                                 {AUDIT_DATA.flatMap(log => log.findings.map(f => ({...f, year: log.year}))).map((item, idx) => (
                                     <tr key={idx} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                         <td className="p-4">
                                             <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed">{item.description}</p>
                                         </td>
                                         <td className="p-4 text-center font-mono text-slate-500 dark:text-slate-400">{item.year}</td>
                                         <td className="p-4 text-center">
                                             <span className={`text-[10px] px-2 py-1 rounded font-bold ${item.priority === 'High' ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' : item.priority === 'Medium' ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'}`}>
                                                 {item.priority === 'High' ? 'بالا' : item.priority === 'Medium' ? 'متوسط' : 'پایین'}
                                             </span>
                                         </td>
                                         <td className="p-4 text-center">
                                             <StatusBadge status={item.status} text="" type="audit" />
                                         </td>
                                     </tr>
                                 ))}
                             </tbody>
                         </table>
                     </div>
                 </div>
             </div>
        )}

        {/* --- TAB 4: CSR VIEW --- */}
        {activeTab === 'csr' && (
             <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
                 
                 {/* Impact Metrics */}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center text-center group hover:-translate-y-1 transition-transform duration-300">
                         <div className="p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-500 dark:text-rose-400 rounded-full mb-4 group-hover:scale-110 transition-transform">
                             <DollarSign size={32} />
                         </div>
                         <h3 className="text-3xl font-black text-slate-800 dark:text-white font-mono mb-1">31.5</h3>
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">میلیارد ریال هزینه</p>
                     </div>
                     <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center text-center group hover:-translate-y-1 transition-transform duration-300">
                         <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400 rounded-full mb-4 group-hover:scale-110 transition-transform">
                             <Users size={32} />
                         </div>
                         <h3 className="text-3xl font-black text-slate-800 dark:text-white font-mono mb-1">3,800</h3>
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">مددجو تحت پوشش</p>
                     </div>
                     <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center text-center group hover:-translate-y-1 transition-transform duration-300">
                         <div className="p-4 bg-purple-50 dark:bg-purple-900/20 text-purple-500 dark:text-purple-400 rounded-full mb-4 group-hover:scale-110 transition-transform">
                             <MapPin size={32} />
                         </div>
                         <h3 className="text-3xl font-black text-slate-800 dark:text-white font-mono mb-1">12</h3>
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">منطقه محروم</p>
                     </div>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                     {/* Distribution Chart */}
                     <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                         <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-6 flex items-center gap-2">
                             <BarChart3 size={18} className="text-rose-500" />
                             <span>توزیع خدمات خیریه بر اساس گروه هدف (نفر)</span>
                         </h3>
                         <div className="h-72 w-full">
                             <ResponsiveContainer width="100%" height="100%">
                                 <BarChart data={CSR_DATA} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                     <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                                     <XAxis type="number" tick={{fontSize: 10, fill: '#94a3b8'}} />
                                     <YAxis dataKey="targetGroup" type="category" tick={{fontSize: 10, fill: '#64748b'}} width={120} />
                                     <Tooltip content={<CustomTooltip />} />
                                     <Bar dataKey="beneficiaryCount" name="تعداد مددجو" fill="#fb7185" radius={[0, 4, 4, 0]} barSize={24} />
                                 </BarChart>
                             </ResponsiveContainer>
                         </div>
                     </div>

                     {/* Recent Activities List */}
                     <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
                         <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                             <HeartHandshake size={18} className="text-rose-500" />
                             <span>آخرین طرح‌های حمایتی</span>
                         </h3>
                         <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
                             {CSR_DATA.map((item) => (
                                 <div key={item.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                                     <div className="flex justify-between items-start mb-1">
                                         <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${item.supportType === 'Free' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                                             {item.supportType === 'Free' ? 'رایگان' : 'تخفیف'}
                                         </span>
                                         <span className="text-[10px] font-mono text-slate-400">{item.year}</span>
                                     </div>
                                     <p className="text-xs font-bold text-slate-700 dark:text-slate-200 line-clamp-2 mb-2">{item.targetGroup}</p>
                                     <div className="flex items-center justify-between text-[10px] text-slate-500">
                                         <span>{formatMillions(item.amountSpent)} م.ریال</span>
                                         <span>{item.fundingSource}</span>
                                     </div>
                                 </div>
                             ))}
                         </div>
                     </div>
                 </div>

                 {/* Detailed Sources & Uses Grid */}
                 <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                     <div className="p-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                         <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                            <FileText size={18} className="text-slate-400" />
                            جدول منابع و مصارف خیریه
                         </h3>
                     </div>
                     <div className="overflow-x-auto">
                         <table className="w-full text-sm text-right">
                             <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                 <tr>
                                     <th className="p-4 font-bold text-slate-600 dark:text-slate-300">شرح طرح</th>
                                     <th className="p-4 font-bold text-slate-600 dark:text-slate-300">نوع حمایت</th>
                                     <th className="p-4 font-bold text-slate-600 dark:text-slate-300">جامعه هدف (نفر)</th>
                                     <th className="p-4 font-bold text-slate-600 dark:text-slate-300 font-mono">هزینه کرد (ریال)</th>
                                     <th className="p-4 font-bold text-slate-600 dark:text-slate-300">منبع تامین</th>
                                 </tr>
                             </thead>
                             <tbody>
                                 {CSR_DATA.map((item, idx) => (
                                     <tr key={idx} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                         <td className="p-4 font-bold text-slate-800 dark:text-white">{item.targetGroup}</td>
                                         <td className="p-4">
                                             <span className="text-xs text-slate-500 dark:text-slate-400">{item.supportType === 'Free' ? 'درمان کاملاً رایگان' : 'تخفیف تعرفه خدمات'}</span>
                                         </td>
                                         <td className="p-4 font-mono text-slate-600 dark:text-slate-300">{formatCurrency(item.beneficiaryCount)}</td>
                                         <td className="p-4 font-mono text-slate-600 dark:text-slate-300 font-bold">{formatCurrency(item.amountSpent)}</td>
                                         <td className="p-4 text-xs text-slate-500 dark:text-slate-400">{item.fundingSource}</td>
                                     </tr>
                                 ))}
                             </tbody>
                         </table>
                     </div>
                 </div>
             </div>
        )}

        {/* --- OVERVIEW TAB (Fallback) --- */}
        {activeTab === 'overview' && (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in-95 duration-300">
                <p className="text-slate-400">در حال بارگذاری داشبورد جامع...</p>
                {/* Note: This state is technically handled by the Layout or initial render, 
                    but kept here as a fallback if logic fails. Real overview is usually the initial state. 
                    We can redirect to Budget or Performance if preferred as default. 
                */}
            </div>
        )}

    </FinancialDashboardLayout>
  );
};

export default MacroFinancialView;
