import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  Timestamp
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { db } from '../config/firebase.js';
import { COLLECTIONS } from '../utils/constants.js';
import { createErrorResult, createSuccessResult } from '../utils/errorHandler.js';
import { validateListName } from '../utils/validators.js';

export const createList = async (userEmail, listName, accessEmails = []) => {
  const validation = validateListName(listName);
  if (!validation.valid) {
    return createErrorResult(new Error(validation.error));
  }

  try {
    const listData = {
      listName: validation.value,
      owner: userEmail,
      accessEmails: accessEmails || [],
      items: {},
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      position: 0,
    };

    const docRef = await addDoc(collection(db, COLLECTIONS.SHOPPING_LISTS), listData);
    
    return createSuccessResult({ id: docRef.id, ...listData });
  } catch (error) {
    return createErrorResult(error);
  }
};

export const updateList = async (listId, updates) => {
  if (updates.listName) {
    const validation = validateListName(updates.listName);
    if (!validation.valid) {
      return createErrorResult(new Error(validation.error));
    }
    updates.listName = validation.value;
  }

  try {
    const listRef = doc(db, COLLECTIONS.SHOPPING_LISTS, listId);
    await updateDoc(listRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
    
    return createSuccessResult();
  } catch (error) {
    return createErrorResult(error);
  }
};

export const deleteList = async (listId) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.SHOPPING_LISTS, listId));
    return createSuccessResult();
  } catch (error) {
    return createErrorResult(error);
  }
};

export const deleteLists = async (listIds) => {
  if (!Array.isArray(listIds) || listIds.length === 0) {
    return createErrorResult(new Error('Invalid list IDs'));
  }

  try {
    const batch = writeBatch(db);
    
    listIds.forEach(listId => {
      batch.delete(doc(db, COLLECTIONS.SHOPPING_LISTS, listId));
    });
    
    await batch.commit();
    return createSuccessResult();
  } catch (error) {
    return createErrorResult(error);
  }
};