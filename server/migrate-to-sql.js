import { getPool, ensureSqlSchema } from './sql.js';
import { initializeDatabase } from './db.js';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Load .env from project root into process.env if not already set
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

function isMysql() {
  const url = process.env.DATABASE_URL || '';
  return process.env.DB_MODE === 'mysql' || url.startsWith('mysql://');
}

async function insertAll(client, query, params) {
  await client.query(query, params);
}

async function migrate() {
  console.log('Starting migration: JSON -> SQL');
  await ensureSqlSchema();
  const snapshot = await initializeDatabase();

  const client = await getPool().connect();
  try {
    const mysqlMode = isMysql();

    // animals
    for (const a of snapshot.animals || []) {
      const params = [
        a.id,
        a.tag || '',
        a.name || '',
        a.jenis || 'Kambing',
        a.ras || 'Lokal',
        a.jenisKelamin || a.jenis_kelamin || 'Jantan',
        a.umur || 0,
        a.berat || 0,
        a.kandang || '',
        a.status || 'Sehat',
        a.tanggalMasuk || a.tanggal_masuk || '',
        a.umurKambing || a.umur_kambing || '',
        a.ciriCiri || a.ciri_ciri || '',
        a.namaPemilik || a.nama_pemilik || '',
        a.umurPemilik || a.umur_pemilik || '',
        a.statusKepemilikan || a.status_kepemilikan || 'Kepemilikan sendiri',
        a.tinggiBadan || a.tinggi_badan || '',
        a.panjangBadan || a.panjang_badan || '',
        a.lebarDada || a.lebar_dada || '',
        a.kondisi || 'Sehat',
        a.nafsuMakan || a.nafsu_makan || 'Baik',
        a.feses || 'Normal',
        a.riwayatSingkat || a.riwayat_singkat || '',
        a.catatan || '',
        a.fotoKambing || a.foto_kambing || '',
      ];

      if (mysqlMode) {
        await client.query(
          `INSERT INTO animals (
            id, tag, name, jenis, ras, jenis_kelamin, umur, berat, kandang, status, tanggal_masuk,
            umur_kambing, ciri_ciri, nama_pemilik, umur_pemilik, status_kepemilikan,
            tinggi_badan, panjang_badan, lebar_dada, kondisi, nafsu_makan, feses, riwayat_singkat, catatan, foto_kambing
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25)
          ON DUPLICATE KEY UPDATE
            tag=VALUES(tag), name=VALUES(name), jenis=VALUES(jenis), ras=VALUES(ras), jenis_kelamin=VALUES(jenis_kelamin),
            umur=VALUES(umur), berat=VALUES(berat), kandang=VALUES(kandang), status=VALUES(status),
            nama_pemilik=VALUES(nama_pemilik), riwayat_singkat=VALUES(riwayat_singkat), catatan=VALUES(catatan);`,
          params
        );
      } else {
        await client.query(
          `INSERT INTO animals (
            id, tag, name, jenis, ras, jenis_kelamin, umur, berat, kandang, status, tanggal_masuk,
            umur_kambing, ciri_ciri, nama_pemilik, umur_pemilik, status_kepemilikan,
            tinggi_badan, panjang_badan, lebar_dada, kondisi, nafsu_makan, feses, riwayat_singkat, catatan, foto_kambing
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25)
          ON CONFLICT (id) DO UPDATE SET
            tag=EXCLUDED.tag, name=EXCLUDED.name, jenis=EXCLUDED.jenis, ras=EXCLUDED.ras, jenis_kelamin=EXCLUDED.jenis_kelamin,
            umur=EXCLUDED.umur, berat=EXCLUDED.berat, kandang=EXCLUDED.kandang, status=EXCLUDED.status,
            nama_pemilik=EXCLUDED.nama_pemilik, riwayat_singkat=EXCLUDED.riwayat_singkat, catatan=EXCLUDED.catatan;`,
          params
        );
      }
    }

    // health checks
    for (const h of snapshot.healthChecks || []) {
      if (mysqlMode) {
        await client.query(
          `INSERT INTO health_checks (id, tanggal, tag, tindakan, petugas, status)
           VALUES ($1,$2,$3,$4,$5,$6)
           ON DUPLICATE KEY UPDATE id=id;`,
          [h.id, h.tanggal, h.tag, h.tindakan, h.petugas, h.status]
        );
      } else {
        await client.query(
          `INSERT INTO health_checks (id, tanggal, tag, tindakan, petugas, status)
           VALUES ($1,$2,$3,$4,$5,$6)
           ON CONFLICT (id) DO NOTHING;`,
          [h.id, h.tanggal, h.tag, h.tindakan, h.petugas, h.status]
        );
      }
    }

    // feed stock
    for (const f of snapshot.feedStock || []) {
      if (mysqlMode) {
        await client.query(
          `INSERT INTO feed_stock (id, nama, kategori, stok, satuan, minimum, supplier)
           VALUES ($1,$2,$3,$4,$5,$6,$7)
           ON DUPLICATE KEY UPDATE id=id;`,
          [f.id, f.nama, f.kategori, f.stok || 0, f.satuan || 'kg', f.minimum || 0, f.supplier || '']
        );
      } else {
        await client.query(
          `INSERT INTO feed_stock (id, nama, kategori, stok, satuan, minimum, supplier)
           VALUES ($1,$2,$3,$4,$5,$6,$7)
           ON CONFLICT (id) DO NOTHING;`,
          [f.id, f.nama, f.kategori, f.stok || 0, f.satuan || 'kg', f.minimum || 0, f.supplier || '']
        );
      }
    }

    // production
    for (const p of snapshot.production || []) {
      if (mysqlMode) {
        await client.query(
          `INSERT INTO production (id, tanggal, susu, daging, telur, catatan)
           VALUES ($1,$2,$3,$4,$5,$6)
           ON DUPLICATE KEY UPDATE id=id;`,
          [p.id, p.tanggal, p.susu || 0, p.daging || 0, p.telur || 0, p.catatan || '']
        );
      } else {
        await client.query(
          `INSERT INTO production (id, tanggal, susu, daging, telur, catatan)
           VALUES ($1,$2,$3,$4,$5,$6)
           ON CONFLICT (id) DO NOTHING;`,
          [p.id, p.tanggal, p.susu || 0, p.daging || 0, p.telur || 0, p.catatan || '']
        );
      }
    }

    console.log('Migration finished successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exitCode = 1;
  } finally {
    client.release();
  }
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1].endsWith('migrate-to-sql.js')) {
  migrate();
}

export default migrate;
