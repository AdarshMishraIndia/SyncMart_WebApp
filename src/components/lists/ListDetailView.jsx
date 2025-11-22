import React, { useState, useEffect } from 'react';
import { useListItems } from '../../hooks/useListItems.js';
import { canManageItems } from '../../utils/permissions.js';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import AddItemsDialog from './AddItemsDialog.jsx';
import ItemsList from './ItemsList.jsx';
import ItemMetadataDialog from './ItemMetadataDialog.jsx';

const ListDetailView = ({ list, userEmail, onClose }) => {
  if (!list || !list.id) {
    console.error('ListDetailView: Invalid list prop', list);
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: Invalid list data</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const { pendingItems, finishedItems, loading } = useListItems(list.id);
  const [activeTab, setActiveTab] = useState('pending');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [metadataItem, setMetadataItem] = useState(null);

  const isSelectionMode = selectedItems.size > 0;
  const hasItemPermissions = canManageItems(list, userEmail);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (isSelectionMode) {
          setSelectedItems(new Set());
        } else if (showAddDialog) {
          setShowAddDialog(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isSelectionMode, showAddDialog, onClose]);

  const toggleItemSelection = (itemId) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      newSet.has(itemId) ? newSet.delete(itemId) : newSet.add(itemId);
      return newSet;
    });
  };

  const clearSelection = () => setSelectedItems(new Set());

  const handleShare = () => {
    if (pendingItems.length === 0) {
      alert('No pending items to share');
      return;
    }

    const text = pendingItems.map(item => `• ${item.name}`).join('\n');
    
    if (navigator.share) {
      navigator.share({
        title: list.listName,
        text: text,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      alert('List copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <LoadingSpinner fullScreen={false} message="Loading items..." />
      </div>
    );
  }

  const currentItems = activeTab === 'pending' ? pendingItems : finishedItems;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center flex-1">
            <button
              onClick={isSelectionMode ? clearSelection : onClose}
              className="mr-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-900">
                {isSelectionMode ? `${selectedItems.size} Selected` : list.listName}
              </h1>
              {!isSelectionMode && activeTab === 'pending' && (
                <p className="text-xs text-gray-500">
                  {pendingItems.length} pending item{pendingItems.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isSelectionMode ? (
              <>
                {hasItemPermissions && (
                  <button
                    onClick={() => {
                      const event = new CustomEvent('deleteSelectedItems');
                      window.dispatchEvent(event);
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                )}
              </>
            ) : (
              <>
                {activeTab === 'pending' && pendingItems.length > 0 && (
                  <button
                    onClick={handleShare}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Share list"
                  >
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {!isSelectionMode && (
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'pending'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Pending {pendingItems.length > 0 && `(${pendingItems.length})`}
            </button>
            <button
              onClick={() => setActiveTab('finished')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'finished'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Finished {finishedItems.length > 0 && `(${finishedItems.length})`}
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <ItemsList
          items={currentItems}
          listId={list.id}
          isPendingTab={activeTab === 'pending'}
          canEdit={hasItemPermissions}
          selectedItems={selectedItems}
          isSelectionMode={isSelectionMode}
          onToggleSelection={toggleItemSelection}
          onClearSelection={clearSelection}
          onShowMetadata={setMetadataItem}
        />
      </div>

      {hasItemPermissions && activeTab === 'pending' && !isSelectionMode && (
        <button
          onClick={() => setShowAddDialog(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110 flex items-center justify-center"
          aria-label="Add items"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}

      <AddItemsDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        listId={list.id}
        userEmail={userEmail}
      />

      {metadataItem && (
        <ItemMetadataDialog
          item={metadataItem}
          onClose={() => setMetadataItem(null)}
        />
      )}
    </div>
  );
};

export default ListDetailView;