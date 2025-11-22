import React, { useState, useEffect, useRef } from 'react';
import { doc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { db } from '../../config/firebase.js';
import { COLLECTIONS } from '../../utils/constants.js';
import { validateItemName } from '../../utils/validators.js';

const AddItemsDialog = ({ isOpen, onClose, listId, userEmail }) => {
  const [itemsText, setItemsText] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setItemsText('');
      setError(null);
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleAdd = async () => {
    const lines = itemsText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (lines.length === 0) {
      setError('Please enter at least one item');
      return;
    }

    // Validate all items
    const invalidItems = [];
    for (const line of lines) {
      const validation = validateItemName(line);
      if (!validation.valid) {
        invalidItems.push(line);
      }
    }

    if (invalidItems.length > 0) {
      setError(`Invalid items: ${invalidItems.join(', ')}`);
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const now = Date.now();
      const updates = {};

      lines.forEach((itemName, index) => {
        const itemId = `item_${now + index}_${Math.random().toString(36).substr(2, 9)}`;
        const timestamp = new Date(now + index * 1000);
        
        updates[`items.${itemId}`] = {
          id: itemId,
          name: itemName.trim(),
          addedBy: userEmail,
          addedAt: timestamp.toISOString(),
          important: false,
          pending: true,
        };
      });

      const listRef = doc(db, COLLECTIONS.SHOPPING_LISTS, listId);
      await updateDoc(listRef, updates);

      onClose();
    } catch (err) {
      console.error('Error adding items:', err);
      setError('Failed to add items. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleAdd();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Add Items</h2>
          <p className="text-sm text-gray-600 mt-1">Enter one item per line</p>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <textarea
            ref={textareaRef}
            value={itemsText}
            onChange={(e) => setItemsText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Milk&#10;Eggs&#10;Bread&#10;..."
          />

          <p className="text-xs text-gray-500 mt-2">
            Tip: Press Ctrl+Enter (Cmd+Enter on Mac) to add quickly
          </p>
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            disabled={saving}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={saving || !itemsText.trim()}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Adding...' : 'Add Items'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddItemsDialog;