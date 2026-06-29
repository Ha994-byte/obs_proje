import { useState } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import Navbar from '../components/Navbar.jsx';

export default function StudentLayout({ children, currentPage, onPageChange }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen flex-col lg:flex-row">
        {/* Sidebar */}
        <Sidebar 
          currentPage={currentPage} 
          onPageChange={onPageChange} 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Navbar */}
          <Navbar 
            currentPage={currentPage} 
            onMenuClick={() => setSidebarOpen(true)}
            onPageChange={onPageChange}
          />

          {/* Content */}
          <main className="flex-1 overflow-auto bg-background text-slate-800">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
