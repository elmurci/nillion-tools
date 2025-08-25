import React from 'react';
import { Filter, X, ChevronDown, Check } from 'lucide-react';
import { createPortal } from 'react-dom';

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
  apps: any[]; // Add apps prop to show counts
}

const FilterBar: React.FC<FilterBarProps> = ({
  selectedLanguage,
  selectedAreas,
  onLanguageChange,
  onAreaChange,
  availableFilters,
  apps
}) => {
  const [isAreaDropdownOpen, setIsAreaDropdownOpen] = React.useState(false);
  const [dropdownPosition, setDropdownPosition] = React.useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsAreaDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update dropdown position when opened
  React.useEffect(() => {
    if (isAreaDropdownOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, [isAreaDropdownOpen]);

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

  const toggleDropdown = () => {
    setIsAreaDropdownOpen(!isAreaDropdownOpen);
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
        <div className="relative">
          <label className="block text-sm font-medium text-white/80 mb-2">
            Areas {selectedAreas.length > 0 && `(${selectedAreas.length} selected)`}
          </label>
          
          {/* Dropdown Button */}
          <button
            ref={buttonRef}
            type="button"
            onClick={toggleDropdown}
            className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white text-left focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all flex items-center justify-between hover:bg-white/25"
          >
            <span className="truncate">
              {selectedAreas.length === 0 
                ? 'Select areas...' 
                : selectedAreas.length === 1 
                ? selectedAreas[0]
                : `${selectedAreas.length} areas selected`
              }
            </span>
            <ChevronDown 
              size={16} 
              className={`transition-transform duration-200 ${isAreaDropdownOpen ? 'rotate-180' : ''}`} 
            />
          </button>
        </div>
      </div>

      {/* Portal-based Dropdown Menu */}
      {isAreaDropdownOpen && createPortal(
        <div 
          ref={dropdownRef}
          className="fixed bg-white border border-gray-300 rounded-lg shadow-2xl max-h-60 overflow-y-auto"
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width,
            zIndex: 99999
          }}
        >
          {availableFilters.areas.length === 0 ? (
            <div className="px-3 py-2 text-gray-500 text-sm">No areas available</div>
          ) : (
            <>
              {/* Select All / Clear All */}
              <div className="border-b border-gray-200/50 p-2">
                <button
                  onClick={() => {
                    if (selectedAreas.length === availableFilters.areas.length) {
                      onAreaChange([]);
                    } else {
                      onAreaChange([...availableFilters.areas]);
                    }
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  {selectedAreas.length === availableFilters.areas.length ? 'Clear All' : 'Select All'}
                </button>
              </div>
              
              {/* Area Options */}
              {availableFilters.areas.map((area) => (
                <label 
                  key={area} 
                  className="flex items-center space-x-3 px-3 py-2 hover:bg-blue-50/50 cursor-pointer transition-colors group"
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={selectedAreas.includes(area)}
                      onChange={() => handleAreaToggle(area)}
                      className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-colors"
                    />
                    {selectedAreas.includes(area) && (
                      <Check size={12} className="absolute top-0.5 left-0.5 text-white pointer-events-none" />
                    )}
                  </div>
                  <span className="text-gray-800 text-sm group-hover:text-gray-900 transition-colors flex-1">
                    {area}
                  </span>
                  <span className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors">
                    {apps.filter(app => app.areas && app.areas.includes(area)).length}
                  </span>
                </label>
              ))}
            </>
          )}
        </div>,
        document.body
      )}

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
              Area: {area}
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