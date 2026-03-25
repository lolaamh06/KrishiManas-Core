import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../contexts/LanguageContext';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { useAuth } from '../contexts/AuthContext';
import { db, fb, doc, onSnapshot, updateDoc, serverTimestamp, collection, addDoc, query, where, orderBy, limit } from '../utils/firebase';
import { 
  Volume2, AlertTriangle, CheckCircle, CloudRain, MapPin, Upload, User, 
  TrendingUp, TrendingDown, Minus, Home, FileText, PhoneCall, Loader2, X, Activity, Zap, Bell
} from 'lucide-react';
import { getMockWeather } from '../utils/mockWeather';
import { matchSchemes } from '../utils/matchSchemes'; 

const INTERVENTION_ITEMS = [
  {
    icon: '✅',
    en: 'Government schemes identified and matched',
    kn: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು ಗುರುತಿಸಲಾಗಿದೆ'
  },
  {
    icon: '✅',
    en: 'Krishi Mitra Suresh Naik notified',
    kn: 'ಕೃಷಿ ಮಿತ್ರ ಸುರೇಶ್ ನಾಯಕ್ ಅವರಿಗೆ ತಿಳಿಸಲಾಗಿದೆ'
  },
  {
    icon: '✅',
    en: 'AIR Hassan advisory scheduled for Alur taluk',
    kn: 'ಆಕಾಶವಾಣಿ ಹಾಸನ ಸಲಹೆ ಅಲೂರು ತಾಲ್ಲೂಕಿಗೆ ನಿಗದಿಯಾಗಿದೆ'
  }
];

