

import React from 'react';
import { 
  Activity, Users, Package, Calendar, Briefcase, ShieldCheck, 
  Eye, Heart, Brain, Bone, Stethoscope, Pill, TestTube, Image as ImageIcon, 
  Laptop, Banknote, Shield, BookOpen, GraduationCap, Wrench, Baby, Smile,
  Component, Layers, ArrowLeft, PieChart, Ear, Scissors, Microscope, Siren,
  Bean
} from 'lucide-react';
import { INITIAL_TREE_DATA, NavNode } from '../types';
import FinancialHealthWidget from './FinancialHealthWidget';

interface HomeDashboardProps {
  onNavigate: (topic: string) => void;
}

// --- Smart Icon Logic ---
const getIconForTitle = (title: string) => {
  const t = title.toLowerCase();
  const iconClass = "text-slate-500 dark:text-slate-400 group-hover:text-white transition-colors";
  
  // Specialized & Paraclinical
  if (t.includes('چشم')) return <Eye size={18} className={iconClass} />;
  if (t.includes('گوش') || t.includes('حلق')) return <Ear size={18} className={iconClass} />;
  if (t.includes('دندان')) return <Smile size={18} className={iconClass} />;
  if (t.includes('مغز')) return <Brain size={18} className={iconClass} />;
  if (t.includes('قلب')) return <Heart size={18} className={iconClass} />;
  if (t.includes('ارتوپدی') || t.includes('طب فیزیکی')) return <Bone size={18} className={iconClass} />;
  if (t.includes('زنان') || t.includes('زایمان')) return <Baby size={18} className={iconClass} />;
  if (t.includes('جراحی')) return <Scissors size={18} className={iconClass} />;
  if (t.includes('آزمایشگاه')) return <Microscope size={18} className={iconClass} />;
  if (t.includes('داروخانه')) return <Pill size={18} className={iconClass} />;
  if (t.includes('تصویربرداری')) return <ImageIcon size={18} className={iconClass} />;
  if (t.includes('اورژانس') || t.includes('عمومی')) return <Siren size={18} className={iconClass} />;
  if (t.includes('فیزیوتراپی')) return <Activity size={18} className={iconClass} />;
  if (t.includes('کلیه') || t.includes('مجاری')) return <Bean size={18} className={iconClass} />;
  if (t.includes('گوارش') || t.includes('داخلی')) return <Stethoscope size={18} className={iconClass} />;

  // Support & Admin
  if (t.includes('فناوری') || t.includes('it')) return <Laptop size={18} className={iconClass} />;
  if (t.includes('مالی')) return <Banknote size={18} className={iconClass} />;
  if (t.includes('حراست')) return <Shield size={18} className={iconClass} />;
  if (t.includes('آموزش')) return <GraduationCap size={18} className={iconClass} />;
  if (t.includes('فرهنگی')) return <BookOpen size={18} className={iconClass} />;
  if (t.includes('تاسیسات') || t.includes('پشتیبانی')) return <Wrench size={18} className={iconClass} />;
  if (t.includes('اداری')) return <Briefcase size={18} className={iconClass} />;
  
  return <Layers size={18} className={iconClass} />;
};

