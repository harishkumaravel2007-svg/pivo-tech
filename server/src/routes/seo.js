import express from 'express';
import { db } from '../db.js';

const router = express.Router();

router.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/admin/

Sitemap: https://pivotech.in/sitemap.xml
`);
});

router.get('/sitemap.xml', (req, res) => {
  const baseUrl = 'https://pivotech.in';
  const now = new Date().toISOString().split('T')[0];

  const staticRoutes = [
    { loc: '/', priority: '1.0', changefreq: 'weekly' },
    { loc: '/about', priority: '0.8', changefreq: 'monthly' },
    { loc: '/founder', priority: '0.8', changefreq: 'monthly' },
    { loc: '/services', priority: '0.9', changefreq: 'weekly' },
    { loc: '/portfolio', priority: '0.9', changefreq: 'weekly' },
    { loc: '/reviews', priority: '0.8', changefreq: 'weekly' },
    { loc: '/contact', priority: '0.9', changefreq: 'monthly' },
  ];

  const projects = db.prepare('SELECT slug, completion_date FROM projects').all();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  for (const route of staticRoutes) {
    xml += `  <url>
    <loc>${baseUrl}${route.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>
`;
  }

  for (const p of projects) {
    xml += `  <url>
    <loc>${baseUrl}/portfolio/${p.slug}</loc>
    <lastmod>${p.completion_date || now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
  }

  xml += `</urlset>`;

  res.type('application/xml');
  res.send(xml);
});

export default router;
