import React, { useState } from 'react';
import { useFriends } from '../../hooks/useFriends.js';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import AddFriendDialog from './AddFriendDialog.jsx';
import ConfirmDialog from '../common/ConfirmDialog.jsx';
import { removeFriend } from '../../services/friendService.js';

const FriendsPage = ({ user, onBack }) => {
  const { friends, loading } = useFriends(user.email);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [friendToDelete, setFriendToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const friendsList = Object.entries(friends);

  const handleDeleteFriend = async () => {
    if (!friendToDelete) return;

    setIsDeleting(true);
    const result = await removeFriend(user.email, friendToDelete.email);

    if (!result.success) {
      alert(`Failed to remove friend: ${result.error}`);
    }

    setIsDeleting(false);
    setFriendToDelete(null);
  };

  if (loading) {
    return <LoadingSpinner message="Loading friends..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="mr-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Friends</h1>
                <p className="text-sm text-gray-600">{friendsList.length} friend{friendsList.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {friendsList.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Friends Yet</h2>
            <p className="text-gray-600 mb-6">
              Add friends to collaborate on shopping lists
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-200">
              {friendsList.map(([email, name]) => (
                <div key={email} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1 min-w-0">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-medium text-sm">
                          {name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <p className="text-base font-semibold text-gray-900 truncate">
                          {name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setFriendToDelete({ email, name })}
                      className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove friend"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Floating Add Button */}
      <button
        onClick={() => setShowAddDialog(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110 flex items-center justify-center"
        aria-label="Add friend"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Dialogs */}
      <AddFriendDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        userEmail={user.email}
      />

      <ConfirmDialog
        isOpen={!!friendToDelete}
        onClose={() => setFriendToDelete(null)}
        onConfirm={handleDeleteFriend}
        title="Remove Friend?"
        message={`Are you sure you want to remove ${friendToDelete?.name}? They will no longer have access to shared lists.`}
        confirmText={isDeleting ? 'Removing...' : 'Remove'}
        variant="danger"
      />
    </div>
  );
};

export default FriendsPage;