import assert from 'node:assert/strict';
import { once } from 'node:events';
import { access, mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import app from '../server/app.js';
import { authenticateAdmin } from '../server/auth.js';
import { initializeDatabase } from '../server/db.js';

test('initializeDatabase creates a seeded database file', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'farm-backend-'));

  try {
    const snapshot = await initializeDatabase({ dbFile: path.join(tempDir, 'farm.db.json') });
    assert.ok(snapshot.animals.length > 0, 'Expected seeded animals');
    assert.ok(snapshot.feedStock.length > 0, 'Expected seeded feed stock');
    assert.equal(snapshot.healthChecks[0].status, 'Selesai');
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test('authenticateAdmin accepts the default local credentials', async () => {
  const result = await authenticateAdmin('admin@farm.local', 'password');
  assert.equal(result.ok, true);
  assert.equal(result.user.email, 'admin@farm.local');
  assert.equal(result.user.role, 'admin');
});

test('login endpoint allows browser requests from local dev origins', async () => {
  const server = app.listen(0, '127.0.0.1');

  try {
    await once(server, 'listening');
    const address = server.address();
    const port = typeof address === 'object' && address ? address.port : 0;

    const response = await fetch(`http://127.0.0.1:${port}/api/login`, {
      method: 'OPTIONS',
      headers: {
        Origin: 'http://localhost:8081',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'content-type',
      },
    });

    assert.equal(response.status, 204);
    assert.equal(response.headers.get('access-control-allow-origin'), 'http://localhost:8081');
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

test('protected animal endpoint rejects requests without a valid token', async () => {
  const server = app.listen(0, '127.0.0.1');

  try {
    await once(server, 'listening');
    const address = server.address();
    const port = typeof address === 'object' && address ? address.port : 0;

    const response = await fetch(`http://127.0.0.1:${port}/api/animals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tag: 'TEST-1', name: 'Test' }),
    });

    assert.equal(response.status, 401);
    const payload = await response.json();
    assert.equal(payload.error, 'Authentication required');
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

test('animal owner fields are preserved on create and update', async () => {
  const server = app.listen(0, '127.0.0.1');

  try {
    await once(server, 'listening');
    const address = server.address();
    const port = typeof address === 'object' && address ? address.port : 0;

    const loginResponse = await fetch(`http://127.0.0.1:${port}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@farm.local', password: 'password' }),
    });

    assert.equal(loginResponse.status, 200);
    const loginPayload = await loginResponse.json();
    const token = loginPayload.token;

    const createResponse = await fetch(`http://127.0.0.1:${port}/api/animals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        tag: 'TEST-OWNER-FIELDS',
        name: 'Owner Test',
        namaPemilik: 'Budi',
        umurPemilik: '39',
      }),
    });

    assert.equal(createResponse.status, 201);
    const created = await createResponse.json();
    assert.equal(created.namaPemilik, 'Budi');
    assert.equal(created.umurPemilik, '39');

    const updateResponse = await fetch(`http://127.0.0.1:${port}/api/animals/${created.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ namaPemilik: 'Sari', umurPemilik: '41' }),
    });

    assert.equal(updateResponse.status, 200);
    const updated = await updateResponse.json();
    assert.equal(updated.namaPemilik, 'Sari');
    assert.equal(updated.umurPemilik, '41');
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

test('animal photo upload and update/delete lifecycle works', async () => {
  const server = app.listen(0, '127.0.0.1');

  try {
    await once(server, 'listening');
    const address = server.address();
    const port = typeof address === 'object' && address ? address.port : 0;

    const loginResponse = await fetch(`http://127.0.0.1:${port}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@farm.local', password: 'password' }),
    });

    assert.equal(loginResponse.status, 200);
    const loginPayload = await loginResponse.json();
    const token = loginPayload.token;

    const createResponse = await fetch(`http://127.0.0.1:${port}/api/animals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        tag: 'TEST-IMG',
        name: 'Foto Test',
        fotoKambing: 'data:image/png;base64,AAAA',
        namaPemilik: 'Budi',
        status: 'Sehat',
      }),
    });

    assert.equal(createResponse.status, 201);
    const created = await createResponse.json();
    assert.ok(String(created.fotoKambing || '').includes('/uploads/'));

    const filename = String(created.fotoKambing || '').split('/uploads/').pop();
    const filePath = path.join(process.cwd(), 'public', 'uploads', filename);
    await access(filePath);

    const updateResponse = await fetch(`http://127.0.0.1:${port}/api/animals/${created.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ namaPemilik: 'Sari', status: 'Sakit' }),
    });

    assert.equal(updateResponse.status, 200);
    const updated = await updateResponse.json();
    assert.equal(updated.namaPemilik, 'Sari');

    const deleteResponse = await fetch(`http://127.0.0.1:${port}/api/animals/${created.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    assert.equal(deleteResponse.status, 200);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});
