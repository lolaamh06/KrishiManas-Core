import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Volume2, Shield, Zap, LayoutDashboard, Briefcase, Activity, 
  MapPin, Clock, CheckCircle, FileText, Phone, MessageSquare, 
  Search, ChevronDown, ListTodo, History, TrendingUp, Filter, Users, Globe,
  BarChart3, X, Bell, Info, Home, User, AlertTriangle
} from 'lucide-react';
import EcosystemMap from '../components/EcosystemMap';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie, AreaChart, Area, LineChart, Line
} from 'recharts';
import { sendSMS, SMS_TEMPLATES } from '../utils/mockTwilio';
import { matchSchemes } from '../utils/matchSchemes';
import { useLang } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { db, fb, collection, onSnapshot, query, where, doc, updateDoc, arrayUnion, serverTimestamp, orderBy, limit } from '../utils/firebase';

const SECTOR_DATA = [
  { name: 'Hassan', value: 45, color: '#ef4444' },
  { name: 'Alur', value: 32, color: '#f59e0b' },
  { name: 'Belur', value: 28, color: '#10b981' },
  { name: 'Arsikere', value: 55, color: '#ef4444' },
  { name: 'Sakleshpur', value: 38, color: '#f59e0b' },
];

const INTERVENTION_DATA = [
  { name: 'Financial', value: 40, color: '#3b82f6' },
  { name: 'Technical', value: 25, color: '#14b8a6' },
  { name: 'Emergency', value: 15, color: '#ef4444' },
  { name: 'Guidance', value: 20, color: '#f59e0b' },
];

const TREND_DATA = [
  { day: 'Mon', speed: 22, load: 45 },
  { day: 'Tue', speed: 18, load: 52 },
  { day: 'Wed', speed: 25, load: 48 },
  { day: 'Thu', speed: 15, load: 60 },
  { day: 'Fri', speed: 12, load: 55 },
  { day: 'Sat', speed: 20, load: 42 },
  { day: 'Sun', speed: 14, load: 38 },
];

const DEFAULT_CHECKLIST = [
  { id: 'call', label: 'Initial Outreach Call', done: false, labelKn: 'ಆರಂಭಿಕ ಸಂಪರ್ಕ ಕರೆ' },
  { id: 'visit', label: 'Farm Visit & Verification', done: false, requiresNote: true, labelKn: 'ಫಾರ್ಮ್ ಭೇಟಿ ಮತ್ತು ಪರಿಶೀಲನೆ' },
  { id: 'docs', label: 'Document Fulfillment', done: false, labelKn: 'ದಾಖಲೆ ಪೂರೈಕೆ' },
  { id: 'resolve', label: 'Final Resolution Note', done: false, requiresNote: true, labelKn: 'ಅಂತಿಮ ನಿರ್ಣಯ ಟಿಪ್ಪಣಿ' }
];

