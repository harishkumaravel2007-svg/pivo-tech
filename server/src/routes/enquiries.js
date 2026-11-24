import express from 'express';
import { db } from '../db.js';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public: Submit Contact Enquiry
router.post('/submit', rateLimiter(60000, 4), (req, res) => {
  const {
    full_name,
    email,
    phone,
    business_name,
    service_required,
    project_budget,
    message,
    honeypot,
    captcha_answer,
    captcha_expected
  } = req.body;

  // Anti-bot check
  if (honeypot) {
    return res.status(400).json({ error: 'Automated submission rejected.' });
  }

  if (captcha_expected !== undefined && Number(captcha_answer) !== Number(captcha_expected)) {
    return res.status(400).json({ error: 'Security challenge answer is incorrect. Please try again.' });
  }

  if (!full_name || !email || !phone || !service_required || !message) {
    return res.status(400).json({
      error: 'Please fill in all required fields: Name, Email, Phone, Service Required, and Project Description.'
    });
  }

  // Basic email pattern check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  const now = new Date().toISOString();

  const info = db.prepare(`
    INSERT INTO enquiries (full_name, email, phone, business_name, service_required, project_budget, message, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'new', ?)
  `).run(
    full_name.trim(),
    email.trim().toLowerCase(),
    phone.trim(),
    business_name ? business_name.trim() : null,
    service_required,
    project_budget || 'Not specified',
    message.trim(),
    now
  );

  res.status(201).json({
    message: 'Your project enquiry has been received securely! Founder Harish K or the PIVO TECH team will get back to you within 24 hours.',
    enquiryId: info.lastInsertRowid
  });
});

// Admin: List all enquiries
router.get('/admin/all', requireAdmin, (req, res) => {
  const enquiries = db.prepare(`
    SELECT * FROM enquiries ORDER BY id DESC
  `).all();

  const counts = db.prepare(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new_count,
      SUM(CASE WHEN status = 'in_discussion' THEN 1 ELSE 0 END) as in_discussion,
      SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as closed
    FROM enquiries
  `).get();

  res.json({
    enquiries,
    summary: {
      total: counts.total || 0,
      new: counts.new_count || 0,
      in_discussion: counts.in_discussion || 0,
      closed: counts.closed || 0
    }
  });
});

// Admin: Update enquiry status & notes
router.patch('/admin/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  const info = db.prepare(`
    UPDATE enquiries SET
      status = COALESCE(?, status),
      notes = COALESCE(?, notes)
    WHERE id = ?
  `).run(status, notes, id);

  if (info.changes === 0) {
    return res.status(404).json({ error: 'Enquiry not found.' });
  }

  res.json({ message: 'Enquiry updated successfully.' });
});

// Admin: Delete enquiry
router.delete('/admin/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const info = db.prepare('DELETE FROM enquiries WHERE id = ?').run(id);

  if (info.changes === 0) {
    return res.status(404).json({ error: 'Enquiry not found.' });
  }

  res.json({ message: 'Enquiry deleted successfully.' });
});

export default router;
