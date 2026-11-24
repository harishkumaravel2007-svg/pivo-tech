import express from 'express';
import { db } from '../db.js';
import { comparePassword, hashPassword, generateToken } from '../auth.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Check if initial admin has been created
router.get('/setup-status', (req, res) => {
  const adminCount = db.prepare('SELECT COUNT(*) as count FROM admin_users').get().count;
  res.json({ isSetup: adminCount > 0 });
});

// Force secure initial admin setup (disabled once an admin exists)
router.post('/setup', (req, res) => {
  const adminCount = db.prepare('SELECT COUNT(*) as count FROM admin_users').get().count;
  if (adminCount > 0) {
    return res.status(403).json({ error: 'Administrative setup has already been completed. Please log in.' });
  }

  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ error: 'Username, password, and email are required.' });
  }

  if (username.trim().length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters long.' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long for production security.' });
  }

  const hash = hashPassword(password);
  const now = new Date().toISOString();

  const info = db.prepare(`
    INSERT INTO admin_users (username, password_hash, email, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(username.trim(), hash, email.trim().toLowerCase(), now, now);

  const token = generateToken({
    id: info.lastInsertRowid,
    username: username.trim(),
    email: email.trim().toLowerCase()
  });

  return res.status(201).json({
    message: 'Initial administrator account created securely.',
    token,
    user: {
      id: info.lastInsertRowid,
      username: username.trim(),
      email: email.trim().toLowerCase()
    }
  });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const user = db.prepare('SELECT * FROM admin_users WHERE username = ?').get(username);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials. Access denied.' });
  }

  const isMatch = comparePassword(password, user.password_hash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid credentials. Access denied.' });
  }

  const token = generateToken({
    id: user.id,
    username: user.username,
    email: user.email
  });

  return res.json({
    message: 'Authentication successful.',
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email
    }
  });
});

router.get('/me', requireAdmin, (req, res) => {
  const user = db.prepare('SELECT id, username, email, created_at FROM admin_users WHERE id = ?').get(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }
  return res.json({ user });
});

router.post('/change-password', requireAdmin, (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current password and new password are required.' });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters long.' });
  }

  const user = db.prepare('SELECT * FROM admin_users WHERE id = ?').get(req.user.id);
  if (!user || !comparePassword(currentPassword, user.password_hash)) {
    return res.status(400).json({ error: 'Current password is incorrect.' });
  }

  const newHash = hashPassword(newPassword);
  const now = new Date().toISOString();

  db.prepare('UPDATE admin_users SET password_hash = ?, updated_at = ? WHERE id = ?').run(newHash, now, user.id);

  return res.json({ message: 'Password updated successfully.' });
});

export default router;
