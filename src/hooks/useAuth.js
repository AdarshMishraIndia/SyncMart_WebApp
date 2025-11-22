import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { auth } from '../config/firebase.js';
import { signInWithGoogle as signInService, logout as logoutService } from '../services/authService.js';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    
    const result = await signInService();
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const logout = async () => {
    const result = await logoutService();
    
    if (!result.success) {
      setError(result.error);
    }
  };

  const clearError = () => setError(null);

  return { 
    user, 
    loading, 
    error, 
    signInWithGoogle, 
    logout, 
    clearError 
  };
};