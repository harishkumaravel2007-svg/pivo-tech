import express from 'express';
import { db } from '../db.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', (req, res) => {
  const services = db.prepare('SELECT * FROM services WHERE is_active = 1 ORDER BY sort_order ASC, id ASC').all();
  const parsed = services.map(s => ({
    ...s,
    features: JSON.parse(s.features_json || '[]'),
    benefits: JSON.parse(s.benefits_json || '[]'),
    images: JSON.parse(s.images_json || '[]')
  }));
  res.json({ services: parsed });
});

router.get('/all', requireAdmin, (req, res) => {
  const services = db.prepare('SELECT * FROM services ORDER BY sort_order ASC, id ASC').all();
  const parsed = services.map(s => ({
    ...s,
    features: JSON.parse(s.features_json || '[]'),
    benefits: JSON.parse(s.benefits_json || '[]'),
    images: JSON.parse(s.images_json || '[]')
  }));
  res.json({ services: parsed });
});

router.post('/', requireAdmin, (req, res) => {
  const { slug, category, title, summary, description, features, benefits, icon_name, sort_order } = req.body;

  if (!title || !category || !summary || !description) {
    return res.status(400).json({ error: 'Title, category, summary, and description are required.' });
  }

  const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const featuresJson = typeof features === 'string' ? features : JSON.stringify(features || []);
  const benefitsJson = typeof benefits === 'string' ? benefits : JSON.stringify(benefits || []);
  const now = new Date().toISOString();

  try {
    const info = db.prepare(`
      INSERT INTO services (slug, category, title, summary, description, features_json, benefits_json, icon_name, sort_order, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      finalSlug,
      category,
      title,
      summary,
      description,
      featuresJson,
      benefitsJson,
      icon_name || 'Layers',
      Number(sort_order) || 0,
      now
    );

    res.status(201).json({ message: 'Service created successfully.', id: info.lastInsertRowid });
  } catch (err) {
    if (err.message && err.message.includes('UNIQUE')) {
      return res.status(400).json({ error: 'A service with this slug already exists.' });
    }
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { slug, category, title, summary, description, features, benefits, icon_name, sort_order, is_active } = req.body;

  const featuresJson = typeof features === 'string' ? features : JSON.stringify(features || []);
  const benefitsJson = typeof benefits === 'string' ? benefits : JSON.stringify(benefits || []);

  const info = db.prepare(`
    UPDATE services SET
      slug = COALESCE(?, slug),
      category = COALESCE(?, category),
      title = COALESCE(?, title),
      summary = COALESCE(?, summary),
      description = COALESCE(?, description),
      features_json = ?,
      benefits_json = ?,
      icon_name = COALESCE(?, icon_name),
      sort_order = COALESCE(?, sort_order),
      is_active = COALESCE(?, is_active)
    WHERE id = ?
  `).run(
    slug,
    category,
    title,
    summary,
    description,
    featuresJson,
    benefitsJson,
    icon_name,
    sort_order !== undefined ? Number(sort_order) : null,
    is_active !== undefined ? Number(is_active) : null,
    id
  );

  if (info.changes === 0) {
    return res.status(404).json({ error: 'Service not found.' });
  }

  res.json({ message: 'Service updated successfully.' });
});

router.delete('/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const info = db.prepare('DELETE FROM services WHERE id = ?').run(id);
  if (info.changes === 0) {
    return res.status(404).json({ error: 'Service not found.' });
  }
  res.json({ message: 'Service deleted successfully.' });
});

export default router;
