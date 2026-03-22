import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, Tooltip as LeafletTooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  AlertTriangle, Activity, Users, Phone, Home, TrendingUp, Bell, CheckCircle,
  Loader2, Map, BarChart3, LineChart as LineIcon, Info, Search, MapPin
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, AreaChart, Area, ScatterChart, Scatter, ZAxis
} from 'recharts';
import { sendSMS, SMS_TEMPLATES } from '../utils/mockTwilio';
import { matchSchemes } from '../utils/matchSchemes';
import toast, { Toaster } from 'react-hot-toast';

/* ─── Seeded Intelligence Data ─── */
const SEASON_COMPARISON = [
  { taluk: 'Hassan', last: 31, this: 42 },
  { taluk: 'Alur', last: 44, this: 71 },
  { taluk: 'Sakleshpur', last: 29, this: 38 },
  { taluk: 'Arsikere', last: 51, this: 68 },
  { taluk: 'Belur', last: 22, this: 29 },
  { taluk: 'Channarayapatna', last: 40, this: 55 },
];

const CORRELATION_DATA = [
  { rainfall: 2,  score: 28, taluk: 'Belur' },
  { rainfall: 4,  score: 31, taluk: 'Arsikere' },
  { rainfall: 9,  score: 35, taluk: 'Holenarasipur' },
  { rainfall: 12, score: 42, taluk: 'Hassan' },
  { rainfall: 22, score: 48, taluk: 'Arakalagudu' },
  { rainfall: 28, score: 52, taluk: 'Belur' },
  { rainfall: 48, score: 71, taluk: 'Alur' },
  { rainfall: 92, score: 82, taluk: 'Sakleshpur' },
];


const SEEDED_MITRAS = [
  { id: 'm1', name: 'Ravi Verma', taluk: 'Hassan', lat: 13.010, lng: 76.110, casesResolved: 12, avgResponse: '14m', activeCases: 2, status: 'Active' },
  { id: 'm2', name: 'Priya S.', taluk: 'Sakleshpur', lat: 12.950, lng: 75.800, casesResolved: 34, avgResponse: '8m', activeCases: 0, status: 'Available' },
  { id: 'm3', name: 'Gowda Bros', taluk: 'Belur', lat: 13.170, lng: 75.870, casesResolved: 8, avgResponse: '22m', activeCases: 4, status: 'Overloaded' },
];

const SEEDED_LOGS = [
  { id: 1, type: 'SOS', msg: 'Ramesh Kumar generated critical distress signal.', time: 'Just now' },
  { id: 2, type: 'CLAIM', msg: 'Volunteer Priya S. deployed to Case #f2.', time: '2m ago' },
  { id: 3, type: 'CHECKIN', msg: 'Arjun Hegde reported positive yield (+12 pts).', time: '14m ago' },
  { id: 4, type: 'REGISTER', msg: 'New Farmer Onboarded in Arakalagudu sector.', time: '1h ago' }
];

/* ─── Seeded farmer data ─── */
const SEEDED_FARMERS = [
  {
    id: 'f1',
    name: 'Ramesh Kumar',
    taluk: 'Alur',
    village: 'Alur HQ',
    lat: 12.9691,
    lng: 76.0450,
    score: 78,
    status: 'Red',
    crop: 'Paddy',
    loanDaysOverdue: 60,
    marketActivity: 'Inactive',
    trajectory: 'Worsening'
  },
  {
    id: 'f2',
    name: 'Kavitha Reddy',
    taluk: 'Arsikere',
    village: 'Arsikere HQ',
    lat: 13.3150,
    lng: 76.2580,
    score: 82,
    status: 'Red',
    crop: 'Sugarcane',
    loanDaysOverdue: 45,
    marketActivity: 'Inactive',
    trajectory: 'Worsening'
  },
  {
    id: 'f3',
    name: 'Prakash N',
    taluk: 'Hassan',
    village: 'Hassan HQ',
    lat: 13.0068,
    lng: 76.1004,
    score: 52,
    status: 'Yellow',
    crop: 'Maize',
    loanDaysOverdue: 0,
    marketActivity: 'Low',
    trajectory: 'Stable'
  },
  {
    id: 'f4',
    name: 'Manjunath S',
    taluk: 'Sakleshpur',
    village: 'Sakleshpur HQ',
    lat: 12.9630,
    lng: 75.7860,
    score: 45,
    status: 'Yellow',
    crop: 'Coffee',
    loanDaysOverdue: 0,
    marketActivity: 'Active',
    trajectory: 'Stable'
  },
  {
    id: 'f5',
    name: 'Suresh Gowda',
    taluk: 'Belur',
    village: 'Belur HQ',
    lat: 13.1610,
    lng: 75.8580,
    score: 18,
    status: 'Green',
    crop: 'Ragi',
    loanDaysOverdue: 0,
    marketActivity: 'Active',
    trajectory: 'Stable'
  }
];

