import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import LandingPage from './pages/LandingPage';
import FarmerOnboarding from './pages/FarmerOnboarding';
import FarmerDashboard from './pages/FarmerDashboard';
import FarmerCheckin from './pages/FarmerCheckin';
import AdminDashboard from './pages/AdminDashboard';
import MitraPortal from './pages/MitraPortal';
import QRPage from './pages/QRPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import Chatbot from './components/Chatbot';
import NewsDetail from './pages/NewsDetail';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ChatProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/farmer/onboarding" element={<FarmerOnboarding />} />
            <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
            <Route path="/farmer/checkin" element={<FarmerCheckin />} />
            <Route path="/farmer" element={<FarmerOnboarding />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/mitra" element={<MitraPortal />} />
            <Route path="/qr" element={<QRPage />} />
            <Route path="/news/:slug" element={<NewsDetail />} />
          </Routes>
          <Chatbot />
        </ChatProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
