import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, CheckCircle, Phone, User, AlertTriangle, ChevronDown, 
  Clock, MessageSquare, Search, Filter, LayoutDashboard, ListTodo, History, Info,
  TrendingUp, BarChart3, Bell, X, Activity, MapPin
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Cell 
} from 'recharts';
import { sendSMS, SMS_TEMPLATES } from '../utils/mockTwilio';
import { matchSchemes } from '../utils/matchSchemes';
import { useLang } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { db, fb } from '../utils/firebase';
import { collection, query, onSnapshot, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';

const INITIAL_ROSTER = [
  {
    id: 'f1', name: 'Ramesh Kumar', village: 'Alur HQ', taluk: 'Alur',
    score: 78, status: 'Red', crop: 'Paddy', loanDaysOverdue: 60,
    phone: '+919876543210', assignedAt: '2 days ago',
    checklist: [
      { id: 'visit', label: 'Visit the farm & assess situation', done: false },
      { id: 'docs',  label: 'Assist with scheme documentation', done: false },
      { id: 'resolve', label: 'Mark case as resolved (requires proof)', done: false, requiresNote: true },
    ],
  },
  {
    id: 'f6', name: 'Kavitha Naik', village: 'Belur Main', taluk: 'Belur',
    score: 55, status: 'Yellow', crop: 'Paddy', loanDaysOverdue: 45,
    phone: '+919876500001', assignedAt: '1 day ago',
    checklist: [
      { id: 'visit', label: 'Visit the farm & assess situation', done: true },
      { id: 'docs',  label: 'Assist with scheme documentation', done: false },
      { id: 'resolve', label: 'Mark case as resolved (requires proof)', done: false, requiresNote: true },
    ],
  }
];

const INITIAL_MARKET = [
  { id: 'f99', name: 'Demo Farmer', district: 'Hassan', score: 60, status: 'Yellow', crop: 'Maize' }
];

const ANALYTICS_DATA = [
  { name: 'Red Zone', value: 2, color: '#ef4444' },
  { name: 'Yellow Zone', value: 1, color: '#f59e0b' },
  { name: 'Resolved', value: 5, color: '#10b981' },
];

const TIMELINE_DATA = [
  { day: 'Mon', distress: 65, interventions: 2 },
  { day: 'Tue', distress: 58, interventions: 4 },
  { day: 'Wed', distress: 45, interventions: 5 },
  { day: 'Thu', distress: 35, interventions: 8 },
  { day: 'Fri', distress: 22, interventions: 12 },
];

export default function MitraPortal() {
  const navigate = useNavigate();
  const { lang } = useLang();
  const { currentUser, logout } = useAuth();
  
  const isFarmer = currentUser?.roles?.includes('farmer');
  
  const [assignedRoster, setAssignedRoster] = useState(INITIAL_ROSTER);
  const [openMarket, setOpenMarket] = useState(INITIAL_MARKET);
  const [sosAlerts, setSosAlerts] = useState([]);
  
  const [expanded, setExpanded] = useState(INITIAL_ROSTER[0].id);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('roster'); // roster, market, insights
  const [noteInput, setNoteInput] = useState({});
  const [caseHistory, setCaseHistory] = useState({});
  const [selectedFarmerDetails, setSelectedFarmerDetails] = useState(null); // For the Dossier modal

  useEffect(() => {
    if (!currentUser) return;

    // 1. Sync Market & Roster from Users Collection
    const qUsers = query(collection(db, 'users'));
    const unsubUsers = onSnapshot(qUsers, (snapshot) => {
      if (!snapshot.empty) {
        const allUsers = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        const farmers = allUsers.filter(u => u.roles?.includes('farmer'));
        
        const formattedFarmers = farmers.map(f => ({
          ...f,
          village: f.district || 'Hassan',
          taluk: f.district || 'Hassan',
          phone: f.phone || '+91 9999999999',
          score: f.score || 55,
          status: f.score >= 65 ? 'Red' : f.score >= 35 ? 'Yellow' : 'Green',
          crop: f.crop || 'Unknown',
          loanDaysOverdue: f.loanDaysOverdue || 0,
          checklist: f.checklist || [
            { id: 'visit', label: 'Visit the farm & assess situation', done: false },
            { id: 'docs',  label: 'Assist with scheme documentation', done: false },
            { id: 'resolve', label: 'Mark case as resolved (requires proof)', done: false, requiresNote: true },
          ]
        }));

        const market = formattedFarmers.filter(f => !f.assignedMitraId);
        const roster = formattedFarmers.filter(f => f.assignedMitraId === currentUser.uid);
        
        if (market.length > 0) setOpenMarket(market);
        if (roster.length > 0) setAssignedRoster(roster);
      }
    }, (err) => console.error("Mitra Users Sync Error:", err));

    // 2. Sync SOS Alerts
    const qSos = query(collection(db, 'active_sos'));
    const unsubSos = onSnapshot(qSos, (snapshot) => {
      if (!snapshot.empty) {
        const alerts = snapshot.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(a => a.status === 'pending')
          .map(a => ({ 
            id: a.farmerId, 
            name: a.farmerName, 
            type: 'SOS Request', 
            ts: a.timestamp ? new Date(a.timestamp.toDate()).toLocaleTimeString() : 'Just now', 
            docId: a.id 
          }));
        setSosAlerts(alerts);
      }
    }, (err) => console.error("Mitra SOS Sync Error:", err));

    return () => {
      unsubUsers();
      unsubSos();
    };
  }, [currentUser]);

  const handleCheck = async (farmerId, checkId, requiresNote) => {
    const key = `${farmerId}_${checkId}`;
    const note = noteInput[key] || '';
    if (requiresNote && !note.trim()) {
      alert("Proof of Work required! Please enter resolution notes.");
      return;
    }

    const farmer = assignedRoster.find(c => c.id === farmerId);
    if (!farmer) return;

    const ts = new Date().toLocaleTimeString();
    const newChecklist = farmer.checklist.map(item =>
      item.id === checkId ? { ...item, done: true, note, ts } : item
    );

    const userRef = doc(db, 'users', farmerId);
    
    try {
      if (checkId === 'resolve') {
        const historyRef = collection(db, `users/${farmerId}/case_history`);
        await addDoc(historyRef, {
          action: 'resolve',
          note,
          mitraId: currentUser.uid,
          mitraName: currentUser.name,
          timestamp: serverTimestamp()
        });
        
        // Remove from current roster to reset farmer state
        await updateDoc(userRef, { 
          assignedMitraId: null,
          checklist: null,
        });

        // Update Mitra score/resolved count
        const mitraRef = doc(db, 'users', currentUser.uid);
        await updateDoc(mitraRef, {
          casesResolved: (currentUser.casesResolved || 0) + 1
        });

        await fb.logActivity('CASE_RESOLVED', `Mitra ${currentUser.name} resolved case for ${farmer.name}. Note: ${note}`);
        alert("Case archived to History Log.");
      } else {
        await updateDoc(userRef, { checklist: newChecklist });
        // Local history preview
        setCaseHistory(prev => ({
          ...prev,
          [farmerId]: [...(prev[farmerId] || []), { action: checkId, note, ts }],
        }));
      }
      setNoteInput(prev => ({ ...prev, [key]: '' }));
    } catch (e) {
      console.error("Error updating checklist:", e);
      alert("Failed to update case.");
    }
  };

  const handleClaimMarketFarmer = async (farmer) => {
    try {
      const userRef = doc(db, 'users', farmer.id);
      await updateDoc(userRef, {
        assignedMitraId: currentUser.uid,
        assignedAt: serverTimestamp()
      });
      await fb.logActivity('CASE_CLAIMED', `Mitra ${currentUser.name || 'Unknown'} claimed case for ${farmer.name}`);
      setActiveTab('roster');
      setExpanded(farmer.id);
    } catch (e) {
      console.error("Failed to claim case", e);
      alert("Error claiming case in database.");
    }
  };

  const handleAcknowledgeSOS = async (alert) => {
    if (alert.docId) {
      const sosRef = doc(db, 'active_sos', alert.docId);
      await updateDoc(sosRef, { status: 'claimed', claimedBy: currentUser?.uid });
      await fb.logActivity('SOS_CLAIMED', `Mitra ${currentUser?.name || 'Unknown'} acknowledged SOS for ${alert.name}`);
    }
    setSosAlerts(prev => prev.filter(a => a.id !== alert.id));
    setActiveTab('market');
  };

  const handleSendAlert = async (caseId, name) => {
     await fb.triggerSOS(caseId, name, currentUser?.district || 'Hassan');
     await fb.logActivity('MITRA_ESCALATION', `Critical Escalation by Mitra ${currentUser?.name} for ${name}`);
     alert(`Critical alert for ${name} has been escalated to the Admin Command Center.`);
  };

  const urgentCount = assignedRoster.filter(c => c.status === 'Red').length;
  const filteredCases = assignedRoster.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

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
            onClick={() => setActiveTab('roster')} 
            className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all font-black text-xs uppercase tracking-widest ${activeTab === 'roster' ? 'bg-teal-500 text-[#020617] shadow-xl shadow-teal-500/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <div className="flex items-center gap-3">
               <LayoutDashboard size={18} /> My Roster
            </div>
            {urgentCount > 0 && <span className="bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">{urgentCount}</span>}
          </button>
          <button 
            onClick={() => setActiveTab('market')} 
            className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all font-black text-xs uppercase tracking-widest ${activeTab === 'market' ? 'bg-teal-500 text-[#020617] shadow-xl shadow-teal-500/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <div className="flex items-center gap-3">
               <Search size={18} /> Open Market
            </div>
            {openMarket.length > 0 && <span className="bg-amber-500 text-[#020617] w-5 h-5 rounded-full flex items-center justify-center text-[10px]">{openMarket.length}</span>}
          </button>
          <button 
            onClick={() => setActiveTab('insights')} 
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all font-black text-xs uppercase tracking-widest ${activeTab === 'insights' ? 'bg-teal-500 text-[#020617] shadow-xl shadow-teal-500/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <TrendingUp size={18} /> Analytics & History
          </button>
        </nav>

        <div className="p-6 mt-auto space-y-4 max-h-[40vh] overflow-y-auto">
          {/* Action Required: SOS Alerts */}
          {sosAlerts.length > 0 && (
            <div className="space-y-3">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Action Required</div>
              {sosAlerts.map(alert => (
                <div key={alert.id} className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 animate-pulse">
                   <div className="flex items-center gap-2 text-red-500 font-black text-[10px] uppercase tracking-widest mb-1">
                      <Bell size={12} /> {alert.type}
                   </div>
                   <div className="text-sm font-black text-white">{alert.name}</div>
                   <button 
                     onClick={() => handleAcknowledgeSOS(alert)}
                     className="mt-3 w-full py-2 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-400"
                   >
                     Acknowledge & React
                   </button>
                </div>
              ))}
            </div>
          )}

          {/* Just registered/Open farmers mini view (optional, since we have a tab now, but good for awareness) */}
          {openMarket.slice(0, 2).map(f => f.isNew && (
            <div key={f.id} className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 animate-in slide-in-from-left-4">
               <div className="flex items-center gap-2 text-amber-500 font-black text-[10px] uppercase tracking-widest mb-1">
                  <User size={12} /> New Registration
               </div>
               <div className="text-sm font-black text-white">{f.name}</div>
               <div className="text-[10px] text-amber-500 font-bold uppercase tracking-widest mt-1 opacity-80">{f.district} Sector</div>
               <button 
                 onClick={() => handleClaimMarketFarmer(f)}
                 className="mt-3 w-full py-2 bg-amber-500 text-[#020617] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-400 border border-amber-400 shadow-lg shadow-amber-500/20"
               >
                 Take Ownership
               </button>
            </div>
          ))}

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
        
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div>
              <h1 className="text-4xl font-black text-[#020617] tracking-tighter">
                {activeTab === 'roster' ? 'Field Intervention Queue' : activeTab === 'market' ? 'Available Regional Cases' : 'Regional Load Analysis'}
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

        {activeTab === 'roster' ? (
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
                                         <button onClick={() => setSelectedFarmerDetails(c)} className="flex flex-col items-center justify-center p-5 bg-white border border-slate-200 text-navy rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-teal-500 hover:text-teal-600 transition-all">
                                            <User size={24} className="mb-2" /> Full Dossier & Log
                                         </button>
                                         <button onClick={() => handleSendAlert(c.id, c.name)} className="col-span-2 flex items-center justify-center gap-3 p-4 bg-[#020617] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-gray-900/10 hover:bg-slate-800 transition-all">
                                            <AlertTriangle size={16} className="text-amber-500" /> Escalate to Admin
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
        ) : activeTab === 'market' ? (
          <div className="space-y-6 animate-in fade-in duration-500">
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {openMarket.map(f => (
                  <div key={f.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:border-amber-500/30 transition-all group">
                     <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center font-black text-xl">
                           {f.score}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${f.status === 'Red' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}`}>
                           {f.status} Zone
                        </span>
                     </div>
                     <h3 className="text-xl font-black text-navy mb-1">{f.name}</h3>
                     <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 mb-6">
                        <MapPin size={12} /> {f.district || f.village} Taluk
                     </div>
                     <button 
                       onClick={() => handleClaimMarketFarmer(f)}
                       className="w-full py-3 bg-amber-500 text-[#020617] rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-all"
                     >
                        Take Ownership
                     </button>
                  </div>
                ))}
                {openMarket.length === 0 && (
                  <div className="col-span-full py-20 text-center text-slate-400 font-bold uppercase tracking-widest">
                     No unassigned registrations in your sector.
                  </div>
                )}
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

                {/* Efficiency Analysis -> Replaced with Timeline as requested */}
                <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm flex flex-col min-h-[400px]">
                   <div className="flex items-center gap-3 mb-8">
                      <TrendingUp size={20} className="text-teal-500" />
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Distress Intervention Timeline</span>
                   </div>
                   <div className="flex-1 w-full relative">
                      <ResponsiveContainer width="100%" height="100%">
                         <LineChart data={TIMELINE_DATA}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            <XAxis dataKey="day" fontSize={10} fontStyle="bold" axisLine={false} tickLine={false} />
                            <YAxis yAxisId="left" axisLine={false} tickLine={false} fontSize={10} />
                            <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} fontSize={10} hide />
                            <Tooltip cursor={{fill: '#f8fafc', strokeWidth: 0 }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                            <Line yAxisId="left" type="monotone" dataKey="distress" name="Avg Distress" stroke="#ef4444" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            <Line yAxisId="right" type="stepAfter" dataKey="interventions" name="Interventions" stroke="#10b981" strokeWidth={3} strokeDasharray="5 5" dot={false} />
                         </LineChart>
                      </ResponsiveContainer>
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

      {/* Farmer Dossier Modal */}
      {selectedFarmerDetails && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              <div className="p-6 md:p-8 bg-[#020617] text-white flex justify-between items-start relative overflow-hidden">
                 <div className="absolute -right-10 -bottom-10 text-white/5 rotate-12">
                    <User size={200} />
                 </div>
                 <div className="relative z-10">
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-500 mb-2">Farmer Dossier</div>
                    <h2 className="text-3xl font-black tracking-tighter mb-1">{selectedFarmerDetails.name}</h2>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                       <MapPin size={12} /> {selectedFarmerDetails.village}, {selectedFarmerDetails.taluk} Taluk
                    </div>
                 </div>
                 <button onClick={() => setSelectedFarmerDetails(null)} className="relative z-10 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all">
                    <X size={20} />
                 </button>
              </div>

              <div className="p-6 md:p-8 overflow-y-auto bg-slate-50 flex-1">
                 {/* Current Stats */}
                 <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                       <span className={`text-2xl font-black leading-none mb-1 ${selectedFarmerDetails.status === 'Red' ? 'text-red-500' : 'text-amber-500'}`}>{selectedFarmerDetails.score}</span>
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Distress Score</span>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                       <span className="text-xl font-black text-navy leading-none mb-1 mt-1">{selectedFarmerDetails.crop}</span>
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-t border-slate-100 pt-1 mt-1 w-full">Primary Crop</span>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                       <span className="text-xl font-black text-red-500 leading-none mb-1 mt-1">{selectedFarmerDetails.loanDaysOverdue}</span>
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-t border-slate-100 pt-1 mt-1 w-full">Days Overdue</span>
                    </div>
                 </div>

                 {/* Interaction History Log */}
                 <div>
                    <div className="flex items-center gap-3 mb-6">
                       <History size={18} className="text-teal-500" /> 
                       <h3 className="text-sm font-black text-navy uppercase tracking-widest">Intervention History</h3>
                    </div>
                    
                    <div className="space-y-4">
                       {caseHistory[selectedFarmerDetails.id]?.length > 0 ? (
                         caseHistory[selectedFarmerDetails.id].map((log, i) => (
                           <div key={i} className="flex gap-4">
                              <div className="flex flex-col items-center">
                                 <div className="w-8 h-8 rounded-full bg-teal-50 border-2 border-teal-500 flex items-center justify-center text-teal-600">
                                    <CheckCircle size={14} />
                                 </div>
                                 {i !== caseHistory[selectedFarmerDetails.id].length - 1 && <div className="w-0.5 h-full bg-teal-100 my-1"></div>}
                              </div>
                              <div className="pb-4">
                                 <div className="text-xs font-black text-navy uppercase tracking-widest mb-1">{log.action === 'resolve' ? 'Case Resolved' : 'Intervention Step'}</div>
                                 <div className="text-sm font-medium text-slate-600 mb-2">{log.note || 'No notes provided.'}</div>
                                 <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                                    <Clock size={10} /> {log.ts}
                                 </div>
                              </div>
                           </div>
                         ))
                       ) : (
                         <div className="text-center py-10 bg-white rounded-2xl border border-slate-100">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">No history recorded yet</span>
                         </div>
                       )}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}
