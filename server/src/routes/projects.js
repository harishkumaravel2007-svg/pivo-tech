import express from 'express';
import { db } from '../db.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', (req, res) => {
  const { category } = req.query;
  let query = 'SELECT * FROM projects';
  let params = [];

  if (category && category !== 'All') {
    query += ' WHERE category = ?';
    params.push(category);
  }

  query += ' ORDER BY sort_order ASC, id DESC';
  const projects = db.prepare(query).all(...params);

  const parsed = projects.map(p => ({
    ...p,
    technologies: JSON.parse(p.technologies_json || '[]'),
    screenshots: JSON.parse(p.screenshots_json || '[]')
  }));

  res.json({ projects: parsed });
});

router.get('/:idOrSlug', (req, res) => {
  const { idOrSlug } = req.params;
  const project = db.prepare('SELECT * FROM projects WHERE id = ? OR slug = ?').get(idOrSlug, idOrSlug);

  if (!project) {
    return res.status(404).json({ error: 'Project not found.' });
  }

  res.json({
    project: {
      ...project,
      technologies: JSON.parse(project.technologies_json || '[]'),
      screenshots: JSON.parse(project.screenshots_json || '[]')
    }
  });
});

router.post('/', requireAdmin, (req, res) => {
  const {
    name,
    slug,
    category,
    tagline,
    description,
    case_study,
    technologies,
    image_url,
    screenshots,
    live_url,
    github_url,
    completion_date,
    is_featured,
    is_demo_concept,
    sort_order
  } = req.body;

  if (!name || !category || !description) {
    return res.status(400).json({ error: 'Project name, category, and description are required.' });
  }

  const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const techJson = typeof technologies === 'string' ? technologies : JSON.stringify(technologies || []);
  const screenshotsJson = typeof screenshots === 'string' ? screenshots : JSON.stringify(screenshots || []);
  const now = new Date().toISOString();

  try {
    const info = db.prepare(`
      INSERT INTO projects (
        name, slug, category, tagline, description, case_study,
        technologies_json, image_url, screenshots_json, live_url, github_url,
        completion_date, is_featured, is_demo_concept, sort_order, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      name,
      finalSlug,
      category,
      tagline || '',
      description,
      case_study || '',
      techJson,
      image_url || '/assets/projects/nexus-portal.svg',
      screenshotsJson,
      live_url || '',
      github_url || '',
      completion_date || '',
      is_featured ? 1 : 0,
      is_demo_concept ? 1 : 0,
      Number(sort_order) || 0,
      now
    );

    res.status(201).json({ message: 'Project created successfully.', id: info.lastInsertRowid });
  } catch (err) {
    if (err.message && err.message.includes('UNIQUE')) {
      return res.status(400).json({ error: 'A project with this slug or name already exists.' });
    }
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const {
    name,
    slug,
    category,
    tagline,
    description,
    case_study,
    technologies,
    image_url,
    screenshots,
    live_url,
    github_url,
    completion_date,
    is_featured,
    is_demo_concept,
    sort_order
  } = req.body;

  const techJson = typeof technologies === 'string' ? technologies : JSON.stringify(technologies || []);
  const screenshotsJson = typeof screenshots === 'string' ? screenshots : JSON.stringify(screenshots || []);

  const info = db.prepare(`
    UPDATE projects SET
      name = COALESCE(?, name),
      slug = COALESCE(?, slug),
      category = COALESCE(?, category),
      tagline = COALESCE(?, tagline),
      description = COALESCE(?, description),
      case_study = COALESCE(?, case_study),
      technologies_json = ?,
      image_url = COALESCE(?, image_url),
      screenshots_json = ?,
      live_url = COALESCE(?, live_url),
      github_url = COALESCE(?, github_url),
      completion_date = COALESCE(?, completion_date),
      is_featured = COALESCE(?, is_featured),
      is_demo_concept = COALESCE(?, is_demo_concept),
      sort_order = COALESCE(?, sort_order)
    WHERE id = ?
  `).run(
    name,
    slug,
    category,
    tagline,
    description,
    case_study,
    techJson,
    image_url,
    screenshotsJson,
    live_url,
    github_url,
    completion_date,
    is_featured !== undefined ? Number(is_featured) : null,
    is_demo_concept !== undefined ? Number(is_demo_concept) : null,
    sort_order !== undefined ? Number(sort_order) : null,
    id
  );

  if (info.changes === 0) {
    return res.status(404).json({ error: 'Project not found.' });
  }

  res.json({ message: 'Project updated successfully.' });
});

router.delete('/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const info = db.prepare('DELETE FROM projects WHERE id = ?').run(id);
  if (info.changes === 0) {
    return res.status(404).json({ error: 'Project not found.' });
  }
  res.json({ message: 'Project deleted successfully.' });
});

export default router;
