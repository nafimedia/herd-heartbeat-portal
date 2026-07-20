export interface RiwayatKesehatan {
  tanggal: string;
  keterangan: string;
  jenis: "Sakit" | "Vaksin" | "Obat" | "Pemeriksaan";
}

export interface BobotPoint {
  bulan: string;
  bobot: number;
}

export interface KartuKesehatanKambing {
  id: string;
  idKambing: string;
  ras: string;
  kelamin: "Jantan" | "Betina";
  umur: string;
  ciri: string;
  foto?: string;
  namaPemilik: string;
  umurPemilik: number;
  bobot: number;
  tinggi: number;
  panjang: number;
  lebarDada: number;
  kondisi: "Sehat" | "Sakit";
  nafsuMakan: "Baik" | "Menurun" | "Tidak";
  feses: "Normal" | "Diare";
  catatan: string;
  riwayat: RiwayatKesehatan[];
  bobotHistory: BobotPoint[];
}

export interface PeringatanDini {
  id: string;
  idKambing: string;
  level: "kritis" | "peringatan" | "info";
  pesan: string;
  waktu: string;
}

export const daftarKartu: KartuKesehatanKambing[] = [
  {
    id: "k1",
    idKambing: "MJ-KB-001",
    ras: "Kambing Etawa (PE)",
    kelamin: "Betina",
    umur: "14 bulan",
    ciri: "Bulu putih, bercak hitam di kaki belakang",
    namaPemilik: "Bpk. Suparjo",
    umurPemilik: 48,
    bobot: 42,
    tinggi: 74,
    panjang: 68,
    lebarDada: 22,
    kondisi: "Sehat",
    nafsuMakan: "Baik",
    feses: "Normal",
    catatan: "Kondisi produktif, siap dikawinkan bulan depan.",
    riwayat: [
      { tanggal: "2026-06-10", keterangan: "Vaksin ORF", jenis: "Vaksin" },
      { tanggal: "2026-05-02", keterangan: "Deworming rutin", jenis: "Obat" },
      { tanggal: "2026-04-15", keterangan: "Pemeriksaan bobot bulanan", jenis: "Pemeriksaan" },
    ],
    bobotHistory: [
      { bulan: "Feb", bobot: 32 },
      { bulan: "Mar", bobot: 34 },
      { bulan: "Apr", bobot: 36 },
      { bulan: "Mei", bobot: 38 },
      { bulan: "Jun", bobot: 40 },
      { bulan: "Jul", bobot: 42 },
    ],
  },
  {
    id: "k2",
    idKambing: "MJ-KB-002",
    ras: "Kambing Boer",
    kelamin: "Jantan",
    umur: "20 bulan",
    ciri: "Kepala coklat, badan putih",
    namaPemilik: "Bpk. Rahmat",
    umurPemilik: 52,
    bobot: 58,
    tinggi: 78,
    panjang: 76,
    lebarDada: 26,
    kondisi: "Sakit",
    nafsuMakan: "Menurun",
    feses: "Diare",
    catatan: "Perlu isolasi 5 hari, cek kembali oleh drh. Sari.",
    riwayat: [
      { tanggal: "2026-07-12", keterangan: "Diare akut - pemberian oralit ternak", jenis: "Sakit" },
      { tanggal: "2026-07-13", keterangan: "Injeksi antibiotik", jenis: "Obat" },
    ],
    bobotHistory: [
      { bulan: "Feb", bobot: 52 },
      { bulan: "Mar", bobot: 55 },
      { bulan: "Apr", bobot: 58 },
      { bulan: "Mei", bobot: 60 },
      { bulan: "Jun", bobot: 60 },
      { bulan: "Jul", bobot: 58 },
    ],
  },
  {
    id: "k3",
    idKambing: "MJ-KB-003",
    ras: "Kambing Jawa Randu",
    kelamin: "Betina",
    umur: "10 bulan",
    ciri: "Bulu coklat muda seragam",
    namaPemilik: "Ibu Marni",
    umurPemilik: 41,
    bobot: 34,
    tinggi: 68,
    panjang: 62,
    lebarDada: 20,
    kondisi: "Sehat",
    nafsuMakan: "Baik",
    feses: "Normal",
    catatan: "Pertumbuhan sesuai target.",
    riwayat: [
      { tanggal: "2026-06-28", keterangan: "Vaksin PMK", jenis: "Vaksin" },
      { tanggal: "2026-05-20", keterangan: "Pemeriksaan rutin", jenis: "Pemeriksaan" },
    ],
    bobotHistory: [
      { bulan: "Feb", bobot: 24 },
      { bulan: "Mar", bobot: 26 },
      { bulan: "Apr", bobot: 28 },
      { bulan: "Mei", bobot: 30 },
      { bulan: "Jun", bobot: 32 },
      { bulan: "Jul", bobot: 34 },
    ],
  },
  {
    id: "k4",
    idKambing: "MJ-KB-004",
    ras: "Kambing Etawa (PE)",
    kelamin: "Jantan",
    umur: "24 bulan",
    ciri: "Tanduk melengkung, telinga panjang menjuntai",
    namaPemilik: "Bpk. Suparjo",
    umurPemilik: 48,
    bobot: 72,
    tinggi: 88,
    panjang: 82,
    lebarDada: 30,
    kondisi: "Sehat",
    nafsuMakan: "Baik",
    feses: "Normal",
    catatan: "Pejantan unggulan kelompok.",
    riwayat: [
      { tanggal: "2026-06-05", keterangan: "Vaksin ORF", jenis: "Vaksin" },
      { tanggal: "2026-04-10", keterangan: "Deworming", jenis: "Obat" },
    ],
    bobotHistory: [
      { bulan: "Feb", bobot: 64 },
      { bulan: "Mar", bobot: 66 },
      { bulan: "Apr", bobot: 68 },
      { bulan: "Mei", bobot: 70 },
      { bulan: "Jun", bobot: 71 },
      { bulan: "Jul", bobot: 72 },
    ],
  },
];

