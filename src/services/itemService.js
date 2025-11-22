import {
  doc,
  updateDoc,
  deleteField
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { db } from '../config/firebase.js';
import { COLLECTIONS } from '../utils/constants.js';
import { createErrorResult, createSuccessResult } from '../utils/errorHandler.js';
import { validateItemName } from '../utils/validators.js';

const auth = getAuth();

const generateItemId = () => {
  return `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const addItem = async (listId, itemName) => {
  const validation = validateItemName(itemName);
  if (!validation.valid) {
    return createErrorResult(new Error(validation.error));
  }

  try {
    const user = auth.currentUser;
    if (!user?.email) {
      return createErrorResult(new Error('User not authenticated'));
    }

    const itemId = generateItemId();
    const listRef = doc(db, COLLECTIONS.SHOPPING_LISTS, listId);
    
    const newItem = {
      id: itemId,
      name: validation.value,
      pending: true,
      addedBy: user.email,
      addedAt: new Date().toISOString(),
    };

    await updateDoc(listRef, {
      [`items.${itemId}`]: newItem,
    });
    
    return createSuccessResult({ itemId, item: newItem });
  } catch (error) {
    return createErrorResult(error);
  }
};

export const toggleItemStatus = async (listId, itemId, currentStatus) => {
  try {
    const listRef = doc(db, COLLECTIONS.SHOPPING_LISTS, listId);
    
    await updateDoc(listRef, {
      [`items.${itemId}.pending`]: !currentStatus,
    });
    
    return createSuccessResult();
  } catch (error) {
    return createErrorResult(error);
  }
};

export const updateItemName = async (listId, itemId, newName) => {
  const validation = validateItemName(newName);
  if (!validation.valid) {
    return createErrorResult(new Error(validation.error));
  }

  try {
    const listRef = doc(db, COLLECTIONS.SHOPPING_LISTS, listId);
    
    await updateDoc(listRef, {
      [`items.${itemId}.name`]: validation.value,
    });
    
    return createSuccessResult();
  } catch (error) {
    return createErrorResult(error);
  }
};

export const deleteItem = async (listId, itemId) => {
  try {
    const listRef = doc(db, COLLECTIONS.SHOPPING_LISTS, listId);
    
    await updateDoc(listRef, {
      [`items.${itemId}`]: deleteField(),
    });
    
    return createSuccessResult();
  } catch (error) {
    return createErrorResult(error);
  }
};