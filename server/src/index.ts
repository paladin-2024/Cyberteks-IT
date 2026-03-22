import 'dotenv/config';
import path from 'path';
import express from 'express';
import cors from 'cors';

import authRouter         from './routes/auth';
import applyRouter        from './routes/apply';
import notificationsRouter from './routes/notifications';
import contactRouter      from './routes/contact';
import messagesRouter     from './routes/messages';
import dashboardRouter    from './routes/dashboard';
import analyticsRouter    from './routes/analytics';
import coursesRouter      from './routes/courses';
import profileRouter      from './routes/profile';
import usersRouter      from './routes/users';
import invoicesRouter   from './routes/invoices';
import enrollmentsRouter from './routes/enrollments';
import curriculumRouter    from './routes/curriculum';
import assignmentsRouter   from './routes/assignments';
import submissionsRouter   from './routes/submissions';
import uploadRouter        from './routes/upload';
import getStartedRouter    from './routes/get-started';
import sectionsRouter      from './routes/sections';

const app  = express();
const PORT = process.env.PORT ?? 3001;

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL ?? 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// Serve uploaded files as static assets
// __dirname = server/src/ → ../public/uploads = server/public/uploads
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// ── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth',          authRouter);
app.use('/api/apply',         applyRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/contact',       contactRouter);
app.use('/api/messages',      messagesRouter);
app.use('/api/dashboard',     dashboardRouter);
app.use('/api/analytics',     analyticsRouter);
app.use('/api/courses',       coursesRouter);
app.use('/api/profile',       profileRouter);
app.use('/api/users',       usersRouter);
app.use('/api/invoices',    invoicesRouter);
app.use('/api/enrollments', enrollmentsRouter);
app.use('/api/curriculum',   curriculumRouter);
app.use('/api/assignments',  assignmentsRouter);
app.use('/api/submissions',  submissionsRouter);
app.use('/api/upload',       uploadRouter);
app.use('/api/get-started',  getStartedRouter);
app.use('/api/sections',     sectionsRouter);

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── 404 catch-all ────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[server] Running on http://localhost:${PORT}`);
});

export default app;
