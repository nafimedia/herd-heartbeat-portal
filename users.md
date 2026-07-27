# 🔐 Dokumentasi Akun & Akses Pengguna KARTANING

Dokumen ini berisi daftar akun pengguna default dan kredensial awal untuk aplikasi **KARTANING (Sistem Pendataan Peternakan Mindajaya Farm x PKM UNU Purwokerto)**.

---

## 👥 Daftar Akun Pengguna System Default

| No | Nama Pengguna | Role / Peran | Email / Username | Password Default | Hak Akses Utama |
|---|---|---|---|---|---|
| 1 | **Pak Tono (Ketua KTT)** | Admin Principal | `admin@farm.local` | `password` | Akses Penuh (Ternak, User, Laporan, Backup/Restore, Setting) |
| 2 | **drh. Fitri Nurbaeti** | Petugas Medis | `dokter@farm.local` | `password` | Rekam Medis, Cek Kesehatan, Kartu Posyandu, Obat & Stok |
| 3 | **Bpk. Suparjo** | Pengurus Kandang | `pengurus@farm.local` | `password` | Input Ternak, Stok Pakan, Catatan Produksi Susu & Daging |
| 4 | **Bpk. Slamet (Mitra)** | Peternak / Mitra | `mitra@farm.local` | `password` | Lihat Data Ternak Sendiri, Kartu Kesehatan & Jadwal Posyandu |

---

## 🛡️ Catatan Keamanan Produksi

> [!IMPORTANT]
> 1. **Ubah Password Default**: Demi keamanan data peternakan di lingkungan produksi, disarankan untuk mengubah kata sandi default pengguna setelah login pertama kali.
> 2. **Manajemen Akun**: Administrator dapat menambah pengguna baru, mereset password, atau menonaktifkan akun melalui menu **`Manajemen User`** (`/users`) di sidebar aplikasi.
> 3. **Penyimpanan Password**: Kata sandi disimpan menggunakan enkripsi hashing aman pada database lokal `data/farm.db.json` atau database MySQL Laragon.

---

## 📞 Kontak Dukungan Teknis

- **Pengembang**: Tim PKM Posyandu Ternak UNU Purwokerto x KTT Mindajaya Farm 2026
- **Lokasi Kandang**: Desa Mindajaya, Purbalingga / Purwokerto, Jawa Tengah
- **Dokumentasi Panduan**: Akses menu `Buku Panduan` di sidebar aplikasi (`/panduan`)
