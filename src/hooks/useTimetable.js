import { useState, useEffect } from 'react';
import * as timetableDB from '../utils/timetableDAL';

export const useTimetable = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
 // const classes = ['Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5', 'Basic 6', 'JHS 1', 'JHS 2', 'JHS 3'];

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      setLoading(true);
      const data = await timetableDB.getAllTimetableEntries();
      setEntries(data.sort((a, b) => {
        const dayOrder = daysOfWeek.indexOf(a.dayOfWeek) - daysOfWeek.indexOf(b.dayOfWeek);
        if (dayOrder !== 0) return dayOrder;
        return a.startTime.localeCompare(b.startTime);
      }));
    } catch (error) {
      showNotification('Error loading timetable entries', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  const addEntry = async (formData) => {
    try {
      await timetableDB.addTimetableEntry(formData);
      await loadEntries();
      showNotification('Timetable entry added successfully!', 'success');
      return true;
    } catch (error) {
      showNotification('Error adding timetable entry', 'error');
      return false;
    }
  };

  const deleteEntry = async (id) => {
    try {
      await timetableDB.deleteTimetableEntry(id);
      await loadEntries();
      showNotification('Entry deleted successfully!', 'success');
    } catch (error) {
      showNotification('Error deleting entry', 'error');
    }
  };

  const clearAllEntries = async () => {
    try {
      await timetableDB.clearAllTimetableEntries();
      await loadEntries();
      showNotification('All entries cleared successfully!', 'success');
    } catch (error) {
      showNotification('Error clearing entries', 'error');
    }
  };

  const exportData = async () => {
    try {
      await timetableDB.exportTimetableData();
      showNotification('Timetable exported successfully!', 'success');
    } catch (error) {
      showNotification('Error exporting timetable', 'error');
    }
  };

  return {
    entries,
    loading,
    notification,
    setNotification,
    addEntry,
    deleteEntry,
    clearAllEntries,
    exportData
  };
};