import React, { useState } from 'react';
import { migrateLocalStorageToFirestore, getLocalStorageDataSummary } from '../utils/migrateData';
import { useAuth } from '../contexts/AuthContext';
import './MigrationModal.css';

export default function MigrationModal({ isOpen, onClose, onComplete }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dataSummary] = useState(getLocalStorageDataSummary());
  const { currentUser } = useAuth();

  const handleMigrate = async () => {
    setLoading(true);
    setError('');
    
    try {
      if (!currentUser) {
        throw new Error('User not authenticated');
      }
      await migrateLocalStorageToFirestore(currentUser.uid);
      onComplete();
    } catch (err) {
      setError('Migration failed: ' + err.message);
      console.error('Migration error:', err);
    }
    
    setLoading(false);
  };

  const handleSkip = () => {
    onComplete();
  };

  if (!isOpen) return null;

  return (
    <div className="migration-modal-overlay">
      <div className="migration-modal">
        <div className="migration-header">
          <h2>Welcome to the Cloud!</h2>
          <p>We found existing data in your browser. Would you like to migrate it to your account?</p>
        </div>
        
        <div className="migration-content">
          <div className="data-summary">
            <h3>Data to migrate:</h3>
            <ul>
              {dataSummary.tasks > 0 && (
                <li>{dataSummary.tasks} task{dataSummary.tasks !== 1 ? 's' : ''}</li>
              )}
              {dataSummary.settings && (
                <li>User settings</li>
              )}
              {dataSummary.recurringData > 0 && (
                <li>{dataSummary.recurringData} recurring task data entries</li>
              )}
            </ul>
          </div>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <div className="migration-actions">
            <button 
              onClick={handleMigrate}
              disabled={loading}
              className="migrate-button"
            >
              {loading ? 'Migrating...' : 'Migrate Data'}
            </button>
            
            <button 
              onClick={handleSkip}
              disabled={loading}
              className="skip-button"
            >
              Start Fresh
            </button>
          </div>
          
          <div className="migration-note">
            <p>
              <strong>Note:</strong> Migrating will move your data to the cloud and clear your browser storage. 
              You can always start fresh if you prefer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
