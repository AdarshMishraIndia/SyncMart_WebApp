import React from 'react';

const LoadingSpinner = ({ message = 'Loading...', fullScreen = true }) => {
  const content = (
    <div className="bg-white rounded-2xl p-8 shadow-2xl scale-in">
      <div className="relative w-16 h-16 mx-auto mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-indigo-600 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.75s' }}></div>
      </div>
      <p className="text-gray-700 font-semibold text-center">{message}</p>
      <div className="mt-4 flex justify-center gap-1">
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      {content}
    </div>
  );
};

export default LoadingSpinner;