export default function MitraPortal() {
  const navigate = useNavigate();
  const { lang, t } = useLang();
  const { currentUser, logout } = useAuth();
  
  const [myCases, setMyCases] = useState([]);
  const [openMarket, setOpenMarket] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('active'); // active, market, insights
  const [noteInput, setNoteInput] = useState({});
  const [sosSignal, setSosSignal] = useState(null);
  const [selectedFarmer, setSelectedFarmer] = useState(null);

  // Audit Fix: Re-injecting Firestore Listeners
  useEffect(() => {
    if (!currentUser?.uid) return;

    // 1. Listen for "My Assigned Cases"
    const qMy = query(collection(db, 'users'), where('assignedMitraId', '==', currentUser.uid));
    const unsubMy = onSnapshot(qMy, (snap) => {
      const list = [];
      snap.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
      setMyCases(list);
    }, (err) => console.error("My Assigned Cases Index Error:", err));

    // 2. Listen for "Open Market" (New Registrations)
    const qOpen = query(collection(db, 'users'), where('roles', 'array-contains', 'farmer'), where('assignedMitraId', '==', null));
    const unsubOpen = onSnapshot(qOpen, (snap) => {
      const list = [];
      snap.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
      setOpenMarket(list);
    }, (err) => console.error("Open Market Index Error:", err));

    // 3. Listen for SOS Signals
    const qSos = query(
      collection(db, 'alerts'), 
      where('type', '==', 'SOS'), 
      where('isClaimed', '==', false),
      orderBy('timestamp', 'desc'), 
      limit(1)
    );
    const unsubSos = onSnapshot(qSos, (snap) => {
      if (!snap.empty) {
        const lastSos = snap.docs[0].data();
        // Audit Fix: Proper timestamp convergence for real-time overlay
        const ts = lastSos.timestamp?.toMillis?.() || lastSos.timestamp || Date.now();
        if (Date.now() - ts < 60000) { // Only show if recent (60s)
          setSosSignal({ ...lastSos, id: snap.docs[0].id });
        }
      } else {
        setSosSignal(null);
      }
    }, (err) => {
      console.warn("SOS Feed Index Required. Silent fallback active.", err);
    });

    return () => {
      unsubMy();
      unsubOpen();
      unsubSos();
    };
  }, [currentUser]);

  const handleClaimCase = async (farmerId) => {
    try {
      const farmerRef = doc(db, 'users', farmerId);
      await updateDoc(farmerRef, {
        assignedMitraId: currentUser.uid,
        assignedMitraName: currentUser.name || 'Mitra',
        status: 'Monitoring'
      });
      fb.logActivity('CLAIM', `${currentUser.name} claimed Case #${farmerId.substring(0,5)}`);
      setActiveTab('active');
    } catch (e) {
      console.error("Claim error", e);
    }
  };

  const handleUpdateChecklist = async (farmerId, stepId, note = '') => {
    try {
      const farmerRef = doc(db, 'users', farmerId);
      const farmer = myCases.find(f => f.id === farmerId);
      if (!farmer) return;

      const currentChecklist = farmer.checklist && farmer.checklist.length > 0 ? farmer.checklist : DEFAULT_CHECKLIST;
      const newChecklist = currentChecklist.map(step => 
        step.id === stepId ? { ...step, done: true, note, timestamp: Date.now() } : step
      );

      const historyUpdate = {
        action: stepId,
        note,
        timestamp: Date.now(),
        by: currentUser.name
      };

      const updateData = {
        checklist: newChecklist,
        caseHistory: arrayUnion(historyUpdate)
      };

      if (stepId === 'resolve') {
        updateData.resolutionStatus = 'Resolved';
        updateData.resolvedAt = Date.now();
        fb.logActivity('RESOLVE', `${currentUser.name} resolved Case #${farmerId.substring(0,5)}`);
      }

      await updateDoc(farmerRef, updateData);
    } catch (e) {
      console.error("Update error", e);
    }
  };

  const handleSendAlert = async (farmerId, name) => {
    try {
      await fb.logActivity('ALERT', `Mitra ${currentUser.name} sent a priority alert to ${name}.`, {
        targetId: farmerId,
        type: 'PRIORITY_ALERT',
        sentBy: currentUser.uid,
        mitraName: currentUser.name,
        mitraPhone: currentUser.phone || '+91-HQ-SUPPORT',
        msg: `Priority protocol initiated for ${name}. Your assigned Mitra (${currentUser.name}) is standing by for assistance.`
      });
      alert('Alert sent to Farmer & Admin HQ');
    } catch (e) {
       console.error(e);
    }
  };

  const handleReportEscalation = async (farmerId, name) => {
    try {
      await fb.logActivity('ESCALATION', `CRITICAL: Mitra ${currentUser.name} escalated Case for ${name} to HQ!`, {
        targetId: farmerId,
        priority: 'CRITICAL',
        sentBy: currentUser.uid
      });
      alert('CRITICAL: Escalation reported to Command Center');
    } catch (e) {
       console.error(e);
    }
  };

  const handleInterceptSOS = async () => {
    if (!sosSignal) return;
    try {
      // 1. Mark alert as claimed
      const alertRef = doc(db, 'alerts', sosSignal.id);
      await updateDoc(alertRef, {
        isClaimed: true,
        claimedBy: currentUser.uid,
        claimedByName: currentUser.name
      });

      // 2. Assign case if not already owned
      await handleClaimCase(sosSignal.farmerId);

      // 3. Log the intervention
      await fb.logActivity('INTERCEPT_SOS', `${currentUser.name} intercepted emergency signal from ${sosSignal.farmerName}`);
      
      setSosSignal(null);
    } catch (e) {
      console.error("Intercept Error", e);
    }
  };

  const isResolved = (c) => c.resolutionStatus === 'Resolved';
  const activeAssigned = myCases.filter(c => !isResolved(c));
  const resolvedCases = myCases.filter(c => isResolved(c));

  const getZone = (score) => score >= 65 ? 'red' : (score >= 35 ? 'yellow' : 'green');
  const isRecentSOS = (c) => c.lastSos && (Date.now() - c.lastSos < 24 * 60 * 60 * 1000);

  const urgentUnassigned = openMarket.filter(c => isRecentSOS(c));

  const safeFilter = (list) => list.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.taluk?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Active priority = Assigned Red + Unassigned SOS + Assigned SOS
  const activePriorityCases = safeFilter([
    ...activeAssigned.filter(c => getZone(c.score || 50) === 'red' || isRecentSOS(c)),
    ...urgentUnassigned
  ]);
  
  // Upcoming Risks = Assigned Yellow/Green (meaning they are owned but not critical yet)
  const upcomingRiskCases = safeFilter(
    activeAssigned.filter(c => getZone(c.score || 50) !== 'red' && !isRecentSOS(c))
  );

  // Open Market = Unassigned Non-SOS (new registrations or stable cases waiting for a Mitra)
  const marketCases = safeFilter(
    openMarket.filter(c => !isRecentSOS(c))
  );

  const renderCaseCard = (c) => (
                      <div key={c.id} className={`bg-white rounded-[2.5rem] border transition-all duration-500 overflow-hidden ${expanded === c.id ? 'border-teal-500/30 ring-8 ring-teal-500/5' : 'border-slate-100 hover:border-slate-300'}`}>
                         <div 
                           onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                           className="p-8 flex items-center justify-between cursor-pointer group"
                         >
                            <div className="flex items-center gap-8">
                               <div className={`w-20 h-20 rounded-[1.5rem] flex flex-col items-center justify-center font-black text-2xl relative shadow-xl ${c.score >= 65 ? 'bg-red-500 text-white shadow-red-500/20' : 'bg-[#020617] text-white'}`}>
                                  {c.score || 50}
                                  <span className="text-[9px] uppercase tracking-tighter opacity-50 mt-[-2px]">pts</span>
                                  {c.score >= 65 && <div className="absolute -top-2 -right-2 w-5 h-5 bg-white text-red-500 rounded-full flex items-center justify-center animate-bounce shadow-lg"><AlertTriangle size={12} /></div>}
                               </div>
                               <div>
                                  <h3 className="text-3xl font-black text-[#020617] tracking-tighter mb-1">{c.name}</h3>
                                  <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                     <MapPin size={12} className="text-teal-500" /> {c.taluk} Sector · <span className={c.score >= 65 ? 'text-red-500' : 'text-teal-600'}>{c.score >= 65 ? 'Critical Warning' : 'Observation Mode'}</span>
                                  </div>
                               </div>
                            </div>
                            <div className="flex items-center gap-12">
                               <div className="hidden xl:flex flex-col items-end">
                                  <div className="flex gap-1.5 mb-2">
                                     {(c.checklist || []).map((step, i) => (
                                       <div key={i} className={`w-3 h-3 rounded-full ${step.done ? 'bg-teal-500' : 'bg-slate-100'}`} />
                                     ))}
                                  </div>
                                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Protocol Progress</span>
                               </div>
                               <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-slate-50 text-slate-300 group-hover:bg-teal-50 group-hover:text-teal-600 transition-all ${expanded === c.id ? 'rotate-180 bg-teal-500 text-white !group-hover:bg-teal-500' : ''}`}>
                                  <ChevronDown size={24} strokeWidth={3} />
                               </div>
                            </div>
                         </div>

                         {expanded === c.id && (
                           <div className="p-10 border-t border-slate-50 bg-[#fafcfd]/50 animate-in slide-in-from-top-4 duration-500">
                              <div className="grid lg:grid-cols-12 gap-12">
                                 
                                 {/* Intervention Panel */}
                                 <div className="lg:col-span-12 xl:col-span-8 space-y-8">
                                    <div className="flex items-center justify-between border-b border-slate-200 pb-6">
                                       <div className="flex items-center gap-4">
                                          <div className="p-3 bg-teal-500 text-[#020617] rounded-2xl"><ListTodo size={20} /></div>
                                          <div>
                                             <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Deployment Roadmap</div>
                                             <div className="font-black text-[#020617] uppercase tracking-tighter">Standard Crisis Response Protocol</div>
                                          </div>
                                       </div>
                                       <button onClick={() => setSelectedFarmer(c)} className="px-6 py-2.5 bg-slate-50 hover:bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">View Full Analytics</button>
                                    </div>
                                    
                                    {c.assignedMitraId !== currentUser.uid ? (
                                       <div className="py-12 flex flex-col items-center justify-center text-center bg-white border border-slate-100 rounded-3xl shadow-sm">
                                          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                                             <AlertTriangle size={32} />
                                          </div>
                                          <h4 className="text-xl font-black text-[#020617] tracking-tighter mb-2">Unassigned Urgent Case</h4>
                                          <p className="text-sm font-bold text-slate-400 mb-8 max-w-sm">This entity has been flagged by the system and needs immediate attention. Take ownership to begin protocols.</p>
                                          <button 
                                             onClick={() => handleClaimCase(c.id)}
                                             className="px-10 py-4 bg-[#020617] text-white rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-gray-900/10"
                                          >
                                             Take Ownership Now
                                          </button>
                                       </div>
                                    ) : (
                                       <div className="grid md:grid-cols-2 gap-6">
                                          {(c.checklist && c.checklist.length > 0 ? c.checklist : DEFAULT_CHECKLIST).map(step => (
                                            <div key={step.id} className={`p-6 rounded-3xl border transition-all relative group ${step.done ? 'bg-slate-100/50 border-slate-200 opacity-60' : 'bg-white border-slate-100 shadow-sm hover:border-teal-500/40 hover:shadow-xl hover:shadow-teal-900/5'}`}>
                                               <div className="flex gap-4">
                                                  <button 
                                                    onClick={() => !step.done && !step.requiresNote && handleUpdateChecklist(c.id, step.id)}
                                                    className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all flex-shrink-0 ${step.done ? 'bg-teal-500 border-teal-500 text-white shadow-lg shadow-teal-500/20' : 'border-slate-200 hover:border-teal-500'}`}
                                                  >
                                                     {step.done ? <CheckCircle size={18} /> : (step.requiresNote ? <FileText size={16} /> : null)}
                                                  </button>
                                                  <div className="flex-1">
                                                     <div className={`font-black uppercase text-[13px] tracking-tight ${step.done ? 'text-slate-500 line-through' : 'text-[#020617]'}`}>
                                                        {lang === 'kn' ? (step.labelKn || step.label) : step.label}
                                                     </div>
                                                     {!step.done && step.requiresNote ? (
                                                        <div className="mt-4 space-y-2">
                                                           <textarea 
                                                             rows="2"
                                                             placeholder="Mandatory field note required..."
                                                             className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-bold focus:ring-2 focus:ring-teal-500/10 focus:outline-none"
                                                             value={noteInput[`${c.id}_${step.id}`] || ''}
                                                             onChange={(e) => setNoteInput({...noteInput, [`${c.id}_${step.id}`]: e.target.value})}
                                                           />
                                                           <button 
                                                             onClick={() => handleUpdateChecklist(c.id, step.id, noteInput[`${c.id}_${step.id}`])}
                                                             className="w-full py-2.5 bg-teal-500 text-[#020617] rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-teal-500/10 hover:bg-teal-400"
                                                           >
                                                              Validate & Record
                                                           </button>
                                                        </div>
                                                     ) : (
                                                       step.note && <div className="mt-2 text-[10px] font-bold text-slate-400 italic bg-white px-3 py-1.5 rounded-lg border border-slate-100">"{step.note}"</div>
                                                     )}
                                                  </div>
                                               </div>
                                            </div>
                                          ))}
                                       </div>
                                    )}

                                    {/* ─── CASE HISTORY TIMELINE ─── */}
                                    <div className="pt-8 border-t border-slate-100">
                                       <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                                          <History size={16} className="text-teal-500" /> Operational History Log
                                       </div>
                                       <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                                          {(c.caseHistory || []).length === 0 ? (
                                            <p className="text-[10px] italic text-slate-400 font-bold uppercase tracking-widest ml-4">No historical records found for this entity.</p>
                                          ) : c.caseHistory.map((log, i) => (
                                            <div key={i} className="relative group">
                                               <div className="absolute -left-[27px] top-1 w-4 h-4 rounded-full bg-white border-2 border-slate-200 group-hover:border-teal-500 transition-colors z-10" />
                                               <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                                                  <div className="flex justify-between items-start mb-2">
                                                     <div className="text-[10px] font-black text-teal-600 uppercase tracking-widest bg-teal-50 px-2 py-0.5 rounded">{log.action || 'INTERVENTION'}</div>
                                                     <div className="text-[9px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-widest"><Clock size={10} /> {new Date(log.timestamp).toLocaleTimeString()}</div>
                                                  </div>
                                                  <p className="text-xs font-bold text-[#020617] leading-relaxed italic opacity-80">"{log.note || 'No description provided'}"</p>
                                                  <div className="mt-3 text-[9px] font-black text-slate-300 uppercase tracking-tighter">Verified by // {log.by}</div>
                                               </div>
                                            </div>
                                          ))}
                                       </div>
                                    </div>
                                 </div>

                                 {/* AI & Comms Panel */}
                                 <div className="lg:col-span-12 xl:col-span-4 space-y-8">
                                    <div className="bg-[#020617] rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col items-center text-center">
                                       <div className="absolute top-0 right-0 p-8 text-teal-500 opacity-5 rotate-45 scale-150"><Activity size={200} /></div>
                                       <div className="text-[10px] font-black text-teal-400 uppercase tracking-[0.3em] mb-10">Regional Intelligence</div>
                                       <div className="relative w-40 h-40 flex items-center justify-center mb-10">
                                          <svg className="w-full h-full transform -rotate-90">
                                             <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                                             <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={440} strokeDashoffset={440 - (440 * (c.score || 50)) / 100} className={`transition-all duration-1000 ${c.score >= 65 ? 'text-red-500 shadow-[0_0_15px_#ef4444]' : 'text-teal-500'}`} style={{ strokeLinecap: 'round' }} />
                                          </svg>
                                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                                             <span className="text-4xl font-black text-white">{c.score || 50}</span>
                                             <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-[-2px]">Score Index</span>
                                          </div>
                                       </div>
                                       <div className="space-y-4 w-full">
                                          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-left">
                                             <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Exposure Context</div>
                                             <div className="text-xs font-bold text-slate-300">{c.loanDaysOverdue || 0} Days Overdue · {c.crop || 'Sector'} Cultivation</div>
                                          </div>
                                          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-left">
                                             <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Assigned Mitra</div>
                                             <div className="text-xs font-bold text-teal-400">{c.assignedMitraName || 'Awaiting Ground Officer'}</div>
                                          </div>
                                       </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="grid grid-cols-2 gap-4">
                                       <a href={`tel:${c.phone || '+91'}`} className="p-6 bg-teal-500 text-[#020617] rounded-[2rem] flex flex-col items-center justify-center gap-2 hover:scale-[1.05] transition-all shadow-xl shadow-teal-500/10">
                                          <Phone size={24} fill="currentColor" />
                                          <span className="text-[10px] font-black uppercase tracking-widest">Call Now</span>
                                       </a>
                                       <button 
                                          onClick={() => handleSendAlert(c.id, c.name)}
                                          className="p-6 bg-white border border-slate-200 text-[#020617] rounded-[2rem] flex flex-col items-center justify-center gap-2 hover:scale-[1.05] transition-all shadow-sm active:bg-slate-50"
                                        >
                                           <MessageSquare size={24} fill="currentColor" className="text-teal-500" />
                                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Send Alert</span>
                                        </button>
                                     </div>
                                     <button 
                                       onClick={() => handleReportEscalation(c.id, c.name)}
                                       className="w-full py-5 bg-red-600 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-red-900/20 hover:bg-red-500 transition-all active:scale-95"
                                     >
                                       Report Escalation to HQ
                                     </button>
                                 </div>
                              </div>
                           </div>
                         )}
                      </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex h-screen overflow-hidden font-sans selection:bg-teal-500/10">
      
      {/* ─── Sidebar ─── */}
      <aside className="w-72 bg-[#020617] text-white flex flex-col z-[1000] border-r border-white/5">
        <div className="p-8">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 font-black text-2xl tracking-tighter text-teal-400 hover:scale-105 transition-all">
            <Zap size={26} fill="currentColor" /> KrishiManas
          </button>
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-2 opacity-60">Field Force v2.0</div>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          <button 
            onClick={() => setActiveTab('active')} 
            className={`w-full flex items-center justify-between px-6 py-4 rounded-[1.5rem] transition-all font-black text-[11px] uppercase tracking-[0.15em] ${activeTab === 'active' ? 'bg-teal-500 text-[#020617] shadow-xl shadow-teal-500/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <div className="flex items-center gap-3"><LayoutDashboard size={18} /> {t('activeCaseQueue')}</div>
            {activePriorityCases.length > 0 && <span className="bg-red-500/20 text-red-500 border border-red-500/50 text-[9px] px-2 py-0.5 rounded-full">{activePriorityCases.length}</span>}
          </button>
          <button 
            onClick={() => setActiveTab('market')} 
            className={`w-full flex items-center justify-between px-6 py-4 rounded-[1.5rem] transition-all font-black text-[11px] uppercase tracking-[0.15em] ${activeTab === 'market' ? 'bg-teal-500 text-[#020617] shadow-xl shadow-teal-500/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <div className="flex items-center gap-3"><Globe size={18} /> Market & History</div>
            {marketCases.length > 0 && <span className="bg-teal-900 border border-teal-400 text-teal-400 text-[9px] px-2 py-0.5 rounded-full">{marketCases.length}</span>}
          </button>
          <button 
            onClick={() => setActiveTab('insights')} 
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-[1.5rem] transition-all font-black text-[11px] uppercase tracking-[0.15em] ${activeTab === 'insights' ? 'bg-teal-500 text-[#020617] shadow-xl shadow-teal-500/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <TrendingUp size={18} /> Regional Insights
          </button>
        </nav>

        <div className="p-6 mt-auto">
          {/* High-Visibility SOS UI moved to Main Content Overlay for "Big Notification" effect */}
          <div className="bg-white/[0.03] rounded-[2rem] p-6 border border-white/5">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-400 text-[#020617] flex items-center justify-center font-black text-lg">
                   {currentUser?.name?.substring(0,1).toUpperCase() || 'M'}
                </div>
                <div className="flex-1">
                   <div className="text-xs font-black text-white truncate">{currentUser?.name || 'Mitra Volunteer'}</div>
                   <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Sector HQ</div>
                </div>
                <button onClick={() => { logout('mitra'); navigate('/'); }} className="p-2 text-slate-500 hover:text-red-500 transition-colors">
                   <X size={18} />
                </button>
             </div>
          </div>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-24 border-b border-slate-200 bg-white/80 backdrop-blur-md px-10 flex items-center justify-between shrink-0">
           <div>
              <h1 className="text-3xl font-black text-[#020617] tracking-tighter">
                {activeTab === 'active' ? t('activeCaseQueue') : (activeTab === 'market' ? 'Tactical Open Market' : 'Regional Load-Bearing Analysis')}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                 <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hassan Sector Monitoring // Live</span>
              </div>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="bg-slate-50 px-4 py-2 rounded-xl flex flex-col items-center border border-slate-100 min-w-[80px]">
                 <span className="text-lg font-black text-[#020617] tabular-nums">{activePriorityCases.length + upcomingRiskCases.length}</span>
                 <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Active Ops</span>
              </div>
              <div className="bg-teal-50 px-4 py-2 rounded-xl flex flex-col items-center border border-teal-100 min-w-[80px]">
                 <span className="text-lg font-black text-teal-600 tabular-nums">{resolvedCases.length}</span>
                 <span className="text-[8px] font-black text-teal-600 uppercase tracking-widest">Resolved</span>
              </div>
           </div>
        </header>

        {/* SOS OVERLAY - Big Notification */}
        {sosSignal && (
          <div className="absolute inset-x-10 top-10 z-[1500] animate-in slide-in-from-top-full duration-500">
             <div className="bg-red-600 p-8 rounded-[2.5rem] border-4 border-white shadow-[0_20px_60px_rgba(239,68,68,0.4)] flex items-center justify-between text-white overflow-hidden relative group">
                <div className="absolute -right-10 -bottom-10 opacity-10 rotate-12 group-hover:scale-110 transition-transform">
                   <AlertTriangle size={160} />
                </div>
                <div className="flex items-center gap-6 relative z-10">
                   <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-red-600 animate-pulse">
                      <Zap size={32} />
                   </div>
                   <div>
                      <div className="text-[11px] font-black uppercase tracking-[0.3em] opacity-80 mb-1">Incoming SOS Signal</div>
                      <div className="text-2xl font-black tracking-tighter">{sosSignal.message || 'Farmer Distress Alert Detected'}</div>
                   </div>
                </div>
                 <div className="flex gap-4 relative z-10">
                    <button 
                      onClick={() => {
                        handleInterceptSOS();
                        setActiveTab('active');
                        if (sosSignal.farmerName) setSearchTerm(sosSignal.farmerName);
                        setTimeout(() => setSearchTerm(''), 10000); 
                      }}
                      className="px-8 py-3 bg-white text-red-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
                    >
                       Intercept Case
                    </button>
                    <button onClick={() => setSosSignal(null)} className="p-3 bg-red-700/50 rounded-2xl hover:bg-red-700 transition-all">
                       <X size={20} />
                    </button>
                 </div>
             </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          
          {/* ─── ACTIVE QUEUE ─── */}
          {activeTab === 'active' && (
            <div className="space-y-6 animate-in fade-in duration-500">
               <div className="bg-white rounded-[2.5rem] p-2 border border-slate-100 shadow-sm overflow-hidden mb-10 h-[400px]">
                  <EcosystemMap 
                    farmers={myCases} 
                    mitras={[{ ...currentUser, lat: 13.0, lng: 76.1 }]} 
                    selectedId={expanded} 
                    onSelect={(f) => setExpanded(f.id)} 
                    height="400px" 
                  />
               </div>

               <div className="relative group">
                  <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-teal-500 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Filter active deployments (Name, Taluk, UID)..." 
                    className="w-full pl-16 pr-8 py-5 bg-white border border-slate-200 rounded-[2rem] text-sm font-bold shadow-sm focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500/40 transition-all outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>

               {activePriorityCases.length === 0 && upcomingRiskCases.length === 0 ? (
                 <div className="h-64 flex flex-col items-center justify-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-slate-300 mb-4 shadow-sm">
                       <LayoutDashboard size={32} />
                    </div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No active cases assigned</p>
                    <button onClick={() => setActiveTab('market')} className="mt-4 text-teal-600 font-black text-[10px] uppercase underline tracking-widest hover:text-teal-700">Explore Open Market</button>
                 </div>
               ) : (
                 <div className="space-y-12">
                    {/* Priority Queue */}
                    {activePriorityCases.length > 0 && (
                       <div className="space-y-6">
                          <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Priority & Assigned Operations
                          </div>
                          <div className="grid gap-6">
                             {activePriorityCases.map(renderCaseCard)}
                          </div>
                       </div>
                    )}

                    {/* Upcoming Risks Queue */}
                    {upcomingRiskCases.length > 0 && (
                       <div className="space-y-6">
                          <div className="text-[11px] font-black text-yellow-500 uppercase tracking-widest flex items-center gap-2 pt-6 border-t border-slate-200">
                             <div className="w-2 h-2 rounded-full bg-yellow-400" /> Upcoming Risks (Observation)
                          </div>
                          <div className="grid gap-6">
                             {upcomingRiskCases.map(renderCaseCard)}
                          </div>
                       </div>
                    )}
                 </div>
               )}
            </div>
          )}

          {/* ─── OPEN MARKET ─── */}
          {activeTab === 'market' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
               <div className="bg-teal-500/[0.03] border-2 border-dashed border-teal-500/20 rounded-[3rem] p-12 text-center">
                  <h2 className="text-4xl font-black text-[#020617] tracking-tighter mb-4">Tactical Open Market Hub</h2>
                  <p className="max-w-xl mx-auto text-slate-500 font-bold text-sm leading-relaxed mb-10 italic">
                     These farmers recently registered or updated their scores and are awaiting an assigned Mitra. Claim a case to initiate your first ground assessment.
                  </p>
                  
                  {marketCases.length === 0 ? (
                    <div className="bg-white p-12 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center gap-4">
                       <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                          <Search size={40} />
                       </div>
                       <p className="text-xs font-black text-slate-300 uppercase tracking-widest">Scanning for available nodes...</p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                       {marketCases.map(f => (
                         <div key={f.id} className="bg-white rounded-[2.5rem] p-8 border border-white hover:border-teal-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-teal-900/5 text-left group">
                            <div className="flex justify-between items-start mb-8">
                               <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-black text-xl shadow-lg ${f.score >= 65 ? 'bg-red-500 text-white shadow-red-500/20' : 'bg-slate-100 text-slate-400'}`}>
                                  {f.score || 50}
                                  <span className="text-[8px] uppercase tracking-tighter opacity-70 mt-[-2px]">pts</span>
                               </div>
                               <div className="bg-teal-50 text-teal-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">New Entity</div>
                            </div>
                            <h3 className="text-2xl font-black text-[#020617] tracking-tighter mb-2 group-hover:text-teal-600 transition-colors">{f.name}</h3>
                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">
                               <MapPin size={10} /> {f.taluk} Sector · {f.crop || 'Paddy'}
                            </div>
                            <button 
                               onClick={() => handleClaimCase(f.id)}
                               className="w-full py-4 bg-[#020617] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-teal-500 hover:text-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-gray-900/10"
                            >
                               Take Ownership
                            </button>
                         </div>
                       ))}
                    </div>
                  )}
               </div>

               {/* ─── HISTORICAL IMPACT ─── */}
               <div className="mt-16 border-t border-slate-200 pt-16">
                  <div className="flex items-center justify-between mb-10">
                     <div>
                        <h2 className="text-3xl font-black text-[#020617] tracking-tighter flex items-center gap-3">
                           <CheckCircle className="text-teal-500" size={28} /> My Resolved History
                        </h2>
                        <p className="text-slate-500 font-bold text-sm mt-2">Entities successfully monitored and resolved through standard protocols.</p>
                     </div>
                     <div className="bg-teal-50 px-6 py-3 rounded-2xl border border-teal-100 flex flex-col items-center">
                        <span className="text-2xl font-black text-teal-600 tabular-nums">{resolvedCases.length}</span>
                        <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest">Total Resolved</span>
                     </div>
                  </div>

                  {resolvedCases.length === 0 ? (
                    <div className="bg-white p-12 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                       <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                          <History size={32} />
                       </div>
                       <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No historical resolutions yet.</p>
                       <p className="text-[10px] font-bold text-slate-400 mt-2 max-w-sm">Complete all steps in an active entity's operation protocol to mark them as resolved.</p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                       {resolvedCases.map(c => (
                         <div key={c.id} className="bg-white rounded-[2rem] p-6 border border-slate-100 flex items-center gap-6 opacity-80 hover:opacity-100 transition-opacity">
                            <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center font-black text-xl">
                               <CheckCircle size={24} />
                            </div>
                            <div className="flex-1">
                               <h3 className="text-lg font-black text-[#020617] tracking-tighter line-through decoration-slate-300">{c.name}</h3>
                               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                  Resolved on {c.resolvedAt ? new Date(c.resolvedAt).toLocaleDateString() : 'Unknown'}
                               </div>
                            </div>
                            <button onClick={() => setSelectedFarmer(c)} className="p-3 bg-slate-50 text-slate-400 hover:text-teal-600 rounded-xl transition-colors">
                               <MapPin size={18} />
                            </button>
                         </div>
                       ))}
                    </div>
                  )}
               </div>

            </div>
          )}

          {/* ─── INSIGHTS ─── */}
          {activeTab === 'insights' && (
            <div className="space-y-12 animate-in fade-in duration-500">
               <div className="grid lg:grid-cols-2 gap-10">
                  <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm flex flex-col min-h-[450px]">
                     <div className="flex items-center gap-3 mb-10">
                        <BarChart3 size={20} className="text-teal-500" />
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Sector Risk Distribution</span>
                     </div>
                     <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={SECTOR_DATA}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                              <XAxis dataKey="name" fontSize={10} fontStyle="bold" axisLine={false} tickLine={false} />
                              <YAxis axisLine={false} tickLine={false} fontSize={10} />
                              <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                              <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={50}>
                                 {SECTOR_DATA.map((entry, index) => (
                                   <Cell key={`cell-${index}`} fill={entry.color} />
                                 ))}
                               </Bar>
                            </BarChart>
                         </ResponsiveContainer>
                      </div>
                   </div>

                   <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm flex flex-col min-h-[450px]">
                      <div className="flex items-center gap-3 mb-10">
                         <TrendingUp size={20} className="text-teal-500" />
                         <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Intervention Priority Matrix</span>
                      </div>
                      <div className="flex-1 flex items-center justify-center relative">
                         <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                               <Pie data={INTERVENTION_DATA} innerRadius={90} outerRadius={130} paddingAngle={8} dataKey="value">
                                  {INTERVENTION_DATA.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                               </Pie>
                               <Tooltip />
                            </PieChart>
                         </ResponsiveContainer>
                         <div className="absolute flex flex-col items-center">
                            <span className="text-4xl font-black text-[#020617]">72%</span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resolution Yield</span>
                         </div>
                      </div>
                   </div>
                 </div>

                 <div className="grid lg:grid-cols-2 gap-10">
                    <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm flex flex-col min-h-[350px]">
                       <div className="flex items-center gap-3 mb-8">
                          <Clock size={20} className="text-blue-500" />
                          <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Response Performance Trend</span>
                       </div>
                       <div className="flex-1">
                          <ResponsiveContainer width="100%" height="100%">
                             <AreaChart data={TREND_DATA}>
                                <defs>
                                   <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                   </linearGradient>
                                </defs>
                                <Area type="monotone" dataKey="speed" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSpeed)" />
                             </AreaChart>
                          </ResponsiveContainer>
                       </div>
                    </div>

                    <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm flex flex-col min-h-[350px]">
                       <div className="flex items-center gap-3 mb-8">
                          <Activity size={20} className="text-emerald-500" />
                          <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Operational Load Stress</span>
                       </div>
                       <div className="flex-1">
                          <ResponsiveContainer width="100%" height="100%">
                             <LineChart data={TREND_DATA}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="day" fontSize={10} axisLine={false} tickLine={false} />
                                <Line type="monotone" dataKey="load" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} />
                             </LineChart>
                          </ResponsiveContainer>
                       </div>
                    </div>
                 </div>
            </div>
          )}

        </div>
      </main>

      {/* ─── ANALYTICS MODAL ─── */}
      {selectedFarmer && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-12 bg-[#020617]/95 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-5xl rounded-[4rem] shadow-2xl overflow-hidden flex flex-col md:flex-row relative">
              <button 
                onClick={() => setSelectedFarmer(null)}
                className="absolute top-10 right-10 p-2 bg-slate-50 text-slate-400 hover:text-red-500 rounded-full transition-all z-10"
              >
                <X size={24} />
              </button>

              <div className="md:w-1/2 p-16 bg-slate-50 relative overflow-hidden flex flex-col justify-between">
                 <div className="absolute top-0 left-0 p-16 text-teal-500 opacity-[0.05] -rotate-12 scale-150"><Activity size={300} /></div>
                 <div className="relative z-10">
                    <div className="inline-block px-4 py-1.5 bg-teal-500 text-black text-[10px] font-black uppercase tracking-widest rounded-full mb-10 shadow-xl shadow-teal-500/20">System Intelligence Hub</div>
                    <h2 className="text-6xl font-black text-[#020617] tracking-tighter leading-[0.9] mb-4">{selectedFarmer.name}</h2>
                    <p className="text-slate-400 font-bold text-xl uppercase tracking-tighter opacity-80">{selectedFarmer.taluk} Sector // Entity-{selectedFarmer.id.substring(0,5)}</p>
                 </div>
                 <div className="relative z-10 pt-16">
                    <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-4">Historical Exposure Analysis</div>
                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-1">
                          <div className="text-4xl font-black text-[#020617] tabular-nums">{selectedFarmer.score || 50}</div>
                          <div className="text-[10px] font-black text-teal-600 uppercase tracking-widest">Distress Score</div>
                       </div>
                       <div className="space-y-1">
                          <div className="text-4xl font-black text-[#020617] tabular-nums">{selectedFarmer.loanDaysOverdue || 0}d</div>
                          <div className="text-[10px] font-black text-teal-600 uppercase tracking-widest">Debt Overdue</div>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="md:w-1/2 p-16 space-y-10 flex flex-col overflow-y-auto custom-scrollbar bg-white">
                     <div className="space-y-4">
                        <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Resource Telemetry Profile</div>
                        <div className="h-40 bg-slate-50 border border-slate-100 rounded-3xl p-4">
                           <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={[
                                { s: 40, w: 20 }, { s: 60, w: 45 }, { s: 30, w: 70 }, { s: 80, w: 50 }, { s: 50, w: 90 }
                              ]}>
                                 <Line type="monotone" dataKey="s" stroke="#3b82f6" strokeWidth={2} dot={false} />
                                 <Line type="monotone" dataKey="w" stroke="#10b981" strokeWidth={2} dot={false} />
                              </LineChart>
                           </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl">
                              <div className="text-[8px] font-black text-slate-400 uppercase mb-1">Water Table Level</div>
                              <div className="text-xl font-black text-[#020617]">{selectedFarmer.waterLevel || '4.2m'} <span className="text-[10px] text-slate-400">Normal</span></div>
                           </div>
                           <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl">
                              <div className="text-[8px] font-black text-slate-400 uppercase mb-1">Response Success</div>
                              <div className="text-xl font-black text-[#020617]">94% <span className="text-[10px] text-slate-400">High</span></div>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-4 pt-4">
                        <div className="text-[10px] font-black text-teal-500 uppercase tracking-[0.3em]">Intervention History Timeline</div>
                        <div className="space-y-6 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                           {(selectedFarmer.caseHistory || []).slice(-3).reverse().map((log, i) => (
                             <div key={i} className="relative">
                                <div className="absolute -left-[22px] top-1 w-3 h-3 bg-white border-2 border-slate-200 rounded-full" />
                                <div className="text-[11px] font-black text-[#020617] mb-1">{log.action || 'Checklist Updated'}</div>
                                <div className="text-[10px] font-bold text-slate-400 leading-snug italic">"{log.note || 'No description'}"</div>
                             </div>
                           ))}
                        </div>
                     </div>
                  <button 
                    onClick={() => setSelectedFarmer(null)}
                    className="w-full py-5 bg-[#020617] text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-gray-900/40 hover:scale-[1.02] transition-all shrink-0"
                  >
                     Close Intel Overview
                  </button>
               </div>
           </div>
        </div>
      )}

    </div>
  );
}


