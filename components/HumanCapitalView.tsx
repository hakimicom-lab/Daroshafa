import React, { useState, useEffect } from 'react';
import { User, Plus, Edit2, Trash2, Phone, Search, Loader2, Award, Mail, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { StaffMember } from '../types';
import { useSystemDefinitions } from '../hooks/useSystemDefinitions';
import StaffModal from './StaffModal';
import ReportCardModal from './ReportCardModal';

interface UniversalStaffListProps {
  department?: string;   // e.g., 'Eye', 'IT' - Filter by Department Title in DB
  isEditable?: boolean;
}

const UniversalStaffList: React.FC<UniversalStaffListProps> = ({ department, isEditable = false }) => {
  // Use the hook's departments directly
  const { definitions, departments, loading: definitionsLoading } = useSystemDefinitions();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  // Modals
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [reportingStaff, setReportingStaff] = useState<StaffMember | null>(null);

  // Local State for "Flip Card" effect (Level 2 Contact Info)
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const fetchStaff = async () => {
    setLoadingStaff(true);
    setFetchError(null);
    try {
      let query = supabase.from('human_capital').select('*').order('full_name');
      
      const { data, error } = await query;
      
      if (error) {
          throw error;
      }

      let filteredData = data as StaffMember[];
      
      // Logic: If we are in a specific department view (not 'All' or 'HR root page')
      if (department && department !== 'همه' && department !== 'سرمایه انسانی') {
           // If definitions are loaded, we can filter safely
           if (departments.length > 0) {
               const deptDef = departments.find(d => d.title.includes(department));
               if (deptDef) {
                   filteredData = filteredData.filter(s => s.department_id === deptDef.id);
               } else {
                   // Department requested but not found in DB. 
                   // Safety: Show empty list instead of ALL staff to prevent confusion.
                   console.warn(`Department '${department}' not found in system definitions.`);
                   filteredData = [];
               }
           } else if (!definitionsLoading) {
               // Definitions loaded but empty (DB is empty) -> Show empty list
               filteredData = [];
           }
           // If definitions are still loading, this effect will re-run when they finish, so we wait.
      }
      
      setStaff(filteredData);
    } catch (err: any) {
        console.error('Error fetching staff:', err);
        const msg = err?.message || err?.error_description || (typeof err === 'string' ? err : 'خطای دریافت اطلاعات');
        setFetchError(msg);
        setStaff([]);
    } finally {
        setLoadingStaff(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [department, definitionsLoading]); // Re-run when definitions load to apply filtering correctly

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این پرسنل اطمینان دارید؟')) return;
    try {
        const { error } = await supabase.from('human_capital').delete().eq('id', id);
        if (error) throw error;
        fetchStaff();
    } catch (err: any) {
        alert('خطا در حذف: ' + (err.message || JSON.stringify(err)));
    }
  };
  
  // Optimized Lookup Helper
  const lookupTitle = (id: string) => {
      if (!id || definitions.length === 0) return '---';
      return definitions.find(d => d.id === id)?.title || '---';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm min-h-[400px] flex flex-col">
       
       {/* Toolbar */}
       <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50 dark:bg-slate-900/50 rounded-t-2xl">
           <div className="flex items-center gap-3">
               <div className="p-2.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-xl">
                   <User size={20} />
               </div>
               <div>
                   <h3 className="font-bold text-slate-800 dark:text-white">سرمایه‌های انسانی</h3>
                   <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                       {department && department !== 'سرمایه انسانی' ? `پرسنل ${department}` : 'لیست جامع'}
                   </p>
               </div>
           </div>
           
           <div className="flex items-center gap-2">
               <button 
                  onClick={fetchStaff}
                  className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-primary-600 rounded-xl transition-colors"
                  title="بروزرسانی"
               >
                   <RefreshCw size={18} className={loadingStaff ? 'animate-spin' : ''} />
               </button>
               {isEditable && (
                   <button 
                      onClick={() => { setEditingStaff(null); setIsStaffModalOpen(true); }}
                      className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-300 rounded-xl font-bold text-sm transition-colors border border-slate-200 dark:border-slate-700 shadow-sm"
                   >
                       <Plus size={18} />
                       <span>عضو جدید</span>
                   </button>
               )}
           </div>
       </div>

       {loadingStaff ? (
           <div className="flex-1 flex flex-col items-center justify-center p-10">
               <Loader2 className="animate-spin text-primary-500 mb-2" size={32}/>
               <span className="text-sm text-slate-400">در حال دریافت اطلاعات...</span>
           </div>
       ) : fetchError ? (
           <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
               <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full mb-3">
                   <AlertCircle size={32} />
               </div>
               <p className="text-slate-800 dark:text-white font-bold mb-1">خطا در دریافت اطلاعات</p>
               <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 max-w-md dir-ltr font-mono">{fetchError}</p>
               <button onClick={fetchStaff} className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-bold hover:bg-primary-700 transition-colors">
                   تلاش مجدد
               </button>
           </div>
       ) : (
           <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
               {staff.length === 0 && (
                   <div className="col-span-full flex flex-col items-center justify-center py-16 text-slate-400 border-2 border-dashed border-slate-100 dark:border-slate-700 rounded-2xl bg-slate-50/50 dark:bg-slate-900/20">
                       <User size={32} className="mb-3 opacity-50" />
                       <p className="font-bold">هیچ پرسنلی یافت نشد.</p>
                       <p className="text-xs mt-1 opacity-70">برای این بخش هنوز اطلاعاتی ثبت نشده است.</p>
                       {definitions.length === 0 && isEditable && (
                           <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-xs text-amber-700 dark:text-amber-400 flex items-center gap-2">
                               <AlertCircle size={14}/>
                               <span>توجه: ابتدا از بخش "تنظیمات سیستم" دپارتمان‌ها و مشاغل را تعریف کنید.</span>
                           </div>
                       )}
                   </div>
               )}
               
               {staff.map(member => (
                   <div key={member.id} className="relative group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl p-4 transition-all hover:shadow-lg flex flex-col items-center text-center">
                       
                       {/* Admin Controls */}
                       {isEditable && (
                           <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                               <button onClick={() => { setEditingStaff(member); setIsStaffModalOpen(true); }} className="p-1.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 border border-blue-100"><Edit2 size={14}/></button>
                               <button onClick={() => handleDelete(member.id)} className="p-1.5 bg-red-50 text-red-600 rounded-full hover:bg-red-100 border border-red-100"><Trash2 size={14}/></button>
                           </div>
                       )}

                       {/* Front / Back Logic */}
                       {!flippedCards[member.id] ? (
                           // LEVEL 1: PUBLIC
                           <>
                               <div className="w-24 h-24 mb-4 rounded-full border-4 border-slate-50 dark:border-slate-800 shadow-inner overflow-hidden bg-slate-100 dark:bg-slate-800">
                                   <img src={member.avatar_url || 'https://via.placeholder.com/150'} alt={member.full_name} className="w-full h-full object-cover" />
                               </div>
                               <h4 className="font-black text-slate-800 dark:text-slate-100 mb-1 text-lg">{member.full_name}</h4>
                               <span className="text-sm font-bold text-primary-600 dark:text-primary-400 mb-1">{lookupTitle(member.job_title_id)}</span>
                               <span className="text-xs text-slate-400 mb-4">{lookupTitle(member.department_id)}</span>
                               
                               <div className="flex gap-2 mt-auto w-full">
                                   <button 
                                     onClick={() => setFlippedCards(prev => ({...prev, [member.id]: true}))}
                                     className="flex-1 py-2 text-xs font-bold text-slate-500 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-1"
                                   >
                                       <Phone size={14}/> تماس
                                   </button>
                                   <button 
                                     onClick={() => { setReportingStaff(member); setIsReportModalOpen(true); }}
                                     className="flex-1 py-2 text-xs font-bold text-slate-500 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-1"
                                   >
                                       <Award size={14}/> عملکرد
                                   </button>
                               </div>
                           </>
                       ) : (
                           // LEVEL 2: CONTACT (Flipped)
                           <div className="flex flex-col h-full w-full justify-between animate-in flip-in-y duration-300">
                               <div className="text-right w-full space-y-3">
                                   <h4 className="font-black text-slate-800 dark:text-slate-100 border-b pb-2 mb-2 text-sm">{member.full_name}</h4>
                                   <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-2 rounded-lg">
                                       <Phone size={14} className="text-primary-500"/>
                                       <span className="font-mono" dir="ltr">{member.mobile_number || '---'}</span>
                                   </div>
                                   <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-2 rounded-lg">
                                       <Search size={14} className="text-primary-500"/>
                                       <span>داخلی: </span>
                                       <span className="font-mono">{member.internal_phone || '---'}</span>
                                   </div>
                                   <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-2 rounded-lg truncate">
                                       <Mail size={14} className="text-primary-500"/>
                                       <span className="font-mono truncate">{member.email || '---'}</span>
                                   </div>
                               </div>
                               <button 
                                 onClick={() => setFlippedCards(prev => ({...prev, [member.id]: false}))}
                                 className="w-full mt-4 py-2 text-xs font-bold text-white bg-slate-400 hover:bg-slate-500 rounded-lg transition-colors"
                               >
                                   بازگشت
                               </button>
                           </div>
                       )}
                   </div>
               ))}
           </div>
       )}

       {/* Modals */}
       {isStaffModalOpen && (
           <StaffModal 
             staff={editingStaff} 
             onClose={() => setIsStaffModalOpen(false)} 
             onSaveSuccess={fetchStaff}
             initialDepartmentId={departments.find(d => d.title.includes(department || ''))?.id}
           />
       )}

       {isReportModalOpen && reportingStaff && (
           <ReportCardModal 
             staff={reportingStaff} 
             onClose={() => setIsReportModalOpen(false)} 
           />
       )}
    </div>
  );
};

export default UniversalStaffList;