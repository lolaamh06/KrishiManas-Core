import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, User, MapPin, CreditCard, Leaf, Calculator, ArrowRight, Loader2, Home, ShieldCheck, CheckCircle } from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech';
import VoiceInput from '../components/shared/VoiceInput';
import { useLang } from '../contexts/LanguageContext';
import { calculateDistressScore } from '../utils/scoring';
import { useAuth } from '../contexts/AuthContext';
import { db, fb, doc, updateDoc, serverTimestamp } from '../utils/firebase';

const TALUKS = ['Hassan', 'Alur', 'Sakleshpur', 'Arsikere', 'Belur', 'Channarayapatna', 'Holenarasipur', 'Arakalagudu'];

// Global VoiceInput component now used from shared components

export default function FarmerOnboarding() {
  const { lang, t } = useLang();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '', village: '', taluk: 'Hassan', aadhaar: '',
    crop: '', cropOutcome: 'Good', landSize: '',
    loanDaysOverdue: 0, marketActivity: 'Active',
    scoreOffset: 0
  });

  const handleVoiceInput = (field, result) => {
    const text = result.toLowerCase();
    
    if (text.includes('ಬೆಳೆ ಹಾಳಾಯಿತು') || text.includes('crop failed') || text.includes('failed')) {
      setFormData(prev => ({ ...prev, cropOutcome: 'Failed' }));
    }
    else if (text.includes('ಸಾಲ') || text.includes('loan')) {
      if (text.includes('overdue')) setFormData(prev => ({ ...prev, loanDaysOverdue: 60 }));
      document.getElementById('loanDaysOverdue')?.focus();
    }
    else {
      let val = text;
      if (field === 'landSize' || field === 'loanDaysOverdue' || field === 'aadhaar') {
        const numbers = text.match(/\d+(\.\d+)?/g);
        if (numbers) val = numbers.join('');
      }
      setFormData(prev => ({ ...prev, [field]: val }));
    }
  };

  const loadDemo = () => {
    // Force refresh
    setFormData({
      name: 'Ramesh Kumar', village: 'Alur HQ', taluk: 'Alur', aadhaar: '1234 5678 9012',
      crop: 'Paddy', cropOutcome: 'Failed', landSize: '2.5',
      loanDaysOverdue: 60, marketActivity: 'Inactive', scoreOffset: 8
    });
    setStep(3);
  };

  const submitForm = async () => {
    if (!currentUser?.uid) return;
    setLoading(true);
    try {
      const score = calculateDistressScore(formData);
      const status = score >= 65 ? 'Red' : score >= 35 ? 'Yellow' : 'Green';
      
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        ...formData,
        score,
        status,
        hasOnboarded: true,
        roles: ['farmer'],
        assignedMitraId: null,
        lastUpdated: serverTimestamp()
      });

      fb.logActivity('REGISTER', `${formData.name} completed onboarding from ${formData.taluk} sector.`);
      
      const updated = { ...currentUser, ...formData, score, status, hasOnboarded: true };
      localStorage.setItem('krishimanas_auth_farmer', JSON.stringify(updated));
      
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/farmer/dashboard');
      }, 2000);
    } catch (e) {
      console.error("Submission failed", e);
      setLoading(false);
    }
  };

  const currentScore = calculateDistressScore(formData);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-teal-500/20 overflow-x-hidden">
      <nav className="h-16 border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-[1000]">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-teal-500 font-black text-2xl tracking-tighter transition-all hover:opacity-80">
          <Home size={22} /> KrishiManas
        </button>
        <button onClick={loadDemo} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
          Simulation Mode
        </button>
      </nav>

      <div className="max-w-xl mx-auto mt-12 px-6 pb-20">
        <div className="text-center mb-12">
           <h1 className="text-5xl font-black text-white tracking-tighter mb-2">Initialize Deployment</h1>
           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Phase {step} // Data Acquisition</p>
        </div>

        {/* Progress Matrix */}
        <div className="flex justify-between mb-12 relative px-4">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -z-10"></div>
          <div className="absolute top-1/2 left-0 h-[1px] bg-teal-500 shadow-[0_0_8px_#14b8a6] -z-10 transition-all duration-700" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
          {[1, 2, 3].map(s => (
            <div key={s} className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-500 ${step >= s ? 'bg-teal-500 text-[#020617] shadow-xl shadow-teal-500/20' : 'bg-[#0f172a] border border-white/10 text-slate-600'}`}>
              {s}
            </div>
          ))}
        </div>

        <div className="bg-[#0f172a]/50 border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
          <div className="absolute -right-8 -top-8 text-teal-500 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-1000">
             {step === 1 ? <User size={240} /> : step === 2 ? <Leaf size={240} /> : <Calculator size={240} />}
          </div>

          <div className="relative z-10">
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <h2 className="text-3xl font-black text-white mb-8 tracking-tighter flex items-center gap-3">
                   <div className="p-2 bg-teal-500/10 text-teal-500 rounded-xl"><User size={20} /></div>
                   Personal Identity
                </h2>
                <VoiceInput label="Full Name" field="name" value={formData.name} onChange={v => setFormData({...formData, name: v})} onResult={res => handleVoiceInput('name', res)} lang={lang === 'kn' ? 'kn-IN' : 'en-IN'} />
                
                <div className="mb-6">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 border-l-2 border-teal-500 pl-2 ml-1">Operational Taluk</label>
                  <select 
                    value={formData.taluk} onChange={e => setFormData({...formData, taluk: e.target.value})}
                    className="w-full bg-[#0f172a] border border-white/5 rounded-2xl p-4 text-white font-bold focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500/40 transition-all outline-none appearance-none"
                  >
                    {TALUKS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                
                <VoiceInput 
                  label={t('phone')} type="number" value={formData.phone} 
                  onChange={(val) => setFormData({...formData, phone: val})}
                />
                <VoiceInput 
                  label="Village Unit" value={formData.village} 
                  onChange={(val) => setFormData({...formData, village: val})}
                />
                
                <button 
                  onClick={() => setStep(2)}
                  className="w-full mt-8 bg-teal-500 text-[#020617] py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex justify-center items-center gap-3 hover:bg-teal-400 shadow-xl shadow-teal-500/10 transition-all hover:scale-[1.02] active:scale-95"
                >
                  Continue <ArrowRight size={18} />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <h2 className="text-3xl font-black text-white mb-8 tracking-tighter flex items-center gap-3">
                   <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl"><Leaf size={20} /></div>
                   Agrarian Metrics
                </h2>
                <VoiceInput 
                  label={t('aadhaar')} type="number" value={formData.aadhaar} 
                  onChange={(val) => setFormData({...formData, aadhaar: val})}
                />
                <VoiceInput 
                  label="Primary Crop Segment" value={formData.crop} 
                  onChange={(val) => setFormData({...formData, crop: val})}
                />
                <VoiceInput 
                  label={t('landsize')} type="number" value={formData.landSize} 
                  onChange={(val) => setFormData({...formData, landSize: val})}
                />
                
                <div className="mb-10">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 border-l-2 border-emerald-500 pl-2 ml-1">Last Harvest Outcome</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Good', 'Partial', 'Failed'].map(opt => (
                      <button
                        key={opt}
                        onClick={() => setFormData({...formData, cropOutcome: opt})}
                        className={`py-3 rounded-xl font-black text-[10px] uppercase tracking-widest border-2 transition-all ${formData.cropOutcome === opt ? (opt === 'Failed' ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-teal-500 border-teal-500 text-[#020617]') : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/20'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button onClick={() => setStep(1)} className="w-1/3 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border-2 border-white/10 text-slate-400 hover:bg-white/5 transition-all">Back</button>
                  <button onClick={() => setStep(3)} className="w-2/3 bg-teal-500 text-[#020617] py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex justify-center items-center gap-3 hover:bg-teal-400 shadow-xl shadow-teal-500/10">Next Phase <ArrowRight size={18} /></button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <h2 className="text-3xl font-black text-white mb-8 tracking-tighter flex items-center gap-3">
                   <div className="p-2 bg-yellow-500/10 text-yellow-500 rounded-xl"><Calculator size={20} /></div>
                   Intelligence Synthesis
                </h2>
                
                <VoiceInput label="Loan Days Overdue Index" field="loanDaysOverdue" type="number" value={formData.loanDaysOverdue} onChange={v => setFormData({...formData, loanDaysOverdue: v})} onResult={res => handleVoiceInput('loanDaysOverdue', res)} lang={lang === 'kn' ? 'kn-IN' : 'en-IN'} />
                
                <div className="mb-10">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 border-l-2 border-yellow-500 pl-2 ml-1">Market Engagement Level</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Active', 'Low', 'Inactive'].map(opt => (
                      <button
                        key={opt}
                        onClick={() => setFormData({...formData, marketActivity: opt})}
                        className={`py-3 rounded-xl font-black text-[10px] uppercase tracking-widest border-2 transition-all ${formData.marketActivity === opt ? 'bg-yellow-500 border-yellow-500 text-[#020617] shadow-lg shadow-yellow-500/20' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/20'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* LIVE PREDICTIVE SCORE */}
                <div className={`mt-10 p-6 rounded-[2rem] border-2 flex items-center justify-between transition-all duration-500 ${currentScore >= 65 ? 'bg-red-500/10 border-red-500 shadow-lg shadow-red-500/10' : currentScore >= 35 ? 'bg-yellow-500/10 border-yellow-500' : 'bg-emerald-500/10 border-emerald-500'}`}>
                  <div className="flex items-center gap-4">
                    <div className={currentScore >= 65 ? 'text-red-500 animate-pulse' : 'text-slate-400'}><Calculator size={32} /></div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Predictive Distress Score</div>
                      <div className={`text-4xl font-black tracking-tighter leading-none ${currentScore >= 65 ? 'text-red-500' : currentScore >= 35 ? 'text-yellow-500' : 'text-emerald-500'}`}>{currentScore} <span className="text-xs uppercase tracking-tighter opacity-40">/ 100</span></div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button onClick={() => setStep(2)} className="w-1/3 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border-2 border-white/10 text-slate-400 hover:bg-white/5 transition-all">Back</button>
                  <button 
                    onClick={submitForm}
                    disabled={loading || showSuccess}
                    className="w-2/3 bg-teal-500 text-[#020617] py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex justify-center items-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-teal-500/20 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
                    {loading ? 'Initializing Protocol...' : 'Finalize Deployment'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Deployment Success Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#020617]/95 backdrop-blur-2xl animate-in fade-in duration-500">
           <div className="text-center space-y-6">
              <div className="w-24 h-24 bg-teal-500/10 border border-teal-500/30 rounded-full flex items-center justify-center mx-auto animate-bounce">
                 <CheckCircle className="text-teal-500" size={48} />
              </div>
              <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Deployment Successful</h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Syncing Telemetry with Regional Hub...</p>
           </div>
        </div>
      )}
    </div>
  );
}
