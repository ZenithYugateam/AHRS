import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, ChevronUp, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/HeaderCompany/Header';  // Import the Header component

interface CandidateRow {
  candidateId: string;
  jobId: number;
  status: number;
  title: string;
  postedOn: string;
}

const CandidateDetailsPage = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<CandidateRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof CandidateRow>('postedOn');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [userName, setUserName] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<string>('total-interview'); // Track current page

  // Retrieve company id and userName dynamically from session storage
  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setCompanyId(parsedUser.email);
        setUserName(parsedUser.name || parsedUser.email);
      } catch (error) {
        console.error("Error parsing user data from session storage:", error);
      }
    }
  }, []);

  // Fetch candidate data once companyId is available
  useEffect(() => {
    if (!companyId) return;

    axios
      .get(
        `https://p103cwsao7.execute-api.us-east-1.amazonaws.com/default/get_total_interview?company_id=${companyId}`
      )
      .then((response) => {
        const jobs = response.data.jobs || [];
        const candidateRows: CandidateRow[] = [];
        jobs.forEach((job: any) => {
          if (job.candidateList && Array.isArray(job.candidateList)) {
            job.candidateList.forEach((candidate: any) => {
              candidateRows.push({
                candidateId: candidate.candidateId,
                jobId: job.job_id,
                status: candidate.status,
                title: job.title || 'N/A',
                postedOn: job.posted_on || 'N/A',
              });
            });
          }
        });
        setCandidates(candidateRows);
      })
      .catch((error) => {
        console.error('Error fetching candidate data:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [companyId]);

  // Sorting functionality
  const handleSort = (field: keyof CandidateRow) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // **Updated navigateTo function**
  const navigateTo = (page: string) => {
    setCurrentPage(page);
    if (page === 'home') {
      navigate('/Company-dashboard');  // Navigate to the dashboard
    } else {
      navigate(`/${page}`);
    }
  };

  const openInterviewMaker = () => {
    setCurrentPage('interview-maker');
    navigate('/interview-maker');
  };

  // Map status to a color and label
  const getStatusColor = (status: number) => {
    const statusMap: Record<number, string> = {
      10: 'bg-green-500',
      5: 'bg-red-500',
      4: 'bg-yellow-500',
      3: 'bg-red-500',
      2: 'bg-blue-500',
      1: 'bg-gray-500',
    };
    return statusMap[status] || 'bg-gray-500';
  };

  const getStatusLabel = (status: number) => {
    if (status === 5) return 'Rejected';
    if (status === 10) return 'Selected';
    return status.toString();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Use Header instead of Navbar */}
      <Header
        userName={userName || "NithinCompany"}
        currentPage={currentPage}  // Pass the current page state
        navigateTo={navigateTo}
        openInterviewMaker={openInterviewMaker}
      />

      <main className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold text-purple-500">Candidate Details</h1>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search candidates..."
              className="w-full pl-10 pr-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-gray-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="animate-pulse p-6">
            <div className="h-6 bg-gray-700 rounded mb-4 w-1/3"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-700 rounded w-full"></div>
              ))}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-purple-500 shadow-lg">
            <table className="min-w-full bg-[#1a1a1a] divide-y divide-gray-800">
              <thead>
                <tr className="bg-purple-800">
                  {['candidateId', 'jobId', 'status', 'title', 'postedOn'].map((key) => (
                    <th
                      key={key}
                      className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider cursor-pointer hover:bg-[#3a3a3a] transition-colors"
                      onClick={() => handleSort(key as keyof CandidateRow)}
                    >
                      <div className="flex items-center space-x-2">
                        <span>{key}</span>
                        <div className="flex flex-col">
                          <ChevronUp size={14} className={sortField === key && sortDirection === 'asc' ? 'text-purple-500' : 'text-gray-600'} />
                          <ChevronDown size={14} className={sortField === key && sortDirection === 'desc' ? 'text-purple-500' : 'text-gray-600'} />
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {candidates.length > 0 ? (
                  candidates.map((candidate, index) => (
                    <tr key={index} className="hover:bg-[#2a2a2a] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">{candidate.candidateId}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{candidate.jobId}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
                          {getStatusLabel(candidate.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{candidate.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{candidate.postedOn}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center px-6 py-4">No candidates found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default CandidateDetailsPage;
