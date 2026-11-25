import React, { useEffect, useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  Upload,
  ExternalLink,
  Github,
  FolderGit2,
  Star,
  Eye,
  EyeOff,
  Search,
  Filter,
  Image as ImageIcon,
  CheckCircle2,
  X,
  Building2,
  Calendar
} from 'lucide-react';
import { api, getAssetUrl } from '../../services/api';
import { Project } from '../../types';
import { Modal } from '../../components/Modal';

export const ProjectsTab: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [summary, setSummary] = useState({
    total: 0,
    published: 0,
    drafts: 0,
    featured: 0
  });
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewProject, setPreviewProject] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);

  // Form Inputs
  const [technologiesInput, setTechnologiesInput] = useState('');
  const [featuresInput, setFeaturesInput] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingScreenshots, setUploadingScreenshots] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const categories = [
    'Business Websites',
    'E-commerce Websites',
    'Web Applications',
    'AI Solutions',
    'Business Automation'
  ];

  useEffect(() => {
    loadProjects();
  }, [categoryFilter, statusFilter, searchQuery]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const res = await api.getAllProjectsAdmin({
        category: categoryFilter,
        status: statusFilter,
        q: searchQuery.trim() || undefined
      });
      setProjects(res.projects || []);
      setSummary(res.summary || {
        total: res.projects?.length || 0,
        published: res.projects?.filter(p => p.is_published === 1).length || 0,
        drafts: res.projects?.filter(p => p.is_published === 0).length || 0,
        featured: res.projects?.filter(p => p.is_featured === 1).length || 0
      });
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to load portfolio projects' });
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingProject({
      name: '',
      slug: '',
      client_name: '',
      category: 'Business Websites',
      tagline: '',
      description: '',
      case_study: '',
      image_url: '/assets/projects/nexus-portal.svg',
      screenshots: [],
      features: [],
      live_url: '',
      github_url: '',
      completion_date: new Date().toISOString().slice(0, 7),
      is_featured: 0,
      is_demo_concept: 0,
      is_published: 1,
      status: 'published',
      sort_order: projects.length + 1
    });
    setTechnologiesInput('React, TypeScript, Tailwind CSS, Node.js');
    setFeaturesInput('');
    setIsModalOpen(true);
  };

  const openEditModal = (proj: Project) => {
    setEditingProject(proj);
    setTechnologiesInput(proj.technologies ? proj.technologies.join(', ') : '');
    setFeaturesInput(proj.features ? proj.features.join('\n') : '');
    setIsModalOpen(true);
  };

  const openPreview = (proj: Project) => {
    setPreviewProject(proj);
    setIsPreviewOpen(true);
  };

  const handleTogglePublish = async (p: Project) => {
    const nextPublished = !(p.is_published === 1);
    try {
      await api.toggleProjectPublish(p.id, nextPublished);
      setStatusMsg({
        type: 'success',
        text: `Project "${p.name}" is now ${nextPublished ? 'Published' : 'Saved as Draft'}.`
      });
      loadProjects();
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to toggle publish status' });
    }
  };

  const handleToggleFeatured = async (p: Project) => {
    const nextFeatured = !(p.is_featured === 1);
    try {
      await api.toggleProjectFeatured(p.id, nextFeatured);
      setStatusMsg({
        type: 'success',
        text: `Project "${p.name}" is ${nextFeatured ? 'marked as Featured' : 'unmarked from Featured'}.`
      });
      loadProjects();
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to toggle featured status' });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setStatusMsg(null);
    try {
      const res = await api.uploadFile(file);
      setEditingProject(prev => prev ? ({ ...prev, image_url: res.url }) : null);
      setStatusMsg({ type: 'success', text: 'Main project image uploaded successfully.' });
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Image upload failed.' });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleMultipleScreenshotsUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingScreenshots(true);
    setStatusMsg(null);
    try {
      const fileList = Array.from(files);
      const res = await api.uploadMultipleFiles(fileList);
      const newUrls = res.files.map(f => f.url);
      setEditingProject(prev => {
        if (!prev) return null;
        const current = prev.screenshots || [];
        return {
          ...prev,
          screenshots: [...current, ...newUrls]
        };
      });
      setStatusMsg({ type: 'success', text: `${newUrls.length} screenshot(s) added to gallery.` });
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Screenshots upload failed.' });
    } finally {
      setUploadingScreenshots(false);
    }
  };

  const removeScreenshot = (index: number) => {
    setEditingProject(prev => {
      if (!prev) return null;
      const current = [...(prev.screenshots || [])];
      current.splice(index, 1);
      return { ...prev, screenshots: current };
    });
  };

  const setAsCover = (url: string) => {
    setEditingProject(prev => prev ? ({ ...prev, image_url: url }) : null);
    setStatusMsg({ type: 'success', text: 'Selected image set as primary cover thumbnail.' });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    const technologies = technologiesInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const features = featuresInput
      .split('\n')
      .map(f => f.trim())
      .filter(Boolean);

    try {
      const payload: Partial<Project> = {
        ...editingProject,
        technologies,
        features,
        is_published: editingProject.is_published ? 1 : 0,
        status: editingProject.is_published ? 'published' : 'draft',
        is_featured: editingProject.is_featured ? 1 : 0,
        is_demo_concept: editingProject.is_demo_concept ? 1 : 0
      };

      if (editingProject.id) {
        await api.updateProject(editingProject.id, payload);
        setStatusMsg({ type: 'success', text: 'Project updated successfully.' });
      } else {
        await api.createProject(payload);
        setStatusMsg({ type: 'success', text: 'New project created successfully.' });
      }
      setIsModalOpen(false);
      loadProjects();
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to save project.' });
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"? This action cannot be undone.`)) return;
    try {
      await api.deleteProject(id);
      setStatusMsg({ type: 'success', text: `Project "${name}" was deleted.` });
      loadProjects();
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to delete project.' });
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-subtle space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#C6A15B]">
            Portfolio Engine
          </span>
          <h2 className="text-2xl font-extrabold text-[#101B33] mt-1">
            Portfolio Management System
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Create, edit, curate, publish, and link genuine client deliverables and architectural showcases.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#101B33] text-white hover:bg-[#1C2C4E] transition-colors self-start sm:self-auto shadow-sm"
        >
          <Plus className="w-4 h-4 text-[#C6A15B]" />
          <span>ADD NEW PROJECT</span>
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
          <button onClick={() => setStatusMsg(null)} className="font-bold opacity-60 hover:opacity-100">
            Dismiss
          </button>
        </div>
      )}

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
          <span className="block text-2xl font-extrabold text-[#101B33]">{summary.total}</span>
          <span className="text-xs text-slate-500 font-semibold uppercase">Total Projects</span>
        </div>
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
          <span className="block text-2xl font-extrabold text-emerald-800">{summary.published}</span>
          <span className="text-xs text-emerald-700 font-semibold uppercase">Live &amp; Published</span>
        </div>
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center">
          <span className="block text-2xl font-extrabold text-amber-800">{summary.drafts}</span>
          <span className="text-xs text-amber-700 font-semibold uppercase">Draft Mode</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#F4EBD8] border border-[#E5C378] text-center">
          <span className="block text-2xl font-extrabold text-[#8C6D2D]">{summary.featured}</span>
          <span className="text-xs text-[#8C6D2D] font-semibold uppercase">Featured Highlights</span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by name, client, tech, or keywords..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-[#C6A15B]"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 font-medium focus:outline-none"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 font-medium focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published Only</option>
            <option value="draft">Drafts Only</option>
          </select>
        </div>
      </div>

      {/* Projects Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F7F8FA] text-slate-600 uppercase font-bold tracking-wider">
            <tr>
              <th className="py-3 px-4 rounded-l-xl">Preview</th>
              <th className="py-3 px-4">Project &amp; Client</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Featured</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4 rounded-r-xl text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {projects.map((p) => {
              const isPub = (p.is_published === 1 || p.is_published === undefined);
              const isFeat = p.is_featured === 1;

              return (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="w-14 h-9 rounded-lg overflow-hidden bg-[#101B33] border border-slate-200">
                      <img src={getAssetUrl(p.image_url)} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-[#101B33] text-sm flex items-center gap-2">
                      <span>{p.name}</span>
                      {p.related_reviews && p.related_reviews.length > 0 && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                          {p.related_reviews.length} {p.related_reviews.length === 1 ? 'Review' : 'Reviews'}
                        </span>
                      )}
                    </div>
                    {p.client_name ? (
                      <div className="text-slate-600 text-[11px] font-medium flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        <span>Client: {p.client_name}</span>
                      </div>
                    ) : (
                      <div className="text-slate-400 text-[11px] truncate max-w-xs">{p.tagline}</div>
                    )}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-700">
                    {p.category}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleTogglePublish(p)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                        isPub
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      }`}
                      title="Click to toggle Published vs Draft"
                    >
                      {isPub ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{isPub ? 'Published' : 'Draft'}</span>
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleFeatured(p)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isFeat ? 'text-[#C6A15B] hover:text-amber-600' : 'text-slate-300 hover:text-slate-500'
                      }`}
                      title={isFeat ? 'Featured Project (Click to unfeature)' : 'Mark as Featured Project'}
                    >
                      <Star className={`w-4 h-4 ${isFeat ? 'fill-[#C6A15B]' : ''}`} />
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    {p.is_demo_concept ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-50 text-amber-800 border border-amber-200">
                        Concept
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Live Client
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => openPreview(p)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-[#101B33] hover:bg-slate-100"
                        title="Preview Project"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-[#101B33] hover:bg-slate-100"
                        title="Edit Project"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {projects.length === 0 && !loading && (
          <div className="text-center py-12 text-slate-400">
            <FolderGit2 className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="font-semibold text-sm">No projects found matching the current filters.</p>
          </div>
        )}
      </div>

      {/* Add / Edit Project Modal */}
      {isModalOpen && editingProject && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingProject.id ? `Edit Project: ${editingProject.name}` : 'Add New Portfolio Project'}
          maxWidth="2xl"
        >
          <form onSubmit={handleSave} className="space-y-4 text-xs max-h-[80vh] overflow-y-auto pr-1">
            {/* Status and Featured Quick Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block">Publication</span>
                  <span className="text-[11px] text-slate-500">
                    {editingProject.is_published ? 'Visible to public' : 'Hidden draft'}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={editingProject.is_published === 1}
                  onChange={(e) => setEditingProject({ ...editingProject, is_published: e.target.checked ? 1 : 0 })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block">Featured</span>
                  <span className="text-[11px] text-slate-500">Highlight badge</span>
                </div>
                <input
                  type="checkbox"
                  checked={editingProject.is_featured === 1}
                  onChange={(e) => setEditingProject({ ...editingProject, is_featured: e.target.checked ? 1 : 0 })}
                  className="w-4 h-4 text-[#C6A15B] rounded"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block">Concept Demo</span>
                  <span className="text-[11px] text-slate-500">Uncheck for client</span>
                </div>
                <input
                  type="checkbox"
                  checked={editingProject.is_demo_concept === 1}
                  onChange={(e) => setEditingProject({ ...editingProject, is_demo_concept: e.target.checked ? 1 : 0 })}
                  className="w-4 h-4 text-amber-600 rounded"
                />
              </label>
            </div>

            {/* Project Name and Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  value={editingProject.name || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                  placeholder="e.g. Sri Balaji Stationery"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">Category *</label>
                <select
                  value={editingProject.category || 'Business Websites'}
                  onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Client Name & Tagline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">Client Name (Optional)</label>
                <input
                  type="text"
                  value={editingProject.client_name || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, client_name: e.target.value })}
                  placeholder="e.g. Sri Balaji Stationery, Sowcarpet"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">Short Tagline (1 sentence) *</label>
                <input
                  type="text"
                  required
                  value={editingProject.tagline || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, tagline: e.target.value })}
                  placeholder="e.g. Modern corporate website with digital catalog"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
                />
              </div>
            </div>

            {/* Full Description */}
            <div>
              <label className="block font-bold uppercase text-slate-700 mb-1">Full Summary / Description *</label>
              <textarea
                rows={3}
                required
                value={editingProject.description || ''}
                onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
              />
            </div>

            {/* Key Features Implemented */}
            <div>
              <label className="block font-bold uppercase text-slate-700 mb-1">
                Key Features Implemented (One per line)
              </label>
              <textarea
                rows={3}
                value={featuresInput}
                onChange={(e) => setFeaturesInput(e.target.value)}
                placeholder={"Interactive product catalog\nWhatsApp direct ordering\nSEO optimized local presence\nFast CDN delivery"}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
              />
            </div>

            {/* Architecture / Full Case Study */}
            <div>
              <label className="block font-bold uppercase text-slate-700 mb-1">Architecture &amp; Case Study</label>
              <textarea
                rows={3}
                value={editingProject.case_study || ''}
                onChange={(e) => setEditingProject({ ...editingProject, case_study: e.target.value })}
                placeholder="Describe business problem, architecture decisions, and outcome."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
              />
            </div>

            {/* Technologies Comma separated */}
            <div>
              <label className="block font-bold uppercase text-slate-700 mb-1">Technologies Used (Comma-separated) *</label>
              <input
                type="text"
                value={technologiesInput}
                onChange={(e) => setTechnologiesInput(e.target.value)}
                placeholder="React, TypeScript, Tailwind CSS, Node.js"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
              />
            </div>

            {/* Primary Cover Image & Upload */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">Primary Cover Image URL *</label>
                <input
                  type="text"
                  required
                  value={editingProject.image_url || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, image_url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
                />
              </div>

              <div>
                <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200 cursor-pointer w-full justify-center">
                  <Upload className="w-3.5 h-3.5 text-[#C6A15B]" />
                  <span>{uploadingImage ? 'Uploading Image...' : 'Upload Cover Image'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Screenshot Gallery Manager */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">Screenshots &amp; Visual Gallery</span>
                  <span className="text-[11px] text-slate-500">
                    Upload multiple screenshots to let clients explore the project visually.
                  </span>
                </div>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#101B33] text-white hover:bg-[#1C2C4E] cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-[#C6A15B]" />
                  <span>{uploadingScreenshots ? 'Uploading...' : 'Add Screenshots'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleMultipleScreenshotsUpload}
                    disabled={uploadingScreenshots}
                    className="hidden"
                  />
                </label>
              </div>

              {editingProject.screenshots && editingProject.screenshots.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                  {editingProject.screenshots.map((shot, sIdx) => (
                    <div key={sIdx} className="relative aspect-video rounded-lg overflow-hidden border border-slate-300 group bg-white">
                      <img src={getAssetUrl(shot)} alt={`Screenshot ${sIdx + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setAsCover(shot)}
                          className="p-1 bg-[#C6A15B] text-[#101B33] rounded hover:scale-105"
                          title="Set as Primary Cover"
                        >
                          <Star className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeScreenshot(sIdx)}
                          className="p-1 bg-rose-600 text-white rounded hover:scale-105"
                          title="Remove from gallery"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-center py-2 text-[11px]">No extra screenshots uploaded yet.</p>
              )}
            </div>

            {/* URLs & Completion Date */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">Live Website URL</label>
                <input
                  type="url"
                  value={editingProject.live_url || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, live_url: e.target.value })}
                  placeholder="https://sri-balaji-stationery.com"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">GitHub Repo URL (Optional)</label>
                <input
                  type="url"
                  value={editingProject.github_url || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, github_url: e.target.value })}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">Completion Date</label>
                <input
                  type="text"
                  value={editingProject.completion_date || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, completion_date: e.target.value })}
                  placeholder="2025-02"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#101B33] text-white hover:bg-[#1C2C4E] font-semibold"
              >
                Save Project
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Preview Modal */}
      {isPreviewOpen && previewProject && (
        <Modal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          title={`Public Preview: ${previewProject.name}`}
          maxWidth="2xl"
        >
          <div className="space-y-5 text-xs">
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-[#101B33] border border-slate-200">
              <img src={getAssetUrl(previewProject.image_url)} alt={previewProject.name} className="w-full h-full object-cover" />
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-bold text-[#C6A15B] uppercase tracking-wider">{previewProject.category}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                previewProject.is_published ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {previewProject.is_published ? 'Live On Site' : 'Draft Only'}
              </span>
            </div>

            {previewProject.client_name && (
              <p className="font-bold text-slate-800">
                Client: <span className="text-[#101B33]">{previewProject.client_name}</span>
              </p>
            )}

            <p className="text-slate-700 text-sm leading-relaxed">{previewProject.description}</p>

            {previewProject.features && previewProject.features.length > 0 && (
              <div className="space-y-1.5">
                <span className="font-bold text-slate-800 block uppercase tracking-wider text-[11px]">Key Features</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {previewProject.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-lg text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {previewProject.technologies && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {previewProject.technologies.map((t, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-[#101B33] text-white rounded text-[11px] font-semibold">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
