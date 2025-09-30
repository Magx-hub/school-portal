import { useEffect, useState } from "react";
import { addStudent, getAllStudents, deleteStudent } from "../utils/studentService";

export default function StudentManager() {
  const [students, setStudents] = useState([]);
  const [fullname, setFullname] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [gender, setGender] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Load students on mount
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const allStudents = await getAllStudents();
      setStudents(allStudents);
      setError("");
    } catch (err) { // eslint-disable-line no-unused-vars
      setError("Failed to load students");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStudent = async () => {
    if (!fullname || !classLevel || !gender) {
      setError("Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    try {
      await addStudent(fullname, classLevel, gender);
      setFullname("");
      setClassLevel("");
      setGender("");
      setError("");
      await fetchStudents();
    } catch (err) { // eslint-disable-line no-unused-vars
      setError("Failed to add student");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    
    try {
      await deleteStudent(id);
      await fetchStudents();
    } catch (err) { // eslint-disable-line no-unused-vars
      setError("Failed to delete student");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddStudent();
  };

  return (
    <div className="min-h-screen bg-slate-300 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Student Manager</h1>
          <p className="text-slate-600">Manage your student records efficiently</p>
        </div>

        {/* Add Student Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Add New Student</h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fullname" className="block text-sm font-medium text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  id="fullname"
                  type="text"
                  placeholder="Enter full name"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-colors"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="classLevel" className="block text-sm font-medium text-slate-700 mb-1">
                  Class Level *
                </label>
                <select
                  id="classLevel"
                  value={classLevel}
                  onChange={(e) => setClassLevel(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-colors"
                  disabled={isLoading}
                >
                  <option value="">Select Class Level</option>
                  {[
                    "Nursery 1", "Nursery 2", "KG 1", "KG 2", 
                    "Basic 1", "Basic 2", "Basic 3", "Basic 4", "Basic 5", "Basic 6", 
                    "JHS 1", "JHS 2", "JHS 3"
                  ].map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-slate-700 mb-1">
                Gender *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center p-3 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={gender === "Male"}
                    onChange={(e) => setGender(e.target.value)}
                    className="text-slate-600 focus:ring-slate-500"
                    disabled={isLoading}
                  />
                  <span className="ml-2 text-slate-700">Male</span>
                </label>
                <label className="flex items-center p-3 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={gender === "Female"}
                    onChange={(e) => setGender(e.target.value)}
                    className="text-slate-600 focus:ring-slate-500"
                    disabled={isLoading}
                  />
                  <span className="ml-2 text-slate-700">Female</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-700 text-white py-3 px-4 rounded-lg font-medium hover:bg-slate-800 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Adding Student..." : "Add Student"}
            </button>
          </form>
        </div>

        {/* Student List Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-slate-800">Student List</h2>
            <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium">
              {students.length} students
            </span>
          </div>

          {isLoading && students.length === 0 ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mx-auto"></div>
              <p className="text-slate-600 mt-2">Loading students...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-slate-400 mb-2">No students added yet</div>
              <p className="text-slate-500 text-sm">Add your first student using the form above</p>
            </div>
          ) : (
            <div className="space-y-3">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      student.gender === "Male" ? "bg-blue-100 text-blue-600" : "bg-pink-100 text-pink-600"
                    }`}>
                      {student.gender === "Male" ? "♂" : "♀"}
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900">{student.fullname}</h3>
                      <p className="text-sm text-slate-600">
                        {student.classLevel} • {student.gender}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDelete(student.id)}
                    disabled={isLoading}
                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50"
                    title="Delete student"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}