import express from 'express';
import { db } from '../db.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', (req, res) => {
  const skills = db.prepare('SELECT * FROM skills WHERE is_active = 1 ORDER BY sort_order ASC, id ASC').all();
  res.json({ skills });
});

router.get('/all', requireAdmin, (req, res) => {
  const skills = db.prepare('SELECT * FROM skills ORDER BY sort_order ASC, id ASC').all();
  res.json({ skills });
});

router.post('/', requireAdmin, (req, res) => {
  const { category, name, level_description, icon_name, sort_order } = req.body;

  if (!category || !name) {
    return res.status(400).json({ error: 'Category and skill name are required.' });
  }

  const info = db.prepare(`
    INSERT INTO skills (category, name, level_description, icon_name, sort_order)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    category,
    name,
    level_description || 'Technology Area',
    icon_name || 'Code2',
    Number(sort_order) || 0
  );

  res.status(201).json({ message: 'Skill created successfully.', id: info.lastInsertRowid });
});

router.put('/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { category, name, level_description, icon_name, sort_order, is_active } = req.body;

  const info = db.prepare(`
    UPDATE skills SET
      category = COALESCE(?, category),
      name = COALESCE(?, name),
      level_description = COALESCE(?, level_description),
      icon_name = COALESCE(?, icon_name),
      sort_order = COALESCE(?, sort_order),
      is_active = COALESCE(?, is_active)
    WHERE id = ?
  `).run(
    category,
    name,
    level_description,
    icon_name,
    sort_order !== undefined ? Number(sort_order) : null,
    is_active !== undefined ? Number(is_active) : null,
    id
  );

  if (info.changes === 0) {
    return res.status(404).json({ error: 'Skill not found.' });
  }

  res.json({ message: 'Skill updated successfully.' });
});

router.delete('/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const info = db.prepare('DELETE FROM skills WHERE id = ?').run(id);
  if (info.changes === 0) {
    return res.status(404).json({ error: 'Skill not found.' });
  }
  res.json({ message: 'Skill deleted successfully.' });
});

export default router;
