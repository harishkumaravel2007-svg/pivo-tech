import express from 'express';
import { db } from '../db.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', (req, res) => {
  const founder = db.prepare('SELECT * FROM founder_info LIMIT 1').get();
  if (!founder) {
    return res.status(404).json({ error: 'Founder profile not found.' });
  }

  let areas_of_expertise = [];
  try {
    areas_of_expertise = JSON.parse(founder.areas_of_expertise_json || '[]');
  } catch (e) {
    areas_of_expertise = [];
  }

  res.json({
    ...founder,
    areas_of_expertise
  });
});

router.put('/', requireAdmin, (req, res) => {
  const {
    name,
    designation,
    company,
    tagline,
    location,
    bio,
    photo_url,
    vision,
    linkedin,
    instagram,
    email,
    phone,
    areas_of_expertise
  } = req.body;

  if (!name || !designation || !bio) {
    return res.status(400).json({ error: 'Founder name, designation, and bio are required.' });
  }

  const expertiseJson = typeof areas_of_expertise === 'string'
    ? areas_of_expertise
    : JSON.stringify(areas_of_expertise || []);
  const now = new Date().toISOString();

  const founder = db.prepare('SELECT id FROM founder_info LIMIT 1').get();
  if (founder) {
    db.prepare(`
      UPDATE founder_info SET
        name = ?,
        designation = ?,
        company = ?,
        tagline = ?,
        location = ?,
        bio = ?,
        photo_url = ?,
        vision = ?,
        linkedin = ?,
        instagram = ?,
        email = ?,
        phone = ?,
        areas_of_expertise_json = ?,
        updated_at = ?
      WHERE id = ?
    `).run(
      name,
      designation,
      company || 'PIVO TECH',
      tagline || 'Build. Grow. Automate.',
      location || 'Theni, Tamil Nadu, India',
      bio,
      photo_url || null,
      vision || '',
      linkedin || 'https://www.linkedin.com/in/harish-k-303480301/',
      instagram || 'https://www.instagram.com/_pivo.tech/',
      email || 'harishkumaravel2007@gmail.com',
      phone || '+91 99442 45043',
      expertiseJson,
      now,
      founder.id
    );
  } else {
    db.prepare(`
      INSERT INTO founder_info (
        name, designation, company, tagline, location, bio, photo_url, vision,
        linkedin, instagram, email, phone, areas_of_expertise_json, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      name,
      designation,
      company || 'PIVO TECH',
      tagline || 'Build. Grow. Automate.',
      location || 'Theni, Tamil Nadu, India',
      bio,
      photo_url || null,
      vision || '',
      linkedin || 'https://www.linkedin.com/in/harish-k-303480301/',
      instagram || 'https://www.instagram.com/_pivo.tech/',
      email || 'harishkumaravel2007@gmail.com',
      phone || '+91 99442 45043',
      expertiseJson,
      now
    );
  }

  res.json({ message: 'Founder profile updated successfully.' });
});

export default router;
