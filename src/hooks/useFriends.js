import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { db } from '../config/firebase.js';
import { COLLECTIONS } from '../utils/constants.js';

export const useFriends = (userEmail) => {
  const [friends, setFriends] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userEmail) {
      setFriends({});
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, COLLECTIONS.USERS, userEmail),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setFriends(data.friendsMap || {});
        } else {
          setFriends({});
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching friends:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userEmail]);

  return { friends, loading, error };
};