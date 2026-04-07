import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, Tooltip as LeafletTooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  AlertTriangle, Activity, Users, Phone, Home, TrendingUp, Bell, CheckCircle, 
  Loader2, Map, BarChart3, LineChart as LineIcon, Info, Search, MapPin,
  Globe, Shield, Zap, ChevronRight, MessageSquare, Briefcase
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend
} from 'recharts';
import { sendSMS, SMS_TEMPLATES } from '../utils/mockTwilio';
import { matchSchemes } from '../utils/matchSchemes';
import { useLang } from '../contexts/LanguageContext';
import VoiceInput from '../components/shared/VoiceInput';
import { db, collection, onSnapshot, query, orderBy, limit } from '../utils/firebase';

import EcosystemMap from '../components/EcosystemMap';

/* ─── Seeded / Fallback Data ─── */
const SEEDED_MITRAS = [
  { id: 'm1', name: 'Ravi Verma',   taluk: 'Hassan',      lat: 13.010, lng: 76.110, casesResolved: 12, avgResponse: '14m', activeCases: 2, status: 'Active' },
  { id: 'm2', name: 'Priya S.',     taluk: 'Sakleshpur',  lat: 12.950, lng: 75.800, casesResolved: 34, avgResponse: '8m',  activeCases: 0, status: 'Available' },
  { id: 'm3', name: 'Gowda Bros',   taluk: 'Belur',       lat: 13.170, lng: 75.870, casesResolved: 8,  avgResponse: '22m', activeCases: 4, status: 'Overloaded' },
];

const SEEDED_LOGS = [
  { id: 'l1', type: 'SYSTEM', message: 'Command Center Initialized', timestamp: Date.now() - 3600000 },
  { id: 'l2', type: 'SYNC', message: 'Regional Node Pulse Detected', timestamp: Date.now() - 1800000 },
];

const SEEDED_FARMERS = [
  { id: 'f1', name: 'Ramesh Kumar',    taluk: 'Alur',            lat: 13.000, lng: 76.000, score: 78, crop: 'Paddy',     loanDaysOverdue: 60,  status: 'Red'    },
  { id: 'f2', name: 'Savitha Gowda',  taluk: 'Sakleshpur',      lat: 12.942, lng: 75.788, score: 82, crop: 'Coffee',    loanDaysOverdue: 90,  status: 'Red'    },
  { id: 'f3', name: 'Manoj Patil',    taluk: 'Hassan',          lat: 13.007, lng: 76.100, score: 55, crop: 'Ragi',      loanDaysOverdue: 20,  status: 'Yellow' },
  { id: 'f4', name: 'Lakshmi Devi',   taluk: 'Arsikere',        lat: 13.314, lng: 76.258, score: 44, crop: 'Maize',     loanDaysOverdue: 10,  status: 'Yellow' },
];

const STATUS_COLOR = { Red: '#ef4444', Yellow: '#f59e0b', Green: '#10b981' };

const RADAR_DATA = [
  { subject: 'Soil Health', A: 120, B: 110, fullMark: 150 },
  { subject: 'Water Table', A: 98, B: 130, fullMark: 150 },
  { subject: 'Credit Risk', A: 86, B: 130, fullMark: 150 },
  { subject: 'Market Access', A: 99, B: 100, fullMark: 150 },
  { subject: 'Pest Load', A: 85, B: 90, fullMark: 150 },
];

const VELOCITY_DATA = [
  { time: '08:00', v: 40 }, { time: '10:00', v: 75 }, { time: '12:00', v: 60 },
  { time: '14:00', v: 90 }, { time: '16:00', v: 85 }, { time: '18:00', v: 110 },
];

