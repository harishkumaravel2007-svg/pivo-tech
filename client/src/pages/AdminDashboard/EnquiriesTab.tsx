import React, { useEffect, useState } from 'react';
import {
  Mail,
  Phone,
  MessageSquare,
  CheckCircle,
  Trash2,
  Clock,
  Check,
  AlertCircle,
  Download,
  Search,
  MapPin,
  FileSpreadsheet,
  Save,
  Tag
} from 'lucide-react';
import { api } from '../../services/api';
import { Enquiry } from '../../types';

export const EnquiriesTab: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [summary, setSummary] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    in_discussion: 0,
    proposal_sent: 0,
    converted: 0,
    not_interested: 0,
    closed: 0
  });
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editingNotes, setEditingNotes] = useState<{ [id: number]: string }>({});
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadEnquiries();
  }, [filter, searchQuery]);

  const loadEnquiries = async () => {
    try {
      const res = await api.getAdminEnquiries({
        status: filter !== 'all' ? filter : undefined,
        q: searchQuery.trim() || undefined
      });
      setEnquiries(res.enquiries);
      if (res.summary) {
        setSummary({
          total: res.summary.total || 0,
          new: res.summary.new || 0,
          contacted: res.summary.contacted || 0,
          in_discussion: res.summary.in_discussion || 0,
          proposal_sent: res.summary.proposal_sent || 0,
          converted: res.summary.converted || 0,
          not_interested: res.summary.not_interested || 0,
          closed: res.summary.closed || 0
        });
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message });
    }
  };

  const handleStatusUpdate = async (id: number, status: any) => {
    try {
      await api.updateEnquiryStatus(id, { status });
      setStatusMsg({ type: 'success', text: `Lead status updated to ${status}.` });
      loadEnquiries();
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message });
    }
  };

  const handleSaveNotes = async (id: number) => {
    try {
      const notes = editingNotes[id];
      await api.updateEnquiryStatus(id, { notes });
      setStatusMsg({ type: 'success', text: 'Internal notes saved.' });
      loadEnquiries();
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message });
    }
  };

  const handleExportCsv = async () => {
    setExporting(true);
    try {
      const blob = await api.exportEnquiriesCsv();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pivotech_client_leads_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      setStatusMsg({ type: 'success', text: 'Lead export completed successfully.' });
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to export CSV.' });
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this enquiry record?')) return;
    try {
      await api.deleteEnquiry(id);
      setStatusMsg({ type: 'success', text: 'Enquiry record deleted.' });
      loadEnquiries();
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message });
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-subtle space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#C6A15B]">
            Client Acquisition CRM
          </span>
          <h2 className="text-2xl font-extrabold text-[#101B33] mt-1">
            Lead Management System
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Structured client lead ingestion, lifecycle pipeline, and direct client outreach.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          disabled={exporting}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#101B33] text-white hover:bg-[#1C2C4E] text-xs font-bold shadow-sm transition-all shrink-0"
        >
          <FileSpreadsheet className="w-4 h-4 text-[#C6A15B]" />
          <span>{exporting ? 'Generating CSV...' : 'Export Leads (CSV)'}</span>
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

      {/* Counters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
          <span className="block text-2xl font-extrabold text-[#101B33]">{summary.total}</span>
          <span className="text-[10px] text-slate-500 font-bold uppercase">Total Leads</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-center">
          <span className="block text-2xl font-extrabold text-blue-800">{summary.new}</span>
          <span className="text-[10px] text-blue-700 font-bold uppercase">New</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-center">
          <span className="block text-2xl font-extrabold text-indigo-800">{summary.contacted}</span>
          <span className="text-[10px] text-indigo-700 font-bold uppercase">Contacted</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-center">
          <span className="block text-2xl font-extrabold text-amber-800">{summary.in_discussion}</span>
          <span className="text-[10px] text-amber-700 font-bold uppercase">Discussion</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-center">
          <span className="block text-2xl font-extrabold text-purple-800">{summary.proposal_sent}</span>
          <span className="text-[10px] text-purple-700 font-bold uppercase">Proposal Sent</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
          <span className="block text-2xl font-extrabold text-emerald-800">{summary.converted}</span>
          <span className="text-[10px] text-emerald-700 font-bold uppercase">Converted</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-center">
          <span className="block text-2xl font-extrabold text-rose-800">{summary.not_interested}</span>
          <span className="text-[10px] text-rose-700 font-bold uppercase">Not Interested</span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Lead ID, name, company..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#C6A15B]"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {[
            { id: 'all', label: 'All' },
            { id: 'new', label: 'New' },
            { id: 'contacted', label: 'Contacted' },
            { id: 'discussion', label: 'Discussion' },
            { id: 'proposal_sent', label: 'Proposal' },
            { id: 'converted', label: 'Converted' },
            { id: 'not_interested', label: 'Archived' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === tab.id
                  ? 'bg-[#101B33] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Enquiries List */}
      <div className="space-y-4 pt-2">
        {enquiries.length > 0 ? (
          enquiries.map((enq) => (
            <div
              key={enq.id}
              className={`p-6 rounded-2xl border transition-all space-y-4 ${
                enq.status === 'new'
                  ? 'bg-blue-50/30 border-blue-200'
                  : enq.status === 'converted'
                  ? 'bg-emerald-50/30 border-emerald-200'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-md bg-[#101B33] text-[#C6A15B] font-mono text-[11px] font-bold tracking-wider">
                    {enq.lead_id || `LEAD-${enq.id}`}
                  </span>
                  <div>
                    <h3 className="font-extrabold text-base text-[#101B33]">
                      {enq.full_name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      {enq.business_name && (
                        <span className="font-semibold text-[#C6A15B]">
                          {enq.business_name}
                        </span>
                      )}
                      {(enq.city || enq.country) && (
                        <span className="flex items-center gap-1 text-slate-400">
                          <MapPin className="w-3 h-3" />
                          <span>{[enq.city, enq.country].filter(Boolean).join(', ')}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">
                    {new Date(enq.created_at).toLocaleString()}
                  </span>
                  <select
                    value={enq.status}
                    onChange={(e) => handleStatusUpdate(enq.id, e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold border border-slate-200 bg-white text-[#101B33] focus:outline-none focus:border-[#C6A15B]"
                  >
                    <option value="new">NEW LEAD</option>
                    <option value="contacted">CONTACTED</option>
                    <option value="discussion">IN DISCUSSION</option>
                    <option value="proposal_sent">PROPOSAL SENT</option>
                    <option value="converted">CONVERTED / CLOSED</option>
                    <option value="not_interested">NOT INTERESTED</option>
                  </select>
                </div>
              </div>

              {/* Scope & Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block font-semibold uppercase">Service Required</span>
                  <span className="font-bold text-[#101B33]">{enq.service_required}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold uppercase">Target Budget</span>
                  <span className="font-bold text-slate-700">{enq.project_budget || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold uppercase">Preferred Channel</span>
                  <span className="font-bold uppercase text-[#C6A15B]">{enq.preferred_contact || 'WhatsApp'}</span>
                </div>
              </div>

              {/* Message */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                {enq.message}
              </div>

              {/* Internal Notes */}
              <div className="pt-1">
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  Internal Administrative Notes &amp; Scoping
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    defaultValue={enq.notes || ''}
                    placeholder="e.g. Call completed on 25-Nov. Proposal sent for ₹75,000 via WhatsApp."
                    onChange={(e) => setEditingNotes({ ...editingNotes, [enq.id]: e.target.value })}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#C6A15B]"
                  />
                  <button
                    type="button"
                    onClick={() => handleSaveNotes(enq.id)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-[#C6A15B] hover:text-[#101B33] flex items-center gap-1 transition-all"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Note</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-slate-100">
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Hello ${enq.full_name}, this is Harish K from PIVO TECH regarding your inquiry (${enq.lead_id || `#${enq.id}`}) for ${enq.service_required}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-semibold"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp ({enq.phone})</span>
                  </a>

                  <a
                    href={`mailto:${enq.email}?subject=${encodeURIComponent(`PIVO TECH Project Inquiry - ${enq.service_required} (${enq.lead_id || `#${enq.id}`})`)}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#101B33] text-white hover:bg-[#1C2C4E] font-semibold"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#C6A15B]" />
                    <span>Email ({enq.email})</span>
                  </a>

                  <a
                    href={`tel:${enq.phone}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200 font-semibold border border-slate-200"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>
                </div>

                <button
                  onClick={() => handleDelete(enq.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete Record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-slate-500 py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            No leads found matching your criteria.
          </p>
        )}
      </div>
    </div>
  );
};
