import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, fb, isConfigured } from '../utils/firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const path = window.location.pathname;
      let targetRole = 'farmer';
      if (path.startsWith('/admin')) {
        targetRole = 'admin';
      } else if (path.startsWith('/mitra')) {
        targetRole = 'mitra';
      }
      
      const storedUser = localStorage.getItem(`krishimanas_auth_${targetRole}`);
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setCurrentUser(parsed);
        setUserRole(targetRole);
      } else {
        // Clear if we've switched role contexts but have a different role's user
        setCurrentUser(null);
        setUserRole(null);
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  }, []);

  const registerUser = async (email, password, profileData) => {
    const role = profileData.roles[0];
    const user = await fb.registerUser(email, password, profileData);
    const sessionData = {
      uid: user.uid,
      email,
      ...profileData,
      activeRole: role 
    };
    
    // Isolation: Only set session for the role we are logging in as
    setCurrentUser(sessionData);
    setUserRole(role);
    localStorage.setItem(`krishimanas_auth_${role}`, JSON.stringify(sessionData));
    
    fb.logActivity('REGISTER', `${profileData.name} joined as ${role}`);
    window.dispatchEvent(new CustomEvent('auth_event', { detail: { type: 'LOGIN', role, user: sessionData }}));
    
    return sessionData;
  };

  const loginUser = async (email, password, roleHint = 'farmer') => {
    const user = await fb.loginUser(email, password); 
    const sessionData = {
      uid: user.uid || email,
      email,
      name: email.split('@')[0],
      roles: [roleHint], 
      activeRole: roleHint
    };
    
    setCurrentUser(sessionData);
    setUserRole(roleHint);
    localStorage.setItem(`krishimanas_auth_${roleHint}`, JSON.stringify(sessionData));
    window.dispatchEvent(new CustomEvent('auth_event', { detail: { type: 'LOGIN', role: roleHint, user: sessionData }}));
    
    return sessionData;
  };

  const logout = async (role = userRole) => {
    await fb.logoutUser();
    setCurrentUser(null);
    setUserRole(null);
    localStorage.removeItem(`krishimanas_auth_${role}`);
  };

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
    switchActiveRole,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
