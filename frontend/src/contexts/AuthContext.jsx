import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, fb, isConfigured } from '../utils/firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null); // 'farmer', 'mitra', 'admin'
  const [loading, setLoading] = useState(true);

  // Initialize from LocalStorage or Firebase State
  useEffect(() => {
    // If Firebase isn't strictly configured with real keys, rely on localStorage simulation
    const storedUser = localStorage.getItem('krishimanas_auth_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setUserRole(JSON.parse(storedUser).activeRole || 'farmer');
    }
    // Instead of forcing real Firebase auth listeners that crash without API keys,
    // we just complete loading.
    setLoading(false);
  }, []);

  // --- Registration / Login Simulators ---
  const registerUser = async (email, password, profileData) => {
    const user = await fb.registerUser(email, password, profileData);
    const sessionData = {
      uid: user.uid,
      email,
      ...profileData,
      activeRole: profileData.roles[0] 
    };
    setCurrentUser(sessionData);
    setUserRole(sessionData.activeRole);
    localStorage.setItem('krishimanas_auth_user', JSON.stringify(sessionData));
    
    // Broadcast for Admin realtime tracking
    fb.logActivity('REGISTER', `${profileData.name} joined as ${profileData.roles[0]}`);
    window.dispatchEvent(new CustomEvent('auth_event', { detail: { type: 'LOGIN', user: sessionData }}));
    
    return sessionData;
  };

  const loginUser = async (email, password, roleHint = 'farmer') => {
    // This is a simulated login for now, assuming they pass auth
    const user = await fb.loginUser(email, password); // Firebase real check (if config present)
    const sessionData = {
      uid: user.uid || email,
      email,
      name: email.split('@')[0], // Mock name from email
      roles: [roleHint], // In a real app, fetched from Firestore /users/{uid}
      activeRole: roleHint
    };
    
    setCurrentUser(sessionData);
    setUserRole(sessionData.activeRole);
    localStorage.setItem('krishimanas_auth_user', JSON.stringify(sessionData));
    window.dispatchEvent(new CustomEvent('auth_event', { detail: { type: 'LOGIN', user: sessionData }}));
    
    return sessionData;
  };

  const logout = async () => {
    await fb.logoutUser();
    setCurrentUser(null);
    setUserRole(null);
    localStorage.removeItem('krishimanas_auth_user');
  };

  // Farmer to Mitra Dual-Role Upgrade
  const upgradeToMitra = async () => {
    if (!currentUser) return;
    const updatedUser = { 
      ...currentUser, 
      roles: [...(currentUser.roles || []), 'mitra'],
      isDualRole: true
    };
    setCurrentUser(updatedUser);
    localStorage.setItem('krishimanas_auth_user', JSON.stringify(updatedUser));
    fb.logActivity('ROLE_UPGRADE', `${currentUser.name} upgraded to Volunteer (Mitra)`);
    return updatedUser;
  };

  const switchActiveRole = (role) => {
    if (currentUser?.roles?.includes(role)) {
      setUserRole(role);
      const updatedUser = { ...currentUser, activeRole: role };
      setCurrentUser(updatedUser);
      localStorage.setItem('krishimanas_auth_user', JSON.stringify(updatedUser));
    }
  };

  const value = {
    currentUser,
    userRole,
    loginUser,
    registerUser,
    logout,
    upgradeToMitra,
    switchActiveRole
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
