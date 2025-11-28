import React from 'react';
import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TopBar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role') || 'Guest';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="bg-white h-16 fixed top-0 right-0 left-0 lg:left-64 z-10 border-b border-gray-200 shadow-sm transition-all duration-300">
      
      <div className="flex items-center justify-between h-full px-6">
        
        <div className="font-bold text-penabur-blue text-lg truncate">
          IT Asset Management - BPK Penabur
        </div>
        <div className="flex items-center space-x-4">
          
          <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
            <div className="bg-penabur-blue text-white p-1 rounded-full">
              <User size={14} />
            </div>
            <span className="text-sm font-medium text-gray-600 hidden sm:inline">
              Signed in as <span className="text-penabur-blue font-bold uppercase">{role}</span>
            </span>
          </div>

          <button 
            onClick={handleLogout}
            className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
            title="Logout"
          >
            <LogOut size={20} />
          </button>

        </div>
      </div>
    </div>
  );
};

export default TopBar;