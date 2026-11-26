# PIVO TECH — Complete Production Deployment Guide

Official deployment architecture and operational documentation for **PIVO TECH** (`harishkumaravel2007-svg/pivo-tech`).

---

## 1. Architecture Overview

| Component | Recommended Production Platform | Tech Stack | Notes |
| :--- | :--- | :--- | :--- |
| **Backend API** | **Render Web Service** | Node.js 20+, Express, `node:sqlite` | Persistent Disk attached for SQLite & Uploads |
| **Frontend** | **Cloudflare Pages** (or Render Static Site) | React 19, Vite, Tailwind CSS, TypeScript | Global edge CDN, sub-second TTFB, 0 cold starts |
| **Database** | **SQLite with Persistent Disk** | `node:sqlite` (`pivotech.db`) | Mounted at persistent volume `/var/data` |
| **Uploads** | **Persistent Disk Storage** | Multer disk storage | Stored at `/var/data/uploads`, served via Express |

---

## 2. Part A — Render Backend Web Service Setup

### 2.1 Service Creation
1. Log into your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** > **Web Service**.
3. Select **Build and deploy from a Git repository** and connect `harishkumaravel2007-svg/pivo-tech`.
4. Configure the following settings:
   - **Name:** `pivo-tech-backend` (or your preferred name)
   - **Region:** Singapore / Frankfurt / Oregon (choose closest to your primary audience)
   - **Branch:** `main`
   - **Root Directory:** *(leave blank to build from root, or set to `server`)*
   - **Runtime:** `Node`
   - **Build Command:** `npm --prefix server install`
   - **Start Command:** `npm --prefix server start`
   - **Health Check Path:** `/api/health`

### 2.2 Critical: Persistent Storage Configuration (SQLite & Uploads)
> [!IMPORTANT]
> **Render Persistent Disk Requirement:**  
> On Render's Free tier, the local filesystem is ephemeral — any files written (including SQLite database changes and uploaded portfolio images) are wiped whenever the service restarts, redeploys, or spins down due to inactivity.  
> To run SQLite and file uploads in production with full data persistence, select the **Starter Plan** ($7/month) or higher, and attach a Persistent Disk:
>
> 1. Scroll down to the **Disks** section in your Render Web Service settings (or navigate to **Disks** tab).
> 2. Click **Add Disk**.
> 3. **Disk Name:** `pivo-data`
> 4. **Mount Path:** `/var/data`
> 5. **Size:** `1 GB` (or `5 GB` / `10 GB` based on expected image upload volume).

### 2.3 Backend Environment Variables
Under the **Environment** tab on Render, add the following key-value pairs:

| Variable Name | Required Value / Recommendation | Purpose |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production optimizations, disables stack trace leaks |
| `PORT` | `10000` *(Render sets this automatically)* | Port Express listens on |
| `JWT_SECRET` | *(Generate a 32+ character random string)* | Secret key for signing and verifying JWT admin sessions |
| `DATA_DIR` | `/var/data` | Persistent path for the SQLite database (`pivotech.db`) |
| `UPLOADS_DIR` | `/var/data/uploads` | Persistent path for user-uploaded project screenshots |
| `CORS_ORIGIN` | `https://pivotech.in,https://pivo-tech.pages.dev` | Allowed frontend domains (comma-separated, or `*`) |
| `BUSINESS_EMAIL` | `harishkumaravel2007@gmail.com` | Official business contact email |
| `BUSINESS_PHONE` | `+919944245043` | Official business WhatsApp / phone number |

---

## 3. Part B — Frontend Deployment

We recommend **Cloudflare Pages** for the frontend due to its generous free tier, global edge CDN, 0 cold starts, and instant build integration.

### Option 1: Cloudflare Pages (Recommended)
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) > **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
2. Select repository: `harishkumaravel2007-svg/pivo-tech`.
3. Configure deployment settings:
   - **Project name:** `pivo-tech`
   - **Production branch:** `main`
   - **Framework preset:** `Vite` (or None)
   - **Build command:** `npm run build`
   - **Build output directory:** `client/dist`
   - **Root directory:** `/`
