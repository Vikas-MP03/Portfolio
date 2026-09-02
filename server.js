/**
 * ============================================================
 * PORTFOLIO - Production-Ready Express Server
 * ============================================================
 * Author  : Vikas M P
 * Stack   : Node.js + Express.js + MongoDB
 * ============================================================
 */

'use strict';

const path    = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express        = require('express');
const cors           = require('cors');
const helmet         = require('helmet');
const morgan         = require('morgan');
const rateLimit      = require('express-rate-limit');

const connectDB      = require('./src/config/database');
const errorHandler   = require('./src/middleware/errorHandler');
const notFound       = require('./src/middleware/notFound');
const logger         = require('./src/utils/logger');

// --- Route Imports ---
const profileRoutes  = require('./src/routes/profileRoutes');
const projectRoutes  = require('./src/routes/projectRoutes');
const skillRoutes    = require('./src/routes/skillRoutes');
const contactRoutes  = require('./src/routes/contactRoutes');
const experienceRoutes = require('./src/routes/experienceRoutes');

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Connect Database ─────────────────────────────────────────
connectDB();

// ─── Security Headers ─────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// ─── CORS ─────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`CORS: Origin ${origin} not allowed`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
  })
);

// ─── Rate Limiting ────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs : Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max      : Number(process.env.RATE_LIMIT_MAX)        || 200,
  message  : { success: false, message: 'Too many requests – please try again later.' },
  standardHeaders: true,
  legacyHeaders  : false,
});
app.use('/api/', globalLimiter);

// ─── Body Parsers ─────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── HTTP Logging ─────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', { stream: { write: msg => logger.http(msg.trim()) } }));
}

// ─── Serve Static Frontend ────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1d' }));

// ─── API Routes ───────────────────────────────────────────────
app.use('/api/profile',    profileRoutes);
app.use('/api/projects',   projectRoutes);
app.use('/api/skills',     skillRoutes);
app.use('/api/contact',    contactRoutes);
app.use('/api/experience', experienceRoutes);

// ─── Health Check ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success : true,
    status  : 'OK',
    timestamp: new Date().toISOString(),
    version : '1.0.0',
    env     : process.env.NODE_ENV,
  });
});

// ─── Serve Frontend SPA for all other routes ─────────────────
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─── Error Handling ───────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────
const server = app.listen(PORT, () => {
  logger.info(`🚀  Portfolio Server running at http://localhost:${PORT}`);
  logger.info(`🌍  Environment : ${process.env.NODE_ENV}`);
});

// ─── Graceful Shutdown ────────────────────────────────────────
const gracefulShutdown = (signal) => {
  logger.info(`\n⚠️  ${signal} received – shutting down gracefully…`);
  server.close(() => {
    logger.info('✅  HTTP server closed.');
    process.exit(0);
  });
  setTimeout(() => { process.exit(1); }, 10_000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT',  () => gracefulShutdown('SIGINT'));
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection:', reason);
});

module.exports = app;
