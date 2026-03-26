import React, { createContext, useContext, useState, useEffect } from 'react';
import { getLocalResponse } from '../utils/localBotLogic';
import { getAIResponse } from '../utils/geminiService';
import { getFallbackResponse } from '../utils/fallbackGenerator';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Namaste! I am your KrishiManas assistant. How can I help you explore the platform today?", timestamp: Date.now() }
  ]);
  const [isThinking, setIsThinking] = useState(false);

  // Update welcome message when user logs in
  useEffect(() => {
    if (currentUser) {
      setMessages(prev => [
        ...prev, 
        { role: 'bot', text: `Welcome back, ${currentUser.name || 'Member'}! I'm now synced with your personal dashboard and records.`, timestamp: Date.now() }
      ]);
    }
  }, [currentUser]);

  const sendMessage = async (input) => {
    if (!input.trim()) return;

    // 1. Add user message
    const userMsg = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setIsThinking(true);

    // Get current context (Farmer data or general user info)
    const contextData = currentUser || { name: 'Visitor', role: 'visitor' };

    try {
      // 2. LAYER 1: Try Local Logic
      const localResponse = getLocalResponse(input, contextData);
      if (localResponse) {
        setMessages(prev => [...prev, { role: 'bot', text: localResponse, timestamp: Date.now() }]);
        setIsThinking(false);
        return;
      }

      // 3. LAYER 2: Try Gemini AI
      try {
        const aiResponse = await getAIResponse(input, contextData);
        setMessages(prev => [...prev, { role: 'bot', text: aiResponse, timestamp: Date.now() }]);
      } catch (aiError) {
        console.error("Layer 2 Failed, switching to Fallback", aiError);
        // 4. LAYER 3: Fallback Logic
        const fallbackResponse = getFallbackResponse(input, contextData);
        setMessages(prev => [...prev, { role: 'bot', text: fallbackResponse, timestamp: Date.now() }]);
      }
    } catch (criticalError) {
      console.error("Critical Chatbot Error:", criticalError);
      setMessages(prev => [...prev, { role: 'bot', text: "Connectivity issues. I'm here to help as soon as I'm back online.", timestamp: Date.now() }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage, isThinking, isOpen, setIsOpen }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) throw new Error("useChat must be used within a ChatProvider");
    return context;
};
