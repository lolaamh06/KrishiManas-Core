import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Globe, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { useLang } from '../../contexts/LanguageContext';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';

/**
 * Global Accessibility Controls
 * Persistent floating component for Language Toggle and Audio Synthesis (Read Aloud).
 */
const GlobalControls = () => {
  const { lang, toggleLanguage, t } = useLang();
  const { speak } = useTextToSpeech();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const location = useLocation();

  // Helper to extract text from the page
  const handleReadAloud = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    
    // Determine the required script based on the current app route
    let scriptKey = 'audio_guide_default';
    const path = location.pathname;
    
    if (path === '/') scriptKey = 'audio_guide_landing';
    else if (path.includes('/farmer')) scriptKey = 'audio_guide_farmer';
    else if (path.includes('/mitra')) scriptKey = 'audio_guide_mitra';
    else if (path.includes('/admin')) scriptKey = 'audio_guide_admin';
    else if (path.includes('/qr')) scriptKey = 'audio_guide_qr';

    const fullText = t(scriptKey);
    const speechLang = lang === 'en' ? 'en-IN' : 'kn-IN';
    
    // Use the hook's speak function
    speak(fullText, speechLang);

    // Reset UI state when utterance would theoretically finish
    // A robust impl ties into `useTextToSpeech`'s internal `onend` listener.
    const approximateDuration = fullText.length * 60; // rough ms estimate based on length
    setTimeout(() => {
      setIsSpeaking(false);
    }, approximateDuration);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[5000] flex flex-col items-center gap-3">
      {/* Read Aloud Button */}
      <button
        onClick={handleReadAloud}
        title={lang === 'en' ? "Read Aloud" : "ಓದಿ ಹೇಳು"}
        className={`
          group relative flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-500
          backdrop-blur-xl border-2
          ${isSpeaking 
            ? 'bg-teal-500 border-teal-400 text-[#020617] shadow-[0_0_20px_rgba(20,184,166,0.5)] animate-pulse' 
            : 'bg-[#0f172a]/80 border-white/10 text-teal-500 hover:border-teal-500/50 hover:bg-[#162036]'
          }
        `}
      >
        {isSpeaking ? <VolumeX size={24} /> : <Volume2 size={24} />}
        
        {/* Tooltip */}
        <span className="absolute right-full mr-4 px-3 py-1.5 bg-[#0f172a] border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-white opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap">
          {isSpeaking ? (lang === 'en' ? "Stop Reading" : "ನಿಲ್ಲಿಸು") : (lang === 'en' ? "Read Aloud" : "ಓದಿ ಹೇಳು")}
        </span>
      </button>

      {/* Language Toggle Button */}
      <button
        onClick={toggleLanguage}
        title={lang === 'en' ? "Switch to Kannada" : "English ಗೆ ಬದಲಿಸಿ"}
        className="
          group relative flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-500
          backdrop-blur-xl bg-[#0f172a]/80 border-2 border-white/10 text-white
          hover:border-teal-500/50 hover:bg-[#162036] shadow-xl
        "
      >
        <div className="flex flex-col items-center justify-center">
          <Globe size={18} className="text-teal-500 mb-0.5" />
          <span className="text-[8px] font-black uppercase tracking-tighter">
            {lang === 'en' ? 'KN' : 'EN'}
          </span>
        </div>

        {/* Tooltip */}
        <span className="absolute right-full mr-4 px-3 py-1.5 bg-[#0f172a] border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-white opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap">
          {lang === 'en' ? "Switch to Kannada" : "Switch to English"}
        </span>
      </button>
    </div>
  );
};

export default GlobalControls;
