import express from 'express';
import { db } from '../db.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', (req, res) => {
  const company = db.prepare('SELECT * FROM company_info LIMIT 1').get();
  if (!company) {
    return res.status(404).json({ error: 'Company details not configured.' });
  }

  let values = [];
  try {
    values = JSON.parse(company.values_json || '[]');
  } catch (e) {
    values = [];
  }

  res.json({
    ...company,
    values
  });
});

router.put('/', requireAdmin, (req, res) => {
  const {
    business_name,
    founder_name,
    tagline,
    business_type,
    location,
    target_market,
    email,
    phone,
    whatsapp,
    website,
    instagram,
    linkedin,
    about_intro,
    mission,
    vision,
    values
  } = req.body;

  if (!business_name || !founder_name || !tagline || !email || !phone) {
    return res.status(400).json({ error: 'Essential business fields are required.' });
  }

  const valuesJson = typeof values === 'string' ? values : JSON.stringify(values || []);
  const now = new Date().toISOString();

  const company = db.prepare('SELECT id FROM company_info LIMIT 1').get();
  if (company) {
    db.prepare(`
      UPDATE company_info SET
        business_name = ?,
        founder_name = ?,
        tagline = ?,
        business_type = ?,
        location = ?,
        target_market = ?,
        email = ?,
        phone = ?,
        whatsapp = ?,
        website = ?,
        instagram = ?,
        linkedin = ?,
        about_intro = ?,
        mission = ?,
        vision = ?,
        values_json = ?,
        updated_at = ?
      WHERE id = ?
    `).run(
      business_name,
      founder_name,
      tagline,
      business_type,
      location,
      target_market,
      email,
      phone,
      whatsapp,
      website,
      instagram,
      linkedin,
      about_intro,
      mission,
      vision,
      valuesJson,
      now,
      company.id
    );
  } else {
    db.prepare(`
      INSERT INTO company_info (
        business_name, founder_name, tagline, business_type, location, target_market,
        email, phone, whatsapp, website, instagram, linkedin, about_intro, mission, vision, values_json, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      business_name,
      founder_name,
      tagline,
      business_type,
      location,
      target_market,
      email,
      phone,
      whatsapp,
      website,
      instagram,
      linkedin,
      about_intro,
      mission,
      vision,
      valuesJson,
      now
    );
  }

  res.json({ message: 'Company information updated successfully.' });
});

export default router;
