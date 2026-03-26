export function useTextToSpeech() {
  const speak = (text, lang = 'en-IN') => {
    if (!window.speechSynthesis) {
      console.warn("Speech Synthesis not supported in this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    
    const voices = window.speechSynthesis.getVoices();
    let voice = voices.find(v => v.lang === lang || v.lang.startsWith(lang.split('-')[0]));
    
    // If a native Kannada voice isn't installed on the OS, default to an Indian English or Hindi phonetic fallback
    // to attempt pronunciation, or at least prevent the TTS engine from immediately aborting.
    if (!voice && lang.startsWith('kn')) {
      voice = voices.find(v => v.lang.includes('hi') || v.name.includes('India'));
    }
    
    if (voice) utterance.voice = voice;
    
    utterance.volume = 1;
    utterance.rate = 0.9; // Slightly slower for better local articulation
    
    window.speechSynthesis.speak(utterance);
  };

  return { speak };
}
