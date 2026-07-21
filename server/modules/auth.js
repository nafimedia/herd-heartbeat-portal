import { verifyToken } from '../auth.js';

export function getTokenFromHeader(req) {
  const authHeader = req.headers.authorization || '';
  return authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
}

export async function getAuthUser(req) {
  const token = getTokenFromHeader(req);
  if (!token) return null;

  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}