export const peringatanDini: PeringatanDini[] = [
  {
    id: "p1",
    idKambing: "MJ-KB-002",
    level: "kritis",
    pesan: "Diare + nafsu makan menurun 2 hari berturut. Segera isolasi & hubungi drh.",
    waktu: "2 jam lalu",
  },
  {
    id: "p2",
    idKambing: "MJ-KB-002",
    level: "peringatan",
    pesan: "Bobot turun 2 kg dari bulan lalu — pantau asupan pakan.",
    waktu: "Hari ini",
  },
  {
    id: "p3",
    idKambing: "MJ-KB-005",
    level: "peringatan",
    pesan: "Jadwal vaksin ORF terlewat 3 hari.",
    waktu: "3 hari lalu",
  },
  {
    id: "p4",
    idKambing: "MJ-KB-001",
    level: "info",
    pesan: "Sudah waktunya penimbangan bulanan.",
    waktu: "Besok",
  },
];

export const langkahPosyandu = [
  {
    no: 1,
    judul: "Pendaftaran",
    deskripsi: "Anggota membawa kambing & buku kartu; kader mencatat kehadiran.",
    pj: "Kader",
  },
  {
    no: 2,
    judul: "Penimbangan & Pengukuran",
    deskripsi: "Bobot, tinggi, panjang, lebar dada dicatat di kartu digital.",
    pj: "Kader + Peternak",
  },
  {
    no: 3,
    judul: "Pemeriksaan Kesehatan",
    deskripsi: "Cek nafsu makan, feses, mata, mulut, kulit. Konsultasi dengan drh.",
    pj: "Drh. / Mahasiswa",
  },
  {
    no: 4,
    judul: "Tindakan & Penyuluhan",
    deskripsi: "Vaksinasi, deworming, pengobatan, edukasi pakan.",
    pj: "Drh. + Tim UNU",
  },
  {
    no: 5,
    judul: "Pencatatan & Evaluasi",
    deskripsi: "Data disinkronkan ke KARTANING, rekap dibagikan ke peternak.",
    pj: "Operator",
  },
];

export const jadwalPosyandu = [
  { tanggal: "2026-07-25", tema: "Posyandu Rutin Juli", peserta: 14, lokasi: "Balai Kelompok Mindajaya" },
  { tanggal: "2026-08-22", tema: "Vaksinasi PMK Serentak", peserta: 14, lokasi: "Kandang Kolektif" },
  { tanggal: "2026-09-19", tema: "Penyuluhan Pakan Fermentasi", peserta: 14, lokasi: "Balai Desa Glempang" },
];
