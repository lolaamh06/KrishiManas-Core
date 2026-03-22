import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, CheckCircle, Phone, User, AlertTriangle, ChevronDown, 
  Clock, MessageSquare, Search, Filter, LayoutDashboard, ListTodo, History, Info,
  TrendingUp, BarChart3, Bell, X, Activity, MapPin
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { sendSMS, SMS_TEMPLATES } from '../utils/mockTwilio';
import { matchSchemes } from '../utils/matchSchemes';
import { useLang } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../utils/firebase';

const MOCK_CASES = [
  {
    id: 'f1', name: 'Ramesh Kumar', village: 'Alur HQ', taluk: 'Alur',
    score: 78, status: 'Red', crop: 'Paddy', loanDaysOverdue: 60,
    phone: '+919876543210', assignedAt: '2 days ago',
    checklist: [
      { id: 'call',  label: 'Call the farmer', done: false },
      { id: 'visit', label: 'Visit the farm in person', done: false, requiresNote: true },
      { id: 'docs',  label: 'Help collect documents', done: false },
      { id: 'resolve', label: 'Mark as resolved', done: false, requiresNote: true },
    ],
  },
  {
    id: 'f6', name: 'Kavitha Naik', village: 'Belur Main', taluk: 'Belur',
    score: 71, status: 'Red', crop: 'Paddy', loanDaysOverdue: 45,
    phone: '+919876500001', assignedAt: '1 day ago',
    checklist: [
      { id: 'call',  label: 'Call the farmer', done: true },
      { id: 'visit', label: 'Visit the farm in person', done: false, requiresNote: true },
      { id: 'docs',  label: 'Help collect documents', done: false },
      { id: 'resolve', label: 'Mark as resolved', done: false, requiresNote: true },
    ],
  },
  {
    id: 'f3', name: 'Manoj Patil', village: 'Hassan Town', taluk: 'Hassan',
    score: 55, status: 'Yellow', crop: 'Ragi', loanDaysOverdue: 20,
    phone: '+919876500002', assignedAt: '3 days ago',
    checklist: [
      { id: 'call',  label: 'Call the farmer', done: true },
      { id: 'visit', label: 'Visit the farm', done: false, requiresNote: true },
      { id: 'docs',  label: 'Help with PMFBY', done: false },
      { id: 'resolve', label: 'Mark resolved', done: false, requiresNote: true },
    ],
  },
];

const ANALYTICS_DATA = [
  { name: 'Red Zone', value: 2, color: '#ef4444' },
  { name: 'Yellow Zone', value: 1, color: '#f59e0b' },
  { name: 'Resolved', value: 5, color: '#10b981' },
];

