import { 
  doc, 
  getDoc, 
  setDoc 
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { db } from '../config/firebase.js';
import { COLLECTIONS } from '../utils/constants.js';
import { createErrorResult, createSuccessResult } from '../utils/errorHandler.js';
import { validateEmail } from '../utils/validators.js';

export const registerUserIfNew = async (email, name) => {
  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    throw new Error(emailValidation.error);
  }
  
  try {
    const userDocRef = doc(db, COLLECTIONS.USERS, email);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        name: name || 'User',
        friendsMap: {},
        fcmTokens: [],
        createdAt: new Date().toISOString(),
      });
    }
    
    return createSuccessResult();
  } catch (error) {
    return createErrorResult(error);
  }
};

export const getUserData = async (email) => {
  try {
    const userDocRef = doc(db, COLLECTIONS.USERS, email);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }
    
    return createSuccessResult(userDoc.data());
  } catch (error) {
    return createErrorResult(error);
  }
};

export const updateUserFriends = async (email, friendsMap) => {
  try {
    const userDocRef = doc(db, COLLECTIONS.USERS, email);
    await setDoc(userDocRef, { friendsMap }, { merge: true });
    
    return createSuccessResult();
  } catch (error) {
    return createErrorResult(error);
  }
};