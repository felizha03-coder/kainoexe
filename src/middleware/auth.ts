import { NextFunction, Request, Response } from 'express';
import { DecodedIdToken } from 'firebase-admin/auth';
import { ADMIN_EMAIL_ALLOWLIST, adminAuth } from '../lib/firebase-admin.ts';

export interface AuthRequest extends Request {
  user?: DecodedIdToken;
}

export const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing authentication token.' });
  }

  const token = authHeader.slice('Bearer '.length).trim();
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    const email = (decoded.email || '').toLowerCase();
    if (!decoded.email_verified || !ADMIN_EMAIL_ALLOWLIST.includes(email)) {
      return res.status(403).json({
        error: 'Forbidden: Only authorized verified administrators can access this route.',
      });
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Admin token verification failed:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token.' });
  }
};
