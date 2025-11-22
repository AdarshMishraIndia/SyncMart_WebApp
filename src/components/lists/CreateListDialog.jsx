import React, { useState, useEffect } from 'react';
import { createList, updateList } from '../../services/listService.js';
import { canEditListMetadata } from '../../utils/permissions.js';

const CreateListDialog = ({ isOpen, onClose, userEmail, friends, existingList }) => {
  const [listName, setListName] = useState('');
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const isEditMode = Boolean(existingList);
  const canEdit = isEditMode ? canEditListMetadata(existingList, userEmail) : true;

  useEffect(() => {
    if (isOpen) {
      if (existingList) {
        setListName(existingList.listName || '');
        setSelectedEmails(existingList.accessEmails || []);
      } else {
        setListName('');
        setSelectedEmails([]);
      }
      setError(null);
    }
  }, [existingList, isOpen]);

  const handleSubmit = async () => {
    const trimmedName = listName.trim();
    
    if (!trimmedName) {
      setError('List name is required');
      return;
    }

    if (isEditMode && !canEdit) {
      setError('Only the owner can edit list settings');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      let result;
      
      if (isEditMode) {
        result = await updateList(existingList.id, {
          listName: trimmedName,
          accessEmails: selectedEmails
        });
      } else {
        result = await createList(userEmail, trimmedName, selectedEmails);
      }

      if (result.success) {
        onClose();
      } else {
        setError(result.error || 'Failed to save list');
      }
    } catch (err) {
      console.error('Error saving list:', err);
      setError('An unexpected error occurred');
    } finally {
      setSaving(false);
    }
  };

  const toggleFriendSelection = (email) => {
    if (!canEdit) return;
    
    setSelectedEmails(prevEmails => {
      const isSelected = prevEmails.includes(email);
      return isSelected 
        ? prevEmails.filter(e => e !== email) 
        : [...prevEmails, email];
    });
  };

  if (!isOpen) return null;

  const friendsList = Object.entries(friends);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col scale-in">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Edit List' : 'Create New List'}
          </h2>
          {isEditMode && !canEdit && (
            <p className="text-sm text-amber-600 mt-2 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Only the owner can edit list settings
            </p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 rounded-lg p-3">
              <p className="text-sm text-red-800 font-medium">{error}</p>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              List Name
            </label>
            <input
              type="text"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              disabled={!canEdit}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                !canEdit ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
              placeholder="e.g., Weekly Groceries"
              autoFocus={canEdit}
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Share with Friends
            </label>
            {friendsList.length === 0 ? (
              <p className="text-sm text-gray-500 italic">
                No friends added yet. Add friends to collaborate on lists.
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {friendsList.map(([email, name]) => (
                  <label 
                    key={email} 
                    className={`flex items-center p-3 rounded-lg transition-colors ${
                      !canEdit 
                        ? 'bg-gray-50 cursor-not-allowed' 
                        : 'hover:bg-gray-50 cursor-pointer'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedEmails.includes(email)}
                      onChange={() => toggleFriendSelection(email)}
                      disabled={!canEdit}
                      className={`w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 ${
                        !canEdit ? 'cursor-not-allowed' : ''
                      }`}
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{name}</p>
                      <p className="text-xs text-gray-500">{email}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {canEdit ? 'Cancel' : 'Close'}
          </button>
          {canEdit && (
            <button
              onClick={handleSubmit}
              disabled={saving || !listName.trim()}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:scale-105"
            >
              {saving ? 'Saving...' : isEditMode ? 'Update' : 'Create'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateListDialog;