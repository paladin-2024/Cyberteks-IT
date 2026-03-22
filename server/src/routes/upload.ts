import path from 'path';
import fs from 'fs';
import { Router, Response } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

// ── Allowed types ────────────────────────────────────────────────────────────

const AVATAR_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const SUBMISSION_TYPES = [
  'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'application/zip',
  'application/x-zip-compressed',
];

const UPLOAD_DIR = path.join(__dirname, '../../public/uploads');

// ── Download: force Content-Disposition: attachment ──────────────────────────
// GET /api/upload/download/:type/:filename?name=originalName
// Public — no auth needed (files are UUID-named, already accessible via /uploads static).
// Forces the browser to download rather than preview.

router.get('/download/:type/:filename', (req: AuthRequest, res: Response): void => {
  const { type, filename } = req.params as { type: string; filename: string };
  const allowed = ['avatars', 'covers', 'submissions'];
  if (!allowed.includes(type)) { res.status(400).json({ error: 'Invalid type' }); return; }

  const safeName = path.basename(filename); // prevent path traversal
  const filePath = path.join(UPLOAD_DIR, type, safeName);

  if (!fs.existsSync(filePath)) { res.status(404).json({ error: 'File not found' }); return; }

  const displayName = (req.query.name as string) || safeName;
  // Use both filename (ASCII fallback) and filename* (UTF-8, RFC 5987) so
  // browsers use the exact original name including spaces and non-ASCII chars.
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${displayName.replace(/"/g, '\\"')}"; filename*=UTF-8''${encodeURIComponent(displayName)}`,
  );
  res.sendFile(filePath);
});

// ── All routes below require authentication ───────────────────────────────────
router.use(requireAuth);

// ── Storage factory ──────────────────────────────────────────────────────────

function makeStorage(subdir: string) {
  const dir = path.join(UPLOAD_DIR, subdir);
  fs.mkdirSync(dir, { recursive: true });

  return multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, dir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${uuidv4()}${ext}`);
    },
  });
}

// ── Upload: avatar ────────────────────────────────────────────────────────────
// POST /api/upload/avatar  →  { url: '/uploads/avatars/uuid.jpg' }

const avatarUpload = multer({
  storage: makeStorage('avatars'),
  limits: { fileSize: 3 * 1024 * 1024 }, // 3 MB
  fileFilter: (_req, file, cb) => {
    if (AVATAR_TYPES.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only image files are allowed for avatars'));
  },
});

router.post('/avatar', avatarUpload.single('file'), (req: AuthRequest, res: Response): void => {
  if (!req.file) { res.status(400).json({ error: 'No file uploaded' }); return; }
  const url = `/uploads/avatars/${req.file.filename}`;
  res.json({ url, fileName: req.file.originalname, size: req.file.size });
});

// ── Upload: course cover image ────────────────────────────────────────────────
// POST /api/upload/cover  →  { url: '/uploads/covers/uuid.jpg' }

const coverUpload = multer({
  storage: makeStorage('covers'),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (AVATAR_TYPES.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only image files are allowed for course covers'));
  },
});

router.post('/cover', requireRole('ADMIN'), coverUpload.single('file'), (req: AuthRequest, res: Response): void => {
  if (!req.file) { res.status(400).json({ error: 'No file uploaded' }); return; }
  const url = `/uploads/covers/${req.file.filename}`;
  res.json({ url, fileName: req.file.originalname, size: req.file.size });
});

// ── Upload: submission attachment ────────────────────────────────────────────
// POST /api/upload/submission  →  { url, fileName, size }

const submissionUpload = multer({
  storage: makeStorage('submissions'),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
  fileFilter: (_req, file, cb) => {
    if (SUBMISSION_TYPES.includes(file.mimetype)) cb(null, true);
    else cb(new Error('File type not allowed'));
  },
});

router.post('/submission', submissionUpload.single('file'), (req: AuthRequest, res: Response): void => {
  if (!req.file) { res.status(400).json({ error: 'No file uploaded' }); return; }
  const url = `/uploads/submissions/${req.file.filename}`;
  res.json({ url, fileName: req.file.originalname, size: req.file.size });
});

// ── Error handler for multer ──────────────────────────────────────────────────

router.use((err: Error, _req: AuthRequest, res: Response, _next: unknown): void => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({ error: 'File too large' });
    } else {
      res.status(400).json({ error: err.message });
    }
    return;
  }
  if (err) {
    res.status(400).json({ error: err.message });
    return;
  }
});

export default router;
