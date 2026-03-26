import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, AlertCircle, User, Bot, Loader2 } from 'lucide-react';
import { useChat } from '../contexts/ChatContext';

/**
 * Global Persistent Chatbot Component
 */

const Chatbot = () => {
  const { messages, sendMessage, isThinking, isOpen, setIsOpen } = useChat();
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleSend = () => {
    if (!input.trim() || isThinking) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <div className="fixed bottom-8 right-8 z-[3000]">
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 ${isOpen ? 'bg-slate-900 text-white rotate-90' : 'bg-teal-500 text-slate-900'}`}
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
        {!isOpen && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-[#020617] animate-pulse" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-24 right-0 w-[380px] md:w-[400px] h-[550px] md:h-[600px] bg-[#0f172a] border border-white/10 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-500">
          
          <div className="p-6 border-b border-white/5 bg-slate-900/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/20 flex items-center justify-center text-teal-400 border border-teal-500/30">
                <Sparkles size={20} />
              </div>
              <div>
                <div className="text-sm font-black text-white tracking-widest uppercase">KrishiManas Assistant</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Global Persistent Engine</span>
                </div>
              </div>
            </div>
          </div>

          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
          >
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-top-2 duration-300`}>
                <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 border ${msg.role === 'user' ? 'bg-teal-500 border-teal-400 text-slate-900' : 'bg-slate-800 border-white/5 text-slate-400'}`}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`p-4 rounded-2xl text-sm font-medium leading-relaxed ${msg.role === 'user' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-tr-none' : 'bg-slate-800/50 text-slate-300 border border-white/5 rounded-tl-none'}`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex justify-start animate-pulse">
                <div className="flex gap-3 max-w-[85%]">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-center text-teal-400">
                    <Loader2 size={16} className="animate-spin" />
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-800/30 text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    Thinking...
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-slate-900/80 border-t border-white/5">
            <div className="relative group">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="How can I help you today?"
                className="w-full pl-6 pr-14 py-4 bg-slate-800 border border-white/5 rounded-2xl text-sm text-white font-bold tracking-tight focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500/40 transition-all outline-none"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isThinking}
                className={`absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${input.trim() && !isThinking ? 'bg-teal-500 text-slate-900 shadow-lg shadow-teal-500/20' : 'bg-slate-700 text-slate-500'}`}
              >
                <Send size={18} fill="currentColor" />
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Chatbot;
