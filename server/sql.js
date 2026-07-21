import { Pool as PgPool } from 'pg';
import mysql from 'mysql2/promise';
import { createHash } from 'node:crypto';

let poolInstance;
let mode; // 'pg' | 'mysql'

function detectMode() {
  if (mode) return mode;
  const url = process.env.DATABASE_URL || '';
  if (process.env.DB_MODE === 'mysql' || url.startsWith('mysql://')) {
    mode = 'mysql';
  } else {
    mode = 'pg';
  }
  return mode;
}

export function getPool() {
  if (poolInstance) return poolInstance;

  if (detectMode() === 'mysql') {
    // Build mysql2 pool from env or defaults (Laragon defaults)
    const host = process.env.DB_HOST || '127.0.0.1';
    const port = Number(process.env.DB_PORT || 3306);
    const user = process.env.DB_USER || 'root';
    const password = process.env.DB_PASSWORD || '';
    const database = process.env.DB_NAME || 'farm_db';

    const pool = mysql.createPool({ host, port, user, password, database, waitForConnections: true, connectionLimit: 10 });

    poolInstance = {
      async connect() {
        const conn = await pool.getConnection();
        return {
          async query(q, params = []) {
            // translate $1..$n -> ? for mysql
            const translated = q.replace(/\$\d+/g, '?');
            const [rows] = await conn.execute(translated, params);
            return { rows };
          },
          release() {
            conn.release();
          },
        };
      },
    };

    return poolInstance;
  }

  // default to Postgres
  const pgConn = new PgPool({ connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/farm_db' });
  poolInstance = {
    async connect() {
      const client = await pgConn.connect();
      return client;
    },
  };

  return poolInstance;
}

export async function ensureSqlSchema() {
  const useMysql = detectMode() === 'mysql';
  const client = await getPool().connect();
  try {
    if (useMysql) {
      // Create tables one by one for MySQL
      await client.query(`CREATE TABLE IF NOT EXISTS animals (
        id VARCHAR(255) PRIMARY KEY,
        tag VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        jenis VARCHAR(255) NOT NULL,
        ras VARCHAR(255) NOT NULL,
        jenis_kelamin VARCHAR(255) NOT NULL,
        umur INT NOT NULL,
        berat INT NOT NULL,
        kandang VARCHAR(255) NOT NULL,
        status VARCHAR(255) NOT NULL,
        tanggal_masuk VARCHAR(255) NOT NULL,
        umur_kambing VARCHAR(255) DEFAULT '',
        ciri_ciri TEXT DEFAULT '',
        nama_pemilik VARCHAR(255) DEFAULT '',
        umur_pemilik VARCHAR(255) DEFAULT '',
        tinggi_badan VARCHAR(255) DEFAULT '',
        panjang_badan VARCHAR(255) DEFAULT '',
        lebar_dada VARCHAR(255) DEFAULT '',
        kondisi VARCHAR(255) DEFAULT 'Sehat',
        nafsu_makan VARCHAR(255) DEFAULT 'Baik',
        feses VARCHAR(255) DEFAULT 'Normal',
        riwayat_singkat TEXT DEFAULT '',
        catatan TEXT DEFAULT '',
        foto_kambing TEXT DEFAULT ''
      );`);
      await client.query(`ALTER TABLE animals ADD COLUMN IF NOT EXISTS foto_kambing TEXT DEFAULT ''`);

      await client.query(`CREATE TABLE IF NOT EXISTS health_checks (
        id VARCHAR(255) PRIMARY KEY,
        tanggal VARCHAR(255) NOT NULL,
        tag VARCHAR(255) NOT NULL,
        tindakan VARCHAR(255) NOT NULL,
        petugas VARCHAR(255) NOT NULL,
        status VARCHAR(255) NOT NULL
      );`);

      await client.query(`CREATE TABLE IF NOT EXISTS feed_stock (
        id VARCHAR(255) PRIMARY KEY,
        nama VARCHAR(255) NOT NULL,
        kategori VARCHAR(255) NOT NULL,
        stok INT NOT NULL,
        satuan VARCHAR(64) NOT NULL,
        minimum INT NOT NULL,
        supplier VARCHAR(255) NOT NULL
      );`);

      await client.query(`CREATE TABLE IF NOT EXISTS production (
        id VARCHAR(255) PRIMARY KEY,
        tanggal VARCHAR(255) NOT NULL,
        susu INT NOT NULL,
        daging INT NOT NULL,
        telur INT NOT NULL,
        catatan TEXT NOT NULL
      );`);

      await client.query(`CREATE TABLE IF NOT EXISTS admin_users (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(64) NOT NULL DEFAULT 'admin'
      );`);

      await client.query(`CREATE TABLE IF NOT EXISTS admin_sessions (
        id VARCHAR(255) PRIMARY KEY,
        token TEXT NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        created_at VARCHAR(255) NOT NULL,
        expires_at VARCHAR(255) NOT NULL,
        revoked TINYINT(1) NOT NULL DEFAULT 0
      );`);

      const pwHash = createHash('sha256').update('password').digest('hex');
      await client.query(
        `INSERT INTO admin_users (id, email, password_hash, role) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE email=email;`,
        ['admin-001', 'admin@farm.local', pwHash, 'admin'],
      );
      // ensure sessions table exists for mysql (created above)
    } else {
      // Postgres path: create tables in a single multi-statement query
      await client.query(`
        CREATE TABLE IF NOT EXISTS animals (
          id TEXT PRIMARY KEY,
          tag TEXT NOT NULL,
          name TEXT NOT NULL,
          jenis TEXT NOT NULL,
          ras TEXT NOT NULL,
          jenis_kelamin TEXT NOT NULL,
          umur INT NOT NULL,
          berat INT NOT NULL,
          kandang TEXT NOT NULL,
          status TEXT NOT NULL,
          tanggal_masuk TEXT NOT NULL,
          umur_kambing TEXT DEFAULT '',
          ciri_ciri TEXT DEFAULT '',
          nama_pemilik TEXT DEFAULT '',
          umur_pemilik TEXT DEFAULT '',
          tinggi_badan TEXT DEFAULT '',
          panjang_badan TEXT DEFAULT '',
          lebar_dada TEXT DEFAULT '',
          kondisi TEXT DEFAULT 'Sehat',
          nafsu_makan TEXT DEFAULT 'Baik',
          feses TEXT DEFAULT 'Normal',
          riwayat_singkat TEXT DEFAULT '',
          catatan TEXT DEFAULT '',
          foto_kambing TEXT DEFAULT ''
        );

        ALTER TABLE animals ADD COLUMN IF NOT EXISTS foto_kambing TEXT DEFAULT '';

        CREATE TABLE IF NOT EXISTS health_checks (
          id TEXT PRIMARY KEY,
          tanggal TEXT NOT NULL,
          tag TEXT NOT NULL,
          tindakan TEXT NOT NULL,
          petugas TEXT NOT NULL,
          status TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS feed_stock (
          id TEXT PRIMARY KEY,
          nama TEXT NOT NULL,
          kategori TEXT NOT NULL,
          stok INT NOT NULL,
          satuan TEXT NOT NULL,
          minimum INT NOT NULL,
          supplier TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS production (
          id TEXT PRIMARY KEY,
          tanggal TEXT NOT NULL,
          susu INT NOT NULL,
          daging INT NOT NULL,
          telur INT NOT NULL,
          catatan TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS admin_users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'admin'
        );
      
        CREATE TABLE IF NOT EXISTS admin_sessions (
          id TEXT PRIMARY KEY,
          token TEXT NOT NULL,
          user_id TEXT NOT NULL,
          created_at TEXT NOT NULL,
          expires_at TEXT NOT NULL,
          revoked INT NOT NULL DEFAULT 0
        );
      `);

      const pwHash = createHash('sha256').update('password').digest('hex');
      await client.query(
        `INSERT INTO admin_users (id, email, password_hash, role)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (email) DO NOTHING;`,
        ['admin-001', 'admin@farm.local', pwHash, 'admin'],
      );
      // create sessions table for postgres if needed (already included in multi-statement)
    }
  } finally {
    client.release();
  }
}
