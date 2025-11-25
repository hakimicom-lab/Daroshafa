
import React, { useState } from 'react';
import { useSystemDefinitions } from '../hooks/useSystemDefinitions';
import { Plus, Edit2, Trash2, Save, X, Layers, Briefcase, BarChart3, ChevronRight, Loader2 } from 'lucide-react';
import { BaseDefinition } from '../types';

const SystemDefinitionsView: React.FC = () => {
  const { definitions, departments, getJobs, kpis, loading, addDefinition, updateDefinition, deleteDefinition } = useSystemDefinitions();
  const [activeTab, setActiveTab] = useState<'department' | 'job_title' | 'evaluation_kpi'>('department');
  
  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<BaseDefinition>>({});

  const handleEdit = (def: BaseDefinition) => {
    setFormData(def);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setFormData({ category: activeTab, title: '', parent_id: '' });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      if (!formData.title) return alert('عنوان الزامی است');
      
      setIsSaving(true);

      // Clean up payload (convert empty strings to null for UUID fields)
      const payload = { ...formData };
      if (payload.parent_id === '') {
          payload.parent_id = null;
      }
      
      if (payload.id) {
        await updateDefinition(payload.id, payload);
      } else {
        await addDefinition(payload as any);
      }
      
      setIsEditing(false);
      setFormData({});
    } catch (e: any) {
      console.error(e);
      const msg = e?.message || 'خطای ناشناخته در سرور';
      alert('خطا در ذخیره سازی: ' + msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('آیا مطمئن هستید؟ با حذف این آیتم ممکن است اطلاعات پرسنل مرتبط دچار مشکل شود.')) {
      await deleteDefinition(id);
    }
  };

  // Render List Logic
  const renderContent = () => {
    if (loading) return <div className="p-8 text-center text-slate-400 flex justify-center"><Loader2 className="animate-spin"/></div>;

    if (activeTab === 'department') {
        return (
            <div className="space-y-2">
                {departments.length === 0 && <p className="text-center text-slate-400 py-4">هیچ دپارتمانی تعریف نشده است.</p>}
                {departments.map(dept => (
                    <div key={dept.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                        <span className="font-bold text-slate-700 dark:text-slate-200">{dept.title}</span>
                        <div className="flex gap-2">
                            <button onClick={() => handleEdit(dept)} className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"><Edit2 size={16}/></button>
                            <button onClick={() => handleDelete(dept.id)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"><Trash2 size={16}/></button>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (activeTab === 'job_title') {
        return (
            <div className="space-y-4">
                {departments.length === 0 && <p className="text-center text-slate-400 py-4">ابتدا دپارتمان‌ها را تعریف کنید.</p>}
                {departments.map(dept => {
                    const deptJobs = getJobs(dept.id);
                    return (
                        <div key={dept.id} className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 font-bold border-b border-slate-200 dark:border-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-200">
                                <Layers size={16} className="text-slate-400"/>
                                {dept.title}
                            </div>
                            <div className="p-2 space-y-1 bg-white dark:bg-slate-800">
                                {deptJobs.length === 0 && <p className="text-xs text-slate-400 p-2 text-center border-dashed border-2 border-slate-100 dark:border-slate-700 rounded-lg mb-2">بدون عنوان شغلی</p>}
                                {deptJobs.map(job => (
                                    <div key={job.id} className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors group">
                                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                            <ChevronRight size={14} className="text-slate-300"/>
                                            {job.title}
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(job)} className="p-1 text-blue-500 hover:bg-blue-100 rounded"><Edit2 size={14}/></button>
                                            <button onClick={() => handleDelete(job.id)} className="p-1 text-red-500 hover:bg-red-100 rounded"><Trash2 size={14}/></button>
                                        </div>
                                    </div>
                                ))}
                                <button 
                                  onClick={() => { setFormData({ category: 'job_title', parent_id: dept.id, title: '' }); setIsEditing(true); }}
                                  className="w-full text-center py-2 text-xs text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/10 rounded-lg border border-dashed border-primary-200 dark:border-primary-800 mt-1"
                                >
                                    + افزودن شغل به {dept.title}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    if (activeTab === 'evaluation_kpi') {
        return (
            <div className="space-y-2">
                {kpis.length === 0 && <p className="text-center text-slate-400 py-4">هیچ شاخص ارزیابی تعریف نشده است.</p>}
                {kpis.map(kpi => (
                    <div key={kpi.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                 <BarChart3 size={16}/>
                             </div>
                             <span className="font-bold text-slate-700 dark:text-slate-200">{kpi.title}</span>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => handleEdit(kpi)} className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"><Edit2 size={16}/></button>
                            <button onClick={() => handleDelete(kpi.id)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"><Trash2 size={16}/></button>
                        </div>
                    </div>
                ))}
            </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-[600px]">
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-2xl font-black text-slate-800 dark:text-white">تنظیمات پایه سیستم</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">مدیریت دپارتمان‌ها، عناوین شغلی و شاخص‌های ارزیابی</p>
            </div>
            <button onClick={handleAddNew} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl font-bold transition-colors shadow-lg shadow-primary-500/20">
                <Plus size={18}/>
                <span>آیتم جدید</span>
            </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800 mb-6 overflow-x-auto">
            <button 
                onClick={() => setActiveTab('department')}
                className={`pb-3 px-2 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'department' ? 'border-primary-500 text-primary-600 dark:text-primary-400 font-bold' : 'border-transparent text-slate-500 dark:text-slate-400'}`}
            >
                <Layers size={18}/> دپارتمان‌ها
            </button>
            <button 
                onClick={() => setActiveTab('job_title')}
                className={`pb-3 px-2 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'job_title' ? 'border-primary-500 text-primary-600 dark:text-primary-400 font-bold' : 'border-transparent text-slate-500 dark:text-slate-400'}`}
            >
                <Briefcase size={18}/> عناوین شغلی
            </button>
            <button 
                onClick={() => setActiveTab('evaluation_kpi')}
                className={`pb-3 px-2 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'evaluation_kpi' ? 'border-primary-500 text-primary-600 dark:text-primary-400 font-bold' : 'border-transparent text-slate-500 dark:text-slate-400'}`}
            >
                <BarChart3 size={18}/> شاخص‌های ارزیابی (KPI)
            </button>
        </div>

        {renderContent()}

        {/* Edit Modal */}
        {isEditing && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsEditing(false)}>
                <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md p-6 shadow-2xl relative border border-slate-200 dark:border-slate-700" onClick={e => e.stopPropagation()}>
                    <button onClick={() => setIsEditing(false)} className="absolute top-4 left-4 text-slate-400 hover:text-red-500"><X size={20}/></button>
                    
                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-slate-800 dark:text-white">
                        {formData.id ? <Edit2 size={20} className="text-blue-500"/> : <Plus size={20} className="text-green-500"/>}
                        {formData.id ? 'ویرایش آیتم' : 'افزودن آیتم جدید'}
                    </h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 mb-1.5">دسته بندی</label>
                            <select 
                                value={formData.category} 
                                disabled
                                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 opacity-70 cursor-not-allowed"
                            >
                                <option value="department">دپارتمان</option>
                                <option value="job_title">عنوان شغلی</option>
                                <option value="evaluation_kpi">شاخص ارزیابی</option>
                            </select>
                        </div>
                        
                        {/* Parent Select for Job Titles */}
                        {formData.category === 'job_title' && (
                            <div>
                                <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 mb-1.5">مرتبط با دپارتمان</label>
                                <select 
                                    value={formData.parent_id || ''} 
                                    onChange={e => setFormData({...formData, parent_id: e.target.value})}
                                    className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                                >
                                    <option value="">انتخاب کنید...</option>
                                    {departments.map(d => (
                                        <option key={d.id} value={d.id}>{d.title}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 mb-1.5">عنوان</label>
                            <input 
                                value={formData.title || ''}
                                onChange={e => setFormData({...formData, title: e.target.value})}
                                className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                                placeholder="عنوان را وارد کنید..."
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 mt-8 border-t border-slate-100 dark:border-slate-800 pt-4">
                        <button 
                            onClick={() => setIsEditing(false)} 
                            className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            انصراف
                        </button>
                        <button 
                            onClick={handleSave} 
                            disabled={isSaving}
                            className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2"
                        >
                            {isSaving ? <Loader2 size={18} className="animate-spin"/> : <Save size={18}/>}
                            <span>{isSaving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}</span>
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default SystemDefinitionsView;
