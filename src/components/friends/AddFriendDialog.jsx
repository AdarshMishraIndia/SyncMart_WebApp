import React, { useState } from 'react';
import { addFriend } from '../../services/friendService.js';
import { validateEmail } from '../../utils/validators.js';

const AddFriendDialog = ({ isOpen, onClose, userEmail }) => {
  const [friendEmail, setFriendEmail] = useState('');
  const [friendName, setFriendName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setError(null);

    if (!friendEmail.trim() || !friendName.trim()) {
      setError('Both fields are required');
      return;
    }

    const emailValidation = validateEmail(friendEmail);
    if (!emailValidation.valid) {
      setError(emailValidation.error);
      return;
    }

    if (friendEmail.toLowerCase() === userEmail.toLowerCase()) {
      setError('You cannot add yourself as a friend');
      return;
    }

    setSaving(true);

    const result = await addFriend(userEmail, friendEmail.trim(), friendName.trim());

    if (result.success) {
      setFriendEmail('');
      setFriendName('');
      onClose();
    } else {
      setError(result.error);
    }

    setSaving(false);
  };

  const handleClose = () => {
    setFriendEmail('');
    setFriendName('');
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Add Friend</h2>
          <p className="text-sm text-gray-600 mt-1">
            Add a friend to collaborate on shopping lists
          </p>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Friend's Name
            </label>
            <input
              type="text"
              value={friendName}
              onChange={(e) => setFriendName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., John Doe"
              autoFocus
              maxLength={50}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Friend's Email
            </label>
            <input
              type="email"
              value={friendEmail}
              onChange={(e) => setFriendEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., friend@example.com"
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={handleClose}
            disabled={saving}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || !friendEmail.trim() || !friendName.trim()}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Adding...' : 'Add Friend'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFriendDialog;