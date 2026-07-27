import jwt from 'jsonwebtoken';
import { createHash } from 'node:crypto';
import { getPool, ensureSqlSchema } from './sql.js';

const JWT_SECRET = process.env.JWT_SECRET || 'farm-dev-secret';
const DEMO_USERS = [
  {
    id: 'admin-001',
    email: 'admin@farm.local',
    password: 'password',
    role: 'admin',
    name: 'Pak Tono (Ketua KTT)',
  },
  {
    id: 'medis-001',
    email: 'medis@farm.local',
    password: 'password',
    role: 'medis',
    name: 'Drh. Ahmad (Petugas Medis)',
  },
  {
    id: 'operator-001',
    email: 'operator@farm.local',
    password: 'password',
    role: 'operator',
    name: 'Mas Budi (Operator Farm)',
  },
  {
    id: 'peternak-001',
    email: 'peternak@farm.local',
    password: 'password',
    role: 'peternak',
    name: 'Bpk. Suparjo (Mitra Peternak)',
  },
];

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
    await ensureSqlSchema();
    const client = await getPool().connect();
    try {
      const { rows } = await client.query('SELECT * FROM admin_users WHERE email = $1', [normalizedEmail]);
      const user = rows && rows[0];
      if (user) {
        const expected = user.password_hash || '';
        if (expected === hashPassword(normalizedPassword)) {
          return { ok: true, user: { id: user.id, email: user.email, role: user.role || 'admin', name: user.name || user.email } };
        }
      }
    } finally {
      client.release();
    }
  }

  // Check embedded multi-role demo users
  const matchedUser = DEMO_USERS.find(
    (u) => u.email === normalizedEmail && u.password === normalizedPassword
  );

  if (matchedUser) {
    return {
      ok: true,
      user: {
        id: matchedUser.id,
        email: matchedUser.email,
        role: matchedUser.role,
        name: matchedUser.name,
      },
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

export async function createAdminSession(user) {
  if (!user?.id || !user?.email) {
    throw new Error('Invalid user payload');
  }

  const token = issueToken({ sub: user.id, role: user.role, email: user.email });
  // if SQL is enabled, persist session row
  const useSql = Boolean(process.env.DATABASE_URL || process.env.DB_MODE);
  if (useSql) {
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
      console.warn('Failed to persist admin session:', err.message);
    }
  }

  return {
    token,
    user: { id: user.id, email: user.email, role: user.role, name: user.name || user.email },
  };
}