const TREND_DATA = [
  { day: '08 Mar', score: 42 }, { day: '09 Mar', score: 45 }, { day: '10 Mar', score: 48 },
  { day: '11 Mar', score: 52 }, { day: '12 Mar', score: 50 }, { day: '13 Mar', score: 55 },
  { day: '14 Mar', score: 58 }, { day: '15 Mar', score: 61 }, { day: '16 Mar', score: 59 },
  { day: '17 Mar', score: 54 }, { day: '18 Mar', score: 53 }, { day: '19 Mar', score: 51 },
  { day: '20 Mar', score: 55 }, { day: '21 Mar', score: 54 },
];

const STATUS_COLOR = { Red: '#ff4d4d', Yellow: '#ffaa00', Green: '#00e676' };
const STATUS_BG = { Red: 'bg-red-500/10', Yellow: 'bg-orange-500/10', Green: 'bg-emerald-500/10' };

const StatCard = ({ icon: Icon, value, label, color, sub }) => (
  <div className="bg-[#0f172a] border border-white/5 rounded-2xl p-5 flex flex-col gap-1 hover:border-teal-500/30 transition-all relative overflow-hidden group">
    <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
      <Icon size={80} />
    </div>
    <div className="flex items-center gap-2 text-gray-500 text-[10px] uppercase font-bold tracking-widest">
      <Icon size={14} className="text-teal-500" /> {label}
    </div>
    <div className={`text-4xl font-black ${color || 'text-white'} tracking-tighter`}>{value}</div>
    {sub && <div className="text-[10px] text-gray-600 font-bold uppercase">{sub}</div>}
  </div>
);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);

  // Guard Route
  useEffect(() => {
    setAdminData({ 
      district: 'Hassan', 
      name: 'District Officer',
      role: 'admin'
    });
  }, []);

  const [viewMode, setViewMode] = useState('farmers'); // 'farmers' | 'mitras'
  const [farmers, setFarmers] = useState(SEEDED_FARMERS);
  const [mitras, setMitras] = useState(SEEDED_MITRAS);
  const [globalLogs, setGlobalLogs] = useState(SEEDED_LOGS);
  const [selected, setSelected] = useState(null);
  const [alerting, setAlerting] = useState(false);
  const [alertLog, setAlertLog] = useState([]);
  const [liveMode, setLiveMode] = useState(false);
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [broadcastTaluk, setBroadcastTaluk] = useState('Alur');
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Real-time synchronization for check-ins and SOS
  useEffect(() => {
    const handleSync = () => {
      const lastEventRaw = localStorage.getItem('krishimanas_last_event');
      if (!lastEventRaw) return;
      try {
        const event = JSON.parse(lastEventRaw);
        if (event.type === 'SCORE_UPDATE') {
          setFarmers(prev => prev.map(f => {
            if (f.id === event.farmerId || f.name === event.farmerName) {
              return { ...f, score: event.newScore, status: event.newScore >= 65 ? 'Red' : event.newScore >= 35 ? 'Yellow' : 'Green' };
            }
            return f;
          }));
        }
      } catch (e) {
        console.error("Sync error", e);
      }
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('krishimanas_update', (e) => handleSync()); // Local event in same tab
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('krishimanas_update', handleSync);
    };
  }, []);

  // Live feed simulation (random drift)
  useEffect(() => {
    if (!liveMode) return;
    const interval = setInterval(() => {
      setFarmers(prev => prev.map(f => {
        if (Math.random() < 0.15) {
          const delta = Math.floor((Math.random() - 0.4) * 8);
          const newScore = Math.min(100, Math.max(0, f.score + delta));
          return { ...f, score: newScore, status: newScore >= 65 ? 'Red' : newScore >= 35 ? 'Yellow' : 'Green' };
        }
        return f;
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, [liveMode]);

  const stats = {
    red: farmers.filter(f => f.status === 'Red').length,
    yellow: farmers.filter(f => f.status === 'Yellow').length,
    green: farmers.filter(f => f.status === 'Green').length,
    avg: Math.round(farmers.reduce((s, f) => s + f.score, 0) / farmers.length)
  };

  const talukData = [...new Set(farmers.map(f => f.taluk))].map(t => ({
    name: t,
    Red: farmers.filter(f => f.taluk === t && f.status === 'Red').length,
    Yellow: farmers.filter(f => f.taluk === t && f.status === 'Yellow').length,
    Green: farmers.filter(f => f.taluk === t && f.status === 'Green').length,
  }));

  const handleDemoAlert = async () => {
    setAlerting(true);
    const red = farmers.filter(f => f.status === 'Red');
    const logs = [];
    for (const f of red) {
      const msg = SMS_TEMPLATES.distressAlert(f.name, f.score, f.taluk);
      const res = await sendSMS({ to: '+91XXXXXXXXXX', message: msg, farmerName: f.name });
      logs.push(`✓ ALERT SENT: ${f.name} (SID: ${res.sid.substring(0, 6)})`);
    }
    setAlertLog(logs);
    setAlerting(false);
  };

  const handleBroadcast = () => {
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastOpen(false);
      setBroadcastSent(false);
      setGlobalLogs(prev => [{
        id: Date.now(),
        type: 'BROADCAST',
        msg: `📻 AIR Hassan broadcast scheduled for ${broadcastTaluk} taluk — 101.4 FM`,
        time: 'Just now'
      }, ...prev]);
      toast.success(
        `✅ Broadcast scheduled — ${broadcastTaluk} taluk — AIR Hassan 101.4 FM`,
        { duration: 4000 }
      );
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-teal-500/30 overflow-x-hidden">
      <Toaster position="top-center" />
      <div className="w-full overflow-hidden bg-[#922B21] py-1.5 relative z-[1001]">
        <div
          className="whitespace-nowrap text-white text-[11px] font-black uppercase tracking-widest"
          style={{
            display: 'inline-block',
            animation: 'ticker 35s linear infinite'
          }}
        >
          🔴 LIVE — KrishiManthan 2026 — Hassan District, 
          Karnataka — Farmer Distress Early Warning System — 
          47 farmers lost every day in India — KrishiManas 
          watches before it is too late 🌾 — 
          Passive Detection. Contextual Intervention. 
          Community Infrastructure. — 
          Build. Innovate. Disrupt. — 
          PS-05 Open Innovation — ME-RIISE Foundation @ 
          MCE Hassan — AIR Hassan 101.4 FM Partner — 
          🔴 LIVE — KrishiManthan 2026 — Hassan District —
        </div>
      </div>
      {/* Header */}
      <nav className="h-16 border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-[1000]">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-teal-500 font-black text-2xl tracking-tighter transition-all hover:opacity-80">
            <Home size={22} /> KrishiManas
          </button>
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            <MapPin size={12} className="text-teal-500" /> {adminData?.district || 'Hassan'} District Command
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${liveMode ? 'bg-system-green animate-pulse shadow-[0_0_8px_#00e676]' : 'bg-slate-700'}`}></div>
            <button onClick={() => setLiveMode(!liveMode)} className={`text-[10px] font-black uppercase tracking-widest ${liveMode ? 'text-teal-500' : 'text-slate-500 hover:text-slate-300'}`}>
              {liveMode ? 'Live Mode Active' : 'Enable Live Feed'}
            </button>
          </div>
          <div className="text-xs font-mono text-slate-500 tabular-nums bg-white/5 px-3 py-1 rounded-lg border border-white/5">
            {new Date().toLocaleTimeString('en-IN', { hour12: false })}
          </div>
        </div>
      </nav>

      <div className="p-6 space-y-6 max-w-[1600px] mx-auto">

        {/* Top Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard icon={Users} label="Total Farmers" value={farmers.length} />
          <StatCard icon={AlertTriangle} label="Urgent (Red)" value={stats.red} color="text-red-500" />
          <StatCard icon={TrendingUp} label="Warning (Yellow)" value={stats.yellow} color="text-orange-500" />
          <StatCard icon={CheckCircle} label="Stable (Green)" value={stats.green} color="text-emerald-500" />
          <StatCard icon={Activity} label="Avg Distress" value={stats.avg} color={stats.avg >= 65 ? 'text-red-500' : stats.avg >= 35 ? 'text-orange-500' : 'text-emerald-500'} />
          <StatCard icon={Bell} label="SMS Broadcasts" value={alertLog.length} color="text-teal-500" sub="Sector Alerts Fired" />
        </div>

        {/* Main Workspace */}
        <div className="grid xl:grid-cols-12 gap-6 items-start">

          {/* Left: Map & Charts */}
          <div className="xl:col-span-8 space-y-6">

            {/* Map Container */}
            <div className="bg-[#0f172a] border border-white/5 rounded-3xl overflow-hidden relative group">
              <div className="absolute top-4 left-4 z-[999] bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-3 px-4 flex items-center gap-4">
                <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest text-teal-500">
                  <Map size={14} /> Spatial Risk Matrix
                </div>
                <div className="h-4 w-[1px] bg-white/10"></div>
                <div className="flex gap-4 text-[9px] font-bold uppercase text-slate-400">
                  {viewMode === 'farmers' ? (
                    <>
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500"></span> Red</span>
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-500"></span> Yellow</span>
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Green</span>
                    </>
                  ) : (
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></span> Mitra Active</span>
                  )}
                </div>
              </div>

              <MapContainer
                center={[13.007, 76.1]}
                zoom={10}
                style={{ height: '520px', background: '#020617' }}
                className="[&_.leaflet-control-zoom]:border-none [&_.leaflet-control-zoom-in]:bg-black/60 [&_.leaflet-control-zoom-out]:bg-black/60 [&_.leaflet-control-zoom-in]:text-white [&_.leaflet-control-zoom-out]:text-white [&_.leaflet-control-attribution]:hidden"
              >
                <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

                {/* Render Farmers */}
                {viewMode === 'farmers' && farmers.map(f => (
                  <CircleMarker
                    key={f.id}
                    center={[f.lat, f.lng]}
                    radius={f.status === 'Red' ? 12 : f.status === 'Yellow' ? 9 : 7}
                    pathOptions={{
                      fillColor: STATUS_COLOR[f.status],
                      color: '#ffffff',
                      fillOpacity: 0.8,
                      weight: selected?.id === f.id ? 3 : 0.5,
                    }}
                    eventHandlers={{
                      click: () => setSelected(f),
                      mouseover: (e) => e.target.openTooltip()
                    }}
                  >
                    <LeafletTooltip className="!bg-slate-900 !border-slate-800 !text-white !rounded-xl !p-0 !overflow-hidden !shadow-2xl">
                      <div className="p-3 bg-slate-900 min-w-[160px]">
                        <div className={`text-[8px] font-black uppercase tracking-widest mb-1 ${f.status === 'Red' ? 'text-red-500' : f.status === 'Yellow' ? 'text-orange-500' : 'text-emerald-500'}`}>
                          {f.status} Risk Zone
                        </div>
                        <div className="font-black text-sm text-white mb-0.5">{f.name}</div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase">{f.taluk} · {f.crop}</div>
                      </div>
                    </LeafletTooltip>
                  </CircleMarker>
                ))}

                {/* Render Mitras */}
                {viewMode === 'mitras' && mitras.map(m => (
                  <CircleMarker
                    key={m.id}
                    center={[m.lat, m.lng]}
                    radius={10}
                    pathOptions={{
                      fillColor: '#3b82f6',
                      color: '#60a5fa',
                      fillOpacity: 0.9,
                      weight: selected?.id === m.id ? 4 : 2,
                    }}
                    eventHandlers={{
                      click: () => setSelected(m),
                      mouseover: (e) => e.target.openTooltip()
                    }}
                  >
                    <LeafletTooltip className="!bg-slate-900 !border-slate-800 !text-white !rounded-xl !p-0 !overflow-hidden !shadow-2xl">
                      <div className="p-3 bg-slate-900 min-w-[160px]">
                        <div className="text-[8px] font-black uppercase tracking-widest mb-1 text-blue-400">
                          Krishi Mitra Unit
                        </div>
                        <div className="font-black text-sm text-white mb-0.5">{m.name}</div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase">{m.taluk} Sector</div>
                      </div>
                    </LeafletTooltip>
                  </CircleMarker>
                ))}
              </MapContainer>
            </div>

            {/* Sub Charts */}
            <div className="space-y-6">
              
              {/* Row 1: Trend + Sector side by side */}
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Trend Chart */}
              <div className="bg-[#0f172a] border border-white/5 rounded-3xl p-6 h-[320px] flex flex-col">
                <div className="flex items-center gap-2 mb-6">
                  <LineIcon size={16} className="text-teal-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Historical Distress Trend (14D)</span>
                </div>
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={TREND_DATA}>
                      <defs>
                        <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                      <XAxis dataKey="day" stroke="#ffffff20" fontSize={10} axisLine={false} tickLine={false} />
                      <YAxis stroke="#ffffff20" fontSize={10} axisLine={false} tickLine={false} domain={[0, 100]} />
                      <RechartsTooltip
                        contentStyle={{ backgroundColor: '#020617', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '10px' }}
                        itemStyle={{ color: '#14b8a6', fontWeight: 'bold' }}
                      />
                      <Area type="monotone" dataKey="score" stroke="#14b8a6" strokeWidth={3} fillOpacity={1} fill="url(#trendGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="bg-[#0f172a] border border-white/5 rounded-3xl p-6 h-[320px] flex flex-col">
                <div className="flex items-center gap-2 mb-6">
                  <BarChart3 size={16} className="text-teal-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Sector Risk Distribution</span>
                </div>
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={talukData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} horizontal={false} />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" stroke="#ffffff30" fontSize={9} width={90} axisLine={false} tickLine={false} />
                      <RechartsTooltip
                        cursor={{ fill: '#ffffff05' }}
                        contentStyle={{ backgroundColor: '#020617', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '10px' }}
                      />
                      <Bar dataKey="Red" stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} barSize={10} />
                      <Bar dataKey="Yellow" stackId="a" fill="#f59e0b" />
                      <Bar dataKey="Green" stackId="a" fill="#10b981" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Row 2: Season Comparison — full width */}
            <div className="bg-[#0f172a] border border-white/5 rounded-3xl p-6">
              
              {/* Alur callout box */}
              <div className="mb-4 px-4 py-3 bg-orange-500/10 border border-orange-500/30 rounded-xl flex items-center gap-3">
                <span className="text-orange-400 text-lg">⚠️</span>
                <div>
                  <div className="text-orange-400 font-black text-sm">
                    Alur taluk distress up 61% this season
                  </div>
                  <div className="text-orange-300 text-[11px] font-medium">
                    ಅಲೂರು ತಾಲ್ಲೂಕು ತೊಂದರೆ ಕಳೆದ ಋತುವಿಗಿಂತ 61% ಹೆಚ್ಚಾಗಿದೆ
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={16} className="text-teal-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  This Season vs Last Season — Distress by Taluk
                </span>
              </div>

              <div style={{ height: '260px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={SEASON_COMPARISON}
                    margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                  >
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke="#ffffff05" 
                      vertical={false} 
                    />
                    <XAxis
                      dataKey="taluk"
                      stroke="#ffffff20"
                      fontSize={10}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#ffffff20"
                      fontSize={10}
                      axisLine={false}
                      tickLine={false}
                      domain={[0, 100]}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: '#020617',
                        border: '1px solid #ffffff10',
                        borderRadius: '12px',
                        fontSize: '11px'
                      }}
                      itemStyle={{ fontWeight: 'bold' }}
                    />
                    <Bar 
                      dataKey="last" 
                      name="Last Season" 
                      fill="#64748B" 
                      radius={[4, 4, 0, 0]} 
                      barSize={18}
                    />
                    <Bar 
                      dataKey="this" 
                      name="This Season" 
                      fill="#0D7377" 
                      radius={[4, 4, 0, 0]} 
                      barSize={18}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-6 mt-3 justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-[#64748B]" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    Last Season
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-[#0D7377]" />
                  <span className="text-[10px] font-bold text-teal-500 uppercase">
                    This Season
                  </span>
                </div>
              </div>
            </div>

          </div>
          </div>

          {/* Right: Farmer Details & Actions */}
          <aside className="xl:col-span-4 space-y-6 lg:sticky lg:top-[88px]">

            {/* Intel Panel */}
            <div className={`bg-[#0f172a] border rounded-3xl p-6 transition-all duration-500 relative overflow-hidden ${selected ? 'border-teal-500/30' : 'border-white/5'}`}>
              <div className="absolute -right-8 -top-8 text-teal-500 opacity-[0.03] rotate-12">
                <Info size={240} />
              </div>

              {selected ? (
                <div className="relative z-10 space-y-6 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className={`text-[9px] font-black uppercase tracking-[0.2em] mb-1 ${selected?.score ? (selected.status === 'Red' ? 'text-red-500' : selected.status === 'Yellow' ? 'text-orange-500' : 'text-emerald-500') : 'text-blue-500'}`}>
                        {selected?.score ? `Priority Entity : ${selected.status} Phase` : 'Krishi Mitra Unit'}
                      </div>
                      <h2 className="text-3xl font-black text-white tracking-tighter">{selected.name}</h2>
                    </div>
                    <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">Close</button>
                  </div>

                  {selected?.score && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                          <Activity size={10} /> Live Score
                        </div>
                        <div className={`text-4xl font-black tabular-nums ${selected.status === 'Red' ? 'text-red-500' : selected.status === 'Yellow' ? 'text-orange-500' : 'text-emerald-500'}`}>
                          {selected.score}
                        </div>
                      </div>
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                          <TrendingUp size={10} /> Overdue
                        </div>
                        <div className="text-xl font-black text-white mt-1 uppercase tracking-tighter">
                          {selected.loanDaysOverdue} <span className="text-[10px] text-slate-500">Days</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {selected?.casesResolved !== undefined && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                          <CheckCircle size={10} /> Cases Closed
                        </div>
                        <div className="text-4xl font-black tabular-nums text-blue-400">
                          {selected.casesResolved}
                        </div>
                      </div>
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                          <Activity size={10} /> Active Load
                        </div>
                        <div className="text-xl font-black text-white mt-1 uppercase tracking-tighter">
                          {selected.activeCases} <span className="text-[10px] text-slate-500">Farmers</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {selected?.score && (
                    <div className="space-y-4">
                      <div className="text-[9px] font-black uppercase text-teal-500 tracking-[0.2em] flex items-center gap-2">
                        Matched Scheme Proposals <div className="h-[1px] flex-1 bg-teal-500/10"></div>
                      </div>
                      <div className="grid gap-2">
                        {matchSchemes({ score: selected.score, crop: selected.crop, taluk: selected.taluk, loanDaysOverdue: selected.loanDaysOverdue }).schemes.slice(0, 3).map(s => (
                          <div key={s.id} className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center justify-between hover:bg-white/[0.08] transition-colors">
                            <div>
                              <div className="text-[11px] font-bold text-white mb-0.5">{s.name}</div>
                              <div className="text-[9px] text-slate-500 font-bold uppercase">{s.benefit}</div>
                            </div>
                            <div className="text-teal-500"><CheckCircle size={14} /></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button className={`w-full py-4 font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all hover:scale-[1.02] shadow-xl ${selected?.score ? 'bg-teal-500 text-[#020617] hover:bg-teal-400 shadow-teal-500/10' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-500/10'}`}>
                    {selected?.score ? 'Deploy Immediate Support' : 'Dispatch Assignment'}
                  </button>
                </div>
              ) : (
                <div className="h-[460px] flex flex-col relative">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity size={18} className="text-teal-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Global Operations Feed</span>
                    <span className="ml-auto w-2 h-2 rounded-full bg-teal-500 animate-pulse shadow-[0_0_8px_#14b8a6]"></span>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                    {globalLogs.map((log) => (
                      <div key={log.id} className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl flex gap-4 items-start group hover:bg-white/[0.05] transition-all">
                        <div className={`mt-1 flex-shrink-0 w-2 h-2 rounded-full ${log.type === 'SOS' ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : log.type === 'CLAIM' ? 'bg-blue-500 shadow-[0_0_8px_#3b82f6]' : log.type === 'CHECKIN' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-teal-500 shadow-[0_0_8px_#14b8a6]'}`} />
                        <div className="flex-1">
                          <div className="flex justify-between items-baseline mb-1">
                            <div className="text-[9px] font-black tracking-widest uppercase text-slate-500">{log.type}</div>
                            <div className="text-[9px] font-bold text-slate-600 uppercase">{log.time}</div>
                          </div>
                          <div className="text-[13px] font-medium text-slate-300 leading-snug">
                            {log.msg}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#0f172a] to-transparent pointer-events-none" />
                </div>
              )}
            </div>

            {/* Emergency Protocols */}
            <div className={`rounded-3xl p-6 border transition-all duration-1000 ${stats.red > 0 ? 'bg-red-500/5 border-red-500/20' : 'bg-white/5 border-border-white/5'}`}>
              <div className="flex items-center gap-2 mb-4">
                <Bell size={18} className={stats.red > 0 ? 'text-red-500 animate-pulse' : 'text-slate-500'} />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Emergency Broadcast Protocol</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed uppercase tracking-tighter mb-6 opacity-70">
                Mass notification system for <span className="text-red-500 font-black">{stats.red} Farmers</span> in critical sectors.
                Encrypted SMS will be dispatched to assigned regional centers.
              </p>
              <button
                onClick={handleDemoAlert}
                disabled={alerting || stats.red === 0}
                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${stats.red > 0
                    ? 'bg-red-600 text-white hover:bg-red-500 shadow-xl shadow-red-600/20'
                    : 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5'
                  }`}
              >
                {alerting ? <><Loader2 className="animate-spin" size={16} /> Firing...</> : <><Bell size={16} /> Broadcast Alert</>}
              </button>
              <button
                onClick={() => setBroadcastOpen(true)}
                className="w-full mt-3 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all bg-teal-500/10 text-teal-500 hover:bg-teal-500/20 shadow-xl shadow-teal-500/5 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-teal-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="relative z-10 flex items-center gap-2">📻 AIR Hassan Broadcast</span>
              </button>
              {alertLog.length > 0 && (
                <div className="mt-4 bg-black/40 rounded-xl p-3 border border-white/5 max-h-32 overflow-y-auto space-y-1">
                  {alertLog.map((log, i) => (
                    <div key={i} className="text-[9px] font-mono text-teal-500 opacity-80">{log}</div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-[#0f172a] border border-white/5 rounded-3xl p-6">
              
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity size={16} className="text-teal-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Signal Correlation Analysis
                  </span>
                </div>
                <div className="px-3 py-1 bg-teal-500/10 border border-teal-500/20 rounded-full">
                  <span className="text-teal-400 font-black text-sm">
                    ρ = 0.73
                  </span>
                </div>
              </div>

              {/* Correlation stat */}
              <div className="mb-4 p-3 bg-white/[0.02] rounded-xl border border-white/5">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">
                  Weather — Distress Correlation
                </div>
                <div className="text-2xl font-black text-teal-400">
                  0.73
                </div>
                <div className="text-[10px] text-slate-500 font-medium mt-1">
                  Hassan District — Last 30 Days
                </div>
              </div>

              {/* Scatter chart */}
              <div style={{ height: '180px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" />
                    <XAxis
                      dataKey="rainfall"
                      name="Rainfall"
                      unit="mm"
                      stroke="#ffffff20"
                      fontSize={9}
                      axisLine={false}
                      tickLine={false}
                      label={{
                        value: 'Rainfall (mm)',
                        position: 'insideBottom',
                        offset: -2,
                        fill: '#475569',
                        fontSize: 9
                      }}
                    />
                    <YAxis
                      dataKey="score"
                      name="Distress"
                      stroke="#ffffff20"
                      fontSize={9}
                      axisLine={false}
                      tickLine={false}
                      domain={[0, 100]}
                    />
                    <ZAxis range={[40, 40]} />
                    <RechartsTooltip
                      cursor={{ strokeDasharray: '3 3', stroke: '#ffffff20' }}
                      contentStyle={{
                        backgroundColor: '#020617',
                        border: '1px solid #ffffff10',
                        borderRadius: '8px',
                        fontSize: '10px'
                      }}
                      formatter={(value, name) => [value, name]}
                    />
                    <Scatter
                      data={CORRELATION_DATA}
                      fill="#0D7377"
                      opacity={0.8}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>

              {/* Insight */}
              <div className="mt-3 p-3 bg-orange-500/5 border border-orange-500/20 rounded-xl">
                <p className="text-[10px] text-orange-300 font-medium leading-relaxed italic">
                  "Alur taluk — 48mm rain on March 14 — 
                  distress spike detected within 72 hours"
                </p>
              </div>
            </div>
          </aside>
        </div>

        {/* Tactical Registry Table */}
        <div className="bg-[#0f172a] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setViewMode('farmers')}
                className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${viewMode === 'farmers' ? 'text-teal-400' : 'text-slate-500 hover:text-white'}`}
              >
                <Search size={16} /> Farmer Entities
              </button>
              <div className="w-[1px] h-4 bg-white/10" />
              <button
                onClick={() => setViewMode('mitras')}
                className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${viewMode === 'mitras' ? 'text-blue-400' : 'text-slate-500 hover:text-white'}`}
              >
                <Users size={16} /> Mitra Volunteers
              </button>
            </div>
            <span className="bg-white/5 px-2 py-0.5 rounded text-[8px] font-black text-slate-500 uppercase">
              {viewMode === 'farmers' ? farmers.length : mitras.length} Units Active
            </span>
          </div>
          <div className="overflow-x-auto min-h-[300px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01] text-[9px] uppercase font-black text-slate-500 tracking-widest">
                  <th className="px-6 py-4">Status / Role</th>
                  <th className="px-6 py-4">{viewMode === 'farmers' ? 'Farmer Entity' : 'Volunteer Name'}</th>
                  <th className="px-6 py-4">Operational Sector</th>
                  <th className="px-6 py-4">{viewMode === 'farmers' ? 'Primary Crop' : 'Active Cases'}</th>
                  <th className="px-6 py-4 text-right tabular-nums">{viewMode === 'farmers' ? 'Distress Index' : 'Resolved'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {viewMode === 'farmers' ? (
                  [...farmers].sort((a, b) => b.score - a.score).map(f => (
                    <tr
                      key={f.id}
                      onClick={() => setSelected(f)}
                      className={`cursor-pointer transition-all hover:bg-white/[0.03] group ${selected?.id === f.id ? 'bg-teal-500/5' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-2 h-2 rounded-full ${f.status === 'Red' ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : f.status === 'Yellow' ? 'bg-orange-500 shadow-[0_0_8px_#f59e0b]' : 'bg-emerald-500 shadow-[0_0_8px_#10b981]'}`}></div>
                          <span className={`text-[10px] font-black uppercase tracking-tighter ${f.status === 'Red' ? 'text-red-500' : f.status === 'Yellow' ? 'text-orange-500' : 'text-emerald-500'}`}>{f.status} Risk</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-black text-sm text-slate-200 group-hover:text-white transition-colors">{f.name}</div>
                        <div className="text-[8px] text-slate-600 font-bold uppercase tracking-widest mt-0.5">HASSAN // {f.id.toUpperCase()}</div>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">{f.taluk}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 bg-white/5 border border-white/5 rounded text-[9px] font-black text-slate-400 uppercase tracking-tighter">{f.crop}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`text-xl font-black tabular-nums transition-colors ${f.status === 'Red' ? 'text-red-500' : f.status === 'Yellow' ? 'text-orange-500' : 'text-emerald-500'}`}>{f.score}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  [...mitras].map(m => (
                    <tr
                      key={m.id}
                      onClick={() => setSelected(m)}
                      className={`cursor-pointer transition-all hover:bg-white/[0.03] group ${selected?.id === m.id ? 'bg-blue-500/5' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-2 h-2 rounded-full ${m.status === 'Available' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : m.status === 'Overloaded' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                          <span className="text-[10px] font-black text-blue-400 uppercase tracking-tighter">Mitra Unit</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-black text-sm text-slate-200 group-hover:text-white transition-colors">{m.name}</div>
                        <div className="text-[8px] text-slate-600 font-bold uppercase tracking-widest mt-0.5">VOLUNTEER // {m.id.toUpperCase()}</div>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">{m.taluk}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 bg-white/5 border border-white/5 rounded text-[9px] font-black text-white uppercase tracking-tighter">{m.activeCases} Open</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-xl font-black tabular-nums transition-colors text-blue-500">{m.casesResolved}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {broadcastOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[2000] flex items-center justify-center p-6">
          <div className="bg-[#0f172a] border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-xl">
                📻
              </div>
              <div>
                <div className="font-black text-white text-lg">
                  AIR Hassan Broadcast
                </div>
                <div className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">
                  ಆಕಾಶವಾಣಿ ಹಾಸನ ಪ್ರಸಾರ — 101.4 FM
                </div>
              </div>
            </div>

            {/* Taluk Selector */}
            <div className="mb-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">
                Select Taluk / ತಾಲ್ಲೂಕು ಆಯ್ಕೆ ಮಾಡಿ
              </label>
              <select
                value={broadcastTaluk}
                onChange={e => setBroadcastTaluk(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold text-sm focus:outline-none focus:border-teal-500/50"
              >
                {['Hassan','Alur','Sakleshpur','Arsikere',
                  'Belur','Channarayapatna',
                  'Holenarasipur','Arakalagudu'].map(t => (
                  <option key={t} value={t} className="bg-[#0f172a]">
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Message Preview */}
            <div className="mb-6">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">
                Broadcast Message Preview
              </label>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-slate-300 text-sm font-medium leading-relaxed mb-3">
                  ಹಾಸನ್ ಜಿಲ್ಲೆಯ {broadcastTaluk} ತಾಲ್ಲೂಕಿನ ರೈತ 
                  ಬಾಂಧವರೇ — PM ಫಸಲ್ ಬಿಮಾ ಯೋಜನೆಗೆ ಮಾರ್ಚ್ 31 
                  ರೊಳಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ. ಹತ್ತಿರದ CSC ಕೇಂದ್ರಕ್ಕೆ 
                  ಭೇಟಿ ನೀಡಿ. ನಿಮ್ಮ ಕೃಷಿ ಮಿತ್ರರನ್ನು ಸಂಪರ್ಕಿಸಿ.
                </p>
                <p className="text-slate-500 text-[11px] font-medium leading-relaxed">
                  Farmers of {broadcastTaluk} taluk, Hassan district — 
                  Apply for PMFBY crop insurance before March 31. 
                  Visit your nearest CSC. Contact your Krishi Mitra.
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setBroadcastOpen(false)}
                className="flex-1 py-3 rounded-xl border border-white/10 text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleBroadcast}
                disabled={broadcastSent}
                className="flex-1 py-3 rounded-xl bg-teal-500 text-[#020617] font-black text-xs uppercase tracking-widest hover:bg-teal-400 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {broadcastSent ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#020617]/30 border-t-[#020617] rounded-full animate-spin" />
                    Scheduling...
                  </>
                ) : (
                  '📻 Confirm Broadcast'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
