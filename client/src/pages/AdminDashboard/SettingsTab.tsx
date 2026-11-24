import React, { useEffect, useState } from 'react';
import { Save, CheckCircle, AlertCircle, Key, Globe, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api';

export const SettingsTab: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Change Password Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    api.getSettings()
      .then(res => setSettings(res.settings))
      .catch(err => setSettingsMsg({ type: 'error', text: err.message }))
      .finally(() => setLoading(false));
  }, []);

  const handleSettingChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsMsg(null);

    try {
      const res = await api.updateSettings(settings);
      setSettingsMsg({ type: 'success', text: res.message });
    } catch (err: any) {
      setSettingsMsg({ type: 'error', text: err.message || 'Failed to update settings.' });
    } finally {
      setSavingSettings(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword.length < 8) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 8 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    setChangingPassword(true);
    try {
      const res = await api.changePassword(currentPassword, newPassword);
      setPasswordMsg({ type: 'success', text: res.message });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordMsg({ type: 'error', text: err.message || 'Failed to update password.' });
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* SEO & Global Website Settings */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-subtle space-y-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#C6A15B]">
            Search Optimization &amp; Global Tags
          </span>
          <h2 className="text-2xl font-extrabold text-[#101B33] mt-1">
            SEO &amp; Analytics Configuration
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Configure metadata tags, search engine verification, and analytics IDs.
          </p>
        </div>

        {settingsMsg && (
          <div className={`p-4 rounded-xl text-xs flex items-center gap-2.5 ${
            settingsMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}>
            {settingsMsg.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{settingsMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
          <div>
            <label className="block font-bold uppercase text-slate-700 mb-1.5">
              Default Page Title
            </label>
            <input
              type="text"
              value={settings.site_title || ''}
              onChange={(e) => handleSettingChange('site_title', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
            />
          </div>

          <div>
            <label className="block font-bold uppercase text-slate-700 mb-1.5">
              Global Meta Description
            </label>
            <textarea
              rows={3}
              value={settings.meta_description || ''}
              onChange={(e) => handleSettingChange('meta_description', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block font-bold uppercase text-slate-700 mb-1.5">
                Google Analytics Measurement ID
              </label>
              <input
                type="text"
                placeholder="G-XXXXXXXXXX"
                value={settings.google_analytics_id || ''}
                onChange={(e) => handleSettingChange('google_analytics_id', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-700 mb-1.5">
                Headquarters Address
              </label>
              <input
                type="text"
                value={settings.address_location || ''}
                onChange={(e) => handleSettingChange('address_location', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={savingSettings}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold bg-[#101B33] text-white hover:bg-[#1C2C4E] disabled:opacity-60 transition-colors shadow-sm"
            >
              <Save className="w-4 h-4 text-[#C6A15B]" />
              <span>{savingSettings ? 'Saving Settings...' : 'Save Website Settings'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Security & Password Management */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-subtle space-y-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#C6A15B]">
            Authentication &amp; Access Control
          </span>
          <h2 className="text-2xl font-extrabold text-[#101B33] mt-1">
            Update Admin Password
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Passwords are encrypted using bcrypt hashing. Keep your administrator password confidential.
          </p>
        </div>

        {passwordMsg && (
          <div className={`p-4 rounded-xl text-xs flex items-center gap-2.5 ${
            passwordMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}>
            {passwordMsg.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{passwordMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md text-xs">
          <div>
            <label className="block font-bold uppercase text-slate-700 mb-1">
              Current Password *
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
            />
          </div>

          <div>
            <label className="block font-bold uppercase text-slate-700 mb-1">
              New Password (min 8 chars) *
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
            />
          </div>

          <div>
            <label className="block font-bold uppercase text-slate-700 mb-1">
              Confirm New Password *
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C6A15B]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={changingPassword}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold bg-[#101B33] text-white hover:bg-[#1C2C4E] disabled:opacity-60 transition-colors shadow-sm"
            >
              <Key className="w-4 h-4 text-[#C6A15B]" />
              <span>{changingPassword ? 'Updating Password...' : 'Update Password'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
