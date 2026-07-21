import { randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { config } from './config.js';

const defaultSeed = {
  animals: [
    {
      id: 'animal-001',
      tag: 'SP-001',
      name: 'Limo',
      jenis: 'Sapi',
      ras: 'Limousin',
      jenisKelamin: 'Jantan',
      umur: 24,
      berat: 480,
      kandang: 'A-01',
      status: 'Sehat',
      tanggalMasuk: '2024-03-12',
    },
    {
      id: 'animal-002',
      tag: 'KB-014',
      name: 'Mina',
      jenis: 'Kambing',
      ras: 'Etawa',
      jenisKelamin: 'Betina',
      umur: 14,
      berat: 42,
      kandang: 'B-04',
      status: 'Sehat',
      tanggalMasuk: '2024-06-11',
    },
  ],
  healthChecks: [
    {
      id: 'check-001',
      tanggal: '2026-07-14',
      tag: 'SP-001',
      tindakan: 'Vaksin PMK',
      petugas: 'drh. Ahmad',
      status: 'Selesai',
    },
  ],
  feedStock: [
    {
      id: 'feed-001',
      nama: 'Konsentrat Sapi Perah',
      kategori: 'Konsentrat',
      stok: 380,
      satuan: 'kg',
      minimum: 400,
      supplier: 'PT Pakan Nusantara',
    },
  ],
  production: [
    {
      id: 'prod-001',
      tanggal: '2026-07-21',
      susu: 186,
      daging: 0,
      telur: 0,
      catatan: 'Produksi pagi',
    },
  ],
};

async function ensureFile(dbFile) {
  await mkdir(path.dirname(dbFile), { recursive: true });
  try {
    await readFile(dbFile, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      await writeFile(dbFile, JSON.stringify(defaultSeed, null, 2));
    } else {
      throw error;
    }
  }
}

export async function initializeDatabase(options = {}) {
  const dbFile = options.dbFile || config.dbFile;
  await ensureFile(dbFile);

  const content = await readFile(dbFile, 'utf8');
  const parsed = JSON.parse(content);

  const normalized = {
    animals: Array.isArray(parsed.animals) ? parsed.animals : defaultSeed.animals,
    healthChecks: Array.isArray(parsed.healthChecks) ? parsed.healthChecks : defaultSeed.healthChecks,
    feedStock: Array.isArray(parsed.feedStock) ? parsed.feedStock : defaultSeed.feedStock,
    production: Array.isArray(parsed.production) ? parsed.production : defaultSeed.production,
  };

  if (!content.trim()) {
    await writeFile(dbFile, JSON.stringify(defaultSeed, null, 2));
    return structuredClone(defaultSeed);
  }

  if (JSON.stringify(normalized) !== JSON.stringify(parsed)) {
    await writeFile(dbFile, JSON.stringify(normalized, null, 2));
  }

  return normalized;
}

export async function getDatabaseSnapshot(options = {}) {
  return initializeDatabase(options);
}

export async function listAnimals(options = {}) {
  const snapshot = await initializeDatabase(options);
  return snapshot.animals;
}

export async function addAnimal(payload, options = {}) {
  const dbFile = options.dbFile || config.dbFile;
  const snapshot = await initializeDatabase(options);
  const animal = {
    id: payload.id || randomUUID(),
    tag: payload.tag || `AN-${Date.now()}`,
    name: payload.name || 'Ternak Baru',
    jenis: payload.jenis || 'Sapi',
    ras: payload.ras || 'Lokal',
    jenisKelamin: payload.jenisKelamin || 'Betina',
    umur: payload.umur || 0,
    berat: payload.berat || 0,
    kandang: payload.kandang || 'A-01',
    status: payload.status || 'Sehat',
    tanggalMasuk: payload.tanggalMasuk || new Date().toISOString().slice(0, 10),
    umurKambing: payload.umurKambing || '',
    ciriCiri: payload.ciriCiri || '',
    namaPemilik: payload.namaPemilik || '',
    umurPemilik: payload.umurPemilik || '',
    tinggiBadan: payload.tinggiBadan || '',
    panjangBadan: payload.panjangBadan || '',
    lebarDada: payload.lebarDada || '',
    kondisi: payload.kondisi || 'Sehat',
    nafsuMakan: payload.nafsuMakan || 'Baik',
    feses: payload.feses || 'Normal',
    riwayatSingkat: payload.riwayatSingkat || '',
    catatan: payload.catatan || '',
    fotoKambing: payload.fotoKambing || '',
  };

  const next = {
    ...snapshot,
    animals: [...snapshot.animals, animal],
  };

  await writeFile(dbFile, JSON.stringify(next, null, 2));
  return animal;
}

export async function listHealthChecks(options = {}) {
  const snapshot = await initializeDatabase(options);
  return snapshot.healthChecks;
}

export async function addHealthCheck(payload, options = {}) {
  const dbFile = options.dbFile || config.dbFile;
  const snapshot = await initializeDatabase(options);
  const item = {
    id: payload.id || randomUUID(),
    tanggal: payload.tanggal || new Date().toISOString().slice(0, 10),
    tag: payload.tag || 'SP-001',
    tindakan: payload.tindakan || 'Pemeriksaan rutin',
    petugas: payload.petugas || 'drh. Admin',
    status: payload.status || 'Terjadwal',
  };

  const next = {
    ...snapshot,
    healthChecks: [...snapshot.healthChecks, item],
  };

  await writeFile(dbFile, JSON.stringify(next, null, 2));
  return item;
}

export async function listFeedStock(options = {}) {
  const snapshot = await initializeDatabase(options);
  return snapshot.feedStock;
}

export async function updateFeedStock(payload, options = {}) {
  const dbFile = options.dbFile || config.dbFile;
  const snapshot = await initializeDatabase(options);
  const existingIndex = snapshot.feedStock.findIndex((item) => item.id === payload.id);
  const item = {
    id: payload.id || randomUUID(),
    nama: payload.nama || 'Pakan Baru',
    kategori: payload.kategori || 'Konsentrat',
    stok: payload.stok || 0,
    satuan: payload.satuan || 'kg',
    minimum: payload.minimum || 0,
    supplier: payload.supplier || 'Supplier belum diisi',
  };

  const nextFeedStock = [...snapshot.feedStock];
  if (existingIndex >= 0) {
    nextFeedStock[existingIndex] = { ...nextFeedStock[existingIndex], ...item };
  } else {
    nextFeedStock.push(item);
  }

  const next = {
    ...snapshot,
    feedStock: nextFeedStock,
  };

  await writeFile(dbFile, JSON.stringify(next, null, 2));
  return item;
}

export async function listProduction(options = {}) {
  const snapshot = await initializeDatabase(options);
  return snapshot.production;
}

export async function addProduction(payload, options = {}) {
  const dbFile = options.dbFile || config.dbFile;
  const snapshot = await initializeDatabase(options);
  const item = {
    id: payload.id || randomUUID(),
    tanggal: payload.tanggal || new Date().toISOString().slice(0, 10),
    susu: payload.susu || 0,
    daging: payload.daging || 0,
    telur: payload.telur || 0,
    catatan: payload.catatan || 'Catatan produksi',
  };

  const next = {
    ...snapshot,
    production: [...snapshot.production, item],
  };

  await writeFile(dbFile, JSON.stringify(next, null, 2));
  return item;
}
