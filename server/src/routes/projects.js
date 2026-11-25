import express from 'express';
import { db } from '../db.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Helper to parse project JSON fields and attach related reviews
function formatProject(p, includeReviews = true) {
  let technologies = [];
  let screenshots = [];
  let features = [];

  try {
    technologies = JSON.parse(p.technologies_json || '[]');
  } catch (e) {
    technologies = [];
  }

  try {
    screenshots = JSON.parse(p.screenshots_json || '[]');
  } catch (e) {
    screenshots = [];
  }

  try {
    features = JSON.parse(p.features_json || '[]');
  } catch (e) {
    features = [];
  }

  const result = {
    ...p,
    client_name: p.client_name || '',
    status: p.status || (p.is_published ? 'published' : 'draft'),
    is_published: p.is_published !== undefined ? p.is_published : 1,
    technologies,
    screenshots,
    features
  };

  if (includeReviews) {
    try {
      const relatedReviews = db.prepare(`
        SELECT id, review_id, reviewer_name, business_name, rating, review_text, website_url, location, is_verified, created_at
        FROM reviews
        WHERE project_id = ? AND status = 'approved' AND (is_visible = 1 OR is_visible IS NULL)
        ORDER BY is_verified DESC, id DESC
      `).all(p.id);
      result.related_reviews = relatedReviews;
    } catch (e) {
      result.related_reviews = [];
    }
  }

  return result;
}

// Public: Get published portfolio projects with optional category and search filters
router.get('/', (req, res) => {
  const { category, q } = req.query;
  let query = "SELECT * FROM projects WHERE (is_published = 1 OR is_published IS NULL) AND (status = 'published' OR status IS NULL)";
  const params = [];

  if (category && category !== 'All') {
    query += ' AND category = ?';
    params.push(category);
  }

  if (q && q.trim()) {
    query += ' AND (name LIKE ? OR description LIKE ? OR tagline LIKE ? OR technologies_json LIKE ?)';
    const pattern = `%${q.trim()}%`;
    params.push(pattern, pattern, pattern, pattern);
  }

  query += ' ORDER BY is_featured DESC, sort_order ASC, id DESC';
  const projects = db.prepare(query).all(...params);

  res.json({
    success: true,
    projects: projects.map(p => formatProject(p, true))
  });
});

