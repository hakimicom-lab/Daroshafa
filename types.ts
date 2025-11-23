

export interface WikiArticle {
  title: string;
  contentHtml: string; // Pre-rendered HTML with Tailwind classes
  lastEdited: string;
  category: string;
  isTemplate?: boolean;
}

export interface NavNode {
  id: string;
  label: string;
  children?: NavNode[];
  isExpanded?: boolean;
  type?: 'group' | 'item' | 'separator';
  hideChildren?: boolean; // New property to hide children in navigation but keep them for logic
  imageUrl?: string; // URL of the image associated with the node
}

export enum ViewMode {
  READ = 'READ',
  EDIT = 'EDIT'
}

// --- Financial Module Types ---

export interface Attachment {
  id: string;
  name: string;
  url: string;
  size?: string;
  type?: string;
}

export interface BudgetRecord {
  id: string;
  year: number;
  costCenter: string; // e.g., "Department of Surgery", "IT Infrastructure"
  category: 'Current' | 'Capital'; // Jari (Operational) vs Omrani (Capital/Development)
  approvedAmount: number; // In Rials/Tomans
  actualAmount: number;
  variancePercent: number;
  description?: string;
  attachments: Attachment[];
}

export interface FinancialPerformance {
  id: string;
  period: string; // e.g., "1402-Q1"
  revenueType: 'Insurance' | 'Private' | 'Donation' | 'Government';
  revenueAmount: number;
  costType: 'Personnel' | 'Consumables' | 'Overhead' | 'Depreciation';
  costAmount: number;
  operationalMargin: number; // Percentage
  netIncome: number;
}

export interface AuditFinding {
  id: string;
  description: string;
  status: 'Resolved' | 'Pending' | 'In_Progress';
  priority: 'High' | 'Medium' | 'Low';
}

export interface AuditLog {
  id: string;
  year: number;
  auditFirm: string;
  opinion: 'Unqualified' | 'Qualified' | 'Adverse'; // Maqbool (Clean), Mashroot (Qualified), Mardood (Adverse)
  findings: AuditFinding[];
  reportFile?: Attachment;
  date: string;
}

export interface CSRRecord {
  id: string;
  year: number;
  supportType: 'Discount' | 'Free' | 'Grant';
  targetGroup: string; // e.g., "Underprivileged Patients", "Orphans"
  amountSpent: number;
  beneficiaryCount: number;
  fundingSource: string; // e.g., "Specific Donations", "Hospital Revenue"
}

