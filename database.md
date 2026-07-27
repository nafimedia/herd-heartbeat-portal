# 🗄️ Dokumentasi Konfigurasi Database KARTANING

File ini berisi panduan lengkap konfigurasi database untuk aplikasi **KARTANING (Sistem Pendataan Peternakan Mindajaya Farm x PKM UNU Purwokerto 2026)**.

---

## 🔀 Arsitektur Dual Database Engine

Sistem KARTANING dirancang dengan **Dual Database Engine** yang dapat disesuaikan kebutuhan deployment:

1. **Mode Default (JSON File Storage)**: Menggunakan file lokal `data/farm.db.json`. Tidak memerlukan instalasi database server. Praktis, cepat, dan 100% portabel.
2. **Mode MySQL (Laragon / MariaDB Server)**: Menggunakan database relational server MySQL yang disediakan oleh Laragon. Cocok untuk lingkungan produksi atau multi-user server.

---

## 📁 1. Konfigurasi Mode Default (JSON File Storage)

Mode ini aktif secara otomatis jika file `.env` belum dibuat atau variabel `DB_MODE` tidak diset.

* **Lokasi Data**: `data/farm.db.json`
* **Cara Mengaktifkan**:
  Cukup jalankan backend server tanpa file `.env`:
  ```bash
  node server/index.js
  ```
  Sistem akan otomatis membuat file `data/farm.db.json` dan mengisi data seeding awal jika file belum ada.

---

## 🐬 2. Konfigurasi Mode MySQL (Laragon / MariaDB)

### Langkah 1: Buat File `.env`
Buat file bernama `.env` di folder utama proyek (root) berdasarkan `.env.example`:

```env
# Mode Database: 'json' atau 'mysql'
DB_MODE=mysql

# Konfigurasi Koneksi MySQL Laragon
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=farm
```

### Langkah 2: Buat Database di Laragon
1. Buka aplikasi **Laragon**.
2. Klik tombol **Start All** (pastikan modul MySQL berwarna hijau/aktif).
3. Klik tombol **Database** (membuka HeidiSQL atau phpMyAdmin).
4. Buat database baru bernama `farm` (atau sesuaikan dengan nilai `DB_NAME` di file `.env`).

### Langkah 3: Jalankan Backend Server
Jalankan perintah berikut di terminal:
```bash
node server/index.js
```
*Backend server akan otomatis terhubung ke MySQL, menginisialisasi skema tabel, dan mengisi data awal secara otomatis!*

---

## 📋 Struktur Tabel / Skema Database

| Nama Tabel | Deskripsi | Field Utama |
|---|---|---|
| `animals` | Data populasi ternak | `id`, `tag`, `name`, `jenis`, `ras`, `kelamin`, `umur`, `ciri`, `status`, `berat`, `tinggiBadan`, `panjangBadan`, `lebarDada`, `namaPemilik`, `umurPemilik`, `statusKepemilikan`, `foto` |
| `health_checks` | Rekam medis & tindakan | `id`, `tag`, `tindakan`, `tanggal`, `petugas`, `status`, `catatan` |
| `feed_stock` | Persediaan stok pakan | `id`, `nama`, `kategori`, `stok`, `satuan`, `minimum`, `supplier` |
| `production` | Hasil susu, daging, telur | `id`, `tanggal`, `tag`, `susu`, `daging`, `telur`, `catatan` |
| `users` | Hak akses pengguna | `id`, `name`, `email`, `passwordHash`, `role`, `createdAt` |

---

## 💾 Backup & Restore Data

1. **Backup Otomatis via Dashboard**:
   - Masuk ke aplikasi KARTANING -> Buka menu **Dashboard**.
   - Klik tombol **`Cadangkan Data`** untuk mengunduh snapshot data lengkap berformat JSON.
2. **Restore Data**:
   - Klik tombol **`Pulihkan Data`** di halaman Dashboard untuk mengunggah file cadangan JSON.