4. Add **Environment Variables** (under Settings > Environment Variables or during creation):
   - `VITE_API_URL` = `https://pivo-tech-backend.onrender.com` *(use your deployed Render backend URL)*
   - `NODE_VERSION` = `20`
5. Click **Save and Deploy**.
6. Cloudflare automatically reads `client/public/_redirects` (copied to `client/dist/_redirects`) for seamless SPA client-side routing on page refresh.

### Option 2: Render Static Site (Alternative)
If you prefer managing both frontend and backend within Render:
1. In Render Dashboard, click **New +** > **Static Site**.
2. Connect `harishkumaravel2007-svg/pivo-tech`.
3. Configure settings:
   - **Name:** `pivo-tech-client`
   - **Branch:** `main`
   - **Build Command:** `npm run build`
   - **Publish Directory:** `client/dist`
4. Add Environment Variable:
   - `VITE_API_URL` = `https://pivo-tech-backend.onrender.com`
5. Under **Redirects/Rewrites**:
   - Add a rewrite: `/*` -> `/index.html` (Status: `Rewrite`) to ensure React Router URLs reload without 404s.

---

## 4. Part C — Unified Single-Service Deployment on Render (Optional)

If you prefer deploying the entire application (frontend + backend) as **one single service** on Render without cross-origin setup:

1. **New Web Service** on Render.
2. Settings:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Health Check Path:** `/api/health`
3. The Express server in `server/src/index.js` automatically detects `client/dist` and serves the compiled React application, while simultaneously handling all `/api/*` endpoints and file uploads on the same origin.
4. Mount `/var/data` as a Persistent Disk with `DATA_DIR=/var/data` and `UPLOADS_DIR=/var/data/uploads`.

---

## 5. Security & Verification Checklist

- [x] **Zero Hardcoded Secrets:** Passwords, tokens, and secrets are strictly loaded via environment variables (`JWT_SECRET`).
- [x] **Admin Route Protection:** All mutations (`POST`, `PUT`, `PATCH`, `DELETE`) require a valid Bearer JWT.
- [x] **File Upload Safety:** Multer limits files to 10MB and validates extensions (`.png`, `.jpg`, `.jpeg`, `.webp`, `.svg`, `.pdf`) and MIME types.
- [x] **SQL Injection Prevention:** All database operations utilize parameterized queries with `node:sqlite`.
- [x] **Health Check Endpoint:** `/api/health` actively probes database readiness and returns HTTP 200 with uptime and service metadata.
- [x] **Graceful Shutdown:** Handles `SIGTERM` and `SIGINT` to flush pending requests and close the SQLite database cleanly.
- [x] **Honest Error Handling:** Frontend forms display true server response statuses and never fabricate success via localStorage.

---

## 6. First Actions After Deployment

1. **Verify Backend Health:**
   Visit `https://<your-backend-url>/api/health` in your browser. It should return:
   ```json
   {
     "status": "healthy",
     "service": "PIVO TECH API",
     "business": "PIVO TECH",
     "tagline": "Build. Grow. Automate.",
     "database": "connected",
     "uptime_seconds": 12,
     "timestamp": "..."
   }
   ```
2. **Setup Initial Admin Account:**
   Navigate to `https://<your-frontend-url>/admin/setup` (available only once when 0 admins exist) or log in at `https://<your-frontend-url>/admin/login` using your configured credentials.
3. **Submit a Test Review:**
   Visit `https://<your-frontend-url>/reviews`, submit a test review, verify it enters **Pending** status, and approve it via the **Admin Portal > Client Reviews**.
4. **Attach Custom Domain:**
   In Cloudflare Pages or Render, navigate to **Custom Domains** and map `pivotech.in` (and `www.pivotech.in`) with automated SSL.
