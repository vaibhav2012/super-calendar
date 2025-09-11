import { useState, useEffect } from 'react';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

// Hook for managing tasks in Firestore
export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setTasks([]);
      setLoading(false);
      return;
    }

    const tasksRef = collection(db, 'users', currentUser.uid, 'tasks');
    const q = query(tasksRef, orderBy('date', 'asc'));

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const tasksData = [];
        snapshot.forEach((doc) => {
          tasksData.push({ id: doc.id, ...doc.data() });
        });
        setTasks(tasksData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching tasks:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const addTask = async (taskData) => {
    if (!currentUser) throw new Error('User not authenticated');
    
    try {
      const taskRef = doc(collection(db, 'users', currentUser.uid, 'tasks'));
      await setDoc(taskRef, {
        ...taskData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return taskRef.id;
    } catch (err) {
      console.error('Error adding task:', err);
      throw err;
    }
  };

  const updateTask = async (taskId, taskData) => {
    if (!currentUser) throw new Error('User not authenticated');
    
    try {
      const taskRef = doc(db, 'users', currentUser.uid, 'tasks', taskId);
      await updateDoc(taskRef, {
        ...taskData,
        updatedAt: new Date()
      });
    } catch (err) {
      console.error('Error updating task:', err);
      throw err;
    }
  };

  const deleteTask = async (taskId) => {
    if (!currentUser) throw new Error('User not authenticated');
    
    try {
      const taskRef = doc(db, 'users', currentUser.uid, 'tasks', taskId);
      await deleteDoc(taskRef);
    } catch (err) {
      console.error('Error deleting task:', err);
      throw err;
    }
  };

  const batchUpdateTasks = async (updates) => {
    if (!currentUser) throw new Error('User not authenticated');
    
    try {
      const batch = writeBatch(db);
      
      updates.forEach(({ taskId, data }) => {
        const taskRef = doc(db, 'users', currentUser.uid, 'tasks', taskId);
        batch.update(taskRef, {
          ...data,
          updatedAt: new Date()
        });
      });
      
      await batch.commit();
    } catch (err) {
      console.error('Error batch updating tasks:', err);
      throw err;
    }
  };

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    batchUpdateTasks
  };
}

// Hook for managing user settings in Firestore
export function useSettings() {
  const [settings, setSettings] = useState({
    view: 'week',
    darkMode: false,
    startOfWeek: 'sunday'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const settingsRef = doc(db, 'users', currentUser.uid, 'settings', 'userSettings');
    
    const unsubscribe = onSnapshot(settingsRef, 
      (doc) => {
        if (doc.exists()) {
          setSettings(doc.data());
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching settings:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const updateSettings = async (newSettings) => {
    if (!currentUser) throw new Error('User not authenticated');
    
    try {
      const settingsRef = doc(db, 'users', currentUser.uid, 'settings', 'userSettings');
      await setDoc(settingsRef, {
        ...settings,
        ...newSettings,
        updatedAt: new Date()
      }, { merge: true });
    } catch (err) {
      console.error('Error updating settings:', err);
      throw err;
    }
  };

  return {
    settings,
    loading,
    error,
    updateSettings
  };
}

// Hook for managing recurring task data in Firestore
export function useRecurringData() {
  const [recurringData, setRecurringData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setRecurringData({});
      setLoading(false);
      return;
    }

    const recurringRef = collection(db, 'users', currentUser.uid, 'recurringData');
    
    const unsubscribe = onSnapshot(recurringRef, 
      (snapshot) => {
        const data = {};
        snapshot.forEach((doc) => {
          data[doc.id] = doc.data();
        });
        setRecurringData(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching recurring data:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const updateRecurringData = async (key, data) => {
    if (!currentUser) throw new Error('User not authenticated');
    
    try {
      const recurringRef = doc(db, 'users', currentUser.uid, 'recurringData', key);
      
      // Handle different data types
      if (typeof data === 'boolean' || typeof data === 'string' || typeof data === 'number') {
        // For primitive values (like completion status), store directly
        await setDoc(recurringRef, {
          value: data,
          updatedAt: new Date()
        }, { merge: true });
      } else {
        // For objects, spread the data
        await setDoc(recurringRef, {
          ...data,
          updatedAt: new Date()
        }, { merge: true });
      }
    } catch (err) {
      console.error('Error updating recurring data:', err);
      throw err;
    }
  };

  const deleteRecurringData = async (key) => {
    if (!currentUser) throw new Error('User not authenticated');
    
    try {
      const recurringRef = doc(db, 'users', currentUser.uid, 'recurringData', key);
      await deleteDoc(recurringRef);
    } catch (err) {
      console.error('Error deleting recurring data:', err);
      throw err;
    }
  };

  const batchUpdateRecurringData = async (updates) => {
    if (!currentUser) throw new Error('User not authenticated');
    
    try {
      const batch = writeBatch(db);
      
      updates.forEach(({ key, data }) => {
        const recurringRef = doc(db, 'users', currentUser.uid, 'recurringData', key);
        if (data === null) {
          batch.delete(recurringRef);
        } else {
          batch.set(recurringRef, {
            ...data,
            updatedAt: new Date()
          }, { merge: true });
        }
      });
      
      await batch.commit();
    } catch (err) {
      console.error('Error batch updating recurring data:', err);
      throw err;
    }
  };

  return {
    recurringData,
    loading,
    error,
    updateRecurringData,
    deleteRecurringData,
    batchUpdateRecurringData
  };
}
