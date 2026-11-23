import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Sidebar } from '../components/navigation/Sidebar.jsx';
import { Navbar } from '../components/navigation/Navbar.jsx';
import { TaskModal } from '../components/tasks/TaskModal.jsx';
import { useTodo } from '../context/TodoContext.jsx';

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { openCreateModal } = useTodo();

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] transition-colors duration-200">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        {/* Top Navigation Bar */}
        <Navbar onOpenSidebar={() => setSidebarOpen(true)} />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Floating Action Button */}
      <button
        onClick={openCreateModal}
        aria-label="Add new task"
        className="fixed bottom-6 right-6 lg:hidden z-40 w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-500/35 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>

      {/* Universal Task Creation & Editing Modal */}
      <TaskModal />
    </div>
  );
};
