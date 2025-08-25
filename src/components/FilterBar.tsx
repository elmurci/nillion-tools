import React from 'react';
import { Filter, X } from 'lucide-react';

export interface FilterOptions {
  languages: string[];
  areas: string[];
}

interface FilterBarProps {
  selectedLanguage: string | null;
  selectedAreas: string[];
  onLanguageChange: (language: string | null) => void;
  onAreaChange: (areas: string[]) => void;
  availableFilters: FilterOptions;
}

const FilterBar: React.FC<FilterBarProps> = ({
  selectedLanguage,
  selectedAreas,
  onLanguageChange,
  onAreaChange,
  availableFilters
}) => {
  const clearAllFilters = () => {
    onLanguageChange(null);
    onAreaChange([]);
  };

  const hasActiveFilters = selectedLanguage || selectedAreas.length > 0;

  const handleAreaToggle = (area: string) => {
    if (selectedAreas.includes(area)) {
      onAreaChange(selectedAreas.filter(a => a !== area));
    } else {
      onAreaChange([...selectedAreas, area]);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-8">
      <div className="flex items-center gap-3 mb-4">
        <Filter className="w-5 h-5 text-white" />
        <h3 className="text-lg font-semibold text-white">Filter Tools</h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="ml-auto flex items-center gap-1 px-3 py-1 text-sm bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
          >
            <X size={14} />
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Language Filter */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Language
          </label>
          <select
            value={selectedLanguage || ''}
            onChange={(e) => onLanguageChange(e.target.value || null)}
            className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
          >
            <option value="" className="bg-gray-800 text-white">All Languages</option>
            {availableFilters.languages.map((language) => (
              <option key={language} value={language} className="bg-gray-800 text-white">
                {language}
              </option>
            ))}
          </select>
        </div>

        {/* Area Filter */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Areas
          </label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {availableFilters.areas.map((area) => (
              <label key={area} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedAreas.includes(area)}
                  onChange={() => handleAreaToggle(area)}
                  className="w-4 h-4 text-blue-600 bg-white/20 border-white/30 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-white/90 text-sm">{area}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedLanguage && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/30 text-blue-100 rounded-full text-sm border border-blue-400/30">
              Language: {selectedLanguage}
              <button
                onClick={() => onLanguageChange(null)}
                className="ml-1 hover:bg-blue-400/30 rounded-full p-0.5 transition-colors"
              >
                <X size={12} />
              </button>
            </span>
          )}
          {selectedAreas.map((area) => (
            <span key={area} className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/30 text-green-100 rounded-full text-sm border border-green-400/30">
              Area: {selectedArea}
              <button
                onClick={() => onAreaChange(selectedAreas.filter(a => a !== area))}
                className="ml-1 hover:bg-green-400/30 rounded-full p-0.5 transition-colors"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterBar;