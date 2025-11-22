import React from 'react';

const EmptyState = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">No Lists Yet</h2>
      <p className="text-gray-600 mb-6">
        Create your first shopping list to get started
      </p>
      <p className="text-sm text-gray-500">
        Click the <span className="font-medium">+</span> button in the bottom right corner
      </p>
    </div>
  );
};

export default EmptyState;