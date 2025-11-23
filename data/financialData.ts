
import { BudgetRecord, FinancialPerformance, AuditLog, CSRRecord } from '../types';

export const BUDGET_DATA: BudgetRecord[] = [
  {
    id: 'bg-1403-01',
    year: 1403,
    costCenter: 'توسعه کلینیک چشم (ساختمان جدید)',
    category: 'Capital',
    approvedAmount: 50000000000, // 50 Billion Rials
    actualAmount: 25000000000,
    variancePercent: 0, // On track (50% mid-year)
    description: 'احداث فاز ۳ ساختمان تخصصی',
    attachments: [
      { id: 'att-1', name: 'مصوبه_هیات_مدیره.pdf', url: '#', size: '1.2 MB' }
    ]
  },
  {
    id: 'bg-1403-02',
    year: 1403,
    costCenter: 'خرید تجهیزات پزشکی (OCT)',
    category: 'Capital',
    approvedAmount: 12000000000,
    actualAmount: 13500000000,
    variancePercent: 12.5, // Over budget
    description: 'خرید دستگاه OCT زایس به دلیل نوسانات ارزی',
    attachments: []
  },
  {
    id: 'bg-1403-03',
    year: 1403,
    costCenter: 'حقوق و دستمزد کادر درمان',
    category: 'Current',
    approvedAmount: 180000000000,
    actualAmount: 92000000000,
    variancePercent: 2, // Slightly over expected for half year
    description: 'حقوق و مزایای پزشکان و پرستاران',
    attachments: []
  },
  {
    id: 'bg-1403-04',
    year: 1403,
    costCenter: 'هزینه‌های نگهداشت و تاسیسات',
    category: 'Current',
    approvedAmount: 8000000000,
    actualAmount: 3000000000,
    variancePercent: -25, // Under budget (Good)
    description: 'سرویس دوره‌ای چیلرها و آسانسور',
    attachments: []
  },
  {
    id: 'bg-1403-05',
    year: 1403,
    costCenter: 'خرید ملزومات مصرفی پزشکی',
    category: 'Current',
    approvedAmount: 45000000000,
    actualAmount: 48000000000,
    variancePercent: 6.6,
    description: 'افزایش قیمت لنز و دارو',
    attachments: []
  },
  {
    id: 'bg-1403-06',
    year: 1403,
    costCenter: 'آموزش و پژوهش',
    category: 'Current',
    approvedAmount: 2000000000,
    actualAmount: 500000000,
    variancePercent: -75, // Under utilization
    description: 'برگزاری سمینارهای علمی',
    attachments: []
  }
];

export const AUDIT_DATA: AuditLog[] = [
  {
    id: 'aud-1402',
    year: 1402,
    auditFirm: 'موسسه حسابرسی مفید راهبر',
    opinion: 'Unqualified', // Clean
    date: '۱۴۰۳/۰۴/۱۵',
    reportFile: { id: 'rep-1402', name: 'گزارش_حسابرسی_۱۴۰۲.pdf', url: '#', size: '3.2 MB' },
    findings: [
      {
        id: 'f-1402-1',
        description: 'ثبت اسناد دارایی‌های ثابت به صورت تجمیعی در برخی سرفصل‌ها',
        status: 'Resolved',
        priority: 'Low'
      }
    ]
  },
  {
    id: 'aud-1401',
    year: 1401,
    auditFirm: 'موسسه حسابرسی مفید راهبر',
    opinion: 'Qualified', // Mashroot
    date: '۱۴۰۲/۰۴/۲۰',
    reportFile: { id: 'rep-1401', name: 'گزارش_حسابرسی_۱۴۰۱.pdf', url: '#', size: '3.1 MB' },
    findings: [
      {
        id: 'f-1401-1',
        description: 'عدم تطابق موجودی انبار داروخانه با سیستم حسابداری در پایان سال',
        status: 'Resolved',
        priority: 'High'
      },
      {
        id: 'f-1401-2',
        description: 'تاخیر در ثبت اسناد هزینه‌ای پیمانکاران ساختمانی',
        status: 'Resolved',
        priority: 'Medium'
      }
    ]
  },
  {
    id: 'aud-1400',
    year: 1400,
    auditFirm: 'موسسه حسابرسی آگاهان تراز',
    opinion: 'Qualified',
    date: '۱۴۰۱/۰۴/۱۲',
    findings: [
      {
        id: 'f-1400-1',
        description: 'مغایرت در حساب‌های دریافتنی بیمه‌های تکمیلی',
        status: 'Resolved',
        priority: 'Medium'
      },
      {
        id: 'f-1400-2',
        description: 'نقص در مستندات مناقصات خرید تجهیزات سرمایه‌ای',
        status: 'Pending',
        priority: 'High'
      }
    ]
  }
];

