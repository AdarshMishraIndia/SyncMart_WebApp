import React from 'react';
import { useAuth } from './hooks/useAuth.js';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import LoadingSpinner from './components/common/LoadingSpinner.jsx';
import AuthPage from './components/auth/AuthPage.jsx';
import Dashboard from './components/dashboard/Dashboard.jsx';

const App = () => {
  const { user, loading, error, signInWithGoogle, logout, clearError } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Initializing..." />;
  }

  return (
    <ErrorBoundary>
      {user ? (
        <Dashboard user={user} onLogout={logout} />
      ) : (
        <AuthPage 
          onSignIn={signInWithGoogle} 
          loading={loading} 
          error={error} 
          clearError={clearError} 
        />
      )}
    </ErrorBoundary>
  );
};

export default App;