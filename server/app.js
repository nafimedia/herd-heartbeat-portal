import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { mkdir, readFile, writeFile, unlink } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from './config.js';
import { authenticateAdmin, createAdminSession } from './auth.js';
import { getAuthUser, getTokenFromHeader } from './modules/auth.js';
import { requireAdmin } from './modules/auth-guard.js';
import {
  addAnimal,
  addHealthCheck,
  addProduction,
  getDatabaseSnapshot,
  listAnimals,
  listFeedStock,
  listHealthChecks,
  listProduction,
  updateFeedStock,
} from './modules/store.js';
import { getPool } from './sql.js';
import { getStoreMode, insertIntoSql, isSessionValid, readAllFromSql } from './modules/store.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const uploadDir = path.join(__dirname, '..', 'public', 'uploads');

function normalizeAnimalRecord(record = {}) {
  return {
    ...record,
    id: record.id,
    tag: record.tag || '',
    name: record.name || '',
    jenis: record.jenis || 'Sapi',
    ras: record.ras || 'Lokal',
    jenisKelamin: record.jenisKelamin ?? record.jenis_kelamin ?? '',
    umur: record.umur ?? 0,
    berat: record.berat ?? 0,
    kandang: record.kandang || 'A-01',
    status: record.status || 'Sehat',
    tanggalMasuk: record.tanggalMasuk ?? record.tanggal_masuk ?? '',
    umurKambing: record.umurKambing ?? record.umur_kambing ?? '',
    ciriCiri: record.ciriCiri ?? record.ciri_ciri ?? '',
    namaPemilik: record.namaPemilik ?? record.nama_pemilik ?? '',
    umurPemilik: record.umurPemilik ?? record.umur_pemilik ?? '',
    tinggiBadan: record.tinggiBadan ?? record.tinggi_badan ?? '',
    panjangBadan: record.panjangBadan ?? record.panjang_badan ?? '',
    lebarDada: record.lebarDada ?? record.lebar_dada ?? '',
    kondisi: record.kondisi || 'Sehat',
    nafsuMakan: record.nafsuMakan ?? record.nafsu_makan ?? 'Baik',
    feses: record.feses || 'Normal',
    riwayatSingkat: record.riwayatSingkat ?? record.riwayat_singkat ?? '',
    catatan: record.catatan || '',
    fotoKambing: record.fotoKambing ?? record.foto_kambing ?? '',
  };
}

app.use(helmet());
const allowedOrigins = new Set([
  config.corsOrigin,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:8080',
  'http://127.0.0.1:8080',
  'http://localhost:8081',
  'http://127.0.0.1:8081',
]);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);
app.use(express.json({ limit: '10mb' }));

app.options('*', (_, res) => res.sendStatus(204));

