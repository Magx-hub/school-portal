import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  Edit, 
  Trash2, 
  Download, 
  ChevronDown,
  ChevronUp,
  BookOpen,
  GraduationCap,
  Menu,
  X,
  CheckCircle
} from 'lucide-react';

// Real database service imports
import {
  initDBWithDefaults,
  addQuestion,
  getAllQuestions,
  getQuestionsByClassAndSubject,
  getQuestionsByType,
  getMCQQuestionsForTest,
  updateQuestion,
  deleteQuestion,
  searchQuestions,
  getQuestionsByFilters,
  getQuestionsCount
} from '../utils/questionBankService.js';

// PDF generation imports
import { jsPDF } from 'jspdf';

const QuestionBankManager = () => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10; // Adjust as needed
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showExamGenerator, setShowExamGenerator] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('questions');
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  
  const [filters, setFilters] = useState({
    class: '',
    subject: '',
    question_type: ''
  });
  
  const [examConfig, setExamConfig] = useState({
    class: '',
    subject: '',
    count: 10,
    title: 'End of Term Examination',
    instructions: 'Answer all questions. Each question carries equal marks.',
    includeAnswerKey: false
  });

  const [formData, setFormData] = useState({
    class: '',
    subject: '',
    question_type: 'MCQ',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    answer: ''
  });

  const classes = ['Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5', 'Basic 6', 'Basic 7', 'Basic 8', 'Basic 9'];
  const subjects = ['English Language', 'Mathematics', 'Science', 'Social Studies', 'History', 'RME', 'Computing', 'French', 'Ghanaian Language', 'Creative Arts', 'Career Technology'];
  const questionTypes = ['MCQ', 'True/False', 'Short Answer', 'Essay'];

  // Initialize database and load questions
  useEffect(() => {
    initializeDatabase();
  }, []);

  useEffect(() => {
    filterQuestions();
    setCurrentPage(1); // Reset to first page on filter/search change
  }, [filters, searchTerm, questions]);

  const initializeDatabase = async () => {
    setLoading(true);
    try {
      await initDBWithDefaults();
      await loadQuestions();
    } catch (error) {
      console.error('Error initializing database:', error);
      alert('Error initializing question bank');
    } finally {
      setLoading(false);
    }
  };

  const loadQuestions = async () => {
    try {
      const allQuestions = await getAllQuestions();
      setQuestions(allQuestions);
    } catch (error) {
      console.error('Error loading questions:', error);
    }
  };

  const filterQuestions = async () => {
    setLoading(true);
    try {
      let filtered = questions;

      if (searchTerm) {
        filtered = await searchQuestions(searchTerm);
      }

      if (filters.class || filters.subject || filters.question_type) {
        filtered = await getQuestionsByFilters(filters);
      }

      setFilteredQuestions(filtered);
    } catch (error) {
      console.error('Error filtering questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.class || !formData.subject || !formData.question) {
      alert('Please fill in required fields');
      return;
    }

    if (formData.question_type === 'MCQ' && formData.options.some(opt => !opt)) {
      alert('Please fill in all options for MCQ questions');
      return;
    }

    setLoading(true);
    try {
      if (editingQuestion) {
        await updateQuestion({ ...editingQuestion, ...formData });
        alert('Question updated successfully!');
      } else {
        await addQuestion(formData);
        alert('Question added successfully!');
      }

      resetForm();
      await loadQuestions();
      setActiveTab('questions');
    } catch (error) {
      console.error('Error saving question:', error);
      alert('Error saving question');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setFormData({
      class: question.class,
      subject: question.subject,
      question_type: question.question_type,
      question: question.question,
      options: question.options || ['', '', '', ''],
      correctAnswer: question.correctAnswer || 0,
      answer: question.answer || ''
    });
    setShowForm(true);
    setActiveTab('add');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      setLoading(true);
      try {
        await deleteQuestion(id);
        await loadQuestions();
        alert('Question deleted successfully!');
      } catch (error) {
        console.error('Error deleting question:', error);
        alert('Error deleting question');
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      class: '',
      subject: '',
      question_type: 'MCQ',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      answer: ''
    });
    setEditingQuestion(null);
    setShowForm(false);
  };

  const generateExam = async () => {
    if (!examConfig.class || !examConfig.subject) {
      alert('Please select class and subject');
      return;
    }

    setLoading(true);
    try {
      const examQuestions = await getMCQQuestionsForTest(
        examConfig.class,
        examConfig.subject,
        parseInt(examConfig.count)
      );

      if (examQuestions.length === 0) {
        alert('No questions found for the selected criteria');
        return;
      }

      generatePDF(examQuestions);
    } catch (error) {
      console.error('Error generating exam:', error);
      alert('Error generating exam');
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = (examQuestions) => {
    const doc = new jsPDF();

    // Title and header
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text(examConfig.title, 105, 15, { align: 'center' });

    doc.setFontSize(10);
    doc.text(`Class: ${examConfig.class}`, 20, 25);
    doc.text(`Subject: ${examConfig.subject}`, 20, 32);
    doc.text(`Number of Questions: ${examQuestions.length}`, 20, 39);

    // Instructions
    doc.setFontSize(12);
    doc.text('Instructions:', 20, 50);
    doc.setFontSize(10);
    const instructions = doc.splitTextToSize(examConfig.instructions, 170);
    doc.text(instructions, 20, 57);

    // Questions
    let yPosition = 80;
    examQuestions.forEach((q, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(11);
      doc.setFont(undefined, 'bold');
      doc.text(`${index + 1}. ${q.question}`, 20, yPosition);
      yPosition += 8;

      doc.setFont(undefined, 'normal');
      if (q.question_type === 'MCQ' && q.options) {
        q.options.forEach((option, optIndex) => {
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(`   ${String.fromCharCode(65 + optIndex)}. ${option}`, 20, yPosition);
          yPosition += 6;
        });
      }
      yPosition += 10;
    });

    // Answer key (if requested)
    if (examConfig.includeAnswerKey) {
      if (yPosition > 200) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text('Answer Key', 20, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      examQuestions.forEach((q, index) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }

        if (q.question_type === 'MCQ') {
          doc.text(`${index + 1}. ${String.fromCharCode(65 + q.correctAnswer)}`, 20, yPosition);
        } else {
          doc.text(`${index + 1}. ${q.answer}`, 20, yPosition);
        }
        yPosition += 6;
      });
    }

    // Save the PDF
    doc.save(`${examConfig.class}_${examConfig.subject}_Exam.pdf`);
  };

  const TabButton = ({ id, icon: Icon, label, active, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
        active 
          ? 'bg-slate-600 text-white shadow-lg' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      <Icon size={20} />
      <span className="hidden sm:block">{label}</span>
    </button>
  );

  const QuestionCard = ({ question }) => {
    const isExpanded = expandedQuestion === question.id;
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-medium">
                {question.class}
              </span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs font-medium">
                {question.subject}
              </span>
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-xs font-medium">
                {question.question_type}
              </span>
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => handleEdit(question)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => handleDelete(question.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          
          <p className="text-gray-900 font-medium mb-3 line-clamp-2">{question.question}</p>
          
          <button
            onClick={() => setExpandedQuestion(isExpanded ? null : question.id)}
            className="flex items-center space-x-1 text-blue-600 text-sm font-medium hover:text-blue-700"
          >
            <span>{isExpanded ? 'Show less' : 'Show details'}</span>
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
        
        {isExpanded && (
          <div className="px-4 pb-4 border-t border-gray-100">
            <div className="pt-4">
              {question.question_type === 'MCQ' && question.options && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Options:</p>
                  <div className="grid gap-2">
                    {question.options.map((option, index) => (
                      <div 
                        key={index} 
                        className={`flex items-center space-x-2 p-2 rounded-lg ${
                          index === question.correctAnswer 
                            ? 'bg-green-50 border border-green-200' 
                            : 'bg-gray-50'
                        }`}
                      >
                        {index === question.correctAnswer && <CheckCircle size={16} className="text-green-600" />}
                        <span className="text-sm">
                          <strong>{String.fromCharCode(65 + index)}.</strong> {option}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {question.answer && question.question_type !== 'MCQ' && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Answer:</p>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-gray-800">{question.answer}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Question Bank</h1>
              <p className="text-gray-600 text-sm mt-1">Manage questions and generate exams</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">{filteredQuestions.length}</p>
              <p className="text-gray-600 text-sm">Questions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Mobile Tab Navigation */}
        <div className="flex overflow-x-auto space-x-2 mb-6 pb-2">
          <TabButton
            id="questions"
            icon={BookOpen}
            label="Questions"
            active={activeTab === 'questions'}
            onClick={() => setActiveTab('questions')}
          />
          <TabButton
            id="add"
            icon={Plus}
            label="Add Question"
            active={activeTab === 'add'}
            onClick={() => setActiveTab('add')}
          />
          <TabButton
            id="exam"
            icon={GraduationCap}
            label="Generate Exam"
            active={activeTab === 'exam'}
            onClick={() => setActiveTab('exam')}
          />
        </div>

        {/* Questions Tab */}
        {activeTab === 'questions' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search questions..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 text-blue-600 font-medium"
                >
                  <Filter size={20} />
                  <span>Filters</span>
                  {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                
                {/* Filters */}
                {showFilters && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                      <select
                        value={filters.class}
                        onChange={(e) => setFilters(prev => ({ ...prev, class: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">All Classes</option>
                        {classes.map(cls => (
                          <option key={cls} value={cls}>{cls}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                      <select
                        value={filters.subject}
                        onChange={(e) => setFilters(prev => ({ ...prev, subject: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">All Subjects</option>
                        {subjects.map(sub => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                      <select
                        value={filters.question_type}
                        onChange={(e) => setFilters(prev => ({ ...prev, question_type: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">All Types</option>
                        {questionTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Questions List */}
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-gray-600 mt-4">Loading questions...</p>
              </div>
            ) : filteredQuestions.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600">No questions found</p>
                <button
                  onClick={() => setActiveTab('add')}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add your first question
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {/* Pagination logic: slice filteredQuestions */}
                  {filteredQuestions
                    .slice((currentPage - 1) * questionsPerPage, currentPage * questionsPerPage)
                    .map((question) => (
                      <QuestionCard key={question.id} question={question} />
                    ))}
                </div>
                {/* Pagination Controls */}
                <div className="flex items-center justify-center space-x-2 mt-6 overflow-x-auto">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {/* Page numbers */}
                  {Array.from({ length: Math.ceil(filteredQuestions.length / questionsPerPage) }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                      disabled={currentPage === i + 1}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(filteredQuestions.length / questionsPerPage)))}
                    disabled={currentPage === Math.ceil(filteredQuestions.length / questionsPerPage) || filteredQuestions.length === 0}
                    className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Add Question Tab */}
        {activeTab === 'add' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {editingQuestion ? 'Edit Question' : 'Add New Question'}
            </h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Class *</label>
                  <select
                    name="class"
                    value={formData.class}
                    onChange={(e) => setFormData(prev => ({ ...prev, class: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Class</option>
                    {classes.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
                <select
                  name="question_type"
                  value={formData.question_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, question_type: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {questionTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Question *</label>
                <textarea
                  name="question"
                  value={formData.question}
                  onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                  placeholder="Enter your question here..."
                  required
                />
              </div>

              {formData.question_type === 'MCQ' && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">Options *</label>
                  <div className="space-y-3">
                    {formData.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="correctAnswer"
                          value={index}
                          checked={formData.correctAnswer === index}
                          onChange={(e) => setFormData(prev => ({ ...prev, correctAnswer: parseInt(e.target.value) }))}
                          className="text-blue-600"
                        />
                        <span className="font-medium text-gray-700 w-8">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...formData.options];
                            newOptions[index] = e.target.value;
                            setFormData(prev => ({ ...prev, options: newOptions }));
                          }}
                          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder={`Option ${String.fromCharCode(65 + index)}`}
                          required
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">Select the correct answer by clicking the radio button.</p>
                </div>
              )}

              {formData.question_type !== 'MCQ' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Answer</label>
                  <textarea
                    name="answer"
                    value={formData.answer}
                    onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                    placeholder="Enter the answer here..."
                  />
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : (editingQuestion ? 'Update Question' : 'Add Question')}
                </button>
                <button
                  onClick={() => {
                    resetForm();
                    setActiveTab('questions');
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Exam Generator Tab */}
        {activeTab === 'exam' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Generate Exam</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Class *</label>
                  <select
                    name="class"
                    value={examConfig.class}
                    onChange={(e) => setExamConfig(prev => ({ ...prev, class: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Class</option>
                    {classes.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                  <select
                    name="subject"
                    value={examConfig.subject}
                    onChange={(e) => setExamConfig(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Questions</label>
                <input
                  type="number"
                  name="count"
                  value={examConfig.count}
                  onChange={(e) => setExamConfig(prev => ({ ...prev, count: e.target.value }))}
                  min="1"
                  max="50"
                  className="w-full sm:w-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Exam Title</label>
                <input
                  type="text"
                  name="title"
                  value={examConfig.title}
                  onChange={(e) => setExamConfig(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
                <textarea
                  name="instructions"
                  value={examConfig.instructions}
                  onChange={(e) => setExamConfig(prev => ({ ...prev, instructions: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-20 resize-none"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="includeAnswerKey"
                  checked={examConfig.includeAnswerKey}
                  onChange={(e) => setExamConfig(prev => ({ ...prev, includeAnswerKey: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                />
                <label className="ml-2 text-sm font-medium text-gray-700">
                  Include Answer Key
                </label>
              </div>

              <button
                onClick={generateExam}
                disabled={loading || !examConfig.class || !examConfig.subject}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Download size={20} />
                <span>{loading ? 'Generating...' : 'Generate Exam PDF'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionBankManager;

