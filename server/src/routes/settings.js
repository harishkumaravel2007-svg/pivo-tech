import express from 'express';
import { db } from '../db.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT key, value, description FROM settings').all();
  const settingsObj = {};
  for (const r of rows) {
    settingsObj[r.key] = r.value;
  }
  res.json({ settings: settingsObj });
});

router.put('/', requireAdmin, (req, res) => {
  const settings = req.body; // Key-value map

  const updateStmt = db.prepare(`
    INSERT INTO settings (key, value)
    VALUES (?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `);

  for (const [k, v] of Object.entries(settings)) {
    updateStmt.run(k, String(v));
  }

  res.json({ message: 'Website settings updated successfully.' });
});

export default router;
