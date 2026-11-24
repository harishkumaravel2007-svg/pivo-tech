import express from 'express';
import { db } from '../db.js';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Helper to normalize and validate URLs safely
function normalizeAndValidateUrl(url) {
  if (!url || typeof url !== 'string' || !url.trim()) return null;
  let trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = 'https://' + trimmed;
  }
  try {
    const parsed = new URL(trimmed);
    if (!['http:', 'https:'].includes(parsed.protocol)) return null;
    if (!parsed.hostname || !parsed.hostname.includes('.')) return null;
    if (parsed.pathname === '/' && !parsed.search && !parsed.hash) {
      return parsed.origin;
    }
    return parsed.href;
  } catch (err) {
    return null;
  }
}

// Public: Get approved & visible reviews for public showcase & live statistics
router.get('/', (req, res) => {
  const reviews = db.prepare(`
    SELECT
      id,
      reviewer_name,
      business_name,
      business_logo_url,
      location,
      project_name,
      project_description,
      rating,
      review_text,
      website_url,
      is_verified,
      founder_response,
      founder_responded_at,
      created_by,
      created_at
    FROM reviews
    WHERE status = 'approved' AND (is_visible = 1 OR is_visible IS NULL)
    ORDER BY is_verified DESC, id DESC
  `).all();

  const stats = db.prepare(`
    SELECT
      COUNT(*) as total_reviews,
      AVG(rating) as average_rating,
      SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as stars_5,
      SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as stars_4,
      SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as stars_3,
      SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as stars_2,
      SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as stars_1
    FROM reviews
    WHERE status = 'approved' AND (is_visible = 1 OR is_visible IS NULL)
  `).get();

  res.json({
    reviews,
    stats: {
      total: stats.total_reviews || 0,
      average: stats.average_rating ? Number(stats.average_rating.toFixed(1)) : 0,
      distribution: {
        5: stats.stars_5 || 0,
        4: stats.stars_4 || 0,
        3: stats.stars_3 || 0,
        2: stats.stars_2 || 0,
        1: stats.stars_1 || 0,
      }
    }
  });
});

// Public: Submit a review (Enters pending status awaiting moderation)
router.post('/submit', rateLimiter(60000, 10), (req, res) => {
  const {
    reviewer_name,
    business_name,
    location,
    project_name,
    project_description,
    website_url,
    rating,
    review_text,
    honeypot,
    captcha_answer,
    captcha_expected
  } = req.body;

  // Anti-bot honeypot check
  if (honeypot) {
    return res.status(400).json({ error: 'Automated submission rejected.' });
  }

  // Verification math challenge check
  if (captcha_expected !== undefined && Number(captcha_answer) !== Number(captcha_expected)) {
    return res.status(400).json({ error: 'Security challenge answer is incorrect. Please try again.' });
  }

  if (!reviewer_name || !reviewer_name.trim()) {
    return res.status(400).json({ error: 'Your name is required.' });
  }

  const numericRating = Number(rating);
  if (!numericRating || numericRating < 1 || numericRating > 5) {
    return res.status(400).json({ error: 'Please provide a valid rating between 1 and 5 stars.' });
  }

  if (!review_text || review_text.trim().length < 10) {
    return res.status(400).json({ error: 'Please provide a genuine review description (minimum 10 characters).' });
  }

  let cleanWebsiteUrl = null;
  if (website_url && website_url.trim()) {
    cleanWebsiteUrl = normalizeAndValidateUrl(website_url);
    if (!cleanWebsiteUrl) {
      return res.status(400).json({ error: 'Please provide a valid website URL (e.g. https://yourbusiness.com).' });
    }
  }

  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  const now = new Date().toISOString();

  // Spam & duplicate prevention: check for identical review text or same IP/business within last 24h
  const existingDuplicate = db.prepare(`
    SELECT id FROM reviews
    WHERE (reviewer_name = ? AND review_text = ?)
       OR (client_ip = ? AND business_name = ? AND created_at > datetime('now', '-1 day'))
    LIMIT 1
  `).get(
    reviewer_name.trim(),
    review_text.trim(),
    String(clientIp),
    business_name ? business_name.trim() : ''
  );

  if (existingDuplicate) {
    return res.status(429).json({
      error: 'A review with this text or from your connection has already been submitted recently. Please allow time for moderation.'
    });
  }

  db.prepare(`
    INSERT INTO reviews (
      reviewer_name,
      business_name,
      location,
      project_name,
      project_description,
      website_url,
      rating,
      review_text,
      status,
      is_visible,
      is_verified,
      created_by,
      client_ip,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', 1, 0, 'client', ?, ?, ?)
  `).run(
    reviewer_name.trim(),
    business_name ? business_name.trim() : null,
    location ? location.trim() : null,
    project_name ? project_name.trim() : null,
    project_description ? project_description.trim() : null,
    cleanWebsiteUrl,
    numericRating,
    review_text.trim(),
    String(clientIp),
    now,
    now
  );

  res.status(201).json({
    message: 'Thank you for your review! It has been received and entered pending moderation. Once verified by the PIVO TECH team, it will appear publicly.'
  });
});

