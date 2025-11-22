import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut 
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { auth } from '../config/firebase.js';
import { createErrorResult, createSuccessResult } from '../utils/errorHandler.js';
import { registerUserIfNew } from './userService.js';

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    if (!user.email) {
      throw new Error('User email not available');
    }
    
    await registerUserIfNew(user.email, user.displayName || 'User');
    
    return createSuccessResult({ user });
  } catch (error) {
    return createErrorResult(error);
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    return createSuccessResult();
  } catch (error) {
    return createErrorResult(error);
  }
};

export const getCurrentUser = () => {
  return auth.currentUser;
};