export const CSR_DATA: CSRRecord[] = [
  {
    id: 'csr-1',
    year: 1403,
    supportType: 'Free',
    targetGroup: 'بیماران کمیته امداد',
    amountSpent: 15000000000, // 15 Billion Rials
    beneficiaryCount: 450,
    fundingSource: 'منابع داخلی'
  },
  {
    id: 'csr-2',
    year: 1403,
    supportType: 'Discount',
    targetGroup: 'خانواده شهدا و جانبازان',
    amountSpent: 8000000000,
    beneficiaryCount: 1200,
    fundingSource: 'مصوبات هیات مدیره'
  },
  {
    id: 'csr-3',
    year: 1403,
    supportType: 'Free',
    targetGroup: 'مناطق محروم (اردوی جهادی)',
    amountSpent: 5000000000,
    beneficiaryCount: 2000,
    fundingSource: 'خیرین سلامت'
  },
  {
    id: 'csr-4',
    year: 1403,
    supportType: 'Discount',
    targetGroup: 'بیماران خاص (MS/سرطان)',
    amountSpent: 3500000000,
    beneficiaryCount: 150,
    fundingSource: 'منابع داخلی'
  }
];

export const PERFORMANCE_DATA: FinancialPerformance[] = [
  { id: 'fp-1403', period: '۱۴۰۳', revenueType: 'Insurance', revenueAmount: 550000000000, costType: 'Personnel', costAmount: 451000000000, operationalMargin: 18, netIncome: 99000000000 },
  { id: 'fp-1402', period: '۱۴۰۲', revenueType: 'Insurance', revenueAmount: 450000000000, costType: 'Personnel', costAmount: 382000000000, operationalMargin: 15.1, netIncome: 68000000000 },
  { id: 'fp-1401', period: '۱۴۰۱', revenueType: 'Insurance', revenueAmount: 320000000000, costType: 'Personnel', costAmount: 278000000000, operationalMargin: 13.1, netIncome: 42000000000 },
  { id: 'fp-1400', period: '۱۴۰۰', revenueType: 'Insurance', revenueAmount: 210000000000, costType: 'Personnel', costAmount: 189000000000, operationalMargin: 10, netIncome: 21000000000 },
  { id: 'fp-1399', period: '۱۳۹۹', revenueType: 'Insurance', revenueAmount: 150000000000, costType: 'Personnel', costAmount: 138000000000, operationalMargin: 8, netIncome: 12000000000 }
];

// Chart Specific Data
export const REVENUE_COMPOSITION_DATA = [
  { year: '۱۴۰۰', insurance: 120, private: 60, donation: 30 },
  { year: '۱۴۰۱', insurance: 180, private: 90, donation: 50 },
  { year: '۱۴۰۲', insurance: 250, private: 130, donation: 70 },
  { year: '۱۴۰۳', insurance: 310, private: 160, donation: 80 },
];

export const PERFORMANCE_TREND_DATA = [
  { year: '۱۳۹۹', revenue: 150, expense: 138, profit: 12 },
  { year: '۱۴۰۰', revenue: 210, expense: 189, profit: 21 },
  { year: '۱۴۰۱', revenue: 320, expense: 278, profit: 42 },
  { year: '۱۴۰۲', revenue: 450, expense: 382, profit: 68 },
  { year: '۱۴۰۳', revenue: 550, expense: 451, profit: 99 },
];