// Admin: Get all reviews with full audit fields and moderation summary
router.get('/admin/all', requireAdmin, (req, res) => {
  const reviews = db.prepare(`
    SELECT * FROM reviews ORDER BY id DESC
  `).all();

  const counts = db.prepare(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
      SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
      AVG(CASE WHEN status = 'approved' AND (is_visible = 1 OR is_visible IS NULL) THEN rating ELSE NULL END) as approved_average
    FROM reviews
  `).get();

  res.json({
    reviews,
    summary: {
      total: counts.total || 0,
      pending: counts.pending || 0,
      approved: counts.approved || 0,
      rejected: counts.rejected || 0,
      average: counts.approved_average ? Number(counts.approved_average.toFixed(1)) : 0
    }
  });
});

// Admin / Founder: Add genuine client review received with permission
router.post('/admin/add', requireAdmin, (req, res) => {
  const {
    reviewer_name,
    business_name,
    business_logo_url,
    location,
    project_name,
    project_description,
    rating,
    review_text,
    website_url,
    is_verified,
    is_visible,
    founder_response
  } = req.body;

  if (!reviewer_name || !reviewer_name.trim()) {
    return res.status(400).json({ error: 'Client or reviewer name is required.' });
  }

  const numericRating = Number(rating);
  if (!numericRating || numericRating < 1 || numericRating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5 stars.' });
  }

  if (!review_text || !review_text.trim()) {
    return res.status(400).json({ error: 'Client review text is required.' });
  }

  let cleanWebsiteUrl = null;
  if (website_url && website_url.trim()) {
    cleanWebsiteUrl = normalizeAndValidateUrl(website_url);
    if (!cleanWebsiteUrl) {
      return res.status(400).json({ error: 'Please provide a valid website URL.' });
    }
  }

  const now = new Date().toISOString();
  const founderRespondedAt = founder_response && founder_response.trim() ? now : null;

  const result = db.prepare(`
    INSERT INTO reviews (
      reviewer_name,
      business_name,
      business_logo_url,
      location,
      project_name,
      project_description,
      rating,
      review_text,
      website_url,
      status,
      is_visible,
      is_verified,
      founder_response,
      founder_responded_at,
      approved_at,
      created_by,
      client_ip,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved', ?, ?, ?, ?, ?, 'founder', 'admin-console', ?, ?)
  `).run(
    reviewer_name.trim(),
    business_name ? business_name.trim() : null,
    business_logo_url ? business_logo_url.trim() : null,
    location ? location.trim() : null,
    project_name ? project_name.trim() : null,
    project_description ? project_description.trim() : null,
    numericRating,
    review_text.trim(),
    cleanWebsiteUrl,
    is_visible !== undefined ? (is_visible ? 1 : 0) : 1,
    is_verified !== undefined ? (is_verified ? 1 : 0) : 1,
    founder_response ? founder_response.trim() : null,
    founderRespondedAt,
    now,
    now,
    now
  );

  const inserted = db.prepare('SELECT * FROM reviews WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({
    message: 'Client review record created and published successfully.',
    review: inserted
  });
});

// Admin: Edit existing client review record
router.put('/admin/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const {
    reviewer_name,
    business_name,
    business_logo_url,
    location,
    project_name,
    project_description,
    rating,
    review_text,
    website_url,
    status,
    is_visible,
    is_verified,
    founder_response
  } = req.body;

  const existing = db.prepare('SELECT * FROM reviews WHERE id = ?').get(id);
  if (!existing) {
    return res.status(404).json({ error: 'Review record not found.' });
  }

  let cleanWebsiteUrl = existing.website_url;
  if (website_url !== undefined) {
    cleanWebsiteUrl = website_url && website_url.trim() ? normalizeAndValidateUrl(website_url) : null;
    if (website_url && website_url.trim() && !cleanWebsiteUrl) {
      return res.status(400).json({ error: 'Invalid website URL format.' });
    }
  }

  const numericRating = rating !== undefined ? Number(rating) : existing.rating;
  if (numericRating < 1 || numericRating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
  }

  const now = new Date().toISOString();
  let approvedAt = existing.approved_at;
  if (status === 'approved' && !approvedAt) {
    approvedAt = now;
  }

  let founderRespondedAt = existing.founder_responded_at;
  if (founder_response !== undefined) {
    founderRespondedAt = founder_response && founder_response.trim() ? (existing.founder_responded_at || now) : null;
  }

  db.prepare(`
    UPDATE reviews SET
      reviewer_name = COALESCE(?, reviewer_name),
      business_name = COALESCE(?, business_name),
      business_logo_url = ?,
      location = ?,
      project_name = ?,
      project_description = ?,
      rating = ?,
      review_text = COALESCE(?, review_text),
      website_url = ?,
      status = COALESCE(?, status),
      is_visible = CASE WHEN ? IS NOT NULL THEN ? ELSE is_visible END,
      is_verified = CASE WHEN ? IS NOT NULL THEN ? ELSE is_verified END,
      founder_response = ?,
      founder_responded_at = ?,
      approved_at = ?,
      updated_at = ?
    WHERE id = ?
  `).run(
    reviewer_name ? reviewer_name.trim() : null,
    business_name !== undefined ? (business_name ? business_name.trim() : null) : existing.business_name,
    business_logo_url !== undefined ? (business_logo_url ? business_logo_url.trim() : null) : existing.business_logo_url,
    location !== undefined ? (location ? location.trim() : null) : existing.location,
    project_name !== undefined ? (project_name ? project_name.trim() : null) : existing.project_name,
    project_description !== undefined ? (project_description ? project_description.trim() : null) : existing.project_description,
    numericRating,
    review_text ? review_text.trim() : null,
    cleanWebsiteUrl,
    status || null,
    is_visible !== undefined ? (is_visible ? 1 : 0) : null,
    is_visible !== undefined ? (is_visible ? 1 : 0) : null,
    is_verified !== undefined ? (is_verified ? 1 : 0) : null,
    is_verified !== undefined ? (is_verified ? 1 : 0) : null,
    founder_response !== undefined ? (founder_response ? founder_response.trim() : null) : existing.founder_response,
    founderRespondedAt,
    approvedAt,
    now,
    id
  );

  const updated = db.prepare('SELECT * FROM reviews WHERE id = ?').get(id);
  res.json({
    message: 'Client review record updated successfully.',
    review: updated
  });
});

// Admin: Quick status, visibility & verification toggle
router.patch('/admin/:id/status', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status, is_verified, is_visible } = req.body;

  if (status && !['pending', 'approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Status must be one of: pending, approved, rejected.' });
  }

  const existing = db.prepare('SELECT * FROM reviews WHERE id = ?').get(id);
  if (!existing) {
    return res.status(404).json({ error: 'Review not found.' });
  }

  const now = new Date().toISOString();
  let approvedAt = existing.approved_at;
  if (status === 'approved' && !approvedAt) {
    approvedAt = now;
  }

  db.prepare(`
    UPDATE reviews SET
      status = COALESCE(?, status),
      is_verified = CASE WHEN ? IS NOT NULL THEN ? ELSE is_verified END,
      is_visible = CASE WHEN ? IS NOT NULL THEN ? ELSE is_visible END,
      approved_at = ?,
      updated_at = ?
    WHERE id = ?
  `).run(
    status || null,
    is_verified !== undefined ? (is_verified ? 1 : 0) : null,
    is_verified !== undefined ? (is_verified ? 1 : 0) : null,
    is_visible !== undefined ? (is_visible ? 1 : 0) : null,
    is_visible !== undefined ? (is_visible ? 1 : 0) : null,
    approvedAt,
    now,
    id
  );

  res.json({ message: 'Review moderation updated successfully.' });
});

// Admin / Founder: Add or update official Founder Response to a client review
router.patch('/admin/:id/founder-response', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { founder_response } = req.body;

  const existing = db.prepare('SELECT * FROM reviews WHERE id = ?').get(id);
  if (!existing) {
    return res.status(404).json({ error: 'Review not found.' });
  }

  const now = new Date().toISOString();
  const trimmed = founder_response && founder_response.trim() ? founder_response.trim() : null;
  const respondedAt = trimmed ? now : null;

  db.prepare(`
    UPDATE reviews SET
      founder_response = ?,
      founder_responded_at = ?,
      updated_at = ?
    WHERE id = ?
  `).run(trimmed, respondedAt, now, id);

  res.json({
    message: trimmed ? 'Official founder response saved successfully.' : 'Founder response removed successfully.',
    founder_response: trimmed,
    founder_responded_at: respondedAt
  });
});

// Admin: Delete review
router.delete('/admin/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const info = db.prepare('DELETE FROM reviews WHERE id = ?').run(id);

  if (info.changes === 0) {
    return res.status(404).json({ error: 'Review not found.' });
  }

  res.json({ message: 'Review deleted successfully.' });
});

export default router;
