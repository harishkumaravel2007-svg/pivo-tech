import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, AlertCircle, Code2 } from 'lucide-react';
import { api } from '../../services/api';
import { Skill } from '../../types';
import { Modal } from '../../components/Modal';

export const SkillsTab: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Partial<Skill> | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const res = await api.getAllSkillsAdmin();
      setSkills(res.skills);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingSkill({
      name: '',
      category: 'Website Development',
      level_description: 'Production Stack',
      icon_name: 'Code2',
      sort_order: skills.length + 1,
      is_active: 1
    });
    setIsModalOpen(true);
  };

  const openEditModal = (skill: Skill) => {
    setEditingSkill(skill);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill) return;

    try {
      if (editingSkill.id) {
        await api.updateSkill(editingSkill.id, editingSkill);
        setStatusMsg({ type: 'success', text: 'Skill updated successfully.' });
      } else {
        await api.createSkill(editingSkill);
        setStatusMsg({ type: 'success', text: 'Skill created successfully.' });
      }
      setIsModalOpen(false);
      loadSkills();
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Operation failed.' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    try {
      await api.deleteSkill(id);
      setStatusMsg({ type: 'success', text: 'Skill deleted.' });
      loadSkills();
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message });
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-subtle space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#C6A15B]">
            Technology Foundations
          </span>
          <h2 className="text-2xl font-extrabold text-[#101B33] mt-1">
            Skills &amp; Technology Areas
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Add or curate technologies displayed on the public Skills &amp; Architecture page.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#101B33] text-white hover:bg-[#1C2C4E] transition-colors self-start sm:self-auto shadow-sm"
        >
          <Plus className="w-4 h-4 text-[#C6A15B]" />
          <span>Add New Skill</span>
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

      {/* Skills Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F7F8FA] text-slate-600 uppercase font-bold tracking-wider">
            <tr>
              <th className="py-3 px-4 rounded-l-xl">Category</th>
              <th className="py-3 px-4">Skill Name</th>
              <th className="py-3 px-4">Level / Description</th>
              <th className="py-3 px-4">Order</th>
              <th className="py-3 px-4 rounded-r-xl text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {skills.map((skill) => (
              <tr key={skill.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4">
                  <span className="font-bold text-[#C6A15B] uppercase text-[10px]">
                    {skill.category}
                  </span>
                </td>
                <td className="py-3 px-4 font-bold text-[#101B33] text-sm">
                  {skill.name}
                </td>
                <td className="py-3 px-4 text-slate-600">
                  {skill.level_description}
                </td>
                <td className="py-3 px-4 text-slate-400">
                  #{skill.sort_order}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="inline-flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(skill)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-[#101B33] hover:bg-slate-100"
                      title="Edit Skill"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(skill.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Delete Skill"
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

      {/* Create / Edit Modal */}
      {isModalOpen && editingSkill && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingSkill.id ? 'Edit Skill' : 'Add Skill'}
          maxWidth="md"
        >
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold uppercase text-slate-700 mb-1">Skill Name *</label>
              <input
                type="text"
                required
                value={editingSkill.name || ''}
                onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                placeholder="e.g. Next.js or PostgreSQL"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-700 mb-1">Category *</label>
              <select
                value={editingSkill.category || 'Website Development'}
                onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white"
              >
                <option value="Website Development">Website Development</option>
                <option value="Backend & Database">Backend & Database</option>
                <option value="AI & Automation">AI & Automation</option>
                <option value="Tools">Tools</option>
              </select>
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-700 mb-1">Level / Focus Description</label>
              <input
                type="text"
                value={editingSkill.level_description || ''}
                onChange={(e) => setEditingSkill({ ...editingSkill, level_description: e.target.value })}
                placeholder="e.g. Production Stack or Core Area"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-700 mb-1">Sort Order</label>
              <input
                type="number"
                value={editingSkill.sort_order || 1}
                onChange={(e) => setEditingSkill({ ...editingSkill, sort_order: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
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
                Save Skill
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
