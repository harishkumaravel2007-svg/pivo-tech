import React, { useEffect, useState } from 'react';
import {
  Inbox,
  MessageSquare,
  FolderGit2,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';
import { api } from '../../services/api';
import { AdminTab } from './DashboardLayout';

interface OverviewTabProps {
  setActiveTab: (tab: AdminTab) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ setActiveTab }) => {
  const [stats, setStats] = useState({
    enquiriesTotal: 0,
    enquiriesNew: 0,
    reviewsTotal: 0,
    reviewsPending: 0,
    projectsCount: 0,
    servicesCount: 0,
    skillsCount: 0
  });
  const [recentEnquiries, setRecentEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOverview() {
      try {
        const [enqRes, revRes, projRes, servRes, skillRes] = await Promise.all([
          api.getAdminEnquiries().catch(() => ({ enquiries: [], summary: { total: 0, new: 0 } })),
          api.getAdminReviews().catch(() => ({ reviews: [], summary: { total: 0, pending: 0 } })),
          api.getProjects().catch(() => ({ projects: [] })),
          api.getServices().catch(() => ({ services: [] })),
          api.getSkills().catch(() => ({ skills: [] }))
        ]);

        setStats({
          enquiriesTotal: enqRes.summary.total,
          enquiriesNew: enqRes.summary.new,
          reviewsTotal: revRes.summary.total,
          reviewsPending: revRes.summary.pending,
          projectsCount: projRes.projects.length,
          servicesCount: servRes.services.length,
          skillsCount: skillRes.skills.length
        });
        setRecentEnquiries(enqRes.enquiries.slice(0, 5));
      } catch (err) {
        console.error('Error fetching overview stats:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOverview();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-[#101B33] text-white rounded-3xl p-8 border border-[#1A2846] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#C6A15B]">
            Administrative Operations
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-white">
            PIVO TECH Command Suite
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Founder Harish K &bull; Headquarters: Theni, Tamil Nadu, India.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveTab('enquiries')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#C6A15B] text-[#101B33] hover:bg-[#D4AF37] transition-all"
          >
            <span>Review New Enquiries</span>
            {stats.enquiriesNew > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#101B33] text-[#E5C378] text-[10px]">
                {stats.enquiriesNew}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#1C2C4E] text-slate-200 hover:text-white transition-colors border border-slate-700/60"
          >
            <span>Add New Project</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Enquiries Card */}
        <div
          onClick={() => setActiveTab('enquiries')}
          className="bg-white rounded-2xl p-6 border border-slate-200 shadow-subtle hover:border-[#C6A15B] cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Client Enquiries
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#101B33]">
            {stats.enquiriesTotal}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
            <span className="font-semibold text-emerald-600">{stats.enquiriesNew} new</span>
            <span>awaiting reply</span>
          </div>
        </div>

        {/* Reviews Card */}
        <div
          onClick={() => setActiveTab('reviews')}
          className="bg-white rounded-2xl p-6 border border-slate-200 shadow-subtle hover:border-[#C6A15B] cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Reviews &amp; Ratings
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#101B33]">
            {stats.reviewsTotal}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
            <span className="font-semibold text-amber-600">{stats.reviewsPending} pending</span>
            <span>moderation</span>
          </div>
        </div>

        {/* Projects Card */}
        <div
          onClick={() => setActiveTab('projects')}
          className="bg-white rounded-2xl p-6 border border-slate-200 shadow-subtle hover:border-[#C6A15B] cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Portfolio Projects
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#101B33]">
            {stats.projectsCount}
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Showcased on portfolio
          </div>
        </div>

        {/* Services Card */}
        <div
          onClick={() => setActiveTab('services')}
          className="bg-white rounded-2xl p-6 border border-slate-200 shadow-subtle hover:border-[#C6A15B] cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Agency Services
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#101B33]">
            {stats.servicesCount}
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Active service offerings
          </div>
        </div>
      </div>

      {/* Recent Enquiries Strip */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-subtle">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-[#101B33]">
            Recent Client Project Enquiries
          </h3>
          <button
            onClick={() => setActiveTab('enquiries')}
            className="text-xs font-semibold text-[#101B33] hover:text-[#C6A15B] flex items-center gap-1 transition-colors"
          >
            <span>View All Enquiries</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentEnquiries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F8FA] text-slate-600 uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-3 px-4 rounded-l-xl">Client Name</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 rounded-r-xl">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentEnquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-[#101B33]">
                      {enq.full_name}
                      {enq.business_name && (
                        <span className="block text-[11px] font-normal text-slate-500">
                          {enq.business_name}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {enq.service_required}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div>{enq.email}</div>
                      <div className="text-slate-400">{enq.phone}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        enq.status === 'new'
                          ? 'bg-blue-100 text-blue-800'
                          : enq.status === 'in_discussion'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {enq.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(enq.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-6 text-center">
            No contact enquiries logged yet.
          </p>
        )}
      </div>
    </div>
  );
};
