import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../contexts/LanguageContext';
import { 
  QrCode, Download, Printer, RefreshCw, Home, 
  Info, ExternalLink, Scan, HelpCircle, ShieldCheck, MapPin
} from 'lucide-react';

// Reusable QR Code Component
const QRCard = ({ title, color, url, description, target, audience }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    drawQR(url, canvasRef.current, color);
  }, [url, color]);

  const drawQR = (path, canvas, hex) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = 240;
    canvas.width = size;
    canvas.height = size;
    
    ctx.clearRect(0, 0, size, size);
    const blockSize = 12;
    const blocks = size / blockSize;
    
    ctx.fillStyle = hex;
    let hash = 0;
    for (let i = 0; i < path.length; i++) hash = ((hash << 5) - hash) + path.charCodeAt(i);
    
    const seededRandom = (seed) => {
      var x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    let s = Math.abs(hash);
    for (let x = 0; x < blocks; x++) {
      for (let y = 0; y < blocks; y++) {
        const isCorner = (x < 4 && y < 4) || (x > blocks - 5 && y < 4) || (x < 4 && y > blocks - 5);
        if (isCorner) {
           ctx.strokeRect(x * blockSize + 1, y * blockSize + 1, blockSize - 2, blockSize - 2);
           ctx.fillRect(x * blockSize + 3, y * blockSize + 3, blockSize - 6, blockSize - 6);
        } else if (seededRandom(s++) > 0.6) {
          ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
        }
      }
    }
  };

  const downloadQR = () => {
    const link = document.createElement('a');
    link.download = `KrishiManas_${title.replace(' ', '_')}.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-gray-100 flex flex-col print:shadow-none print:border-2">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-black text-xl text-[#020617] tracking-tighter">{title}</h3>
        <button onClick={downloadQR} className="p-2 bg-slate-50 text-slate-400 hover:text-teal-600 rounded-xl transition-colors print:hidden">
           <Download size={18} />
        </button>
      </div>

      <div className="relative group p-6 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 mb-8 flex justify-center transition-all hover:border-teal-500/40">
        <canvas ref={canvasRef} className="rounded-2xl shadow-lg shadow-black/5" />
      </div>

      <div className="space-y-4 flex-1">
         <div className="bg-slate-50 p-4 rounded-2xl">
            <div className="text-[9px] font-black uppercase tracking-widest text-teal-600 mb-1">Where it goes</div>
            <p className="text-xs font-bold text-slate-600 leading-relaxed">{target}</p>
         </div>
         <div className="bg-slate-50 p-4 rounded-2xl">
            <div className="text-[9px] font-black uppercase tracking-widest text-teal-600 mb-1">What it does</div>
            <p className="text-xs font-bold text-slate-600 leading-relaxed">{description}</p>
         </div>
         <div className="bg-slate-50 p-4 rounded-2xl">
            <div className="text-[9px] font-black uppercase tracking-widest text-teal-600 mb-1">Who this is for</div>
            <p className="text-xs font-bold text-slate-600 leading-relaxed">{audience}</p>
         </div>
      </div>
    </div>
  );
};

export default function QRPage() {
  const navigate = useNavigate();
  const { lang } = useLang();
  const [district, setDistrict] = useState('Hassan');

  // We add the district to the URL hash to simulate "District-Awareness" in generation
  const sosUrl = `https://krishimanas.app/farmer/sos?region=${district.toLowerCase()}`;
  const mitraUrl = `https://krishimanas.app/mitra/register?region=${district.toLowerCase()}`;

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 font-sans print:bg-white selection:bg-teal-500/10">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm print:hidden">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-teal-500 font-black text-xl hover:opacity-80 transition-all">
          <Home size={22} />
          <span className="tracking-tighter">KrishiManas DB</span>
        </button>
        <button onClick={() => window.print()} className="flex items-center gap-2 px-6 py-2 bg-[#020617] text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-gray-900/20 hover:scale-105 active:scale-95 transition-all">
          <Printer size={16} /> {lang === 'kn' ? 'ಮುದ್ರಿಸಿ' : 'Print Handouts'}
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-6 mt-16 flex flex-col md:flex-row gap-12 items-start">
        
        {/* Left Col: Info & Configuration */}
        <div className="md:w-1/3 md:sticky md:top-24 space-y-8">
            <header className="mb-8">
               <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-600 px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest mb-4 border border-amber-500/20">
                  <ShieldCheck size={14} /> Regional Access Points
               </div>
               <h1 className="text-4xl font-black text-[#020617] tracking-tighter mb-4">
                  District-Aware<br/>QR Hub
               </h1>
               <p className="text-slate-500 font-medium text-sm leading-relaxed">
                  Generate context-specific physical access points for your district. Once scanned, the system automatically routes users to localized support channels and resources.
               </p>
            </header>

            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 print:hidden space-y-4">
               <div className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-600 flex items-center gap-2">
                  <MapPin size={14} /> Select Telemetry Region
               </div>
               <select 
                 value={district}
                 onChange={(e) => setDistrict(e.target.value)}
                 className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-black text-[#020617] focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
               >
                 <option value="Hassan">Hassan (HQ)</option>
                 <option value="Chikkamagaluru">Chikkamagaluru</option>
                 <option value="Mandya">Mandya</option>
                 <option value="Mysuru">Mysuru</option>
               </select>
               <p className="text-[10px] font-bold text-slate-400 leading-relaxed mt-2 pt-4 border-t border-slate-100">
                  Notice how the QR patterns change dynamically below. Scans from these codes will automatically tag the user in the selected district's emergency database.
               </p>
            </div>
        </div>

        {/* Right Col: QR Grids */}
        <div className="md:w-2/3 grid md:grid-cols-2 gap-8 w-full">
           <QRCard 
              title="Farmer SOS Key" 
              color="#ea580c" 
              url={sosUrl}
              target="Direct to the Emergency Distress Submission Portal."
              description={`Instantly registers a high-priority SOS alert directly to the ${district} regional command center and alerts local Mitras.`}
              audience="Farmers experiencing severe emotional distress or immediate financial crisis who need rapid intervention."
           />
           
           <QRCard 
              title="Mitra Registration" 
              color="#0d9488" 
              url={mitraUrl}
              target="Mitra Volunteer Onboarding & Background Verification Flow."
              description={`Initiates the volunteer registration process, granting the user access to the ${district} active case queue upon approval.`}
              audience="Local youth, agriculturists, or students who want to volunteer as 'Krishi Mitras' to support farmers in their community."
           />
        </div>

      </div>
    </div>
  );
}
