import { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    heroTitle: "Every agri-tech startup is helping farmers grow more.\nKrishiManas helps them survive long enough to grow again.",
    heroStats: ["47 farmer suicides/day", "5.4M Karnataka farmer households", "0 distress detection systems exist", "₹27Cr+ addressable market"],
    visionTitle: "Core Vision",
    visionText: "KrishiManas is a real-time, voice-first agrarian distress detection and intervention system. It is not a farming app, not a scheme portal, not a chatbot. It is an early warning system that continuously monitors farmers, detects when they are heading toward financial and emotional collapse, and automatically triggers help — without waiting for the farmer to ask.",
    portalsTitle: "The 4 Portals",
    farmerPortal: "Farmer Portal",
    adminPortal: "Admin Dashboard",
    mitraPortal: "Krishi Mitra Portal",
    qrPortal: "Yellow Bench QR",
    languageToggle: "ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಿ",
    problemTitle: "The Problem: Three Compounding Shocks",
    prob1T: "1. Crop Failure", prob1D: "Income gone for the entire season. Fixed costs like labour, inputs, loan interest remain.",
    prob2T: "2. Loan Pressure", prob2D: "Bank sends repayment notice in a language the farmer cannot fully understand. Pressure builds.",
    prob3T: "3. Weather Event", prob3D: "Unseasonal rain or drought destroys the backup crop. This is the breaking point.",
    probAlert: "None of these shocks alone is fatal. The combination — with no support system activating in time — is what causes irreversible outcomes.",
    flowTitle: "Cross-Portal Synchronisation",
    flow1: "Farmer submits distress signal → Admin map red pin appears immediately and Mitra receives a flagged case.",
    flow2: "Farmer requests help with a document → Request appears in Mitra's action queue instantly.",
    flow3: "Mitra records a farm visit or phone call → Status banner on the Farmer's device updates live.",
    flow4: "Admin triggers Demo Alert → SMS fires, counters increment, map updates simultaneously.",
    farmerPortalDesc: "Voice-first interface in Kannada and English. Passive continuous monitoring without downloads.",
    adminPortalDesc: "Projector-friendly dark theme. Live district map tracking distress trajectory in real time.",
    mitraPortalDesc: "Field tool for village volunteers resolving alerts and fulfilling document help requests.",
    qrPortalDesc: "Dynamic printable QR codes connecting offline rural distribution to the live backend."
  },
  kn: {
    heroTitle: "ಪ್ರತಿಯೊಂದು ಅಗ್ರಿ-ಟೆಕ್ ಸ್ಟಾರ್ಟಪ್ ರೈತರಿಗೆ ಹೆಚ್ಚು ಬೆಳೆಯಲು ಸಹಾಯ ಮಾಡುತ್ತಿದೆ.\nಕೃಷಿಮನಸ್ ಅವರು ಮತ್ತೆ ಬೆಳೆಯುವಷ್ಟು ಕಾಲ ಬದುಕಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.",
    heroStats: ["ದಿನಕ್ಕೆ 47 ರೈತರ ಆತ್ಮಹತ್ಯೆ", "5.4 ಮಿಲಿಯನ್ ಕರ್ನಾಟಕದ ರೈತ ಕುಟುಂಬಗಳು", "೦ ಸಂಕಷ್ಟ ಪತ್ತೆ ವ್ಯವಸ್ಥೆ", "₹27 ಕೋಟಿ+ ವಿಳಾಸ ಮಾರುಕಟ್ಟೆ"],
    visionTitle: "ಮೂಲ ದೃಷ್ಟಿ",
    visionText: "ಕೃಷಿಮನಸ್ ನೈಜ-ಸಮಯದ, ಧ್ವನಿ-ಮೊದಲ ಕೃಷಿ ಸಂಕಷ್ಟ ಪತ್ತೆ ಮತ್ತು ಮಧ್ಯಸ್ಥಿಕೆ ವ್ಯವಸ್ಥೆಯಾಗಿದೆ. ಇದು ಕೇವಲ ಕೃಷಿ ಅಪ್ಲಿಕೇಶನ್ ಅಲ್ಲ, ಸ್ಕೀಮ್ ಪೋರ್ಟಲ್ ಅಲ್ಲ, ಚಾಟ್‌ಬಾಟ್ ಅಲ್ಲ. ಇದು ಮುನ್ನೆಚ್ಚರಿಕೆ ವ್ಯವಸ್ಥೆಯಾಗಿದ್ದು, ರೈತರನ್ನು ನಿರಂತರವಾಗಿ ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡುತ್ತದೆ, ಆರ್ಥಿಕ ಮತ್ತು ಭಾವನಾತ್ಮಕ ಕುಸಿತದತ್ತ ಸಾಗುತ್ತಿರುವಾಗ ಪತ್ತೆ ಮಾಡುತ್ತದೆ ಮತ್ತು ರೈತ ಕೇಳಲು ಕಾಯದೆ தானாகவே ಸಹಾಯವನ್ನು ಪ್ರಚೋದಿಸುತ್ತದೆ.",
    portalsTitle: "4 ಪೋರ್ಟಲ್‌ಗಳು",
    farmerPortal: "ರೈತರ ಪೋರ್ಟಲ್",
    adminPortal: "ಆಡಳಿತ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    mitraPortal: "ಕೃಷಿ ಮಿತ್ರ ಪೋರ್ಟಲ್",
    qrPortal: "ಹಳದಿ ಬೆಂಚ್ QR",
    languageToggle: "Switch to English",
    problemTitle: "ಸಮಸ್ಯೆ: ಮೂರು ಸಂಯುಕ್ತ ಆಘಾತಗಳು",
    prob1T: "1. ಬೆಳೆ ವಿಫಲ", prob1D: "ಇಡೀ ಋತುವಿನ ಆದಾಯ ನಷ್ಟ. ಕಾರ್ಮಿಕರು, ಕೃಷಿ ಪರಿಕರ, ಸಾಲದ ಬಡ್ಡಿಯಂತಹ ಸ್ಥಿರ ವೆಚ್ಚಗಳು ಹಾಗೆಯೇ ಇರುತ್ತವೆ.",
    prob2T: "2. ಸಾಲದ ಒತ್ತಡ", prob2D: "ರೈತರಿಗೆ ಅರ್ಥವಾಗದ ಭಾಷೆಯಲ್ಲಿ ಬ್ಯಾಂಕ್ ಮರುಪಾವತಿ ನೋಟಿಸ್ ಕಳುಹಿಸುತ್ತದೆ. ಒತ್ತಡ ಹೆಚ್ಚಾಗುತ್ತದೆ.",
    prob3T: "3. ಹವಾಮಾನ ಘಟನೆ", prob3D: "ಅಕಾಲಿಕ ಮಳೆ ಅಥವಾ ಬರಗಾಲವು ಬ್ಯಾಕಪ್ ಬೆಳೆಯನ್ನು ನಾಶಪಡಿಸುತ್ತದೆ. ಇದು ಬ್ರೇಕಿಂಗ್ ಪಾಯಿಂಟ್.",
    probAlert: "ಈ ಯಾವುದೇ ಆಘಾತಗಳು ಮಾತ್ರ ಮಾರಣಾಂತಿಕವಲ್ಲ. ಸಮಯಕ್ಕೆ ಸರಿಯಾಗಿ ಯಾವುದೇ ಬೆಂಬಲ ವ್ಯವಸ್ಥೆ ಸಕ್ರಿಯಗೊಳ್ಳದೆ ಇವುಗಳ ಸಂಯೋಜನೆಯೇ ಬದಲಾಯಿಸಲಾಗದ ಪರಿಣಾಮಗಳನ್ನು ಉಂಟುಮಾಡುತ್ತದೆ.",
    flowTitle: "ಕ್ರಾಸ್-ಪೋರ್ಟಲ್ ಸಿಂಕ್ರೊನೈಸೇಶನ್",
    flow1: "ರೈತರು ಸಂಕಷ್ಟದ ಸಂಕೇತವನ್ನು ಸಲ್ಲಿಸುತ್ತಾರೆ → ನಿರ್ವಾಹಕರ ನಕ್ಷೆಯಲ್ಲಿ ತಕ್ಷಣವೇ ಕೆಂಪು ಪಿನ್ ಕಾಣಿಸಿಕೊಳ್ಳುತ್ತದೆ ಮತ್ತು ಮಿತ್ರರಿಗೆ ಫ್ಲ್ಯಾಗ್ ಮಾಡಲಾದ ಪ್ರಕರಣ ಬರುತ್ತದೆ.",
    flow2: "ರೈತರು ದಾಖಲೆಗೆ ಸಹಾಯ ಕೋರುತ್ತಾರೆ → ವಿನಂತಿಯು ತಕ್ಷಣವೇ ಮಿತ್ರರ ಕ್ರಿಯಾ ಸರದಿಯಲ್ಲಿ ಕಾಣಿಸಿಕೊಳ್ಳುತ್ತದೆ.",
    flow3: "ಮಿತ್ರರು ಕೃಷಿ ಭೇಟಿ ಅಥವಾ ಫೋನ್ ಕರೆಯನ್ನು ದಾಖಲಿಸುತ್ತಾರೆ → ರೈತರ ಸಾಧನದಲ್ಲಿ ಸ್ಥಿತಿ ಬ್ಯಾನರ್ ಲೈವ್ ಆಗಿ ನವೀಕರಿಸಲ್ಪಡುತ್ತದೆ.",
    flow4: "ನಿರ್ವಾಹಕರು ಡೆಮೊ ಅಲರ್ಟ್ ಪ್ರಚೋದಿಸುತ್ತಾರೆ → SMS ಬರುತ್ತದೆ, ಕೌಂಟರ್‌ಗಳು ಹೆಚ್ಚಾಗುತ್ತವೆ, ನಕ್ಷೆಯು ಏಕಕಾಲದಲ್ಲಿ ನವೀಕರಿಸಲ್ಪಡುತ್ತದೆ.",
    farmerPortalDesc: "ಕನ್ನಡ ಮತ್ತು ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಧ್ವನಿ-ಮೊದಲ ಇಂಟರ್ಫೇಸ್. ಅಪ್ಲಿಕೇಶನ್ ಡೌನ್‌ಲೋಡ್ ಇಲ್ಲದೆ ನಿರಂತರ ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಲಾಗಿದೆ.",
    adminPortalDesc: "ಪ್ರೊಜೆಕ್ಟರ್-ಸ್ನೇಹಿ ಡಾರ್ಕ್ ಥೀಮ್. ನೈಜ ಸಮಯದಲ್ಲಿ ಜಿಲ್ಲೆಯಲ್ಲಿನ ಸಂಕಷ್ಟದ ಪಥವನ್ನು ಗಮನಿಸುವ ಲೈವ್ ನಕ್ಷೆ.",
    mitraPortalDesc: "ಎಚ್ಚರಿಕೆಗಳನ್ನು ಪರಿಹರಿಸುವ ಮತ್ತು ದಾಖಲೆಗಳ ಸಹಾಯ ವಿನಂತಿಗಳನ್ನು ಪೂರೈಸುವ ಗ್ರಾಮ ಸ್ವಯಂಸೇವಕರಿಗಾಗಿ ಕ್ಷೇತ್ರ ಸಾಧನ.",
    qrPortalDesc: "ಆಫ್‌ಲೈನ್ ಗ್ರಾಮೀಣ ವಿತರಣೆಯನ್ನು ಲೈವ್ ಬ್ಯಾಕೆಂಡ್‌ಗೆ ಸಂಪರ್ಕಿಸುವ ಮುದ್ರಿಸಬಹುದಾದ ಕ್ರಿಯಾತ್ಮಕ QR ಕೋಡ್‌ಗಳು."
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('krishimanas_lang') || 'en');

  useEffect(() => {
    localStorage.setItem('krishimanas_lang', lang);
  }, [lang]);

  const toggleLanguage = () => setLang(l => l === 'en' ? 'kn' : 'en');
  const t = (key) => translations[lang][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => useContext(LanguageContext);
