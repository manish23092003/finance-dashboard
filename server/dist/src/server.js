"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./config/env");
const routes_1 = __importDefault(require("./routes"));
const error_middleware_1 = require("./middleware/error.middleware");
// ─── Create Express App ─────────────────────────────────────────────────────
const app = (0, express_1.default)();
// ─── Global Middleware ──────────────────────────────────────────────────────
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        // Allow any localhost origin in development
        if (!origin || /^http:\/\/localhost(:\d+)?$/.test(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// ─── Request Logging (Development) ──────────────────────────────────────────
if (env_1.env.NODE_ENV === 'development') {
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
            environment: env_1.env.NODE_ENV,
        },
    });
});
// ─── API Routes ─────────────────────────────────────────────────────────────
app.use('/api', routes_1.default);
// ─── 404 Handler ────────────────────────────────────────────────────────────
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found.',
    });
});
// ─── Centralized Error Handler (must be last) ───────────────────────────────
app.use(error_middleware_1.errorHandler);
// ─── Start Server ───────────────────────────────────────────────────────────
app.listen(env_1.env.PORT, () => {
    console.log(`
┌─────────────────────────────────────────────┐
│                                             │
│   💰 Finance Dashboard API                  │
│   Running on http://localhost:${env_1.env.PORT}         │
│   Environment: ${env_1.env.NODE_ENV.padEnd(11)}            │
│                                             │
└─────────────────────────────────────────────┘
  `);
});
exports.default = app;
//# sourceMappingURL=server.js.map