export default function MitraPortal() {
  const navigate = useNavigate();
  const { lang } = useLang();
  const { currentUser, logout } = useAuth();
  
  const isFarmer = currentUser?.roles?.includes('farmer');
  
  const [cases, setCases] = useState(MOCK_CASES);
  const [expanded, setExpanded] = useState(MOCK_CASES[0].id);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('active'); // active, insights
  const [noteInput, setNoteInput] = useState({});
  const [caseHistory, setCaseHistory] = useState({});
  const [sosSignal, setSosSignal] = useState(null);

  useEffect(() => {
    const checkEvents = () => {
      // Check for standalone SOS signal (old format compatibility)
      const signal = localStorage.getItem('krishimanas_sos_signal');
      if (signal) setSosSignal(JSON.parse(signal));

      // Check for new Event Bus format
      const lastEventRaw = localStorage.getItem('krishimanas_last_event');
      if (!lastEventRaw) return;
      try {
        const event = JSON.parse(lastEventRaw);
        if (event.type === 'SOS' || event.type === 'SCORE_UPDATE') {
          // If it's a score update for a farmer in our queue, update their local score
          if (event.type === 'SCORE_UPDATE') {
            setCases(prev => prev.map(c => {
              if (c.id === event.farmerId || c.name === event.farmerName) {
                return { ...c, score: event.newScore, status: event.newScore >= 65 ? 'Red' : event.newScore >= 35 ? 'Yellow' : 'Green' };
              }
              return c;
            }));
          }
          // Set as active signal if it's recent (simulated push)
          if (Date.now() - (event.timestamp || 0) < 5000) {
            setSosSignal({ ...event, ts: event.timestamp || Date.now() });
          }
        }
      } catch (e) {
        console.error("Sync error", e);
      }
    };

    checkEvents();
    window.addEventListener('storage', checkEvents);
    window.addEventListener('krishimanas_update', checkEvents);
    return () => {
      window.removeEventListener('storage', checkEvents);
      window.removeEventListener('krishimanas_update', checkEvents);
    };
  }, []);

  const handleCheck = (farmerId, checkId, requiresNote) => {
    const key = `${farmerId}_${checkId}`;
    const note = noteInput[key] || '';
    if (requiresNote && !note.trim()) return;

    setCases(prev => prev.map(c => {
      if (c.id !== farmerId) return c;
      return {
        ...c,
        checklist: c.checklist.map(item =>
          item.id === checkId ? { ...item, done: true, note, ts: new Date().toLocaleTimeString() } : item
        ),
      };
    }));
    setCaseHistory(prev => ({
      ...prev,
      [farmerId]: [...(prev[farmerId] || []), { action: checkId, note, ts: new Date().toLocaleTimeString() }],
    }));
    setNoteInput(prev => ({ ...prev, [key]: '' }));
  };

  const urgentCount = cases.filter(c => c.status === 'Red').length;
  const filteredCases = cases.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row font-sans selection:bg-teal-primary/10">
      
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-[#020617] text-white flex-shrink-0 md:h-screen md:sticky md:top-0 hidden md:flex flex-col border-r border-white/5 shadow-2xl">
        <div className="p-8">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 font-black text-2xl tracking-tighter text-teal-400">
            <Home size={26} strokeWidth={3} /> KrishiManas
          </button>
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-2 opacity-60">Mitra Console v2.0</div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button 
            onClick={() => setActiveTab('active')} 
            className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all font-black text-xs uppercase tracking-widest ${activeTab === 'active' ? 'bg-teal-500 text-[#020617] shadow-xl shadow-teal-500/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <div className="flex items-center gap-3">
               <LayoutDashboard size={18} /> Active Case Queue
            </div>
            {urgentCount > 0 && <span className="bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">{urgentCount}</span>}
          </button>
          <button 
            onClick={() => setActiveTab('insights')} 
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all font-black text-xs uppercase tracking-widest ${activeTab === 'insights' ? 'bg-teal-500 text-[#020617] shadow-xl shadow-teal-500/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <TrendingUp size={18} /> Regional Insights
          </button>
        </nav>

        <div className="p-6 mt-auto space-y-4">
          {sosSignal && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 animate-pulse">
               <div className="flex items-center gap-2 text-red-500 font-black text-[10px] uppercase tracking-widest mb-1">
                  <Bell size={12} /> Emergency Signal
               </div>
               <div className="text-sm font-black text-white">{sosSignal.farmerName || 'Unknown Farmer'}</div>
               <button 
                 onClick={() => handleClaimCase(sosSignal.farmerId)}
                 className="mt-2 w-full py-2 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest"
               >
                 Claim Case
               </button>
            </div>
          )}

          {isFarmer && (
            <button 
              onClick={() => navigate('/farmer/dashboard')}
              className="w-full flex items-center gap-3 px-5 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500/20 transition-all"
            >
              <User size={14} /> Back to My Farm
            </button>
          )}

          <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-400 text-black flex items-center justify-center font-black text-sm shadow-lg shadow-teal-400/10">
                  {currentUser?.name?.substring(0,2).toUpperCase() || 'MI'}
                </div>
                <div>
                   <div className="text-xs font-black text-white">{currentUser?.name || 'Mitra Volunteer'}</div>
                   <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{currentUser?.district || 'Hassan'} Sector</div>
                </div>
                <button onClick={() => { if(logout) logout(); navigate('/'); }} className="ml-auto text-slate-500 hover:text-red-500 transition-colors">
                  <X size={14} />
                </button>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10">
        
        {/* SOS Banner Mobile */}
        {sosSignal && (
          <div className="md:hidden bg-red-600 text-white p-4 rounded-2xl mb-6 flex items-center justify-between shadow-lg animate-bounce">
             <div className="flex items-center gap-3">
                <Bell size={20} className="animate-pulse" />
                <div>
                   <div className="text-[10px] font-black uppercase opacity-80">Farmer SOS Detect</div>
                   <div className="font-black">{sosSignal.farmerName} needs help!</div>
                </div>
             </div>
             <button onClick={() => { localStorage.removeItem('krishimanas_sos_signal'); setSosSignal(null); }} className="p-2 bg-white/20 rounded-full"><X size={18} /></button>
          </div>
        )}

        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div>
              <h1 className="text-4xl font-black text-[#020617] tracking-tighter">
                {activeTab === 'active' ? 'Field Intervention Queue' : 'Regional Load Analysis'}
              </h1>
              <p className="text-slate-500 font-bold uppercase text-[11px] tracking-[0.2em] mt-1 italic opacity-70">
                Krishi Mitra Intelligence Dashboard // Hassan South
              </p>
           </div>
           
           <div className="flex items-center gap-3">
              <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                 <span className="text-2xl font-black text-navy leading-none">08</span>
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Target Score</span>
              </div>
              <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                 <span className="text-2xl font-black text-teal-600 leading-none">94%</span>
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Reputation</span>
              </div>
           </div>
        </header>

        {activeTab === 'active' ? (
          <div className="space-y-6">
             {/* Search/Filter Bar */}
             <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="flex-1 relative">
                   <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                   <input 
                     type="text" 
                     placeholder="Rapid Sector Search (Name, Taluk, UID)..." 
                     className="w-full pl-12 pr-6 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-teal-500/20 transition-all"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                   />
                </div>
                <button className="p-3 bg-white border border-gray-100 rounded-2xl text-slate-400 hover:text-teal-500 transition-colors">
                   <Filter size={20} />
                </button>
             </div>

             {/* Case Cards */}
             <div className="grid gap-6">
                {filteredCases.map(c => {
                   const isSel = expanded === c.id;
                   const doneCount = c.checklist.filter(i => i.done).length;
                   const progress = Math.round((doneCount / c.checklist.length) * 100);

                   return (
                     <div key={c.id} className={`bg-white rounded-[2rem] shadow-sm border transition-all duration-300 overflow-hidden ${isSel ? 'border-teal-500/30 ring-4 ring-teal-500/5' : 'border-gray-100 hover:border-teal-500/20'}`}>
                        <div 
                          onClick={() => setExpanded(isSel ? null : c.id)}
                          className={`p-6 md:p-8 flex flex-col md:flex-row items-center justify-between cursor-pointer gap-6 ${isSel ? 'bg-teal-500/[0.02]' : 'hover:bg-slate-50/50'}`}
                        >
                           <div className="flex items-center gap-6 w-full md:w-auto">
                              <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-black text-xl shadow-lg ${c.status === 'Red' ? 'bg-red-500 text-white shadow-red-500/20' : 'bg-amber-500 text-white shadow-amber-500/20'}`}>
                                 {c.score}
                                 <span className="text-[8px] uppercase tracking-tighter opacity-70 mt-[-2px]">pts</span>
                              </div>
                              <div>
                                 <h3 className="text-2xl font-black text-navy leading-none mb-1">{c.name}</h3>
                                 <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <MapPin size={10} /> {c.village} · <span className={c.status === 'Red' ? 'text-red-500' : 'text-amber-500'}>{c.status} Zone Priority</span>
                                 </div>
                              </div>
                           </div>
                           
                           <div className="flex items-center gap-10 w-full md:w-auto">
                              <div className="flex flex-col items-end">
                                 <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">{doneCount} / {c.checklist.length} Complete</span>
                                 <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className={`h-full transition-all duration-700 ${c.status === 'Red' ? 'bg-red-500' : 'bg-amber-500'}`} style={{ width: `${progress}%` }} />
                                 </div>
                              </div>
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 text-slate-400 transition-all ${isSel ? 'rotate-180 bg-teal-500 text-white' : ''}`}>
                                 <ChevronDown size={20} strokeWidth={3} />
                              </div>
                           </div>
                        </div>

                        {isSel && (
                          <div className="p-8 border-t border-slate-50 animate-in slide-in-from-top-2 duration-300">
                             <div className="grid lg:grid-cols-2 gap-10">
                                
                                {/* Intervention Steps */}
                                <div className="space-y-6">
                                   <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                                      <ListTodo size={16} className="text-teal-500" /> Ground Intervention Workflow
                                   </div>
                                   <div className="space-y-4">
                                      {c.checklist.map(item => {
                                         const key = `${c.id}_${item.id}`;
                                         return (
                                           <div key={item.id} className={`p-5 rounded-2xl border transition-all ${item.done ? 'bg-slate-50 border-slate-100' : 'bg-white border-slate-200 hover:border-teal-500/40'}`}>
                                              <div className="flex gap-4">
                                                 <button 
                                                   onClick={() => !item.done && handleCheck(c.id, item.id, item.requiresNote)}
                                                   className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all flex-shrink-0 ${item.done ? 'bg-teal-500 border-teal-500 shadow-lg shadow-teal-500/20 text-white' : 'border-slate-300 hover:border-teal-500'}`}
                                                 >
                                                    {item.done && <CheckCircle size={16} />}
                                                 </button>
                                                 <div className="flex-1">
                                                    <div className={`font-black uppercase text-[13px] tracking-tight ${item.done ? 'text-slate-400 line-through' : 'text-navy'}`}>{item.label}</div>
                                                    {!item.done && item.requiresNote && (
                                                       <div className="mt-3 flex gap-2">
                                                          <input 
                                                            type="text" 
                                                            placeholder="Add mandatory field note..." 
                                                            className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs font-bold"
                                                            value={noteInput[key] || ''}
                                                            onChange={(e) => setNoteInput({...noteInput, [key]: e.target.value})}
                                                          />
                                                          <button onClick={() => handleCheck(c.id, item.id, true)} className="px-4 bg-teal-500 text-white font-black text-[10px] rounded-xl uppercase tracking-widest shadow-lg shadow-teal-500/20">Record</button>
                                                       </div>
                                                    )}
                                                    {item.done && item.note && (
                                                       <div className="mt-2 text-[10px] font-bold text-slate-500 italic flex items-center gap-2">
                                                          <Info size={10} className="text-teal-500" /> "{item.note}" <span className="opacity-40 uppercase tracking-tighter">@ {item.ts}</span>
                                                       </div>
                                                    )}
                                                 </div>
                                              </div>
                                           </div>
                                         );
                                      })}
                                   </div>
                                </div>

                                {/* AI Intelligence & Comms */}
                                <div className="space-y-8">
                                   <div className="bg-[#020617] rounded-[2rem] p-8 text-white relative overflow-hidden group">
                                      <div className="absolute -right-6 -bottom-6 text-teal-500 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                                         <Activity size={180} />
                                      </div>
                                      <div className="relative z-10">
                                         <div className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-400 mb-6">AI Context Assessment</div>
                                         <div className="grid grid-cols-2 gap-4 mb-8">
                                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                               <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Crop Resource</div>
                                               <div className="text-sm font-black text-slate-200">{c.crop}</div>
                                            </div>
                                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                               <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Debt Criticality</div>
                                               <div className="text-sm font-black text-slate-200">{c.loanDaysOverdue} Days</div>
                                            </div>
                                         </div>
                                         <div className="space-y-3">
                                            <div className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Recommended Support Systems</div>
                                            {matchSchemes({ score: c.score, crop: c.crop, taluk: c.taluk, loanDaysOverdue: c.loanDaysOverdue }).schemes.slice(0, 2).map(s => (
                                               <div key={s.id} className="bg-white/10 px-4 py-3 rounded-xl border border-white/5 text-xs font-black text-teal-400 flex items-center justify-between">
                                                  {s.name} <History size={14} className="opacity-30" />
                                               </div>
                                            ))}
                                         </div>
                                      </div>
                                   </div>

                                   <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm">
                                      <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Direct Comms Matrix</div>
                                      <div className="grid grid-cols-2 gap-4">
                                         <a href={`tel:${c.phone}`} className="flex flex-col items-center justify-center p-5 bg-teal-500 text-black rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-teal-500/10 hover:scale-[1.03] transition-all">
                                            <Phone size={24} className="mb-2" /> Call Farmer
                                         </a>
                                         <button className="flex flex-col items-center justify-center p-5 bg-[#020617] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-gray-900/10 hover:scale-[1.03] transition-all">
                                            <MessageSquare size={24} className="mb-2" /> Send Alert
                                         </button>
                                      </div>
                                   </div>
                                </div>

                             </div>
                          </div>
                        )}
                     </div>
                   );
                })}
             </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-500">
             <div className="grid lg:grid-cols-2 gap-8">
                {/* Sector Load */}
                <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm flex flex-col min-h-[400px]">
                   <div className="flex items-center gap-3 mb-8">
                      <BarChart3 size={20} className="text-teal-500" />
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Queue Distribution // By Risk Zone</span>
                   </div>
                   <div className="flex-1">
                      <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={ANALYTICS_DATA}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            <XAxis dataKey="name" fontSize={10} fontStyle="bold" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} fontSize={10} />
                            <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                            <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={40}>
                               {ANALYTICS_DATA.map((entry, index) => (
                                 <Cell key={`cell-${index}`} fill={entry.color} />
                               ))}
                            </Bar>
                         </BarChart>
                      </ResponsiveContainer>
                   </div>
                </div>

                {/* Efficiency Analysis */}
                <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm flex flex-col min-h-[400px]">
                   <div className="flex items-center gap-3 mb-8">
                      <TrendingUp size={20} className="text-teal-500" />
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Intervention Success Rate</span>
                   </div>
                   <div className="flex-1 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                         <PieChart>
                            <Pie
                               data={ANALYTICS_DATA}
                               innerRadius={80}
                               outerRadius={120}
                               paddingAngle={8}
                               dataKey="value"
                            >
                               {ANALYTICS_DATA.map((entry, index) => (
                                 <Cell key={`cell-${index}`} fill={entry.color} />
                               ))}
                            </Pie>
                            <Tooltip />
                         </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute flex flex-col items-center">
                         <span className="text-3xl font-black text-navy">78%</span>
                         <span className="text-[8px] font-black text-slate-400 uppercase">Avg Yield</span>
                      </div>
                   </div>
                </div>
             </div>

             {/* Performance Logs Table */}
             <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="px-8 py-5 border-b border-gray-50 bg-slate-50/50 flex items-center justify-between">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Historical Performance Log</span>
                   <button className="text-[10px] font-black text-teal-600 uppercase tracking-widest hover:underline">Download Report</button>
                </div>
                <div className="p-4 overflow-x-auto">
                   <table className="w-full text-left">
                      <thead>
                         <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100">
                            <th className="px-5 py-4">Event ID</th>
                            <th className="px-5 py-4">Entity Result</th>
                            <th className="px-5 py-4 text-right">Reputation Change</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                         {[1,2,3,4].map(i => (
                           <tr key={i} className="text-xs font-bold text-navy hover:bg-slate-50 transition-colors">
                              <td className="px-5 py-4 tabular-nums text-slate-400">#EV-902{i}</td>
                              <td className="px-5 py-4">Farmer Support Complete // {['Paddy','Ragi','Sugarcane','Maize'][i-1]}</td>
                              <td className="px-5 py-4 text-right text-emerald-600">+0.25 pts</td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
        )}

      </main>
    </div>
  );
}