// Admin: Get all portfolio projects (published, drafts, archived) with comprehensive summary
router.get('/admin/all', requireAdmin, (req, res) => {
  const { category, status, q } = req.query;
  let query = 'SELECT * FROM projects WHERE 1=1';
  const params = [];

  if (category && category !== 'All') {
    query += ' AND category = ?';
    params.push(category);
  }

  if (status && status !== 'all') {
    if (status === 'published') {
      query += " AND (status = 'published' AND is_published = 1)";
    } else if (status === 'draft') {
      query += " AND (status = 'draft' OR is_published = 0)";
    } else if (status === 'featured') {
      query += ' AND is_featured = 1';
    } else {
      query += ' AND status = ?';
      params.push(status);
    }
  }

  if (q && q.trim()) {
    query += ' AND (name LIKE ? OR client_name LIKE ? OR description LIKE ? OR slug LIKE ?)';
    const pattern = `%${q.trim()}%`;
    params.push(pattern, pattern, pattern, pattern);
  }

  query += ' ORDER BY sort_order ASC, id DESC';
  const projects = db.prepare(query).all(...params);

  const stats = db.prepare(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN status = 'published' AND (is_published = 1 OR is_published IS NULL) THEN 1 ELSE 0 END) as published_count,
      SUM(CASE WHEN status = 'draft' OR is_published = 0 THEN 1 ELSE 0 END) as draft_count,
      SUM(CASE WHEN is_featured = 1 THEN 1 ELSE 0 END) as featured_count
    FROM projects
  `).get();

  res.json({
    success: true,
    projects: projects.map(p => formatProject(p, true)),
    summary: {
      total: stats.total || 0,
      published: stats.published_count || 0,
      drafts: stats.draft_count || 0,
      featured: stats.featured_count || 0
    }
  });
});

// Public / Admin: Get single project by ID or Slug
router.get('/:idOrSlug', (req, res) => {
  const { idOrSlug } = req.params;
  const project = db.prepare('SELECT * FROM projects WHERE id = ? OR slug = ?').get(idOrSlug, idOrSlug);

  if (!project) {
    return res.status(404).json({ success: false, error: 'Project not found.' });
  }

  res.json({
    success: true,
    project: formatProject(project, true)
  });
});

// Admin: Create new project
router.post('/', requireAdmin, (req, res) => {
  const {
    name,
    slug,
    category,
    client_name,
    tagline,
    description,
    case_study,
    technologies,
    features,
    image_url,
    screenshots,
    live_url,
    github_url,
    completion_date,
    is_featured,
    is_demo_concept,
    is_published,
    status,
    sort_order
  } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, error: 'Project name / title is required.' });
  }

  if (!category || !category.trim()) {
    return res.status(400).json({ success: false, error: 'Project category is required.' });
  }

  if (!description || !description.trim()) {
    return res.status(400).json({ success: false, error: 'Project description is required.' });
  }

  const generatedSlug = (slug && slug.trim())
    ? slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    : name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const techJson = typeof technologies === 'string' ? technologies : JSON.stringify(technologies || []);
  const screenshotsJson = typeof screenshots === 'string' ? screenshots : JSON.stringify(screenshots || []);
  const featuresJson = typeof features === 'string' ? features : JSON.stringify(features || []);
  const now = new Date().toISOString();

  const finalStatus = status === 'draft' ? 'draft' : 'published';
  const finalPublished = is_published !== undefined ? (is_published ? 1 : 0) : (finalStatus === 'published' ? 1 : 0);

  try {
    const info = db.prepare(`
      INSERT INTO projects (
        name, slug, category, client_name, tagline, description, case_study,
        technologies_json, features_json, image_url, screenshots_json, live_url, github_url,
        completion_date, is_featured, is_demo_concept, status, is_published, sort_order, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      name.trim(),
      generatedSlug,
      category.trim(),
      client_name ? client_name.trim() : null,
      tagline ? tagline.trim() : '',
      description.trim(),
      case_study ? case_study.trim() : '',
      techJson,
      featuresJson,
      image_url || '/assets/projects/nexus-portal.svg',
      screenshotsJson,
      live_url ? live_url.trim() : null,
      github_url ? github_url.trim() : null,
      completion_date || '',
      is_featured ? 1 : 0,
      is_demo_concept ? 1 : 0,
      finalStatus,
      finalPublished,
      Number(sort_order) || 0,
      now,
      now
    );

    const created = db.prepare('SELECT * FROM projects WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json({
      success: true,
      message: 'Portfolio project created successfully.',
      id: info.lastInsertRowid,
      project: formatProject(created, false)
    });
  } catch (err) {
    if (err.message && err.message.includes('UNIQUE')) {
      return res.status(400).json({ success: false, error: 'A project with this title or slug already exists.' });
    }
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin: Update existing project
router.put('/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const {
    name,
    slug,
    category,
    client_name,
    tagline,
    description,
    case_study,
    technologies,
    features,
    image_url,
    screenshots,
    live_url,
    github_url,
    completion_date,
    is_featured,
    is_demo_concept,
    is_published,
    status,
    sort_order
  } = req.body;

  const existing = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
  if (!existing) {
    return res.status(404).json({ success: false, error: 'Project not found.' });
  }

  const techJson = technologies !== undefined
    ? (typeof technologies === 'string' ? technologies : JSON.stringify(technologies || []))
    : existing.technologies_json;

  const screenshotsJson = screenshots !== undefined
    ? (typeof screenshots === 'string' ? screenshots : JSON.stringify(screenshots || []))
    : existing.screenshots_json;

  const featuresJson = features !== undefined
    ? (typeof features === 'string' ? features : JSON.stringify(features || []))
    : existing.features_json;

  const now = new Date().toISOString();

  let finalStatus = status !== undefined ? status : existing.status;
  let finalPublished = is_published !== undefined
    ? (is_published ? 1 : 0)
    : (finalStatus === 'published' ? 1 : (finalStatus === 'draft' ? 0 : existing.is_published));

  if (status !== undefined && is_published === undefined) {
    finalPublished = status === 'published' ? 1 : 0;
  }

  try {
    db.prepare(`
      UPDATE projects SET
        name = COALESCE(?, name),
        slug = COALESCE(?, slug),
        category = COALESCE(?, category),
        client_name = ?,
        tagline = COALESCE(?, tagline),
        description = COALESCE(?, description),
        case_study = COALESCE(?, case_study),
        technologies_json = ?,
        features_json = ?,
        image_url = COALESCE(?, image_url),
        screenshots_json = ?,
        live_url = ?,
        github_url = ?,
        completion_date = COALESCE(?, completion_date),
        is_featured = CASE WHEN ? IS NOT NULL THEN ? ELSE is_featured END,
        is_demo_concept = CASE WHEN ? IS NOT NULL THEN ? ELSE is_demo_concept END,
        status = ?,
        is_published = ?,
        sort_order = CASE WHEN ? IS NOT NULL THEN ? ELSE sort_order END,
        updated_at = ?
      WHERE id = ?
    `).run(
      name ? name.trim() : null,
      slug ? slug.trim() : null,
      category ? category.trim() : null,
      client_name !== undefined ? (client_name ? client_name.trim() : null) : existing.client_name,
      tagline !== undefined ? tagline.trim() : null,
      description ? description.trim() : null,
      case_study !== undefined ? case_study.trim() : null,
      techJson,
      featuresJson,
      image_url || null,
      screenshotsJson,
      live_url !== undefined ? (live_url ? live_url.trim() : null) : existing.live_url,
      github_url !== undefined ? (github_url ? github_url.trim() : null) : existing.github_url,
      completion_date !== undefined ? completion_date : null,
      is_featured !== undefined ? (is_featured ? 1 : 0) : null,
      is_featured !== undefined ? (is_featured ? 1 : 0) : null,
      is_demo_concept !== undefined ? (is_demo_concept ? 1 : 0) : null,
      is_demo_concept !== undefined ? (is_demo_concept ? 1 : 0) : null,
      finalStatus,
      finalPublished,
      sort_order !== undefined ? Number(sort_order) : null,
      sort_order !== undefined ? Number(sort_order) : null,
      now,
      id
    );

    const updated = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
    res.json({
      success: true,
      message: 'Project updated successfully.',
      project: formatProject(updated, true)
    });
  } catch (err) {
    if (err.message && err.message.includes('UNIQUE')) {
      return res.status(400).json({ success: false, error: 'A project with this slug already exists.' });
    }
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin: Toggle publish / draft status
router.patch('/:id/publish', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { is_published } = req.body;

  const existing = db.prepare('SELECT id, status, is_published FROM projects WHERE id = ?').get(id);
  if (!existing) {
    return res.status(404).json({ success: false, error: 'Project not found.' });
  }

  const newPublished = is_published !== undefined ? (is_published ? 1 : 0) : (existing.is_published ? 0 : 1);
  const newStatus = newPublished ? 'published' : 'draft';
  const now = new Date().toISOString();

  db.prepare(`
    UPDATE projects SET
      is_published = ?,
      status = ?,
      updated_at = ?
    WHERE id = ?
  `).run(newPublished, newStatus, now, id);

  res.json({
    success: true,
    message: newPublished ? 'Project published to live portfolio.' : 'Project reverted to draft status.',
    is_published: newPublished,
    status: newStatus
  });
});

// Admin: Toggle featured status
router.patch('/:id/featured', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { is_featured } = req.body;

  const existing = db.prepare('SELECT id, is_featured FROM projects WHERE id = ?').get(id);
  if (!existing) {
    return res.status(404).json({ success: false, error: 'Project not found.' });
  }

  const newFeatured = is_featured !== undefined ? (is_featured ? 1 : 0) : (existing.is_featured ? 0 : 1);
  const now = new Date().toISOString();

  db.prepare(`
    UPDATE projects SET
      is_featured = ?,
      updated_at = ?
    WHERE id = ?
  `).run(newFeatured, now, id);

  res.json({
    success: true,
    message: newFeatured ? 'Project marked as Featured.' : 'Featured status removed.',
    is_featured: newFeatured
  });
});

// Admin: Delete project
router.delete('/:id', requireAdmin, (req, res) => {
  const { id } = req.params;

  // Also unlink any reviews referencing this project
  db.prepare('UPDATE reviews SET project_id = NULL WHERE project_id = ?').run(id);

  const info = db.prepare('DELETE FROM projects WHERE id = ?').run(id);
  if (info.changes === 0) {
    return res.status(404).json({ success: false, error: 'Project not found.' });
  }

  res.json({ success: true, message: 'Project and review references deleted successfully.' });
});

export default router;
