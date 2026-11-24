import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, AlertCircle, Upload, Award, FileText } from 'lucide-react';
import { api } from '../../services/api';
import { Achievement } from '../../types';
import { Modal } from '../../components/Modal';

export const AchievementsTab: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<Achievement> | null>(null);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      const res = await api.getAchievements();
      setAchievements(res.achievements);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingItem({
      title: '',
      category: 'Recognition',
      description: '',
      issuer_or_organization: '',
      date_awarded: new Date().toISOString().slice(0, 7),
      document_url: '',
      sort_order: achievements.length + 1
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: Achievement) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDoc(true);
    setStatusMsg(null);
    try {
      const res = await api.uploadFile(file);
      setEditingItem(prev => prev ? ({ ...prev, document_url: res.url }) : null);
      setStatusMsg({ type: 'success', text: 'Document uploaded successfully.' });
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Upload failed.' });
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      if (editingItem.id) {
        await api.updateAchievement(editingItem.id, editingItem);
        setStatusMsg({ type: 'success', text: 'Achievement updated.' });
      } else {
        await api.createAchievement(editingItem);
        setStatusMsg({ type: 'success', text: 'Achievement added.' });
      }
      setIsModalOpen(false);
      loadAchievements();
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Operation failed.' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this achievement?')) return;
    try {
      await api.deleteAchievement(id);
      setStatusMsg({ type: 'success', text: 'Achievement deleted.' });
      loadAchievements();
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message });
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-subtle space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#C6A15B]">
            Official Accreditations
          </span>
          <h2 className="text-2xl font-extrabold text-[#101B33] mt-1">
            Achievements &amp; Certificates
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Publish verified technical certificates, awards, milestones, and recognitions.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#101B33] text-white hover:bg-[#1C2C4E] transition-colors self-start sm:self-auto shadow-sm"
        >
          <Plus className="w-4 h-4 text-[#C6A15B]" />
          <span>Add New Achievement</span>
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

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F7F8FA] text-slate-600 uppercase font-bold tracking-wider">
            <tr>
              <th className="py-3 px-4 rounded-l-xl">Category</th>
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4">Issuer / Org</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Document</th>
              <th className="py-3 px-4 rounded-r-xl text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {achievements.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-4 font-bold text-[#C6A15B] uppercase text-[10px]">
                  {item.category}
                </td>
                <td className="py-4 px-4 font-bold text-[#101B33] text-sm">
                  {item.title}
                </td>
                <td className="py-4 px-4 text-slate-600">
                  {item.issuer_or_organization || '-'}
                </td>
                <td className="py-4 px-4 text-slate-500">
                  {item.date_awarded || '-'}
                </td>
                <td className="py-4 px-4">
                  {item.document_url ? (
                    <a
                      href={item.document_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View</span>
                    </a>
                  ) : (
                    <span className="text-slate-400">None</span>
                  )}
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="inline-flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-[#101B33] hover:bg-slate-100"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
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

      {isModalOpen && editingItem && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingItem.id ? 'Edit Achievement' : 'Add Achievement'}
          maxWidth="md"
        >
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold uppercase text-slate-700 mb-1">Title *</label>
              <input
                type="text"
                required
                value={editingItem.title || ''}
                onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">Category *</label>
                <select
                  value={editingItem.category || 'Recognition'}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white"
                >
                  <option value="Recognition">Recognition</option>
                  <option value="Certificate">Certificate</option>
                  <option value="Award">Award</option>
                  <option value="Milestone">Milestone</option>
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">Date Awarded</label>
                <input
                  type="text"
                  value={editingItem.date_awarded || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, date_awarded: e.target.value })}
                  placeholder="2025-01"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-700 mb-1">Issuer / Organization</label>
              <input
                type="text"
                value={editingItem.issuer_or_organization || ''}
                onChange={(e) => setEditingItem({ ...editingItem, issuer_or_organization: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-700 mb-1">Description *</label>
              <textarea
                rows={3}
                required
                value={editingItem.description || ''}
                onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
              />
            </div>

            {/* Document Upload */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <label className="block font-bold uppercase text-slate-700">Certificate File (Image or PDF)</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editingItem.document_url || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, document_url: e.target.value })}
                  placeholder="/uploads/certificate.pdf"
                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                />
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-semibold cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-[#C6A15B]" />
                  <span>{uploadingDoc ? 'Uploading...' : 'Upload'}</span>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={handleDocUpload}
                    disabled={uploadingDoc}
                    className="hidden"
                  />
                </label>
              </div>
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
                Save
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
