
import React, { useState, useEffect } from 'react';
import { User, Phone, ShieldAlert, X, Save, Layers, Briefcase, GraduationCap, Calendar, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { StaffMember } from '../types';
import { useSystemDefinitions } from '../hooks/useSystemDefinitions';
import ImageUploader from './ImageUploader';
import { supabase } from '../supabaseClient';

interface StaffModalProps {
  staff: StaffMember | null;
  onClose: () => void;
  onSaveSuccess: () => void;
  initialDepartmentId?: string;
}

const StaffModal: React.FC<StaffModalProps> = ({ staff, onClose, onSaveSuccess, initialDepartmentId }) => {
  const { departments, getJobs } = useSystemDefinitions();
  const [activeTab, setActiveTab] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<Partial<StaffMember>>({});
  const [loading, setLoading] = useState(false);

  // Initialize Form
  useEffect(() => {
    if (staff) {
      setFormData(staff);
    } else {
      setFormData({
        department_id: initialDepartmentId || '',
        is_active: true,
        status: 'Active',
        full_name: '',
        job_title_id: '',
        role_category: '',
        gender: 'Male',
        marital_status: 'Single',
        education_level: 'Bachelor'
      });
    }
  }, [staff, initialDepartmentId]);

  // Derived Job Options (Cascading)
  const jobOptions = getJobs(formData.department_id);

  const handleSave = async () => {
    try {
      setLoading(true);
      // Basic Validation
      if (!formData.full_name) return alert('نام و نام خانوادگی الزامی است.');
      if (!formData.department_id) return alert('دپارتمان الزامی است.');
      if (!formData.job_title_id) return alert('عنوان شغلی الزامی است.');

      // Sanitize payload to remove empty strings for non-string types if necessary
      const payload = { ...formData };
      
      // Upsert
      if (staff?.id) {
          const { error } = await supabase.from('human_capital').update(payload).eq('id', staff.id);
          if (error) throw error;
      } else {
          const { error } = await supabase.from('human_capital').insert(payload);
          if (error) throw error;
      }
      
      onSaveSuccess();
      onClose();
    } catch (e: any) {
      console.error(e);
      alert('خطا در ذخیره سازی: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
        <div className="relative bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            
            {/* Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
                <h3 className="font-black text-lg text-slate-800 dark:text-white flex items-center gap-2">
                    <User size={20} className="text-primary-500" />
                    {staff ? 'ویرایش پرونده پرسنلی' : 'افزودن عضو جدید'}
                </h3>
                <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors bg-slate-200 dark:bg-slate-800 rounded-full p-1"><X size={18}/></button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto">
                <button onClick={() => setActiveTab(1)} className={`flex-1 py-4 px-2 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === 1 ? 'border-primary-500 text-primary-600 bg-primary-50/50 dark:bg-primary-900/10' : 'border-transparent text-slate-500'}`}><User size={16}/> هویت و شغلی</button>
                <button onClick={() => setActiveTab(2)} className={`flex-1 py-4 px-2 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === 2 ? 'border-primary-500 text-primary-600 bg-primary-50/50 dark:bg-primary-900/10' : 'border-transparent text-slate-500'}`}><Phone size={16}/> تماس و تحصیلات</button>
                <button onClick={() => setActiveTab(3)} className={`flex-1 py-4 px-2 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === 3 ? 'border-primary-500 text-primary-600 bg-primary-50/50 dark:bg-primary-900/10' : 'border-transparent text-slate-500'}`}><ShieldAlert size={16}/> اداری و محرمانه</button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-900/50 custom-scrollbar">
                
                {/* TAB 1: Identity & Work */}
                {activeTab === 1 && (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-200">
                        
                        {/* Top Section: Photo & Basic Info */}
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="w-32 flex flex-col items-center gap-2 mx-auto md:mx-0">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-md bg-slate-100 dark:bg-slate-800">
                                    <ImageUploader 
                                        folder="avatars"
                                        currentImage={formData.avatar_url}
                                        onUpload={(url) => setFormData({...formData, avatar_url: url})}
                                    />
                                </div>
                                <div className="text-xs text-center text-slate-400">برای تغییر کلیک کنید</div>
                            </div>
                            
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-500 mb-1.5">نام و نام خانوادگی *</label>
                                    <input 
                                        value={formData.full_name || ''}
                                        onChange={e => setFormData({...formData, full_name: e.target.value})}
                                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 outline-none"
                                        placeholder="مثال: دکتر علی محمدی"
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1.5">نام پدر</label>
                                    <input 
                                        value={formData.father_name || ''}
                                        onChange={e => setFormData({...formData, father_name: e.target.value})}
                                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1.5">جنسیت</label>
                                    <select 
                                        value={formData.gender || 'Male'}
                                        onChange={e => setFormData({...formData, gender: e.target.value as any})}
                                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                                    >
                                        <option value="Male">مرد</option>
                                        <option value="Female">زن</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1.5">شماره شناسنامه</label>
                                    <input 
                                        value={formData.id_number || ''}
                                        onChange={e => setFormData({...formData, id_number: e.target.value})}
                                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1.5">کد ملی</label>
                                    <input 
                                        value={formData.national_id || ''}
                                        onChange={e => setFormData({...formData, national_id: e.target.value})}
                                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1.5">تاریخ تولد</label>
                                    <input 
                                        value={formData.birth_date || ''}
                                        onChange={e => setFormData({...formData, birth_date: e.target.value})}
                                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center outline-none"
                                        placeholder="YYYY/MM/DD"
                                    />
                                </div>
                            </div>
                        </div>

                        <hr className="border-slate-200 dark:border-slate-700" />

                        <h4 className="font-bold text-sm text-slate-700 dark:text-slate-200 flex items-center gap-2">
                            <Briefcase size={16} className="text-primary-500" />
                            اطلاعات شغلی و سازمانی
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5">دپارتمان (واحد) *</label>
                                <select 
                                    value={formData.department_id || ''}
                                    onChange={e => setFormData({
                                        ...formData, 
                                        department_id: e.target.value,
                                        job_title_id: '' // Reset job when department changes
                                    })}
                                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                                >
                                    <option value="">انتخاب کنید...</option>
                                    {departments.map(d => (
                                        <option key={d.id} value={d.id}>{d.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5">عنوان شغلی *</label>
                                <select 
                                    value={formData.job_title_id || ''}
                                    onChange={e => setFormData({...formData, job_title_id: e.target.value})}
                                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                                    disabled={!formData.department_id}
                                >
                                    <option value="">
                                        {!formData.department_id ? 'ابتدا دپارتمان را انتخاب کنید' : 'انتخاب کنید...'}
                                    </option>
                                    {jobOptions.map(j => (
                                        <option key={j.id} value={j.id}>{j.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5">رسته شغلی</label>
                                <select 
                                    value={formData.role_category || ''}
                                    onChange={e => setFormData({...formData, role_category: e.target.value})}
                                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                                >
                                    <option value="">انتخاب کنید...</option>
                                    <option value="Medical">کادر درمان (پزشک)</option>
                                    <option value="Nursing">پرستاری و مامایی</option>
                                    <option value="ParaClinical">پاراکلینیک</option>
                                    <option value="Admin">اداری و مالی</option>
                                    <option value="Service">خدمات و پشتیبانی</option>
                                    <option value="Management">مدیریت</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5">نوع همکاری</label>
                                <select 
                                    value={formData.employment_type || ''}
                                    onChange={e => setFormData({...formData, employment_type: e.target.value})}
                                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                                >
                                    <option value="">انتخاب کنید...</option>
                                    <option value="Official">رسمی</option>
                                    <option value="Contract">قراردادی (پیمانی)</option>
                                    <option value="Project">پروژه‌ای / ساعتی</option>
                                    <option value="Consultant">مشاوره</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5">وضعیت اشتغال</label>
                                <select 
                                    value={formData.status || 'Active'}
                                    onChange={e => setFormData({...formData, status: e.target.value as any})}
                                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                                >
                                    <option value="Active">فعال</option>
                                    <option value="Inactive">غیرفعال (مرخصی/تعلیق)</option>
                                    <option value="Retired">بازنشسته</option>
                                    <option value="Suspended">قطع همکاری</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5">تاریخ شروع همکاری</label>
                                <input 
                                    value={formData.hired_date || ''}
                                    onChange={e => setFormData({...formData, hired_date: e.target.value})}
                                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center outline-none"
                                    placeholder="YYYY/MM/DD"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: Contact & Education */}
                {activeTab === 2 && (
                   <div className="space-y-6 animate-in slide-in-from-right-4 duration-200">
                       
                       <h4 className="font-bold text-sm text-slate-700 dark:text-slate-200 flex items-center gap-2">
                            <Phone size={16} className="text-primary-500" />
                            اطلاعات تماس
                       </h4>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div>
                               <label className="block text-xs font-bold text-slate-500 mb-1.5">موبایل</label>
                               <input 
                                   value={formData.mobile_number || ''}
                                   onChange={e => setFormData({...formData, mobile_number: e.target.value})}
                                   className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono outline-none"
                               />
                           </div>
                           <div>
                               <label className="block text-xs font-bold text-slate-500 mb-1.5">تلفن داخلی</label>
                               <input 
                                   value={formData.internal_phone || ''}
                                   onChange={e => setFormData({...formData, internal_phone: e.target.value})}
                                   className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono outline-none"
                               />
                           </div>
                           <div className="md:col-span-2">
                               <label className="block text-xs font-bold text-slate-500 mb-1.5">ایمیل سازمانی</label>
                               <input 
                                   value={formData.email || ''}
                                   onChange={e => setFormData({...formData, email: e.target.value})}
                                   className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono outline-none"
                               />
                           </div>
                           <div className="md:col-span-2">
                               <label className="block text-xs font-bold text-slate-500 mb-1.5">آدرس سکونت</label>
                               <textarea 
                                   value={formData.home_address || ''}
                                   onChange={e => setFormData({...formData, home_address: e.target.value})}
                                   className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 min-h-[80px] outline-none"
                               />
                           </div>
                       </div>

                       <hr className="border-slate-200 dark:border-slate-700" />

                       <h4 className="font-bold text-sm text-slate-700 dark:text-slate-200 flex items-center gap-2">
                            <GraduationCap size={16} className="text-primary-500" />
                            سوابق تحصیلی
                       </h4>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div>
                               <label className="block text-xs font-bold text-slate-500 mb-1.5">مقطع تحصیلی</label>
                               <select 
                                   value={formData.education_level || ''}
                                   onChange={e => setFormData({...formData, education_level: e.target.value})}
                                   className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                               >
                                   <option value="">انتخاب کنید...</option>
                                   <option value="Diploma">دیپلم</option>
                                   <option value="Associate">کاردانی</option>
                                   <option value="Bachelor">کارشناسی</option>
                                   <option value="Master">کارشناسی ارشد</option>
                                   <option value="PhD">دکترا عمومی</option>
                                   <option value="Specialist">تخصص</option>
                                   <option value="SubSpecialist">فوق تخصص / فلوشیپ</option>
                               </select>
                           </div>
                           <div>
                               <label className="block text-xs font-bold text-slate-500 mb-1.5">رشته تحصیلی</label>
                               <input 
                                   value={formData.major || ''}
                                   onChange={e => setFormData({...formData, major: e.target.value})}
                                   className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                               />
                           </div>
                           <div className="md:col-span-2">
                               <label className="block text-xs font-bold text-slate-500 mb-1.5">دانشگاه محل تحصیل</label>
                               <input 
                                   value={formData.university || ''}
                                   onChange={e => setFormData({...formData, university: e.target.value})}
                                   className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                               />
                           </div>
                       </div>
                   </div>
                )}

                {/* TAB 3: HR & Confidential */}
                {activeTab === 3 && (
                   <div className="space-y-6 animate-in slide-in-from-right-4 duration-200">
                       <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-xl text-xs flex items-center gap-2 mb-4 border border-red-100 dark:border-red-900">
                           <ShieldAlert size={16} />
                           <span>این بخش حاوی اطلاعات محرمانه پرسنلی است و فقط برای مدیران سیستم قابل مشاهده است.</span>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4">
                           <div>
                               <label className="block text-xs font-bold text-slate-500 mb-1.5">کد پرسنلی</label>
                               <input 
                                   value={formData.personnel_code || ''}
                                   onChange={e => setFormData({...formData, personnel_code: e.target.value})}
                                   className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-center outline-none"
                               />
                           </div>
                           <div>
                               <label className="block text-xs font-bold text-slate-500 mb-1.5">تاریخ پایان همکاری</label>
                               <input 
                                   value={formData.left_date || ''}
                                   onChange={e => setFormData({...formData, left_date: e.target.value})}
                                   className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center outline-none"
                                   placeholder="YYYY/MM/DD"
                               />
                           </div>
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                           <div>
                               <label className="block text-xs font-bold text-slate-500 mb-1.5">وضعیت تاهل</label>
                               <select 
                                   value={formData.marital_status || 'Single'}
                                   onChange={e => setFormData({...formData, marital_status: e.target.value as any})}
                                   className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                               >
                                   <option value="Single">مجرد</option>
                                   <option value="Married">متاهل</option>
                               </select>
                           </div>
                           <div>
                               <label className="block text-xs font-bold text-slate-500 mb-1.5">وضعیت نظام وظیفه</label>
                               <select 
                                   value={formData.military_status || ''}
                                   onChange={e => setFormData({...formData, military_status: e.target.value})}
                                   className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                               >
                                   <option value="">انتخاب کنید...</option>
                                   <option value="EndService">پایان خدمت</option>
                                   <option value="Exempt">معاف دائم</option>
                                   <option value="MedicalExempt">معاف پزشکی</option>
                                   <option value="EducationalExempt">معافیت تحصیلی</option>
                                   <option value="NotApplicable">مشمول نیست (بانوان)</option>
                               </select>
                           </div>
                       </div>

                       <div>
                           <label className="block text-xs font-bold text-slate-500 mb-1.5">یادداشت‌های محرمانه</label>
                           <textarea 
                               value={formData.notes || ''}
                               onChange={e => setFormData({...formData, notes: e.target.value})}
                               className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 min-h-[100px] outline-none"
                               placeholder="توضیحات تکمیلی، سوابق انضباطی و ..."
                           />
                       </div>
                   </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex gap-3">
                <button onClick={onClose} className="flex-1 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-50 transition-colors">انصراف</button>
                <button onClick={handleSave} disabled={loading} className="flex-[2] py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2 transition-colors">
                    {loading ? <Loader2 size={18} className="animate-spin"/> : <Save size={18} />}
                    <span>{loading ? 'در حال ذخیره...' : 'ذخیره تغییرات'}</span>
                </button>
            </div>
        </div>
    </div>
  );
};

export default StaffModal;