const SidebarNode = ({ id, icon: Icon, label, active, onClick, color = 'teal' }) => (
  <button
    onClick={() => onClick(id)}
    className={`w-full flex items-center gap-4 px-6 py-4 transition-all relative group ${
      active ? 'bg-white/5 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]'
    }`}
  >
    {active && <div className={`absolute left-0 top-0 bottom-0 w-1 bg-${color}-500 shadow-[2px_0_10px_rgba(20,184,166,0.5)]`} />}
    <Icon size={20} className={active ? `text-${color}-500` : 'group-hover:text-slate-400'} />
    <span className="text-[12px] font-black uppercase tracking-widest">{label}</span>
    <ChevronRight size={14} className={`ml-auto opacity-0 group-hover:opacity-100 transition-opacity ${active ? 'opacity-100' : ''}`} />
  </button>
);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { lang, t } = useLang();
  const [activeTab, setActiveTab] = useState('global'); // global, farmers, mitras
  const [farmers, setFarmers] = useState(SEEDED_FARMERS);
  const [mitras, setMitras] = useState(SEEDED_MITRAS);
  const [logs, setLogs] = useState(SEEDED_LOGS);
  const [selected, setSelected] = useState(null);
  const [broadcasting, setBroadcasting] = useState(false);
  const [broadcastLog, setBroadcastLog] = useState([]);
  const [criticalAlert, setCriticalAlert] = useState(null); // escalation alert
  const [searchTerm, setSearchTerm] = useState('');

  // Audit Fix: Re-injecting Firestore onSnapshot listeners
  useEffect(() => {
    // 1. Listen for new farmers / users
    const qUsers = query(collection(db, 'users'), limit(100));
    const unsubUsers = onSnapshot(qUsers, (snap) => {
      const liveFarmers = [];
      const liveMitras = [];
      snap.forEach(doc => {
        const d = doc.data();
        if (d.roles?.includes('farmer')) liveFarmers.push({ id: doc.id, ...d });
        if (d.roles?.includes('mitra')) liveMitras.push({ id: doc.id, ...d });
      });
      // Merge seeded with live
      setFarmers(prev => {
        const ids = new Set(liveFarmers.map(f => f.id));
        return [...liveFarmers, ...SEEDED_FARMERS.filter(sf => !ids.has(sf.id))];
      });
      setMitras(prev => {
        const ids = new Set(liveMitras.map(m => m.id));
        return [...liveMitras, ...SEEDED_MITRAS.filter(sm => !ids.has(sm.id))];
      });
    }, (err) => console.log("Silent Error: User Collection Monitoring", err));

    // 2. Listen for Global Activities
    const qLogs = query(collection(db, 'global_activities'), orderBy('timestamp', 'desc'), limit(30));
    const unsubLogs = onSnapshot(qLogs, (snap) => {
      const liveLogs = [];
      snap.forEach(doc => {
        const d = doc.data();
        liveLogs.push({ id: doc.id, ...d });
        // Check for urgent escalations
        if (d.type === 'ESCALATION' && (Date.now() - (d.timestamp?.toMillis?.() || d.timestamp) < 5000)) {
          setCriticalAlert(d);
        }
      });
      setLogs(prev => liveLogs.length > 0 ? liveLogs : prev);
    }, (err) => console.log("Silent Error: Activity Logs Index Processing", err));

    // 3. Fallback for LocalStorage Events (Same browser sync)
    const handleLocal = (e) => {
      const lastEventRaw = localStorage.getItem('krishimanas_last_event');
      if (!lastEventRaw) return;
      try {
        const event = JSON.parse(lastEventRaw);
        if (event.type === 'SOS') {
          setLogs(prev => [{ id: Date.now(), type: 'SOS', message: `${event.farmerName} generated distress signal`, timestamp: Date.now() }, ...prev]);
        }
      } catch (e) {}
    };
    window.addEventListener('storage', handleLocal);
    window.addEventListener('krishimanas_update', handleLocal);

    return () => {
      unsubUsers();
      unsubLogs();
      window.removeEventListener('storage', handleLocal);
      window.removeEventListener('krishimanas_update', handleLocal);
    };
  }, []);

  const handleBroadcast = async () => {
    setBroadcasting(true);
    const redFarmers = farmers.filter(f => f.status === 'Red');
    const newLogs = [];
    for (const f of redFarmers) {
      const msg = SMS_TEMPLATES.distressAlert(f.name, f.score, f.taluk);
      await sendSMS({ to: '+91XXXXXXXXXX', message: msg, farmerName: f.name });
      newLogs.push(`✓ SMS Dispatched: ${f.name}`);
    }
    setBroadcastLog(newLogs);
    setTimeout(() => setBroadcasting(false), 2000);
  };

  const getStats = () => ({
    red: farmers.filter(f => f.status === 'Red').length,
    yellow: farmers.filter(f => f.status === 'Yellow').length,
    activeMitras: mitras.length,
    avgDistress: Math.round(farmers.reduce((s, f) => s + (f.score || 0), 0) / (farmers.length || 1))
  });

  const stats = getStats();

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex h-screen overflow-hidden font-sans selection:bg-teal-500/20">
      
      {/* ─── Mission Control Sidebar (3-Tab) ─── */}
      <aside className="w-64 border-r border-white/5 bg-[#020617] flex flex-col z-[1100]">
        <div className="p-8 pb-12">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 text-teal-500 font-black text-2xl tracking-tighter hover:scale-105 transition-all">
            <Shield size={28} /> {t('adminPortal')}
          </button>
          <div className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em] mt-2 ml-1 opacity-50">Command Console</div>
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarNode id="global" icon={Globe} label={lang === 'kn' ? 'ಜಾಗತಿಕ ಕೇಂದ್ರ' : 'Global Command'} active={activeTab === 'global'} onClick={setActiveTab} />
          <SidebarNode id="farmers" icon={Users} label={lang === 'kn' ? 'ರೈತರ ನೋಂದಣಿ' : 'Farmer Operations'} active={activeTab === 'farmers'} onClick={setActiveTab} />
          <SidebarNode id="mitras" icon={Briefcase} label={lang === 'kn' ? 'ಮಿತ್ರ ಪಡೆಗಳು' : 'Volunteer Network'} active={activeTab === 'mitras'} onClick={setActiveTab} color="blue" />
        </nav>

        <div className="p-6 bg-white/[0.02] border-t border-white/5">
           <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse shadow-[0_0_8px_#14b8a6]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Live</span>
           </div>
           <button onClick={() => { localStorage.removeItem('krishimanas_auth_admin'); navigate('/'); }} className="w-full py-3 bg-red-500/10 text-red-500 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
              Terminate Session
           </button>
        </div>
      </aside>

      {/* ─── Main Content Area ─── */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* Top Header Stats */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-[#020617]/50 backdrop-blur-xl shrink-0">
           <div className="flex gap-10">
              <div className="flex flex-col">
                 <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{lang === 'en' ? 'Regional Priority' : 'ಪ್ರಾದೇಶಿಕ ಆದ್ಯತೆ'}</span>
                 <span className="text-xl font-black text-red-500 tabular-nums">{stats.red} {lang === 'en' ? 'Critical Cases' : 'ಗಂಭೀರ ಪ್ರಕರಣಗಳು'}</span>
              </div>
              <div className="flex flex-col border-l border-white/10 pl-10">
                 <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{lang === 'en' ? 'Active Force' : 'ಸಕ್ರಿಯ ಪಡೆ'}</span>
                 <span className="text-xl font-black text-blue-500 tabular-nums">{stats.activeMitras} {lang === 'en' ? 'Mitras' : 'ಮಿತ್ರರು'}</span>
              </div>
              <div className="flex flex-col border-l border-white/10 pl-10">
                 <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{lang === 'en' ? 'Avg Index' : 'ಸರಾಸರಿ ಸೂಚ್ಯಂಕ'}</span>
                 <span className="text-xl font-black text-teal-400 tabular-nums">{stats.avgDistress} {lang === 'en' ? 'Pt' : 'ಅಂಕ'}</span>
              </div>
           </div>
           
           {criticalAlert && (
             <div className="mx-4 flex-1 animate-pulse">
                <div className="bg-red-600 px-6 py-3 rounded-full border-2 border-white flex items-center justify-between shadow-[0_0_20px_rgba(239,68,68,0.5)]">
                   <div className="flex items-center gap-3">
                      <AlertTriangle size={20} className="text-white" />
                      <span className="text-white font-black text-xs uppercase tracking-widest">CRITICAL ESCALATION: {criticalAlert.message}</span>
                   </div>
                   <button onClick={() => setCriticalAlert(null)} className="text-white hover:scale-110 transition-transform"><X size={16} /></button>
                </div>
             </div>
           )}

           <div className="text-[11px] font-mono text-slate-500 bg-white/5 px-4 py-2 rounded-xl border border-white/10 uppercase tracking-tighter">
              Telemetry Status: Nominal // Latency 24ms
           </div>
        </header>

        {/* Dynamic Content Scrollbox */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          
          {activeTab === 'global' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
               <div className="grid xl:grid-cols-12 gap-8 items-start">
                  {/* Map View */}
                  <div className="xl:col-span-8 bg-[#0f172a] rounded-[2.5rem] p-2 border border-white/5 shadow-2xl relative min-h-[540px]">
                    <div className="absolute top-8 left-8 z-[900] bg-black/60 backdrop-blur-md p-4 rounded-3xl border border-white/10 flex items-center gap-4">
                       <Map size={20} className="text-teal-500" />
                       <div className="font-black text-[11px] uppercase tracking-widest leading-none text-white">
                          Tactical Sector Mapping<br/>
                          <span className="text-[8px] opacity-40">Hassan District Area Hub</span>
                       </div>
                    </div>
                    <EcosystemMap 
                      farmers={farmers} 
                      mitras={mitras} 
                      selectedId={selected?.id} 
                      onSelect={setSelected} 
                    />
                  </div>

                  {/* Operations Feed & Tools */}
                  <div className="xl:col-span-4 space-y-8">
                     {/* Radar Analytics Card */}
                     <div className="bg-[#0f172a] border border-white/5 rounded-[2rem] p-8 h-[260px] flex flex-col">
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Universal Risk Coverage</div>
                        <div className="flex-1">
                           <ResponsiveContainer width="100%" height="100%">
                              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={RADAR_DATA}>
                                 <PolarGrid stroke="#ffffff10" />
                                 <PolarAngleAxis dataKey="subject" tick={{ fontSize: 8, fill: '#64748b' }} />
                                 <Radar name="Current" dataKey="A" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.6} />
                              </RadarChart>
                           </ResponsiveContainer>
                        </div>
                     </div>

                     {/* Velocity Graph */}
                     <div className="bg-[#0f172a] border border-white/5 rounded-[2rem] p-8 h-[200px] flex flex-col">
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Intervention Velocity</div>
                        <div className="flex-1">
                           <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={VELOCITY_DATA}>
                                 <defs>
                                    <linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1">
                                       <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                       <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                 </defs>
                                 <Area type="monotone" dataKey="v" stroke="#3b82f6" fillOpacity={1} fill="url(#colorV)" />
                              </AreaChart>
                           </ResponsiveContainer>
                        </div>
                     </div>

                     {/* AIR Broadcast Tool */}
                     <div className="bg-red-500/10 border border-red-500/20 rounded-[2rem] p-8 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 text-red-500 opacity-5 group-hover:rotate-12 transition-all">
                           <Zap size={140} />
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                           <AlertTriangle size={20} className="text-red-500 animate-pulse" />
                           <span className="text-[11px] font-black uppercase tracking-widest text-red-500">AIR Broadcast System</span>
                        </div>
                        <p className="text-xs font-bold text-slate-400 mb-6 leading-relaxed">
                           Dispatch encrypted emergency protocols to <span className="text-white">{stats.red} Farmers</span> and assigned Mitra units.
                        </p>
                        <button 
                           onClick={handleBroadcast} 
                           disabled={broadcasting || stats.red === 0}
                           className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-500 shadow-xl shadow-red-900/40 active:scale-95 transition-all flex items-center justify-center gap-3"
                        >
                           {broadcasting ? <Loader2 className="animate-spin" /> : <Zap size={16} />} Dispatch Sector Alert
                        </button>
                        {broadcastLog.length > 0 && (
                          <div className="mt-4 max-h-32 overflow-y-auto space-y-1 border-t border-red-500/10 pt-4 font-mono text-[9px] text-red-400 opacity-80">
                             {broadcastLog.map((l, i) => <div key={i}>{l}</div>)}
                          </div>
                        )}
                     </div>

                     {/* Global Activity Feed */}
                     <div className="bg-[#0f172a] border border-white/5 rounded-[2rem] p-8 flex flex-col h-[350px]">
                        <div className="flex items-center justify-between mb-8">
                           <div className="flex items-center gap-2">
                              <Activity size={18} className="text-teal-500" />
                              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Activity Log</span>
                           </div>
                           <span className="bg-teal-500/10 text-teal-400 px-2.5 py-1 rounded text-[8px] font-black uppercase tracking-widest">Real-time</span>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
                           {logs.length === 0 ? (
                             <div className="h-full flex items-center justify-center text-slate-600 font-bold text-[10px] uppercase italic">Awaiting telemetry...</div>
                           ) : logs.map(l => (
                             <div key={l.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex gap-4 hover:bg-white/[0.08] transition-all group">
                                <div className={`w-2 h-2 rounded-full mt-1.5 ${l.type === 'SOS' ? 'bg-red-500 animate-ping' : 'bg-teal-500'}`} />
                                <div className="flex-1">
                                   <div className="flex justify-between items-baseline mb-1">
                                      <span className="text-[9px] font-black uppercase text-teal-500">{l.type || 'SYSTEM'}</span>
                                      <span className="text-[8px] font-bold text-slate-600 uppercase">Recent</span>
                                   </div>
                                   <div className="text-xs font-medium text-slate-300 leading-snug">{l.message || l.msg}</div>
                                </div>
                             </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'farmers' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
               {/* Tactical Overview Charts */}
                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="bg-[#0f172a] p-8 rounded-[2.5rem] border border-white/5 flex flex-col h-[300px]">
                     <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Regional Risk Load</div>
                     <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                           <PieChart>
                              <Pie data={[
                                { name: 'Red', value: farmers.filter(f => f.status === 'Red').length, fill: '#ef4444' },
                                { name: 'Yellow', value: farmers.filter(f => f.status === 'Yellow').length, fill: '#f59e0b' },
                                { name: 'Green', value: farmers.filter(f => f.status === 'Green').length, fill: '#10b981' },
                              ]} innerRadius={60} outerRadius={80} dataKey="value" />
                              <RechartsTooltip />
                           </PieChart>
                        </ResponsiveContainer>
                     </div>
                  </div>
                  <div className="bg-[#0f172a] p-8 rounded-[2.5rem] border border-white/5 flex flex-col h-[300px]">
                     <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Crop Sector Exposure</div>
                     <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={[
                             { name: 'Paddy', value: farmers.filter(f => f.crop === 'Paddy').length },
                             { name: 'Ragi', value: farmers.filter(f => f.crop === 'Ragi').length },
                             { name: 'Maize', value: farmers.filter(f => f.crop === 'Maize').length },
                             { name: 'Coffee', value: farmers.filter(f => f.crop === 'Coffee').length },
                           ]}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                              <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                              <YAxis axisLine={false} tickLine={false} fontSize={10} />
                              <Bar dataKey="value" fill="#14b8a6" radius={[4, 4, 0, 0]} barSize={20} />
                           </BarChart>
                        </ResponsiveContainer>
                     </div>
                  </div>
                  <div className="bg-[#0f172a] p-8 rounded-[2.5rem] border border-white/5 flex flex-col h-[300px]">
                     <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Distress Convergence</div>
                     <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                           <AreaChart data={VELOCITY_DATA}>
                              <Area type="monotone" dataKey="v" stroke="#f59e0b" fill="#f59e0b30" />
                           </AreaChart>
                        </ResponsiveContainer>
                     </div>
                  </div>
               </div>

               <div className="bg-[#0f172a] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
                  <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                     <h2 className="text-2xl font-black text-white tracking-tighter">Tactical Farmer Registry</h2>
                     <div className="flex items-center gap-4">
                        <VoiceInput
                          placeholder="Search Entity ID / Name..."
                          icon={Search}
                          value={searchTerm}
                          onChange={setSearchTerm}
                          className="w-64"
                        />
                     </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead>
                          <tr className="bg-black/20 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-white/5">
                             <th className="px-10 py-6">ID Node</th>
                             <th className="px-10 py-6">Operational Zone</th>
                             <th className="px-10 py-6">Resource Segment</th>
                             <th className="px-10 py-6">Distress Index</th>
                             <th className="px-10 py-6">Protocol Status</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-white/[0.03]">
                          {[...farmers].sort((a,b) => (b.score || 0) - (a.score || 0)).filter(f => !searchTerm || f.name?.toLowerCase().includes(searchTerm.toLowerCase()) || f.taluk?.toLowerCase().includes(searchTerm.toLowerCase())).map(f => (
                            <tr key={f.id} onClick={() => setSelected(f)} className="hover:bg-white/[0.03] transition-colors cursor-pointer group">
                               <td className="px-10 py-8">
                                  <div className="font-black text-white">{f.name}</div>
                                  <div className="text-[9px] font-bold text-slate-600 tracking-widest uppercase">{f.id} // SEC-{f.taluk?.substring(0,3).toUpperCase()}</div>
                               </td>
                               <td className="px-10 py-8 text-xs font-black text-slate-400 uppercase tracking-widest">{f.taluk} District</td>
                               <td className="px-10 py-8 text-xs font-bold text-teal-500 uppercase">{f.crop || 'Paddy'} Sector</td>
                               <td className="px-10 py-8">
                                  <span className={`text-2xl font-black ${STATUS_COLOR[f.status] || 'text-white'} tabular-nums`}>{f.score || 50}</span>
                               </td>
                               <td className="px-10 py-8">
                                  <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${
                                     f.status === 'Red' ? 'bg-red-500/10 border-red-500/30 text-red-500' : 
                                     f.status === 'Yellow' ? 'bg-orange-500/10 border-orange-500/30 text-orange-500' : 
                                     'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                                  }`}>
                                     <div className={`w-1.5 h-1.5 rounded-full ${f.status === 'Red' ? 'bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]' : (f.status === 'Yellow' ? 'bg-orange-500' : 'bg-emerald-500')}`} />
                                     {f.status} Risk Level
                                  </div>
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'mitras' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
               {/* Mitra Summary Stats */}
               <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-2 bg-[#0f172a] p-6 rounded-3xl border border-white/5 flex flex-col">
                     <div className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em] mb-4">Sector Load Balance</div>
                     <div className="flex-1 min-h-[140px]">
                        <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={mitras.map(m => ({ name: m.name.split(' ')[0], load: m.activeCases || 0 }))}>
                              <XAxis dataKey="name" fontSize={8} axisLine={false} tickLine={false} />
                              <Bar dataKey="load" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                           </BarChart>
                        </ResponsiveContainer>
                     </div>
                  </div>
                  <div className="bg-[#0f172a] p-6 rounded-3xl border border-white/5">
                     <div className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em] mb-1">Total Force</div>
                     <div className="text-3xl font-black text-white italic">{mitras.length} Units</div>
                  </div>
                  <div className="bg-[#0f172a] p-6 rounded-3xl border border-white/5">
                     <div className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-1">Active Now</div>
                     <div className="text-3xl font-black text-white italic">{mitras.filter(m => m.status === 'Active' || m.activeCases > 0).length} Units</div>
                  </div>
                  <div className="bg-[#0f172a] p-6 rounded-3xl border border-white/5">
                     <div className="text-[9px] font-black text-teal-400 uppercase tracking-[0.2em] mb-1">Avg Resolution</div>
                     <div className="text-3xl font-black text-white italic">14.2m</div>
                  </div>
                  <div className="bg-[#0f172a] p-6 rounded-3xl border border-white/5">
                     <div className="text-[9px] font-black text-yellow-500 uppercase tracking-[0.2em] mb-1">Sector Load</div>
                     <div className="text-3xl font-black text-white italic">Nominal</div>
                  </div>
               </div>

               {/* Mitra Table */}
               <div className="bg-[#0f172a] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
                  <div className="p-8 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
                     <div className="font-black text-sm uppercase tracking-widest text-slate-400">Mitra Deployment Registry</div>
                  </div>
                  <table className="w-full text-left">
                     <thead>
                        <tr className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] bg-white/[0.02]">
                           <th className="px-8 py-4">Unit Name</th>
                           <th className="px-8 py-4">Sector</th>
                           <th className="px-8 py-4">Load</th>
                           <th className="px-8 py-4">Impact</th>
                           <th className="px-8 py-4">Status</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-white/[0.03]">
                        {mitras.map(m => (
                          <tr key={m.id} onClick={() => setSelected(m)} className="hover:bg-white/[0.03] transition-colors cursor-pointer group">
                             <td className="px-8 py-6">
                                <div className="font-black text-white">{m.name}</div>
                                <div className="text-[8px] font-bold text-slate-600 uppercase tracking-tighter">ID: {m.id}</div>
                             </td>
                             <td className="px-8 py-6 text-xs font-black text-blue-400 uppercase tracking-widest">{m.taluk}</td>
                             <td className="px-8 py-6 text-xs font-black text-white">{m.activeCases || 0} Cases</td>
                             <td className="px-8 py-6 text-xs font-black text-emerald-500">{m.casesResolved || 0} Resolved</td>
                             <td className="px-8 py-6">
                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                   m.status === 'Overloaded' ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                                }`}>
                                   {m.status || 'Active'}
                                </span>
                             </td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          )}
        </div>
      </main>

      {/* ─── Detail Modal / Overlay ─── */}
      {selected && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-10 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-[#0f172a] w-full max-w-4xl border border-white/10 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row relative">
              <button onClick={() => setSelected(null)} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-all z-10"><X size={24} /></button>
              
              <div className="md:w-1/2 p-12 bg-black/40 flex flex-col justify-between relative overflow-hidden">
                 <div className="absolute top-0 left-0 p-12 text-teal-500 opacity-[0.02] -rotate-12 scale-150">
                    <Shield size={340} />
                 </div>
                 <div className="relative z-10">
                    <div className={`px-4 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest inline-block mb-8 ${
                       selected.status === 'Red' ? 'bg-red-500/10 border-red-500/30 text-red-500' : 
                       (selected.status === 'Yellow' ? 'bg-orange-500/10 border-orange-500/30 text-orange-500' : 'bg-blue-500/10 border-blue-500/30 text-blue-400')
                    }`}>
                       {selected.status || 'Active'} Node Security Protocol
                    </div>
                    <h2 className="text-5xl font-black text-white tracking-tighter leading-tight mb-2">{selected.name}</h2>
                    <p className="text-slate-400 font-bold text-lg uppercase tracking-tighter">{selected.taluk} Sector Registry // {selected.id}</p>
                 </div>
                 <div className="relative z-10 pt-10">
                    <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4">Live Performance Telemetry</div>
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-1">
                          <div className="text-3xl font-black text-white tabular-nums">{selected.score ?? selected.casesResolved}</div>
                          <div className="text-[9px] font-black text-slate-500 uppercase">{selected.score !== undefined ? 'Distress Index' : 'Cases Closed'}</div>
                       </div>
                       <div className="space-y-1">
                          <div className="text-3xl font-black text-white tabular-nums">{selected.loanDaysOverdue ?? selected.activeCases}</div>
                          <div className="text-[9px] font-black text-slate-500 uppercase">{selected.loanDaysOverdue !== undefined ? 'Days Overdue' : 'Active Load'}</div>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="md:w-1/2 p-12 space-y-8 flex flex-col justify-center">
                 {selected.score !== undefined ? (
                   <>
                     <div className="space-y-4">
                        <div className="text-[10px] font-black text-teal-500 uppercase tracking-[0.3em]">AI-Triggered Interventions</div>
                        <div className="space-y-3">
                           {matchSchemes({ score: selected.score, crop: selected.crop, taluk: selected.taluk }).schemes.slice(0, 2).map(s => (
                             <div key={s.id} className="p-5 bg-white/5 border border-white/5 rounded-[1.5rem] flex items-center justify-between group hover:bg-white/10 transition-all">
                                <div>
                                   <div className="text-sm font-black text-white mb-0.5">{s.name}</div>
                                   <div className="text-[10px] font-bold text-slate-500 uppercase">{s.benefit}</div>
                                </div>
                                <Zap className="text-teal-500 group-hover:scale-125 transition-transform" size={18} />
                             </div>
                           ))}
                        </div>
                     </div>
                     <button onClick={() => { sendSMS({ to: '+91XXXXXXXXXX', message: `KrishiManas Alert: Emergency protocol initiated for ${selected.name}. Assistance is on the way.`, farmerName: selected.name }); setSelected(null); }} className="w-full py-5 bg-teal-500 text-[#020617] rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-teal-500/20 hover:bg-teal-400 hover:scale-[1.02] transition-all">
                        Initiate Rapid Deployment
                     </button>
                   </>
                 ) : (
                   <div className="space-y-8">
                      <div className="p-8 bg-blue-500/10 border border-blue-500/20 rounded-[2rem] text-center">
                         <Activity size={40} className="text-blue-500 mx-auto mb-4" />
                         <p className="text-sm font-medium text-slate-300">Volunteer unit is currently managing <span className="text-blue-500 font-bold">{selected.activeCases || 0} cases</span> in the {selected.taluk} sector.</p>
                      </div>
                      <button onClick={() => setSelected(null)} className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/20 hover:bg-blue-500 hover:scale-[1.02] transition-all">
                         Assign New Sector Protocol
                      </button>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}

    </div>
  );
}

const X = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);
