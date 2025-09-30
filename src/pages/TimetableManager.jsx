// TimeTableManager.jsx
import React, { useState, useEffect } from 'react';
import { 
  addTimetableEntry, 
  getAllTimetableEntries, 
  getTimetableByDay, 
  getTimetableById, 
  updateTimetableEntry, 
  deleteTimetableEntry 
} from '../utils/timetableService.js';

const TimeTableManager = () => {
  const [timetableEntries, setTimetableEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState('All');
  const [editingEntry, setEditingEntry] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    dayOfWeek: 'Monday',
    classLevel: '',
    subject: '',
    startTime: '',
    endTime: ''
  });

  const daysOfWeek = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Load all timetable entries on component mount
  useEffect(() => {
    loadTimetableEntries();
  }, []);

  // Filter entries when selectedDay changes
  useEffect(() => {
    filterEntriesByDay();
  }, [selectedDay, timetableEntries]);

  const loadTimetableEntries = async () => {
    setLoading(true);
    try {
      const entries = await getAllTimetableEntries();
      setTimetableEntries(entries);
    } catch (error) {
      console.error('Error loading timetable entries:', error);
      alert('Error loading timetable entries');
    } finally {
      setLoading(false);
    }
  };

  const filterEntriesByDay = async () => {
    if (selectedDay === 'All') {
      setFilteredEntries(timetableEntries);
    } else {
      try {
        const entries = await getTimetableByDay(selectedDay);
        setFilteredEntries(entries);
      } catch (error) {
        console.error('Error filtering entries:', error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.classLevel || !formData.subject || !formData.startTime || !formData.endTime) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      if (editingEntry) {
        // Update existing entry
        await updateTimetableEntry(editingEntry.id, formData);
        alert('Timetable entry updated successfully!');
      } else {
        // Add new entry
        await addTimetableEntry(
          formData.dayOfWeek,
          formData.classLevel,
          formData.subject,
          formData.startTime,
          formData.endTime
        );
        alert('Timetable entry added successfully!');
      }
      
      // Reset form and reload data
      resetForm();
      await loadTimetableEntries();
    } catch (error) {
      console.error('Error saving timetable entry:', error);
      alert('Error saving timetable entry');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setFormData({
      dayOfWeek: entry.dayOfWeek,
      classLevel: entry.classLevel,
      subject: entry.subject,
      startTime: entry.startTime,
      endTime: entry.endTime
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this timetable entry?')) {
      setLoading(true);
      try {
        await deleteTimetableEntry(id);
        await loadTimetableEntries();
        alert('Timetable entry deleted successfully!');
      } catch (error) {
        console.error('Error deleting timetable entry:', error);
        alert('Error deleting timetable entry');
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      dayOfWeek: 'Monday',
      classLevel: '',
      subject: '',
      startTime: '',
      endTime: ''
    });
    setEditingEntry(null);
    setShowForm(false);
  };

  const groupEntriesByDay = (entries) => {
    const grouped = {};
    entries.forEach(entry => {
      if (!grouped[entry.dayOfWeek]) {
        grouped[entry.dayOfWeek] = [];
      }
      grouped[entry.dayOfWeek].push(entry);
    });
    return grouped;
  };

  const groupedEntries = groupEntriesByDay(filteredEntries);

  return (
    <div className="min-h-screen bg-slate-300 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-slate-800 text-white rounded-lg p-6 mb-6 shadow-lg">
          <h1 className="text-3xl font-bold mb-2">Timetable Manager</h1>
          <p className="text-slate-300">Manage your class schedule efficiently</p>
        </div>

        {/* Controls */}
        <div className="bg-slate-700 rounded-lg p-4 mb-6 shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <label className="text-white font-medium">Filter by Day:</label>
              <select 
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="bg-slate-600 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                {daysOfWeek.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
            
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded-lg transition duration-200 font-medium"
            >
              {showForm ? 'Cancel' : 'Add New Entry'}
            </button>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-slate-700 rounded-lg p-6 mb-6 shadow-md">
            <h2 className="text-xl font-semibold text-white mb-4">
              {editingEntry ? 'Edit Timetable Entry' : 'Add New Timetable Entry'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-300 mb-2">Day of Week</label>
                <select
                  name="dayOfWeek"
                  value={formData.dayOfWeek}
                  onChange={handleInputChange}
                  className="w-full bg-slate-600 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
                  required
                >
                  {daysOfWeek.filter(day => day !== 'All').map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-slate-300 mb-2">Class Level</label>
                <input
                  type="text"
                  name="classLevel"
                  value={formData.classLevel}
                  onChange={handleInputChange}
                  className="w-full bg-slate-600 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
                  placeholder="e.g., Grade 10, Class A"
                  required
                />
              </div>
              
              <div>
                <label className="block text-slate-300 mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full bg-slate-600 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
                  placeholder="e.g., Mathematics"
                  required
                />
              </div>
              
              <div>
                <label className="block text-slate-300 mb-2">Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className="w-full bg-slate-600 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-slate-300 mb-2">End Time</label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="w-full bg-slate-600 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
                  required
                />
              </div>
              
              <div className="flex items-end space-x-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg transition duration-200 font-medium disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (editingEntry ? 'Update' : 'Add Entry')}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-slate-600 hover:bg-slate-500 text-white px-6 py-2 rounded-lg transition duration-200 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Loading State */}
        {loading && !showForm && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <p className="text-slate-700 mt-2">Loading timetable...</p>
          </div>
        )}

        {/* Timetable Display */}
        {!loading && (
          <div className="space-y-6">
            {Object.keys(groupedEntries).length === 0 ? (
              <div className="bg-slate-700 rounded-lg p-8 text-center">
                <p className="text-slate-300 text-lg">No timetable entries found.</p>
                <p className="text-slate-400">Add your first entry using the form above.</p>
              </div>
            ) : (
              Object.entries(groupedEntries).map(([day, entries]) => (
                <div key={day} className="bg-slate-700 rounded-lg shadow-md overflow-hidden">
                  <div className="bg-slate-800 px-6 py-4">
                    <h3 className="text-xl font-semibold text-white">{day}</h3>
                  </div>
                  <div className="p-6">
                    <div className="grid gap-4">
                      {entries.map(entry => (
                        <div key={entry.id} className="bg-slate-600 rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0">
                          <div className="flex-1">
                            <div className="text-white font-medium">{entry.subject}</div>
                            <div className="text-slate-300 text-sm">{entry.classLevel}</div>
                            <div className="text-slate-400 text-sm">
                              {entry.startTime} - {entry.endTime}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(entry)}
                              className="bg-indigo-950 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm transition duration-200"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(entry.id)}
                              className="bg-rose-900 hover:bg-red-500 text-white px-3 py-1 rounded text-sm transition duration-200"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeTableManager;
