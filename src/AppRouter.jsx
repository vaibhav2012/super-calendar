import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LandingPage from './components/LandingPage';
import CalendarApp from './App';
import Auth from './components/Auth';
import MigrationModal from './components/MigrationModal';
import { hasLocalStorageData } from './utils/migrateData';
import { useState, useEffect } from 'react';

function AppRouter() {
  const { currentUser } = useAuth();
  const [showMigrationModal, setShowMigrationModal] = useState(false);
  const [migrationCompleted, setMigrationCompleted] = useState(false);

  // Check for localStorage data on first login
  useEffect(() => {
    if (currentUser && !migrationCompleted && hasLocalStorageData()) {
      setShowMigrationModal(true);
    }
  }, [currentUser, migrationCompleted]);

  const handleMigrationComplete = () => {
    setShowMigrationModal(false);
    setMigrationCompleted(true);
  };

  return (
    <Router>
      <Routes>
        {/* Landing Page - accessible to everyone */}
        <Route path="/" element={<LandingPage />} />
        
        {/* App Routes - require authentication */}
        <Route 
          path="/app" 
          element={
            currentUser ? (
              <>
                <CalendarApp />
                {showMigrationModal && (
                  <MigrationModal 
                    isOpen={showMigrationModal}
                    onClose={() => setShowMigrationModal(false)}
                    onComplete={handleMigrationComplete}
                  />
                )}
              </>
            ) : (
              <Auth />
            )
          } 
        />
        
        {/* Redirect any other routes to landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
