import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = process.env.DATA_DIR || path.resolve(__dirname, '../data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'pivotech.db');
export const db = new DatabaseSync(DB_PATH);

// Initialize Tables and default records
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      email TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS company_info (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      business_name TEXT NOT NULL,
      founder_name TEXT NOT NULL,
      tagline TEXT NOT NULL,
      business_type TEXT NOT NULL,
      location TEXT NOT NULL,
      target_market TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      whatsapp TEXT NOT NULL,
      website TEXT,
      instagram TEXT,
      linkedin TEXT,
      about_intro TEXT NOT NULL,
      mission TEXT NOT NULL,
      vision TEXT NOT NULL,
      values_json TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS founder_info (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      designation TEXT NOT NULL,
      company TEXT NOT NULL,
      location TEXT NOT NULL,
      bio TEXT NOT NULL,
      photo_url TEXT,
      vision TEXT NOT NULL,
      linkedin TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      areas_of_expertise_json TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      category TEXT NOT NULL,
      title TEXT NOT NULL,
      summary TEXT NOT NULL,
      description TEXT NOT NULL,
      features_json TEXT NOT NULL,
      benefits_json TEXT NOT NULL,
      icon_name TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      name TEXT NOT NULL,
      level_description TEXT,
      icon_name TEXT,
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      category TEXT NOT NULL,
      tagline TEXT NOT NULL,
      description TEXT NOT NULL,
      case_study TEXT,
      technologies_json TEXT NOT NULL,
      image_url TEXT NOT NULL,
      screenshots_json TEXT DEFAULT '[]',
      live_url TEXT,
      github_url TEXT,
      completion_date TEXT,
      is_featured INTEGER DEFAULT 0,
      is_demo_concept INTEGER DEFAULT 0,
      sort_order INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS achievements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      issuer_or_organization TEXT,
      date_awarded TEXT,
      document_url TEXT,
      sort_order INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reviewer_name TEXT NOT NULL,
      business_name TEXT,
      business_logo_url TEXT,
      location TEXT,
      project_name TEXT,
      project_description TEXT,
      rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
      review_text TEXT NOT NULL,
      website_url TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      is_visible INTEGER DEFAULT 1,
      is_verified INTEGER DEFAULT 0,
      founder_response TEXT,
      founder_responded_at TEXT,
      approved_at TEXT,
      client_ip TEXT,
      created_by TEXT DEFAULT 'client',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS enquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      business_name TEXT,
      service_required TEXT NOT NULL,
      project_budget TEXT,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new',
      notes TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      description TEXT
    );
  `);

  // Ensure reviews table has all Client Showcase & Founder Response columns
  const reviewColumns = db.prepare("PRAGMA table_info(reviews)").all().map(c => c.name);
  if (!reviewColumns.includes('review_id')) db.exec("ALTER TABLE reviews ADD COLUMN review_id TEXT");
  if (!reviewColumns.includes('project_id')) db.exec("ALTER TABLE reviews ADD COLUMN project_id INTEGER");
  if (!reviewColumns.includes('business_logo_url')) db.exec("ALTER TABLE reviews ADD COLUMN business_logo_url TEXT");
  if (!reviewColumns.includes('location')) db.exec("ALTER TABLE reviews ADD COLUMN location TEXT");
  if (!reviewColumns.includes('project_name')) db.exec("ALTER TABLE reviews ADD COLUMN project_name TEXT");
  if (!reviewColumns.includes('project_description')) db.exec("ALTER TABLE reviews ADD COLUMN project_description TEXT");
  if (!reviewColumns.includes('website_url')) db.exec("ALTER TABLE reviews ADD COLUMN website_url TEXT");
  if (!reviewColumns.includes('is_visible')) db.exec("ALTER TABLE reviews ADD COLUMN is_visible INTEGER DEFAULT 1");
  if (!reviewColumns.includes('founder_response')) db.exec("ALTER TABLE reviews ADD COLUMN founder_response TEXT");
  if (!reviewColumns.includes('founder_responded_at')) db.exec("ALTER TABLE reviews ADD COLUMN founder_responded_at TEXT");
  if (!reviewColumns.includes('approved_at')) db.exec("ALTER TABLE reviews ADD COLUMN approved_at TEXT");
  if (!reviewColumns.includes('created_by')) db.exec("ALTER TABLE reviews ADD COLUMN created_by TEXT DEFAULT 'client'");

  // Ensure projects table has all Portfolio Management columns
  const projectColumns = db.prepare("PRAGMA table_info(projects)").all().map(c => c.name);
  if (!projectColumns.includes('client_name')) db.exec("ALTER TABLE projects ADD COLUMN client_name TEXT");
  if (!projectColumns.includes('features_json')) db.exec("ALTER TABLE projects ADD COLUMN features_json TEXT DEFAULT '[]'");
  if (!projectColumns.includes('status')) db.exec("ALTER TABLE projects ADD COLUMN status TEXT DEFAULT 'published'");
  if (!projectColumns.includes('is_published')) db.exec("ALTER TABLE projects ADD COLUMN is_published INTEGER DEFAULT 1");
  if (!projectColumns.includes('updated_at')) db.exec("ALTER TABLE projects ADD COLUMN updated_at TEXT");

  // Ensure founder_info has tagline & instagram columns
  const founderColumns = db.prepare("PRAGMA table_info(founder_info)").all().map(c => c.name);
  if (!founderColumns.includes('tagline')) db.exec("ALTER TABLE founder_info ADD COLUMN tagline TEXT DEFAULT 'Build. Grow. Automate.'");
  if (!founderColumns.includes('instagram')) db.exec("ALTER TABLE founder_info ADD COLUMN instagram TEXT DEFAULT 'https://www.instagram.com/_pivo.tech/'");

  // Ensure enquiries table has all Client Lead Management columns
  const enquiryColumns = db.prepare("PRAGMA table_info(enquiries)").all().map(c => c.name);
  if (!enquiryColumns.includes('lead_id')) db.exec("ALTER TABLE enquiries ADD COLUMN lead_id TEXT");
  if (!enquiryColumns.includes('city')) db.exec("ALTER TABLE enquiries ADD COLUMN city TEXT");
  if (!enquiryColumns.includes('country')) db.exec("ALTER TABLE enquiries ADD COLUMN country TEXT");
  if (!enquiryColumns.includes('preferred_contact')) db.exec("ALTER TABLE enquiries ADD COLUMN preferred_contact TEXT DEFAULT 'whatsapp'");
  if (!enquiryColumns.includes('updated_at')) db.exec("ALTER TABLE enquiries ADD COLUMN updated_at TEXT");

  // Performance, relationship, and query indexes
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
    CREATE INDEX IF NOT EXISTS idx_reviews_project_id ON reviews(project_id);
    CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
    CREATE INDEX IF NOT EXISTS idx_projects_is_published ON projects(is_published);
    CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
    CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
  `);

  // Backfill existing reviews & projects relationships
  db.exec(`
    UPDATE reviews SET review_id = 'PIVO-REV-' || id WHERE review_id IS NULL;
    UPDATE projects SET status = 'published' WHERE status IS NULL;
    UPDATE projects SET is_published = 1 WHERE is_published IS NULL;
    UPDATE projects SET updated_at = created_at WHERE updated_at IS NULL;
    UPDATE projects SET client_name = 'Sri Balaji Stationery' WHERE slug = 'sri-balaji-stationery' AND (client_name IS NULL OR client_name = '');
    UPDATE projects SET features_json = '["Digital Retail Catalogue","Direct WhatsApp Orders","Store Navigation & Map","Mobile-Optimized Fast UI"]' WHERE slug = 'sri-balaji-stationery' AND (features_json IS NULL OR features_json = '[]');
    UPDATE reviews SET project_id = (SELECT id FROM projects WHERE slug = 'sri-balaji-stationery' LIMIT 1) WHERE (business_name LIKE '%Sri Balaji%' OR reviewer_name LIKE '%Balaji%') AND project_id IS NULL;
  `);

  // Admin users table exists. No default or hardcoded credentials are seeded.
  // Initial admin setup is performed securely via the /admin/setup interface or setup API.

  // Seed company info if empty
  const companyCheck = db.prepare('SELECT COUNT(*) as count FROM company_info').get();
  if (companyCheck.count === 0) {
    const now = new Date().toISOString();
    const values = JSON.stringify([
      { title: "Innovation", desc: "Embracing modern technology, AI workflows, and contemporary design principles." },
      { title: "Quality", desc: "Delivering performant, maintainable, and pixel-perfect digital solutions." },
      { title: "Transparency", desc: "Honest timelines, clear communication, and no hidden agendas or fake metrics." },
      { title: "Creativity", desc: "Original, functional solutions custom-tailored to each brand's specific market." },
      { title: "Reliability", desc: "Robust engineering with rock-solid uptime, security, and continuous support." },
      { title: "Customer Satisfaction", desc: "Prioritizing actual business outcomes, client growth, and long-term value." }
    ]);

    db.prepare(`
      INSERT INTO company_info (
        business_name, founder_name, tagline, business_type, location, target_market,
        email, phone, whatsapp, website, instagram, linkedin, about_intro, mission, vision, values_json, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'PIVO TECH',
      'Harish K',
      'Build. Grow. Automate.',
      'Digital Technology & IT Solutions Agency',
      'Theni, Tamil Nadu, India.',
      'India and International',
      'harishkumaravel2007@gmail.com',
      '+91 99442 45043',
      '+91 99442 45043',
      'https://pivotech.in',
      'https://www.instagram.com/_pivo.tech/',
      'https://www.linkedin.com/in/harish-k-303480301/',
      'PIVO TECH is a technology-focused digital solutions business founded by Harish K in Theni, Tamil Nadu, India. We focus on helping startups, entrepreneurs and businesses build their digital presence, improve customer engagement and simplify operations using modern technology.',
      'Our mission is to deliver practical, reliable and scalable digital solutions.',
      'To become a trusted digital technology partner for businesses across India and international markets.',
      values,
      now
    );
  }

  // Seed founder info if empty
  const founderCheck = db.prepare('SELECT COUNT(*) as count FROM founder_info').get();
  if (founderCheck.count === 0) {
    const now = new Date().toISOString();
    const expertise = JSON.stringify([
      "Full-Stack Web Development & Modern Architecture",
      "Tailwind CSS & Component-Driven UI Engineering",
      "Artificial Intelligence & LLM API Integration",
      "Autonomous Agent Workflows & Chatbot Systems",
      "Business Workflow Automation & Operations Optimization",
      "Database Modeling & Secure REST API Design"
    ]);

    db.prepare(`
      INSERT INTO founder_info (
        name, designation, company, tagline, location, bio, photo_url, vision,
        linkedin, instagram, email, phone, areas_of_expertise_json, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'Harish K',
      'Founder & CEO',
      'PIVO TECH',
      'Build. Grow. Automate.',
      'Theni, Tamil Nadu, India',
      "Hello, I'm Harish K, Founder & CEO of PIVO TECH. I focus on building modern websites, digital growth solutions, AI-powered agents and business automation systems. My goal is to help businesses establish a strong digital presence, improve productivity and grow through practical technology solutions.",
      '/assets/harish-founder.jpg',
      'To build a world-class technology firm rooted in integrity, delivering tangible digital leverage to startups, enterprises, and local businesses alike.',
      'https://www.linkedin.com/in/harish-k-303480301/',
      'https://www.instagram.com/_pivo.tech/',
      'harishkumaravel2007@gmail.com',
      '+91 99442 45043',
      expertise,
      now
    );
  }

  // Seed services if empty
  const servicesCheck = db.prepare('SELECT COUNT(*) as count FROM services').get();
  if (servicesCheck.count === 0) {
    const now = new Date().toISOString();
    const servicesData = [
      {
        slug: 'website-development',
        category: 'Website Development',
        title: 'Website Development',
        summary: 'Bespoke, high-performance web platforms engineered with modern stacks for maximum conversion, speed, and responsiveness.',
        description: 'From corporate business portals and high-converting landing pages to dynamic e-commerce platforms and progressive web applications, we engineer digital experiences that engage visitors and elevate brand credibility.',
        features_json: JSON.stringify([
          "Business websites & corporate digital hubs",
          "High-converting landing pages & campaign microsites",
          "E-commerce websites with frictionless checkout",
          "Founder & executive portfolio showcases",
          "Responsive, mobile-first web applications",
          "Comprehensive website maintenance & performance tuning"
        ]),
        benefits_json: JSON.stringify([
          "Blazing fast loading speeds & Google Core Web Vitals optimization",
          "Pixel-perfect responsive design across all devices and screen sizes",
          "Clean, maintainable codebase ready for long-term scalability",
          "High conversion UX designed to turn visitors into qualified leads"
        ]),
        icon_name: 'Globe',
        sort_order: 1
      },
      {
        slug: 'digital-marketing',
        category: 'Digital Marketing',
        title: 'Digital Marketing',
        summary: 'Targeted digital campaigns, strategic brand positioning, and social presence designed to reach and convert your target audience.',
        description: 'Establish a dominant presence across relevant digital channels. We craft comprehensive marketing strategies, social media presence, and content frameworks that generate genuine engagement and business growth.',
        features_json: JSON.stringify([
          "Social media marketing strategy & execution",
          "Digital brand presence & identity alignment",
          "Targeted marketing campaigns & lead funnels",
          "Content strategy & visual asset planning",
          "Online business promotion & visibility optimization"
        ]),
        benefits_json: JSON.stringify([
          "Targeted reach to potential clients in India and overseas",
          "Cohesive brand messaging across all digital touchpoints",
          "Measurable engagement and actionable audience insights",
          "Sustainable organic and promotional lead acquisition"
        ]),
        icon_name: 'TrendingUp',
        sort_order: 2
      },
      {
        slug: 'ai-agent-development',
        category: 'AI Agent Development',
        title: 'AI Agent Development',
        summary: 'Smart, autonomous AI agents and conversational assistants integrated seamlessly into your operational workflows.',
        description: 'Harness state-of-the-art Large Language Models and intelligent agents. We architect customized AI assistants, 24/7 customer support agents, and AI-powered workflows that eliminate repetitive friction and accelerate productivity.',
        features_json: JSON.stringify([
          "Intelligent AI chatbots with domain knowledge",
          "Business AI assistants trained on your operational data",
          "24/7 automated customer support & triage",
          "AI-powered workflows & document processing",
          "Custom AI integrations via Gemini & OpenAI APIs"
        ]),
        benefits_json: JSON.stringify([
          "Instant, accurate responses to customer queries around the clock",
          "Significant reduction in manual customer support overhead",
          "Intelligent data extraction and business task automation",
          "Cutting-edge competitive edge for your business operations"
        ]),
        icon_name: 'Cpu',
        sort_order: 3
      },
      {
        slug: 'business-automation',
        category: 'Business Automation',
        title: 'Business Automation',
        summary: 'End-to-end workflow automation, lead routing, and process refinement that allows your business to scale effortlessly.',
        description: 'Eliminate manual bottlenecks. We build automated bridges between your forms, databases, CRM, email, and messaging platforms so your team focuses on growth while systems handle repetitive administration.',
        features_json: JSON.stringify([
          "End-to-end workflow automation & system hooks",
          "Automated lead management & CRM dispatch",
          "Customer enquiry automation & auto-responders",
          "Business process improvement & digital transformation",
          "Custom automation architectures for specific business operations"
        ]),
        benefits_json: JSON.stringify([
          "Zero lost leads with instant automated notifications and routing",
          "Dramatically reduced human error in data handling",
          "Freed up team bandwidth for strategic and creative tasks",
          "Seamless sync across internal business applications"
        ]),
        icon_name: 'Zap',
        sort_order: 4
      }
    ];

    const insertService = db.prepare(`
      INSERT INTO services (slug, category, title, summary, description, features_json, benefits_json, icon_name, sort_order, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const s of servicesData) {
      insertService.run(s.slug, s.category, s.title, s.summary, s.description, s.features_json, s.benefits_json, s.icon_name, s.sort_order, now);
    }
  }

  // Seed skills if empty
  const skillsCheck = db.prepare('SELECT COUNT(*) as count FROM skills').get();
  if (skillsCheck.count === 0) {
    const skillsData = [
      // Website Development
      { category: 'Website Development', name: 'HTML5', level_description: 'Modern Semantic Architecture', icon_name: 'Code2', sort_order: 1 },
      { category: 'Website Development', name: 'CSS3', level_description: 'Modern Styling & CSS Variables', icon_name: 'Palette', sort_order: 2 },
      { category: 'Website Development', name: 'JavaScript', level_description: 'ES6+ Modern JavaScript', icon_name: 'FileCode', sort_order: 3 },
      { category: 'Website Development', name: 'TypeScript', level_description: 'Type-Safe Application Code', icon_name: 'ShieldCheck', sort_order: 4 },
      { category: 'Website Development', name: 'React.js', level_description: 'Component-Driven UI Engineering', icon_name: 'Layers', sort_order: 5 },
      { category: 'Website Development', name: 'Responsive Web Design', level_description: 'Mobile-First Clean Layouts', icon_name: 'Smartphone', sort_order: 6 },
      { category: 'Website Development', name: 'Tailwind CSS', level_description: 'Utility-First Modern Styling', icon_name: 'Sparkles', sort_order: 7 },
      { category: 'Website Development', name: 'UI/UX Design', level_description: 'Clean Corporate Interface Systems', icon_name: 'Layout', sort_order: 8 },

      // Backend & Database
      { category: 'Backend & Database', name: 'Node.js', level_description: 'High-Performance Event-Driven Server', icon_name: 'Server', sort_order: 1 },
      { category: 'Backend & Database', name: 'REST APIs', level_description: 'Robust & Secure Endpoint Architecture', icon_name: 'Network', sort_order: 2 },
      { category: 'Backend & Database', name: 'Fastify', level_description: 'Low-Overhead Web Framework', icon_name: 'Zap', sort_order: 3 },
      { category: 'Backend & Database', name: 'SQLite', level_description: 'Embedded ACID Compliant Relational DB', icon_name: 'Database', sort_order: 4 },
      { category: 'Backend & Database', name: 'MongoDB', level_description: 'Scalable Document Storage', icon_name: 'HardDrive', sort_order: 5 },

      // AI & Automation
      { category: 'AI & Automation', name: 'AI Integration', level_description: 'Custom AI Models in Web Applications', icon_name: 'Cpu', sort_order: 1 },
      { category: 'AI & Automation', name: 'Gemini API', level_description: 'Multimodal LLM Implementation', icon_name: 'Bot', sort_order: 2 },
      { category: 'AI & Automation', name: 'OpenAI API', level_description: 'Reasoning & Assistant Integrations', icon_name: 'Terminal', sort_order: 3 },
      { category: 'AI & Automation', name: 'AI Agents', level_description: 'Autonomous Task & Support Agents', icon_name: 'BrainCircuit', sort_order: 4 },
      { category: 'AI & Automation', name: 'Workflow Automation', level_description: 'Cross-Platform Process Automation', icon_name: 'Workflow', sort_order: 5 },

      // Tools
      { category: 'Tools', name: 'Git', level_description: 'Distributed Version Control', icon_name: 'GitBranch', sort_order: 1 },
      { category: 'Tools', name: 'GitHub', level_description: 'Collaboration & CI/CD Pipelines', icon_name: 'Github', sort_order: 2 },
      { category: 'Tools', name: 'VS Code', level_description: 'Modern Development Environment', icon_name: 'TerminalSquare', sort_order: 3 },
      { category: 'Tools', name: 'Cloudflare', level_description: 'Global CDN, Edge Security & DNS', icon_name: 'Cloud', sort_order: 4 },
      { category: 'Tools', name: 'Figma', level_description: 'Product Wireframing & Design Systems', icon_name: 'Figma', sort_order: 5 }
    ];

    const insertSkill = db.prepare(`
      INSERT INTO skills (category, name, level_description, icon_name, sort_order)
      VALUES (?, ?, ?, ?, ?)
    `);

    for (const sk of skillsData) {
      insertSkill.run(sk.category, sk.name, sk.level_description, sk.icon_name, sk.sort_order);
    }
  }

  // Seed sample concepts for portfolio with clear demonstration indicator (as requested: "Initially display a clean empty portfolio state or clearly marked sample previews. Never pretend demo projects are real client work.")
  const projectsCheck = db.prepare('SELECT COUNT(*) as count FROM projects').get();
  if (projectsCheck.count === 0) {
    const now = new Date().toISOString();
    const demoProjects = [
      {
        name: 'Nexus Corporate Portal',
        slug: 'nexus-corporate-portal',
        category: 'Business Websites',
        tagline: 'High-conversion corporate web application with dynamic CMS and analytics.',
        description: 'An architectural demonstration of an enterprise-grade digital portal featuring clean typography, structured lead-generation funnels, and sub-second load times.',
        case_study: 'Built to demonstrate high-performance client capture mechanisms. Features server-side rendered speed, dynamic service showcases, and automated enquiry capture.',
        technologies_json: JSON.stringify(['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'SQLite']),
        image_url: '/assets/projects/nexus-portal.svg',
        screenshots_json: JSON.stringify(['/assets/projects/nexus-portal.svg']),
        live_url: 'https://pivotech.in/portfolio/nexus-corporate-portal',
        github_url: 'https://github.com/harish-k/nexus-corporate-portal',
        completion_date: '2025-01',
        is_featured: 1,
        is_demo_concept: 1,
        sort_order: 1
      },
      {
        name: 'Aura Commerce Platform',
        slug: 'aura-commerce-platform',
        category: 'E-commerce',
        tagline: 'Minimalist modern e-commerce storefront with rapid cart experience.',
        description: 'An architectural demonstration of a streamlined e-commerce experience designed for lifestyle brands, with optimized product galleries and frictionless order flows.',
        case_study: 'Focused on micro-interactions, responsive image delivery, and optimized checkout UX to maximize transaction completion rates.',
        technologies_json: JSON.stringify(['React', 'TypeScript', 'Tailwind CSS', 'REST API', 'Node.js']),
        image_url: '/assets/projects/aura-commerce.svg',
        screenshots_json: JSON.stringify(['/assets/projects/aura-commerce.svg']),
        live_url: 'https://pivotech.in/portfolio/aura-commerce-platform',
        github_url: 'https://github.com/harish-k/aura-commerce',
        completion_date: '2025-02',
        is_featured: 1,
        is_demo_concept: 1,
        sort_order: 2
      },
      {
        name: 'OmniAssist Intelligent Agent',
        slug: 'omniassist-intelligent-agent',
        category: 'AI Solutions',
        tagline: 'Context-aware customer intelligence and 24/7 automated triage.',
        description: 'An AI-powered concierge agent utilizing Gemini API for domain-specific customer inquiries, qualification, and automated ticket generation.',
        case_study: 'Demonstrates zero-latency client qualification with structured JSON outputs and sentiment-aware conversational assistance.',
        technologies_json: JSON.stringify(['Gemini API', 'Node.js', 'TypeScript', 'Vector Context', 'Fastify']),
        image_url: '/assets/projects/omniassist-ai.svg',
        screenshots_json: JSON.stringify(['/assets/projects/omniassist-ai.svg']),
        live_url: 'https://pivotech.in/portfolio/omniassist-intelligent-agent',
        github_url: 'https://github.com/harish-k/omniassist-agent',
        completion_date: '2025-02',
        is_featured: 1,
        is_demo_concept: 1,
        sort_order: 3
      }
    ];

    const insertProject = db.prepare(`
      INSERT INTO projects (name, slug, category, tagline, description, case_study, technologies_json, image_url, screenshots_json, live_url, github_url, completion_date, is_featured, is_demo_concept, sort_order, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const p of demoProjects) {
      insertProject.run(p.name, p.slug, p.category, p.tagline, p.description, p.case_study, p.technologies_json, p.image_url, p.screenshots_json, p.live_url, p.github_url, p.completion_date, p.is_featured, p.is_demo_concept, p.sort_order, now);
    }
  }

  // Ensure Sri Balaji Stationery project showcase exists
  const balajiProjectCheck = db.prepare("SELECT id FROM projects WHERE slug = 'sri-balaji-stationery'").get();
  if (!balajiProjectCheck) {
    db.prepare(`
      INSERT INTO projects (
        name, slug, category, tagline, description, case_study, technologies_json,
        image_url, screenshots_json, live_url, github_url, completion_date, is_featured, is_demo_concept, sort_order, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'Sri Balaji Stationery',
      'sri-balaji-stationery',
      'E-commerce',
      'Modern digital retail catalog and store website for office and stationery supplies.',
      'A streamlined digital presence and product catalogue built for Sri Balaji Stationery in Sowcarpet, Chennai. Features clean product indexing, direct WhatsApp ordering, and local store navigation.',
      'Engineered to help a traditional wholesale & retail stationery business expand its digital reach, showcase high-demand office products, and capture enquiries directly via WhatsApp.',
      JSON.stringify(['React', 'TypeScript', 'Tailwind CSS', 'WhatsApp Integration', 'SEO Optimization']),
      '/assets/projects/aura-commerce.svg',
      JSON.stringify(['/assets/projects/aura-commerce.svg']),
      'https://sri-balaji-stationery.com',
      'https://github.com/harishkumaravel2007-svg/sri-balaji-stationery',
      '2025-02',
      1,
      0,
      1,
      new Date().toISOString()
    );
  }

  // Ensure Web Applications category project exists
  const webAppProjectCheck = db.prepare("SELECT id FROM projects WHERE slug = 'pulseops-portal'").get();
  if (!webAppProjectCheck) {
    db.prepare(`
      INSERT INTO projects (
        name, slug, category, tagline, description, case_study, technologies_json,
        image_url, screenshots_json, live_url, github_url, completion_date, is_featured, is_demo_concept, sort_order, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'PulseOps Operations Hub',
      'pulseops-portal',
      'Web Applications',
      'Internal dashboard and analytics platform for real-time team workflow management.',
      'An enterprise web application architecture built for fast operational metrics, task triage, role-based security, and real-time event monitoring.',
      'Designed for operations-heavy teams needing custom dashboards, exportable reporting, and low-latency state synchronization without heavy SaaS licensing costs.',
      JSON.stringify(['React 19', 'TypeScript', 'Tailwind CSS', 'Express', 'SQLite', 'WebSockets']),
      '/assets/projects/nexus-portal.svg',
      JSON.stringify(['/assets/projects/nexus-portal.svg']),
      'https://pivotech.in/portfolio/pulseops-portal',
      'https://github.com/harish-k/pulseops-portal',
      '2025-02',
      1,
      1,
      4,
      new Date().toISOString()
    );
  }

  // Ensure Business Automation category project exists
  const automationProjectCheck = db.prepare("SELECT id FROM projects WHERE slug = 'apex-flow-automator'").get();
  if (!automationProjectCheck) {
    db.prepare(`
      INSERT INTO projects (
        name, slug, category, tagline, description, case_study, technologies_json,
        image_url, screenshots_json, live_url, github_url, completion_date, is_featured, is_demo_concept, sort_order, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'Apex Flow Automator',
      'apex-flow-automator',
      'Business Automation',
      'Multi-channel webhook pipeline automating CRM entry, WhatsApp alerts, and PDF invoices.',
      'An automated workflow engine that monitors incoming customer leads, validates data integrity, triggers instant WhatsApp notifications, and syncs accounting records in seconds.',
      'Solves manual data re-entry friction between website forms, WhatsApp leads, and billing spreadsheets, cutting lead response times from hours to under 30 seconds.',
      JSON.stringify(['Node.js', 'Webhooks', 'WhatsApp Business API', 'Cron', 'Automated PDF Engine']),
      '/assets/projects/omniassist-ai.svg',
      JSON.stringify(['/assets/projects/omniassist-ai.svg']),
      'https://pivotech.in/portfolio/apex-flow-automator',
      'https://github.com/harish-k/apex-flow-automator',
      '2025-02',
      1,
      1,
      5,
      new Date().toISOString()
    );
  }

  // Ensure Sri Balaji Stationery client review exists in reviews
  const balajiReviewCheck = db.prepare("SELECT id FROM reviews WHERE business_name LIKE '%Sri Balaji%' OR reviewer_name LIKE '%Balji%' OR reviewer_name LIKE '%Balaji%'").get();
  if (!balajiReviewCheck) {
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO reviews (
        reviewer_name, business_name, location, project_name, project_description,
        rating, review_text, website_url, status, is_visible, is_verified,
        founder_response, founder_responded_at, created_by, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'Balaji K',
      'Sri Balaji Stationery',
      'Chennai, Sowcarpet',
      'E-commerce & Retail Store Website',
      'Digital product showcase and online customer ordering workflow.',
      5,
      'PIVO TECH built our website for Sri Balaji Stationery in Sowcarpet, Chennai. Their communication was clear throughout the project, and they delivered a clean, functional site on time. Highly recommend Harish K and the PIVO TECH team!',
      'https://sri-balaji-stationery.com',
      'approved',
      1,
      1,
      'Thank you for your trust! It was a pleasure building the digital presence for Sri Balaji Stationery.',
      now,
      'client',
      now,
      now
    );
  }

  // Seed default settings
  const defaultSettings = [
    { key: 'site_title', value: 'PIVO TECH | Build. Grow. Automate. | Digital Agency & IT Solutions', description: 'Default Page Title for SEO' },
    { key: 'meta_description', value: 'PIVO TECH is a premier digital technology & IT solutions agency founded by Harish K in Theni, Tamil Nadu. We specialize in high-performance websites, digital marketing, AI agent development, and business workflow automation.', description: 'Meta description for search engines' },
    { key: 'google_analytics_id', value: '', description: 'Google Analytics Measurement ID (e.g. G-XXXXXXX)' },
    { key: 'contact_email', value: 'harishkumaravel2007@gmail.com', description: 'Public Contact Email' },
    { key: 'contact_phone', value: '+91 99442 45043', description: 'Public Contact Phone / WhatsApp' },
    { key: 'address_location', value: 'Theni, Tamil Nadu, India.', description: 'Headquarters Location' },
    { key: 'instagram_url', value: 'https://www.instagram.com/_pivo.tech/', description: 'Official Instagram' },
    { key: 'linkedin_url', value: 'https://www.linkedin.com/in/harish-k-303480301/', description: 'Founder LinkedIn' }
  ];

  const insertSetting = db.prepare(`
    INSERT OR IGNORE INTO settings (key, value, description)
    VALUES (?, ?, ?)
  `);

  for (const s of defaultSettings) {
    insertSetting.run(s.key, s.value, s.description);
  }

  console.log('[Database] PIVO TECH SQLite database initialized successfully.');
}
