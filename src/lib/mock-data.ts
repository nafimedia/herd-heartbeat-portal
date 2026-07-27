export type StatusTernak = "Sehat" | "Sakit" | "Bunting" | "Karantina";
export type JenisTernak = "Sapi" | "Kambing" | "Domba" | "Ayam" | "Bebek" | "Kerbau";

export interface Ternak {
  id: string;
  tag: string;
  jenis: JenisTernak;
  ras: string;
  jenisKelamin: "Jantan" | "Betina";
  umur: number; // bulan
  berat: number; // kg
  kandang: string;
  status: StatusTernak;
  tanggalMasuk: string;
  hasilProduksi?: string;
  estimasiPakan?: string;
}

export const daftarTernak: Ternak[] = [
  // Sapi
  { id: "1", tag: "SP-001", jenis: "Sapi", ras: "Limousin", jenisKelamin: "Jantan", umur: 24, berat: 480, kandang: "Kandang Sapi A-01", status: "Sehat", tanggalMasuk: "2024-03-12", hasilProduksi: "18 L Susu / Hari", estimasiPakan: "25 kg Hijauan + 4 kg Konsentrat" },
  { id: "2", tag: "SP-002", jenis: "Sapi", ras: "Simmental", jenisKelamin: "Betina", umur: 30, berat: 520, kandang: "Kandang Sapi A-02", status: "Bunting", tanggalMasuk: "2024-01-08", hasilProduksi: "22 L Susu / Hari", estimasiPakan: "30 kg Hijauan + 5 kg Konsentrat" },
  { id: "3", tag: "SP-003", jenis: "Sapi", ras: "Brahman", jenisKelamin: "Jantan", umur: 18, berat: 410, kandang: "Kandang Sapi A-03", status: "Sehat", tanggalMasuk: "2024-05-20", hasilProduksi: "Sapi Potong Super", estimasiPakan: "22 kg Hijauan + 3.5 kg Konsentrat" },
  { id: "4", tag: "SP-004", jenis: "Sapi", ras: "Perah FH", jenisKelamin: "Betina", umur: 28, berat: 460, kandang: "Kandang Sapi A-04", status: "Sehat", tanggalMasuk: "2024-02-25", hasilProduksi: "25 L Susu / Hari", estimasiPakan: "28 kg Hijauan + 5 kg Konsentrat" },

  // Kambing
  { id: "5", tag: "KB-014", jenis: "Kambing", ras: "Etawa PE", jenisKelamin: "Betina", umur: 14, berat: 42, kandang: "Kandang Kambing B-01", status: "Sehat", tanggalMasuk: "2024-06-11", hasilProduksi: "2.2 L Susu / Hari", estimasiPakan: "4 kg Hijauan + 0.5 kg Konsentrat" },
  { id: "6", tag: "KB-015", jenis: "Kambing", ras: "Boer", jenisKelamin: "Jantan", umur: 20, berat: 55, kandang: "Kandang Kambing B-02", status: "Sakit", tanggalMasuk: "2024-02-14", hasilProduksi: "Kambing Pedaging", estimasiPakan: "5 kg Hijauan + 0.8 kg Konsentrat" },
  { id: "7", tag: "KB-016", jenis: "Kambing", ras: "Saanen", jenisKelamin: "Betina", umur: 18, berat: 45, kandang: "Kandang Kambing B-03", status: "Bunting", tanggalMasuk: "2024-08-01", hasilProduksi: "2.5 L Susu / Hari", estimasiPakan: "4.5 kg Hijauan + 0.6 kg Konsentrat" },

  // Domba
  { id: "8", tag: "DM-007", jenis: "Domba", ras: "Garut", jenisKelamin: "Jantan", umur: 22, berat: 62, kandang: "Kandang Domba C-01", status: "Sehat", tanggalMasuk: "2024-07-02", hasilProduksi: "Pedaging Premium & Kontes", estimasiPakan: "5 kg Hijauan + 0.7 kg Konsentrat" },
  { id: "9", tag: "DM-008", jenis: "Domba", ras: "Merino", jenisKelamin: "Betina", umur: 16, berat: 42, kandang: "Kandang Domba C-02", status: "Karantina", tanggalMasuk: "2024-04-19", hasilProduksi: "Wol 3.5 kg / Tahun", estimasiPakan: "4 kg Hijauan + 0.5 kg Konsentrat" },
  { id: "10", tag: "DM-009", jenis: "Domba", ras: "Texel", jenisKelamin: "Betina", umur: 14, berat: 48, kandang: "Kandang Domba C-03", status: "Bunting", tanggalMasuk: "2024-05-15", hasilProduksi: "Pedaging Super", estimasiPakan: "4.5 kg Hijauan + 0.6 kg Konsentrat" },

  // Ayam
  { id: "11", tag: "AY-101", jenis: "Ayam", ras: "Layer Petelur", jenisKelamin: "Betina", umur: 8, berat: 1.8, kandang: "Kandang Unggas D-01", status: "Sehat", tanggalMasuk: "2024-09-01", hasilProduksi: "1 Butir Telur / Hari", estimasiPakan: "120 gram Konsentrat Layer" },
  { id: "12", tag: "AY-102", jenis: "Ayam", ras: "Kampung Super", jenisKelamin: "Betina", umur: 10, berat: 2.1, kandang: "Kandang Unggas D-02", status: "Sehat", tanggalMasuk: "2024-08-10", hasilProduksi: "Telur Organik", estimasiPakan: "130 gram Jagung & Pur" },
  { id: "13", tag: "AY-103", jenis: "Ayam", ras: "Broiler", jenisKelamin: "Jantan", umur: 2, berat: 2.5, kandang: "Kandang Unggas D-03", status: "Sehat", tanggalMasuk: "2024-10-01", hasilProduksi: "Ayam Potong Siap Panen", estimasiPakan: "150 gram Pur Finisher" },

  // Bebek
  { id: "14", tag: "BK-201", jenis: "Bebek", ras: "Mojosari", jenisKelamin: "Betina", umur: 9, berat: 1.6, kandang: "Kandang Unggas E-01", status: "Sehat", tanggalMasuk: "2024-08-20", hasilProduksi: "Telur Asin Quality A", estimasiPakan: "140 gram Pakan Bebek" },
  { id: "15", tag: "BK-202", jenis: "Bebek", ras: "Peking", jenisKelamin: "Jantan", umur: 3, berat: 3.2, kandang: "Kandang Unggas E-02", status: "Sehat", tanggalMasuk: "2024-09-15", hasilProduksi: "Bebek Potong Resto", estimasiPakan: "180 gram Pur Pedaging" },
  { id: "16", tag: "BK-203", jenis: "Bebek", ras: "Alabio", jenisKelamin: "Betina", umur: 11, berat: 1.7, kandang: "Kandang Unggas E-03", status: "Bunting", tanggalMasuk: "2024-07-11", hasilProduksi: "1 Butir Telur / Hari", estimasiPakan: "145 gram Konsentrat" },
];

