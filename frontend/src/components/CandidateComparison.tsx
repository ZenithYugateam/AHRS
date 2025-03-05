import React from 'react';
import { Candidate, ComparisonCandidate } from '../types';
import { X, BarChart2, Award, Plus, Trash2 } from 'lucide-react';

interface CandidateComparisonProps {
  isOpen: boolean;
  toggleComparison: () => void;
  candidates: Candidate[];
  selectedCandidates: ComparisonCandidate[];
  setSelectedCandidates: React.Dispatch<React.SetStateAction<ComparisonCandidate[]>>;
}

const CandidateComparison: React.FC<CandidateComparisonProps> = ({
  isOpen,
  toggleComparison,
  candidates,
  selectedCandidates,
  setSelectedCandidates
}) => {
  if (!isOpen) return null;

  const handleCandidateChange = (index: number, candidateId: number | null) => {
    const newSelectedCandidates = [...selectedCandidates];
    if (candidateId === null) {
      newSelectedCandidates[index] = { id: null, name: '' };
    } else {
      const candidate = candidates.find(c => c.id === candidateId);
      if (candidate) {
        newSelectedCandidates[index] = { id: candidate.id, name: candidate.name };
      }
    }
    setSelectedCandidates(newSelectedCandidates);
  };

  const handleAddCandidate = () => {
    setSelectedCandidates([...selectedCandidates, { id: null, name: '' }]);
  };

  const handleRemoveCandidate = (index: number) => {
    if (selectedCandidates.length <= 1) return; // Prevent removing the last candidate slot
    const newSelectedCandidates = selectedCandidates.filter((_, i) => i !== index);
    setSelectedCandidates(newSelectedCandidates);
  };

  const getCandidateDetails = (candidateId: number | null) => {
    if (candidateId === null) return null;
    return candidates.find(c => c.id === candidateId);
  };

  // Get details for all selected candidates that have a valid id.
  const candidateDetails = selectedCandidates
    .map(selected => getCandidateDetails(selected.id))
    .filter((c): c is Candidate => c !== null);

  const getComparisonBarWidth = (score: number) => {
    return `${score}%`;
  };

  // New recommendation logic: if at least two candidates are available, compare the top two scores.
  const getRecommendation = () => {
    if (candidateDetails.length < 2) return 'Please select at least two candidates to generate a recommendation.';
    
    // Sort candidates in descending order by score
    const sorted = [...candidateDetails].sort((a, b) => b.score - a.score);
    const top = sorted[0];
    const runnerUp = sorted[1];
    const scoreDiff = top.score - runnerUp.score;

    if (Math.abs(scoreDiff) < 5) {
      return "The top candidates are very closely matched. Consider other factors like cultural fit and specific skills.";
    } else {
      return `${top.name} leads by ${scoreDiff} points and may be the stronger candidate.`;
    }
  };

  return (
    <div className="p-4 bg-[#121a2f] border border-[#2a3655] rounded-md mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-white flex items-center">
          <BarChart2 size={18} className="mr-2 text-[#4f87ff]" />
          Candidate Comparison
        </h3>
        <button 
          onClick={toggleComparison}
          className="text-gray-400 hover:text-white"
        >
          <X size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {selectedCandidates.map((selected, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Candidate {index + 1}
              </label>
              <select
                value={selected.id || ''}
                onChange={(e) => handleCandidateChange(index, e.target.value ? parseInt(e.target.value) : null)}
                className="w-full bg-[#1a2642] border border-[#2a3655] rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#4f87ff]"
              >
                <option value="">Select a candidate</option>
                {candidates.map(candidate => (
                  <option key={candidate.id} value={candidate.id}>{candidate.name}</option>
                ))}
              </select>
            </div>
            {selectedCandidates.length > 1 && (
              <button 
                onClick={() => handleRemoveCandidate(index)}
                className="mt-6 text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mb-6">
        <button 
          onClick={handleAddCandidate}
          className="flex items-center text-[#4f87ff] hover:text-white"
        >
          <Plus size={16} className="mr-1" />
          Add Candidate
        </button>
      </div>

      {candidateDetails.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-6">
            {candidateDetails.map(candidate => (
              <div key={candidate.id} className="space-y-4 bg-[#1a2642] p-4 rounded-md border border-[#2a3655]">
                <h4 className="font-medium text-white">{candidate.name}</h4>
                <div>
                  <p className="text-sm text-gray-400">Position</p>
                  <p className="text-white">{candidate.position}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Interview Date</p>
                  <p className="text-white">
                    {new Date(candidate.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <p className="text-white">{candidate.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Score</p>
                  <div className="flex items-center mt-1">
                    <div className="w-full bg-[#232f4a] rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${
                          candidate.score >= 80 ? 'bg-green-500' : 
                          candidate.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                        }`} 
                        style={{ width: getComparisonBarWidth(candidate.score) }}
                      ></div>
                    </div>
                    <span className="ml-2 text-white">{candidate.score}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#1a2642] p-4 rounded-md border border-[#2a3655]">
            <div className="flex items-start">
              <Award className="text-[#4f87ff] mr-2 mt-1 flex-shrink-0" size={20} />
              <div>
                <h4 className="font-medium text-white mb-1">Recommendation</h4>
                <p className="text-gray-300">{getRecommendation()}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CandidateComparison;
