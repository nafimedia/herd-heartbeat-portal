import { getTokenFromHeader } from './auth.js';
import { verifyToken } from '../auth.js';
import { getPool } from '../sql.js';

export async function requireAdmin(req) {
  const token = getTokenFromHeader(req);
  if (!token) {
    return { ok: false, error: 'Authentication required' };
  }

  try {
    const payload = verifyToken(token);
    if (!payload?.role || payload.role !== 'admin') {
      return { ok: false, error: 'Admin access required' };
    }

    if (!(process.env.DATABASE_URL || process.env.DB_MODE)) {
      return { ok: true, user: payload };
    }

    const client = await getPool().connect();
    try {
      const { rows } = await client.query('SELECT * FROM admin_sessions WHERE token = $1', [token]);
      const row = rows && rows[0];
      if (!row) return { ok: false, error: 'Session not found' };
      if (row.revoked && Number(row.revoked) === 1) return { ok: false, error: 'Session revoked' };
      const now = new Date().toISOString();
      if (row.expires_at && row.expires_at < now) return { ok: false, error: 'Session expired' };
      return { ok: true, user: payload };
    } finally {
      client.release();
    }
  } catch {
    return { ok: false, error: 'Invalid token' };
  }
}
