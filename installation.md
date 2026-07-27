# Panduan Instalasi dan Deploy ke aaPanel

Dokumen ini menjelaskan cara menginstal dan mendeploy aplikasi Herd Heartbeat Portal di aaPanel.

## 1. Persiapan di aaPanel

1. Masuk ke aaPanel.
2. Buat domain atau subdomain, misalnya `farm.example.com`.
3. Pastikan Node.js sudah tersedia di server aaPanel.
   - Buka bagian Software / Node.js Selector.
   - Pilih Node.js 20 atau 22.
4. Pastikan Git juga tersedia jika Anda ingin clone repository.

## 2. Upload project ke aaPanel

Pilih salah satu metode berikut:

### Opsi A: Upload folder project
1. Buka File Manager.
2. Masuk ke folder domain Anda, misalnya `public_html` atau subfolder domain.
3. Upload seluruh isi project ini ke folder tersebut.

### Opsi B: Clone dari Git
```bash
git clone <repo-url> .
```

> Jika folder sudah ada, gunakan `git pull` setelah masuk ke folder.

## 3. Install dependency

Masuk ke folder project melalui terminal aaPanel lalu jalankan:

```bash
npm install
```

## 4. Build aplikasi

Jalankan:

```bash
npm run build
```

Proses build akan:
1. Membuild frontend React sebagai SPA dengan Vite
2. Menghasilkan static assets di `dist/`
4. Secara otomatis generate `index.html` dengan hash asset yang benar

Folder hasil build:
- `dist/` - Frontend assets (CSS, JS, static files, index.html)

## 5. Konfigurasi environment

Buat file `.env` di root project jika diperlukan.

Contoh:

```env
PORT=3000
CORS_ORIGIN=https://farm.example.com
```

Jika ingin memakai MySQL, tambahkan:

```env
DB_MODE=mysql
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=farm_db
```

## 6. Jalankan aplikasi di aaPanel

Gunakan Node.js App di aaPanel untuk menjalankan aplikasi.

### Konfigurasi aaPanel Node.js App:
- **App Name**: `farm-portal`
- **Startup Command**: `npm start`
- **Working Directory**: folder project Anda
- **Port**: `3000`

### Apa yang dijalankan `npm start`:
Perintah ini menjalankan `node server/index.js` yang:
- ✓ Mount semua API routes dari `server/app.js` (endpoints: `/api/health`, `/api/login`, `/api/animals`, dll)
- ✓ Serve static assets dari `dist/assets/`
- ✓ Serve SPA fallback (`index.html`) untuk client-side routing
- ✓ Listen pada port `3000`

Aplikasi dapat diakses melalui:
```
http://your-server-ip:3000
http://farm.example.com
```

### Test server berjalan:
```bash
# Test API
curl http://localhost:3000/api/health

# Test Frontend
curl http://localhost:3000/

# Test Login
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@farm.local","password":"password"}'
```

## 7. Atur domain

Atur domain Anda agar mengarah ke aplikasi di port `3000`.

### Opsi A: Proxy domain langsung ke port 3000
Jika aaPanel mendukung, buat reverse proxy yang mengarahkan semua request domain Anda ke `http://127.0.0.1:3000`.

### Opsi B: Akses melalui IP dan port
Jika ingin akses langsung, gunakan:
```text
http://your-server-ip:3000
```


## 8. Pastikan folder upload bisa ditulis

Folder `public/uploads` harus memiliki izin tulis agar fitur upload gambar bisa bekerja.

## 9. Login default

Setelah aplikasi berjalan, gunakan akun demo berikut:

- Email: `admin@farm.local`
- Password: `password`

## 10. Troubleshooting

### Error saat install dependency
Jalankan:
```bash
npm install
```

### Port 3000 sudah digunakan
Ubah port di `.env`:
```env
PORT=3001
```

### Frontend menampilkan 404
Pastikan file `dist/index.html` ada. Jika tidak, rebuild:
```bash
npm run build
```

### API endpoints tidak menjawab
1. Pastikan server berjalan: `npm start`
2. Test API:
   ```bash
   curl http://localhost:3000/api/health
   ```
3. Cek log di aaPanel untuk error messages

### Database tidak terkoneksi
Jika menggunakan JSON (default), pastikan file `data/farm.db.json` ada dan readable:
```bash
ls -la data/farm.db.json
```

Jika menggunakan MySQL, verifikasi credentials di `.env`:
```env
DB_MODE=mysql
DB_HOST=127.0.0.1
DB_USER=username
DB_PASSWORD=password
DB_NAME=farm_db
```

### Assets tidak termuat (CSS/JS 404)
1. Pastikan `dist/assets/` ada dan berisi file
2. Restart server: `npm start`
3. Check permissions: folder harus readable

## 11. Performance Tips

1. **Cache statis assets**: Konfigurasikan web server (nginx/Apache) untuk cache `dist/assets/*` dengan max-age yang panjang
2. **Compression**: Enable gzip di web server untuk response lebih kecil
3. **Database**: Jika traffic tinggi, pertimbangkan migrasi dari JSON ke MySQL

## 12. Update aplikasi

Untuk update ke versi terbaru:
```bash
git pull  # atau extract file baru
npm install
npm run build
# Restart server via aaPanel dashboard
```

### Login tidak bisa masuk
Pastikan backend berjalan dan port sesuai dengan yang dikonfigurasi di `.env`.

### Port sudah dipakai
Ganti port di `.env` atau gunakan port lain di aaPanel.

### CORS error saat login
Pastikan `CORS_ORIGIN` di `.env` sesuai dengan domain Anda (misal: `https://farm.example.com`).

## 11. Ringkasan deploy aaPanel

Urutan paling umum:

```bash
npm install
npm run build
```

Kemudian di aaPanel:
- Buat Node.js App dengan command `npm start`
- Tunjuk ke port `3000`
- Arahkan domain ke app tersebut

Selesai! Aplikasi akan melayani frontend, API, dan file upload dalam satu server.
