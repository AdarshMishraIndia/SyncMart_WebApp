import { doc, getDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { db } from '../config/firebase.js';
import { COLLECTIONS } from '../utils/constants.js';
import { createErrorResult, createSuccessResult } from '../utils/errorHandler.js';
import { validateEmail } from '../utils/validators.js';

export const addFriend = async (userEmail, friendEmail, friendName) => {
  const emailValidation = validateEmail(friendEmail);
  if (!emailValidation.valid) {
    return createErrorResult(new Error(emailValidation.error));
  }

  if (!friendName || friendName.trim().length === 0) {
    return createErrorResult(new Error('Friend name is required'));
  }

  try {
    const userDocRef = doc(db, COLLECTIONS.USERS, userEmail);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return createErrorResult(new Error('User not found'));
    }

    const currentFriends = userDoc.data().friendsMap || {};
    
    if (currentFriends[friendEmail]) {
      return createErrorResult(new Error('Friend already exists'));
    }

    const updatedFriends = {
      ...currentFriends,
      [friendEmail]: friendName.trim()
    };

    await updateDoc(userDocRef, {
      friendsMap: updatedFriends
    });

    return createSuccessResult();
  } catch (error) {
    return createErrorResult(error);
  }
};

export const removeFriend = async (userEmail, friendEmail) => {
  try {
    const userDocRef = doc(db, COLLECTIONS.USERS, userEmail);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return createErrorResult(new Error('User not found'));
    }

    const currentFriends = userDoc.data().friendsMap || {};
    delete currentFriends[friendEmail];

    await updateDoc(userDocRef, {
      friendsMap: currentFriends
    });

    return createSuccessResult();
  } catch (error) {
    return createErrorResult(error);
  }
};