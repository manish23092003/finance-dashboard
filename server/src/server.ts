import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import routes from './routes';
import { errorHandler } from './middleware/error.middleware';

// ─── Create Express App ─────────────────────────────────────────────────────
const app = express();

// ─── Global Middleware ──────────────────────────────────────────────────────
app.use(cors({
  origin: function (origin, callback) {
    // Allow any localhost origin in development
    if (!origin || /^http:\/\/localhost(:\d+)?$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Request Logging (Development) ──────────────────────────────────────────
if (env.NODE_ENV === 'development') {
  app.use((req, _res, next) => {
    console.log(`${new Date().toISOString()} | ${req.method} ${req.url}`);
    next();
  });
}

// ─── Health Check ───────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
    },
  });
});

// ─── API Routes ─────────────────────────────────────────────────────────────
app.use('/api', routes);

// ─── 404 Handler ────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found.',
  });
});

// ─── Centralized Error Handler (must be last) ───────────────────────────────
app.use(errorHandler);

// ─── Start Server ───────────────────────────────────────────────────────────
app.listen(env.PORT, () => {
  console.log(`
┌─────────────────────────────────────────────┐
│                                             │
│   💰 Finance Dashboard API                  │
│   Running on http://localhost:${env.PORT}         │
│   Environment: ${env.NODE_ENV.padEnd(11)}            │
│                                             │
└─────────────────────────────────────────────┘
  `);
});

export default app;
