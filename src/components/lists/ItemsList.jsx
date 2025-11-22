import React, { useEffect, useState } from 'react';
import { toggleItemStatus, updateItemName, deleteItem } from '../../services/itemService.js';
import { doc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { db } from '../../config/firebase.js';
import { COLLECTIONS } from '../../utils/constants.js';
import ConfirmDialog from '../common/ConfirmDialog.jsx';

const ItemCard = ({ 
  item, 
  listId, 
  isPendingTab, 
  canEdit, 
  isSelected, 
  isSelectionMode,
  onToggleSelection,
  onShowMetadata 
}) => {
  const [isImportant, setIsImportant] = useState(item.important);

  const handleToggleImportant = async (e) => {
    e.stopPropagation();
    if (!canEdit) return;

    const newValue = !isImportant;
    setIsImportant(newValue);

    try {
      const listRef = doc(db, COLLECTIONS.SHOPPING_LISTS, listId);
      await updateDoc(listRef, {
        [`items.${item.id}.important`]: newValue,
      });
    } catch (error) {
      setIsImportant(!newValue);
      console.error('Failed to toggle important:', error);
    }
  };

  const handleMarkFinished = async (e) => {
    e.stopPropagation();
    if (!canEdit) return;

    const result = await toggleItemStatus(listId, item.id, item.pending);
    if (!result.success) {
      alert('Failed to mark item as finished');
    }
  };

  const handleClick = () => {
    if (isSelectionMode) {
      onToggleSelection(item.id);
    }
  };

  const handleLongPress = () => {
    onToggleSelection(item.id);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    
    try {
      let date;
      
      // Handle Firestore Timestamp object
      if (timestamp.toDate && typeof timestamp.toDate === 'function') {
        date = timestamp.toDate();
      } 
      // Handle ISO string
      else if (typeof timestamp === 'string') {
        date = new Date(timestamp);
      }
      // Handle timestamp object with seconds
      else if (timestamp.seconds) {
        date = new Date(timestamp.seconds * 1000);
      }
      // Handle regular Date object or number
      else {
        date = new Date(timestamp);
      }

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return '';
      }

      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <div
      onClick={handleClick}
      onContextMenu={(e) => {
        e.preventDefault();
        handleLongPress();
      }}
      className={`p-4 border-b transition-all duration-300 ${
        isSelected
          ? 'bg-blue-600 text-white border-blue-700'
          : isImportant && isPendingTab
          ? 'bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 hover:from-amber-100 hover:via-yellow-100 hover:to-amber-100 border-l-4 border-amber-500 shadow-sm'
          : 'bg-white hover:bg-gray-50 border-gray-100'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {isImportant && isPendingTab && !isSelected && (
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-400 rounded-full blur-sm opacity-60 animate-pulse"></div>
                <svg 
                  className="relative w-5 h-5 text-amber-500 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className={`text-base font-medium truncate ${
              isSelected ? 'text-white' : isImportant && isPendingTab ? 'text-gray-900 font-semibold' : 'text-gray-900'
            }`}>
              {item.name}
            </h3>
            <p className={`text-xs mt-1 ${
              isSelected ? 'text-blue-100' : isImportant && isPendingTab ? 'text-amber-700 font-medium' : 'text-gray-500'
            }`}>
              {formatDate(item.addedAt)}
            </p>
          </div>
        </div>

        {!isSelectionMode && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {isPendingTab && canEdit && (
              <>
                <button
                  onClick={handleToggleImportant}
                  className={`p-2 rounded-lg transition-all transform hover:scale-110 ${
                    isImportant ? 'bg-amber-100 hover:bg-amber-200' : 'hover:bg-gray-100'
                  }`}
                  title={isImportant ? 'Unmark as important' : 'Mark as important'}
                >
                  <svg 
                    className={`w-5 h-5 transition-all ${
                      isImportant 
                        ? 'text-amber-500 fill-current drop-shadow-md' 
                        : 'text-gray-400'
                    }`}
                    fill={isImportant ? 'currentColor' : 'none'}
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </button>
                <button
                  onClick={handleMarkFinished}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Mark as finished"
                >
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShowMetadata(item);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="View details"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ItemsList = ({ 
  items, 
  listId, 
  isPendingTab, 
  canEdit,
  selectedItems,
  isSelectionMode,
  onToggleSelection,
  onClearSelection,
  onShowMetadata 
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const handleDeleteEvent = () => {
      if (selectedItems.size > 0) {
        setShowDeleteConfirm(true);
      }
    };

    window.addEventListener('deleteSelectedItems', handleDeleteEvent);
    return () => window.removeEventListener('deleteSelectedItems', handleDeleteEvent);
  }, [selectedItems]);

  const handleDeleteConfirm = async () => {
    const itemsToDelete = Array.from(selectedItems);
    
    for (const itemId of itemsToDelete) {
      await deleteItem(listId, itemId);
    }

    onClearSelection();
    setShowDeleteConfirm(false);
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          No {isPendingTab ? 'pending' : 'finished'} items
        </h3>
        <p className="text-sm text-gray-500 text-center">
          {isPendingTab 
            ? 'Add items to get started with your shopping list'
            : 'Items you mark as finished will appear here'
          }
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="divide-y divide-gray-100">
        {items.map(item => (
          <ItemCard
            key={item.id}
            item={item}
            listId={listId}
            isPendingTab={isPendingTab}
            canEdit={canEdit}
            isSelected={selectedItems.has(item.id)}
            isSelectionMode={isSelectionMode}
            onToggleSelection={onToggleSelection}
            onShowMetadata={onShowMetadata}
          />
        ))}
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Items?"
        message={`Are you sure you want to delete ${selectedItems.size} item(s)? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </>
  );
};

export default ItemsList;