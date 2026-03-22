import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LanguageContext';
import { X, Mail, Lock, User, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AuthModal({ isOpen, onClose, defaultRole = 'mitra' }) {
  const { lang } = useLang();
  const { loginUser, registerUser } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('Hassan');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let finalUser;
      if (isLogin) {
        finalUser = await loginUser(email, password, defaultRole);
      } else {
        finalUser = await registerUser(email, password, {
          name,
          phone,
          district,
          roles: [defaultRole]
        });
      }

      if (!isLogin) {
        // Registration: Route new farmers to the Onboarding Questionnaire
        if (defaultRole === 'farmer') {
          onClose();
          return navigate('/farmer/onboarding', { 
            state: { 
              authName: finalUser?.name || name || email.split('@')[0], 
              authEmail: email 
            } 
          });
        } else if (defaultRole === 'admin') {
          localStorage.setItem('krishimanas_admin', JSON.stringify({ 
            name: finalUser.name || name || email.split('@')[0], 
            email, 
            district: finalUser.district || district 
          }));
        } else if (defaultRole === 'mitra') {
           // Firestore automatically syncs the new registration to the Admin Dashboard
        }
      }

      onClose();
      // Redirect based on role for Logins and non-farmer Registers
      if (defaultRole === 'mitra') navigate('/mitra');
      if (defaultRole === 'farmer') navigate('/farmer/dashboard');
      if (defaultRole === 'admin') navigate('/admin');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0f172a] border border-white/10 rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <h2 className="text-2xl font-black text-white">
            {isLogin ? 'Welcome Back' : `Join as ${defaultRole === 'mitra' ? 'Volunteer' : defaultRole === 'admin' ? 'System Admin' : 'Farmer'}`}
          </h2>
          <button onClick={onClose} className="p-2 bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      required
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                      placeholder="Enter your name"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  required
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  required
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 mt-4 bg-teal-500 hover:bg-teal-400 text-black font-black text-lg rounded-xl transition-all disabled:opacity-50 flex justify-center items-center"
            >
              {loading ? <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" /> : (isLogin ? 'Secure Login' : 'Create Account')}
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              {isLogin ? "Need an account? Sign up" : "Already have an account? Log in"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
