export interface Candidate {
    id: number;
    name: string;
    position: string;
    date: string;
    status: string;
    score: number;
  }
  
  export interface FilterOptions {
    position: string;
    minScore: number;
    maxScore: number;
    dateRange: {
      start: string;
      end: string;
    };
  }
  
  export interface ComparisonCandidate {
    id: number | null;
    name: string;
  }