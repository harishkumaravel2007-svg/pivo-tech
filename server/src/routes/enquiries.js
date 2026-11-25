import express from 'express';
import { db } from '../db.js';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Helper to escape CSV values
function escapeCsv(val) {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

// Public: Submit Contact / Project Enquiry (Lead Capture)
router.post('/submit', rateLimiter(60000, 6), (req, res) => {
  const {
    full_name,
    email,
    phone,
    business_name,
    city,
    country,
    service_required,
    project_budget,
    message,
    preferred_contact,
    honeypot,
    captcha_answer,
    captcha_expected
  } = req.body;

  // Anti-bot check
  if (honeypot) {
    return res.status(400).json({ success: false, error: 'Automated submission rejected.' });
  }

  // Math verification challenge check
  if (captcha_expected !== undefined && Number(captcha_answer) !== Number(captcha_expected)) {
    return res.status(400).json({ success: false, error: 'Security verification challenge answer is incorrect. Please try again.' });
  }

  if (!full_name || !full_name.trim()) {
    return res.status(400).json({ success: false, error: 'Please enter your full name.' });
  }

  if (!email || !email.trim()) {
    return res.status(400).json({ success: false, error: 'Please enter your email address.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
  }

  if (!phone || !phone.trim() || phone.trim().length < 7) {
    return res.status(400).json({ success: false, error: 'Please enter a valid contact phone number (minimum 7 digits).' });
  }

  if (!service_required || !service_required.trim()) {
    return res.status(400).json({ success: false, error: 'Please select the required service.' });
  }

  if (!message || !message.trim() || message.trim().length < 10) {
    return res.status(400).json({ success: false, error: 'Please provide a project description (minimum 10 characters).' });
  }

  // Duplicate submission check: prevent accidental double-submits within 3 minutes
  const recentDuplicate = db.prepare(`
    SELECT id FROM enquiries
    WHERE email = ? AND service_required = ? AND created_at > datetime('now', '-3 minutes')
    LIMIT 1
  `).get(email.trim().toLowerCase(), service_required);

  if (recentDuplicate) {
    return res.status(429).json({
      success: false,
      error: 'We have already received your enquiry moments ago. Our team is already reviewing your project details.'
    });
  }

  const now = new Date().toISOString();
  const leadId = `PIVO-LEAD-${Date.now().toString().slice(-6)}`;
  const validContactMethods = ['whatsapp', 'phone', 'email'];
  const contactPref = preferred_contact && validContactMethods.includes(preferred_contact.toLowerCase())
    ? preferred_contact.toLowerCase()
    : 'whatsapp';

  const info = db.prepare(`
    INSERT INTO enquiries (
      lead_id, full_name, email, phone, business_name, city, country,
      service_required, project_budget, message, preferred_contact, status, created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?, ?)
  `).run(
    leadId,
    full_name.trim(),
    email.trim().toLowerCase(),
    phone.trim(),
    business_name ? business_name.trim() : null,
    city ? city.trim() : null,
    country ? country.trim() : 'India',
    service_required,
    project_budget || 'Not specified',
    message.trim(),
    contactPref,
    now,
    now
  );

  console.log(`[Lead Capture] New lead captured: ${leadId} (${full_name.trim()}) for ${service_required}`);

  res.status(201).json({
    success: true,
    message: 'Your project enquiry has been submitted successfully! Founder Harish K and the PIVO TECH team will contact you shortly.',
    enquiryId: info.lastInsertRowid,
    leadId,
    lead_id: leadId
  });
});

// Admin: Export enquiries as CSV
router.get('/admin/export', requireAdmin, (req, res) => {
  const enquiries = db.prepare(`
    SELECT * FROM enquiries ORDER BY id DESC
  `).all();

  const headers = [
    'Lead ID',
    'Full Name',
    'Business Name',
    'Email',
    'Phone',
    'City',
    'Country',
    'Service Required',
    'Budget',
    'Preferred Contact',
    'Status',
    'Message',
    'Internal Notes',
    'Submission Date'
  ];

  let csvContent = headers.join(',') + '\n';

  for (const e of enquiries) {
    const row = [
      escapeCsv(e.lead_id || `LEAD-${e.id}`),
      escapeCsv(e.full_name),
      escapeCsv(e.business_name || 'N/A'),
      escapeCsv(e.email),
      escapeCsv(e.phone),
      escapeCsv(e.city || 'N/A'),
      escapeCsv(e.country || 'India'),
      escapeCsv(e.service_required),
      escapeCsv(e.project_budget || 'Not specified'),
      escapeCsv(e.preferred_contact || 'whatsapp'),
      escapeCsv(e.status),
      escapeCsv(e.message),
      escapeCsv(e.notes || ''),
      escapeCsv(e.created_at)
    ];
    csvContent += row.join(',') + '\n';
  }

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="pivotech_client_leads.csv"');
  res.send(csvContent);
});

// Admin: List all enquiries with search & filter support
router.get('/admin/all', requireAdmin, (req, res) => {
  const { status, service, q } = req.query;

  let query = 'SELECT * FROM enquiries WHERE 1=1';
  const params = [];

  if (status && status !== 'all') {
    query += ' AND status = ?';
    params.push(status);
  }

  if (service && service !== 'all') {
    query += ' AND service_required = ?';
    params.push(service);
  }

  if (q && q.trim()) {
    query += ' AND (full_name LIKE ? OR business_name LIKE ? OR email LIKE ? OR phone LIKE ? OR lead_id LIKE ?)';
    const searchPattern = `%${q.trim()}%`;
    params.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
  }

  query += ' ORDER BY id DESC';

  const enquiries = db.prepare(query).all(...params);

  const counts = db.prepare(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new_count,
      SUM(CASE WHEN status = 'contacted' THEN 1 ELSE 0 END) as contacted_count,
      SUM(CASE WHEN status = 'discussion' OR status = 'in_discussion' THEN 1 ELSE 0 END) as in_discussion,
      SUM(CASE WHEN status = 'proposal_sent' THEN 1 ELSE 0 END) as proposal_sent,
      SUM(CASE WHEN status = 'converted' THEN 1 ELSE 0 END) as converted,
      SUM(CASE WHEN status = 'not_interested' THEN 1 ELSE 0 END) as not_interested,
      SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as closed
    FROM enquiries
  `).get();

  res.json({
    success: true,
    enquiries,
    summary: {
      total: counts.total || 0,
      new: counts.new_count || 0,
      contacted: counts.contacted_count || 0,
      in_discussion: counts.in_discussion || 0,
      proposal_sent: counts.proposal_sent || 0,
      converted: counts.converted || 0,
      not_interested: counts.not_interested || 0,
      closed: counts.closed || 0
    }
  });
});

// Admin: Update enquiry status & notes
router.patch('/admin/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status, notes, preferred_contact } = req.body;
  const now = new Date().toISOString();

  const info = db.prepare(`
    UPDATE enquiries SET
      status = COALESCE(?, status),
      notes = COALESCE(?, notes),
      preferred_contact = COALESCE(?, preferred_contact),
      updated_at = ?
    WHERE id = ?
  `).run(status, notes, preferred_contact, now, id);

  if (info.changes === 0) {
    return res.status(404).json({ success: false, error: 'Enquiry not found.' });
  }

  res.json({ success: true, message: 'Enquiry updated successfully.' });
});

// Admin: Delete enquiry
router.delete('/admin/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const info = db.prepare('DELETE FROM enquiries WHERE id = ?').run(id);

  if (info.changes === 0) {
    return res.status(404).json({ success: false, error: 'Enquiry not found.' });
  }

  res.json({ success: true, message: 'Enquiry deleted successfully.' });
});

export default router;