export const populasiBulanan = [
  { bulan: "Jan", sapi: 42, kambing: 68, domba: 34 },
  { bulan: "Feb", sapi: 44, kambing: 70, domba: 36 },
  { bulan: "Mar", sapi: 47, kambing: 72, domba: 38 },
  { bulan: "Apr", sapi: 48, kambing: 75, domba: 39 },
  { bulan: "Mei", sapi: 51, kambing: 78, domba: 41 },
  { bulan: "Jun", sapi: 53, kambing: 80, domba: 43 },
  { bulan: "Jul", sapi: 56, kambing: 82, domba: 45 },
  { bulan: "Agu", sapi: 58, kambing: 85, domba: 47 },
];

export const produksiSusu = [
  { hari: "Sen", liter: 320 },
  { hari: "Sel", liter: 342 },
  { hari: "Rab", liter: 310 },
  { hari: "Kam", liter: 358 },
  { hari: "Jum", liter: 371 },
  { hari: "Sab", liter: 365 },
  { hari: "Min", liter: 340 },
];

export const distribusiStatus = [
  { name: "Sehat", value: 168, color: "var(--color-success)" },
  { name: "Bunting", value: 24, color: "var(--color-primary)" },
  { name: "Sakit", value: 9, color: "var(--color-destructive)" },
  { name: "Karantina", value: 6, color: "var(--color-warning)" },
];

