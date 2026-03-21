import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from '../components/AuthModal';
import { 
  Users, ShieldAlert, Cpu, Heart, ChevronRight, Globe, Github, 
  Layers, Map, Zap, PhoneCall, QrCode, ArrowUpRight, Activity
} from 'lucide-react';

export default function LandingPage() {
  const { lang, toggleLanguage } = useLang();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Auth Modal State
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authRole, setAuthRole] = useState('farmer');

  const handlePortalClick = (role, path) => {
    if (role === 'qr') {
      navigate(path);
      return;
    }
    // As requested, always ask for separate info per portal for prototype testing
    setAuthRole(role);
    setIsAuthOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-teal-500/30 overflow-x-hidden">
      
      {/* Auth Modal Injection */}
      {isAuthOpen && (
        <AuthModal 
          isOpen={isAuthOpen} 
          onClose={() => setIsAuthOpen(false)} 
          defaultRole={authRole} 
        />
      )}

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
          <span className="text-2xl font-black tracking-tighter text-white">KrishiManas</span>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleLanguage}
            className="px-5 py-2 rounded-xl border border-white/10 bg-white/5 text-xs font-black uppercase tracking-widest hover:bg-white/10 hover:border-teal-500/50 transition-all flex items-center gap-2"
          >
            <Globe size={14} className="text-teal-500" />
            {lang === 'en' ? 'ಕನ್ನಡ' : 'English'}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6 max-w-7xl mx-auto z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/10 border border-teal-500/20 rounded-full mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
           <Zap size={14} className="text-teal-500" />
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-500">Karnataka Agri-Resilience Protocol v2.5</span>
        </div>
        
        <h1 className="text-5xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-10 max-w-5xl animate-in fade-in slide-in-from-bottom-6 duration-1000">
          {lang === 'en' ? (
            <>Beyond growth.<br/><span className="text-teal-500 underline decoration-teal-500/30 underline-offset-8">Prioritizing survival</span><br/>for the Indian farmer.</>
          ) : (
            <>ಬೆಳೆಗಿಂತ ಮಿಗಿಲು.<br/><span className="text-teal-500">ರೈತನ ಜೀವ ರಕ್ಷಣೆ</span><br/>ನಮ್ಮ ಮೊದಲ ಆದ್ಯತೆ.</>
          )}
        </h1>

        <p className="text-slate-400 text-lg md:text-xl max-w-3xl leading-relaxed mb-12 font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000">
          {lang === 'en' 
            ? "Every agri-tech focus is on more yield. KrishiManas focus is on the human behind the plow. We track emotional and financial distress indices to prevent agricultural crises before they escalate."
            : "ಪ್ರತಿಯೊಂದು ಅಗ್ರಿ-ಟೆಕ್ ಸಂಸ್ಥೆ ಹೆಚ್ಚು ಇಳುವರಿಗೆ ಒತ್ತು ನೀಡುತ್ತದೆ. ಕೃಷಿಮನಸ್ ರೈತನ ಮಾನಸಿಕ ಮತ್ತು ಆರ್ಥಿಕ ಸ್ಥಿತಿಯನ್ನು ಗಮನಿಸಿ, ಆತ್ಮಹತ್ಯೆ ತಡೆಗಟ್ಟಲು ಶ್ರಮಿಸುತ್ತದೆ."}
        </p>

        {/* Rapid Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl">
           {[
             { label: 'Daily Ratio', value: '47:1', sub: 'Farmer Suicides' },
             { label: 'Hassan Reach', value: '5.4M', sub: 'Households' },
             { label: 'System Type', value: '0-Delay', sub: 'Alert Protocol' },
             { label: 'Target', value: '0%', sub: 'Distress Rate' }
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
              <h2 className="text-4xl font-black text-white tracking-tighter mb-4 uppercase">Regional Access Core</h2>
              <div className="h-1 w-24 bg-teal-500 rounded-full" />
           </div>
           <p className="text-slate-500 font-bold uppercase text-xs tracking-widest max-w-sm">
             Multi-layered architecture connecting Farmers, Local Volunteers, and District Administration.
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
               <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">{lang === 'en' ? 'Farmer Console' : 'ರೈತ ಕೇಂದ್ರ'}</h3>
               <p className="text-sm text-slate-500 font-medium leading-relaxed mb-10 flex-1">
                 Check distress scores, match with AI-driven schemes, and access emergency SOS aid.
               </p>
               <div className="flex items-center gap-2 text-teal-500 font-black text-xs uppercase tracking-widest">
                  {currentUser?.roles?.includes('farmer') ? 'ENTER PORTAL' : 'REGISTER / LOGIN'} <ArrowUpRight size={16} />
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
               <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">{lang === 'en' ? 'Admin Intel' : 'ಆಡಳಿತ ಮಾಹಿತಿ'}</h3>
               <p className="text-sm text-slate-500 font-medium leading-relaxed mb-10 flex-1">
                 Regional telemetry, spatial distress mapping, and rapid broadcast infrastructure.
               </p>
               <div className="flex items-center gap-2 text-blue-500 font-black text-xs uppercase tracking-widest">
                  COMMAND CENTER <ArrowUpRight size={16} />
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
               <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">{lang === 'en' ? 'Mitra Response' : 'ಮಿತ್ರ ಸ್ಪಂದನ'}</h3>
               <p className="text-sm text-slate-500 font-medium leading-relaxed mb-10 flex-1">
                 Field volunteer case queue with real-time intervention tracking and SOS management.
               </p>
               <div className="flex items-center gap-2 text-emerald-500 font-black text-xs uppercase tracking-widest">
                  LAUNCH MITRA APP <ArrowUpRight size={16} />
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
               <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">{lang === 'en' ? 'Master QR Hub' : 'QR ತಾಣ'}</h3>
               <p className="text-sm text-slate-500 font-medium leading-relaxed mb-10 flex-1">
                 Deploy physical intervention assets. One QR for SOS and universal app access.
               </p>
               <div className="flex items-center gap-2 text-amber-500 font-black text-xs uppercase tracking-widest">
                  DISTRIBUTION CENTER <ArrowUpRight size={16} />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Mechanism Section */}
      <section className="bg-white/[0.02] py-24 px-6 border-y border-white/5 z-10 relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
           <div className="space-y-8">
              <h2 className="text-5xl font-black text-white tracking-tighter leading-none">
                A Unified<br/><span className="text-teal-500">Defense System.</span>
              </h2>
              <div className="space-y-6">
                 {[
                   { t: 'Detection', d: 'Every 14 days, AI analyzes farmer check-ins to recalculate the Distress Index.', icon: Activity },
                   { t: 'Incentivization', d: 'Farmers in stress are automatically matched with government schemes to provide leverage.', icon: Zap },
                   { t: 'Intervention', d: 'Regional Mitras are dispatched within 24 hours of a critical score detect.', icon: PhoneCall }
                 ].map((step, idx) => (
                   <div key={idx} className="flex gap-6 group">
                      <div className="w-12 h-12 rounded-2xl bg-[#0f172a] border border-white/10 flex items-center justify-center text-teal-500 flex-shrink-0 group-hover:scale-110 transition-transform">
                         <step.icon size={20} />
                      </div>
                      <div>
                         <h4 className="font-black text-white uppercase text-sm tracking-widest mb-1">{step.t}</h4>
                         <p className="text-slate-500 text-sm font-medium leading-relaxed">{step.d}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
           
           <div className="relative aspect-square lg:aspect-video rounded-[3rem] bg-gradient-to-br from-teal-500/20 to-blue-600/10 border border-white/5 overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
              <div className="relative text-center">
                 <div className="text-[120px] font-black text-white/50 leading-none tracking-tighter animate-pulse">0.00ms</div>
                 <div className="text-xs font-black text-teal-500 uppercase tracking-[0.4em] mt-2">Latency Response Target</div>
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
             KrishiManas Engine © 2026 // PS-05 Open Innovation Initiative
           </div>
        </div>
      </footer>

    </div>
  );
}
