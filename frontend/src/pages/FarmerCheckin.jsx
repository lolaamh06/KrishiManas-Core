import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, CheckCircle, AlertCircle, ArrowLeft, Loader2, Volume2, Activity, Zap } from 'lucide-react';
import { useLang } from '../contexts/LanguageContext';
import { useSpeech } from '../hooks/useSpeech';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { useAuth } from '../contexts/AuthContext';
import { db, fb, doc, updateDoc, serverTimestamp, arrayUnion } from '../utils/firebase';
import VoiceInput from '../components/shared/VoiceInput';

const SENTIMENTS = [
  {
    key: 'good',
    emoji: '😊',
    labelEn: 'Optimal // Doing well',
    labelKn: 'ನಾನು ಚೆನ್ನಾಗಿದ್ದೇನೆ',
    color: 'border-white/5 bg-white/5',
    activeColor: 'border-teal-500 bg-teal-500 text-[#020617]',
    scoreEffect: -5,
  },
  {
    key: 'okay',
    emoji: '😐',
    labelEn: 'Nominal // Concerned',
    labelKn: 'ನಿಭಾಯಿಸುತ್ತಿದ್ದೇನೆ, ಆದರೆ ಚಿಂತೆ ಇದೆ',
    color: 'border-white/5 bg-white/5',
    activeColor: 'border-yellow-500 bg-yellow-500 text-[#020617]',
    scoreEffect: 5,
  },
  {
    key: 'bad',
    emoji: '😟',
    labelEn: 'Critical // Struggling',
    labelKn: 'ತುಂಬಾ ಕಷ್ಟ ಆಗ್ತಿದೆ',
    color: 'border-white/5 bg-white/5',
    activeColor: 'border-red-500 bg-red-500 text-white',
    scoreEffect: 15,
  },
];

const QUICK_CHECKS = [
  { id: 'loan', labelEn: 'Received a loan notice', labelKn: 'ಸಾಲದ ನೋಟಿಸ್ ಬಂತು', weight: 10 },
  { id: 'crop', labelEn: 'New pest/crop anomaly', labelKn: 'ಬೆಳೆಗೆ ಹೊಸ ಸಮಸ್ಯೆ', weight: 12 },
  { id: 'weather', labelEn: 'Adverse weather impact', labelKn: 'ಅಸಾಮಾನ್ಯ ಹವಾಮಾನ ಪ್ರಭಾವ', weight: 8 },
  { id: 'family', labelEn: 'Family health disruption', labelKn: 'ಕುಟುಂಬ ಆರೋಗ್ಯ ಸಮಸ್ಯೆ', weight: 6 },
];

