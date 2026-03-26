import React from 'react';
import { Mic } from 'lucide-react';
import { useSpeech } from '../../hooks/useSpeech';
import { useLang } from '../../contexts/LanguageContext';

/**
 * Universal Voice-Enhanced Input Component
 * Supports real-time Speech-to-Text (STT) for text, numbers, and textareas.
 */
const VoiceInput = ({ 
  label, 
  value, 
  onChange, 
  type = "text", 
  placeholder = "", 
  required = false,
  className = "",
  icon: Icon,
  disabled = false
}) => {
  const { lang } = useLang();
  
  // Map internal lang code to Web Speech API lang codes
  const sttLang = lang === 'en' ? 'en-IN' : 'kn-IN';

  const { isListening, startListening } = useSpeech((result) => {
    // If it's a number field, extract only digits (e.g. for phone/Aadhaar)
    if (type === 'number') {
      const cleaned = result.replace(/[^0-9]/g, '');
      onChange(cleaned);
    } else {
      // For text/textarea, append or replace? Usually replaces for simplicity in forms
      onChange(result);
    }
  });

  const InputComponent = type === 'textarea' ? 'textarea' : 'input';

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1 mb-1 block">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <Icon 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-500 transition-colors pointer-events-none" 
            size={18} 
          />
        )}
        <InputComponent
          required={required}
          disabled={disabled}
          type={type === 'textarea' || type === 'number' ? 'text' : type} // 'number' inputs behave better as text with regex cleaning for STT
          inputMode={type === 'number' ? 'numeric' : 'text'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`
            w-full bg-white/5 border border-white/10 rounded-2xl py-4 pr-14 text-white font-bold placeholder-slate-600 
            focus:outline-none focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/10 transition-all
            ${Icon ? 'pl-11' : 'pl-5'}
            ${type === 'textarea' ? 'min-h-[120px] resize-none' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        />
        <button 
          type="button" 
          onClick={() => startListening(sttLang)}
          disabled={disabled}
          title={isListening ? "Listening..." : "Speak Input"}
          className={`
            absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-xl transition-all z-10
            ${isListening 
              ? 'bg-red-500 text-white animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.4)]' 
              : 'bg-white/5 text-slate-500 hover:text-teal-500 hover:bg-white/10'
            }
          `}
        >
          <Mic size={18} />
        </button>
      </div>
    </div>
  );
};

export default VoiceInput;
