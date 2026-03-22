import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, User, MapPin, CreditCard, Leaf, Calculator, ArrowRight, Loader2 } from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech';
import { useLang } from '../contexts/LanguageContext';
import { calculateDistressScore } from '../utils/scoring';

const TALUKS = ['Hassan', 'Alur', 'Sakleshpur', 'Arsikere', 'Belur', 'Channarayapatna', 'Holenarasipur', 'Arakalagudu'];

const VoiceInput = ({ label, field, value, onChange, onResult, lang, type="text" }) => {
  const { isListening, startListening } = useSpeech(onResult);
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative flex items-center">
        <input 
          id={field} type={type} value={value} onChange={(e) => onChange(e.target.value)}
          className="w-full border-gray-300 rounded-md shadow-sm p-3 pr-12 border focus:ring-teal-primary focus:border-teal-primary"
        />
        <button 
          type="button" onClick={() => startListening(lang)}
          className={`absolute right-2 p-2 rounded-full ${isListening ? 'bg-system-red text-white animate-pulse' : 'text-gray-400 hover:text-teal-primary'}`}
        >
          <Mic size={20} />
        </button>
      </div>
    </div>
  );
};

export default function FarmerOnboarding() {
  const { lang, t } = useLang();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', village: '', taluk: 'Hassan', aadhaar: '',
    crop: '', cropOutcome: 'Good', landSize: '',
    loanDaysOverdue: 0, marketActivity: 'Active',
    scoreOffset: 0
  });

  const handleVoiceInput = (field, result) => {
    const text = result.toLowerCase();
    console.log("Voice recognized:", text);
    
    // Voice rules
    if (text.includes('ಬೆಳೆ ಹಾಳಾಯಿತು') || text.includes('crop failed') || text.includes('failed')) {
      setFormData(prev => ({ ...prev, cropOutcome: 'Failed' }));
    }
    else if (text.includes('ಸಾಲ') || text.includes('loan')) {
      // Just highlight or set a flag, since we can't easily parse digits reliably without an LLM
      // We will set overdue to 60 as a demo interaction if they just say "loan overdue"
      if (text.includes('overdue')) setFormData(prev => ({ ...prev, loanDaysOverdue: 60 }));
      document.getElementById('loanDaysOverdue')?.focus();
    }
    else {
      // Auto fill the actively passed field
      let val = text;
      if (field === 'landSize' || field === 'loanDaysOverdue' || field === 'aadhaar') {
        const numbers = text.match(/\d+(\.\d+)?/g);
        if (numbers) val = numbers.join('');
      }
      setFormData(prev => ({ ...prev, [field]: val }));
    }
  };

  const { isListening, startListening } = useSpeech();

  const loadDemo = () => {
    setFormData({
      name: 'Ramesh Kumar', village: 'Alur HQ', taluk: 'Alur', aadhaar: '1234 5678 9012',
      crop: 'Paddy', cropOutcome: 'Failed', landSize: '2.5',
      loanDaysOverdue: 60, marketActivity: 'Inactive', scoreOffset: 8
    });
    setStep(3);
  };

  const submitForm = async () => {
    setLoading(true);
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/farmers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      localStorage.setItem('krishimanas_farmer', JSON.stringify(data));
      navigate('/farmer/dashboard');
    } catch (e) {
      console.warn("Backend unavailable, using local fallback");
      const score = calculateDistressScore(formData);
      
      const mockSchemes = [
        { id: 'sc1', name: 'Raitha Siri', benefit: '₹10,000 / hectare', eligibilityReason: 'Crop failed and loan overdue', eligibilityReasonKannada: 'ಬೆಳೆ ವಿಫಲವಾಗಿದೆ ಮತ್ತು ಸಾಲ ಬಾಕಿ ಇದೆ', documents: ['Aadhaar', 'Bank Passbook'], deadline: '15 Days' },
        { id: 'sc2', name: 'Parihara', benefit: 'Immediate relief fund', eligibilityReason: 'High distress score in Alur taluk', eligibilityReasonKannada: 'ಆಲೂರು ತಾಲೂಕಿನಲ್ಲಿ ಹೆಚ್ಚಿನ ಸಂಕಷ್ಟ ಅಂಕ', documents: ['RTC / Pahani', 'Aadhaar'], deadline: '7 Days' }
      ];

      const fakeData = {
        farmer: { ...formData, id: 'f_local', score }, score, trajectory: 'Worsening', status: score >= 65 ? 'Red' : 'Yellow',
        schemes: mockSchemes, mitra: { name: "Suresh Naik", assigned: ["Alur"] }
      };
      localStorage.setItem('krishimanas_farmer', JSON.stringify(fakeData));
      navigate('/farmer/dashboard');
    }
  };

  const currentScore = calculateDistressScore(formData);

  return (
    <div className="min-h-screen bg-system-bg pb-12">
      <div className="bg-white shadow-sm sticky top-0 z-50 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-teal-primary">KrishiManas</h1>
        <button onClick={loadDemo} className="px-3 py-1 bg-teal-light text-teal-primary rounded text-sm font-medium">
          Load Demo
        </button>
      </div>

      <div className="max-w-md mx-auto mt-8 px-4">
        {/* Progress Bar */}
        <div className="flex justify-between mb-8 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 -translate-y-1/2 rounded"></div>
          <div className={`absolute top-1/2 left-0 h-1 bg-teal-primary -z-10 -translate-y-1/2 rounded transition-all duration-300`} style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
          {[1, 2, 3].map(s => (
            <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= s ? 'bg-teal-primary text-white shadow-md' : 'bg-gray-200 text-gray-500'}`}>
              {s}
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          {step === 1 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-navy mb-6 flex items-center gap-2">
                <User className="text-teal-primary" /> Personal Details
              </h2>
              <VoiceInput label="Full Name" field="name" value={formData.name} onChange={v => setFormData({...formData, name: v})} onResult={res => handleVoiceInput('name', res)} lang={lang === 'kn' ? 'kn-IN' : 'en-IN'} />
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Taluk</label>
                <select 
                  value={formData.taluk} onChange={e => setFormData({...formData, taluk: e.target.value})}
                  className="w-full border-gray-300 rounded-md shadow-sm p-3 border focus:ring-teal-primary focus:border-teal-primary"
                >
                  {TALUKS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <VoiceInput label="Village Name" field="village" value={formData.village} onChange={v => setFormData({...formData, village: v})} onResult={res => handleVoiceInput('village', res)} lang={lang === 'kn' ? 'kn-IN' : 'en-IN'} />
              <VoiceInput label="Aadhaar ID" field="aadhaar" type="tel" value={formData.aadhaar} onChange={v => setFormData({...formData, aadhaar: v})} onResult={res => handleVoiceInput('aadhaar', res)} lang={lang === 'kn' ? 'kn-IN' : 'en-IN'} />
              
              <button 
                onClick={() => setStep(2)}
                className="w-full mt-6 bg-teal-primary text-white py-3 rounded-lg font-bold flex justify-center items-center gap-2 hover:bg-teal-700 transition"
              >
                Next <ArrowRight size={18} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-navy mb-6 flex items-center gap-2">
                <Leaf className="text-system-green" /> Farm Details
              </h2>
              <VoiceInput label="Crop Grown" field="crop" value={formData.crop} onChange={v => setFormData({...formData, crop: v})} onResult={res => handleVoiceInput('crop', res)} lang={lang === 'kn' ? 'kn-IN' : 'en-IN'} />
              <VoiceInput label="Land Size (Acres)" field="landSize" type="number" value={formData.landSize} onChange={v => setFormData({...formData, landSize: v})} onResult={res => handleVoiceInput('landSize', res)} lang={lang === 'kn' ? 'kn-IN' : 'en-IN'} />
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 border-b pb-1">Last Season Outcome</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Good', 'Partial', 'Failed'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => setFormData({...formData, cropOutcome: opt})}
                      className={`py-2 rounded-md font-medium text-sm border transition ${formData.cropOutcome === opt ? (opt === 'Failed' ? 'bg-system-red text-white border-system-red' : 'bg-teal-primary text-white border-teal-primary') : 'bg-gray-50 text-gray-600 border-gray-200'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={() => setStep(1)} className="w-1/3 py-3 rounded-lg font-bold border border-gray-300 text-gray-600 hover:bg-gray-50">Back</button>
                <button onClick={() => setStep(3)} className="w-2/3 bg-teal-primary text-white py-3 rounded-lg font-bold flex justify-center items-center gap-2 hover:bg-teal-700">Next <ArrowRight size={18} /></button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-navy mb-4 flex items-center gap-2">
                <CreditCard className="text-system-yellow" /> Financial Status
              </h2>
              
              <VoiceInput label="Loan Days Overdue" field="loanDaysOverdue" type="number" value={formData.loanDaysOverdue} onChange={v => setFormData({...formData, loanDaysOverdue: v})} onResult={res => handleVoiceInput('loanDaysOverdue', res)} lang={lang === 'kn' ? 'kn-IN' : 'en-IN'} />
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 border-b pb-1">Market Activity</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Active', 'Low', 'Inactive'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => setFormData({...formData, marketActivity: opt})}
                      className={`py-2 rounded-md font-medium text-sm border transition ${formData.marketActivity === opt ? 'bg-navy text-white border-navy' : 'bg-gray-50 text-gray-600 border-gray-200'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* LIVE SCORE PREVIEW */}
              <div className={`mt-6 p-4 rounded-lg border-2 flex items-center justify-between ${currentScore >= 65 ? 'bg-system-red/10 border-system-red' : currentScore >= 35 ? 'bg-system-yellow/10 border-system-yellow' : 'bg-system-green/10 border-system-green'}`}>
                <div className="flex items-center gap-3">
                  <Calculator className={currentScore >= 65 ? 'text-system-red animate-pulse' : 'text-gray-600'} />
                  <div>
                    <div className="text-sm font-bold text-gray-600 uppercase tracking-wide">Live Distress Score</div>
                    <div className={`text-2xl font-black ${currentScore >= 65 ? 'text-system-red' : currentScore >= 35 ? 'text-system-yellow' : 'text-system-green'}`}>{currentScore} / 100</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={() => setStep(2)} className="w-1/3 py-3 rounded-lg font-bold border border-gray-300 text-gray-600 hover:bg-gray-50">Back</button>
                <button 
                  onClick={submitForm}
                  disabled={loading}
                  className="w-2/3 bg-system-red text-white py-3 rounded-lg font-bold flex justify-center items-center gap-2 hover:bg-red-700 shadow-lg shadow-red-200"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : 'Submit & Check'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
