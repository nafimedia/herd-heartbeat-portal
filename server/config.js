import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

function loadEnv() {
  const envPath = path.join(rootDir, '.env');
  if (!existsSync(envPath)) {
    return {};
  }

  return readFileSync(envPath, 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .reduce((acc, line) => {
      const separatorIndex = line.indexOf('=');
      if (separatorIndex === -1) {
        return acc;
      }

      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim();
      acc[key] = value;
      return acc;
    }, {});
}

const env = loadEnv();

for (const [key, value] of Object.entries(env)) {
  if (process.env[key] === undefined) {
    process.env[key] = value;
  }
}

export function getConfig() {
  return {
    port: Number(process.env.PORT || env.PORT || 3000),
    host: process.env.HOST || env.HOST || '0.0.0.0',
    dbFile: env.DB_FILE ? path.resolve(rootDir, env.DB_FILE) : path.join(rootDir, 'data', 'farm.db.json'),
    corsOrigin: env.CORS_ORIGIN || 'http://localhost:8080',
  };
}

export const config = getConfig();
