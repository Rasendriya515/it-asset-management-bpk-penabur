import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-penabur-light">
      <Sidebar />

      <div className="md:ml-64 min-h-screen flex flex-col">
        
        <TopBar />

        <main className="flex-1 p-6 mt-16 overflow-x-hidden">
          {children}
        </main>
        
        <footer className="p-4 text-center text-xs text-gray-400">
          IT Asset Management v1.0 &copy; BPK PENABUR
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;