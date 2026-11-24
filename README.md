# PIVO TECH — Production Corporate Website & Founder Portfolio

> **BUILD. GROW. AUTOMATE.**  
> *A premium digital technology business built to help businesses move forward.*

---

## 1. Brand Identity Overview
- **Business Name:** PIVO TECH
- **Founder & CEO:** Harish K
- **Tagline:** Build. Grow. Automate.
- **Business Type:** Digital Technology & IT Solutions Agency
- **Headquarters:** Theni, Tamil Nadu, India
- **Target Market:** India and International
- **Official Email:** [harishkumaravel2007@gmail.com](mailto:harishkumaravel2007@gmail.com)
- **Official Phone / WhatsApp:** [+91 99442 45043](https://wa.me/919944245043)
- **Instagram:** [https://www.instagram.com/_pivo.tech/](https://www.instagram.com/_pivo.tech/)
- **LinkedIn:** [https://www.linkedin.com/in/harish-k-303480301/](https://www.linkedin.com/in/harish-k-303480301/)

### Color Palette
- **Primary Deep Navy:** `#101B33` (with deep background tones `#0C1426` / `#152342`)
- **Accent Gold:** `#C6A15B` (with warm highlights `#E5C378` and `#D4AF37`)
- **Secondary / Pure White:** `#FFFFFF`
- **Text (Charcoal / Slate):** `#202938`
- **Background Surface:** `#F7F8FA`
- **Subtle Borders:** `#E5E7EB`

---

## 2. Technology Architecture
- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS + Lucide Icons + React Router DOM
- **Backend:** Node.js (v24+) + Express + SQLite (`node:sqlite` ACID DatabaseSync)
- **Authentication:** JWT Bearer Token + Bcrypt Password Hashing + Protected Routes
- **Uploads Engine:** Multer Multipart File Uploads (Images & PDFs)
- **Security:** Anti-bot Honeypot, Rate Limiting, Mathematical Human Verification Challenges, Sanitized Database Statements
- **SEO & Search Indexing:** Dynamic `sitemap.xml`, `robots.txt`, Semantic OpenGraph Meta Tags, Structured Business Data

---

## 3. Project Structure
```
e:\profilo\
├── package.json               # Root monorepo scripts
├── README.md                  # Comprehensive engineering & deployment documentation
├── client/                    # React + TypeScript + Vite + Tailwind frontend
│   ├── index.html             # Clean SEO headers, OpenGraph tags, favicon
│   ├── tailwind.config.js     # PIVO TECH corporate color system & typography
│   ├── vite.config.ts         # Vite bundler & reverse proxy setup
│   ├── public/
│   │   ├── favicon.svg        # Standalone geometric P symbol with gold core
│   │   ├── pivo-symbol.svg    # High-resolution vector emblem
│   │   ├── logo-light.svg     # Official logo lockup for light backgrounds
│   │   ├── logo-dark.svg      # Official logo lockup for dark navy backgrounds
│   │   └── assets/            # Project graphics & founder badge illustration
│   └── src/
│       ├── App.tsx            # Full-stack routing system (all 7 core pages)
│       ├── types/             # Strict TypeScript definitions
│       ├── context/           # AuthContext (JWT session management)
│       ├── services/          # Typed API communication layer
│       ├── components/        # Navbar, Footer, Logo, Modal, RatingStars, EmptyState
│       └── pages/             # Home, About, Founder, Services, Portfolio,
│                              # Reviews, Contact, AdminLogin, and AdminDashboard
└── server/                    # Node.js backend & SQLite persistent database
    ├── package.json
    ├── data/
    │   └── pivotech.db        # Persistent SQLite database file
    ├── uploads/               # Uploaded logos, photos, screenshots, certificates
    └── src/
        ├── index.js           # Server entry point & static React distribution serving
        ├── db.js              # Database initialization & default records seed
        ├── auth.js            # Bcrypt hashing & JWT token issuance
        ├── middleware/        # authMiddleware, rateLimiter
        └── routes/            # auth, company, founder, services, skills,
                               # projects, achievements, reviews, enquiries,
                               # settings, uploads, seo
```

---

## 4. Local Development & Production Run

### Prerequisites
- Node.js v20+ or v24+
- npm v10+

### Option A: Run Unified Full-Stack Server (Recommended)
This runs the backend API and serves the production-compiled frontend on `http://localhost:5000`:
```bash
# From root directory:
npm run build     # Compiles client into client/dist
npm start         # Starts Node.js backend on port 5000
```
Open **[http://localhost:5000](http://localhost:5000)** in your browser.

### Option B: Development Mode with Hot-Reloading
```bash
# Terminal 1 (Backend API):
npm --prefix server run dev

# Terminal 2 (Vite Frontend with Proxy):
npm --prefix client run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 5. Admin Dashboard Access & Credentials

The website includes a private administration portal accessible at:
👉 **[http://localhost:5000/admin/login](http://localhost:5000/admin/login)**

- **Default Username:** `admin`
- **Default Initial Password:** `PivoTech#Admin2025` *(Configurable via `ADMIN_PASSWORD` env variable)*

### Dashboard Capabilities:
1. **Overview:** Live counter metrics of enquiries, reviews, active projects, and recent activity.
2. **Client Enquiries:** View and manage incoming business leads, mark status (`New`, `In Discussion`, `Closed`), and contact leads via Email or WhatsApp.
3. **Review Moderation:** Approve, reject, or delete submitted client reviews. Verified reviews automatically update public star ratings and distribution.
4. **Portfolio Projects:** Add unlimited projects with category tags, descriptions, tech stacks, completion dates, screenshots, and live demo links.
5. **Services Management:** Update features, benefits, and descriptions for Website Development, Digital Marketing, AI Agents, and Business Automation.
6. **Skills & Expertise:** Add or remove technical competencies and active framework domains.
7. **Founder Profile:** Update biography, upload portrait photo, customize areas of expertise, and link professional profiles.
8. **Company Information:** Update corporate details, mission, vision, and core values.
9. **Achievements:** Add certificates, awards, and milestones with PDF/image attachments.
10. **Website Settings & Security:** Update SEO title, meta description, Google Analytics ID, and securely change the admin password.

---

## 6. Production Deployment Guide

### Deployment on VPS (DigitalOcean / Linode / AWS EC2 / Hetzner)
1. Install Node.js v24 on your server:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```
2. Clone or copy your repository to `/var/www/pivotech`.
3. Install dependencies and build:
   ```bash
   cd /var/www/pivotech/server && npm install
   cd /var/www/pivotech/client && npm install && npm run build
   ```
4. Configure environment variables in `/var/www/pivotech/server/.env`:
   ```env
   PORT=5000
   JWT_SECRET=your_high_entropy_random_secret_here
   ADMIN_PASSWORD=your_custom_secure_admin_password
   ```
5. Install PM2 process manager to run the app continuously:
   ```bash
   sudo npm install -g pm2
   cd /var/www/pivotech
   pm2 start server/src/index.js --name "pivotech"
   pm2 save
   pm2 startup
   ```

### Nginx Reverse Proxy Configuration with SSL
Create `/etc/nginx/sites-available/pivotech`:
```nginx
server {
    listen 80;
    server_name pivotech.in www.pivotech.in;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Enable the site and issue a free SSL certificate with Certbot:
```bash
sudo ln -s /etc/nginx/sites-available/pivotech /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d pivotech.in -d www.pivotech.in
```

### Domain Setup via Cloudflare DNS:
- Add an `A` record pointing `@` to your server's public IPv4 address (Proxy status: Proxied).
- Add a `CNAME` record pointing `www` to `pivotech.in`.
- In Cloudflare SSL/TLS, set encryption mode to **Full (Strict)**.
