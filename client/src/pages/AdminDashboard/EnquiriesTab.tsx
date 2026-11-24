import React, { useEffect, useState } from 'react';
import { Mail, Phone, MessageSquare, CheckCircle, Trash2, Clock, Check, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';
import { Enquiry } from '../../types';

export const EnquiriesTab: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [summary, setSummary] = useState({ total: 0, new: 0, in_discussion: 0, closed: 0 });
  const [filter, setFilter] = useState<'all' | 'new' | 'in_discussion' | 'closed'>('all');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadEnquiries();
  }, []);

  const loadEnquiries = async () => {
    try {
      const res = await api.getAdminEnquiries();
      setEnquiries(res.enquiries);
      setSummary(res.summary);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message });
    }
  };

  const handleStatusUpdate = async (id: number, status: 'new' | 'in_discussion' | 'closed') => {
    try {
      await api.updateEnquiryStatus(id, { status });
      setStatusMsg({ type: 'success', text: `Enquiry status updated to ${status}.` });
      loadEnquiries();
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message });
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

  const filteredEnquiries = filter === 'all'
    ? enquiries
    : enquiries.filter(e => e.status === filter);

  return (
    <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-subtle space-y-6">
      <div>
        <span className="text-xs uppercase font-bold tracking-widest text-[#C6A15B]">
          Lead Ingestion &amp; CRM
        </span>
        <h2 className="text-2xl font-extrabold text-[#101B33] mt-1">
          Client Project Enquiries
        </h2>
        <p className="text-slate-500 text-xs mt-1">
          Incoming enquiries submitted through the public Contact Us portal.
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

      {/* Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
          <span className="block text-2xl font-extrabold text-[#101B33]">{summary.total}</span>
          <span className="text-xs text-slate-500 font-semibold uppercase">Total Received</span>
        </div>

        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-center">
          <span className="block text-2xl font-extrabold text-blue-800">{summary.new}</span>
          <span className="text-xs text-blue-700 font-semibold uppercase">New Enquiries</span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center">
          <span className="block text-2xl font-extrabold text-amber-800">{summary.in_discussion}</span>
          <span className="text-xs text-amber-700 font-semibold uppercase">In Discussion</span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
          <span className="block text-2xl font-extrabold text-emerald-800">{summary.closed}</span>
          <span className="text-xs text-emerald-700 font-semibold uppercase">Closed / Converted</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-100 pb-4">
        {(['all', 'new', 'in_discussion', 'closed'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
              filter === st
                ? 'bg-[#101B33] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {st.replace('_', ' ')} ({st === 'all' ? enquiries.length : enquiries.filter(e => e.status === st).length})
          </button>
        ))}
      </div>

      {/* Enquiries List */}
      <div className="space-y-4">
        {filteredEnquiries.length > 0 ? (
          filteredEnquiries.map((enq) => (
            <div
              key={enq.id}
              className={`p-6 rounded-2xl border transition-all space-y-4 ${
                enq.status === 'new'
                  ? 'bg-blue-50/40 border-blue-200'
                  : enq.status === 'in_discussion'
                  ? 'bg-amber-50/30 border-amber-200'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-base text-[#101B33]">
                    {enq.full_name}
                  </h3>
                  {enq.business_name && (
                    <span className="text-xs font-semibold text-[#C6A15B]">
                      {enq.business_name}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">
                    {new Date(enq.created_at).toLocaleString()}
                  </span>
                  <select
                    value={enq.status}
                    onChange={(e) => handleStatusUpdate(enq.id, e.target.value as any)}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold border border-slate-200 bg-white"
                  >
                    <option value="new">NEW</option>
                    <option value="in_discussion">IN DISCUSSION</option>
                    <option value="closed">CLOSED</option>
                  </select>
                </div>
              </div>

              {/* Scope & Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block font-semibold uppercase">Service Required</span>
                  <span className="font-bold text-[#101B33]">{enq.service_required}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold uppercase">Stated Budget</span>
                  <span className="font-bold text-slate-700">{enq.project_budget || 'Not specified'}</span>
                </div>
              </div>

              {/* Message */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                {enq.message}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <a
                    href={`mailto:${enq.email}?subject=PIVO%20TECH%20-%20Project%20Enquiry`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#101B33] text-white hover:bg-[#1C2C4E]"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#C6A15B]" />
                    <span>Email ({enq.email})</span>
                  </a>

                  <a
                    href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp ({enq.phone})</span>
                  </a>
                </div>

                <button
                  onClick={() => handleDelete(enq.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                  title="Delete Record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-slate-500 py-8 text-center">
            No enquiries found under "{filter}".
          </p>
        )}
      </div>
    </div>
  );
};
