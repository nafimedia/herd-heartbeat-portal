# Panduan Instalasi di aaPanel

Dokumen ini menjelaskan langkah-langkah instalasi aplikasi Herd Heartbeat Portal di aaPanel agar mudah dipahami.

## 1. Persiapan di aaPanel

1. Masuk ke aaPanel.
2. Buat domain baru, misalnya:
   - Domain utama: `farm.example.com`
3. Pastikan Node.js sudah tersedia di server aaPanel.
   - Buka bagian Software / Node.js Selector.
   - Pilih versi Node.js yang sesuai, misalnya Node.js 20 atau 22.
4. Pastikan juga Git tersedia jika Anda ingin menarik source code dari repository.

## 2. Upload project ke aaPanel

Ada dua pilihan:

### Opsi A: Upload folder project langsung
1. Buka File Manager di aaPanel.
2. Masuk ke folder public_html atau subfolder domain Anda.
3. Upload seluruh isi project ini ke folder tersebut.

### Opsi B: Clone dari Git
1. Buka Terminal di aaPanel.
2. Masuk ke folder domain Anda.
3. Jalankan:

```bash
git clone <repo-url> .
```

> Jika folder sudah ada, gunakan `git pull` setelah masuk ke folder.

## 3. Install dependency

Masuk ke folder project melalui terminal aaPanel, lalu jalankan:

```bash
npm install
```

Jika ada error terkait `node-gyp`, pastikan build tools sudah tersedia di server.

## 4. Build aplikasi frontend

Jalankan perintah berikut:

```bash
npm run build
```

Hasil build akan dibuat di folder `dist/`.

## 5. Menjalankan backend

Aplikasi ini memiliki backend Node.js di folder `server/`.

### Jalankan backend secara permanen
Gunakan Process Manager / Node.js App / PM2 di aaPanel.

Contoh konfigurasi:
- Node.js version: pilih versi yang sama saat install dependency
- App Name: `farm-backend`
- Startup Command: `node server/index.js`
- Working Directory: folder project Anda

Pastikan port yang digunakan bebas, misalnya:
- Port: `3001`

Setelah aplikasi berjalan, backend bisa diakses lewat:

```text
http://your-domain:3001
```

## 6. Menjalankan frontend (opsional)

Jika Anda ingin menjalankan frontend lewat Vite secara langsung, gunakan Node.js App / PM2 dengan perintah:

```bash
npm run dev -- --host 0.0.0.0 --port 8080
```

Namun untuk production yang lebih stabil, biasanya frontend dibuild lalu dipublikasikan ke folder public_html atau reverse proxy ke port yang sudah disediakan.

## 7. Konfigurasi domain dan reverse proxy

### Jika frontend di-host dari aaPanel
1. Buka domain Anda di aaPanel.
2. Atur document root ke folder hasil build, misalnya:
   - `public_html/dist`
3. Pastikan file `index.html` ada di folder tersebut.

### Jika backend dipakai dari domain yang sama
Buat reverse proxy agar request ke `/api` diarahkan ke backend Node.js.

Contoh konfigurasi proxy:

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:3001;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

## 8. Konfigurasi environment

Buat file `.env` di root project jika Anda ingin mengubah konfigurasi default.

Contoh isi `.env`:

```env
PORT=3001
CORS_ORIGIN=http://your-domain.com
```

Jika Anda memakai backend tanpa database MySQL, aplikasi akan berjalan menggunakan file JSON default.

## 9. Login default

Setelah aplikasi berjalan, gunakan akun demo berikut:

- Email: `admin@farm.local`
- Password: `password`

## 10. Jika ingin memakai MySQL

Jika Anda ingin backend memakai MySQL, lakukan langkah berikut:

1. Buat database di aaPanel.
2. Buat file `.env` berdasarkan kebutuhan database.
3. Isi konfigurasi seperti:

```env
DB_MODE=mysql
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=farm_db
```

4. Jalankan backend lagi.

## 11. Troubleshooting

### Error `Cannot find module`
Jalankan:

```bash
npm install
```

### Error saat build
Pastikan Node.js versi yang dipakai kompatibel dan semua dependency terinstall dengan benar.

### Login tidak bisa masuk
Pastikan backend sudah berjalan di port yang benar dan CORS mengizinkan origin frontend Anda.

### Port sudah dipakai
Ganti port di file `.env` atau perintah startup.

## 12. Ringkasan singkat

Urutan paling umum:

```bash
npm install
npm run build
node server/index.js
```

Jika Anda ingin, saya juga bisa bantu menulis versi instalasi yang lebih spesifik untuk aaPanel dengan struktur domain + reverse proxy + PM2 yang siap copy-paste.
