import React, { useEffect, useState } from 'react';
import {
  Save,
  CheckCircle,
  AlertCircle,
  Upload,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Sparkles,
  Send
} from 'lucide-react';
import { api, getAssetUrl } from '../../services/api';
import { FounderInfo } from '../../types';

export const FounderTab: React.FC = () => {
  const [form, setForm] = useState<Partial<FounderInfo>>({
    name: 'Harish K',
    designation: 'Founder & Managing Director',
    company: 'PIVO TECH',
    tagline: 'Build. Grow. Automate.',
    location: 'Theni, Tamil Nadu, India',
    email: 'harishkumaravel2007@gmail.com',
    phone: '+91 99442 45043',
    linkedin: 'https://www.linkedin.com/in/harish-k-303480401/',
    instagram: 'https://www.instagram.com/_pivo.tech/',
    bio: "Hello, I'm Harish K, Founder & Managing Director of PIVO TECH. I focus on building modern websites, digital growth solutions, AI-powered agents and business automation systems. My goal is to help businesses establish a strong digital presence, improve productivity and grow through practical technology solutions.",
    vision: 'To build a world-class technology firm rooted in integrity, delivering tangible digital leverage to startups, enterprises, and local businesses alike.',
    photo_url: '/assets/harish-founder.jpg'
  });
  const [expertiseList, setExpertiseList] = useState<string[]>([]);
  const [newExpertise, setNewExpertise] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    api.getFounder()
      .then(res => {
        setForm(res);
        setExpertiseList(res.areas_of_expertise || []);
      })
      .catch(err => setStatusMsg({ type: 'error', text: err.message }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setStatusMsg(null);
    try {
      const res = await api.uploadFile(file);
      setForm(prev => ({ ...prev, photo_url: res.url }));
      setStatusMsg({ type: 'success', text: 'Founder photograph uploaded and staged successfully.' });
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to upload photo.' });
    } finally {
      setUploading(false);
    }
  };

  const addExpertise = () => {
    if (newExpertise.trim() && !expertiseList.includes(newExpertise.trim())) {
      setExpertiseList([...expertiseList, newExpertise.trim()]);
      setNewExpertise('');
    }
  };

  const removeExpertise = (index: number) => {
    setExpertiseList(expertiseList.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg(null);

    try {
      const res = await api.updateFounder({
        ...form,
        areas_of_expertise: expertiseList
      });
      setStatusMsg({ type: 'success', text: 'Founder Profile and executive data updated permanently in database.' });
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to update founder profile.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-subtle space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#C6A15B]">
            Executive Leadership
          </span>
          <h2 className="text-2xl font-extrabold text-[#101B33] mt-1">
            Founder Profile Settings &amp; Photo Management
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Manage Harish K's executive identity, real photograph, bio introduction, social URLs, and competencies.
          </p>
        </div>

        {/* Live Preview Toggle */}
        <button
          type="button"
          onClick={() => setShowLivePreview(!showLivePreview)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-[#101B33] transition-colors shrink-0"
        >
          {showLivePreview ? <EyeOff className="w-4 h-4 text-slate-500" /> : <Eye className="w-4 h-4 text-[#C6A15B]" />}
          <span>{showLivePreview ? 'Hide Live Preview' : 'Preview Before Publishing'}</span>
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

      {/* Live Preview Panel (Before Publishing) */}
      {showLivePreview && (
        <div className="p-6 rounded-3xl bg-slate-50 border-2 border-[#C6A15B]/40 shadow-premium">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C6A15B]" />
              <span className="text-xs font-bold text-[#101B33] uppercase tracking-wider">
                Live Preview Before Publishing
              </span>
            </div>
            <span className="text-[10px] text-slate-400">
              Desktop &amp; Mobile Responsive Card Layout
            </span>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 max-w-2xl mx-auto shadow-sm">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="w-28 h-28 rounded-2xl overflow-hidden bg-[#101B33] border-2 border-[#C6A15B] shrink-0 shadow-md">
                <img
                  src={getAssetUrl(form.photo_url) || '/assets/harish-founder.jpg'}
                  alt="Founder Preview"
                  className="w-full h-full object-cover object-top"
                />
              </div>

              <div className="flex-1 text-center sm:text-left space-y-1">
                <h3 className="text-xl font-extrabold text-[#101B33]">{form.name || 'Harish K'}</h3>
                <p className="text-xs font-bold text-[#C6A15B] uppercase tracking-wider">
                  {form.designation || 'Founder & Managing Director'} &bull; {form.company || 'PIVO TECH'}
                </p>
                <p className="text-xs text-slate-500 font-medium italic">
                  "{form.tagline || 'Build. Grow. Automate.'}"
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-1 text-xs text-slate-400 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#C6A15B]" />
                  <span>{form.location || 'Theni, Tamil Nadu, India'}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-700 leading-relaxed italic bg-slate-50 p-3 rounded-xl border-l-2 border-[#C6A15B]">
                "{form.bio}"
              </p>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#101B33] text-white text-[11px] font-semibold">
                  <Send className="w-3 h-3 text-[#C6A15B]" />
                  <span>Contact WhatsApp</span>
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-[#101B33] text-[11px] font-semibold">
                  <Linkedin className="w-3 h-3 text-[#0077B5]" />
                  <span>LinkedIn Profile</span>
                </span>
              </div>
              <span className="text-[11px] text-slate-400">Instagram: @_pivo.tech</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Photo Upload Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="w-28 h-28 rounded-2xl overflow-hidden bg-[#101B33] border-2 border-[#C6A15B] shrink-0 shadow-md">
            <img
              src={getAssetUrl(form.photo_url) || '/assets/harish-founder.jpg'}
              alt="Founder"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h4 className="text-sm font-bold text-[#101B33]">Original Founder Photograph</h4>
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Preserves Natural Skin Tone &amp; Identity
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Upload your genuine photograph. The system retains original appearance and optimizes file performance without quality loss.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#101B33] text-white hover:bg-[#1C2C4E] cursor-pointer shadow-sm active:scale-95 transition-all">
                <Upload className="w-3.5 h-3.5 text-[#C6A15B]" />
                <span>{uploading ? 'Uploading Photo...' : 'Upload Real Photograph'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>

              {form.photo_url && (
                <span className="text-[11px] text-slate-400 truncate max-w-xs">
                  Active file: {form.photo_url}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Basic Details: Name, Designation, Company, Tagline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Founder Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={form.name || ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Designation *
            </label>
            <input
              type="text"
              name="designation"
              required
              value={form.designation || ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Company Name
            </label>
            <input
              type="text"
              name="company"
              value={form.company || 'PIVO TECH'}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Company Tagline
            </label>
            <input
              type="text"
              name="tagline"
              value={form.tagline || 'Build. Grow. Automate.'}
              onChange={handleChange}
              placeholder="Build. Grow. Automate."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
            />
          </div>
        </div>

        {/* Location & Social URLs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={form.location || 'Theni, Tamil Nadu, India'}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              LinkedIn Profile URL
            </label>
            <input
              type="url"
              name="linkedin"
              value={form.linkedin || ''}
              onChange={handleChange}
              placeholder="https://www.linkedin.com/in/harish-k-303480401/"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Instagram Profile URL
            </label>
            <input
              type="url"
              name="instagram"
              value={form.instagram || ''}
              onChange={handleChange}
              placeholder="https://www.instagram.com/_pivo.tech/"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
            />
          </div>
        </div>

        {/* Contact Info: Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Official Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email || 'harishkumaravel2007@gmail.com'}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Phone / WhatsApp
            </label>
            <input
              type="text"
              name="phone"
              value={form.phone || '+91 99442 45043'}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
            />
          </div>
        </div>

        {/* Professional Introduction */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Professional Introduction *
          </label>
          <textarea
            name="bio"
            rows={4}
            required
            value={form.bio || ''}
            onChange={handleChange}
            placeholder="Hello, I'm Harish K, Founder & Managing Director of PIVO TECH. I focus on building modern websites, digital growth solutions, AI-powered agents and business automation systems..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
          />
        </div>

        {/* Founder Vision */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Founder Vision *
          </label>
          <textarea
            name="vision"
            rows={2}
            required
            value={form.vision || ''}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
          />
        </div>

        {/* Areas of Engineering Expertise */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Areas of Engineering Expertise
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newExpertise}
              onChange={(e) => setNewExpertise(e.target.value)}
              placeholder="e.g. Autonomous AI Agents & Business Automation"
              className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
            />
            <button
              type="button"
              onClick={addExpertise}
              className="px-4 py-2 rounded-xl bg-[#101B33] text-white text-xs font-semibold hover:bg-[#1C2C4E]"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {expertiseList.map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-slate-100 text-slate-800 border border-slate-200"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => removeExpertise(idx)}
                  className="text-slate-400 hover:text-rose-600"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-[#101B33] text-white hover:bg-[#1C2C4E] disabled:opacity-60 transition-colors shadow-sm active:scale-95"
          >
            <Save className="w-4 h-4 text-[#C6A15B]" />
            <span>{saving ? 'Saving...' : 'Update & Publish Founder Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
