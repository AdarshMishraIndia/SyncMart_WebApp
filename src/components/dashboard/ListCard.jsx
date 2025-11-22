import React from 'react';
import { hasOwnerPermission } from '../../utils/permissions.js';

const ListCard = ({ 
  list, 
  userEmail, 
  isSelected, 
  isSelectionMode, 
  pendingCount,
  onToggleSelection, 
  onEdit,
  onOpen
}) => {
  const isOwner = hasOwnerPermission(list, userEmail);
  const collaboratorCount = list.accessEmails?.length || 0;
  const totalItems = Object.keys(list.items || {}).length;
  const completedItems = totalItems - pendingCount;
  const progressPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  const handleClick = () => {
    if (isSelectionMode) {
      onToggleSelection(list.id);
    } else {
      onOpen(list);
    }
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    onToggleSelection(list.id);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit(list);
  };

  return (
    <div
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      className={`relative bg-white rounded-2xl p-6 shadow-sm border-2 transition-all duration-300 cursor-pointer card-hover fade-in ${
        isSelected
          ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl scale-105'
          : isOwner
          ? 'border-blue-200 hover:border-blue-400 hover:shadow-xl'
          : 'border-gray-200 hover:border-gray-400 hover:shadow-xl'
      }`}
    >
      {isSelected && (
        <div className="absolute top-4 right-4 z-10">
          <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0 pr-2">
          <h3 className="text-xl font-bold text-gray-900 truncate mb-2">
            {list.listName}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${
              isOwner 
                ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {isOwner ? 'Owner' : 'Member'}
            </span>
            {collaboratorCount > 0 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800">
                <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {collaboratorCount}
              </span>
            )}
          </div>
        </div>
        {pendingCount > 0 && (
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500 rounded-full blur-md opacity-40 animate-pulse"></div>
              <span className="relative inline-flex items-center justify-center w-10 h-10 text-sm font-bold bg-gradient-to-br from-red-500 to-red-600 text-white rounded-full shadow-lg">
                {pendingCount}
              </span>
            </div>
          </div>
        )}
      </div>

      {totalItems > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1.5">
            <span className="font-medium">Progress</span>
            <span className="font-semibold">{completedItems}/{totalItems} items</span>
          </div>
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
                progressPercentage === 100 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                  : 'bg-gradient-to-r from-blue-500 to-indigo-500'
              }`}
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {totalItems > 0 ? (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="font-medium">{totalItems} total</span>
            </div>
          ) : (
            <span className="italic">No items yet</span>
          )}
        </div>

        {!isSelectionMode && isOwner && (
          <button
            onClick={handleEditClick}
            className="px-3 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all transform hover:scale-105"
          >
            Edit
          </button>
        )}
      </div>

      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 opacity-0 hover:opacity-5 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
};

export default ListCard;