// --- New Bento Service Card ---
const ServiceBentoCard: React.FC<{
    title: string;
    description: string;
    items: NavNode[];
    icon: React.ReactNode;
    colorClass: string;
    onNavigate: (t: string) => void;
}> = ({ title, description, items, icon, colorClass, onNavigate }) => {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col h-full group relative overflow-hidden">
            {/* Top Accent */}
            <div className={`absolute top-0 left-0 w-full h-1 ${colorClass}`}></div>
            
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-1">{title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
                </div>
                <div className={`p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 ${colorClass.replace('bg-', 'text-')} bg-opacity-20`}>
                    {icon}
                </div>
            </div>

            {/* Interactive Chips Grid */}
            <div className="flex flex-wrap gap-2 mt-auto pt-4">
                {items.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onNavigate(item.label)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-primary-600 dark:hover:bg-primary-600 hover:text-white dark:hover:text-white text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold transition-all group border border-slate-100 dark:border-slate-700 hover:border-primary-600"
                    >
                        <span className="opacity-70">{getIconForTitle(item.label)}</span>
                        <span>{item.label.replace('حوزه', '').trim()}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

const HomeDashboard: React.FC<HomeDashboardProps> = ({ onNavigate }) => {
  // Navigation Logic: Find nested nodes in flattened Goftar 3 structure
  const functionalGroup = INITIAL_TREE_DATA.find(n => n.id === 'grp-functional');
  const goftar3 = functionalGroup?.children?.find(n => n.id === 'g3'); // Goftar 3

  // 1. Medical Services (Specialized + Paraclinical)
  // Flattened: Direct children of g3-medical
  const medicalGroup = goftar3?.children?.find(n => n.id === 'g3-medical');
  const allMedicalItems = medicalGroup?.children || [];

  // 2. Support Services (Admin + Ops)
  // Flattened: Direct children of g3-support
  const supportGroup = goftar3?.children?.find(n => n.id === 'g3-support');
  const allSupportItems = supportGroup?.children || [];

  // 3. Social Services
  const socialItems = goftar3?.children?.find(n => n.id === 'g3-social')?.children || [];

  return (
    <div className="p-4 md:p-8 min-h-[80vh] flex flex-col gap-10">
      
      {/* HERO SECTION: Service Bento Grid */}
      <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Briefcase className="text-primary-600" />
              <span>خدمات و مأموریت‌های اصلی</span>
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Card 1: Specialized & Paraclinical */}
              <ServiceBentoCard 
                  title="خدمات تخصصی و پاراکلینیک"
                  description="کلینیک‌های فوق‌تخصصی، تصویربرداری و آزمایشگاه"
                  items={allMedicalItems}
                  icon={<Stethoscope size={24} />}
                  colorClass="bg-primary-500"
                  onNavigate={onNavigate}
              />
               {/* Card 2: Admin & Support */}
               <ServiceBentoCard 
                  title="امور اداری و پشتیبانی"
                  description="امور مالی، اداری، عملیاتی و زیرساخت"
                  items={allSupportItems}
                  icon={<Briefcase size={24} />}
                  colorClass="bg-primary-400"
                  onNavigate={onNavigate}
              />
               {/* Card 3: Social & Special */}
               <ServiceBentoCard 
                  title="خدمات اجتماعی"
                  description="مسئولیت اجتماعی و طرح‌های ویژه"
                  items={socialItems}
                  icon={<Heart size={24} />}
                  colorClass="bg-primary-600"
                  onNavigate={onNavigate}
              />
          </div>
      </div>

      {/* Analytical Modules Grid */}
      <div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <Activity className="text-primary-600 dark:text-primary-400" />
          <span>ماژول‌های تحلیلی و آماری</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Performance Analysis */}
          <div 
              onClick={() => onNavigate('عملکرد')}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 hover:border-primary-400 dark:hover:border-primary-600 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden"
          >
              <div className="absolute top-0 right-0 w-1.5 h-full bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Activity size={24} />
                </div>
                <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100">عملکرد</h4>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">داشبورد جامع شاخص‌های کمی و تحلیل‌های مالی.</p>
          </div>

          {/* Human Capital */}
          <div 
              onClick={() => onNavigate('سرمایه انسانی')}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 hover:border-primary-400 dark:hover:border-primary-600 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden"
          >
              <div className="absolute top-0 right-0 w-1.5 h-full bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users size={24} />
                </div>
                <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100">سرمایه انسانی</h4>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">بانک اطلاعات پزشکان، پرسنل و سوابق همکاری.</p>
          </div>

          {/* Physical Resources */}
          <div 
              onClick={() => onNavigate('منابع فیزیکی')}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 hover:border-primary-400 dark:hover:border-primary-600 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden"
          >
              <div className="absolute top-0 right-0 w-1.5 h-full bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Package size={24} />
                </div>
                <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100">منابع فیزیکی</h4>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">تجهیزات پزشکی، زیرساخت‌ها و دارایی‌های استراتژیک.</p>
          </div>

          {/* Timeline */}
          <div 
              onClick={() => onNavigate('تقویم')}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 hover:border-primary-400 dark:hover:border-primary-600 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden"
          >
              <div className="absolute top-0 right-0 w-1.5 h-full bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Calendar size={24} />
                </div>
                <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100">تقویم</h4>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">رویدادهای کلیدی، پروژه‌های عمرانی و نقاط عطف.</p>
          </div>

           {/* Financial Health Widget (Replaces simple Card) */}
           <div className="lg:col-span-2">
               <FinancialHealthWidget onNavigate={onNavigate} />
           </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto text-center border-t border-slate-200 dark:border-slate-800 pt-8 pb-4">
         <h2 className="text-lg font-black text-slate-700 dark:text-slate-300 tracking-tight">
           دانشنامه جامع دارالشفاء کوثر
         </h2>
         <p className="text-slate-400 dark:text-slate-500 text-xs mt-2">
           سامانه مدیریت دانش و رصد عملکرد سازمانی. جهت دسترسی به اطلاعات، از دسته‌بندی‌های هوشمند یا منوی ساختار استفاده نمایید.
         </p>
      </div>

    </div>
  );
};

export default HomeDashboard;