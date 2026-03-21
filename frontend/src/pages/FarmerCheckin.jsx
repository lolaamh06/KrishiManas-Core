import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, CheckCircle, AlertCircle, ArrowLeft, Loader2, Volume2 } from 'lucide-react';
import { useLang } from '../contexts/LanguageContext';
import { useSpeech } from '../hooks/useSpeech';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

const SENTIMENTS = [
  {
    key: 'good',
    emoji: '😊',
    labelEn: 'I am doing well',
    labelKn: 'ನಾನು ಚೆನ್ನಾಗಿದ್ದೇನೆ',
    color: 'border-system-green bg-system-green/10',
    activeColor: 'border-system-green bg-system-green text-white',
    scoreEffect: -5,
  },
  {
    key: 'okay',
    emoji: '😐',
    labelEn: 'Managing, but worried',
    labelKn: 'ನಿಭಾಯಿಸುತ್ತಿದ್ದೇನೆ, ಆದರೆ ಚಿಂತೆ ಇದೆ',
    color: 'border-system-yellow bg-system-yellow/10',
    activeColor: 'border-system-yellow bg-system-yellow text-white',
    scoreEffect: 5,
  },
  {
    key: 'bad',
    emoji: '😟',
    labelEn: 'Struggling badly',
    labelKn: 'ತುಂಬಾ ಕಷ್ಟ ಆಗ್ತಿದೆ',
    color: 'border-system-red bg-system-red/10',
    activeColor: 'border-system-red bg-system-red text-white',
    scoreEffect: 15,
  },
];

const QUICK_CHECKS = [
  { id: 'loan', labelEn: 'Received a loan notice', labelKn: 'ಸಾಲದ ನೋಟಿಸ್ ಬಂತು', weight: 10 },
  { id: 'crop', labelEn: 'Crop facing new problem', labelKn: 'ಬೆಳೆಗೆ ಹೊಸ ಸಮಸ್ಯೆ', weight: 12 },
  { id: 'weather', labelEn: 'Unusual weather affecting farm', labelKn: 'ಅಸಾಮಾನ್ಯ ಹವಾಮಾನ ಪ್ರಭಾವ', weight: 8 },
  { id: 'family', labelEn: 'Family health issue', labelKn: 'ಕುಟುಂಬ ಆರೋಗ್ಯ ಸಮಸ್ಯೆ', weight: 6 },
];

