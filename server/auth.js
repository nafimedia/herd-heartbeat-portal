import jwt from 'jsonwebtoken';
import { createHash } from 'node:crypto';
import { getPool, ensureSqlSchema } from './sql.js';

const JWT_SECRET = process.env.JWT_SECRET || 'farm-dev-secret';
const DEFAULT_ADMIN = {
  id: 'admin-001',
  email: 'admin@farm.local',
  password: 'password',
  role: 'admin',
};

export function hashPassword(password) {
  return createHash('sha256').update(password).digest('hex');
}

export async function authenticateAdmin(email, password) {
  const normalizedEmail = (email || '').trim().toLowerCase();
  const normalizedPassword = (password || '').trim();

  if (!normalizedEmail || !normalizedPassword) {
    return { ok: false, error: 'Email and password are required' };
  }

  const useSql = Boolean(process.env.DATABASE_URL || process.env.DB_MODE);
  if (useSql) {
    const client = await getPool().connect();
    try {
      const { rows } = await client.query('SELECT * FROM admin_users WHERE email = $1', [normalizedEmail]);
      const user = rows && rows[0];
      if (user) {
        const expected = user.password_hash || '';
        if (expected === hashPassword(normalizedPassword)) {
          return { ok: true, user: { id: user.id, email: user.email, role: user.role } };
        }
      }
    } finally {
      client.release();
    }
  }

  // fallback to the default embedded user
  if (normalizedEmail === DEFAULT_ADMIN.email && normalizedPassword === DEFAULT_ADMIN.password) {
    return {
      ok: true,
      user: { id: DEFAULT_ADMIN.id, email: DEFAULT_ADMIN.email, role: DEFAULT_ADMIN.role },
    };
  }

  return { ok: false, error: 'Invalid credentials' };
}

export function issueToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
}

export function verifyToken(token) {
  if (!token || typeof token !== 'string') {
    throw new Error('Invalid token');
  }

  return jwt.verify(token, JWT_SECRET);
}

export function createAdminSession(user) {
  if (!user?.id || !user?.email) {
    throw new Error('Invalid user payload');
  }

  const token = issueToken({ sub: user.id, role: user.role, email: user.email });
  // if SQL is enabled, persist session row
  const useSql = Boolean(process.env.DATABASE_URL || process.env.DB_MODE);
  if (useSql) {
    (async () => {
      try {
        await ensureSqlSchema();
        const client = await getPool().connect();
        try {
          const id = `sess-${Date.now()}`;
          const createdAt = new Date().toISOString();
          const expiresAt = new Date(Date.now() + 8 * 3600 * 1000).toISOString();
          await client.query(
            `INSERT INTO admin_sessions (id, token, user_id, created_at, expires_at, revoked) VALUES ($1,$2,$3,$4,$5,$6)`,
            [id, token, user.id, createdAt, expiresAt, 0],
          );
        } finally {
          client.release();
        }
      } catch (err) {
        // don't crash on session persistence error
        console.warn('Failed to persist admin session:', err.message);
      }
    })();
  }

  return {
    token,
    user: { id: user.id, email: user.email, role: user.role },
  };
}
