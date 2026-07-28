import { getPool, ensureSqlSchema } from '../server/sql.js';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

function loadEnvToProcess() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const rootDir = path.resolve(__dirname, '..');
  const envPath = path.join(rootDir, '.env');
  if (!existsSync(envPath)) return;
  const content = readFileSync(envPath, 'utf8');
  content
    .split(/\r?\n/)
    .filter(Boolean)
    .forEach((line) => {
      const idx = line.indexOf('=');
      if (idx === -1) return;
      const key = line.slice(0, idx).trim();
      const val = line.slice(idx + 1).trim();
      if (!process.env[key]) process.env[key] = val;
    });
}

loadEnvToProcess();

async function cleanSql() {
  await ensureSqlSchema();
  const client = await getPool().connect();
  try {
    await client.query('DELETE FROM animals');
    await client.query('DELETE FROM health_checks');
    console.log('SQL tables animals & health_checks cleared.');
  } finally {
    client.release();
  }
}

cleanSql().catch(console.error);