export default function FarmerCheckin() {
  const { lang } = useLang();
  const navigate = useNavigate();
  const { speak } = useTextToSpeech();
  const [sentiment, setSentiment] = useState(null);
  const [notes, setNotes] = useState('');
  const [checks, setChecks] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scoreChange, setScoreChange] = useState(0);

  const { isListening, startListening } = useSpeech((text) => {
    setNotes(prev => prev ? prev + ' ' + text : text);
  });

  const previousData = (() => {
    try {
      return JSON.parse(localStorage.getItem('krishimanas_farmer') || '{}');
    } catch { return {}; }
  })();

  const farmerName = previousData?.farmer?.name || previousData?.name || 'Farmer';
  const previousScore = previousData?.score ?? previousData?.farmer?.score ?? 50;

  const toggleCheck = (id, weight) => {
    setChecks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const calcScoreChange = () => {
    if (!sentiment) return 0;
    const base = SENTIMENTS.find(s => s.key === sentiment)?.scoreEffect || 0;
    const checkScore = QUICK_CHECKS.reduce((sum, c) => sum + (checks[c.id] ? c.weight : 0), 0);
    return base + checkScore;
  };

  const handleSubmit = async () => {
    if (!sentiment) return;
    setLoading(true);
    const delta = calcScoreChange();
    const newScore = Math.min(100, Math.max(0, previousScore + delta));
    const newTrajectory = delta > 5 ? 'Worsening' : delta < 0 ? 'Improving' : 'Stable';
    setScoreChange(delta);

    const checkinData = {
      farmerId: previousData?.farmer?.id || 'f_local',
      sentiment,
      notes,
      checks,
      scoreAtCheckin: previousScore,
      newScore,
      timestamp: new Date().toISOString(),
    };

    // Try to POST the check-in to the backend
    try {
      await fetch(import.meta.env.VITE_API_URL + '/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkinData),
      });
    } catch {
      console.warn('Backend unavailable — saving check-in locally');
    }

    // Deep-copy and update score + trajectory so Dashboard always picks up fresh values
    const updatedData = JSON.parse(JSON.stringify(previousData));
    updatedData.score = newScore;
    updatedData.trajectory = newTrajectory;
    if (updatedData.farmer) {
      updatedData.farmer.score = newScore;
      updatedData.farmer.trajectory = newTrajectory;
    }
    localStorage.setItem('krishimanas_farmer', JSON.stringify(updatedData));
    
    // Broadcast specialized event for cross-portal sync
    const syncEvent = {
      type: 'SCORE_UPDATE',
      farmerId: updatedData.farmer?.id || 'f_local',
      farmerName: updatedData.farmer?.name || 'Farmer',
      newScore: updatedData.score,
      trajectory: updatedData.trajectory,
      timestamp: Date.now()
    };
    localStorage.setItem('krishimanas_last_event', JSON.stringify(syncEvent));
    
    // Fire storage events for both local and cross-tab listeners
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('krishimanas_update', { detail: syncEvent }));

    setLoading(false);
    setSubmitted(true);

    const msg = lang === 'kn'
      ? `ಧನ್ಯವಾದ, ${farmerName}. ನಿಮ್ಮ ಮಾಹಿತಿ ದಾಖಲಾಗಿದೆ.`
      : `Thank you, ${farmerName}. Your check-in has been recorded.`;
    speak(msg);
  };

  const delta = calcScoreChange();

  if (submitted) {
    const newScore = Math.min(100, Math.max(0, previousScore + scoreChange));
    const improved = scoreChange <= 0;
    return (
      <div className="min-h-screen bg-system-bg flex flex-col items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-md p-8 max-w-md w-full text-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${improved ? 'bg-system-green/15' : 'bg-system-red/15'}`}>
            {improved
              ? <CheckCircle className="text-system-green" size={44} />
              : <AlertCircle className="text-system-red" size={44} />}
          </div>
          <h2 className="text-2xl font-bold text-navy mb-2">
            {lang === 'kn' ? 'ಚೆಕ್-ಇನ್ ಪೂರ್ಣ!' : 'Check-in Recorded!'}
          </h2>
          <p className="text-gray-500 mb-6">
            {lang === 'kn'
              ? `ನಿಮ್ಮ ಉತ್ತರಗಳು ದಾಖಲಾಗಿದೆ. ಧನ್ಯವಾದ!`
              : `Your responses have been logged. Thank you!`}
          </p>

          {/* Score Change */}
          <div className={`rounded-xl p-5 mb-6 ${improved ? 'bg-system-green/10 border border-system-green' : 'bg-system-red/10 border border-system-red'}`}>
            <div className="text-sm font-medium text-gray-500 mb-1">
              {lang === 'kn' ? 'ಸಂಕಷ್ಟ ಅಂಕ ಬದಲಾವಣೆ' : 'Distress Score Update'}
            </div>
            <div className="flex items-baseline justify-center gap-3">
              <span className="text-3xl font-black text-gray-400">{previousScore}</span>
              <span className="text-xl text-gray-400">→</span>
              <span className={`text-4xl font-black ${newScore >= 65 ? 'text-system-red' : newScore >= 35 ? 'text-system-yellow' : 'text-system-green'}`}>
                {newScore}
              </span>
            </div>
            <div className={`text-sm mt-2 font-semibold ${improved ? 'text-system-green' : 'text-system-red'}`}>
              {improved
                ? (lang === 'kn' ? 'ನಿಮ್ಮ ಸ್ಥಿತಿ ಸುಧಾರಿಸಿದೆ' : 'Situation improved')
                : (lang === 'kn' ? 'ಹೆಚ್ಚಿದ ಸಂಕಷ್ಟ ಗುರುತಿಸಲಾಗಿದೆ' : 'Increased distress flagged')}
            </div>
          </div>

          {!improved && (
            <div className="bg-navy/5 border border-navy/10 rounded-lg p-4 text-left text-sm text-navy mb-6">
              <span className="font-bold">
                {lang === 'kn' ? 'ಮಿತ್ರ ಸಂಪರ್ಕ ಆಗುತ್ತಾರೆ' : 'Your Mitra will be notified'}
              </span>
              <br />
              {lang === 'kn'
                ? 'ಅವರು ಶೀಘ್ರದಲ್ಲಿ ಸಂಪರ್ಕ ಮಾಡುತ್ತಾರೆ.'
                : 'They will reach out to you soon.'}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => navigate('/farmer/dashboard')}
              className="flex-1 py-3 rounded-lg font-bold bg-teal-primary text-white hover:bg-teal-700 transition"
            >
              {lang === 'kn' ? 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹೋಗಿ' : 'Go to Dashboard'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-system-bg pb-12">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-50 p-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-navy">
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-xl font-bold text-teal-primary">KrishiManas</h1>
        <span className="text-gray-400 text-sm ml-1">
          — {lang === 'kn' ? 'ಚೆಕ್-ಇನ್' : '14-Day Check-in'}
        </span>
      </div>

      <div className="max-w-md mx-auto mt-8 px-4 space-y-6">
        {/* Greeting */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-500 uppercase tracking-wide font-medium mb-1">
            {lang === 'kn' ? '14 ದಿನಗಳ ಚೆಕ್-ಇನ್' : '14-Day Check-in'}
          </p>
          <h2 className="text-2xl font-bold text-navy">
            {lang === 'kn' ? `${farmerName} ಅವರೇ, ನಮಸ್ಕಾರ` : `Hello, ${farmerName}`}
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            {lang === 'kn'
              ? 'ಇಂದು ನೀವು ಹೇಗಿದ್ದೀರಿ? ದಯವಿಟ್ಟು ಒಂದು ಉತ್ತರ ಆಯ್ಕೆ ಮಾಡಿ.'
              : 'How are you doing today? Please select one option.'}
          </p>
        </div>

        {/* Sentiment Selection */}
        <div className="space-y-3">
          {SENTIMENTS.map(s => (
            <button
              key={s.key}
              onClick={() => setSentiment(s.key)}
              className={`w-full p-5 rounded-xl border-2 text-left flex items-center gap-4 transition-all duration-200 font-medium text-lg ${
                sentiment === s.key ? s.activeColor : s.color
              }`}
            >
              <span className="text-3xl">{s.emoji}</span>
              <div>
                <div className="font-bold">{lang === 'kn' ? s.labelKn : s.labelEn}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Quick Checkboxes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-bold text-navy mb-4 text-sm uppercase tracking-wide">
            {lang === 'kn' ? 'ಈ ವಾರ ಏನಾದರೂ ಆಯಿತೇ?' : 'Anything happen this week?'}
          </h3>
          <div className="space-y-3">
            {QUICK_CHECKS.map(c => (
              <label key={c.id} className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  checks[c.id] ? 'bg-system-red border-system-red' : 'border-gray-300 group-hover:border-system-red/50'
                }`}
                  onClick={() => toggleCheck(c.id, c.weight)}
                >
                  {checks[c.id] && <CheckCircle size={14} className="text-white" />}
                </div>
                <span className="text-gray-700" onClick={() => toggleCheck(c.id, c.weight)}>
                  {lang === 'kn' ? c.labelKn : c.labelEn}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Voice Notes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-bold text-navy mb-3 text-sm uppercase tracking-wide">
            {lang === 'kn' ? 'ಯಾವುದಾದರೂ ಹೇಳಲು ಇದೆಯೇ? (ಐಚ್ಛಿಕ)' : 'Anything else to share? (Optional)'}
          </h3>
          <div className="relative">
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              placeholder={lang === 'kn' ? 'ಇಲ್ಲಿ ಬರೆಯಿರಿ...' : 'Type or speak here...'}
              className="w-full border border-gray-200 rounded-lg p-3 pr-12 text-gray-700 resize-none focus:ring-2 focus:ring-teal-primary focus:border-teal-primary outline-none"
            />
            <button
              type="button"
              onClick={() => startListening(lang === 'kn' ? 'kn-IN' : 'en-IN')}
              className={`absolute bottom-3 right-3 p-2 rounded-full transition ${
                isListening ? 'bg-system-red text-white animate-pulse' : 'text-gray-400 hover:text-teal-primary'
              }`}
            >
              <Mic size={20} />
            </button>
          </div>
        </div>

        {/* Live Score Preview */}
        {sentiment && (
          <div className={`rounded-xl p-4 border-2 flex items-center justify-between ${
            delta > 0 ? 'bg-system-red/10 border-system-red' : 'bg-system-green/10 border-system-green'
          }`}>
            <div className="text-sm font-medium text-gray-600">
              {lang === 'kn' ? 'ಅಂದಾಜು ಸ್ಕೋರ್ ಬದಲಾವಣೆ' : 'Estimated score change'}
            </div>
            <div className={`text-2xl font-black ${delta > 0 ? 'text-system-red' : 'text-system-green'}`}>
              {delta > 0 ? `+${delta}` : delta} pts
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!sentiment || loading}
          className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition shadow-md ${
            sentiment
              ? 'bg-teal-primary text-white hover:bg-teal-700 shadow-teal-200'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {loading
            ? <Loader2 className="animate-spin" size={22} />
            : (lang === 'kn' ? 'ಸಲ್ಲಿಸಿ' : 'Submit Check-in')}
        </button>
      </div>
    </div>
  );
}
