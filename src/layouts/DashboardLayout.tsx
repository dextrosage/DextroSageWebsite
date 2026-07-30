import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, User, LogOut, Menu, X, Shield, Bell, Users } from 'lucide-react';
import { Loader } from '../components/ui/Loader';
import { BackgroundParticles } from '../components/ui/BackgroundParticles';
import { NotificationsDropdown } from '../components/NotificationsDropdown';

export const DashboardLayout: React.FC = () => {
  const { user, role, logout, isLoading } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  const getDashboardPath = () => {
    if (role === 'SADMIN') return '/sadmin';
    if (role === 'ADMIN') return '/admin';
    return '/user';
  };

  const getProfilePath = () => {
    if (role === 'SADMIN') return '/sadmin/profile';
    if (role === 'ADMIN') return '/admin/profile';
    return '/user/profile';
  };

  const navItems = [
    {
      name: 'Dashboard',
      path: getDashboardPath(),
      icon: <LayoutDashboard className="w-5 h-5" />,
      end: true
    },
    {
      name: 'Profile',
      path: getProfilePath(),
      icon: <User className="w-5 h-5" />,
      end: false
    },
    {
      name: 'Newsroom',
      path: role === 'SADMIN' ? '/sadmin/announcements' : (role === 'ADMIN' ? '/admin/announcements' : '/user/announcements'),
      icon: <Bell className="w-5 h-5" />,
      end: false
    },
    {
      name: 'Connections',
      path: role === 'SADMIN' ? '/sadmin/connections' : (role === 'ADMIN' ? '/admin/connections' : '/user/connections'),
      icon: <Users className="w-5 h-5" />,
      end: false
    }
  ];

  if (isLoading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f172a] relative">
        <BackgroundParticles />
        <Loader size="lg" text="Loading app session..." />
      </div>
    );
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#020617]/80 backdrop-blur-xl border-r border-white/5 relative z-10">
      {/* Brand logo */}
      <div className="flex items-center space-x-2 px-6 py-6 border-b border-white/5">
        <div className="w-10 h-10 shrink-0">
          <img src="/Logo.jpeg" alt="DextroSage Logo" className="w-full h-full object-contain rounded-xl" />
        </div>
        <div>
          <h1 className="font-bold text-white tracking-tight text-lg font-serif italic">DextroSage</h1>
          <p className="text-xxs font-medium text-blue-400 uppercase tracking-widest">{role} Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.end}
            onClick={closeMobileSidebar}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-inner'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
              }`
            }
          >
            {item.icon}
            <span className="uppercase tracking-wider text-xs">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* User info & Logout */}
      <div className="p-4 border-t border-white/5 bg-black/20">
        <div className="flex items-center space-x-3 px-2 py-3 rounded-lg mb-3">
          <div className="p-2 bg-white/5 border border-white/10 rounded-lg text-blue-400 shadow-sm">
            {role === 'ADMIN' || role === 'SADMIN' ? <Shield className="w-5 h-5" /> : <User className="w-5 h-5" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-200 truncate">{user?.name || 'Active User'}</p>
            <p className="text-xxs font-mono text-gray-500 truncate">{user?.email || 'N/A'}</p>
          </div>
        </div>
        <button
          onClick={() => {
            closeMobileSidebar();
            logout();
          }}
          className="flex items-center justify-center space-x-2 w-full px-4 py-2.5 rounded-lg text-sm font-bold text-white bg-red-500/80 border border-red-500/50 hover:bg-red-500 transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)] focus:outline-none focus:ring-2 focus:ring-red-500 uppercase tracking-widest"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] flex text-gray-200 relative overflow-hidden">
      <BackgroundParticles />
      
      {/* Desktop Sidebar (visible on md+) */}
      <div className="hidden md:block w-64 flex-shrink-0 h-screen sticky top-0 relative z-20">
        {sidebarContent}
      </div>

      {/* Mobile Drawer (visible on <md) */}
      {isMobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={closeMobileSidebar}
          />
          {/* Sidebar Drawer */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full h-full transform transition-transform duration-300 ease-in-out shadow-2xl">
            {/* Close button */}
            <div className="absolute top-0 right-0 -mr-12 pt-4 border-none">
              <button
                onClick={closeMobileSidebar}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 bg-[#020617]/80 text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen relative z-10 overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-[#020617]/60 backdrop-blur-md border-b border-white/5 h-20 flex items-center justify-between px-4 md:px-8 shadow-sm flex-shrink-0 relative z-50">
          <div className="flex items-center">
            {/* Mobile menu toggle */}
            <button
              onClick={toggleMobileSidebar}
              className="md:hidden p-2 mr-3 rounded-lg text-gray-400 hover:bg-white/10 hover:text-white focus:outline-none transition-colors border border-white/5"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="font-bold text-gray-200 tracking-[0.1em] uppercase text-sm md:text-base">
              {role === 'SADMIN' ? 'Super Admin Terminal' : role === 'ADMIN' ? 'Command Center' : 'User Environment'}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <NotificationsDropdown />
          </div>
        </header>

        {/* Page Content viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
