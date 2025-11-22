import React, { useState, useEffect } from 'react';
import { useShoppingLists } from '../../hooks/useShoppingLists.js';
import { useFriends } from '../../hooks/useFriends.js';
import { getUserData } from '../../services/userService.js';
import { deleteLists } from '../../services/listService.js';
import { hasOwnerPermission } from '../../utils/permissions.js';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import ConfirmDialog from '../common/ConfirmDialog.jsx';
import Header from './Header.jsx';
import ListCard from './ListCard.jsx';
import EmptyState from './EmptyState.jsx';
import CreateListDialog from '../lists/CreateListDialog.jsx';
import ListDetailView from '../lists/ListDetailView.jsx';
import FriendsPage from '../friends/FriendsPage.jsx';

const Dashboard = ({ user, onLogout }) => {
  const { lists, loading: listsLoading } = useShoppingLists(user.email);
  const { friends } = useFriends(user.email);
  
  const [userName, setUserName] = useState('User');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingList, setEditingList] = useState(null);
  const [selectedLists, setSelectedLists] = useState(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
  const [showFriendsPage, setShowFriendsPage] = useState(false);

  useEffect(() => {
    const loadUserName = async () => {
      const result = await getUserData(user.email);
      if (result.success) {
        const firstName = result.data.name?.split(' ')[0] || 'User';
        setUserName(firstName);
      }
    };
    
    loadUserName();
  }, [user.email]);

  const isSelectionMode = selectedLists.size > 0;

  const toggleSelection = (listId) => {
    setSelectedLists(prev => {
      const newSet = new Set(prev);
      newSet.has(listId) ? newSet.delete(listId) : newSet.add(listId);
      return newSet;
    });
  };

  const clearSelection = () => setSelectedLists(new Set());

  const handleDeleteClick = () => setShowDeleteConfirm(true);

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    
    const result = await deleteLists(Array.from(selectedLists));
    
    if (result.success) {
      clearSelection();
    } else {
      alert(`Failed to delete lists: ${result.error}`);
    }
    
    setIsDeleting(false);
    setShowDeleteConfirm(false);
  };

  const handleEditList = (list) => {
    setEditingList(list);
    setShowCreateDialog(true);
  };

  const handleOpenList = (list) => {
    setSelectedList(list);
  };

  const handleCloseDialog = () => {
    setShowCreateDialog(false);
    setEditingList(null);
  };

  const canDeleteSelected = () => {
    return Array.from(selectedLists).every(listId => {
      const list = lists.find(l => l.id === listId);
      return list && hasOwnerPermission(list, user.email);
    });
  };

  const getPendingCount = (list) => {
    return Object.values(list.items || {}).filter(item => item.pending).length;
  };

  if (listsLoading) {
    return <LoadingSpinner message="Loading your lists..." />;
  }

  if (showFriendsPage) {
    return (
      <FriendsPage
        user={user}
        onBack={() => setShowFriendsPage(false)}
      />
    );
  }

  if (selectedList) {
    return (
      <ListDetailView
        list={selectedList}
        userEmail={user.email}
        onClose={() => setSelectedList(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        user={user}
        userName={userName}
        isSelectionMode={isSelectionMode}
        selectedCount={selectedLists.size}
        canDeleteSelected={canDeleteSelected()}
        onClearSelection={clearSelection}
        onDeleteSelected={handleDeleteClick}
        onLogout={onLogout}
        onNavigateToFriends={() => setShowFriendsPage(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {lists.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lists.map(list => (
              <ListCard
                key={list.id}
                list={list}
                userEmail={user.email}
                isSelected={selectedLists.has(list.id)}
                isSelectionMode={isSelectionMode}
                pendingCount={getPendingCount(list)}
                onToggleSelection={toggleSelection}
                onEdit={handleEditList}
                onOpen={handleOpenList}
              />
            ))}
          </div>
        )}
      </main>

      <button
        onClick={() => {
          setEditingList(null);
          setShowCreateDialog(true);
        }}
        className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110 flex items-center justify-center"
        aria-label="Create new list"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      <CreateListDialog
        isOpen={showCreateDialog}
        onClose={handleCloseDialog}
        userEmail={user.email}
        friends={friends}
        existingList={editingList}
      />

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Lists?"
        message={`Are you sure you want to delete ${selectedLists.size} list(s)? This action cannot be undone.`}
        confirmText={isDeleting ? 'Deleting...' : 'Delete'}
        variant="danger"
      />
    </div>
  );
};

export default Dashboard;