const InterventionBanner = ({ score }) => {
  const [show, setShow] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (score < 65) {
      setShow(false);
      setVisibleCount(0);
      return;
    }

    setShow(false);
    setVisibleCount(0);

    const t1 = setTimeout(() => setShow(true), 2500);
    const t2 = setTimeout(() => setVisibleCount(1), 2500);
    const t3 = setTimeout(() => setVisibleCount(2), 3100);
    const t4 = setTimeout(() => setVisibleCount(3), 3700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [score]);

  if (!show || score < 65) return null;

  return (
    <div
      className="mt-6 rounded-2xl overflow-hidden border border-red-500/20"
      style={{ animation: 'slideDown 0.5s ease-out' }}
    >
      <div className="bg-[#1A1A2E] px-6 py-4 flex items-center gap-3">
        <span className="text-xl">⚡</span>
        <div>
          <div className="font-black text-white text-sm uppercase tracking-widest">
            3 Interventions Triggered
          </div>
          <div className="text-[11px] text-red-400 font-bold mt-0.5">
            3 ಹಸ್ತಕ್ಷೇಪಗಳು ಸಕ್ರಿಯಗೊಂಡಿವೆ
          </div>
        </div>
        <div className="ml-auto w-2 h-2 rounded-full bg-red-500 animate-pulse" />
      </div>

      <div className="bg-[#0f172a] px-6 py-4 space-y-3">
        {INTERVENTION_ITEMS.slice(0, visibleCount).map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-3"
            style={{ animation: 'slideDown 0.4s ease-out' }}
          >
            <span className="text-base mt-0.5">{item.icon}</span>
            <div>
              <div className="text-sm font-bold text-white">
                {item.en}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {item.kn}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ArcGauge = ({ score, status }) => {
  const [displayScore, setDisplayScore] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [glowing, setGlowing] = useState(false);

  useEffect(() => {
    setDisplayScore(0);
    setAnimatedScore(0);
    setGlowing(false);

    const duration = 2000;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      const current = Math.round(eased * score);
      setDisplayScore(current);
      setAnimatedScore(eased * score);

      if (current >= 65) setGlowing(true);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        if (score >= 65 && navigator.vibrate) {
          navigator.vibrate([200, 100, 200, 100, 400]);
        }
      }
    };

    const timer = setTimeout(() => {
      requestAnimationFrame(animate);
    }, 400);

    return () => clearTimeout(timer);
  }, [score]);

  const cx = 200;
  const cy = 200;
  const r = 150;

  const degToRad = (deg) => (deg * Math.PI) / 180;

  const getPoint = (deg) => ({
    x: cx + r * Math.cos(degToRad(deg)),
    y: cy + r * Math.sin(degToRad(deg))
  });

  const describeArc = (startDeg, endDeg) => {
    const start = getPoint(startDeg);
    const end = getPoint(endDeg);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} 
            A ${r} ${r} 0 ${large} 1 
            ${end.x} ${end.y}`;
  };

  const needleDeg = 180 + (animatedScore / 100) * 180;
  const needleEnd = {
    x: cx + 130 * Math.cos(degToRad(needleDeg)),
    y: cy + 130 * Math.sin(degToRad(needleDeg))
  };

  const scoreColor = displayScore >= 65
    ? '#E74C3C'
    : displayScore >= 35
    ? '#F39C12'
    : '#27AE60';

  return (
    <div className="flex flex-col items-center w-full">
      <div className={`
        relative w-full max-w-[400px]
        transition-all duration-500
        ${glowing
          ? 'drop-shadow-[0_0_40px_rgba(231,76,60,0.5)]'
          : ''
        }
      `}>
        <svg
          viewBox="0 0 400 280"
          className="w-full"
          style={{ overflow: 'visible' }}
        >
          <path d={describeArc(180, 360)} fill="none" stroke="#1e293b" strokeWidth="24" strokeLinecap="round" />
          <path d={describeArc(180, 241.2)} fill="none" stroke="#27AE60" strokeWidth="24" strokeLinecap="round" />
          <path d={describeArc(241.2, 298.8)} fill="none" stroke="#F39C12" strokeWidth="24" strokeLinecap="round" />
          <path d={describeArc(298.8, 360)} fill="none" stroke="#E74C3C" strokeWidth="24" strokeLinecap="round" />
          <line x1={cx} y1={cy} x2={needleEnd.x} y2={needleEnd.y} stroke={glowing ? '#E74C3C' : '#94a3b8'} strokeWidth="3" strokeLinecap="round" style={{ transition: 'stroke 0.5s' }} />
          <circle cx={cx} cy={cy} r="10" fill={glowing ? '#E74C3C' : '#475569'} style={{ transition: 'fill 0.5s' }} />
          <text x={cx} y={cy + 65} textAnchor="middle" fontSize="64" fontWeight="900" fill={scoreColor} style={{ transition: 'fill 0.3s' }}>
            {displayScore}
          </text>
          <text x={cx} y={cy + 85} textAnchor="middle" fontSize="13" fill="#64748b" fontWeight="700">
            / 100
          </text>
          <text x="28" y="255" textAnchor="middle" fontSize="13" fontWeight="800" fill="#27AE60">Safe</text>
          <text x={cx} y="32" textAnchor="middle" fontSize="13" fontWeight="800" fill="#F39C12">Watch</text>
          <text x="372" y="255" textAnchor="middle" fontSize="13" fontWeight="800" fill="#E74C3C">Urgent</text>
        </svg>
      </div>
      <div className={`mt-4 mb-2 px-8 py-2.5 rounded-full font-black text-sm uppercase tracking-widest transition-all duration-500 ${glowing ? 'bg-red-500/15 text-red-500 border border-red-500/30' : displayScore >= 35 ? 'bg-yellow-500/15 text-yellow-500 border border-yellow-500/30' : 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'}`}>
        {displayScore >= 65 ? 'URGENT / ತುರ್ತು' : displayScore >= 35 ? 'WATCH / ಗಮನಿಸಿ' : 'SAFE / ಸುರಕ್ಷಿತ'}
      </div>
    </div>
  );
};

export default function FarmerDashboard() {
  const { lang, t } = useLang();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { speak } = useTextToSpeech();
  
  const [farmerData, setFarmerData] = useState(null);
  const [uploadStatus, setUploadStatus] = useState({});
  const [sosStatus, setSosStatus] = useState('idle'); // idle | connecting | notified
  const [weather, setWeather] = useState(null);
  const [mitraAlert, setMitraAlert] = useState(null);
  const fileInputRefs = useRef({});

  // Audit Fix: Real-time Firestore Listener for Farmer Profile
  useEffect(() => {
    if (!currentUser?.uid) return;

    const unsub = onSnapshot(doc(db, 'users', currentUser.uid), (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        // Audit Fix: Force redirection to onboarding if incomplete
        if (!d.hasOnboarded) {
          navigate('/farmer/onboarding');
          return;
        }
        setFarmerData(d);
        if (d.taluk) setWeather(getMockWeather(d.taluk));
      } else {
        navigate('/farmer/onboarding');
      }
    }, (err) => console.warn("User Profile Index Logic Error", err));

    // 2. Listen for Incoming Alerts from Mitra
    const qAlerts = query(
      collection(db, 'global_activities'), 
      where('targetId', '==', currentUser.uid),
      where('type', '==', 'PRIORITY_ALERT'),
      orderBy('timestamp', 'desc'),
      limit(1)
    );
    const unsubAlerts = onSnapshot(qAlerts, (snap) => {
      if (!snap.empty) {
        const lastAlert = snap.docs[0].data();
        // Show if within last 60 seconds
        const ts = lastAlert.timestamp?.toMillis?.() || lastAlert.timestamp;
        if (Date.now() - ts < 60000) {
          setMitraAlert({ ...lastAlert, id: snap.docs[0].id });
        }
      }
    }, (err) => console.log("Silent Error: Global Alerts Index Required", err));

    return () => {
      unsub();
      unsubAlerts();
    };
  }, [currentUser, navigate]);

  if (!farmerData) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
       <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-teal-500 animate-spin" size={40} />
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] animate-pulse">Initializing Telemetry...</div>
       </div>
    </div>
  );

  const score = farmerData.score ?? 50;
  const status = score >= 65 ? 'Red' : score >= 35 ? 'Yellow' : 'Green';
  const trajectory = farmerData.trajectory || 'Stable';
  const lastCheckin = farmerData.lastUpdated; // Firestore timestamp

  const COOLDOWN_PERIOD = 14 * 24 * 60 * 60 * 1000;
  const lastCheckinMs = lastCheckin?.seconds ? lastCheckin.seconds * 1000 : (lastCheckin?.toMillis?.() || Date.now());
  const canCheckIn = !lastCheckin || (Date.now() - lastCheckinMs) > COOLDOWN_PERIOD;

  const { schemes, aiSummary } = matchSchemes({
    score, crop: farmerData.crop, taluk: farmerData.taluk,
    loanDaysOverdue: farmerData.loanDaysOverdue, landSize: farmerData.landSize,
  });

  const speakSummary = () => {
    const text = lang === 'en'
      ? `Hello ${farmerData.name}. Your distress score is ${score}, in the ${status} zone. You have ${schemes.length} schemes available.`
      : `ನಮಸ್ಕಾರ ${farmerData.name}. ನಿಮ್ಮ ಸಂಕಷ್ಟದ ಅಂಕ ${score}. ನಿಮಗಾಗಿ ${schemes.length} ಯೋಜನೆಗಳ ವಿವರ ಇಲ್ಲಿದೆ.`;
    speak(text, lang === 'en' ? 'en-IN' : 'kn-IN');
  };

  const handleSOS = async () => {
    setSosStatus('connecting');
    try {
      // 1. Write to Dedicated Alerts Collection
      const alertRef = await addDoc(collection(db, 'alerts'), {
        type: 'SOS',
        farmerId: currentUser.uid,
        farmerName: farmerData.name,
        location: farmerData.taluk || 'Regional HQ Sector',
        lat: farmerData.lat || 13,
        lng: farmerData.lng || 76,
        distressScore: score, // score is defined at line 271 as farmerData.score ?? 50
        timestamp: serverTimestamp(),
        isClaimed: false,
        claimedBy: null,
        message: `${farmerData.name} (UID: ${currentUser.uid.substring(0,5)}) is requesting immediate assistance.`
      });

      // 1.5 Write to Global Activities Log for system-wide transparency
      await fb.logActivity('SOS', `${farmerData.name} initiated SOS Protocol in ${farmerData.taluk} sector.`, {
        alertId: alertRef.id,
        farmerId: currentUser.uid
      });

      // 1.7 Update Farmer's user doc so Mitra queue auto-routes them
      await updateDoc(doc(db, 'users', currentUser.uid), {
        lastSos: Date.now()
      });

      // 2. Local Fallback for legacy listeners
      localStorage.setItem('krishimanas_last_event', JSON.stringify({
        type: 'SOS',
        farmerName: farmerData.name,
        timestamp: Date.now()
      }));
      window.dispatchEvent(new Event('storage'));

      setTimeout(() => {
        setSosStatus('notified');
        setTimeout(() => setSosStatus('idle'), 8000);
      }, 1500);
    } catch (e) {
      console.error("SOS Error", e);
      setSosStatus('idle');
    }
  };

  const handleFileUpload = (schemeId, docName, file) => {
    if (!file) return;
    const key = `${schemeId}_${docName}`;
    setUploadStatus(prev => ({ ...prev, [key]: 'uploading' }));
    setTimeout(() => {
      setUploadStatus(prev => ({ ...prev, [key]: 'done' }));
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-teal-500/20 overflow-x-hidden relative">
      
      {/* ─── Mitra Alert Overlay ─── */}
      {mitraAlert && (
        <div className="fixed inset-x-6 top-20 z-[2000] animate-in slide-in-from-top-full duration-500">
           <div className="bg-teal-500 p-8 rounded-[3rem] border-4 border-[#020617] shadow-[0_30px_90px_rgba(20,184,166,0.4)] flex flex-col md:flex-row items-center justify-between text-[#020617] relative overflow-hidden group">
              <div className="absolute -right-10 -bottom-10 opacity-10 rotate-12 group-hover:scale-110 transition-transform">
                 <Zap size={200} fill="currentColor" />
              </div>
              <div className="flex items-center gap-6 relative z-10 flex-1">
                 <div className="w-20 h-20 bg-[#020617] rounded-full flex items-center justify-center text-teal-400 shadow-2xl">
                    <Bell size={40} className="animate-bounce" />
                 </div>
                 <div>
                    <div className="text-[11px] font-black uppercase tracking-[0.3em] opacity-60 mb-1">Incoming Mitra Protocol</div>
                    <div className="text-3xl font-black tracking-tighter leading-none mb-2">Message from {mitraAlert.mitraName || 'Field Mitra'}</div>
                    <p className="font-bold text-sm italic opacity-80 max-w-xl">"{mitraAlert.msg || 'A priority alert has been issued for your sector. Please review the recommended actions.'}"</p>
                 </div>
              </div>
              <div className="flex gap-4 mt-8 md:mt-0 relative z-10">
                 <a 
                   href={`tel:${mitraAlert.mitraPhone || '+91XXXXXXXXXX'}`}
                   className="px-10 py-4 bg-[#020617] text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
                 >
                    Call Mitra
                 </a>
                 <button onClick={() => setMitraAlert(null)} className="p-4 bg-teal-600/20 rounded-3xl hover:bg-teal-600/40 transition-all border border-[#020617]/10">
                    <X size={24} />
                 </button>
              </div>
           </div>
        </div>
      )}
      
      {/* ─── Navigation ─── */}
      <nav className="h-16 border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-[1000]">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-teal-500 font-black text-2xl tracking-tighter hover:opacity-80 transition-all">
          <Zap size={22} fill="currentColor" /> KrishiManas
        </button>
        <div className="flex items-center gap-6">
           <div className="hidden md:block text-[10px] font-black text-slate-500 uppercase tracking-widest border border-white/10 px-3 py-1 rounded-lg">
              District Nodes : Hassan // Operational
           </div>
           <button onClick={() => { localStorage.removeItem('krishimanas_auth_farmer'); navigate('/'); }} className="text-[10px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors">
              Session End
           </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 pt-10 pb-20 space-y-10">
        
        {/* ─── Strategic Header ─── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-[#0f172a] rounded-[2.5rem] p-10 border border-white/5 relative overflow-hidden group">
           <div className="absolute -right-8 -top-8 text-teal-500 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-1000">
              <User size={260} />
           </div>
           <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-2 text-teal-500 font-black text-[10px] uppercase tracking-[0.3em]">
                 <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse shadow-[0_0_8px_#14b8a6]" />
                 Secure Identity Verified
              </div>
              <h1 className="text-5xl font-black text-white tracking-tighter leading-none">
                 {lang === 'kn' ? `${farmerData.name} ಅವರೇ, ನಮಸ್ಕಾರ` : `Namaste, ${farmerData.name}`}
              </h1>
              <p className="text-slate-500 font-bold uppercase text-[11px] tracking-[0.2em] italic">
                 {farmerData.taluk} Operational Sector // Registry ID: {currentUser.uid.substring(0,8)}
              </p>
           </div>
           <button
             onClick={speakSummary}
             className="group relative z-10 flex items-center justify-center gap-4 bg-teal-500 text-[#020617] px-10 py-5 rounded-3xl font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-teal-500/20"
           >
              <Volume2 size={24} className="group-hover:animate-bounce" />
              {lang === 'kn' ? 'ಸ್ಥಿತಿ ವರದಿ ಆಲಿಸಿ' : 'Audit Synthesis'}
           </button>
        </div>

        {/* ─── Distress Matrix ─── */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
           <div className="lg:col-span-8 space-y-8">
              <div className="bg-[#0f172a] rounded-[3rem] p-12 border border-white/5 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl shadow-black/40">
                 <div className="absolute -right-12 -top-12 text-teal-500 opacity-[0.02] rotate-45 scale-150"><Shield size={400} /></div>
                 
                 <div className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] mb-12">Distress Performance Index (DPI)</div>

                 <ArcGauge score={score} status={status} />
                 <InterventionBanner score={score} />

                 <div className="mt-12 flex flex-col items-center gap-4">
                    <div className={`px-8 py-3 rounded-full font-black text-xs uppercase tracking-[0.2em] border-2 shadow-xl ${
                       score >= 65 ? 'bg-red-500/10 border-red-500/30 text-red-500 shadow-red-500/10' : 
                       score >= 35 ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500 shadow-yellow-500/10' : 
                       'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 shadow-emerald-500/10'
                    }`}>
                       Protocol Mode: {status} Level // {trajectory} Trajectory
                    </div>
                    <p className="max-w-md text-xs font-bold text-slate-400 opacity-60 uppercase italic tracking-tighter">
                       Index refreshed {lastCheckin?.seconds ? new Date(lastCheckin.seconds * 1000).toLocaleTimeString() : 'Just Now'} across all regional nodes.
                    </p>
                 </div>
              </div>

              {/* Assessment Trigger */}
              <div 
                onClick={() => canCheckIn && navigate('/farmer/checkin')}
                className={`group relative overflow-hidden rounded-[2.5rem] p-10 transition-all duration-700 ${
                  canCheckIn 
                  ? 'bg-teal-500 cursor-pointer hover:bg-teal-400 shadow-[0_20px_50px_rgba(20,184,166,0.3)]' 
                  : 'bg-[#0f172a] border border-white/5 opacity-80 cursor-not-allowed'
                }`}
              >
                 <div className="relative z-10 flex items-center justify-between">
                    <div>
                       <div className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${canCheckIn ? 'text-[#020617]' : 'text-teal-500'}`}>
                          {canCheckIn ? 'Action Required' : 'Assessment Nominal'}
                       </div>
                       <h3 className={`text-3xl font-black tracking-tighter ${canCheckIn ? 'text-[#020617]' : 'text-white'}`}>
                          {lang === 'kn' ? 'ಸಂಕಷ್ಟದ ಪರಿಶೀಲನೆ-೨' : 'Dynamic DPI Audit'}
                       </h3>
                       <p className={`text-sm font-bold max-w-sm mt-2 ${canCheckIn ? 'text-[#020617]/70 italic' : 'text-slate-500'}`}>
                          {canCheckIn 
                            ? 'Your evaluation window is open. Recalibrate your distress index for priority scheme access.' 
                            : 'Score locked. Regional HQ is processing your current risk profile.'}
                       </p>
                    </div>
                    <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-inner transition-all duration-500 group-hover:scale-110 ${canCheckIn ? 'bg-[#020617] text-teal-400' : 'bg-white/5 text-slate-600'}`}>
                       <Activity size={32} />
                    </div>
                 </div>
                 {canCheckIn && <div className="absolute top-0 right-0 p-8 text-[#020617] opacity-[0.03] scale-150"><Zap size={200} fill="currentColor" /></div>}
              </div>
           </div>

           {/* ─── Strategic Sidebar ─── */}
           <div className="lg:col-span-4 space-y-8">
              
              {/* Regional Telemetry (Weather) */}
              <div className="bg-[#0f172a] rounded-[2.5rem] p-8 border border-white/5 relative group overflow-hidden shadow-xl">
                 <div className="absolute -right-4 -top-4 text-teal-500 opacity-5 group-hover:rotate-12 transition-all"><CloudRain size={120} /></div>
                 <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                       <CloudRain size={20} className="text-teal-500 group-hover:animate-bounce" />
                       <span className="font-black text-white text-sm uppercase tracking-widest">Weather Grid</span>
                    </div>
                    <span className="text-[9px] font-black bg-white/5 px-2 py-0.5 rounded text-slate-500 uppercase tracking-widest">{farmerData.taluk} Sector</span>
                 </div>
                 <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white/5 rounded-2xl p-6 flex flex-col items-center">
                       <span className="text-4xl font-black text-white">{weather?.temp || '24°'}</span>
                       <span className="text-[9px] font-black text-slate-500 uppercase mt-2">Surface Temp</span>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-6 flex flex-col items-center">
                       <span className="text-4xl font-black text-white">{weather?.humidity || '60%'}</span>
                       <span className="text-[9px] font-black text-slate-500 uppercase mt-2">Humidity Index</span>
                    </div>
                 </div>
                 <div className="p-5 bg-teal-500/5 border border-teal-500/10 rounded-2xl">
                    <p className="text-xs font-bold text-teal-400 leading-relaxed italic opacity-80">"{weather?.forecast || 'Clear skies detected across cultivation sectors.'}"</p>
                 </div>
              </div>

              {/* Force Deployment (SOS) */}
              <div className="bg-[#0f172a] rounded-[2.5rem] p-10 border border-white/5 shadow-2xl relative overflow-hidden group">
                 <div className="absolute right-0 top-0 p-10 text-red-500 opacity-5 group-hover:rotate-12 transition-all scale-110"><Shield size={160} /></div>
                 <div className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] mb-8">Mitra Unit Assigned</div>
                 
                 <div className="flex items-center gap-6 mb-10">
                    <div className="w-20 h-20 rounded-[1.5rem] bg-teal-500 text-[#020617] flex items-center justify-center text-3xl font-black shadow-2xl shadow-teal-500/20">
                       {farmerData.assignedMitraName?.substring(0,1) || 'M'}
                    </div>
                    <div className="flex-1">
                       <div className="font-black text-2xl text-white tracking-tighter">{farmerData.assignedMitraName || 'Global Mitra Unit'}</div>
                       <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active Force · {farmerData.taluk || 'HQ'}</div>
                       
                       {farmerData.assignedMitraPhone && (
                         <div className="mt-2 flex items-center gap-2 text-teal-400 font-bold text-sm">
                           <PhoneCall size={14} /> {farmerData.assignedMitraPhone}
                         </div>
                       )}

                       <div className={`mt-2 flex items-center gap-2 font-black text-[9px] uppercase ${farmerData.assignedMitraId ? 'text-emerald-500' : 'text-slate-500'}`}>
                          <div className={`w-2 h-2 rounded-full ${farmerData.assignedMitraId ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`} /> {farmerData.assignedMitraId ? 'Unit Deployment Active' : 'Awaiting Assignment'}
                       </div>
                    </div>
                 </div>

                 <button 
                  onClick={handleSOS}
                  disabled={sosStatus !== 'idle'}
                  className={`w-full py-6 rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all shadow-2xl ${
                    sosStatus === 'idle' ? 'bg-red-600 text-white hover:bg-red-500 shadow-red-600/30' : 
                    sosStatus === 'connecting' ? 'bg-white/5 text-slate-600 animate-pulse' : 'bg-emerald-500 text-white shadow-emerald-500/30'
                  }`}
                 >
                   {sosStatus === 'idle' ? (
                     <>
                      <div className="px-2 py-0.5 bg-white text-red-600 rounded-[4px] text-[8px] font-black shadow-inner">SOS</div>
                      {lang === 'kn' ? 'ಮಿತ್ರಕ್ಕೆ ತಿಳಿಸಿ' : 'Dispatch SOS Signal'}
                     </>
                   ) : sosStatus === 'connecting' ? (
                     <><Loader2 className="animate-spin" size={20} /> Encrypting Signal...</>
                   ) : (
                     <><CheckCircle size={20} /> HQ & Mitra Notified</>
                   )}
                 </button>
                 {sosStatus === 'notified' && (
                    <p className="mt-4 text-[10px] text-center font-bold text-emerald-500 uppercase tracking-widest animate-in slide-in-from-top-2">
                      {farmerData.assignedMitraName ? `${farmerData.assignedMitraName} is responding . . . Est 3m` : 'Regional Mitra Unit is responding . . .'}
                    </p>
                 )}
              </div>
           </div>
        </div>

        {/* ─── Scheme Match Matrix ─── */}
        <div className="pt-20">
           <div className="flex items-end justify-between mb-12 border-b border-white/5 pb-8 relative">
              <div className="absolute left-0 bottom-0 w-32 h-[2px] bg-teal-500 shadow-[0_0_8px_#14b8a6]" />
              <div>
                 <h2 className="text-5xl font-black text-white tracking-tighter mb-4 italic">{lang === 'kn' ? 'ನಿಮಗಾಗಿ ಯೋಜನೆಗಳು' : 'Intelligence Match'}</h2>
                 <p className="text-teal-400 font-bold leading-relaxed max-w-2xl text-sm italic opacity-80">
                    {aiSummary}
                 </p>
              </div>
              <div className="text-[10px] font-black bg-white/5 text-slate-500 px-6 py-3 rounded-2xl border border-white/10 uppercase tracking-[.25em]">
                 Found {schemes.length} Tactical Matches
              </div>
           </div>
           
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {schemes.map(s => (
                <div key={s.id} className="bg-[#0f172a] rounded-[2.5rem] p-10 border border-white/5 flex flex-col transition-all duration-500 hover:border-teal-500/30 hover:shadow-2xl hover:shadow-teal-900/10 group relative overflow-hidden">
                   <div className="absolute right-0 top-0 p-8 text-white opacity-[0.02] group-hover:rotate-12 transition-all scale-125"><FileText size={160} /></div>
                   <div className="flex justify-between items-start mb-8 relative z-10">
                      <div className={`p-5 rounded-[1.5rem] transition-all duration-500 ${status === 'Red' ? 'bg-red-500/10 text-red-500 group-hover:bg-red-500 group-hover:text-white' : 'bg-teal-500/10 text-teal-400 group-hover:bg-teal-500 group-hover:text-[#020617]'}`}>
                         <FileText size={32} />
                      </div>
                      <div className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
                         Sector: {s.category || 'REGIONAL'} · 24D LEFT
                      </div>
                   </div>
                   <h3 className="text-2xl font-black text-white mb-4 leading-tight tracking-tight relative z-10">{s.name}</h3>
                   <p className="text-sm font-bold text-slate-400 leading-relaxed mb-10 flex-1 opacity-70 relative z-10">
                      {lang === 'kn' ? (s.eligibilityReasonKannada || s.eligibilityReason) : s.eligibilityReason}
                   </p>
                   
                   <div className="space-y-4 mb-10 relative z-10">
                      <div className="text-[9px] font-black text-teal-500 uppercase tracking-[0.3em] border-b border-white/5 pb-3">Operational Documents</div>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {s.documents.map(doc => (
                          <div key={doc} className="group/doc border border-white/10 bg-white/5 rounded-xl px-4 py-2.5 flex items-center gap-3 hover:bg-white/10 hover:border-teal-500 transition-all cursor-pointer">
                             <input 
                                type="file" className="hidden" 
                                onChange={(e) => handleFileUpload(s.id, doc, e.target.files[0])}
                                ref={(el) => (fileInputRefs.current[`${s.id}_${doc}`] = el)}
                             />
                             <div onClick={() => !uploadStatus[`${s.id}_${doc}`] && fileInputRefs.current[`${s.id}_${doc}`].click()} className="flex items-center gap-3 w-full">
                                {uploadStatus[`${s.id}_${doc}`] === 'done' ? <CheckCircle size={16} className="text-emerald-500" /> : <Upload size={16} className="text-slate-600 group-hover/doc:text-teal-400" />}
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{uploadStatus[`${s.id}_${doc}`] === 'uploading' ? 'Syncing...' : doc}</span>
                             </div>
                          </div>
                        ))}
                      </div>
                   </div>

                   <div className="flex items-center justify-between pt-8 border-t border-white/5 relative z-10">
                      <span className="text-lg font-black text-teal-500 tabular-nums tracking-tighter">{s.benefit}</span>
                      <div className="w-10 h-10 rounded-full bg-white/5 text-slate-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all group-hover:bg-teal-500 group-hover:text-[#020617] transform translate-x-4 group-hover:translate-x-0">
                         <TrendingUp size={20} />
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
      
      {/* Dynamic Background Noise */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] mix-blend-overlay">
         <svg className="w-full h-full"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" /></filter><rect width="100%" height="100%" filter="url(#noise)" /></svg>
      </div>

    </div>
  );
}

const Shield = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

