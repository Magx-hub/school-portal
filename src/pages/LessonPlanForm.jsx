import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';

const LessonPlanForm = ({ isOpen, onClose, editingPlan, onSubmit, loading }) => { // eslint-disable-line react/prop-types
  const [formData, setFormData] = useState({
    subject: '',
    classLevel: '',
    week: '',
    date: new Date().toISOString().split('T')[0],
    duration: '60 mins',
    strand: '',
    substrand: '',
    contentStandards: [''],
    indicators: [''],
    coreCompetencies: [''],
    subjectPractices: [''],
    phases: {
      starter: '',
      main: '',
      conclusion: ''
    },
    tlr: [''],
    assessment: ''
  });

  useEffect(() => {
    if (editingPlan) {
      setFormData({
        ...editingPlan,
        contentStandards: editingPlan.contentStandards.length > 0 ? editingPlan.contentStandards : [''],
        indicators: editingPlan.indicators.length > 0 ? editingPlan.indicators : [''],
        coreCompetencies: editingPlan.coreCompetencies.length > 0 ? editingPlan.coreCompetencies : [''],
        subjectPractices: editingPlan.subjectPractices.length > 0 ? editingPlan.subjectPractices : [''],
        tlr: editingPlan.tlr.length > 0 ? editingPlan.tlr : ['']
      });
    } else {
      resetForm();
    }
  }, [editingPlan, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhaseChange = (phase, value) => {
    setFormData(prev => ({
      ...prev,
      phases: {
        ...prev.phases,
        [phase]: value
      }
    }));
  };

  const handleArrayChange = (arrayName, index, value) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (arrayName) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], '']
    }));
  };

  const removeArrayItem = (arrayName, index) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index)
    }));
  };

  const resetForm = () => {
    setFormData({
      subject: '',
      classLevel: '',
      week: '',
      date: new Date().toISOString().split('T')[0],
      duration: '60 mins',
      strand: '',
      substrand: '',
      contentStandards: [''],
      indicators: [''],
      coreCompetencies: [''],
      subjectPractices: [''],
      phases: {
        starter: '',
        main: '',
        conclusion: ''
      },
      tlr: [''],
      assessment: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.subject || !formData.classLevel || !formData.week) {
      alert('Please fill in required fields: Subject, Class Level, and Week');
      return;
    }

    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingPlan ? 'Edit Lesson Plan' : 'Create New Lesson Plan'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class Level *</label>
              <input
                type="text"
                name="classLevel"
                value={formData.classLevel}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Week *</label>
              <input
                type="text"
                name="week"
                value={formData.week}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Strand and Duration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Strand</label>
              <input
                type="text"
                name="strand"
                value={formData.strand}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Substrand</label>
              <input
                type="text"
                name="substrand"
                value={formData.substrand}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Array Fields */}
          {['contentStandards', 'indicators', 'coreCompetencies', 'subjectPractices'].map((arrayName) => (
            <div key={arrayName} className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-3 capitalize">
                {arrayName.replace(/([A-Z])/g, ' $1')}
              </label>
              <div className="space-y-2">
                {formData[arrayName].map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayChange(arrayName, index, e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`${arrayName.replace(/([A-Z])/g, ' $1')} ${index + 1}`}
                    />
                    {formData[arrayName].length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem(arrayName, index)}
                        className="text-red-600 hover:text-red-800 p-2"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem(arrayName)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
                >
                  <Plus size={16} />
                  <span>Add {arrayName.replace(/([A-Z])/g, ' $1').slice(0, -1)}</span>
                </button>
              </div>
            </div>
          ))}

          {/* Teaching Phases */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Teaching and Learning Phases</h3>
            <div className="space-y-4">
              {['starter', 'main', 'conclusion'].map((phase) => (
                <div key={phase}>
                  <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                    {phase} Phase
                  </label>
                  <textarea
                    value={formData.phases[phase]}
                    onChange={(e) => handlePhaseChange(phase, e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                    placeholder={`Describe the ${phase} phase activities...`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* TLR and Assessment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Teaching/Learning Resources (TLR)
              </label>
              <div className="space-y-2">
                {formData.tlr.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayChange('tlr', index, e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`Resource ${index + 1}`}
                    />
                    {formData.tlr.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('tlr', index)}
                        className="text-red-600 hover:text-red-800 p-2"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('tlr')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
                >
                  <Plus size={16} />
                  <span>Add Resource</span>
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">Assessment</label>
              <textarea
                name="assessment"
                value={formData.assessment}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 resize-none"
                placeholder="Describe the assessment strategy and methods..."
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <span>{editingPlan ? 'Update Lesson Plan' : 'Create Lesson Plan'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LessonPlanForm;