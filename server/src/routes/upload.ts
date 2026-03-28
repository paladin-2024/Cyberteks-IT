import { Router, Response } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

// ── Cloudinary config ─────────────────────────────────────────────────────────
cloudinary.config({
  cloud_name:  process.env.CLOUDINARY_CLOUD_NAME,
  api_key:     process.env.CLOUDINARY_API_KEY,
  api_secret:  process.env.CLOUDINARY_API_SECRET,
});

console.log('[upload] Cloudinary config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ?? '(missing)',
  api_key: process.env.CLOUDINARY_API_KEY ? '(set)' : '(missing)',
  api_secret: process.env.CLOUDINARY_API_SECRET ? '(set)' : '(missing)',
});

// ── Allowed types ─────────────────────────────────────────────────────────────
const IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const SUBMISSION_TYPES = [
  ...IMAGE_TYPES,
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'application/zip',
  'application/x-zip-compressed',
];

// All files go to memory — we stream them to Cloudinary
const memStorage = multer.memoryStorage();

// ── Helper: upload buffer to Cloudinary ──────────────────────────────────────
function uploadToCloudinary(
  buffer: Buffer,
  folder: string,
  resourceType: 'image' | 'raw' = 'image',
): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: `cyberteks/${folder}`, resource_type: resourceType },
      (err, result) => {
        if (err || !result) return reject(err ?? new Error('Cloudinary upload failed'));
        resolve(result.secure_url);
      },
    );
    stream.end(buffer);
  });
}

// ── Upload: payment proof (no auth — marketing/public users) ─────────────────
// POST /api/upload/payment-proof  →  { url }
// Accept any image type (including HEIC/HEIF from iPhones) plus PDF
const PROOF_TYPES = [
  ...IMAGE_TYPES,
  'image/heic', 'image/heif',
  'application/pdf',
];
const paymentProofUpload = multer({
  storage: memStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    if (PROOF_TYPES.includes(file.mimetype) || file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error(`File type "${file.mimetype}" not allowed. Upload a screenshot or PDF.`));
  },
});

router.post('/payment-proof', paymentProofUpload.single('file'), async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.file) { res.status(400).json({ error: 'No file uploaded' }); return; }
  try {
    const resourceType = req.file.mimetype === 'application/pdf' ? 'raw' : 'image';
    const url = await uploadToCloudinary(req.file.buffer, 'payment-proofs', resourceType);
    res.json({ url, fileName: req.file.originalname });
  } catch (err) {
    console.error('[upload /payment-proof]', err);
    res.status(500).json({ error: 'Upload failed', detail: (err as Error).message });
  }
});

// ── All routes below require authentication ───────────────────────────────────
router.use(requireAuth);

// ── Upload: avatar ────────────────────────────────────────────────────────────
// POST /api/upload/avatar  →  { url }

const avatarUpload = multer({
  storage: memStorage,
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (IMAGE_TYPES.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only image files are allowed for avatars'));
  },
});

router.post('/avatar', avatarUpload.single('file'), async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.file) { res.status(400).json({ error: 'No file uploaded' }); return; }
  try {
    const url = await uploadToCloudinary(req.file.buffer, 'avatars');
    res.json({ url, fileName: req.file.originalname, size: req.file.size });
  } catch (err) {
    console.error('[upload /avatar]', err);
    res.status(500).json({ error: 'Upload failed', detail: (err as Error).message });
  }
});

// ── Upload: course / bootcamp cover image ─────────────────────────────────────
// POST /api/upload/cover  →  { url }

const coverUpload = multer({
  storage: memStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (IMAGE_TYPES.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only image files are allowed for covers'));
  },
});

router.post('/cover', requireRole('ADMIN'), coverUpload.single('file'), async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.file) { res.status(400).json({ error: 'No file uploaded' }); return; }
  try {
    const url = await uploadToCloudinary(req.file.buffer, 'covers');
    res.json({ url, fileName: req.file.originalname, size: req.file.size });
  } catch (err) {
    console.error('[upload /cover]', err);
    res.status(500).json({ error: 'Upload failed', detail: (err as Error).message });
  }
});

// ── Upload: submission attachment ─────────────────────────────────────────────
// POST /api/upload/submission  →  { url, fileName, size }

const submissionUpload = multer({
  storage: memStorage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (SUBMISSION_TYPES.includes(file.mimetype)) cb(null, true);
    else cb(new Error('File type not allowed'));
  },
});

router.post('/submission', submissionUpload.single('file'), async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.file) { res.status(400).json({ error: 'No file uploaded' }); return; }
  try {
    const resourceType = IMAGE_TYPES.includes(req.file.mimetype) ? 'image' : 'raw';
    const url = await uploadToCloudinary(req.file.buffer, 'submissions', resourceType);
    res.json({ url, fileName: req.file.originalname, size: req.file.size });
  } catch (err) {
    console.error('[upload /submission]', err);
    res.status(500).json({ error: 'Upload failed', detail: (err as Error).message });
  }
});

// ── Error handler for multer ──────────────────────────────────────────────────
router.use((err: Error, _req: AuthRequest, res: Response, _next: unknown): void => {
  if (err instanceof multer.MulterError) {
    res.status(400).json({ error: err.code === 'LIMIT_FILE_SIZE' ? 'File too large' : err.message });
    return;
  }
  if (err) { res.status(400).json({ error: err.message }); return; }
});

export default router;
