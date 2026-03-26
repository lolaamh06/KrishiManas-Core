import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from '../components/AuthModal';
import NewsCarousel from '../components/shared/NewsCarousel';
import {
  Users, ShieldAlert, Cpu, Heart, ChevronRight, Globe, Github,
  Layers, Map, Zap, PhoneCall, QrCode, ArrowUpRight, Activity, Download, Database
} from 'lucide-react';

export default function LandingPage() {
  const { lang, toggleLanguage, t } = useLang();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Auth Modal State
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authRole, setAuthRole] = useState('farmer');

  const handlePortalClick = (role, path) => {
    // Audit Fix: Explicit Session Check per Role
    const storedSession = localStorage.getItem(`krishimanas_auth_${role}`);
    
    if (!storedSession) {
      setAuthRole(role);
      setIsAuthOpen(true);
    } else {
      navigate(path);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-teal-500/30 overflow-x-hidden">

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        defaultRole={authRole} 
      />

      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-blue-600/10 blur-[100px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-[100] px-6 py-6 flex justify-between items-center backdrop-blur-md bg-[#020617]/40 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Cpu size={24} className="text-black" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">
            {lang === 'en' ? 'KrishiManas' : 'ಕೃಷಿಮನಸ್'}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Global Language Toggle now handled by GlobalControls */}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6 max-w-7xl mx-auto z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/10 border border-teal-500/20 rounded-full mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Zap size={14} className="text-teal-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-500">{t('karpVer')}</span>
        </div>

        <h1 data-read-aloud="true" className="text-5xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-10 max-w-5xl animate-in fade-in slide-in-from-bottom-6 duration-1000">
          {lang === 'en' ? (
            <>Beyond growth.<br /><span className="text-teal-500 underline decoration-teal-500/30 underline-offset-8">Prioritizing survival</span><br />for the Indian farmer.</>
          ) : (
            <>ಬೆಳೆಗಿಂತ ಮಿಗಿಲು.<br /><span className="text-teal-500">ರೈತನ ಜೀವ ರಕ್ಷಣೆ</span><br />ನಮ್ಮ ಮೊದಲ ಆದ್ಯತೆ.</>
          )}
        </h1>

        <p data-read-aloud="true" className="text-slate-400 text-lg md:text-xl max-w-3xl leading-relaxed mb-12 font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000">
          {lang === 'en'
            ? "Every agri-tech focus is on more yield. KrishiManas focus is on the human behind the plow. We track emotional and financial distress indices to prevent agricultural crises before they escalate."
            : "ಪ್ರತಿಯೊಂದು ಅಗ್ರಿ-ಟೆಕ್ ಸಂಸ್ಥೆ ಹೆಚ್ಚು ಇಳುವರಿಗೆ ಒತ್ತು ನೀಡುತ್ತದೆ. ಕೃಷಿಮನಸ್ ರೈತನ ಮಾನಸಿಕ ಮತ್ತು ಆರ್ಥಿಕ ಸ್ಥಿತಿಯನ್ನು ಗಮನಿಸಿ, ಆತ್ಮಹತ್ಯೆ ತಡೆಗಟ್ಟಲು ಶ್ರಮಿಸುತ್ತದೆ."}
        </p>

        {/* Rapid Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl">
          {[
            { label: t('statRatio'), value: '47:1', sub: t('statRatioSub') },
            { label: t('statReach'), value: '5.4M', sub: t('statReachSub') },
            { label: t('statType'), value: '0-Delay', sub: t('statTypeSub') },
            { label: t('statTarget'), value: '0%', sub: t('statTargetSub') }
          ].map((s, i) => (
            <div key={i} className="bg-white/5 border border-white/5 p-6 rounded-[2rem] hover:border-teal-500/30 transition-all group">
              <div className="text-3xl font-black text-white group-hover:text-teal-500 transition-colors uppercase tracking-tighter">{s.value}</div>
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">{s.label}</div>
              <div className="text-[8px] font-bold text-slate-600 uppercase mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Operational Portals - Visual Interactive Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto z-10 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 data-read-aloud="true" className="text-4xl font-black text-white tracking-tighter mb-4 uppercase">{t('regTitle')}</h2>
            <div className="h-1 w-24 bg-teal-500 rounded-full" />
          </div>
          <p data-read-aloud="true" className="text-slate-500 font-bold uppercase text-xs tracking-widest max-w-sm">
            {t('regSubtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Farmer Portal */}
          <div
            onClick={() => handlePortalClick('farmer', '/farmer/dashboard')}
            className="group relative bg-[#0f172a] border border-white/5 p-8 rounded-[2.5rem] cursor-pointer overflow-hidden transition-all hover:border-teal-500/50 hover:-translate-y-2"
          >
            <div className="absolute -right-6 -top-6 text-teal-500/5 rotate-12 group-hover:rotate-0 transition-all duration-700">
              <Heart size={160} />
            </div>
            <div className="relative z-10 h-full flex flex-col">
              <div className="w-12 h-12 bg-teal-500/10 border border-teal-500/20 rounded-2xl flex items-center justify-center text-teal-500 mb-8 group-hover:bg-teal-500 group-hover:text-black transition-all">
                <Users size={24} />
              </div>
              <h3 data-read-aloud="true" className="text-2xl font-black text-white mb-2 uppercase tracking-tight">{t('farmConsole')}</h3>
              <p data-read-aloud="true" className="text-sm text-slate-500 font-medium leading-relaxed mb-10 flex-1">
                {t('farmConsoleDesc')}
              </p>
              <div className="flex items-center gap-2 text-teal-500 font-black text-xs uppercase tracking-widest">
                {currentUser?.roles?.includes('farmer') ? t('loginEnter') : t('loginReg')} <ArrowUpRight size={16} />
              </div>
            </div>
          </div>

          {/* Admin Dashboard */}
          <div
            onClick={() => handlePortalClick('admin', '/admin')}
            className="group relative bg-[#0f172a] border border-white/5 p-8 rounded-[2.5rem] cursor-pointer overflow-hidden transition-all hover:border-blue-500/50 hover:-translate-y-2"
          >
            <div className="absolute -right-6 -top-6 text-blue-500/5 rotate-12 group-hover:rotate-0 transition-all duration-700">
              <Layers size={160} />
            </div>
            <div className="relative z-10 h-full flex flex-col">
              <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-500 mb-8 group-hover:bg-blue-500 group-hover:text-black transition-all">
                <Map size={24} />
              </div>
              <h3 data-read-aloud="true" className="text-2xl font-black text-white mb-2 uppercase tracking-tight">{t('adminIntel')}</h3>
              <p data-read-aloud="true" className="text-sm text-slate-500 font-medium leading-relaxed mb-10 flex-1">
                {t('adminIntelDesc')}
              </p>
              <div className="flex items-center gap-2 text-blue-500 font-black text-xs uppercase tracking-widest">
                {t('cmdCenter')} <ArrowUpRight size={16} />
              </div>
            </div>
          </div>

          {/* Mitra Portal */}
          <div
            onClick={() => handlePortalClick('mitra', '/mitra')}
            className="group relative bg-[#0f172a] border border-white/5 p-8 rounded-[2.5rem] cursor-pointer overflow-hidden transition-all hover:border-emerald-500/50 hover:-translate-y-2"
          >
            <div className="absolute -right-6 -top-6 text-emerald-500/5 rotate-12 group-hover:rotate-0 transition-all duration-700">
              <PhoneCall size={160} />
            </div>
            <div className="relative z-10 h-full flex flex-col">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500 mb-8 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                <ShieldAlert size={24} />
              </div>
              <h3 data-read-aloud="true" className="text-2xl font-black text-white mb-2 uppercase tracking-tight">{t('mitraResp')}</h3>
              <p data-read-aloud="true" className="text-sm text-slate-500 font-medium leading-relaxed mb-10 flex-1">
                {t('mitraRespDesc')}
              </p>
              <div className="flex items-center gap-2 text-emerald-500 font-black text-xs uppercase tracking-widest">
                {t('launchMitra')} <ArrowUpRight size={16} />
              </div>
            </div>
          </div>

          {/* QR Console */}
          <div
            onClick={() => navigate('/qr')}
            className="group relative bg-[#0f172a] border border-white/5 p-8 rounded-[2.5rem] cursor-pointer overflow-hidden transition-all hover:border-amber-500/50 hover:-translate-y-2"
          >
            <div className="absolute -right-6 -top-6 text-amber-500/5 rotate-12 group-hover:rotate-0 transition-all duration-700">
              <QrCode size={160} />
            </div>
            <div className="relative z-10 h-full flex flex-col">
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center text-amber-500 mb-8 group-hover:bg-amber-500 group-hover:text-black transition-all">
                <QrCode size={24} />
              </div>
              <h3 data-read-aloud="true" className="text-2xl font-black text-white mb-2 uppercase tracking-tight">{t('qrHub')}</h3>
              <p data-read-aloud="true" className="text-sm text-slate-500 font-medium leading-relaxed mb-10 flex-1">
                {t('qrHubDesc')}
              </p>
              <div className="flex items-center gap-2 text-amber-500 font-black text-xs uppercase tracking-widest">
                {t('distCenter')} <ArrowUpRight size={16} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Mechanism Section */}
      <section className="bg-white/[0.02] py-24 px-6 border-y border-white/5 z-10 relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 data-read-aloud="true" className="text-5xl font-black text-white tracking-tighter leading-none">
              {t('defTitle')}
            </h2>
            <div className="space-y-6">
              {[
                { t: t('defDet'), d: t('defDetDesc'), icon: Activity },
                { t: t('defInc'), d: t('defIncDesc'), icon: Zap },
                { t: t('defInt'), d: t('defIntDesc'), icon: PhoneCall }
              ].map((step, idx) => (
                <div key={idx} className="flex gap-6 group">
                  <div className="w-12 h-12 rounded-2xl bg-[#0f172a] border border-white/10 flex items-center justify-center text-teal-500 flex-shrink-0 group-hover:scale-110 transition-transform">
                    <step.icon size={20} />
                  </div>
                  <div>
                    <h4 data-read-aloud="true" className="font-black text-white uppercase text-sm tracking-widest mb-1">{step.t}</h4>
                    <p data-read-aloud="true" className="text-slate-500 text-sm font-medium leading-relaxed">{step.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative aspect-square lg:aspect-video rounded-[3rem] bg-gradient-to-br from-teal-500/20 to-blue-600/10 border border-white/5 overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            <div className="relative text-center">
              <div className="text-[120px] font-black text-white/50 leading-none tracking-tighter animate-pulse">0.00ms</div>
              <div className="text-xs font-black text-teal-500 uppercase tracking-[0.4em] mt-2">{t('latencyTit')}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 max-w-7xl mx-auto relative z-10">
        
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-green-500">
                {t('liveUpdates')}
              </span>
            </div>
            <h2 data-read-aloud="true" className="text-4xl font-black text-white tracking-tighter">
              {t('newsTitle')}
            </h2>
            <p data-read-aloud="true" className="text-slate-500 text-sm font-medium mt-2">
              {t('newsSub')}
            </p>
          </div>
          <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
            {t('newsCount')}
          </div>
        </div>

        {/* Carousel */}
        <NewsCarousel lang={lang} />

      </section>

      {/* Open Dataset Initiative */}
      <section className="py-20 px-6 max-w-7xl mx-auto relative z-10 border-t border-white/5">
        <div className="bg-gradient-to-br from-[#0f172a] to-[#020617] p-10 md:p-14 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden group">
           <div className="absolute -right-10 -top-10 text-teal-500 opacity-5 group-hover:rotate-12 transition-transform duration-700">
              <Database size={300} />
           </div>
           
           <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
              <div>
                 <div className="flex items-center gap-2 text-teal-500 font-black text-[10px] uppercase tracking-widest mb-4">
                    <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse" />
                    {lang === 'en' ? 'Open Data Initiative' : 'ಮುಕ್ತ ಡೇಟಾ ಉಪಕ್ರಮ'}
                 </div>
                 <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4 leading-none">
                    {lang === 'en' ? 'KrishiManas Research Dataset' : 'ಕೃಷಿಮನಸ್ ಸಂಶೋಧನಾ ದತ್ತಾಂಶ'}
                 </h2>
                 <p className="text-sm font-bold text-slate-400 mb-8 leading-relaxed max-w-md">
                    {lang === 'en' 
                      ? 'Access anonymized, aggregate-level agricultural distress metrics, intervention tracking, and regional scheme adoption rates. Perfect for university students, researchers, and policymakers aiming to study socio-economic trends in farming.'
                      : 'ರೈತರ ಸಂಕಷ್ಟದ ಮೆಟ್ರಿಕ್‌ಗಳು, ಮಧ್ಯಸ್ಥಿಕೆ ಟ್ರ್ಯಾಕಿಂಗ್ ಮತ್ತು ಪ್ರಾದೇಶಿಕ ಯೋಜನೆ ಅಳವಡಿಕೆ ದರಗಳಿಗೆ ಪ್ರವೇಶ ಪಡೆಯಿರಿ. ಕೃಷಿಯಲ್ಲಿನ ಸಾಮಾಜಿಕ-ಆರ್ಥಿಕ ಪ್ರವೃತ್ತಿಗಳನ್ನು ಅಧ್ಯಯನ ಮಾಡಲು ಇಚ್ಛಿಸುವ ವಿಶ್ವವಿದ್ಯಾಲಯದ ವಿದ್ಯಾರ್ಥಿಗಳು, ಸಂಶೋಧಕರು ಮತ್ತು ನೀತಿ ನಿರೂಪಕರಿಗೆ ಇದು ಸೂಕ್ತವಾಗಿದೆ.'}
                 </p>
                 <a 
                   href="/datasets/KrishiManas_MockDataset.xlsx" 
                   download="KrishiManas_Research_Dataset.xlsx"
                   className="inline-flex items-center gap-3 bg-teal-500 hover:bg-teal-400 text-black px-8 py-4 rounded-xl font-black uppercase text-sm tracking-widest transition-all hover:-translate-y-1 shadow-[0_10px_30px_rgba(20,184,166,0.3)]"
                 >
                    <Download size={18} />
                    {lang === 'en' ? 'Download Excel Dataset' : 'ಎಕ್ಸೆಲ್ ದತ್ತಾಂಶ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ'}
                 </a>
              </div>
              
              <div className="hidden md:flex flex-col gap-4">
                 <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between">
                    <div>
                       <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{lang === 'en' ? 'Total Entries' : 'ಒಟ್ಟು ನಮೂದುಗಳು'}</div>
                       <div className="text-2xl font-black text-white tracking-tighter">50</div>
                    </div>
                    <Activity className="text-teal-500/50" size={32} />
                 </div>
                 <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between">
                    <div>
                       <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{lang === 'en' ? 'Data Format' : 'ದತ್ತಾಂಶ ಸ್ವರೂಪ'}</div>
                       <div className="text-2xl font-black text-white tracking-tighter">Spreadsheet (.xlsx)</div>
                    </div>
                    <Layers className="text-teal-500/50" size={32} />
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 z-10 relative text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-6 mb-4">
            <Github size={20} className="text-slate-600 hover:text-white transition-colors cursor-pointer" />
            <Globe size={20} className="text-slate-600 hover:text-white transition-colors cursor-pointer" />
          </div>
          <div className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">
            {t('footerCopyright')}
          </div>
        </div>
      </footer>

    </div>
  );
}