// Tree data structure for Darolshafa Kowsar
export const INITIAL_TREE_DATA: NavNode[] = [
  {
    id: 'grp-strategy',
    label: 'هویت و راهبرد',
    children: [
      {
        id: 'g1',
        label: 'ارزش‌آفرینان',
        children: [
          { id: 'g1-1', label: 'تولیت فقید آستان مقدس' },
          { id: 'g1-2', label: 'تولیت محترم آستان مقدس' },
          { 
            id: 'g1-trustees', 
            label: 'هیات امناء',
            hideChildren: true,
            children: [
               { id: 'g1-trustees-1', label: 'وظایف' },
               { id: 'g1-trustees-2', label: 'اعضا' }
            ]
          },
          { 
            id: 'g1-directors', 
            label: 'هیات مدیره',
            hideChildren: true,
            children: [
               { id: 'g1-directors-1', label: 'وظایف' },
               { id: 'g1-directors-2', label: 'اعضا' }
            ]
          },
          { id: 'g1-4', label: 'بانیان و خیرین (شاخص)' }
        ]
      },
      {
        id: 'g2',
        label: 'از خاستگاه تا جایگاه',
        children: [
          { 
            id: 'g2-1', 
            label: 'خاستگاه',
            hideChildren: true,
            children: [
              { id: 'g2-1-1', label: 'تاریخی' },
              { id: 'g2-1-2', label: 'جغرافیایی' },
              { id: 'g2-1-3', label: 'ماموریتی' }
            ]
          },
          { id: 'g2-3', label: 'تکامل' },
          { 
            id: 'g2-2', 
            label: 'جایگاه',
            hideChildren: true,
            children: [
              { id: 'g2-2-1', label: 'اکوسیستم سلامت' },
              { id: 'g2-2-2', label: 'مبانی حقوقی' },
              { id: 'g2-2-3', label: 'منشور سازمانی' }
            ]
          }
        ]
      },
      {
        id: 'g6',
        label: 'راهبرد و افق آینده',
        children: [
          { id: 'g6-1', label: 'تحلیل جامع وضعیت (SWOT)' },
          { id: 'g6-2', label: 'نقشه راه آینده ۱۴۰۴-۱۴۰۸' },
          { id: 'g6-3', label: 'چارت سازمانی' }
        ]
      }
    ]
  },
  {
    id: 'grp-functional',
    label: 'عملکرد و گزارش‌ها',
    children: [
      {
        id: 'g3',
        label: 'گستره خدمات و عملیات',
        children: [
          {
            id: 'g3-medical',
            label: 'خدمات تخصصی و پاراکلینیک',
            children: [
                {
                    id: 'g3-spec-1',
                    label: 'چشم',
                    hideChildren: true, // Hides children in Sidebar, allowing Tabs on page
                    children: [
                      { id: 'g3-spec-1-1', label: 'معرفی خدمت' },
                      { id: 'g3-spec-1-2', label: 'سرمایه انسانی' },
                      { id: 'g3-spec-1-3', label: 'منابع فیزیکی' },
                      { id: 'g3-spec-1-4', label: 'عملکرد' },
                      { id: 'g3-spec-1-5', label: 'تقویم' }
                    ]
                },
                { id: 'g3-spec-2', label: 'گوش، حلق و بینی' },
                { id: 'g3-spec-3', label: 'دندان' },
                { id: 'g3-spec-4', label: 'مغز و اعصاب' },
                { id: 'g3-spec-5', label: 'قلب و عروق' },
                { id: 'g3-spec-6', label: 'ارتوپدی و طب فیزیکی' },
                { id: 'g3-spec-7', label: 'گوارش' },
                { id: 'g3-spec-8', label: 'کلیه و مجاری ادراری (اورولوژی)' },
                { id: 'g3-spec-9', label: 'زنان و زایمان' },
                { id: 'g3-spec-10', label: 'جراحی عمومی' },
                { id: 'g3-spec-11', label: 'سایر حوزه‌های تخصصی' },
                { id: 'sep-1', label: '', type: 'separator' },
                { id: 'g3-para-1', label: 'تصویربرداری پزشکی' },
                { id: 'g3-para-2', label: 'آزمایشگاه تشخیص طبی' },
                { id: 'g3-para-3', label: 'مرکز جراحی محدود (دی‌کلینیک)' },
                { id: 'g3-para-4', label: 'داروخانه' },
                { id: 'g3-para-5', label: 'کلینیک عمومی و اورژانس' },
                { id: 'g3-para-6', label: 'فیزیوتراپی و توانبخشی' }
            ]
          },
          {
             id: 'g3-support',
             label: 'امور اداری و پشتیبانی',
             children: [
                {
                    id: 'g3-admin-1',
                    label: 'مالی',
                    children: [
                      { id: 'g3-admin-1-1', label: 'معرفی و ساختار' },
                      { id: 'g3-admin-1-2', label: 'گزارشات جامع مالی' },
                      { id: 'g3-admin-1-3', label: 'سرمایه‌های انسانی' }
                    ]
                },
                { id: 'g3-admin-2', label: 'اداری و رفاهی' },
                { id: 'g3-admin-3', label: 'فناوری اطلاعات (IT)' },
                { id: 'g3-admin-4', label: 'فرهنگی' },
                { id: 'g3-admin-5', label: 'حراست' },
                { id: 'g3-admin-6', label: 'آموزش و توسعه کارکنان' },
                { id: 'sep-2', label: '', type: 'separator' },
                { id: 'g3-ops-1', label: 'پشتیبانی و خدمات عمومی' },
                { id: 'g3-ops-2', label: 'بهداشت محیط' },
                { id: 'g3-ops-3', label: 'بهداشت حرفه‌ای' }
             ]
          },
          {
            id: 'g3-social',
            label: 'خدمات و مسئولیت‌های اجتماعی',
            children: [
                { id: 'g3-social-1', label: 'خدمات درمانی در مناسبت‌ها' },
                { id: 'g3-social-2', label: 'خدمات حمایتی و مددکاری' }
            ]
          }
        ]
      },
      {
        id: 'g4',
        label: 'کیفیت، ایمنی و بهبود مستمر',
        children: [
          { id: 'g4-1', label: 'تضمین کیفیت و ایمنی بیمار' },
          { id: 'g4-2', label: 'سلامت و ایمنی محیط کار (HSE)' }
        ]
      },
      {
        id: 'g5',
        label: 'جایگاه اجتماعی و تعاملات',
        children: [
          { id: 'g5-1', label: 'تعاملات راهبردی' },
          { id: 'g5-2', label: 'کارنامه افتخارات' }
        ]
      },
    ]
  },
  {
    id: 'grp-wiki',
    label: 'دانشنامه دارالشفاء',
    children: [
      {
        id: 'g7',
        label: 'دانشنامه',
        children: [
          { id: 'g7-1', label: 'بنیادها و ساختارها' },
          { id: 'g7-2', label: 'سرمایه انسانی' },
          { id: 'g7-3', label: 'فناوری‌ها و دارایی‌های استراتژیک' },
          { id: 'g7-4', label: 'شناسنامه پروژه‌های توسعه' },
          { id: 'g7-5', label: 'کارنامه افتخارات و استانداردها' },
          { id: 'g7-6', label: 'فهرست شرکا و طرف‌های قرارداد' },
          { id: 'g7-7', label: 'آرشیو معماری و هویت بصری' },
          { id: 'g7-8', label: 'واژه‌نامه' },
          { id: 'g7-9', label: 'ساختار' }
        ]
      }
    ]
  }
];