import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

import { initDatabase, db } from './db.js';
import authRoutes from './routes/auth.js';
import companyRoutes from './routes/company.js';
import founderRoutes from './routes/founder.js';
import servicesRoutes from './routes/services.js';
import skillsRoutes from './routes/skills.js';
import projectsRoutes from './routes/projects.js';
import achievementsRoutes from './routes/achievements.js';
import reviewsRoutes from './routes/reviews.js';
import enquiriesRoutes from './routes/enquiries.js';
import settingsRoutes from './routes/settings.js';
import uploadRoutes from './routes/uploads.js';
import seoRoutes from './routes/seo.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize SQLite database
initDatabase();

const app = express();
const PORT = process.env.PORT || 5000;

// Security hardening
app.disable('x-powered-by');

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Dynamic CORS configuration (supports custom production domains, preview URLs, or all origins)
const corsOriginSetting = process.env.CORS_ORIGIN;
const corsOptions = {
  origin: corsOriginSetting
    ? (corsOriginSetting.includes(',') ? corsOriginSetting.split(',').map(s => s.trim()) : corsOriginSetting)
    : '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads directory (supports persistent volume mounts)
const uploadsDir = process.env.UPLOADS_DIR || path.resolve(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// SEO routes (sitemap.xml and robots.txt)
app.use('/', seoRoutes);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/founder', founderRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/achievements', achievementsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/enquiries', enquiriesRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);

// Health check with active SQLite database readiness probe
app.get('/api/health', (req, res) => {
  let dbStatus = 'disconnected';
  try {
    const result = db.prepare('SELECT 1 as ok').get();
    if (result && result.ok === 1) {
      dbStatus = 'connected';
    }
  } catch (err) {
    dbStatus = 'error';
  }

  const isHealthy = dbStatus === 'connected';
  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'healthy' : 'degraded',
    service: 'PIVO TECH API',
    business: 'PIVO TECH',
    tagline: 'Build. Grow. Automate.',
    database: dbStatus,
    uptime_seconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// Production client serving (for unified deployments)
const clientDistPath = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Production error handling middleware
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  const isProd = process.env.NODE_ENV === 'production';
  res.status(err.status || 500).json({
    error: isProd && !err.status ? 'Internal Server Error' : (err.message || 'Internal Server Error')
  });
});

const server = app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`  PIVO TECH Server running on port ${PORT}`);
  console.log(`  Tagline: Build. Grow. Automate.`);
  console.log(`  Location: Theni, Tamil Nadu, India.`);
  console.log(`  API Base: http://localhost:${PORT}/api`);
  console.log(`===============================================`);
});

// Graceful shutdown handling for container and server restarts (Render / Docker)
function gracefulShutdown(signal) {
  console.log(`[Server] Received ${signal}. Initiating graceful shutdown...`);
  server.close(() => {
    console.log('[Server] HTTP server closed.');
    try {
      db.close();
      console.log('[Database] SQLite database connection closed.');
    } catch (e) {
      console.error('[Database] Error closing SQLite connection:', e);
    }
    process.exit(0);
  });

  setTimeout(() => {
    console.error('[Server] Forceful shutdown initiated after timeout.');
    process.exit(1);
  }, 10000).unref();
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
