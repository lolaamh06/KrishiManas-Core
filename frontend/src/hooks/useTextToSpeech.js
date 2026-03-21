export function useTextToSpeech() {
  const speak = (text, lang = 'en-IN') => {
    if (!window.speechSynthesis) {
      console.warn("Speech Synthesis not supported in this browser.");
      return;
    }
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
  };

  return { speak };
}
