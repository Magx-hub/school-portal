import { X } from 'lucide-react';

const LessonPlanPreviewModal = ({ plan, onClose }) => ( // eslint-disable-line react/prop-types
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {plan.subject} - {plan.classLevel} - {plan.week}
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-blue-600 text-sm font-medium">Date</div>
            <div className="text-gray-900">{plan.date}</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-green-600 text-sm font-medium">Duration</div>
            <div className="text-gray-900">{plan.duration}</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="text-purple-600 text-sm font-medium">Strand</div>
            <div className="text-gray-900">{plan.strand}</div>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg">
            <div className="text-orange-600 text-sm font-medium">Substrand</div>
            <div className="text-gray-900">{plan.substrand}</div>
          </div>
        </div>

        {plan.contentStandards?.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Content Standards</h3>
            <ul className="space-y-1">
              {plan.contentStandards.map((standard, index) => (
                <li key={index} className="text-gray-700">• {standard}</li>
              ))}
            </ul>
          </div>
        )}

        {plan.indicators?.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Indicators</h3>
            <ul className="space-y-1">
              {plan.indicators.map((indicator, index) => (
                <li key={index} className="text-gray-700">• {indicator}</li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Teaching Phases</h3>
          <div className="space-y-4">
            {['starter', 'main', 'conclusion'].map((phase) => (
              <div key={phase} className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium text-gray-900 capitalize mb-1">{phase}</h4>
                <p className="text-gray-700">{plan.phases[phase] || 'Not specified'}</p>
              </div>
            ))}
          </div>
        </div>

        {plan.tlr?.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Teaching/Learning Resources</h3>
            <div className="flex flex-wrap gap-2">
              {plan.tlr.map((resource, index) => (
                <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                  {resource}
                </span>
              ))}
            </div>
          </div>
        )}

        {plan.assessment && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Assessment</h3>
            <p className="text-gray-700">{plan.assessment}</p>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default LessonPlanPreviewModal;