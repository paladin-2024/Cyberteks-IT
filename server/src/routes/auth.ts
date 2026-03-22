import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { sendEmail } from '../lib/email';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, image: user.image },
    });
  } catch (err) {
    console.error('[auth/login]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/auth/me
router.get('/me', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, name: true, email: true, role: true, image: true },
    });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ user });
  } catch (err) {
    console.error('[auth/me]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/forgot-password — send 6-digit OTP
router.post('/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) { res.status(400).json({ error: 'Email is required' }); return; }

    const user = await prisma.user.findUnique({ where: { email } });

    // Always respond 200 to avoid user enumeration
    if (user) {
      // Invalidate any previous OTPs for this email
      await prisma.otpCode.updateMany({
        where: { email, used: false },
        data: { used: true },
      });

      const code = String(Math.floor(100000 + Math.random() * 900000));
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await prisma.otpCode.create({ data: { email, code, expiresAt } });

      sendEmail({
        to: user.email,
        subject: 'Your CyberteksIT LMS password reset code',
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
            <div style="background:#102a83;color:white;padding:20px 24px;border-radius:8px 8px 0 0;">
              <h2 style="margin:0;">Password Reset Code</h2>
            </div>
            <div style="padding:24px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;">
              <p>Hi ${user.name},</p>
              <p>Use the code below to reset your password. It expires in <strong>10 minutes</strong>.</p>
              <div style="text-align:center;margin:24px 0;">
                <span style="font-size:40px;font-weight:900;letter-spacing:12px;color:#102a83;">${code}</span>
              </div>
              <p style="color:#64748b;font-size:13px;">If you didn't request this, you can safely ignore this email.</p>
            </div>
          </div>
        `,
      }).catch(err => console.error('[auth] otp email failed:', err));
    }

    res.json({ message: 'If that email is registered, a 6-digit code is on its way.' });
  } catch (err) {
    console.error('[auth/forgot-password]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/verify-otp — verify code, return short-lived reset token
router.post('/verify-otp', async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) { res.status(400).json({ error: 'Email and code are required' }); return; }

    const otp = await prisma.otpCode.findFirst({
      where: { email, code, used: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) {
      res.status(400).json({ error: 'Invalid or expired code. Please try again.' });
      return;
    }

    // Mark used
    await prisma.otpCode.update({ where: { id: otp.id }, data: { used: true } });

    // Issue a short-lived reset token
    const resetToken = jwt.sign({ email, purpose: 'reset' }, process.env.JWT_SECRET!, { expiresIn: '15m' });
    res.json({ resetToken });
  } catch (err) {
    console.error('[auth/verify-otp]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/reset-password — set new password using reset token
router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { resetToken, password } = req.body;
    if (!resetToken || !password) { res.status(400).json({ error: 'Token and new password are required' }); return; }
    if (password.length < 8) { res.status(400).json({ error: 'Password must be at least 8 characters' }); return; }

    let payload: { email: string; purpose: string };
    try {
      payload = jwt.verify(resetToken, process.env.JWT_SECRET!) as typeof payload;
    } catch {
      res.status(400).json({ error: 'Reset token is invalid or expired. Please start over.' });
      return;
    }

    if (payload.purpose !== 'reset') { res.status(400).json({ error: 'Invalid token' }); return; }

    const user = await prisma.user.findUnique({ where: { email: payload.email } });
    if (!user) { res.status(404).json({ error: 'User not found' }); return; }

    const hashed = await bcrypt.hash(password, 12);
    await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });

    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    console.error('[auth/reset-password]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
