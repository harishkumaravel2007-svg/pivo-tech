import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, AlertCircle, Layers } from 'lucide-react';
import { api } from '../../services/api';
import { Service } from '../../types';
import { Modal } from '../../components/Modal';

export const ServicesTab: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [featuresText, setFeaturesText] = useState('');
  const [benefitsText, setBenefitsText] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const res = await api.getAllServicesAdmin();
      setServices(res.services);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingService({
      title: '',
      category: 'Website Development',
      summary: '',
      description: '',
      icon_name: 'Globe',
      sort_order: services.length + 1,
      is_active: 1
    });
    setFeaturesText('');
    setBenefitsText('');
    setIsModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setFeaturesText(service.features.join('\n'));
    setBenefitsText(service.benefits.join('\n'));
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    const features = featuresText.split('\n').map(s => s.trim()).filter(Boolean);
    const benefits = benefitsText.split('\n').map(s => s.trim()).filter(Boolean);

    try {
      if (editingService.id) {
        await api.updateService(editingService.id, {
          ...editingService,
          features,
          benefits
        });
        setStatusMsg({ type: 'success', text: 'Service updated successfully.' });
      } else {
        await api.createService({
          ...editingService,
          features,
          benefits
        });
        setStatusMsg({ type: 'success', text: 'New service created successfully.' });
      }
      setIsModalOpen(false);
      loadServices();
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Operation failed.' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      await api.deleteService(id);
      setStatusMsg({ type: 'success', text: 'Service deleted.' });
      loadServices();
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message });
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-subtle space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#C6A15B]">
            Service Suites
          </span>
          <h2 className="text-2xl font-extrabold text-[#101B33] mt-1">
            Service Management
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Add, modify, or reorder offerings across Web Development, Marketing, AI, and Automation.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#101B33] text-white hover:bg-[#1C2C4E] transition-colors self-start sm:self-auto shadow-sm"
        >
          <Plus className="w-4 h-4 text-[#C6A15B]" />
          <span>Add New Service</span>
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

      {/* Services Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F7F8FA] text-slate-600 uppercase font-bold tracking-wider">
            <tr>
              <th className="py-3 px-4 rounded-l-xl">Order</th>
              <th className="py-3 px-4">Title &amp; Category</th>
              <th className="py-3 px-4">Summary</th>
              <th className="py-3 px-4">Features</th>
              <th className="py-3 px-4 rounded-r-xl text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {services.map((service) => (
              <tr key={service.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-4 font-bold text-slate-400">
                  #{service.sort_order}
                </td>
                <td className="py-4 px-4">
                  <div className="font-bold text-[#101B33] text-sm">{service.title}</div>
                  <div className="text-[10px] uppercase font-semibold text-[#C6A15B]">
                    {service.category}
                  </div>
                </td>
                <td className="py-4 px-4 max-w-xs text-slate-600 line-clamp-2">
                  {service.summary}
                </td>
                <td className="py-4 px-4 text-slate-500">
                  {service.features.length} points
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="inline-flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(service)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-[#101B33] hover:bg-slate-100"
                      title="Edit Service"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Delete Service"
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
      {isModalOpen && editingService && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingService.id ? 'Edit Service' : 'Create New Service'}
          maxWidth="2xl"
        >
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  value={editingService.title || ''}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
                />
              </div>
              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">Category *</label>
                <input
                  type="text"
                  required
                  value={editingService.category || ''}
                  onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-700 mb-1">Summary (1-2 lines) *</label>
              <input
                type="text"
                required
                value={editingService.summary || ''}
                onChange={(e) => setEditingService({ ...editingService, summary: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-700 mb-1">Full Description *</label>
              <textarea
                rows={3}
                required
                value={editingService.description || ''}
                onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">Features (One per line)</label>
                <textarea
                  rows={4}
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
                />
              </div>
              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">Benefits (One per line)</label>
                <textarea
                  rows={4}
                  value={benefitsText}
                  onChange={(e) => setBenefitsText(e.target.value)}
                  placeholder="Benefit 1&#10;Benefit 2&#10;Benefit 3"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">Icon Name</label>
                <select
                  value={editingService.icon_name || 'Globe'}
                  onChange={(e) => setEditingService({ ...editingService, icon_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white"
                >
                  <option value="Globe">Globe (Web Dev)</option>
                  <option value="TrendingUp">TrendingUp (Marketing)</option>
                  <option value="Cpu">Cpu (AI Agents)</option>
                  <option value="Zap">Zap (Automation)</option>
                  <option value="Layers">Layers (General)</option>
                </select>
              </div>
              <div>
                <label className="block font-bold uppercase text-slate-700 mb-1">Sort Order</label>
                <input
                  type="number"
                  value={editingService.sort_order || 1}
                  onChange={(e) => setEditingService({ ...editingService, sort_order: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                />
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
                Save Service
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
