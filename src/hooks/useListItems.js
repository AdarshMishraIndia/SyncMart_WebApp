import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { db } from '../config/firebase.js';
import { COLLECTIONS } from '../utils/constants.js';

export const useListItems = (listId) => {
  const [items, setItems] = useState([]);
  const [pendingItems, setPendingItems] = useState([]);
  const [finishedItems, setFinishedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!listId) {
      setItems([]);
      setPendingItems([]);
      setFinishedItems([]);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, COLLECTIONS.SHOPPING_LISTS, listId),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          const itemsMap = data.items || {};

          const allItems = Object.entries(itemsMap).map(([id, item]) => ({
            id,
            ...item,
          }));

          // Sort by addedAt timestamp
          const sortedItems = allItems.sort((a, b) => {
            return new Date(a.addedAt) - new Date(b.addedAt);
          });

          const pending = sortedItems.filter(item => item.pending);
          const finished = sortedItems.filter(item => !item.pending);

          setItems(sortedItems);
          setPendingItems(pending);
          setFinishedItems(finished);
        } else {
          setItems([]);
          setPendingItems([]);
          setFinishedItems([]);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching list items:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [listId]);

  return { items, pendingItems, finishedItems, loading, error };
};