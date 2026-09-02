# 🚀 Portfolio — Full-Stack Engineering Project

A **production-ready personal portfolio** built with **Node.js + Express.js + MongoDB** and a stunning glassmorphism frontend.

---

## 🏗️ Architecture

```
Portfolio/
├── server.js                  ← Express entry point
├── .env                       ← Environment variables (do NOT commit)
├── package.json
├── scripts/
│   └── seed.js                ← Database seed script
├── src/
│   ├── config/
│   │   └── database.js        ← MongoDB connection
│   ├── models/                ← Mongoose schemas
│   │   ├── Profile.js
│   │   ├── Project.js
│   │   ├── Skill.js
│   │   ├── Contact.js
│   │   └── Experience.js
│   ├── controllers/           ← Business logic
│   │   ├── profileController.js
│   │   ├── projectController.js
│   │   ├── skillController.js
│   │   ├── contactController.js
│   │   └── experienceController.js
│   ├── routes/                ← RESTful API routes
│   │   ├── profileRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── skillRoutes.js
│   │   ├── contactRoutes.js
│   │   └── experienceRoutes.js
│   ├── middleware/
│   │   ├── errorHandler.js    ← Global error handler
│   │   └── notFound.js        ← 404 handler
│   └── utils/
│       ├── logger.js          ← Colorized logger
│       └── emailService.js    ← Nodemailer email utility
└── public/                    ← Static frontend
    ├── index.html
    ├── css/
    │   ├── style.css          ← Main styles (glassmorphism)
    │   └── animations.css     ← Keyframes & AOS
    ├── js/
    │   ├── particles.js       ← Canvas particle system
    │   ├── api.js             ← API wrapper with caching
    │   └── app.js             ← Main app logic
    └── assets/                ← avatar.jpg, resume PDF
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Edit `.env` with your actual values:
```env
MONGODB_URI=mongodb://localhost:27017/portfolio_db
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
OWNER_EMAIL=your@gmail.com
```

### 3. Seed the Database
```bash
npm run seed
```

### 4. Start Development Server
```bash
npm run dev
```
Open → **http://localhost:5000**

---

## 🔌 REST API Endpoints

| Method | Endpoint                 | Description               |
|--------|--------------------------|---------------------------|
| GET    | `/api/health`            | Server health check       |
| GET    | `/api/profile`           | Get profile data          |
| PUT    | `/api/profile`           | Update profile            |
| GET    | `/api/projects`          | List all projects         |
| GET    | `/api/projects/:id`      | Get single project        |
| POST   | `/api/projects`          | Create project            |
| PUT    | `/api/projects/:id`      | Update project            |
| DELETE | `/api/projects/:id`      | Delete project            |
| GET    | `/api/skills`            | List all skills (grouped) |
| POST   | `/api/contact`           | Submit contact message    |
| GET    | `/api/contact/messages`  | List inbox messages       |
| GET    | `/api/experience`        | List work experience      |

### Query Parameters
- `/api/projects?category=web&featured=true&limit=10`
- `/api/skills?category=frontend`

---

## 📧 Email Setup (Gmail)

1. Enable 2FA on your Google Account
2. Go to: **My Account → Security → App Passwords**
3. Create an App Password for "Mail"
4. Paste it in `.env` as `EMAIL_PASS`

---

## 🔒 Security Features
- **Helmet.js** — HTTP security headers
- **Rate Limiting** — 200 req/15 min globally, **5 req/hour** on contact form
- **CORS whitelist** — Configured via `ALLOWED_ORIGINS`
- **express-validator** — Server-side input validation
- **Environment variables** — All secrets in `.env`

---

## 🎨 Frontend Features
- Deep-space glassmorphism design
- Interactive particle canvas background
- Typewriter animation on hero
- Filter buttons for projects & skills
- Animated skill progress bars
- Scroll-reveal animations (AOS)
- Project detail modal
- Real-time contact form validation
- Toast notifications
- Fully responsive (mobile-first)

---

## 🚀 Production Deployment

```bash
NODE_ENV=production node server.js
```

For PM2:
```bash
pm2 start server.js --name portfolio
```

---

## 📝 Customize Your Data
Edit `scripts/seed.js` to update:
- Your name, bio, location, social links
- Projects with real GitHub/live URLs
- Skills with accurate proficiency levels
- Work experience history

Then re-run: `npm run seed`