app.get('/api/health', async (req, res) => {
  try {
    const snapshot = await getDatabaseSnapshot();
    res.status(200).json({
      status: 'ok',
      message: 'Backend farm siap digunakan',
      database: {
        animals: snapshot.animals.length,
        healthChecks: snapshot.healthChecks.length,
        feedStock: snapshot.feedStock.length,
        production: snapshot.production.length,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/overview', async (req, res) => {
  try {
    const snapshot = await getDatabaseSnapshot();
    const sehat = snapshot.animals.filter((item) => item.status === 'Sehat').length;
    const stokKritis = snapshot.feedStock.filter((item) => item.stok < item.minimum).length;
    res.status(200).json({
      totalAnimals: snapshot.animals.length,
      sehat,
      stokKritis,
      totalProduksi: snapshot.production.reduce((sum, item) => sum + Number(item.susu || 0), 0),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email = '', password = '' } = req.body || {};
    const authResult = await authenticateAdmin(email, password);
    if (!authResult.ok) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const session = createAdminSession(authResult.user);
    return res.status(200).json(session);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/logout', async (req, res) => {
  try {
    const token = getTokenFromHeader(req);
    if (!token) {
      return res.status(400).json({ error: 'No token provided' });
    }

    if (process.env.DATABASE_URL || process.env.DB_MODE) {
      try {
        const client = await getPool().connect();
        try {
          await client.query('UPDATE admin_sessions SET revoked = 1 WHERE token = $1', [token]);
        } finally {
          client.release();
        }
      } catch (err) {
        console.error('Failed to revoke session:', err);
        return res.status(500).json({ error: 'Failed to revoke session' });
      }
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/animals', async (req, res) => {
  try {
    const mode = await getStoreMode();
    if (mode === 'sql') {
      const rows = await readAllFromSql('animals');
      return res.status(200).json(rows.map((row) => normalizeAnimalRecord(row)));
    }
    return res.status(200).json((await listAnimals()).map((item) => normalizeAnimalRecord(item)));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

async function updateAnimal(id, payload) {
  const snapshot = await getDatabaseSnapshot();
  const current = snapshot.animals.find((item) => String(item.id) === String(id));
  if (!current) {
    throw new Error('Animal not found');
  }

  const nextAnimal = {
    ...current,
    ...payload,
    id: current.id,
    tag: payload.tag || current.tag,
    name: payload.name || current.name,
    jenis: payload.jenis || current.jenis,
    ras: payload.ras || current.ras,
    jenisKelamin: payload.jenisKelamin || current.jenisKelamin,
    umur: payload.umur ?? current.umur,
    berat: payload.berat ?? current.berat,
    kandang: payload.kandang || current.kandang,
    status: payload.status || current.status,
    tanggalMasuk: payload.tanggalMasuk || current.tanggalMasuk,
    umurKambing: payload.umurKambing ?? current.umurKambing,
    ciriCiri: payload.ciriCiri ?? current.ciriCiri,
    namaPemilik: payload.namaPemilik ?? current.namaPemilik,
    umurPemilik: payload.umurPemilik ?? current.umurPemilik,
    tinggiBadan: payload.tinggiBadan ?? current.tinggiBadan,
    panjangBadan: payload.panjangBadan ?? current.panjangBadan,
    lebarDada: payload.lebarDada ?? current.lebarDada,
    kondisi: payload.kondisi ?? current.kondisi,
    nafsuMakan: payload.nafsuMakan ?? current.nafsuMakan,
    feses: payload.feses ?? current.feses,
    riwayatSingkat: payload.riwayatSingkat ?? current.riwayatSingkat,
    catatan: payload.catatan ?? current.catatan,
    fotoKambing: payload.fotoKambing ?? current.fotoKambing,
  };

  const dbFile = path.join(path.dirname(__filename), '..', 'data', 'farm.db.json');
  const next = {
    ...snapshot,
    animals: snapshot.animals.map((item) => (String(item.id) === String(id) ? nextAnimal : item)),
  };
  await writeFile(dbFile, JSON.stringify(next, null, 2));
  return nextAnimal;
}

async function deleteAnimal(id) {
  const snapshot = await getDatabaseSnapshot();
  const current = snapshot.animals.find((item) => String(item.id) === String(id));
  if (!current) {
    throw new Error('Animal not found');
  }

  const dbFile = path.join(path.dirname(__filename), '..', 'data', 'farm.db.json');
  const next = {
    ...snapshot,
    animals: snapshot.animals.filter((item) => String(item.id) !== String(id)),
  };

  if (current.fotoKambing && typeof current.fotoKambing === 'string' && current.fotoKambing.startsWith('/uploads/')) {
    const fileName = current.fotoKambing.split('/uploads/').pop();
    if (fileName) {
      try {
        await unlink(path.join(uploadDir, fileName));
      } catch (error) {
        if (error.code !== 'ENOENT') {
          console.warn('Failed to delete animal photo:', error.message);
        }
      }
    }
  }

  await writeFile(dbFile, JSON.stringify(next, null, 2));
  return { ok: true };
}

async function saveAnimalPhoto(base64Data) {
  if (!base64Data || typeof base64Data !== 'string' || !base64Data.startsWith('data:image/')) {
    return null;
  }

  const matches = base64Data.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!matches) {
    return null;
  }

  await mkdir(uploadDir, { recursive: true });
  const extension = matches[1].split('/')[1] || 'png';
  const filename = `${Date.now()}-${Math.random().toString(16).slice(2)}.${extension}`;
  const filePath = path.join(uploadDir, filename);
  const buffer = Buffer.from(matches[2], 'base64');
  await writeFile(filePath, buffer);
  return `/uploads/${filename}`;
}

app.post('/api/animals', async (req, res) => {
  try {
    const authResult = await requireAdmin(req);
    if (!authResult.ok) {
      return res.status(401).json({ error: authResult.error || 'Authentication required' });
    }

    const body = req.body || {};
    const photoUrl = await saveAnimalPhoto(body.fotoKambing);
    const payload = {
      ...body,
      fotoKambing: photoUrl || body.fotoKambing || '',
      namaPemilik: body.namaPemilik || '',
      catatan: body.catatan || '',
      status: body.status || body.kondisi || 'Sehat',
      kandang: body.kandang || 'A-01',
    };
    const mode = await getStoreMode();
    if (mode === 'sql') {
      const created = await insertIntoSql(
        'animals',
        ['id', 'tag', 'name', 'jenis', 'ras', 'jenis_kelamin', 'umur', 'berat', 'kandang', 'status', 'tanggal_masuk', 'umur_kambing', 'ciri_ciri', 'nama_pemilik', 'umur_pemilik', 'tinggi_badan', 'panjang_badan', 'lebar_dada', 'kondisi', 'nafsu_makan', 'feses', 'riwayat_singkat', 'catatan', 'foto_kambing'],
        [
          payload.id || `animal-${Date.now()}`,
          payload.tag || 'AN-000',
          payload.name || 'Ternak Baru',
          payload.jenis || 'Sapi',
          payload.ras || 'Lokal',
          payload.jenisKelamin || 'Betina',
          Number(payload.umur || 0),
          Number(payload.berat || 0),
          payload.kandang || 'A-01',
          payload.status || 'Sehat',
          payload.tanggalMasuk || new Date().toISOString().slice(0, 10),
          payload.umurKambing || '',
          payload.ciriCiri || '',
          payload.namaPemilik || '',
          payload.umurPemilik || '',
          payload.tinggiBadan || '',
          payload.panjangBadan || '',
          payload.lebarDada || '',
          payload.kondisi || 'Sehat',
          payload.nafsuMakan || 'Baik',
          payload.feses || 'Normal',
          payload.riwayatSingkat || '',
          payload.catatan || '',
          payload.fotoKambing || '',
        ],
      );
      return res.status(201).json(created);
    }

    return res.status(201).json(normalizeAnimalRecord(await addAnimal(payload)));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.patch('/api/animals/:id', async (req, res) => {
  try {
    const authResult = await requireAdmin(req);
    if (!authResult.ok) {
      return res.status(401).json({ error: authResult.error || 'Authentication required' });
    }

    const { id } = req.params;
    const body = req.body || {};
    const mode = await getStoreMode();
    if (mode === 'sql') {
      const existing = await readAllFromSql('animals');
      const current = existing.find((item) => String(item.id) === String(id));
      if (!current) {
        return res.status(404).json({ error: 'Animal not found' });
      }

      const nextPhoto = body.fotoKambing && typeof body.fotoKambing === 'string' && body.fotoKambing.startsWith('data:image/')
        ? await saveAnimalPhoto(body.fotoKambing)
        : body.fotoKambing || current.foto_kambing || current.fotoKambing || '';

      const updated = {
        ...current,
        tag: body.tag || current.tag,
        name: body.name || current.name,
        jenis: body.jenis || current.jenis,
        ras: body.ras || current.ras,
        jenis_kelamin: body.jenisKelamin || current.jenis_kelamin || current.jenisKelamin,
        umur: body.umur ?? current.umur,
        berat: body.berat ?? current.berat,
        kandang: body.kandang || current.kandang,
        status: body.status || body.kondisi || current.status,
        tanggal_masuk: body.tanggalMasuk || current.tanggal_masuk || current.tanggalMasuk,
        umur_kambing: body.umurKambing ?? current.umur_kambing ?? current.umurKambing,
        ciri_ciri: body.ciriCiri ?? current.ciri_ciri ?? current.ciriCiri,
        nama_pemilik: body.namaPemilik ?? current.nama_pemilik ?? current.namaPemilik,
        umur_pemilik: body.umurPemilik ?? current.umur_pemilik ?? current.umurPemilik,
        tinggi_badan: body.tinggiBadan ?? current.tinggi_badan ?? current.tinggiBadan,
        panjang_badan: body.panjangBadan ?? current.panjang_badan ?? current.panjangBadan,
        lebar_dada: body.lebarDada ?? current.lebar_dada ?? current.lebarDada,
        kondisi: body.kondisi ?? current.kondisi,
        nafsu_makan: body.nafsuMakan ?? current.nafsu_makan ?? current.nafsuMakan,
        feses: body.feses ?? current.feses,
        riwayat_singkat: body.riwayatSingkat ?? current.riwayat_singkat ?? current.riwayatSinghat,
        catatan: body.catatan ?? current.catatan,
        foto_kambing: nextPhoto,
      };

      const client = await getPool().connect();
      try {
        await client.query(`UPDATE animals SET tag = $1, name = $2, jenis = $3, ras = $4, jenis_kelamin = $5, umur = $6, berat = $7, kandang = $8, status = $9, tanggal_masuk = $10, umur_kambing = $11, ciri_ciri = $12, nama_pemilik = $13, umur_pemilik = $14, tinggi_badan = $15, panjang_badan = $16, lebar_dada = $17, kondisi = $18, nafsu_makan = $19, feses = $20, riwayat_singkat = $21, catatan = $22, foto_kambing = $23 WHERE id = $24`, [
          updated.tag,
          updated.name,
          updated.jenis,
          updated.ras,
          updated.jenis_kelamin,
          updated.umur,
          updated.berat,
          updated.kandang,
          updated.status,
          updated.tanggal_masuk,
          updated.umur_kambing,
          updated.ciri_ciri,
          updated.nama_pemilik,
          updated.umur_pemilik,
          updated.tinggi_badan,
          updated.panjang_badan,
          updated.lebar_dada,
          updated.kondisi,
          updated.nafsu_makan,
          updated.feses,
          updated.riwayat_singkat,
          updated.catatan,
          updated.foto_kambing,
          id,
        ]);
      } finally {
        client.release();
      }
      return res.status(200).json(normalizeAnimalRecord(updated));
    }

    const updated = await updateAnimal(id, body);
    return res.status(200).json(normalizeAnimalRecord(updated));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/animals/:id', async (req, res) => {
  try {
    const authResult = await requireAdmin(req);
    if (!authResult.ok) {
      return res.status(401).json({ error: authResult.error || 'Authentication required' });
    }

    const { id } = req.params;
    const mode = await getStoreMode();
    if (mode === 'sql') {
      const client = await getPool().connect();
      try {
        await client.query('DELETE FROM animals WHERE id = $1', [id]);
      } finally {
        client.release();
      }
      return res.status(200).json({ ok: true });
    }

    const next = await deleteAnimal(id);
    return res.status(200).json(next);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/health-checks', async (req, res) => {
  try {
    const mode = await getStoreMode();
    if (mode === 'sql') {
      return res.status(200).json(await readAllFromSql('health_checks'));
    }
    return res.status(200).json(await listHealthChecks());
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/health-checks', async (req, res) => {
  try {
    const authResult = await requireAdmin(req);
    if (!authResult.ok) {
      return res.status(401).json({ error: authResult.error || 'Authentication required' });
    }

    const body = req.body || {};
    const mode = await getStoreMode();
    if (mode === 'sql') {
      const created = await insertIntoSql(
        'health_checks',
        ['id', 'tanggal', 'tag', 'tindakan', 'petugas', 'status'],
        [
          body.id || `check-${Date.now()}`,
          body.tanggal || new Date().toISOString().slice(0, 10),
          body.tag || 'SP-001',
          body.tindakan || 'Pemeriksaan rutin',
          body.petugas || 'drh. Admin',
          body.status || 'Terjadwal',
        ],
      );
      return res.status(201).json(created);
    }

    return res.status(201).json(await addHealthCheck(body));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/feed-stock', async (req, res) => {
  try {
    const mode = await getStoreMode();
    if (mode === 'sql') {
      return res.status(200).json(await readAllFromSql('feed_stock'));
    }
    return res.status(200).json(await listFeedStock());
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/feed-stock', async (req, res) => {
  try {
    const authResult = await requireAdmin(req);
    if (!authResult.ok) {
      return res.status(401).json({ error: authResult.error || 'Authentication required' });
    }

    const body = req.body || {};
    const mode = await getStoreMode();
    if (mode === 'sql') {
      const created = await insertIntoSql(
        'feed_stock',
        ['id', 'nama', 'kategori', 'stok', 'satuan', 'minimum', 'supplier'],
        [
          body.id || `feed-${Date.now()}`,
          body.nama || 'Pakan Baru',
          body.kategori || 'Konsentrat',
          Number(body.stok || 0),
          body.satuan || 'kg',
          Number(body.minimum || 0),
          body.supplier || 'Supplier belum diisi',
        ],
      );
      return res.status(201).json(created);
    }

    return res.status(201).json(await updateFeedStock(body));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/production', async (req, res) => {
  try {
    const mode = await getStoreMode();
    if (mode === 'sql') {
      return res.status(200).json(await readAllFromSql('production'));
    }
    return res.status(200).json(await listProduction());
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/production', async (req, res) => {
  try {
    const authResult = await requireAdmin(req);
    if (!authResult.ok) {
      return res.status(401).json({ error: authResult.error || 'Authentication required' });
    }

    const body = req.body || {};
    const mode = await getStoreMode();
    if (mode === 'sql') {
      const created = await insertIntoSql(
        'production',
        ['id', 'tanggal', 'susu', 'daging', 'telur', 'catatan'],
        [
          body.id || `prod-${Date.now()}`,
          body.tanggal || new Date().toISOString().slice(0, 10),
          Number(body.susu || 0),
          Number(body.daging || 0),
          Number(body.telur || 0),
          body.catatan || 'Catatan produksi',
        ],
      );
      return res.status(201).json(created);
    }

    return res.status(201).json(await addProduction(body));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.use((_, res) => res.status(404).json({ error: 'Route not found' }));

app.use((err, _, res, __) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
