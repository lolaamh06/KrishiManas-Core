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
    qrPortalDesc: "Dynamic printable QR codes connecting offline rural distribution to the live backend.",
    
    // NEW LANDING PAGE KEYS
    karpVer: "Karnataka Agri-Resilience Protocol v2.5",
    statRatio: "Daily Ratio", statRatioSub: "Farmer Suicides",
    statReach: "Hassan Reach", statReachSub: "Households",
    statType: "System Type", statTypeSub: "Alert Protocol",
    statTarget: "Target", statTargetSub: "Distress Rate",
    regTitle: "Regional Access Core",
    regSubtitle: "Multi-layered architecture connecting Farmers, Local Volunteers, and District Administration.",
    farmConsole: "Farmer Console",
    farmConsoleDesc: "Check distress scores, match with AI-driven schemes, and access emergency SOS aid.",
    loginEnter: "ENTER PORTAL", loginReg: "REGISTER / LOGIN",
    adminIntel: "Admin Intel",
    adminIntelDesc: "Regional telemetry, spatial distress mapping, and rapid broadcast infrastructure.",
    cmdCenter: "COMMAND CENTER",
    mitraResp: "Mitra Response",
    mitraRespDesc: "Field volunteer case queue with real-time intervention tracking and SOS management.",
    launchMitra: "LAUNCH MITRA APP",
    qrHub: "Master QR Hub",
    qrHubDesc: "Deploy physical intervention assets. One QR for SOS and universal app access.",
    distCenter: "DISTRIBUTION CENTER",
    defTitle: "A Unified Defense System.",
    defDet: "Detection", defDetDesc: "Every 14 days, AI analyzes farmer check-ins to recalculate the Distress Index.",
    defInc: "Incentivization", defIncDesc: "Farmers in stress are automatically matched with government schemes to provide leverage.",
    defInt: "Intervention", defIntDesc: "Regional Mitras are dispatched within 24 hours of a critical score detect.",
    latencyTit: "Latency Response Target",
    newsTitle: "Karnataka Agriculture News",
    newsSub: "Latest developments in Karnataka agriculture — March 2026",
    newsCount: "10 Stories This Month",
    liveUpdates: "Live Updates",
    footerCopyright: "KrishiManas Engine © 2026 // PS-05 Open Innovation Initiative",
    
    // CONTEXTUAL AUDIO GUIDES
    audio_guide_landing: "Welcome to KrishiManas. Our system detects distress and connects farmers with help before it's too late. We have four portals: The Farmer Console for checking your status, the Admin Intel for monitoring regions, the Mitra Response for field volunteers, and the Master Q.R. Hub. Please click 'Register or Login' to continue.",
    audio_guide_farmer: "Welcome to the Farmer Console. Your current distress status is displayed on the screen. If you are facing an emergency, please press the red S.O.S. button immediately to alert the nearest Mitra volunteer. You can also view available government schemes below.",
    audio_guide_mitra: "Welcome to the Mitra Response active queue. Here you can monitor assigned cases, intercept incoming emergency S.O.S. signals, and document post-visit notes for the farmers in your sector. Keep an eye on the red alerts for immediate action.",
    audio_guide_admin: "Welcome to the Admin Intel Command Center. This dashboard provides real-time regional telemetry and spatial distress mapping. You can monitor active interventions across all sectors and deploy systemic alerts when an agricultural crisis is detected.",
    audio_guide_qr: "Welcome to the Master Q.R. Hub. This portal provides dynamic, printable intervention assets for rural distribution.",
    audio_guide_default: "You are currently navigating the KrishiManas system."
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
    qrPortalDesc: "ಆಫ್‌ಲೈನ್ ಗ್ರಾಮೀಣ ವಿತರಣೆಯನ್ನು ಲೈವ್ ಬ್ಯಾಕೆಂಡ್‌ಗೆ ಸಂಪರ್ಕಿಸುವ ಮುದ್ರಿಸಬಹುದಾದ ಕ್ರಿಯಾತ್ಮಕ QR ಕೋಡ್‌ಗಳು.",

    // NEW LANDING PAGE KEYS
    karpVer: "ಕರ್ನಾಟಕ ಕೃಷಿ-ಸ್ಥಿತಿಸ್ಥಾಪಕ ಪ್ರೋಟೋಕಾಲ್ v2.5",
    statRatio: "ದೈನಂದಿನ ಅನುಪಾತ", statRatioSub: "ರೈತರ ಆತ್ಮಹತ್ಯೆಗಳು",
    statReach: "ಹಾಸನ ವ್ಯಾಪ್ತಿ", statReachSub: "ಕುಟುಂಬಗಳು",
    statType: "ವ್ಯವಸ್ಥೆ ಪ್ರಕಾರ", statTypeSub: "ಎಚ್ಚರಿಕೆ ಪ್ರೋಟೋಕಾಲ್",
    statTarget: "ಗುರಿ", statTargetSub: "ಸಂಕಷ್ಟ ದರ",
    regTitle: "ಪ್ರಾದೇಶಿಕ ಪ್ರವೇಶ ಕೇಂದ್ರ",
    regSubtitle: "ರೈತರು, ಸ್ಥಳೀಯ ಸ್ವಯಂಸೇವಕರು ಮತ್ತು ಜಿಲ್ಲಾ ಆಡಳಿತವನ್ನು ಸಂಪರ್ಕಿಸುವ ಬಹು-ಪದರದ ವಾಸ್ತುಶಿಲ್ಪ.",
    farmConsole: "ರೈತ ಕೇಂದ್ರ",
    farmConsoleDesc: "ಸಂಕಷ್ಟದ ಅಂಕಗಳನ್ನು ಪರಿಶೀಲಿಸಿ, AI-ಚಾಲಿತ ಯೋಜನೆಗಳೊಂದಿಗೆ ಹೊಂದಿಕೆ ಮಾಡಿ ಮತ್ತು ತುರ್ತು SOS ಸಹಾಯವನ್ನು ಪಡೆಯಿರಿ.",
    loginEnter: "ಪೋರ್ಟಲ್ ಪ್ರವೇಶಿಸಿ", loginReg: "ನೋಂದಣಿ / ಲಾಗಿನ್",
    adminIntel: "ಆಡಳಿತ ಮಾಹಿತಿ",
    adminIntelDesc: "ಪ್ರಾದೇಶಿಕ ಟೆಲಿಮೆಟ್ರಿ, ಪ್ರಾದೇಶಿಕ ಸಂಕಷ್ಟ ಮ್ಯಾಪಿಂಗ್ ಮತ್ತು ಕ್ಷಿಪ್ರ ಪ್ರಸಾರ ಮೂಲಸೌಕರ್ಯ.",
    cmdCenter: "ಕಮಾಂಡ್ ಕೇಂದ್ರ",
    mitraResp: "ಮಿತ್ರ ಸ್ಪಂದನ",
    mitraRespDesc: "ನೈಜ-ಸಮಯದ ಮಧ್ಯಸ್ಥಿಕೆ ಟ್ರ್ಯಾಕಿಂಗ್ ಮತ್ತು SOS ನಿರ್ವಹಣೆಯೊಂದಿಗೆ ಸ್ವಯಂಸೇವಕ ಪ್ರಕರಣದ ಸರತಿ.",
    launchMitra: "ಮಿತ್ರ ಆಪ್ ಪ್ರಾರಂಭಿಸಿ",
    qrHub: "QR ತಾಣ",
    qrHubDesc: "ಭೌತಿಕ ಮಧ್ಯಸ್ಥಿಕೆ ಸ್ವತ್ತುಗಳನ್ನು ನಿಯೋಜಿಸಿ. SOS ಗಾಗಿ ಒಂದು QR ಮತ್ತು ಸಾರ್ವತ್ರಿಕ ಅಪ್ಲಿಕೇಶನ್ ಪ್ರವೇಶ.",
    distCenter: "ವಿತರಣಾ ಕೇಂದ್ರ",
    defTitle: "ಏಕೀಕೃತ ರಕ್ಷಣಾ ವ್ಯವಸ್ಥೆ.",
    defDet: "ಪತ್ತೆಹಚ್ಚುವಿಕೆ", defDetDesc: "ಪ್ರತಿ 14 ದಿನಗಳಿಗೊಮ್ಮೆ, AI ಸಂಕಷ್ಟದ ಸೂಚ್ಯಂಕವನ್ನು ಮರು ಲೆಕ್ಕಾಚಾರ ಮಾಡಲು ರೈತರ ಚೆಕ್-ಇನ್‌ಗಳನ್ನು ವಿಶ್ಲೇಷಿಸುತ್ತದೆ.",
    defInc: "ಪ್ರೋತ್ಸಾಹ", defIncDesc: "ಒತ್ತಡದಲ್ಲಿರುವ ರೈತರಿಗೆ ನೆರವು ನೀಡಲು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳಿಗೆ ಹೊಂದಿಸಲಾಗುತ್ತದೆ.",
    defInt: "ಮಧ್ಯಸ್ಥಿಕೆ", defIntDesc: "ನಿರ್ಣಾಯಕ ಸ್ಕೋರ್ ಪತ್ತೆಯಾದ 24 ಗಂಟೆಗಳ ಒಳಗೆ ಪ್ರಾದೇಶಿಕ ಮಿತ್ರರನ್ನು ಕಳುಹಿಸಲಾಗುತ್ತದೆ.",
    latencyTit: "ಲೇಟೆನ್ಸಿ ಪ್ರತಿಕ್ರಿಯೆ ಗುರಿ",
    newsTitle: "ಕರ್ನಾಟಕ ಕೃಷಿ ಸುದ್ದಿ",
    newsSub: "ಕರ್ನಾಟಕ ಕೃಷಿಯಲ್ಲಿ ಇತ್ತೀಚಿನ ಬೆಳವಣಿಗೆಗಳು — ಮಾರ್ಚ್ 2026",
    newsCount: "ಈ ತಿಂಗಳು 10 ಸುದ್ದಿಗಳು",
    liveUpdates: "ಲೈವ್ ಅಪ್‌ಡೇಟ್‌ಗಳು",
    footerCopyright: "ಕೃಷಿಮನಸ್ ಎಂಜಿನ್ © 2026 // PS-05 ಮುಕ್ತ ನಾವೀನ್ಯತೆ ಉಪಕ್ರಮ",
    
    // CONTEXTUAL AUDIO GUIDES (Written grammatically without digits for TTS)
    audio_guide_landing: "ಕೃಷಿಮನಸ್‌ಗೆ ಸುಸ್ವಾಗತ. ನಮ್ಮ ವ್ಯವಸ್ಥೆಯು ಕಷ್ಟವನ್ನು ಪತ್ತೆ ಮಾಡುತ್ತದೆ ಮತ್ತು ತುಂಬಾ ತಡವಾಗುವ ಮೊದಲು ರೈತರಿಗೆ ಸಹಾಯವನ್ನು ಸಂಪರ್ಕಿಸುತ್ತದೆ. ನಮ್ಮ ಬಳಿ ನಾಲ್ಕು ಪೋರ್ಟಲ್‌ಗಳಿವೆ: ನಿಮ್ಮ ಸ್ಥಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಲು ರೈತ ಕೇಂದ್ರ, ಪ್ರದೇಶಗಳನ್ನು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಲು ಆಡಳಿತ ಮಾಹಿತಿ, ಕ್ಷೇತ್ರ ಸ್ವಯಂಸೇವಕರಿಗಾಗಿ ಮಿತ್ರ ಸ್ಪಂದನ, ಮತ್ತು ಮಾಸ್ಟರ್ ಕ್ಯೂ.ಆರ್. ತಾಣ. ಮುಂದುವರೆಯಲು ನೋಂದಣಿ ಅಥವಾ ಲಾಗಿನ್ ಅನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ.",
    audio_guide_farmer: "ರೈತ ಕೇಂದ್ರಕ್ಕೆ ಸುಸ್ವಾಗತ. ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಸಂಕಷ್ಟದ ಸ್ಥಿತಿಯನ್ನು ಪರದೆಯ ಮೇಲೆ ಪ್ರದರ್ಶಿಸಲಾಗುತ್ತದೆ. ನೀವು ತುರ್ತು ಪರಿಸ್ಥಿತಿಯನ್ನು ಎದುರಿಸುತ್ತಿದ್ದರೆ, ಹತ್ತಿರದ ಮಿತ್ರ ಸ್ವಯಂಸೇವಕರನ್ನು ಎಚ್ಚರಿಸಲು ದಯವಿಟ್ಟು ತಕ್ಷಣವೇ ಕೆಂಪು ತುರ್ತು ಬಟನ್ ಒತ್ತಿರಿ. ಲಭ್ಯವಿರುವ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳನ್ನು ಸಹ ನೀವು ಕೆಳಗೆ ವೀಕ್ಷಿಸಬಹುದು.",
    audio_guide_mitra: "ಮಿತ್ರ ಸ್ಪಂದನ ಸಕ್ರಿಯ ಸರತಿಗೆ ಸುಸ್ವಾಗತ. ಇಲ್ಲಿ ನೀವು ನಿಯೋಜಿತ ಪ್ರಕರಣಗಳನ್ನು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಬಹುದು, ಒಳಬರುವ ತುರ್ತು ಸಂಕೇತಗಳನ್ನು ಸ್ವೀಕರಿಸಬಹುದು, ಮತ್ತು ನಿಮ್ಮ ಸೆಕ್ಟರ್‌ನಲ್ಲಿರುವ ರೈತರಿಗಾಗಿ ಭೇಟಿಯ ನಂತರದ ಟಿಪ್ಪಣಿಗಳನ್ನು ದಾಖಲಿಸಬಹುದು. ತಕ್ಷಣದ ಕ್ರಮಕ್ಕಾಗಿ ಕೆಂಪು ಎಚ್ಚರಿಕೆಗಳ ಬಗ್ಗೆ ಗಮನವಿರಲಿ.",
    audio_guide_admin: "ಆಡಳಿತ ಮಾಹಿತಿ ಕಮಾಂಡ್ ಕೇಂದ್ರಕ್ಕೆ ಸುಸ್ವಾಗತ. ಈ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ನೈಜ-ಸಮಯದ ಪ್ರಾದೇಶಿಕ ಟೆಲಿಮೆಟ್ರಿ ಮತ್ತು ಪ್ರಾದೇಶಿಕ ಸಂಕಷ್ಟ ಮ್ಯಾಪಿಂಗ್ ಅನ್ನು ಒದಗಿಸುತ್ತದೆ. ನೀವು ಎಲ್ಲಾ ವಲಯಗಳಾದ್ಯಂತ ಸಕ್ರಿಯ ಮಧ್ಯಸ್ಥಿಕೆಗಳನ್ನು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಬಹುದು ಮತ್ತು ಕೃಷಿ ಬಿಕ್ಕಟ್ಟು ಪತ್ತೆಯಾದಾಗ ವ್ಯವಸ್ಥಿತ ಎಚ್ಚರಿಕೆಗಳನ್ನು ನಿಯೋಜಿಸಬಹುದು.",
    audio_guide_qr: "ಮಾಸ್ಟರ್ ಕ್ಯೂ.ಆರ್. ತಾಣಕ್ಕೆ ಸುಸ್ವಾಗತ. ಈ ಪೋರ್ಟಲ್ ಗ್ರಾಮೀಣ ವಿತರಣೆಗಾಗಿ ಮುದ್ರಿಸಬಹುದಾದ ಮದ್ಯಸ್ಥಿಕೆ ಸ್ವತ್ತುಗಳನ್ನು ಒದಗಿಸುತ್ತದೆ.",
    audio_guide_default: "ನೀವು ಕೃಷಿಮನಸ್ ವ್ಯವಸ್ಥೆಯನ್ನು ಬಳಸುತ್ತಿದ್ದೀರಿ."
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
