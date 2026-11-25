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
  UserCheck
} from 'lucide-react';
import { api, getAssetUrl } from '../../services/api';
import { Review } from '../../types';
import { RatingStars } from '../../components/RatingStars';

export const ReviewsTab: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    average: 0
  });
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
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
  }, []);

  const loadReviews = async () => {
    try {
      const res = await api.getAdminReviews();
      setReviews(res.reviews);
      setSummary(res.summary);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message });
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
    try {
      const res = await api.uploadFile(file);
      setFormData(prev => ({ ...prev, business_logo_url: res.url }));
      setStatusMsg({ type: 'success', text: 'Client logo uploaded successfully.' });
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to upload logo' });
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSaveNewClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.reviewer_name.trim() || !formData.review_text.trim()) {
      setStatusMsg({ type: 'error', text: 'Client name and written review are required.' });
      return;
    }

    try {
      await api.adminAddClientReview({
        ...formData,
        is_visible: formData.is_visible ? 1 : 0,
        is_verified: formData.is_verified ? 1 : 0
      });
      setIsAddModalOpen(false);
      setStatusMsg({ type: 'success', text: 'Genuine client review record created and published.' });
      loadReviews();
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to create client review' });
    }
  };

  const handleSaveEditClient = async (e: React.FormEvent) => {
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

  const filteredReviews = filter === 'all'
    ? reviews
    : reviews.filter(r => r.status === filter);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-subtle space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#C6A15B]">
            Client Showcase &amp; Review Management
          </span>
          <h2 className="text-2xl font-extrabold text-[#101B33] mt-1">
            Client Management &amp; Moderation
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Manage genuine client reviews received with permission, upload client logos, edit external website URLs, and publish official founder responses.
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

      {/* Filters */}
      <div className="flex gap-2 border-b border-slate-100 pb-4 overflow-x-auto">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
              filter === st
                ? 'bg-[#101B33] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {st} ({st === 'all' ? reviews.length : reviews.filter(r => r.status === st).length})
          </button>
        ))}
      </div>

      {/* Reviews and Clients List */}
      <div className="space-y-4">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((rev) => (
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
              {/* Header row: Identity & Meta */}
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
                      {rev.is_visible === 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200">
                          Hidden from Showcase
                        </span>
                      )}
                      {rev.created_by === 'founder' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-blue-800 bg-blue-50 border border-blue-200">
                          Founder Added
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 mt-0.5 font-medium">
                      Client Contact: {rev.reviewer_name} {rev.location && `• ${rev.location}`}
                    </p>

                    {rev.project_name && (
                      <p className="text-xs text-[#101B33] font-semibold mt-1">
                        Project: {rev.project_name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:items-end">
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
              {rev.website_url && (
                <div className="flex items-center gap-2 text-xs">
                  <Globe className="w-3.5 h-3.5 text-[#C6A15B]" />
                  <span className="text-slate-500 font-medium">Website:</span>
                  <a
                    href={rev.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#101B33] hover:underline font-semibold inline-flex items-center gap-1"
                  >
                    <span>{rev.website_url}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </div>
              )}

              {/* Distinct Official Founder Response */}
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

              {/* Management Control Actions */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                {/* Moderation status buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  {rev.status !== 'approved' ? (
                    <>
                      <button
                        onClick={() => handleStatusChange(rev.id, 'approved', false, true)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                        title="Approve without verified badge"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleStatusChange(rev.id, 'approved', true, true)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#101B33] text-[#E5C378] hover:bg-[#1C2C4E] border border-[#C6A15B]/30 transition-colors"
                        title="Approve and mark as verified client"
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

                {/* Edit, Response & Delete actions */}
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
          ))
        ) : (
          <p className="text-xs text-slate-500 py-8 text-center">
            No client reviews matching the "{filter}" filter.
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
                  Client Management
                </span>
                <h3 className="text-xl font-bold text-[#101B33]">
                  Add Genuine Client Review (With Permission)
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNewClient} className="space-y-4 mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Client Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.reviewer_name}
                    onChange={(e) => setFormData({ ...formData, reviewer_name: e.target.value })}
                    placeholder="e.g. Arun Prakash"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Business / Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.business_name}
                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                    placeholder="e.g. Skyline Logistics India"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>
              </div>

              {/* Logo Upload & URL */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Business Logo
                </label>
                <div className="flex items-center gap-3">
                  {formData.business_logo_url && (
                    <img
                      src={getAssetUrl(formData.business_logo_url)}
                      alt="Logo preview"
                      className="w-12 h-12 rounded-xl object-contain bg-slate-50 border border-slate-200 p-1"
                    />
                  )}
                  <input
                    type="text"
                    value={formData.business_logo_url}
                    onChange={(e) => setFormData({ ...formData, business_logo_url: e.target.value })}
                    placeholder="https://... or upload below"
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
                  />
                  <label className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer shrink-0">
                    <Upload className="w-4 h-4 inline mr-1" />
                    {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      disabled={uploadingLogo}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Chennai, Tamil Nadu"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Client Website URL
                  </label>
                  <input
                    type="text"
                    value={formData.website_url}
                    onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                    placeholder="https://clientdomain.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={formData.project_name}
                    onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                    placeholder="e.g. Fleet ERP &amp; Customer Portal"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Rating (1 to 5 Stars) *
                  </label>
                  <div className="flex items-center gap-3 py-1">
                    <RatingStars
                      rating={formData.rating}
                      size="md"
                      interactive={true}
                      onRatingChange={(r) => setFormData({ ...formData, rating: r })}
                    />
                    <span className="text-xs font-bold text-[#101B33]">
                      {formData.rating} Stars
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Project Description (Optional)
                </label>
                <input
                  type="text"
                  value={formData.project_description}
                  onChange={(e) => setFormData({ ...formData, project_description: e.target.value })}
                  placeholder="Summary of the scope and deliverables completed for this client"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Client Review Text *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.review_text}
                  onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
                  placeholder="Enter the authentic testimonial provided by the client..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
                />
              </div>

              {/* Toggles: Verified & Visibility */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.is_verified === 1}
                    onChange={(e) => setFormData({ ...formData, is_verified: e.target.checked ? 1 : 0 })}
                    className="w-4 h-4 rounded text-[#101B33] focus:ring-[#C6A15B]"
                  />
                  <span>Mark as Verified Client Engagement</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.is_visible === 1}
                    onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked ? 1 : 0 })}
                    className="w-4 h-4 rounded text-[#101B33] focus:ring-[#C6A15B]"
                  />
                  <span>Visible in Public Showcase</span>
                </label>
              </div>

              {/* Optional Founder Response */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Official Founder Response (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.founder_response}
                  onChange={(e) => setFormData({ ...formData, founder_response: e.target.value })}
                  placeholder="Optional response from Harish K acknowledging the collaboration..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
                />
                <span className="text-[10px] text-slate-400">
                  This will be displayed in a distinct official response box under the review.
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#101B33] text-white hover:bg-[#1C2C4E] text-xs font-bold shadow-sm"
                >
                  Save &amp; Publish Client Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Existing Client Review Record */}
      {isEditModalOpen && selectedReview && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 my-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-[#C6A15B]">
                  Client Management
                </span>
                <h3 className="text-xl font-bold text-[#101B33]">
                  Edit Client Review &amp; Showcase Record #{selectedReview.id}
                </h3>
              </div>
              <button
                onClick={() => { setIsEditModalOpen(false); setSelectedReview(null); }}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditClient} className="space-y-4 mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Client Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.reviewer_name}
                    onChange={(e) => setFormData({ ...formData, reviewer_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Business / Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.business_name}
                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>
              </div>

              {/* Logo Upload & URL */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Business Logo
                </label>
                <div className="flex items-center gap-3">
                  {formData.business_logo_url && (
                    <img
                      src={getAssetUrl(formData.business_logo_url)}
                      alt="Logo preview"
                      className="w-12 h-12 rounded-xl object-contain bg-slate-50 border border-slate-200 p-1"
                    />
                  )}
                  <input
                    type="text"
                    value={formData.business_logo_url}
                    onChange={(e) => setFormData({ ...formData, business_logo_url: e.target.value })}
                    placeholder="https://... or upload file"
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
                  />
                  <label className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer shrink-0">
                    <Upload className="w-4 h-4 inline mr-1" />
                    {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      disabled={uploadingLogo}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Client Website URL
                  </label>
                  <input
                    type="text"
                    value={formData.website_url}
                    onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={formData.project_name}
                    onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Rating (1 to 5 Stars) *
                  </label>
                  <div className="flex items-center gap-3 py-1">
                    <RatingStars
                      rating={formData.rating}
                      size="md"
                      interactive={true}
                      onRatingChange={(r) => setFormData({ ...formData, rating: r })}
                    />
                    <span className="text-xs font-bold text-[#101B33]">
                      {formData.rating} Stars
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Project Description
                </label>
                <input
                  type="text"
                  value={formData.project_description}
                  onChange={(e) => setFormData({ ...formData, project_description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Client Review Text *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.review_text}
                  onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
                />
              </div>

              {/* Status and Visibility Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Moderation Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#C6A15B]"
                  >
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div className="flex items-center pt-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.is_verified === 1}
                      onChange={(e) => setFormData({ ...formData, is_verified: e.target.checked ? 1 : 0 })}
                      className="w-4 h-4 rounded text-[#101B33]"
                    />
                    <span>Verified Badge</span>
                  </label>
                </div>

                <div className="flex items-center pt-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.is_visible === 1}
                      onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked ? 1 : 0 })}
                      className="w-4 h-4 rounded text-[#101B33]"
                    />
                    <span>Show in Showcase</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setIsEditModalOpen(false); setSelectedReview(null); }}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#101B33] text-white hover:bg-[#1C2C4E] text-xs font-bold shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Official Founder Response */}
      {isResponseModalOpen && selectedReview && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-[#C6A15B]">
                  Official Executive Communication
                </span>
                <h3 className="text-lg font-bold text-[#101B33]">
                  Official Founder Response
                </h3>
              </div>
              <button
                onClick={() => { setIsResponseModalOpen(false); setSelectedReview(null); }}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="my-4 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <span className="font-bold text-[#101B33]">Client Review:</span>
              <p className="text-slate-600 italic mt-0.5">
                "{selectedReview.review_text}"
              </p>
              <span className="block text-[11px] text-slate-400 mt-1">
                — {selectedReview.reviewer_name} ({selectedReview.business_name || 'Individual'})
              </span>
            </div>

            <form onSubmit={handleSaveFounderResponse} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Response from Harish K, Founder &amp; CEO
                </label>
                <textarea
                  rows={4}
                  value={founderResponseText}
                  onChange={(e) => setFounderResponseText(e.target.value)}
                  placeholder="Thank you for partnering with PIVO TECH! It was a pleasure collaborating on this project..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  This official statement is displayed with a distinguished executive badge under the client's review. Leave blank and save to remove an existing response.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setIsResponseModalOpen(false); setSelectedReview(null); }}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#101B33] text-white hover:bg-[#1C2C4E] text-xs font-bold shadow-sm"
                >
                  Save Official Response
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
