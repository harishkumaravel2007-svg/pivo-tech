import React, { useEffect, useState } from 'react';
import { Save, CheckCircle, AlertCircle, Upload, Building2 } from 'lucide-react';
import { api } from '../../services/api';
import { CompanyInfo } from '../../types';

export const CompanyInfoTab: React.FC = () => {
  const [form, setForm] = useState<Partial<CompanyInfo>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    api.getCompany()
      .then(res => setForm(res))
      .catch(err => setStatusMsg({ type: 'error', text: err.message }))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg(null);

    try {
      const res = await api.updateCompany(form);
      setStatusMsg({ type: 'success', text: res.message });
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to update company information.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-xs text-slate-500 py-10">Loading company data...</div>;
  }

  return (
    <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-subtle space-y-8">
      <div>
        <span className="text-xs uppercase font-bold tracking-widest text-[#C6A15B]">
          Corporate Architecture
        </span>
        <h2 className="text-2xl font-extrabold text-[#101B33] mt-1">
          Company Information &amp; Brand Settings
        </h2>
        <p className="text-slate-500 text-xs mt-1">
          Update primary business credentials, contact records, and public company mission.
        </p>
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

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Business Name *
            </label>
            <input
              type="text"
              name="business_name"
              required
              value={form.business_name || ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Tagline *
            </label>
            <input
              type="text"
              name="tagline"
              required
              value={form.tagline || ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Founder &amp; CEO Name *
            </label>
            <input
              type="text"
              name="founder_name"
              required
              value={form.founder_name || ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Business Type *
            </label>
            <input
              type="text"
              name="business_type"
              required
              value={form.business_type || ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Headquarters Location *
            </label>
            <input
              type="text"
              name="location"
              required
              value={form.location || ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Official Email *
            </label>
            <input
              type="email"
              name="email"
              required
              value={form.email || ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Phone &amp; WhatsApp *
            </label>
            <input
              type="text"
              name="phone"
              required
              value={form.phone || ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Instagram Profile URL
            </label>
            <input
              type="url"
              name="instagram"
              value={form.instagram || ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              LinkedIn Company / Founder URL
            </label>
            <input
              type="url"
              name="linkedin"
              value={form.linkedin || ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
            />
          </div>
        </div>

        {/* Narrative Fields */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            About Introduction *
          </label>
          <textarea
            name="about_intro"
            rows={3}
            required
            value={form.about_intro || ''}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Mission Statement *
            </label>
            <textarea
              name="mission"
              rows={3}
              required
              value={form.mission || ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Vision Statement *
            </label>
            <textarea
              name="vision"
              rows={3}
              required
              value={form.vision || ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-[#101B33] text-white hover:bg-[#1C2C4E] disabled:opacity-60 transition-colors shadow-sm"
          >
            <Save className="w-4 h-4 text-[#C6A15B]" />
            <span>{saving ? 'Saving...' : 'Update Company Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
