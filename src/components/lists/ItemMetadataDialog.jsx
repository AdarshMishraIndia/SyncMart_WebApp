import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { db } from '../../config/firebase.js';
import { COLLECTIONS } from '../../utils/constants.js';

const ItemMetadataDialog = ({ item, onClose }) => {
  const [addedByName, setAddedByName] = useState('Loading...');

  useEffect(() => {
    const fetchUserName = async () => {
      if (!item.addedBy) {
        setAddedByName('Unknown');
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, item.addedBy));
        if (userDoc.exists()) {
          setAddedByName(userDoc.data().name || item.addedBy);
        } else {
          setAddedByName(item.addedBy);
        }
      } catch (error) {
        console.error('Error fetching user name:', error);
        setAddedByName(item.addedBy);
      }
    };

    fetchUserName();
  }, [item.addedBy]);

  const formatFullDate = (dateString) => {
    if (!dateString) return 'Unknown';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Item Details</h2>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Item Name
            </label>
            <p className="text-base text-gray-900 font-medium">
              {item.name}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              {item.pending ? 'Added By' : 'Purchased By'}
            </label>
            <p className="text-base text-gray-900">
              {addedByName}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              {item.pending ? 'Added At' : 'Purchased At'}
            </label>
            <p className="text-base text-gray-900">
              {formatFullDate(item.addedAt)}
            </p>
          </div>

          {item.important && (
            <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 rounded-lg p-3">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span className="text-sm font-medium">Important Item</span>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemMetadataDialog;