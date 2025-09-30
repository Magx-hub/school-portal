import { useState, useEffect, Component } from 'react';
import { Plus, BookOpen } from 'lucide-react';
import { jsPDF } from 'jspdf';
import {
  initLessonPlanDB,
  addLessonPlan,
  getAllLessonPlans,
  updateLessonPlan,
  deleteLessonPlan,
  searchLessonPlans,
  getLessonPlansByFilters,
  getUniqueValues,
  duplicateLessonPlan
} from '../utils/lessonPlanService';
import LessonPlanFilters from './LessonPlanFilters';
import LessonPlanCard from './LessonPlanCard';
import LessonPlanForm from './LessonPlanForm';
import LessonPlanPreviewModal from './LessonPlanPreviewModal';


class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 m-4">
          <h2 className="text-red-800 font-bold mb-2">Something went wrong</h2>
          <p className="text-red-600">Please refresh the page or try again later.</p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}


const LessonPlanManager = () => {
  const [lessonPlans, setLessonPlans] = useState([]);
  
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const [filters, setFilters] = useState({
    classLevel: '',
    subject: '',
    week: '',
    strand: ''
  });

  const [uniqueValues, setUniqueValues] = useState({
    classes: [],
    subjects: [],
    weeks: [],
    strands: []
  });

  const initializeDatabase = async () => {
    setLoading(true);
    try {
      await initLessonPlanDB();
      await loadLessonPlans();
    } catch (error) {
      console.error('Error initializing database:', error);
      alert('Error initializing lesson plans');
    } finally {
      setLoading(false);
    }
  };

  const loadLessonPlans = async () => {
    setLoading(true);
    try {
      const allPlans = await getAllLessonPlans();
      setLessonPlans(allPlans);
      setFilteredPlans(allPlans); // Initially, filtered plans are all plans
    } catch (error) {
      console.error('Error loading lesson plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUniqueValues = async () => {
    try {
      const values = await getUniqueValues();
      setUniqueValues(values);
    } catch (error) {
      console.error('Error loading unique values:', error);
    }
  };

  const filterPlans = () => {
    let filtered = lessonPlans;

    // Apply search filter
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(plan => 
        plan.subject.toLowerCase().includes(lowercasedTerm) ||
        plan.classLevel.toLowerCase().includes(lowercasedTerm) ||
        plan.week.toLowerCase().includes(lowercasedTerm) ||
        plan.strand.toLowerCase().includes(lowercasedTerm) ||
        plan.substrand.toLowerCase().includes(lowercasedTerm)
      );
    }

    // Apply other filters
    if (filters.classLevel) {
      filtered = filtered.filter(plan => plan.classLevel === filters.classLevel);
    }
    if (filters.subject) {
      filtered = filtered.filter(plan => plan.subject === filters.subject);
    }
    if (filters.week) {
      filtered = filtered.filter(plan => plan.week === filters.week);
    }
    if (filters.strand) {
      filtered = filtered.filter(plan => plan.strand === filters.strand);
    }

    setFilteredPlans(filtered);
  };

  // Initialize database and load lesson plans
  useEffect(() => {
    initializeDatabase();
  }, []);

  // Load unique values for filters
  useEffect(() => {
    loadUniqueValues();
  }, []);

  // Filter plans when filters or search term change
  useEffect(() => {
    filterPlans();
  }, [filters, searchTerm]);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      if (editingPlan) {
        await updateLessonPlan(editingPlan.id, formData);
        alert('Lesson plan updated successfully!');
      } else {
        await addLessonPlan(formData);
        alert('Lesson plan added successfully!');
      }

      setShowForm(false);
      setEditingPlan(null);
      await loadLessonPlans();
      await loadUniqueValues();
    } catch (error) {
      console.error('Error saving lesson plan:', error);
      alert('Error saving lesson plan');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lesson plan?')) {
      setLoading(true);
      try {
        await deleteLessonPlan(id);
        await loadLessonPlans();
        await loadUniqueValues();
        alert('Lesson plan deleted successfully!');
      } catch (error) {
        console.error('Error deleting lesson plan:', error);
        alert('Error deleting lesson plan');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDuplicate = async (plan) => {
    setLoading(true);
    try {
      await duplicateLessonPlan(plan.id);
      await loadLessonPlans();
      await loadUniqueValues();
      alert('Lesson plan duplicated successfully!');
    } catch (error) {
      console.error('Error duplicating lesson plan:', error);
      alert('Error duplicating lesson plan');
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = (plan) => {
    const doc = new jsPDF();

    // Title and header
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text('LESSON PLAN', 105, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.text(`Subject: ${plan.subject}`, 20, 35);
    doc.text(`Class: ${plan.classLevel}`, 20, 42);
    doc.text(`Week: ${plan.week}`, 20, 49);
    doc.text(`Date: ${plan.date}`, 20, 56);
    doc.text(`Duration: ${plan.duration}`, 20, 63);

    // Strand and Substrand
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Strand and Substrand:', 20, 75);
    doc.setFont(undefined, 'normal');
    doc.text(`Strand: ${plan.strand}`, 20, 82);
    doc.text(`Substrand: ${plan.substrand}`, 20, 89);

    // Content Standards
    let yPosition = 100;
    doc.setFont(undefined, 'bold');
    doc.text('Content Standards:', 20, yPosition);
    yPosition += 10;
    doc.setFont(undefined, 'normal');
    (plan.contentStandards || []).forEach((standard, index) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(`${index + 1}. ${standard}`, 25, yPosition);
      yPosition += 7;
    });

    // Indicators
    yPosition += 5;
    doc.setFont(undefined, 'bold');
    doc.text('Indicators:', 20, yPosition);
    yPosition += 10;
    doc.setFont(undefined, 'normal');
    (plan.indicators || []).forEach((indicator, index) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(`${index + 1}. ${indicator}`, 25, yPosition);
      yPosition += 7;
    });

    // Phases
    yPosition += 5;
    doc.setFont(undefined, 'bold');
    doc.text('Teaching and Learning Phases:', 20, yPosition);
    yPosition += 10;
    doc.setFont(undefined, 'normal');

    const phases = [
      { title: 'Starter', content: plan.phases.starter },
      { title: 'Main Activity', content: plan.phases.main },
      { title: 'Conclusion', content: plan.phases.conclusion }
    ];

    phases.forEach(phase => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      doc.setFont(undefined, 'bold');
      doc.text(`${phase.title}:`, 20, yPosition);
      yPosition += 7;
      doc.setFont(undefined, 'normal');
      const content = doc.splitTextToSize(phase.content, 170);
      doc.text(content, 25, yPosition);
      yPosition += (content.length * 7) + 5;
    });

    // Assessment
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    doc.setFont(undefined, 'bold');
    doc.text('Assessment:', 20, yPosition);
    yPosition += 7;
    doc.setFont(undefined, 'normal');
    const assessment = doc.splitTextToSize(plan.assessment, 170);
    doc.text(assessment, 25, yPosition);

    // Save PDF
    doc.save(`${plan.subject}_${plan.classLevel}_${plan.week}_LessonPlan.pdf`);
  };


  const clearFilters = () => {
    setFilters({
      classLevel: '',
      subject: '',
      week: '',
      strand: ''
    });
    setSearchTerm('');
  };

  const hasActiveFilters = searchTerm || filters.classLevel || filters.subject || filters.week || filters.strand;


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    {/* Header */}
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Mobile Layout - Stacked */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between mb-4">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Lesson Plan Manager</h1>
              </div>
            </div>
            
            {/* New Plan Button - Mobile */}
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg flex items-center space-x-1 transition-colors shadow-sm"
            >
              <Plus size={18} />
            </button>
          </div>
          
          {/* Bottom Row - Mobile */}
          <div className="flex items-center justify-between">
            <p className="text-gray-600 text-sm">Create and manage professional lesson plans</p>
            <div className="bg-gray-100 px-3 py-1 rounded-full">
              <span className="text-sm font-medium text-gray-700">{filteredPlans.length} plans</span>
            </div>
          </div>
        </div>

        {/* Desktop Layout - Side by Side */}
        <div className="hidden lg:flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Lesson Plan Manager</h1>
                <p className="text-gray-600 text-sm">Create and manage professional lesson plans</p>
              </div>
            </div>
          </div>
          
          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <div className="bg-gray-100 px-4 py-2 rounded-full">
              <span className="text-sm font-medium text-gray-700">{filteredPlans.length} plans</span>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors shadow-sm"
            >
              <Plus size={18} />
              <span>New Plan</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* Main Content */}
      <ErrorBoundary> 

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and Filters */}
        <LessonPlanFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          filters={filters}
          onFilterChange={(filter, value) => setFilters(prev => ({ ...prev, [filter]: value }))}
          uniqueValues={uniqueValues}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        />

        {/* View Mode Toggle */}
        <div className="flex justify-end mb-6">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
            >
              <div className="grid grid-cols-2 gap-1 w-4 h-4">
                <div className="bg-gray-400 rounded-sm"></div>
                <div className="bg-gray-400 rounded-sm"></div>
                <div className="bg-gray-400 rounded-sm"></div>
                <div className="bg-gray-400 rounded-sm"></div>
              </div>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
            >
              <div className="space-y-1">
                <div className="bg-gray-400 h-1 w-4 rounded"></div>
                <div className="bg-gray-400 h-1 w-4 rounded"></div>
                <div className="bg-gray-400 h-1 w-4 rounded"></div>
              </div>
            </button>
          </div>
        </div>

        {/* Lesson Plans Grid/List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading lesson plans...</span>
          </div>
        ) : filteredPlans.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No lesson plans found</h3>
            <p className="text-gray-600 mb-4">
              {hasActiveFilters 
                ? 'Try adjusting your search criteria or filters'
                : 'Get started by creating your first lesson plan'
              }
            </p>
            {!hasActiveFilters && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Create Lesson Plan
              </button>
            )}
          </div>
        ) : (
          <div className={viewMode === 'grid'
            ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            : "space-y-4"
          }>
            {filteredPlans.map((plan) => (
              <LessonPlanCard
                key={plan.id}
                plan={plan}
                onView={(plan) => { setSelectedPlan(plan); setShowPreview(true); }}
                onDuplicate={handleDuplicate}
                onEdit={handleEdit}
                onDownload={generatePDF}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      <LessonPlanForm
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingPlan(null); }}
        editingPlan={editingPlan}
        onSubmit={handleSubmit}
        loading={loading}
      />

      {/* Preview Modal */}
      {showPreview && selectedPlan && (
        <LessonPlanPreviewModal
          plan={selectedPlan}
          onClose={() => { setShowPreview(false); setSelectedPlan(null); }}
        />
      )}
      
      </ErrorBoundary>
    </div>
  );
};

export default LessonPlanManager;