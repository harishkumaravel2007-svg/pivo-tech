import React, { useEffect, useState } from 'react';
import {
  CheckCircle,
  XCircle,
  Trash2,
  Star,
  ShieldCheck,
  AlertCircle,
  Clock,
  Plus,
  Edit2,
  Eye,
  EyeOff,
  ExternalLink,
  Upload,
  Globe,
  Building2,
  MapPin,
  Briefcase,
  MessageSquare,
  CornerDownRight,
  UserCheck,
  Search,
  Filter,
  FolderGit2,
  Link as LinkIcon
} from 'lucide-react';
import { api, getAssetUrl } from '../../services/api';
import { Review, Project } from '../../types';
import { RatingStars } from '../../components/RatingStars';
import { normalizeExternalUrl } from '../../utils/url';

export const ReviewsTab: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [summary, setSummary] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    average: 0
  });

  // Filters & Search
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);

  // Active review for editing or founder response
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    reviewer_name: '',
    business_name: '',
    business_logo_url: '',
    location: '',
    project_id: null as number | null,
    project_name: '',
    project_description: '',
    rating: 5,
    review_text: '',
    website_url: '',
    status: 'approved' as 'pending' | 'approved' | 'rejected',
    is_visible: 1,
    is_verified: 1,
    founder_response: ''
  });

  // Founder response input state
  const [founderResponseText, setFounderResponseText] = useState('');
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    loadReviews();
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const res = await api.getAllProjectsAdmin();
      setProjects(res.projects || []);
    } catch (err) {
      console.warn('Could not load portfolio projects for reviews linking:', err);
    }
  };

  const loadReviews = async () => {
    try {
      const res = await api.getAdminReviews();
      setReviews(res.reviews || []);
      setSummary(res.summary || {
        total: res.reviews?.length || 0,
        pending: res.reviews?.filter(r => r.status === 'pending').length || 0,
        approved: res.reviews?.filter(r => r.status === 'approved').length || 0,
        rejected: res.reviews?.filter(r => r.status === 'rejected').length || 0,
        average: 5.0
      });
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to load reviews' });
    }
  };

  const handleStatusChange = async (
    id: number,
    newStatus?: 'pending' | 'approved' | 'rejected',
    isVerified?: boolean,
    isVisible?: boolean
  ) => {
    try {
      await api.updateReviewStatus(id, newStatus, isVerified, isVisible);
      setStatusMsg({
        type: 'success',
        text: `Review status updated successfully.`
      });
      loadReviews();
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message });
    }
  };

  const handleLinkProject = async (reviewId: number, projectId: number | null) => {
    try {
      await api.linkReviewToProject(reviewId, projectId);
      const projName = projectId ? projects.find(p => p.id === projectId)?.name : null;
      setStatusMsg({
        type: 'success',
        text: projectId
          ? `Review linked to project "${projName}".`
          : 'Review unlinked from project.'
      });
      loadReviews();
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to link review to project' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to permanently delete this client review record?')) return;
    try {
      await api.deleteReview(id);
      setStatusMsg({ type: 'success', text: 'Review record permanently removed.' });
      loadReviews();
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message });
    }
  };

  const openAddModal = () => {
    setFormData({
      reviewer_name: '',
      business_name: '',
      business_logo_url: '',
      location: '',
      project_id: null,
      project_name: '',
      project_description: '',
      rating: 5,
      review_text: '',
      website_url: '',
      status: 'approved',
      is_visible: 1,
      is_verified: 1,
      founder_response: ''
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (rev: Review) => {
    setSelectedReview(rev);
    setFormData({
      reviewer_name: rev.reviewer_name,
      business_name: rev.business_name || '',
      business_logo_url: rev.business_logo_url || '',
      location: rev.location || '',
      project_id: rev.project_id || null,
      project_name: rev.project_name || '',
      project_description: rev.project_description || '',
      rating: rev.rating,
      review_text: rev.review_text,
      website_url: rev.website_url || '',
      status: rev.status,
      is_visible: rev.is_visible !== undefined ? rev.is_visible : 1,
      is_verified: rev.is_verified,
      founder_response: rev.founder_response || ''
    });
    setIsEditModalOpen(true);
  };

  const openResponseModal = (rev: Review) => {
    setSelectedReview(rev);
    setFounderResponseText(rev.founder_response || '');
    setIsResponseModalOpen(true);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    setStatusMsg(null);
    try {
      const res = await api.uploadFile(file);
      setFormData(prev => ({ ...prev, business_logo_url: res.url }));
      setStatusMsg({ type: 'success', text: 'Client logo uploaded successfully.' });
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Logo upload failed.' });
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSaveNewReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.adminAddClientReview({
        ...formData,
        is_visible: formData.is_visible ? 1 : 0,
        is_verified: formData.is_verified ? 1 : 0
      });
      setIsAddModalOpen(false);
      setStatusMsg({ type: 'success', text: 'New client review added successfully.' });
      loadReviews();
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to add client review' });
    }
  };

  const handleSaveEditReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReview) return;

    try {
      await api.adminUpdateClientReview(selectedReview.id, {
        ...formData,
        is_visible: formData.is_visible ? 1 : 0,
        is_verified: formData.is_verified ? 1 : 0
      });
      setIsEditModalOpen(false);
      setSelectedReview(null);
      setStatusMsg({ type: 'success', text: 'Client review record updated successfully.' });
      loadReviews();
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to update client review' });
    }
  };

  const handleSaveFounderResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReview) return;

    try {
      await api.adminSetFounderResponse(selectedReview.id, founderResponseText.trim() || null);
      setIsResponseModalOpen(false);
      setSelectedReview(null);
      setStatusMsg({
        type: 'success',
        text: founderResponseText.trim()
          ? 'Official Founder Response published successfully.'
          : 'Official Founder Response removed.'
      });
      loadReviews();
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to save founder response' });
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (filter !== 'all' && r.status !== filter) return false;
    if (projectFilter !== 'all') {
      if (projectFilter === 'unlinked' && r.project_id) return false;
      if (projectFilter !== 'unlinked' && String(r.project_id) !== projectFilter) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = [
        r.review_id,
        r.reviewer_name,
        r.business_name,
        r.location,
        r.project_name,
        r.linked_project_name,
        r.review_text
      ].filter(Boolean).join(' ').toLowerCase();
      if (!matchText.includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-subtle space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#C6A15B]">
            Client Showcase &amp; Review Management
          </span>
          <h2 className="text-2xl font-extrabold text-[#101B33] mt-1">
            Client Review Management &amp; Moderation
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Approve incoming submissions, link testimonials to portfolio projects, issue unique IDs, and publish official founder responses.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#101B33] text-white hover:bg-[#1C2C4E] text-xs font-bold transition-all shadow-sm active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 text-[#C6A15B]" />
          <span>Add Client Review (With Permission)</span>
        </button>
      </div>

      {statusMsg && (
        <div className={`p-4 rounded-xl text-xs flex items-center justify-between gap-2.5 ${
          statusMsg.type === 'success'
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          <div className="flex items-center gap-2">
            {statusMsg.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{statusMsg.text}</span>
          </div>
          <button
            onClick={() => setStatusMsg(null)}
            className="text-xs font-bold opacity-60 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Summary Counter Strips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
          <span className="block text-2xl font-extrabold text-[#101B33]">{summary.total}</span>
          <span className="text-xs text-slate-500 font-semibold uppercase">Total Records</span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center">
          <span className="block text-2xl font-extrabold text-amber-800">{summary.pending}</span>
          <span className="text-xs text-amber-700 font-semibold uppercase">Pending Moderation</span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
          <span className="block text-2xl font-extrabold text-emerald-800">{summary.approved}</span>
          <span className="text-xs text-emerald-700 font-semibold uppercase">Live &amp; Approved</span>
        </div>

        <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-center">
          <span className="block text-2xl font-extrabold text-purple-900">
            {summary.average > 0 ? summary.average.toFixed(1) : '-'} / 5.0
          </span>
          <span className="text-xs text-purple-700 font-semibold uppercase">Live Score Average</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by review ID, reviewer, business, or keyword..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-[#C6A15B]"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 font-medium focus:outline-none"
          >
            <option value="all">All Linked Projects</option>
            <option value="unlinked">Unlinked Reviews</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <div className="flex gap-1 bg-white p-1 rounded-xl border border-slate-200">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  filter === st
                    ? 'bg-[#101B33] text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews and Clients List */}
      <div className="space-y-4">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((rev) => {
            const displayId = rev.review_id || `PIVO-REV-${rev.id}`;

            return (
              <div
                key={rev.id}
                className={`p-6 rounded-2xl border transition-all flex flex-col gap-4 ${
                  rev.status === 'pending'
                    ? 'bg-amber-50/40 border-amber-200'
                    : rev.status === 'approved'
                    ? 'bg-white border-slate-200 shadow-sm'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                {/* Header row: Identity, Review ID, Badges & Rating */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    {/* Logo or Initial */}
                    {rev.business_logo_url ? (
                      <img
                        src={getAssetUrl(rev.business_logo_url)}
                        alt={rev.business_name || rev.reviewer_name}
                        className="w-12 h-12 rounded-xl object-contain bg-slate-50 border border-slate-200 p-1 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-[#101B33] text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {(rev.business_name || rev.reviewer_name).substring(0, 2).toUpperCase()}
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Review ID Badge (MODULE 3) */}
                        <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-[#101B33] text-[#E5C378] tracking-wider border border-[#1A2846]">
                          {displayId}
                        </span>

                        <h4 className="text-base font-bold text-[#101B33]">
                          {rev.business_name || rev.reviewer_name}
                        </h4>

                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          rev.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : rev.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {rev.status}
                        </span>

                        {rev.is_verified === 1 && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200">
                            Verified Client
                          </span>
                        )}

                        {/* Linked Project Badge (MODULE 4) */}
                        {rev.linked_project_name && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F4EBD8] text-[#8C6D2D] border border-[#E5C378] flex items-center gap-1">
                            <FolderGit2 className="w-3 h-3 text-[#C6A15B]" />
                            <span>Linked: {rev.linked_project_name}</span>
                          </span>
                        )}

                        {rev.is_visible === 0 && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200">
                            Hidden from Showcase
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 mt-1 font-medium">
                        Client Contact: {rev.reviewer_name} {rev.location && `• ${rev.location}`}
                      </p>

                      {rev.project_name && (
                        <p className="text-xs text-[#101B33] font-semibold mt-0.5">
                          Project: {rev.project_name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end shrink-0">
                    <RatingStars rating={rev.rating} size="sm" />
                    <span className="text-[10px] text-slate-400 mt-1">
                      Submitted: {new Date(rev.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Review Text */}
                <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-100 text-xs text-slate-700 italic">
                  "{rev.review_text}"
                </div>

                {/* External Client Website */}
                {(() => {
                  const safeUrl = normalizeExternalUrl(rev.website_url);
                  if (!safeUrl) return null;
                  return (
                    <div className="flex items-center gap-2 text-xs">
                      <Globe className="w-3.5 h-3.5 text-[#C6A15B]" />
                      <span className="text-slate-500 font-medium">Website:</span>
                      <a
                        href={safeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#101B33] hover:underline font-semibold inline-flex items-center gap-1"
                      >
                        <span>{safeUrl}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    </div>
                  );
                })()}

                {/* Founder Response Display */}
                {rev.founder_response && (
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-50/60 to-slate-50 border border-blue-100">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#101B33] mb-1">
                      <div className="flex items-center gap-1.5">
                        <CornerDownRight className="w-3.5 h-3.5 text-[#C6A15B]" />
                        <span>Official Response from Harish K, Founder &amp; CEO:</span>
                      </div>
                      {rev.founder_responded_at && (
                        <span className="text-[10px] text-slate-400 font-normal">
                          {new Date(rev.founder_responded_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-700 pl-5">
                      {rev.founder_response}
                    </p>
                  </div>
                )}

                {/* Link to Portfolio Project Selector (MODULE 4) */}
                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <LinkIcon className="w-3.5 h-3.5 text-[#C6A15B]" />
                    <span className="font-bold text-slate-700">Associated Portfolio Project:</span>
                  </div>
                  <select
                    value={rev.project_id || ''}
                    onChange={(e) => handleLinkProject(rev.id, e.target.value ? Number(e.target.value) : null)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-[#101B33] focus:outline-none focus:border-[#C6A15B]"
                  >
                    <option value="">-- No Linked Portfolio Project --</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.category})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  {/* Status moderation */}
                  <div className="flex flex-wrap items-center gap-2">
                    {rev.status !== 'approved' ? (
                      <>
                        <button
                          onClick={() => handleStatusChange(rev.id, 'approved', false, true)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleStatusChange(rev.id, 'approved', true, true)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#101B33] text-[#E5C378] hover:bg-[#1C2C4E] border border-[#C6A15B]/30 transition-colors"
                        >
                          <UserCheck className="w-3.5 h-3.5 text-[#C6A15B]" />
                          <span>Approve (Verified)</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(rev.id, 'approved', !rev.is_verified, rev.is_visible !== 0)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <span>{rev.is_verified ? 'Remove Verified' : 'Mark Verified'}</span>
                      </button>
                    )}

                    {rev.status !== 'rejected' && (
                      <button
                        onClick={() => handleStatusChange(rev.id, 'rejected', false, false)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5 text-rose-500" />
                        <span>Reject</span>
                      </button>
                    )}

                    {/* Visibility Toggle */}
                    <button
                      onClick={() => handleStatusChange(rev.id, undefined, undefined, rev.is_visible === 0)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                      title={rev.is_visible === 0 ? 'Make visible in showcase' : 'Hide from showcase'}
                    >
                      {rev.is_visible === 0 ? (
                        <>
                          <Eye className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Show Publicly</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                          <span>Hide</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openResponseModal(rev)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                      <span>{rev.founder_response ? 'Edit Response' : 'Founder Response'}</span>
                    </button>

                    <button
                      onClick={() => openEditModal(rev)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDelete(rev.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Permanently Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-xs text-slate-500 py-8 text-center">
            No client reviews matching the current filters.
          </p>
        )}
      </div>

      {/* Modal: Add Client Review (With Permission) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 my-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-[#C6A15B]">
                  Direct Entry
                </span>
                <h3 className="text-lg font-bold text-[#101B33]">
                  Add Client Review (With Permission)
                </h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNewReview} className="space-y-4 mt-6 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">Client Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.reviewer_name}
                    onChange={(e) => setFormData({ ...formData, reviewer_name: e.target.value })}
                    placeholder="e.g. Ramesh Krishnan"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">Business / Company Name</label>
                  <input
                    type="text"
                    value={formData.business_name}
                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                    placeholder="e.g. Sri Balaji Stationery"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>
              </div>

              {/* Associate with Portfolio Project */}
              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">
                  Associate With Portfolio Project (MODULE 4)
                </label>
                <select
                  value={formData.project_id || ''}
                  onChange={(e) => setFormData({ ...formData, project_id: e.target.value ? Number(e.target.value) : null })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-white text-slate-800"
                >
                  <option value="">-- No Direct Project Association --</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Sowcarpet, Chennai"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">Project Name (Optional)</label>
                  <input
                    type="text"
                    value={formData.project_name}
                    onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                    placeholder="e.g. Retail Web & Catalog Platform"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">Rating (1 to 5 Stars) *</label>
                <div className="p-3 bg-[#F7F8FA] rounded-xl border border-slate-200 flex items-center justify-between">
                  <RatingStars
                    rating={formData.rating}
                    size="md"
                    interactive={true}
                    onRatingChange={(newVal) => setFormData({ ...formData, rating: newVal })}
                  />
                  <span className="font-bold text-[#101B33]">{formData.rating} of 5 Stars</span>
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">Written Review / Feedback *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.review_text}
                  onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
                  placeholder="Enter genuine client review quote..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
                />
              </div>

              {/* Website URL */}
              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">Client Website URL (Optional)</label>
                <input
                  type="url"
                  value={formData.website_url}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  placeholder="https://sri-balaji-stationery.com"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              {/* Status and Flags */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-2 gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_verified === 1}
                    onChange={(e) => setFormData({ ...formData, is_verified: e.target.checked ? 1 : 0 })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="font-semibold text-slate-700">Mark as Verified Client</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_visible === 1}
                    onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked ? 1 : 0 })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="font-semibold text-slate-700">Visible in Public Showcase</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#101B33] text-white hover:bg-[#1C2C4E] font-semibold"
                >
                  Save &amp; Publish Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Client Review */}
      {isEditModalOpen && selectedReview && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 my-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-[#C6A15B]">
                  Record #{selectedReview.id} &bull; {selectedReview.review_id || `PIVO-REV-${selectedReview.id}`}
                </span>
                <h3 className="text-lg font-bold text-[#101B33]">
                  Edit Client Review
                </h3>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditReview} className="space-y-4 mt-6 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">Client Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.reviewer_name}
                    onChange={(e) => setFormData({ ...formData, reviewer_name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">Business Name</label>
                  <input
                    type="text"
                    value={formData.business_name}
                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              {/* Associated Portfolio Project */}
              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">
                  Associated Portfolio Project (MODULE 4)
                </label>
                <select
                  value={formData.project_id || ''}
                  onChange={(e) => setFormData({ ...formData, project_id: e.target.value ? Number(e.target.value) : null })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-white text-slate-800"
                >
                  <option value="">-- No Direct Project Association --</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                  >
                    <option value="pending">Pending Moderation</option>
                    <option value="approved">Approved &amp; Live</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">Rating (1 to 5 Stars)</label>
                <div className="p-3 bg-[#F7F8FA] rounded-xl border border-slate-200 flex items-center justify-between">
                  <RatingStars
                    rating={formData.rating}
                    size="md"
                    interactive={true}
                    onRatingChange={(newVal) => setFormData({ ...formData, rating: newVal })}
                  />
                  <span className="font-bold text-[#101B33]">{formData.rating} of 5 Stars</span>
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">Written Feedback *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.review_text}
                  onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">Client Website URL</label>
                <input
                  type="url"
                  value={formData.website_url}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-2 gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_verified === 1}
                    onChange={(e) => setFormData({ ...formData, is_verified: e.target.checked ? 1 : 0 })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="font-semibold text-slate-700">Verified Client Badge</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_visible === 1}
                    onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked ? 1 : 0 })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="font-semibold text-slate-700">Visible in Public Showcase</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#101B33] text-white hover:bg-[#1C2C4E] font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Founder Response */}
      {isResponseModalOpen && selectedReview && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 my-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-[#C6A15B]">
                  Official Founder Response
                </span>
                <h3 className="text-lg font-bold text-[#101B33]">
                  Reply to {selectedReview.business_name || selectedReview.reviewer_name}
                </h3>
              </div>
              <button onClick={() => setIsResponseModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveFounderResponse} className="space-y-4 mt-6 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 italic text-slate-600">
                "{selectedReview.review_text}"
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">
                  Harish K Official Response
                </label>
                <textarea
                  rows={4}
                  value={founderResponseText}
                  onChange={(e) => setFounderResponseText(e.target.value)}
                  placeholder="Thank you for your feedback! It was an honor delivering your project..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsResponseModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#101B33] text-white hover:bg-[#1C2C4E] font-semibold"
                >
                  Publish Founder Response
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
