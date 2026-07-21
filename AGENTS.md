<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# Herd Heartbeat Portal

## Ringkasan proyek
Aplikasi manajemen peternakan berbasis web yang menampilkan dashboard operasional, data ternak, kesehatan, produksi, stok pakan, dan manajemen admin. Proyek ini menggunakan React + TanStack Start di sisi frontend dan Node.js server di sisi backend.

## Struktur utama
- Frontend: [src](src)
- Backend: [server](server)
- Data lokal: [data/farm.db.json](data/farm.db.json)
- Tests: [tests](tests)

## Fitur yang tersedia
- Dashboard ringkasan ternak, produksi, dan pakan
- Form input untuk ternak, cek kesehatan, stok pakan, dan produksi
- Backend API lokal dengan penyimpanan JSON
- Login admin dengan sesi browser
- Proteksi route agar pengguna belum login diarahkan ke halaman login

## Jalankan lokal
- Frontend: npm run dev
- Backend: node server/index.js
- Build: npm run build
- Test backend: node --test tests/backend.test.js

## Credensial login demo
- Email: admin@farm.local
- Password: password

## Catatan implementasi
- Sesi login disimpan di sessionStorage untuk menghindari penyimpanan token yang terlalu panjang di localStorage.
- Request API yang membutuhkan akses admin menyertakan header Authorization Bearer token.
- Routing mengarah ke halaman login otomatis saat sesi tidak ditemukan.

## Menggunakan MySQL (Laragon)
- Untuk menjalankan backend menggunakan MySQL yang disediakan Laragon, buat file `.env` di root proyek berdasarkan `.env.example` dan aktifkan `DB_MODE=mysql`.
- Pastikan MySQL di Laragon berjalan dan nilai `DB_HOST`, `DB_USER`, `DB_PASSWORD`, dan `DB_NAME` sesuai. Default Laragon biasanya `root` tanpa password.
- Setelah konfigurasi, jalankan `node server/index.js` dan backend akan membuat tabel yang diperlukan secara otomatis.
