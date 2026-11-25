import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, AlertCircle, Upload, ExternalLink, Github, FolderGit2 } from 'lucide-react';
import { api, getAssetUrl } from '../../services/api';
import { Project } from '../../types';
import { Modal } from '../../components/Modal';

export const ProjectsTab: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [technologiesInput, setTechnologiesInput] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const res = await api.getProjects();
      setProjects(res.projects);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingProject({
      name: '',
      slug: '',
      category: 'Business Websites',
      tagline: '',
      description: '',
      case_study: '',
      image_url: '/assets/projects/nexus-portal.svg',
      live_url: '',
      github_url: '',
      completion_date: new Date().toISOString().slice(0, 7),
      is_featured: 1,
      is_demo_concept: 0,
      sort_order: projects.length + 1
    });
    setTechnologiesInput('');
    setIsModalOpen(true);
  };

  const openEditModal = (proj: Project) => {
    setEditingProject(proj);
    setTechnologiesInput(proj.technologies.join(', '));
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setStatusMsg(null);
    try {
      const res = await api.uploadFile(file);
      setEditingProject(prev => prev ? ({ ...prev, image_url: res.url }) : null);
      setStatusMsg({ type: 'success', text: 'Project image uploaded.' });
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Image upload failed.' });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    const technologies = technologiesInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    try {
      if (editingProject.id) {
        await api.updateProject(editingProject.id, {
          ...editingProject,
          technologies
        });
        setStatusMsg({ type: 'success', text: 'Project updated successfully.' });
      } else {
        await api.createProject({
          ...editingProject,
          technologies
        });
        setStatusMsg({ type: 'success', text: 'New project created successfully.' });
      }
      setIsModalOpen(false);
      loadProjects();
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to save project.' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.deleteProject(id);
      setStatusMsg({ type: 'success', text: 'Project deleted.' });
      loadProjects();
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message });
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-subtle space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#C6A15B]">
            Portfolio Engine
          </span>
          <h2 className="text-2xl font-extrabold text-[#101B33] mt-1">
            Portfolio &amp; Project Manager
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Publish unlimited client projects, case studies, live links, and architectural blueprints.
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
        <div className={`p-4 rounded-xl text-xs flex items-center gap-2.5 ${
          statusMsg.type === 'success'
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          {statusMsg.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Projects Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F7F8FA] text-slate-600 uppercase font-bold tracking-wider">
            <tr>
              <th className="py-3 px-4 rounded-l-xl">Preview</th>
              <th className="py-3 px-4">Project Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4 rounded-r-xl text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {projects.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4">
                  <div className="w-14 h-9 rounded-lg overflow-hidden bg-[#101B33] border border-slate-200">
                    <img src={getAssetUrl(p.image_url)} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="font-bold text-[#101B33] text-sm">{p.name}</div>
                  <div className="text-slate-400 text-[11px] truncate max-w-xs">{p.tagline}</div>
                </td>
                <td className="py-3 px-4 font-semibold text-slate-700">
                  {p.category}
                </td>
                <td className="py-3 px-4">
                  {p.is_demo_concept ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                      Concept Demo
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                      Live Project
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-slate-500">
                  {p.completion_date || '-'}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="inline-flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(p)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-[#101B33] hover:bg-slate-100"
                      title="Edit Project"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Delete Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create / Edit Project Modal */}
      {isModalOpen && editingProject && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingProject.id ? 'Edit Project' : 'Add New Portfolio Project'}
          maxWidth="2xl"
        >
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  value={editingProject.name || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                  placeholder="e.g. Zenith Business Platform"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">Category *</label>
                <select
                  value={editingProject.category || 'Business Websites'}
                  onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white"
                >
                  <option value="Business Websites">Business Websites</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="AI Solutions">AI Solutions</option>
                  <option value="Web Applications">Web Applications</option>
                  <option value="Automation Systems">Automation Systems</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-700 mb-1">Short Tagline (1 sentence)</label>
              <input
                type="text"
                value={editingProject.tagline || ''}
                onChange={(e) => setEditingProject({ ...editingProject, tagline: e.target.value })}
                placeholder="e.g. Corporate website with sub-second load times."
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-700 mb-1">Full Description *</label>
              <textarea
                rows={3}
                required
                value={editingProject.description || ''}
                onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-700 mb-1">Architecture &amp; Case Study</label>
              <textarea
                rows={4}
                value={editingProject.case_study || ''}
                onChange={(e) => setEditingProject({ ...editingProject, case_study: e.target.value })}
                placeholder="Describe business context, design decisions, challenges solved, and outcome."
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
              />
            </div>

            {/* Technologies Comma separated */}
            <div>
              <label className="block font-bold uppercase text-slate-700 mb-1">Technologies Used (Comma-separated) *</label>
              <input
                type="text"
                value={technologiesInput}
                onChange={(e) => setTechnologiesInput(e.target.value)}
                placeholder="React, TypeScript, Tailwind CSS, Node.js, Fastify"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
              />
            </div>

            {/* Image URL & Upload */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">Project Image URL *</label>
                <input
                  type="text"
                  required
                  value={editingProject.image_url || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, image_url: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
                />
              </div>

              <div>
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200 cursor-pointer w-full justify-center">
                  <Upload className="w-3.5 h-3.5 text-[#C6A15B]" />
                  <span>{uploadingImage ? 'Uploading Image...' : 'Upload Image File'}</span>
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

            {/* URLs & Completion Date */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">Live Website URL</label>
                <input
                  type="url"
                  value={editingProject.live_url || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, live_url: e.target.value })}
                  placeholder="https://client-domain.com"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">GitHub Repo URL (Optional)</label>
                <input
                  type="url"
                  value={editingProject.github_url || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, github_url: e.target.value })}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">Completion Date</label>
                <input
                  type="text"
                  value={editingProject.completion_date || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, completion_date: e.target.value })}
                  placeholder="2025-02"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                />
              </div>
            </div>

            {/* Demo Flag Checkbox */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">Demonstration / Architectural Concept</span>
                <span className="text-slate-500 text-[11px]">
                  Check this if this is an internal design concept or preview (maintains transparency with visitors).
                </span>
              </div>
              <input
                type="checkbox"
                checked={editingProject.is_demo_concept === 1}
                onChange={(e) => setEditingProject({ ...editingProject, is_demo_concept: e.target.checked ? 1 : 0 })}
                className="w-4 h-4 text-[#C6A15B] rounded"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-[#101B33] text-white hover:bg-[#1C2C4E] font-semibold"
              >
                Save Project
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
