import { 
  collection, 
  doc, 
  setDoc, 
  writeBatch 
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Migrate localStorage data to Firestore
export async function migrateLocalStorageToFirestore(userId) {
  try {
    const batch = writeBatch(db);
    
    // Migrate tasks
    const tasksData = localStorage.getItem('tasks');
    if (tasksData) {
      const tasks = JSON.parse(tasksData);
      const tasksRef = collection(db, 'users', userId, 'tasks');
      
      tasks.forEach((task) => {
        const taskRef = doc(tasksRef);
        batch.set(taskRef, {
          ...task,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      });
    }
    
    // Migrate settings
    const settingsData = localStorage.getItem('settings');
    if (settingsData) {
      const settings = JSON.parse(settingsData);
      const settingsRef = doc(db, 'users', userId, 'settings', 'userSettings');
      batch.set(settingsRef, {
        ...settings,
        updatedAt: new Date()
      });
    }
    
    // Migrate recurring task data
    const recurringKeys = Object.keys(localStorage).filter(key => 
      key.startsWith('task_completion_') || 
      key.startsWith('task_update_') || 
      key.startsWith('task_global_update_') ||
      key.startsWith('task_deleted_')
    );
    
    if (recurringKeys.length > 0) {
      const recurringRef = collection(db, 'users', userId, 'recurringData');
      
      recurringKeys.forEach((key) => {
        const data = localStorage.getItem(key);
        if (data) {
          const recurringDocRef = doc(recurringRef, key);
          batch.set(recurringDocRef, {
            key,
            value: JSON.parse(data),
            updatedAt: new Date()
          });
        }
      });
    }
    
    await batch.commit();
    
    // Clear localStorage after successful migration
    localStorage.removeItem('tasks');
    localStorage.removeItem('settings');
    recurringKeys.forEach(key => localStorage.removeItem(key));
    
    console.log('Data migration completed successfully');
    return true;
  } catch (error) {
    console.error('Error migrating data:', error);
    throw error;
  }
}

// Check if user has existing localStorage data
export function hasLocalStorageData() {
  const tasksData = localStorage.getItem('tasks');
  const settingsData = localStorage.getItem('settings');
  const recurringKeys = Object.keys(localStorage).filter(key => 
    key.startsWith('task_completion_') || 
    key.startsWith('task_update_') || 
    key.startsWith('task_global_update_') ||
    key.startsWith('task_deleted_')
  );
  
  return !!(tasksData || settingsData || recurringKeys.length > 0);
}

// Get localStorage data summary for user confirmation
export function getLocalStorageDataSummary() {
  const tasksData = localStorage.getItem('tasks');
  const settingsData = localStorage.getItem('settings');
  const recurringKeys = Object.keys(localStorage).filter(key => 
    key.startsWith('task_completion_') || 
    key.startsWith('task_update_') || 
    key.startsWith('task_global_update_') ||
    key.startsWith('task_deleted_')
  );
  
  const summary = {
    tasks: tasksData ? JSON.parse(tasksData).length : 0,
    settings: !!settingsData,
    recurringData: recurringKeys.length
  };
  
  return summary;
}
