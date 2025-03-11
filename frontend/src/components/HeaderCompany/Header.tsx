import React from 'react';
import { Home, Package, Mic, User, Bell, Search, Video, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  userName?: string;
  currentPage?: string;
  navigateTo: (page: string) => void;
  openInterviewMaker: () => void;
}

export function Header({ userName, currentPage, navigateTo, openInterviewMaker }: HeaderProps) {
  const navigate = useNavigate();

  const handleNavigation = (page: string) => {
    if (page === 'home') {
      navigate('/Company-dashboard');  // Redirect to Company Dashboard
    } else if (page === 'total-interview') {
      navigate('/total-interview');
    } else {
      navigateTo(page);
    }
  };

  return (
    <header className="bg-[#0f172a] border-b border-gray-800/50 sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between px-4 h-16">
          {/* Left section with logo and navigation */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="bg-purple-600 p-2 rounded">
                <Video size={20} className="text-white" />
              </div>
              <h1 className="text-xl font-semibold text-white">
                247Interview.com
              </h1>
            </div>
            
            <nav className="hidden md:flex items-center space-x-1">
              <a
                href="#"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                  currentPage === 'home' 
                    ? 'bg-purple-500/10 text-purple-400' 
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => handleNavigation('home')}
              >
                <Home size={16} />
                <span>Home</span>
              </a>
              <a 
                href="#"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                  currentPage === 'packages' 
                    ? 'bg-purple-500/10 text-purple-400' 
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => handleNavigation('packages')}
              >
                <Package size={16} />
                <span>Packages</span>
              </a>
              <a
                href="#"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                  currentPage === 'interview-maker' 
                    ? 'bg-purple-500/10 text-purple-400' 
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={openInterviewMaker}
              >
                <Mic size={16} />
                <span>Interview Maker</span>
              </a>
              <a
                href="#"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                  currentPage === 'total-interview' 
                    ? 'bg-purple-500/10 text-purple-400' 
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => handleNavigation('total-interview')}
              >
                <Users size={16} />
                <span>Candidates</span>
              </a>
            </nav>
          </div>

          {/* Right section with search, notifications, and profile */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="hidden lg:flex items-center">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-2.5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-gray-800 text-gray-300 text-sm pl-9 pr-4 py-2 rounded-md w-60 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                />
              </div>
            </div>

            {/* Subscription Button */}
            <button 
              className="hidden md:flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded-md text-sm transition-colors"
              onClick={() => handleNavigation('packages')}
            >
              <span>Upgrade Plan</span>
            </button>

            {/* Company Info & Profile */}
            <div className="flex items-center space-x-3 pl-3 border-l border-gray-800">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-white">
                  {userName || "NithinCompany"}
                </p>
                <p className="text-xs text-gray-400">Premium Plan</p>
              </div>
              <div className="relative">
                <button className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center text-white hover:bg-gray-700 transition-colors">
                  <span className="text-sm font-medium">
                    {userName ? userName[0].toUpperCase() : "N"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="md:hidden flex items-center justify-around px-2 py-2 bg-gray-800/50">
        <a
          href="#"
          className={`flex flex-col items-center space-y-1 p-2 ${
            currentPage === 'home' ? 'text-purple-400' : 'text-gray-400'
          }`}
          onClick={() => handleNavigation('home')}
        >
          <Home size={18} />
          <span className="text-xs">Home</span>
        </a>
        <a
          href="#"
          className={`flex flex-col items-center space-y-1 p-2 ${
            currentPage === 'packages' ? 'text-purple-400' : 'text-gray-400'
          }`}
          onClick={() => handleNavigation('packages')}
        >
          <Package size={18} />
          <span className="text-xs">Packages</span>
        </a>
        <a
          href="#"
          className={`flex flex-col items-center space-y-1 p-2 ${
            currentPage === 'interview-maker' ? 'text-purple-400' : 'text-gray-400'
          }`}
          onClick={openInterviewMaker}
        >
          <Mic size={18} />
          <span className="text-xs">Interview</span>
        </a>
        <a
          href="#"
          className={`flex flex-col items-center space-y-1 p-2 ${
            currentPage === 'total-interview' ? 'text-purple-400' : 'text-gray-400'
          }`}
          onClick={() => handleNavigation('total-interview')}
        >
          <Users size={18} />
          <span className="text-xs">Candidates</span>
        </a>
      </nav>
    </header>
  );
}