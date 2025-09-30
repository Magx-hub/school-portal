import { Search, Filter } from 'lucide-react';

const LessonPlanFilters = ({
  searchTerm,
  onSearchChange,
  showFilters,
  onToggleFilters,
  filters,
  onFilterChange,
  uniqueValues,
  hasActiveFilters,
  onClearFilters
}) => ( // eslint-disable-line react/prop-types
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
      {/* Search Bar */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search lesson plans..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleFilters}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
            showFilters || hasActiveFilters
              ? 'bg-blue-50 border-blue-200 text-blue-700'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Filter size={18} />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              {[searchTerm, filters.classLevel, filters.subject, filters.week, filters.strand].filter(Boolean).length}
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Clear all
          </button>
        )}
      </div>
    </div>

    {/* Expanded Filters */}
    {showFilters && (
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {['classLevel', 'subject', 'week', 'strand'].map((filter) => (
            <div key={filter}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {filter.replace(/([A-Z])/g, ' $1')}
              </label>
              <select
                value={filters[filter]}
                onChange={(e) => onFilterChange(filter, e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All {filter.replace(/([A-Z])/g, ' $1').toLowerCase()}</option>
                {uniqueValues[filter + 's']?.map(value => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

export default LessonPlanFilters;