export interface JadwalKesehatan {
  id: string;
  tanggal: string;
  tag: string;
  tindakan: string;
  petugas: string;
  status: "Terjadwal" | "Selesai" | "Tertunda";
}

export const jadwalKesehatan: JadwalKesehatan[] = [
  { id: "1", tanggal: "2026-07-14", tag: "SP-002", tindakan: "Pemeriksaan kebuntingan", petugas: "drh. Ahmad", status: "Terjadwal" },
  { id: "2", tanggal: "2026-07-15", tag: "KB-015", tindakan: "Pengobatan skabies", petugas: "drh. Sari", status: "Terjadwal" },
  { id: "3", tanggal: "2026-07-13", tag: "SP-001", tindakan: "Vaksin PMK", petugas: "drh. Ahmad", status: "Selesai" },
  { id: "4", tanggal: "2026-07-12", tag: "DM-007", tindakan: "Cek rutin", petugas: "drh. Budi", status: "Selesai" },
  { id: "5", tanggal: "2026-07-16", tag: "KR-002", tindakan: "Deworming", petugas: "drh. Sari", status: "Terjadwal" },
  { id: "6", tanggal: "2026-07-10", tag: "DM-008", tindakan: "Pemeriksaan karantina", petugas: "drh. Budi", status: "Tertunda" },
];

export interface StokPakan {
  id: string;
  nama: string;
  kategori: string;
  stok: number;
  satuan: string;
  minimum: number;
  supplier: string;
}

export const stokPakan: StokPakan[] = [
  { id: "1", nama: "Hijauan Rumput Gajah", kategori: "Hijauan", stok: 1240, satuan: "kg", minimum: 500, supplier: "Kelompok Tani Maju" },
  { id: "2", nama: "Konsentrat Sapi Perah", kategori: "Konsentrat", stok: 380, satuan: "kg", minimum: 400, supplier: "PT Pakan Nusantara" },
  { id: "3", nama: "Dedak Padi", kategori: "Konsentrat", stok: 920, satuan: "kg", minimum: 300, supplier: "Penggilingan Berkah" },
  { id: "4", nama: "Silase Jagung", kategori: "Fermentasi", stok: 210, satuan: "kg", minimum: 250, supplier: "Kelompok Tani Maju" },
  { id: "5", nama: "Mineral Blok", kategori: "Suplemen", stok: 48, satuan: "pcs", minimum: 20, supplier: "PT Pakan Nusantara" },
  { id: "6", nama: "Garam Ternak", kategori: "Suplemen", stok: 72, satuan: "kg", minimum: 30, supplier: "UD Sumber Rejeki" },
];

export const produksiBulanan = [
  { bulan: "Feb", susu: 8420, daging: 320, telur: 4200 },
  { bulan: "Mar", susu: 9120, daging: 380, telur: 4550 },
  { bulan: "Apr", susu: 9680, daging: 410, telur: 4720 },
  { bulan: "Mei", susu: 10240, daging: 445, telur: 4980 },
  { bulan: "Jun", susu: 10820, daging: 465, telur: 5210 },
  { bulan: "Jul", susu: 11340, daging: 502, telur: 5480 },
];

export const aktivitasTerbaru = [
  { waktu: "10 menit lalu", ikon: "activity", teks: "SP-002 dijadwalkan pemeriksaan kebuntingan", tipe: "kesehatan" },
  { waktu: "1 jam lalu", ikon: "milk", teks: "Produksi susu pagi tercatat: 186 liter", tipe: "produksi" },
  { waktu: "3 jam lalu", ikon: "wheat", teks: "Stok konsentrat sapi perah di bawah minimum", tipe: "pakan" },
  { waktu: "Kemarin", ikon: "plus", teks: "3 ekor kambing Boer baru ditambahkan", tipe: "ternak" },
  { waktu: "2 hari lalu", ikon: "syringe", teks: "Vaksinasi PMK selesai untuk kandang A", tipe: "kesehatan" },
];