export default function FarmerCheckin() {
  const { lang, t } = useLang();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { speak } = useTextToSpeech();
  
  const [sentiment, setSentiment] = useState(null);
  const [notes, setNotes] = useState('');
  const [checks, setChecks] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scoreChange, setScoreChange] = useState(0);

  // Global VoiceInput now handles internal speech logic

  const previousScore = currentUser?.score || 50;
  const farmerName = currentUser?.name || 'Farmer';

  const toggleCheck = (id) => {
    setChecks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const calcScoreChange = () => {
    if (!sentiment) return 0;
    const base = SENTIMENTS.find(s => s.key === sentiment)?.scoreEffect || 0;
    const checkScore = QUICK_CHECKS.reduce((sum, c) => sum + (checks[c.id] ? c.weight : 0), 0);
    return base + checkScore;
  };

  const handleSubmit = async () => {
    if (!sentiment || !currentUser?.uid) return;
    setLoading(true);
    const delta = calcScoreChange();
    const newScore = Math.min(100, Math.max(0, previousScore + delta));
    const newTrajectory = delta > 5 ? 'Worsening' : delta < 0 ? 'Improving' : 'Stable';
    const status = newScore >= 65 ? 'Red' : newScore >= 35 ? 'Yellow' : 'Green';
    
    setScoreChange(delta);

    const checkinRecord = {
      sentiment,
      notes,
      checks: Object.keys(checks).filter(k => checks[k]),
      scoreAtTime: previousScore,
      newScore,
      timestamp: Date.now(),
    };

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        score: newScore,
        status,
        trajectory: newTrajectory,
        lastUpdated: serverTimestamp(),
        checkins: arrayUnion(checkinRecord)
      });

      fb.logActivity('CHECKIN', `${farmerName} performed periodic DPI audit. New Score: ${newScore}`);
      
      // Local sync
      const updated = { ...currentUser, score: newScore, status, trajectory: newTrajectory };
      localStorage.setItem('krishimanas_auth_farmer', JSON.stringify(updated));

      setLoading(false);
      setSubmitted(true);

      const msg = lang === 'kn'
        ? `ಧನ್ಯವಾದ, ${farmerName}. ನಿಮ್ಮ ಮಾಹಿತಿ ದಾಖಲಾಗಿದೆ.`
        : `Audit successful, ${farmerName}. Systems recalibrated.`;
      speak(msg);
    } catch (e) {
      console.error("Checkin Error", e);
      setLoading(false);
    }
  };

  const delta = calcScoreChange();

  if (submitted) {
    const newScore = Math.min(100, Math.max(0, previousScore + scoreChange));
    const improved = scoreChange <= 0;
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center px-6 font-sans">
        <div className="bg-[#0f172a]/50 border border-white/5 rounded-[3rem] p-12 max-w-lg w-full text-center backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
          <div className="absolute -right-8 -top-8 text-teal-500 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-all duration-1000">
             <CheckCircle size={300} />
          </div>

          <div className="relative z-10">
            <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl ${improved ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
              {improved ? <CheckCircle size={48} /> : <AlertCircle size={48} />}
            </div>
            
            <h2 className="text-4xl font-black text-white tracking-tighter mb-2">
              {lang === 'kn' ? 'ಚೆಕ್-ಇನ್ ಪೂರ್ಣ!' : 'Audit Finalized'}
            </h2>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-10">Telemetry Synchronization Complete</p>

            <div className={`rounded-[2rem] p-8 mb-10 border-2 ${improved ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Recalibrated Score Index</div>
              <div className="flex items-center justify-center gap-6">
                <span className="text-4xl font-black text-slate-600 tabular-nums">{previousScore}</span>
                <div className="h-[2px] w-12 bg-white/5" />
                <span className={`text-6xl font-black tabular-nums ${newScore >= 65 ? 'text-red-500' : newScore >= 35 ? 'text-yellow-500' : 'text-emerald-500'}`}>
                  {newScore}
                </span>
              </div>
              <div className={`text-[11px] mt-6 font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full inline-block ${improved ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                {improved ? 'Positive Deviation' : 'Critical Escalation Flagged'}
              </div>
            </div>

            <button
              onClick={() => navigate('/farmer/dashboard')}
              className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] bg-white text-[#020617] hover:bg-teal-500 transition-all shadow-xl"
            >
              Return to Grid
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-teal-500/20 overflow-x-hidden">
      <nav className="h-16 border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-[1000]">
        <div className="flex items-center gap-4">
           <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all">
             <ArrowLeft size={20} />
           </button>
           <h1 className="text-xl font-black text-teal-500 tracking-tighter">KrishiManas <span className="text-slate-600 font-bold ml-2 opacity-50">// DPI Audit</span></h1>
        </div>
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-lg">Sector Node: {lang === 'kn' ? 'ಚೆಕ್-ಇನ್' : 'Assessment'}</div>
      </nav>

      <div className="max-w-xl mx-auto mt-12 px-6 pb-20">
        <div className="bg-[#0f172a] rounded-[2.5rem] p-10 border border-white/5 shadow-2xl space-y-12">
           
           <div className="space-y-2">
              <div className="text-[10px] font-black text-teal-500 uppercase tracking-[0.3em]">Session Initiation</div>
              <h2 className="text-4xl font-black text-white tracking-tighter">
                {lang === 'kn' ? `${farmerName} ಅವರೇ, ನಮಸ್ಕಾರ` : `Namaste, ${farmerName}`}
              </h2>
              <p className="text-slate-500 font-bold text-sm italic opacity-80 leading-relaxed">
                 {lang === 'kn'
                   ? 'ಇಂದು ನೀವು ಹೇಗಿದ್ದೀರಿ? ದಯವಿಟ್ಟು ಒಂದು ಉತ್ತರ ಆಯ್ಕೆ ಮಾಡಿ.'
                   : 'Please provide current sentiment metrics for regional analysis. System will adjust match criteria based on your input.'}
              </p>
           </div>

           {/* Sentiment Matrix */}
           <div className="space-y-4">
             {SENTIMENTS.map(s => (
               <button
                 key={s.key}
                 onClick={() => setSentiment(s.key)}
                 className={`w-full p-6 rounded-[2rem] border-2 text-left flex items-center justify-between transition-all duration-500 ${
                   sentiment === s.key ? s.activeColor : `${s.color} hover:border-white/20`
                 }`}
               >
                 <div className="flex items-center gap-6">
                    <span className="text-4xl filter grayscale group-hover:grayscale-0">{s.emoji}</span>
                    <div className="font-black text-sm uppercase tracking-widest">{lang === 'kn' ? s.labelKn : s.labelEn}</div>
                 </div>
                 <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${sentiment === s.key ? 'bg-white/20 border-white/40' : 'border-white/5'}`}>
                    {sentiment === s.key && <CheckCircle size={16} />}
                 </div>
               </button>
             ))}
           </div>

           {/* Event Log Configuration */}
           <div className="space-y-6 pt-6 border-t border-white/5">
             <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Recent Anomaly Detection</div>
             <div className="grid gap-3">
               {QUICK_CHECKS.map(c => (
                 <button 
                  key={c.id} 
                  onClick={() => toggleCheck(c.id)}
                  className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${
                   checks[c.id] ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10'
                  }`}
                 >
                   <span className="text-[11px] font-black uppercase tracking-widest">{lang === 'kn' ? c.labelKn : c.labelEn}</span>
                   <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${checks[c.id] ? 'bg-red-500 border-red-500' : 'border-white/10'}`}>
                      {checks[c.id] && <CheckCircle size={12} className="text-white" />}
                   </div>
                 </button>
               ))}
             </div>
           </div>

            <VoiceInput
              label={lang === 'kn' ? "ಗುಣಾತ್ಮಕ ವಿವರಣೆ (ಐಚ್ಛಿಕ)" : "Qualitative Narrative (Optional)"}
              type="textarea"
              value={notes}
              onChange={setNotes}
              placeholder={lang === 'kn' ? 'ಇಲ್ಲಿ ಬರೆಯಿರಿ ಅಥವಾ ಧ್ವನಿ ಬಳಸಿ...' : 'Audio transcription or manual input...'}
              className="w-full"
            />

           {/* Live Forecast */}
           {sentiment && (
             <div className={`rounded-[2rem] p-8 border-2 flex items-center justify-between animate-in fade-in slide-in-from-bottom-4 duration-500 ${
               delta > 0 ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
             }`}>
               <div>
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Impact Forecast</div>
                  <div className="text-sm font-black uppercase tracking-tighter">{delta > 0 ? 'Escalation Detected' : 'Correction In Progress'}</div>
               </div>
               <div className="text-4xl font-black tabular-nums">
                 {delta > 0 ? `+${delta}` : delta} <span className="text-xs uppercase tracking-tighter opacity-40">pts</span>
               </div>
             </div>
           )}

           {/* Action Execution */}
           <button
             onClick={handleSubmit}
             disabled={!sentiment || loading}
             className={`w-full py-6 rounded-3xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all shadow-2xl ${
               sentiment
                 ? 'bg-teal-500 text-[#020617] hover:bg-teal-400 shadow-teal-500/20 hover:scale-[1.02] active:scale-95'
                 : 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5'
             }`}
           >
             {loading
               ? <Loader2 className="animate-spin" size={24} />
               : (lang === 'kn' ? 'ಸಲ್ಲಿಸಿ' : 'Execute Audit Submission')}
           </button>
        </div>
      </div>
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay">
         <svg className="w-full h-full"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" /></filter><rect width="100%" height="100%" filter="url(#noise)" /></svg>
      </div>

    </div>
  );
}
