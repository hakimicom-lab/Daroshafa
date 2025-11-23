
import React, { useState, useEffect, useMemo } from 'react';
import { WikiArticle } from '../types';
import { Bookmark, ChevronDown, ChevronUp, Info, Users, Package, Activity, Calendar, FileText, Filter, Scale, ShieldCheck, ClipboardList, History, Map, Target, Edit2, Check, Settings } from 'lucide-react';
import UniversalStaffList from './HumanCapitalView';
import FinancialAnalysisView from './FinancialAnalysisView';
import TimelineView from './TimelineView';
import PhysicalResourcesView from './PhysicalResourcesView';
import HomeDashboard from './HomeDashboard';
import MacroFinancialView from './MacroFinancialView';
import EvolutionTimeline from './EvolutionTimeline';
import OrgChartView from './OrgChartView';
import SystemDefinitionsView from './SystemDefinitionsView';

interface SubArticleData {
  id: string;
  title: string;
  contentHtml: string;
}

interface ArticleViewProps {
  article: WikiArticle;
  onEdit: () => void;
  isEditing?: boolean;
  subArticles?: SubArticleData[];
  onEditSubArticle?: (title: string) => void;
  activeSectionId?: string | null;
  onNavigate?: (topic: string) => void;
}

const ArticleView: React.FC<ArticleViewProps> = ({ article, onEdit, isEditing: propIsEditing = false, subArticles, onEditSubArticle, activeSectionId, onNavigate }) => {
  
  // --- Tab Mapping Logic ---
  const departmentTabs = useMemo(() => {
    const safeSubArticles = subArticles || [];
    return {
      intro: safeSubArticles.find(s => s.title.includes('معرفی') || s.title.includes('وظایف')),
      hr: safeSubArticles.find(s => s.title.includes('سرمایه انسانی') || s.title.includes('پرسنل') || s.title.includes('اعضا')),
      resources: safeSubArticles.find(s => s.title.includes('منابع') || s.title.includes('تجهیزات')),
      performance: safeSubArticles.find(s => s.title.includes('عملکرد') || s.title.includes('تحلیل عملکرد')),
      timeline: safeSubArticles.find(s => s.title.includes('تقویم') || s.title.includes('گاه‌شمار'))
    };
  }, [subArticles]);

  const originsTabs = useMemo(() => {
    const safeSubArticles = subArticles || [];
    return {
      historical: safeSubArticles.find(s => s.title.includes('تاریخی')),
      geographical: safeSubArticles.find(s => s.title.includes('جغرافیایی')),
      mission: safeSubArticles.find(s => s.title.includes('ماموریتی')),
    };
  }, [subArticles]);

  const positionTabs = useMemo(() => {
    const safeSubArticles = subArticles || [];
    return {
      ecosystem: safeSubArticles.find(s => s.title.includes('اکوسیستم')),
      legal: safeSubArticles.find(s => s.title.includes('حقوقی')),
      charter: safeSubArticles.find(s => s.title.includes('منشور')),
    };
  }, [subArticles]);

  // Check modes
  const isDepartmentMode = useMemo(() => {
      return !!(departmentTabs.intro || departmentTabs.hr || departmentTabs.resources || departmentTabs.performance || departmentTabs.timeline);
  }, [departmentTabs]);

  const isOriginsMode = useMemo(() => {
      return !!(originsTabs.historical || originsTabs.geographical || originsTabs.mission);
  }, [originsTabs]);

  const isPositionMode = useMemo(() => {
      return !!(positionTabs.ecosystem || positionTabs.legal || positionTabs.charter);
  }, [positionTabs]);

  // --- State ---
  const [activeTabId, setActiveTabId] = useState<string>('intro');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Local Editing State
  const [localIsEditing, setLocalIsEditing] = useState(false);
  
  // Force System Definitions View State
  const [showSystemSettings, setShowSystemSettings] = useState(false);
  
  const isEditing = propIsEditing || localIsEditing;

  // Sync activeSectionId to Tabs
  useEffect(() => {
    if (isDepartmentMode && activeSectionId) {
       if (departmentTabs.hr?.id === activeSectionId) setActiveTabId('hr');
       else if (departmentTabs.resources?.id === activeSectionId) setActiveTabId('resources');
       else if (departmentTabs.performance?.id === activeSectionId) setActiveTabId('performance');
       else if (departmentTabs.timeline?.id === activeSectionId) setActiveTabId('timeline');
       else setActiveTabId('intro');
    } else if (isOriginsMode && activeSectionId) {
       if (originsTabs.historical?.id === activeSectionId) setActiveTabId('historical');
       else if (originsTabs.geographical?.id === activeSectionId) setActiveTabId('geographical');
       else if (originsTabs.mission?.id === activeSectionId) setActiveTabId('mission');
       else setActiveTabId('historical');
    } else if (isPositionMode && activeSectionId) {
       if (positionTabs.ecosystem?.id === activeSectionId) setActiveTabId('ecosystem');
       else if (positionTabs.legal?.id === activeSectionId) setActiveTabId('legal');
       else if (positionTabs.charter?.id === activeSectionId) setActiveTabId('charter');
       else setActiveTabId('ecosystem');
    } else {
       if (isOriginsMode) setActiveTabId('historical');
       else if (isPositionMode) setActiveTabId('ecosystem');
       else setActiveTabId('intro');
    }
  }, [activeSectionId, departmentTabs, originsTabs, positionTabs, article.title, isDepartmentMode, isOriginsMode, isPositionMode]);
  
  useEffect(() => {
      setIsFilterOpen(false);
      setLocalIsEditing(false); // Reset local edit when tab changes
      setShowSystemSettings(false); // Reset settings view on nav change
  }, [activeTabId, article.title]);


  // --- Specific Page Renders ---
  
  // 1. Priority Views (Override everything)
  if (article.title === 'صفحه اصلی') return <div className="bg-transparent"><HomeDashboard onNavigate={onNavigate || (() => {})} /></div>;
  if (article.title === 'تکامل') return <EvolutionTimeline />;
  if (article.title === 'چارت سازمانی') return <OrgChartView />;
  if (article.title === 'تنظیمات پایه' || article.title === 'مدیریت سیستم' || showSystemSettings) return <SystemDefinitionsView />;
  
  // 2. Standalone Data Views
  if (article.title === 'عملکرد' || article.title === 'تحلیل عملکرد') return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <FinancialAnalysisView isEditing={isEditing} />
    </div>
  );

  if (article.title === 'تقویم' || article.title === 'گاه‌شمار فعالیت‌ها') return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm relative">
       {isEditing && (
         <div className="absolute top-4 left-4 z-20">
             <button onClick={() => propIsEditing ? onEdit() : setLocalIsEditing(false)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                <Check size={16} /> <span>خروج از ویرایش</span>
             </button>
         </div>
       )}
       {!isEditing && (
         <div className="absolute top-4 left-4 z-20">
             <button onClick={() => setLocalIsEditing(true)} className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 p-2 rounded-lg">
                <Edit2 size={16} />
             </button>
         </div>
       )}
       <TimelineView isEditing={isEditing} />
    </div>
  );

  if (article.title === 'منابع فیزیکی') return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm relative">
       {isEditing && (
         <div className="absolute top-4 left-4 z-20">
             <button onClick={() => propIsEditing ? onEdit() : setLocalIsEditing(false)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                <Check size={16} /> <span>خروج از ویرایش</span>
             </button>
         </div>
       )}
       {!isEditing && (
         <div className="absolute top-4 left-4 z-20">
             <button onClick={() => setLocalIsEditing(true)} className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 p-2 rounded-lg">
                <Edit2 size={16} />
             </button>
         </div>
       )}
       <PhysicalResourcesView isEditing={isEditing} />
    </div>
  );

  // HR Root Page (Universal Access)
  if (article.title === 'سرمایه انسانی') return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm relative min-h-[600px]">
       
       {/* System Settings Button Injection */}
       <div className="absolute top-6 left-6 z-20">
           <button 
             onClick={() => setShowSystemSettings(true)}
             className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-slate-600 dark:text-slate-300 hover:text-primary-700 dark:hover:text-primary-400 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold transition-colors"
           >
               <Settings size={14} />
               <span>تنظیمات سیستم (Admin)</span>
           </button>
       </div>

       <UniversalStaffList 
         department="سرمایه انسانی"
         isEditable={true} 
       />
    </div>
  );

  if (article.title === 'گزارشات جامع مالی') return <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm"><MacroFinancialView /></div>;


  // --- 4. Standard Simple Page View ---
  if (!isDepartmentMode && !isOriginsMode && !isPositionMode) {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 min-h-[80vh] flex flex-col transition-all duration-300 relative overflow-hidden">
           {/* Header */}
           <div className="px-6 py-6 md:px-10 md:py-8 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <div>
                    <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight">{article.title}</h1>
                 </div>
                 <div className="flex items-center gap-2">
                    <button 
                       onClick={onEdit}
                       className="p-2.5 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 bg-slate-50 dark:bg-slate-700/50 hover:bg-primary-50 dark:hover:bg-primary-900/20 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors"
                       title="ویرایش محتوا"
                    >
                       <Edit2 size={18} />
                    </button>
                 </div>
              </div>
           </div>
           <div className="p-6 md:p-10 bg-slate-50/30 dark:bg-black/10 flex-1">
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-5xl mx-auto">
                     <div className="prose prose-slate dark:prose-invert max-w-none prose-p:text-justify prose-headings:font-black prose-img:rounded-2xl prose-a:text-primary-600 dark:prose-a:text-primary-400">
                        {article.contentHtml && article.contentHtml.trim() !== '' ? (
                            <div dangerouslySetInnerHTML={{ __html: article.contentHtml }} />
                        ) : (
                             <div className="flex flex-col items-center justify-center py-12 text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
                                <Package size={48} strokeWidth={1} className="mb-4 opacity-50" />
                                <p>محتوایی ثبت نشده است.</p>
                             </div>
                        )}
                     </div>
                </div>
           </div>
        </div>
    );
  }

  // --- 5. Tabbed View (Department or Origins or Position) ---
  
  let tabs: { id: string; label: string; icon: React.ReactNode }[] = [];
  let showFilterButton = false;

  if (isOriginsMode) {
      tabs = [
          { id: 'historical', label: 'تاریخی', icon: <History size={18} /> },
          { id: 'geographical', label: 'جغرافیایی', icon: <Map size={18} /> },
          { id: 'mission', label: 'ماموریتی', icon: <Target size={18} /> }
      ];
  } else if (isPositionMode) {
      tabs = [
          { id: 'ecosystem', label: 'اکوسیستم سلامت', icon: <Activity size={18} /> },
          { id: 'legal', label: 'مبانی حقوقی', icon: <Scale size={18} /> },
          { id: 'charter', label: 'منشور سازمانی', icon: <FileText size={18} /> }
      ];
  } else {
      // Department Mode
      const introLabel = departmentTabs.intro?.title.includes('وظایف') ? 'وظایف' : 'معرفی';
      const hrLabel = departmentTabs.hr?.title.includes('اعضا') ? 'اعضا' : 'سرمایه‌های انسانی';
    
      const allTabs = [
        { id: 'intro', label: introLabel, icon: <Info size={18} /> },
        { id: 'hr', label: hrLabel, icon: <Users size={18} /> },
        { id: 'resources', label: 'تجهیزات', icon: <Package size={18} /> },
        { id: 'performance', label: 'عملکرد', icon: <Activity size={18} /> },
        { id: 'timeline', label: 'تقویم', icon: <Calendar size={18} /> },
      ];
    
      tabs = allTabs.filter(tab => {
          if (tab.id === 'intro') return true; 
          // Always show specialized tabs if we are in a department mode, even if empty, to allow adding data
          return true; 
      });
      showFilterButton = ['resources', 'performance', 'timeline'].includes(activeTabId);
  }

  const activeTabLabel = tabs.find(t => t.id === activeTabId)?.label || tabs[0]?.label || 'نمایش';

  // Helper to check if current tab supports Local Editing (Data Entry Mode)
  const supportsLocalEditing = ['hr', 'resources', 'timeline'].includes(activeTabId);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 min-h-[80vh] flex flex-col transition-all duration-300 relative">
       
       <div className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 transition-all duration-300 rounded-t-2xl shadow-sm">
          
          {/* Mobile Tab Selector */}
          <div className="md:hidden p-4 flex flex-col gap-3">
            <div className="relative">
                <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className={`w-full flex items-center justify-between px-4 py-3 border rounded-xl shadow-sm transition-all
                        ${isMobileMenuOpen 
                            ? 'bg-white dark:bg-slate-800 border-primary-500 ring-1 ring-primary-500' 
                            : 'bg-primary-50 dark:bg-slate-800/80 border-primary-200 dark:border-primary-800 text-primary-900 dark:text-primary-100'}
                    `}
                >
                    <div className="flex items-center gap-2 overflow-hidden">
                        <span className="text-xs opacity-70 whitespace-nowrap">بخش فعال:</span>
                        <span className="font-black truncate">{activeTabLabel}</span>
                    </div>
                    <ChevronDown className={`text-slate-500 transition-transform duration-200 shrink-0 ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isMobileMenuOpen && (
                    <div className="absolute top-full left-0 right-0 z-50 mt-2 flex flex-col gap-2 bg-slate-50 dark:bg-slate-900 p-2 rounded-xl border border-slate-100 dark:border-slate-800 animate-in slide-in-from-top-2 shadow-lg">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => { setActiveTabId(tab.id); setIsMobileMenuOpen(false); }}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-colors
                                    ${activeTabId === tab.id 
                                        ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300' 
                                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}
                                `}
                            >
                                {tab.icon}
                                <span>{tab.label}</span>
                                {activeTabId === tab.id && <div className="mr-auto w-2 h-2 rounded-full bg-primary-500"></div>}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Mobile Actions Row */}
            <div className="flex gap-2">
                {/* System Settings - Mobile */}
                {activeTabId === 'hr' && (
                    <button 
                        onClick={() => setShowSystemSettings(true)}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-sm border border-slate-200 dark:border-slate-700"
                    >
                        <Settings size={18} />
                        <span>تنظیمات</span>
                    </button>
                )}

                {showFilterButton && (
                <button 
                    onClick={() => setIsFilterOpen(true)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-300 dark:hover:border-primary-700 transition-colors shadow-sm"
                >
                    <Filter size={20} />
                    <span className="text-sm font-bold">فیلترها</span>
                </button>
                )}
                
                {/* Edit Button in Mobile Tab View - Use Local State */}
                {supportsLocalEditing && (
                    <button 
                        onClick={() => setLocalIsEditing(!localIsEditing)}
                        className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 border rounded-xl font-bold text-sm shadow-sm transition-colors 
                        ${localIsEditing 
                            ? 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-primary-50 dark:hover:bg-primary-900/20'}`}
                    >
                         {localIsEditing ? <Check size={18}/> : <Edit2 size={18} />}
                         <span>{localIsEditing ? 'پایان ویرایش' : 'مدیریت داده‌ها'}</span>
                    </button>
                )}
            </div>
          </div>

          {/* Desktop Tabs Navigation */}
          <div className="hidden md:flex items-center justify-between px-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-0 no-scrollbar">
                  {tabs.map(tab => (
                      <button 
                        key={tab.id}
                        onClick={() => setActiveTabId(tab.id)}
                        className={`flex items-center gap-2 px-5 py-5 text-sm font-bold whitespace-nowrap transition-all border-b-2 relative top-[1px]
                            ${activeTabId === tab.id 
                                ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:border-slate-300'}
                            `}
                      >
                          {tab.icon}
                          <span>{tab.label}</span>
                      </button>
                  ))}
              </div>
              
              <div className="flex items-center gap-3">
                   {/* System Settings Button (Desktop) */}
                   {activeTabId === 'hr' && (
                       <button 
                         onClick={() => setShowSystemSettings(true)}
                         className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg transition-all border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-primary-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                         title="مدیریت دپارتمان‌ها و عناوین شغلی"
                       >
                           <Settings size={16} />
                           <span>تنظیمات سیستم</span>
                       </button>
                   )}

                   {/* Edit Button Desktop - Use Local State */}
                   {supportsLocalEditing && (
                       <button 
                         onClick={() => setLocalIsEditing(!localIsEditing)}
                         className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg transition-all border 
                           ${localIsEditing 
                             ? 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' 
                             : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-primary-50 dark:hover:bg-primary-900/30 border-transparent hover:border-slate-300'}`}
                       >
                           {localIsEditing ? <Check size={14}/> : <Edit2 size={14} />}
                           <span>{localIsEditing ? 'پایان ویرایش' : 'مدیریت داده‌ها'}</span>
                       </button>
                   )}

                   {showFilterButton && (
                      <button 
                        onClick={() => setIsFilterOpen(true)}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                      >
                        <Filter size={16} />
                        <span>فیلترها</span>
                      </button>
                   )}
              </div>
          </div>
       </div>

       {/* Tab Content Area */}
       <div className="p-6 md:p-10 bg-slate-50/30 dark:bg-black/10 flex-1">
            
            {(activeTabId === 'intro' || activeTabId === 'historical' || activeTabId === 'geographical' || activeTabId === 'mission' || activeTabId === 'ecosystem' || activeTabId === 'legal' || activeTabId === 'charter') && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-5xl mx-auto">
                     <div className="prose prose-slate dark:prose-invert max-w-none prose-p:text-justify prose-headings:font-black prose-img:rounded-2xl prose-a:text-primary-600 dark:prose-a:text-primary-400">
                        
                        {/* Main Article Content */}
                        {activeTabId === 'intro' && article.contentHtml && article.contentHtml.trim() !== '' && (
                            <div dangerouslySetInnerHTML={{ __html: article.contentHtml }} />
                        )}
                        
                        {/* Edit Button for Intro - Calls global editor via prop */}
                        {activeTabId === 'intro' && (
                             <div className="mt-4 flex justify-end">
                                 <button onClick={onEdit} className="flex items-center gap-2 text-sm text-primary-600 hover:underline">
                                     <Edit2 size={14} />
                                     ویرایش متن
                                 </button>
                             </div>
                        )}

                        {/* Sub-Article Content */}
                        {(isOriginsMode || isPositionMode) ? (
                            (isOriginsMode ? originsTabs[activeTabId as keyof typeof originsTabs] : positionTabs[activeTabId as keyof typeof positionTabs]) ? (
                                <div dangerouslySetInnerHTML={{ __html: (isOriginsMode ? originsTabs[activeTabId as keyof typeof originsTabs] : positionTabs[activeTabId as keyof typeof positionTabs])?.contentHtml || '' }} />
                            ) : (
                                <div className="text-center text-slate-400 py-10">محتوایی ثبت نشده است.</div>
                            )
                        ) : null}

                         {/* Edit Button for Sub-Articles */}
                         {(isOriginsMode || isPositionMode) && (
                            <div className="mt-4 flex justify-end">
                                <button 
                                  onClick={() => onEditSubArticle && onEditSubArticle((isOriginsMode ? originsTabs[activeTabId as keyof typeof originsTabs] : positionTabs[activeTabId as keyof typeof positionTabs])?.title || '')} 
                                  className="flex items-center gap-2 text-sm text-primary-600 hover:underline"
                                >
                                    <Edit2 size={14} />
                                    ویرایش این بخش
                                </button>
                            </div>
                         )}
                     </div>
                </div>
            )}

            {/* HR / Staff List - Uses the Universal Component */}
            {activeTabId === 'hr' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <UniversalStaffList 
                        department={article.title}
                        isEditable={isEditing}
                    />
                </div>
            )}

            {/* Physical Resources */}
            {activeTabId === 'resources' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <PhysicalResourcesView 
                        embedded={true} 
                        isFilterOpen={isFilterOpen} 
                        onFilterClose={() => setIsFilterOpen(false)}
                        isEditing={isEditing}
                    />
                </div>
            )}

            {/* Performance Analysis */}
            {activeTabId === 'performance' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <FinancialAnalysisView 
                        embedded={true}
                        isFilterOpen={isFilterOpen} 
                        onFilterClose={() => setIsFilterOpen(false)}
                        isEditing={isEditing}
                    />
                </div>
            )}

            {/* Timeline */}
            {activeTabId === 'timeline' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                     <TimelineView 
                        embedded={true}
                        isFilterOpen={isFilterOpen} 
                        onFilterClose={() => setIsFilterOpen(false)}
                        isEditing={isEditing}
                     />
                </div>
            )}
       </div>
    </div>
  );
};

export default ArticleView;
