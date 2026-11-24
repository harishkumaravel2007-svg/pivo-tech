import express from 'express';
import { db } from '../db.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', (req, res) => {
  const achievements = db.prepare('SELECT * FROM achievements ORDER BY sort_order ASC, id DESC').all();
  res.json({ achievements });
});

router.post('/', requireAdmin, (req, res) => {
  const { title, category, description, issuer_or_organization, date_awarded, document_url, sort_order } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required.' });
  }

  const now = new Date().toISOString();
  const info = db.prepare(`
    INSERT INTO achievements (title, category, description, issuer_or_organization, date_awarded, document_url, sort_order, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    title,
    category || 'Recognition',
    description,
    issuer_or_organization || '',
    date_awarded || '',
    document_url || '',
    Number(sort_order) || 0,
    now
  );

  res.status(201).json({ message: 'Achievement created successfully.', id: info.lastInsertRowid });
});

router.put('/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { title, category, description, issuer_or_organization, date_awarded, document_url, sort_order } = req.body;

  const info = db.prepare(`
    UPDATE achievements SET
      title = COALESCE(?, title),
      category = COALESCE(?, category),
      description = COALESCE(?, description),
      issuer_or_organization = COALESCE(?, issuer_or_organization),
      date_awarded = COALESCE(?, date_awarded),
      document_url = COALESCE(?, document_url),
      sort_order = COALESCE(?, sort_order)
    WHERE id = ?
  `).run(
    title,
    category,
    description,
    issuer_or_organization,
    date_awarded,
    document_url,
    sort_order !== undefined ? Number(sort_order) : null,
    id
  );

  if (info.changes === 0) {
    return res.status(404).json({ error: 'Achievement not found.' });
  }

  res.json({ message: 'Achievement updated successfully.' });
});

router.delete('/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const info = db.prepare('DELETE FROM achievements WHERE id = ?').run(id);
  if (info.changes === 0) {
    return res.status(404).json({ error: 'Achievement not found.' });
  }
  res.json({ message: 'Achievement deleted successfully.' });
});

export default router;
