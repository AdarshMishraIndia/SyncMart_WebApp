import React from 'react';

const Header = ({ 
  user, 
  userName, 
  isSelectionMode, 
  selectedCount, 
  canDeleteSelected,
  onClearSelection, 
  onDeleteSelected, 
  onLogout,
  onNavigateToFriends
}) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20 backdrop-blur-lg bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl blur opacity-50"></div>
              <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-3 transform hover:scale-105 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {isSelectionMode ? `${selectedCount} Selected` : 'SyncMart'}
              </h1>
              {!isSelectionMode && (
                <p className="text-sm text-gray-600">Welcome back, <span className="font-semibold">{userName}</span></p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isSelectionMode ? (
              <>
                <button
                  onClick={onClearSelection}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                >
                  Cancel
                </button>
                {canDeleteSelected && (
                  <button
                    onClick={onDeleteSelected}
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:from-red-700 hover:to-red-800 shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                  >
                    Delete
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={onNavigateToFriends}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 hover:shadow-md transition-all flex items-center gap-2 transform hover:scale-105"
                  title="Manage friends"
                >
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span className="hidden sm:inline font-semibold">Friends</span>
                </button>
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || userName} 
                    className="w-10 h-10 rounded-full ring-2 ring-blue-100 hover:ring-blue-300 transition-all cursor-pointer"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center ring-2 ring-blue-100 hover:ring-blue-300 transition-all cursor-pointer">
                    <span className="text-white font-semibold text-sm">
                      {userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <button
                  onClick={onLogout}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 hover:shadow-md transition-all transform hover:scale-105"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;