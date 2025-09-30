import { BookOpen, Calendar, Clock, FileText, Eye, Copy, Edit, Download, Trash2 } from 'lucide-react';

const LessonPlanCard = ({ plan, onView, onDuplicate, onEdit, onDownload, onDelete }) => ( // eslint-disable-line react/prop-types
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
    <div className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {plan.subject}
          </h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="flex items-center">
              <BookOpen size={14} className="mr-1" />
              {plan.classLevel}
            </span>
            <span className="flex items-center">
              <Calendar size={14} className="mr-1" />
              {plan.week}
            </span>
            <span className="flex items-center">
              <Clock size={14} className="mr-1" />
              {plan.duration}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
            {plan.strand}
          </span>
          {plan.substrand && (
            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
              {plan.substrand}
            </span>
          )}
        </div>

        <div className="text-sm text-gray-600">
          <div className="flex items-start space-x-2">
            <FileText size={14} className="mt-0.5 flex-shrink-0" />
            <p className="line-clamp-2">{plan.phases?.starter || 'No starter phase defined'}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => onView(plan)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
        >
          <Eye size={14} />
          <span>View Details</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onDuplicate(plan)}
            className="text-gray-400 hover:text-gray-600"
            title="Duplicate"
          >
            <Copy size={16} />
          </button>
          <button
            onClick={() => onEdit(plan)}
            className="text-gray-400 hover:text-blue-600"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDownload(plan)}
            className="text-gray-400 hover:text-green-600"
            title="Download PDF"
          >
            <Download size={16} />
          </button>
          <button
            onClick={() => onDelete(plan.id)}
            className="text-gray-400 hover:text-red-600"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default LessonPlanCard;