import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import type { Request, Response, NextFunction } from 'express';
import { storage } from './storage';

const JWT_SECRET = process.env.SESSION_SECRET;
if (!JWT_SECRET || JWT_SECRET === 'default-secret-key') {
  throw new Error('SESSION_SECRET environment variable must be set to a secure value');
}

const SECRET: string = JWT_SECRET;
const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, SECRET);
    if (typeof decoded === 'object' && 'userId' in decoded) {
      return { userId: decoded.userId as string };
    }
    return null;
  } catch {
    return null;
  }
}

export interface AuthRequest extends Request {
  userId?: string;
  userPermissions?: string[];
  user?: any;
  isSuperAdmin?: boolean;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  req.userId = decoded.userId;
  next();
}

export async function loadUserMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const user = await storage.getUser(req.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    req.isSuperAdmin = user.isSuperAdmin || false;

    if (user.roleId) {
      const role = await storage.getRole(user.roleId);
      if (role) {
        req.userPermissions = role.permissions;
      }
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'User load failed' });
  }
}

export function requirePermission(permission: string) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const user = req.user || await storage.getUser(req.userId);
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      if (user.isSuperAdmin) {
        req.user = user;
        req.isSuperAdmin = true;
        req.userPermissions = ['*'];
        return next();
      }

      if (!user.roleId) {
        return res.status(403).json({ error: 'No role assigned' });
      }

      const role = await storage.getRole(user.roleId);
      if (!role) {
        return res.status(403).json({ error: 'Invalid role' });
      }

      if (!role.permissions.includes(permission)) {
        return res.status(403).json({ error: `Permission denied: ${permission} required` });
      }

      req.user = user;
      req.userPermissions = role.permissions;
      next();
    } catch (error) {
      res.status(500).json({ error: 'Permission check failed' });
    }
  };
}

export function requireSuperAdmin() {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const user = req.user || await storage.getUser(req.userId);
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      if (!user.isSuperAdmin) {
        return res.status(403).json({ error: 'Super Admin access required' });
      }

      req.user = user;
      req.isSuperAdmin = true;
      next();
    } catch (error) {
      res.status(500).json({ error: 'Permission check failed' });
    }
  };
}

export function preventSuperAdminModification(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.params.id) {
    return next();
  }

  storage.getUser(req.params.id).then(targetUser => {
    if (targetUser && targetUser.isSuperAdmin && !req.isSuperAdmin) {
      return res.status(403).json({ error: 'Cannot modify Super Admin' });
    }
    next();
  }).catch(() => {
    res.status(500).json({ error: 'User check failed' });
  });
}
