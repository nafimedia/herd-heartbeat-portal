import { ensureSqlSchema, getPool } from '../sql.js';
import { listAnimals, listFeedStock, listHealthChecks, listProduction, addAnimal, addHealthCheck, addProduction, updateFeedStock, getDatabaseSnapshot } from '../db.js';

export async function getStoreMode() {
  const useSql = Boolean(process.env.DATABASE_URL || process.env.DB_MODE);
  if (!useSql) {
    return 'json';
  }

  try {
    await ensureSqlSchema();
    return 'sql';
  } catch (error) {
    console.warn('Falling back to JSON storage:', error.message);
    return 'json';
  }
}

export async function readAllFromSql(tableName) {
  const client = await getPool().connect();
  try {
    const { rows } = await client.query(`SELECT * FROM ${tableName} ORDER BY id ASC`);
    return rows;
  } finally {
    client.release();
  }
}

export async function insertIntoSql(tableName, columns, values) {
  const client = await getPool().connect();
  try {
    const query = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values
      .map((_, index) => `$${index + 1}`)
      .join(', ')}) RETURNING *`;
    const { rows } = await client.query(query, values);
    return rows[0];
  } finally {
    client.release();
  }
}

export async function isSessionValid(req) {
  const token = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : '';
  if (!token) return false;
  if (!(process.env.DATABASE_URL || process.env.DB_MODE)) return true;

  try {
    const client = await getPool().connect();
    try {
      const { rows } = await client.query('SELECT * FROM admin_sessions WHERE token = $1', [token]);
      const row = rows && rows[0];
      if (!row) return false;
      if (row.revoked && Number(row.revoked) === 1) return false;
      const now = new Date().toISOString();
      if (row.expires_at && row.expires_at < now) return false;
      return true;
    } finally {
      client.release();
    }
  } catch (err) {
    console.warn('Session validation error:', err.message);
    return false;
  }
}

export {
  listAnimals,
  listFeedStock,
  listHealthChecks,
  listProduction,
  addAnimal,
  addHealthCheck,
  addProduction,
  updateFeedStock,
  getDatabaseSnapshot,
};
