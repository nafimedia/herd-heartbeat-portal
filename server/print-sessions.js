import { getPool, ensureSqlSchema } from './sql.js';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

function loadEnv() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const root = path.resolve(__dirname, '..');
  const envPath = path.join(root, '.env');
  if (!existsSync(envPath)) return;
  const content = readFileSync(envPath, 'utf8');
  content.split(/\r?\n/).filter(Boolean).forEach((l) => {
    const i = l.indexOf('='); if (i === -1) return; const k = l.slice(0,i).trim(); const v = l.slice(i+1).trim(); if (!process.env[k]) process.env[k]=v;
  });
}

loadEnv();

async function run() {
  await ensureSqlSchema();
  const client = await getPool().connect();
  try {
    const { rows } = await client.query('SELECT id, token, user_id, created_at, expires_at, revoked FROM admin_sessions ORDER BY created_at DESC');
    console.log(JSON.stringify(rows, null, 2));
  } finally {
    client.release();
  }
}

run().catch(err => { console.error(err); process.exit(1) });
