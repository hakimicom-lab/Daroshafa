
import React, { useEffect, useState, useMemo } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { StaffEvaluation, StaffMember } from '../types';
import { useSystemDefinitions } from '../hooks/useSystemDefinitions';
import { supabase } from '../supabaseClient';
import { X, Award, TrendingUp, Calendar } from 'lucide-react';

interface ReportCardModalProps {
  staff: StaffMember;
  onClose: () => void;
}

const ReportCardModal: React.FC<ReportCardModalProps> = ({ staff, onClose }) => {
  const { kpis } = useSystemDefinitions();
  const [evaluations, setEvaluations] = useState<StaffEvaluation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvals = async () => {
      const { data } = await supabase
        .from('staff_evaluations')
        .select('*')
        .eq('staff_id', staff.id)
        .order('evaluation_date', { ascending: true });
      
      if (data) setEvaluations(data as StaffEvaluation[]);
      setLoading(false);
    };
    fetchEvals();
  }, [staff.id]);

  // Transform Data for Radar Chart (Latest Evaluation)
  const radarData = useMemo(() => {
    if (evaluations.length === 0 || kpis.length === 0) return [];
    
    const latestEval = evaluations[evaluations.length - 1];
    
    return kpis.map(kpi => ({
      subject: kpi.title,
      A: latestEval.scores[kpi.id] || 0,
      fullMark: 100
    }));
  }, [evaluations, kpis]);

  // Transform Data for History Line Chart
  const historyData = useMemo(() => {
    return evaluations.map(ev => ({
      name: ev.period || ev.evaluation_date.split('-')[0], // Simplified date
      score: ev.total_score
    }));
  }, [evaluations]);

  const latestScore = evaluations.length > 0 ? evaluations[evaluations.length - 1].total_score : 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
        <div className="relative bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white dark:border-slate-700 shadow-sm">
                        <img src={staff.avatar_url || 'https://via.placeholder.com/100'} alt="" className="w-full h-full object-cover"/>
                    </div>
                    <div>
                        <h3 className="font-black text-lg text-slate-800 dark:text-white">{staff.full_name}</h3>
                        <p className="text-xs text-slate-500">گزارش عملکرد و ارزیابی</p>
                    </div>
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors bg-slate-200 dark:bg-slate-800 rounded-full p-1"><X size={18}/></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-900/50 custom-scrollbar">
                {loading ? (
                    <div className="text-center py-20 text-slate-400">در حال دریافت اطلاعات...</div>
                ) : evaluations.length === 0 ? (
                    <div className="text-center py-20 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
                        هیچ سابقه ارزیابی یافت نشد.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* LEFT: Current Score & Radar */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                             <div className="flex items-center justify-between mb-6">
                                 <h4 className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2"><Award size={18} className="text-yellow-500"/> آخرین وضعیت</h4>
                                 <div className={`text-2xl font-black ${latestScore >= 80 ? 'text-green-500' : latestScore >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                                     {latestScore}<span className="text-sm text-slate-400 font-normal">/100</span>
                                 </div>
                             </div>
                             
                             <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                        <PolarGrid stroke="#e2e8f0" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                                        <Radar name="Staff" dataKey="A" stroke="#8b5cf6" strokeWidth={3} fill="#8b5cf6" fillOpacity={0.3} />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}/>
                                    </RadarChart>
                                </ResponsiveContainer>
                             </div>
                        </div>

                        {/* RIGHT: History & Notes */}
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                                <h4 className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-4"><TrendingUp size={18} className="text-blue-500"/> روند پیشرفت</h4>
                                <div className="h-40 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={historyData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                            <YAxis domain={[0, 100]} hide />
                                            <Tooltip />
                                            <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={{r: 4}} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex-1">
                                <h4 className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-4"><Calendar size={18} className="text-slate-400"/> تاریخچه</h4>
                                <div className="space-y-3 max-h-40 overflow-y-auto custom-scrollbar">
                                    {evaluations.map(ev => (
                                        <div key={ev.id} className="text-xs p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                                            <div className="flex justify-between mb-1">
                                                <span className="font-bold">{ev.period}</span>
                                                <span className="font-mono">{ev.evaluation_date}</span>
                                            </div>
                                            <div className="text-slate-500 dark:text-slate-400 mb-1">{ev.notes || 'بدون توضیحات'}</div>
                                            <div className="text-right text-[10px] text-slate-400">ارزیاب: {ev.evaluator_name}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default ReportCardModal;
