import React from 'react';
import { FilterOptions } from '../types';
import { SlidersHorizontal, X } from 'lucide-react';

interface AdvancedFiltersProps {
  isOpen: boolean;
  toggleFilters: () => void;
  filterOptions: FilterOptions;
  setFilterOptions: React.Dispatch<React.SetStateAction<FilterOptions>>;
  positions: string[];
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  isOpen,
  toggleFilters,
  filterOptions,
  setFilterOptions,
  positions
}) => {
  if (!isOpen) return null;

  const handlePositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterOptions(prev => ({ ...prev, position: e.target.value }));
  };

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
    const value = parseInt(e.target.value);
    setFilterOptions(prev => ({
      ...prev,
      [type === 'min' ? 'minScore' : 'maxScore']: isNaN(value) ? (type === 'min' ? 0 : 100) : value
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'start' | 'end') => {
    setFilterOptions(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [type]: e.target.value
      }
    }));
  };

  const resetFilters = () => {
    setFilterOptions({
      position: '',
      minScore: 0,
      maxScore: 100,
      dateRange: {
        start: '',
        end: ''
      }
    });
  };

  return (
    <div className="p-4 bg-[#121a2f] border border-[#2a3655] rounded-md mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-white flex items-center">
          <SlidersHorizontal size={18} className="mr-2 text-[#4f87ff]" />
          Advanced Filters
        </h3>
        <div className="flex space-x-2">
          <button 
            onClick={resetFilters}
            className="text-sm text-gray-400 hover:text-white"
          >
            Reset
          </button>
          <button 
            onClick={toggleFilters}
            className="text-gray-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Position</label>
          <select
            value={filterOptions.position}
            onChange={handlePositionChange}
            className="w-full bg-[#1a2642] border border-[#2a3655] rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#4f87ff]"
          >
            <option value="">All Positions</option>
            {positions.map(position => (
              <option key={position} value={position}>{position}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Score Range</label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="0"
              max="100"
              value={filterOptions.minScore}
              onChange={(e) => handleScoreChange(e, 'min')}
              className="w-full bg-[#1a2642] border border-[#2a3655] rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#4f87ff]"
            />
            <span className="text-gray-400">to</span>
            <input
              type="number"
              min="0"
              max="100"
              value={filterOptions.maxScore}
              onChange={(e) => handleScoreChange(e, 'max')}
              className="w-full bg-[#1a2642] border border-[#2a3655] rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#4f87ff]"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">From Date</label>
          <input
            type="date"
            value={filterOptions.dateRange.start}
            onChange={(e) => handleDateChange(e, 'start')}
            className="w-full bg-[#1a2642] border border-[#2a3655] rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#4f87ff]"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">To Date</label>
          <input
            type="date"
            value={filterOptions.dateRange.end}
            onChange={(e) => handleDateChange(e, 'end')}
            className="w-full bg-[#1a2642] border border-[#2a3655] rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#4f87ff]"
          />
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;