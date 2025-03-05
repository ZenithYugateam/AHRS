import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, Filter, UserCheck, Download, Trash2, Edit, Eye, SlidersHorizontal, BarChart2 } from 'lucide-react';
import CandidatesList from './../components/CandidatesList';
import AdvancedFilters from './../components/AdvancedFilters';
import CandidateComparison from './../components/CandidateComparison';
import { Candidate, FilterOptions, ComparisonCandidate } from './../types';

function TotalInterview() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Candidate>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  
  // Advanced filter options
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    position: '',
    minScore: 0,
    maxScore: 100,
    dateRange: {
      start: '',
      end: ''
    }
  });
  
  // Comparison candidates
  const [selectedCandidates, setSelectedCandidates] = useState<ComparisonCandidate[]>([
    { id: null, name: '' },
    { id: null, name: '' }
  ]);

  // Sample data for candidates
  const initialCandidates: Candidate[] = [
    { id: 1, name: 'John Doe', position: 'Frontend Developer', date: '2023-05-15', status: 'Selected', score: 85 },
    { id: 2, name: 'Jane Smith', position: 'Backend Developer', date: '2023-05-16', status: 'Rejected', score: 65 },
    { id: 3, name: 'Michael Johnson', position: 'UI/UX Designer', date: '2023-05-17', status: 'Pending', score: 75 },
    { id: 4, name: 'Emily Davis', position: 'Full Stack Developer', date: '2023-05-18', status: 'Selected', score: 90 },
    { id: 5, name: 'Robert Wilson', position: 'DevOps Engineer', date: '2023-05-19', status: 'Pending', score: 80 },
    { id: 6, name: 'Sarah Brown', position: 'Product Manager', date: '2023-05-20', status: 'Selected', score: 88 },
    { id: 7, name: 'David Miller', position: 'Data Scientist', date: '2023-05-21', status: 'Rejected', score: 70 },
    { id: 8, name: 'Jennifer Taylor', position: 'QA Engineer', date: '2023-05-22', status: 'Pending', score: 78 },
  ];

  // Extract unique positions for filter dropdown
  const uniquePositions = useMemo(() => {
    return Array.from(new Set(initialCandidates.map(c => c.position)));
  }, [initialCandidates]);

  const handleSort = (field: keyof Candidate) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
  };

  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };

  const toggleComparison = () => {
    setShowComparison(!showComparison);
  };

  return (
    <div className="min-h-screen bg-[#121a2f] text-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-[#1a2642] rounded-lg shadow-lg overflow-hidden border border-[#2a3655]">
          <div className="p-6 border-b border-[#2a3655]">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white flex items-center">
                <UserCheck className="mr-2 text-[#4f87ff]" size={24} />
                Interview Candidates
              </h1>
              <div className="flex space-x-2">
                <button 
                  onClick={toggleComparison}
                  className="bg-[#2a3655] hover:bg-[#344267] text-white px-4 py-2 rounded-md flex items-center"
                >
                  <BarChart2 size={16} className="mr-2" />
                  Compare
                </button>
                <button className="bg-[#4f87ff] hover:bg-[#3a6fd8] text-white px-4 py-2 rounded-md flex items-center">
                  <Download size={16} className="mr-2" />
                  Export
                </button>
              </div>
            </div>
            
            {/* Candidate Comparison Panel */}
            <CandidateComparison 
              isOpen={showComparison}
              toggleComparison={toggleComparison}
              candidates={initialCandidates}
              selectedCandidates={selectedCandidates}
              setSelectedCandidates={setSelectedCandidates}
            />
            
            {/* Advanced Filters Panel */}
            <AdvancedFilters 
              isOpen={showAdvancedFilters}
              toggleFilters={toggleAdvancedFilters}
              filterOptions={filterOptions}
              setFilterOptions={setFilterOptions}
              positions={uniquePositions}
            />
            
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search candidates..."
                  className="pl-10 pr-4 py-2 bg-[#121a2f] border border-[#2a3655] rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#4f87ff] focus:border-[#4f87ff] text-white"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={toggleAdvancedFilters}
                  className="bg-[#121a2f] border border-[#2a3655] rounded-md px-3 py-2 text-white hover:bg-[#232f4a] focus:outline-none focus:ring-2 focus:ring-[#4f87ff]"
                >
                  <SlidersHorizontal size={18} />
                </button>
                <div className="relative">
                  <select
                    className="appearance-none bg-[#121a2f] border border-[#2a3655] rounded-md pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-[#4f87ff] focus:border-[#4f87ff] text-white"
                    value={selectedStatus}
                    onChange={(e) => handleStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Pending">Pending</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <Filter size={16} className="text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <CandidatesList
            candidates={initialCandidates}
            searchTerm={searchTerm}
            sortField={sortField}
            sortDirection={sortDirection}
            selectedStatus={selectedStatus}
            onSort={handleSort}
            filterOptions={filterOptions}
          />
        </div>
      </div>
    </div>
  );
}

export default TotalInterview;