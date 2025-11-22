import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { db } from '../config/firebase.js';
import { COLLECTIONS } from '../utils/constants.js';

export const useShoppingLists = (userEmail) => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userEmail) {
      setLists([]);
      setLoading(false);
      return;
    }

    const listsMap = new Map();
    let ownedUnsubscribe = null;
    let sharedUnsubscribe = null;

    const updateListsState = () => {
      const sortedLists = Array.from(listsMap.values())
        .sort((a, b) => a.position - b.position);
      
      setLists(sortedLists);
      setLoading(false);
    };

    try {
      const ownedQuery = query(
        collection(db, COLLECTIONS.SHOPPING_LISTS),
        where('owner', '==', userEmail)
      );

      const sharedQuery = query(
        collection(db, COLLECTIONS.SHOPPING_LISTS),
        where('accessEmails', 'array-contains', userEmail)
      );

      ownedUnsubscribe = onSnapshot(
        ownedQuery,
        (snapshot) => {
          snapshot.docChanges().forEach(change => {
            if (change.type === 'added' || change.type === 'modified') {
              listsMap.set(change.doc.id, { 
                id: change.doc.id, 
                ...change.doc.data() 
              });
            } else if (change.type === 'removed') {
              listsMap.delete(change.doc.id);
            }
          });
          updateListsState();
        },
        (err) => {
          console.error('Error fetching owned lists:', err);
          setError(err.message);
          setLoading(false);
        }
      );

      sharedUnsubscribe = onSnapshot(
        sharedQuery,
        (snapshot) => {
          snapshot.docChanges().forEach(change => {
            if (change.type === 'added' || change.type === 'modified') {
              listsMap.set(change.doc.id, { 
                id: change.doc.id, 
                ...change.doc.data() 
              });
            } else if (change.type === 'removed') {
              listsMap.delete(change.doc.id);
            }
          });
          updateListsState();
        },
        (err) => {
          console.error('Error fetching shared lists:', err);
          setError(err.message);
          setLoading(false);
        }
      );
    } catch (err) {
      console.error('Error setting up list listeners:', err);
      setError(err.message);
      setLoading(false);
    }

    return () => {
      if (ownedUnsubscribe) ownedUnsubscribe();
      if (sharedUnsubscribe) sharedUnsubscribe();
    };
  }, [userEmail]);

  return { lists, loading, error };
};