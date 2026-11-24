import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  User,
  Layers,
  Code2,
  FolderGit2,
  Award,
  MessageSquare,
  Inbox,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../../components/Logo';
import { OverviewTab } from './OverviewTab';
import { CompanyInfoTab } from './CompanyInfoTab';
import { FounderTab } from './FounderTab';
import { ServicesTab } from './ServicesTab';
import { ProjectsTab } from './ProjectsTab';
import { ReviewsTab } from './ReviewsTab';
import { EnquiriesTab } from './EnquiriesTab';
import { SettingsTab } from './SettingsTab';

export type AdminTab =
  | 'overview'
  | 'company'
  | 'founder'
  | 'services'
  | 'projects'
  | 'reviews'
  | 'enquiries'
  | 'settings';

export const DashboardLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const { user, isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F8FA]">
        <div className="text-sm font-semibold text-[#101B33]">Loading PIVO TECH Admin Suite...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'enquiries', label: 'Client Enquiries', icon: Inbox },
    { id: 'reviews', label: 'Review Moderation', icon: MessageSquare },
    { id: 'projects', label: 'Portfolio Projects', icon: FolderGit2 },
    { id: 'services', label: 'Services', icon: Layers },
    { id: 'founder', label: 'Founder Profile', icon: User },
    { id: 'company', label: 'Company Info', icon: Building2 },
    { id: 'settings', label: 'Website Settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#101B33] text-white flex flex-col justify-between shrink-0 md:min-h-screen">
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-[#1A2846] flex items-center justify-between">
            <Logo variant="dark" size="sm" />
          </div>

          <div className="px-4 py-3 bg-[#0C1527] border-b border-[#1A2846] flex items-center justify-between text-xs">
            <span className="text-slate-400">Signed in as</span>
            <span className="font-bold text-[#C6A15B]">{user?.username}</span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as AdminTab)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors text-left ${
                    isActive
                      ? 'bg-[#C6A15B] text-[#101B33]'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#101B33]' : 'text-[#C6A15B]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-[#1A2846] space-y-2">
          <Link
            to="/"
            target="_blank"
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'overview' && <OverviewTab setActiveTab={setActiveTab} />}
          {activeTab === 'enquiries' && <EnquiriesTab />}
          {activeTab === 'reviews' && <ReviewsTab />}
          {activeTab === 'projects' && <ProjectsTab />}
          {activeTab === 'services' && <ServicesTab />}
          {activeTab === 'founder' && <FounderTab />}
          {activeTab === 'company' && <CompanyInfoTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </div>
      </main>
    </div>
  );
};
