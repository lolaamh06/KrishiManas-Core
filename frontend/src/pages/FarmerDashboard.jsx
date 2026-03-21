import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../contexts/LanguageContext';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { 
  Volume2, AlertTriangle, CheckCircle, CloudRain, MapPin, Upload, User, 
  TrendingUp, TrendingDown, Minus, Home, FileText, PhoneCall, Loader2
} from 'lucide-react';

const handleFileUpload = (schemeId, docName, file, uploadStatus, setUploadStatus) => {
  if (!file) return;
  const key = `${schemeId}_${docName}`;
  setUploadStatus(prev => ({ ...prev, [key]: 'uploading' }));
  setTimeout(() => {
    setUploadStatus(prev => ({ ...prev, [key]: 'done' }));
  }, 1500);
};
import { getMockWeather } from '../utils/mockWeather';
import { matchSchemes } from '../utils/matchSchemes'; 

export default function FarmerDashboard() {
  const { lang } = useLang();
  const navigate = useNavigate();
  const { speak } = useTextToSpeech();
  const [data, setData] = useState(null);
  const [uploadStatus, setUploadStatus] = useState({});
  const [sosStatus, setSosStatus] = useState('idle'); // idle | connecting | notified
  const fileInputRefs = useRef({});

  // Re-read localStorage
  const loadData = () => {
    const local = localStorage.getItem('krishimanas_farmer');
    if (local) setData(JSON.parse(local));
    else navigate('/farmer/onboarding');
  };

  useEffect(() => {
    loadData();
    window.addEventListener('focus', loadData);
    window.addEventListener('storage', loadData);
    return () => {
      window.removeEventListener('focus', loadData);
      window.removeEventListener('storage', loadData);
    };
  }, [navigate]);

  if (!data) return <div className="min-h-screen flex items-center justify-center bg-system-bg font-black text-navy uppercase tracking-widest animate-pulse">KrishiManas...</div>;

  const farmer = data.farmer || data;
  const score = data.score ?? farmer.score ?? 50;
  const status = score >= 65 ? 'Red' : score >= 35 ? 'Yellow' : 'Green';
  const trajectory = data.trajectory || farmer.trajectory || 'Stable';
  const lastCheckin = data.lastCheckin || 0; // timestamp

  // 14-day cooldown (14 * 24 * 60 * 60 * 1000 ms)
  const COOLDOWN_PERIOD = 14 * 24 * 60 * 60 * 1000;
  const canCheckIn = (Date.now() - lastCheckin) > COOLDOWN_PERIOD;

  const weather = getMockWeather(farmer.taluk || 'Hassan');
  const { schemes, aiSummary } = matchSchemes({
    score, crop: farmer.crop, taluk: farmer.taluk,
    loanDaysOverdue: farmer.loanDaysOverdue, landSize: farmer.landSize,
  });

  const speakSummary = () => {
    const text = lang === 'en'
      ? `Hello ${farmer.name}. Your distress score is ${score}, in the ${status} zone. You have ${schemes.length} schemes available.`
      : `ನಮಸ್ಕಾರ ${farmer.name}. ನಿಮ್ಮ ಸಂಕಷ್ಟದ ಅಂಕ ${score}. ನಿಮಗಾಗಿ ${schemes.length} ಯೋಜನೆಗಳ ವಿವರ ಇಲ್ಲಿದೆ.`;
    speak(text, lang === 'en' ? 'en-IN' : 'kn-IN');
  };

  const handleSOS = () => {
    setSosStatus('connecting');
    // Signal to Mitra Portal via localStorage (Unified Event Bus)
    const sosEvent = { 
      type: 'SOS',
      farmerId: farmer.id, 
      farmerName: farmer.name, 
      lat: farmer.lat || 13.0, 
      lng: farmer.lng || 76.1, 
      timestamp: Date.now() 
    };
    localStorage.setItem('krishimanas_last_event', JSON.stringify(sosEvent));
    localStorage.setItem('krishimanas_sos_signal', JSON.stringify(sosEvent)); // Backward compatibility
    
    // Fire events
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('krishimanas_update', { detail: sosEvent }));
    
    // Simulate connection delay
    setTimeout(() => {
      setSosStatus('notified');
      // Auto-reset after a while
      setTimeout(() => setSosStatus('idle'), 10000);
    }, 2000);
  };

  const getTrajectoryIcon = () => {
    if (trajectory === 'Worsening') return <TrendingUp className="text-system-red" size={20} />;
    if (trajectory === 'Improving') return <TrendingDown className="text-system-green" size={20} />;
    return <Minus className="text-system-yellow" size={20} />;
  };

  return (
    <div className="min-h-screen bg-system-bg pb-12 font-sans selection:bg-teal-primary/20">
      {/* Top Navigation */}
      <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-teal-primary font-black text-2xl hover:opacity-80 transition-all">
          <Home size={22} strokeWidth={3} />
          <span className="tracking-tighter">KrishiManas</span>
        </button>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => { localStorage.removeItem('krishimanas_farmer'); navigate('/'); }}
            className="text-[10px] font-black text-gray-400 hover:text-system-red transition-colors tracking-widest uppercase"
          >
            {lang === 'kn' ? 'ನಿರ್ಗಮಿಸಿ' : 'Logout'}
          </button>
          <div className="w-10 h-10 rounded-2xl bg-teal-light flex items-center justify-center text-teal-primary border border-teal-primary/10 shadow-inner">
            <User size={20} />
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 mt-8 space-y-6">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-4xl font-black text-navy leading-none mb-2">
              {lang === 'kn' ? `${farmer.name} ಅವರೇ, ನಮಸ್ಕಾರ` : `Namaste, ${farmer.name}`}
            </h1>
            <p className="text-gray-400 font-bold uppercase text-[11px] tracking-[0.2em]">
              {lang === 'kn' ? 'ನಿಮ್ಮ ಸಂಕಷ್ಟದ ವರದಿ ಮತ್ತು ಸಹಾಯ ಕೇಂದ್ರ' : "Regional Distress Dashboard // Active Monitoring"}
            </p>
          </div>
          <button
            onClick={speakSummary}
            className="group flex items-center justify-center gap-3 bg-navy text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-navy/20"
          >
            <Volume2 size={24} className="group-hover:animate-pulse" />
            {lang === 'kn' ? 'ವರದಿ ಆಲಿಸಿ' : 'Listen Report'}
          </button>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          
          {/* Main: Score & Check-in */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-50 p-10 flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <AlertTriangle size={200} className={score >= 65 ? 'text-system-red' : 'text-gray-200'} />
              </div>

              <div className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8">
                {lang === 'kn' ? 'ಪರಿಷ್ಕೃತ ಸಂಕಷ್ಟದ ಅಂಕ' : 'Validated Distress Index'}
              </div>

              {/* Progress Circle Custom UI */}
              <div className="relative w-56 h-56 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-gray-50" />
                  <circle
                    cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="16" fill="transparent"
                    strokeDasharray={628.3}
                    strokeDashoffset={628.3 - (628.3 * score) / 100}
                    className={`transition-all duration-1000 ease-in-out ${score >= 65 ? 'text-system-red shadow-lg' : score >= 35 ? 'text-system-yellow' : 'text-system-green'}`}
                    style={{ strokeLinecap: 'round' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-7xl font-black tracking-tighter ${score >= 65 ? 'text-system-red' : score >= 35 ? 'text-system-yellow' : 'text-system-green'}`}>
                    {score}
                  </span>
                  <span className="text-[10px] font-black text-gray-300 uppercase mt-[-10px]">Points / 100</span>
                </div>
              </div>

              <div className={`mt-8 inline-flex items-center gap-3 px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest ${score >= 65 ? 'bg-system-red/10 text-system-red' : score >= 35 ? 'bg-system-yellow/10 text-system-yellow' : 'bg-system-green/10 text-system-green'}`}>
                {getTrajectoryIcon()}
                {status} Zone · {trajectory}
              </div>

              <div className="mt-10 grid grid-cols-2 gap-4 w-full max-w-md">
                 <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 text-center">
                    <div className="text-[9px] font-black text-gray-400 uppercase mb-1">Last Update</div>
                    <div className="text-xs font-bold text-navy">{lastCheckin ? new Date(lastCheckin).toLocaleDateString() : 'N/A'}</div>
                 </div>
                 <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 text-center">
                    <div className="text-[9px] font-black text-gray-400 uppercase mb-1">Status</div>
                    <div className="text-xs font-bold text-navy uppercase tracking-tighter">{status === 'Green' ? 'Healthy' : 'Monitoring'}</div>
                 </div>
              </div>
            </div>

            {/* Check-in Visibility Logic: Only show if 14+ days since last check-in */}
            {canCheckIn ? (
              <div 
                onClick={() => navigate('/farmer/checkin')}
                className="bg-navy rounded-3xl p-8 text-white flex items-center justify-between cursor-pointer hover:bg-black transition-all group relative overflow-hidden shadow-2xl shadow-navy/20"
              >
                <div className="relative z-10">
                  <div className="text-teal-400 font-black text-[10px] uppercase tracking-[0.3em] mb-2 scale-90 -ml-2 origin-left border border-teal-400/30 px-2 py-0.5 rounded-full inline-block">System Alert</div>
                  <h3 className="text-2xl font-black mb-1">{lang === 'kn' ? '೧೪ ದಿನಗಳ ಮರು-ಪರಿಶೀಲನೆ' : '14-Day Re-Assessment'}</h3>
                  <p className="text-white/60 text-sm font-medium">{lang === 'kn' ? 'ನಿಮ್ಮ ಅಂಕ ನವೀಕರಿಸಲು ಇಲ್ಲಿ ಕ್ಲಿಕ್ ಮಾಡಿ' : 'Update your distress score to get latest scheme matches'}</p>
                </div>
                <div className="w-14 h-14 rounded-full bg-white text-navy flex items-center justify-center group-hover:scale-110 transition-all z-10 shadow-xl">
                   <TrendingUp size={28} />
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              </div>
            ) : (
              <div className="bg-gray-100/50 border-2 border-dashed border-gray-200 rounded-3xl p-8 text-center flex flex-col items-center gap-2">
                 <div className="p-3 rounded-full bg-white text-gray-300">
                    <CheckCircle size={32} />
                 </div>
                 <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Assessment Complete</div>
                 <p className="text-[11px] text-gray-400 max-w-xs mx-auto">
                    Next check-in window opens in <b>{Math.ceil((COOLDOWN_PERIOD - (Date.now() - lastCheckin)) / (24*60*60*1000))} days</b>. 
                    Rest assured, your Mitra is monitoring your case.
                 </p>
              </div>
            )}
          </div>

          {/* Sidebar: Weather & SOS */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Weather Insights */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-50">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                    <div className="p-3 bg-teal-light rounded-xl text-teal-primary">
                       <CloudRain size={20} />
                    </div>
                    <span className="font-black text-navy uppercase text-sm tracking-tight">{lang === 'kn' ? 'ಹವಾಮಾನ' : 'Weather'}</span>
                 </div>
                 <div className="text-[10px] bg-gray-50 border border-gray-100 px-3 py-1 rounded-full font-black text-gray-400 uppercase tracking-widest">{weather.taluk}</div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center">
                   <span className="text-3xl font-black text-navy">{weather.temp}</span>
                   <span className="text-[9px] font-black text-gray-400 uppercase">{lang === 'kn' ? 'ಉಷ್ಣಾಂಶ' : 'Celsius'}</span>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center">
                   <span className="text-3xl font-black text-navy">{weather.humidity}</span>
                   <span className="text-[9px] font-black text-gray-400 uppercase">{lang === 'kn' ? 'ಆರ್ದ್ರತೆ' : 'Humidity'}</span>
                </div>
              </div>
              <div className="p-4 bg-system-yellow/5 border border-system-yellow/10 rounded-2xl">
                 <p className="text-xs font-bold text-navy leading-relaxed italic opacity-80">"{weather.forecast}"</p>
              </div>
            </div>

            {/* SOS / Mitra Connectivity */}
            <div className="bg-white rounded-[2rem] p-8 shadow-md border border-gray-50 relative overflow-hidden group">
               <div className="flex items-center gap-2 mb-8 text-teal-primary">
                 <PhoneCall size={18} />
                 <span className="font-black text-navy text-sm uppercase tracking-tight">{lang === 'kn' ? 'ತುರ್ತು ಸಂಪರ್ಕ' : 'Regional Outreach'}</span>
               </div>
               
               <div className="flex items-center gap-5 mb-8">
                 <div className="w-16 h-16 rounded-[1.5rem] bg-navy text-teal-400 flex items-center justify-center text-xl font-black shadow-lg shadow-navy/20">
                    SN
                 </div>
                 <div className="flex-1">
                    <div className="font-black text-xl text-navy">Suresh Naik</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Assigned Mitra · Hassan HQ</div>
                    <div className="mt-1 flex items-center gap-1.5 text-system-green font-black text-[9px] uppercase">
                       <div className="w-1.5 h-1.5 rounded-full bg-system-green animate-pulse" /> Active Now
                    </div>
                 </div>
               </div>

               <button 
                onClick={handleSOS}
                disabled={sosStatus !== 'idle'}
                className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all relative overflow-hidden ${
                  sosStatus === 'idle' ? 'bg-system-red text-white hover:bg-red-600 shadow-xl shadow-red-500/20' : 
                  sosStatus === 'connecting' ? 'bg-navy text-white animate-pulse' : 'bg-system-green text-white'
                }`}
               >
                 {sosStatus === 'idle' ? (
                   <>
                    <div className="px-2 py-0.5 bg-white text-system-red rounded text-[9px] font-black mr-1 shadow-sm">SOS</div>
                    {lang === 'kn' ? 'ಮಿತ್ರಕ್ಕೆ ತಿಳಿಸಿ' : 'Call your Mitra'}
                   </>
                 ) : sosStatus === 'connecting' ? (
                   <><Loader2 className="animate-spin" size={20} /> Connecting Mitra...</>
                 ) : (
                   <><CheckCircle size={20} /> Mitra Notified</>
                 )}
               </button>
               {sosStatus === 'notified' && (
                  <p className="mt-3 text-[10px] text-center font-bold text-system-green uppercase tracking-widest animate-bounce">Suresh will call you in 2 mins</p>
               )}
            </div>
          </div>
        </div>

        {/* Schemes Section */}
        <div className="pt-8">
           <div className="flex items-end justify-between mb-8 border-b border-gray-100 pb-4">
              <div>
                 <h2 className="text-3xl font-black text-navy tracking-tighter mb-2">{lang === 'kn' ? 'ನಿಮಗಾಗಿ ಯೋಜನೆಗಳು' : 'Intelligence Match'}</h2>
                 <p className="text-teal-600 bg-teal-50 px-3 py-2 rounded-xl text-xs font-bold leading-relaxed max-w-2xl border border-teal-100 italic">
                    {lang === 'kn' ? aiSummary : aiSummary}
                 </p>
              </div>
              <div className="text-xs font-black bg-navy text-white px-4 py-2 rounded-xl">
                 {schemes.length} OPTIONS FOUND
              </div>
           </div>
           
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {schemes.map(s => (
                <div key={s.id} className="bg-white rounded-[2rem] p-8 border border-gray-50 shadow-sm hover:shadow-2xl hover:shadow-teal-900/10 transition-all duration-500 flex flex-col group">
                   <div className="flex justify-between items-start mb-6">
                      <div className={`p-4 rounded-2xl ${status === 'Red' ? 'bg-system-red/5 text-system-red' : 'bg-teal-light text-teal-primary'}`}>
                         <FileText size={28} />
                      </div>
                      <div className="bg-gray-50 px-3 py-1 rounded-full text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                         <span className="text-teal-600">{s.category ? s.category.replace('_', ' ') : 'STATE SCHEME'}</span>
                         <span>· Ends: {s.deadline}</span>
                      </div>
                   </div>
                   <h3 className="text-xl font-black text-navy mb-3 leading-tight">{s.name}</h3>
                   <p className="text-xs font-medium text-gray-500 leading-relaxed mb-6 flex-1">
                      {lang === 'kn' ? s.eligibilityReasonKannada : s.eligibilityReason}
                   </p>
                   
                   <div className="space-y-4 mb-8">
                      <div className="text-[9px] font-black text-teal-primary uppercase tracking-[0.2em] border-b border-teal-primary/10 pb-2">Verification Docs</div>
                      <div className="flex flex-wrap gap-2">
                        {s.documents.map(doc => (
                          <div key={doc} className="group/doc border border-gray-100 bg-gray-50/50 rounded-xl px-3 py-2 flex items-center gap-2 hover:bg-white hover:border-teal-primary/30 transition-all cursor-pointer">
                             <input 
                                type="file" className="hidden" 
                                onChange={(e) => handleFileUpload(s.id, doc, e.target.files[0], uploadStatus, setUploadStatus)}
                                ref={(el) => (fileInputRefs.current[`${s.id}_${doc}`] = el)}
                             />
                             <div onClick={() => fileInputRefs.current[`${s.id}_${doc}`].click()} className="flex items-center gap-2 w-full">
                                {uploadStatus[`${s.id}_${doc}`] === 'done' ? <CheckCircle size={14} className="text-system-green" /> : <Upload size={14} className="text-gray-300 group-hover/doc:text-teal-primary" />}
                                <span className="text-[10px] font-bold text-gray-600 truncate max-w-[80px]">{doc}</span>
                             </div>
                          </div>
                        ))}
                      </div>
                   </div>

                   <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                      <span className="text-sm font-black text-teal-primary uppercase tracking-tighter">{s.benefit}</span>
                      <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                         <TrendingUp size={16} />
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
