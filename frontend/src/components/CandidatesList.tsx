import React from 'react';
import { ChevronDown, ChevronUp, Edit, Eye, Trash2 } from 'lucide-react';
import { Candidate, FilterOptions } from './../types';

interface CandidatesListProps {
  candidates: Candidate[];
  searchTerm: string;
  sortField: keyof Candidate;
  sortDirection: 'asc' | 'ā';
  selectedStatus: string;
  filterOptions: FilterOptions;
  onSort: (field: keyof Candidate) => void;
}

const CandidatesList: React.FC<CandidatesListProps> = ({
  candidates,
  searchTerm,
  sortField,
  sortDirection,
  selectedStatus,
  filterOptions,
  onSort,
}) => {
  // Filter candidates based on all criteria
  const filteredCandidates = candidates.filter((candidate) => {
    // Universal search - search across all fields
    const matchesSearch = 
      searchTerm === '' ||
      Object.values(candidate).some(value => 
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    // Status filter
    const matchesStatus = selectedStatus === 'all' || candidate.status === selectedStatus;
    
    // Position filter
    const matchesPosition = !filterOptions.position || candidate.position === filterOptions.position;
    
    // Score range filter
    const matchesScoreRange = 
      candidate.score >= filterOptions.minScore && 
      candidate.score <= filterOptions.maxScore;
    
    // Date range filter
    const candidateDate = new Date(candidate.date);
    const matchesDateRange = 
      (!filterOptions.dateRange.start || candidateDate >= new Date(filterOptions.dateRange.start)) &&
      (!filterOptions.dateRange.end || candidateDate <= new Date(filterOptions.dateRange.end));
    
    return matchesSearch && matchesStatus && matchesPosition && matchesScoreRange && matchesDateRange;
  });

  // Sort candidates based on sort field and direction
  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Render sort indicator
  const renderSortIndicator = (field: keyof Candidate) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp size={16} className="ml-1" />
    ) : (
      <ChevronDown size={16} className="ml-1" />
    );
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Selected':
        return 'bg-green-900 text-green-300';
      case 'Rejected':
        return 'bg-red-900 text-red-300';
      case 'Pending':
        return 'bg-yellow-900 text-yellow-300';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-[#2a3655]">
        <thead className="bg-[#121a2f]">
          <tr>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort('name')}
            >
              <div className="flex items-center">
                Name
                {renderSortIndicator('name')}
              </div>
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort('position')}
            >
              <div className="flex items-center">
                Position
                {renderSortIndicator('position')}
              </div>
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort('date')}
            >
              <div className="flex items-center">
                Interview Date
                {renderSortIndicator('date')}
              </div>
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort('status')}
            >
              <div className="flex items-center">
                Status
                {renderSortIndicator('status')}
              </div>
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort('score')}
            >
              <div className="flex items-center">
                Score
                {renderSortIndicator('score')}
              </div>
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-[#1a2642] divide-y divide-[#2a3655]">
          {sortedCandidates.length > 0 ? (
            sortedCandidates.map((candidate) => (
              <tr key={candidate.id} className="hover:bg-[#232f4a]">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-[#4f87ff33] flex items-center justify-center">
                        <span className="text-[#4f87ff] font-medium">
                          {candidate.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-200">{candidate.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">{candidate.position}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">
                    {new Date(candidate.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(candidate.status)}`}>
                    {candidate.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-full bg-[#121a2f] rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          candidate.score >= 80 ? 'bg-green-500' : 
                          candidate.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                        }`} 
                        style={{ width: `${candidate.score}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm text-gray-300">{candidate.score}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button className="text-[#4f87ff] hover:text-[#6a9dff]" title="View">
                      <Eye size={18} />
                    </button>
                    <button className="text-[#4f87ff] hover:text-[#6a9dff]" title="Edit">
                      <Edit size={18} />
                    </button>
                    <button className="text-red-400 hover:text-red-300" title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-400">
                No candidates found matching your search criteria.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      
      <div className="bg-[#1a2642] px-4 py-3 flex items-center justify-between border-t border-[#2a3655] sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button className="relative inline-flex items-center px-4 py-2 border border-[#2a3655] text-sm font-medium rounded-md text-gray-300 bg-[#121a2f] hover:bg-[#232f4a]">
            Previous
          </button>
          <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-[#2a3655] text-sm font-medium rounded-md text-gray-300 bg-[#121a2f] hover:bg-[#232f4a]">
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-400">
              Showing <span className="font-medium text-gray-300">1</span> to <span className="font-medium text-gray-300">{sortedCandidates.length}</span> of{' '}
              <span className="font-medium text-gray-300">{sortedCandidates.length}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-[#2a3655] bg-[#121a2f] text-sm font-medium text-gray-400 hover:bg-[#232f4a]">
                <span className="sr-only">Previous</span>
                <ChevronUp className="h-5 w-5 rotate-90" />
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-[#2a3655] bg-[#121a2f] text-sm font-medium text-gray-300 hover:bg-[#232f4a]">
                1
              </button>
              <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-[#2a3655] bg-[#121a2f] text-sm font-medium text-gray-400 hover:bg-[#232f4a]">
                <span className="sr-only">Next</span>
                <ChevronDown className="h-5 w-5 rotate-90" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidatesList;