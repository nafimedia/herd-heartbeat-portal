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
  jenis?: "Sapi" | "Kambing" | "Domba" | "Ayam" | "Bebek" | string;
  ras: string;
  kelamin: "Jantan" | "Betina";
  umur: string;
  ciri: string;
  foto?: string;
  namaPemilik: string;
  umurPemilik: number;
  statusKepemilikan?: "Kepemilikan sendiri" | "Kepemilikan kelompok" | "Kepemilikan mitra";
  bobot: number;
  tinggi: number;
  panjang: number;
  lebarDada: number;
  kondisi: "Sehat" | "Bunting Sehat" | "Bunting Sakit" | "Sakit" | "Mati";
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
  // 🐄 SAPI
  {
    id: "s1",
    idKambing: "SP-001",
    jenis: "Sapi",
    ras: "Sapi Limousin",
    kelamin: "Jantan",
    umur: "36 bulan",
    ciri: "Warna coklat kemerahan, postur dada lebar masif",
    namaPemilik: "Pak Tono",
    umurPemilik: 50,
    statusKepemilikan: "Kepemilikan sendiri",
    bobot: 540,
    tinggi: 142,
    panjang: 165,
    lebarDada: 52,
    kondisi: "Sehat",
    nafsuMakan: "Baik",
    feses: "Normal",
    catatan: "Sapi potong unggulan Kandang Sapi A-01.",
    riwayat: [
      { tanggal: "2026-06-15", keterangan: "Vaksinasi PMK Dosis 2", jenis: "Vaksin" },
      { tanggal: "2026-05-10", keterangan: "Pemberian Vitamin B-Complex", jenis: "Obat" },
    ],
    bobotHistory: [
      { bulan: "Feb", bobot: 480 },
      { bulan: "Mar", bobot: 495 },
      { bulan: "Apr", bobot: 510 },
      { bulan: "Mei", bobot: 522 },
      { bulan: "Jun", bobot: 532 },
      { bulan: "Jul", bobot: 540 },
    ],
  },
  {
    id: "s2",
    idKambing: "SP-002",
    jenis: "Sapi",
    ras: "Sapi Simmental",
    kelamin: "Betina",
    umur: "28 bulan",
    ciri: "Warna krem kemerahan, muka putih",
    namaPemilik: "Bpk. Rahmat",
    umurPemilik: 52,
    statusKepemilikan: "Kepemilikan mitra",
    bobot: 480,
    tinggi: 138,
    panjang: 158,
    lebarDada: 48,
    kondisi: "Bunting Sehat",
    nafsuMakan: "Baik",
    feses: "Normal",
    catatan: "Kebuntingan bulan ke-5, butuh tambahan nutrisi pakan.",
    riwayat: [
      { tanggal: "2026-07-01", keterangan: "Cek USG Kebuntingan", jenis: "Pemeriksaan" },
      { tanggal: "2026-04-20", keterangan: "Inseminasi Buatan (IB)", jenis: "Pemeriksaan" },
    ],
    bobotHistory: [
      { bulan: "Feb", bobot: 430 },
      { bulan: "Mar", bobot: 442 },
      { bulan: "Apr", bobot: 455 },
      { bulan: "Mei", bobot: 466 },
      { bulan: "Jun", bobot: 474 },
      { bulan: "Jul", bobot: 480 },
    ],
  },

  // 🐐 KAMBING
  {
    id: "k1",
    idKambing: "MJ-KB-001",
    jenis: "Kambing",
    ras: "Kambing Etawa (PE)",
    kelamin: "Betina",
    umur: "14 bulan",
    ciri: "Bulu putih, bercak hitam di kaki belakang",
    namaPemilik: "Bpk. Suparjo",
    umurPemilik: 48,
    statusKepemilikan: "Kepemilikan mitra",
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
    jenis: "Kambing",
    ras: "Kambing Boer",
    kelamin: "Jantan",
    umur: "20 bulan",
    ciri: "Kepala coklat, badan putih",
    namaPemilik: "Bpk. Rahmat",
    umurPemilik: 52,
    statusKepemilikan: "Kepemilikan sendiri",
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
    jenis: "Kambing",
    ras: "Kambing Jawa Randu",
    kelamin: "Betina",
    umur: "10 bulan",
    ciri: "Bulu coklat muda seragam",
    namaPemilik: "Ibu Marni",
    umurPemilik: 41,
    statusKepemilikan: "Kepemilikan kelompok",
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

  // 🐑 DOMBA
  {
    id: "d1",
    idKambing: "DM-007",
    jenis: "Domba",
    ras: "Domba Garut",
    kelamin: "Jantan",
    umur: "18 bulan",
    ciri: "Tanduk melingkar tebal, wol putih bersih",
    namaPemilik: "Mas Budi",
    umurPemilik: 35,
    statusKepemilikan: "Kepemilikan sendiri",
    bobot: 52,
    tinggi: 70,
    panjang: 66,
    lebarDada: 24,
    kondisi: "Sehat",
    nafsuMakan: "Baik",
    feses: "Normal",
    catatan: "Domba pejantan tangguh Kandang C-01.",
    riwayat: [
      { tanggal: "2026-06-01", keterangan: "Cukur wol berkala", jenis: "Pemeriksaan" },
      { tanggal: "2026-05-15", keterangan: "Deworming rutin", jenis: "Obat" },
    ],
    bobotHistory: [
      { bulan: "Feb", bobot: 42 },
      { bulan: "Mar", bobot: 44 },
      { bulan: "Apr", bobot: 46 },
      { bulan: "Mei", bobot: 48 },
      { bulan: "Jun", bobot: 50 },
      { bulan: "Jul", bobot: 52 },
    ],
  },
  {
    id: "d2",
    idKambing: "DM-008",
    jenis: "Domba",
    ras: "Domba Merino",
    kelamin: "Betina",
    umur: "15 bulan",
    ciri: "Wol sangat lebat dan tebal",
    namaPemilik: "Ibu Marni",
    umurPemilik: 41,
    statusKepemilikan: "Kepemilikan kelompok",
    bobot: 45,
    tinggi: 66,
    panjang: 64,
    lebarDada: 22,
    kondisi: "Sehat",
    nafsuMakan: "Baik",
    feses: "Normal",
    catatan: "Penghasil wol kualitas premium.",
    riwayat: [
      { tanggal: "2026-06-12", keterangan: "Pemberian suplemen nutrisi", jenis: "Obat" },
    ],
    bobotHistory: [
      { bulan: "Feb", bobot: 36 },
      { bulan: "Mar", bobot: 38 },
      { bulan: "Apr", bobot: 40 },
      { bulan: "Mei", bobot: 42 },
      { bulan: "Jun", bobot: 44 },
      { bulan: "Jul", bobot: 45 },
    ],
  },

  // 🐔 AYAM
  {
    id: "a1",
    idKambing: "AY-101",
    jenis: "Ayam",
    ras: "Ayam Layer Petelur",
    kelamin: "Betina",
    umur: "8 bulan",
    ciri: "Bulu coklat emas, jengger merah segar",
    namaPemilik: "Kelompok Mindajaya",
    umurPemilik: 40,
    statusKepemilikan: "Kepemilikan kelompok",
    bobot: 2.1,
    tinggi: 25,
    panjang: 22,
    lebarDada: 12,
    kondisi: "Sehat",
    nafsuMakan: "Baik",
    feses: "Normal",
    catatan: "Produksi telur aktif 1 butir/hari.",
    riwayat: [
      { tanggal: "2026-05-10", keterangan: "Vaksin ND-IB", jenis: "Vaksin" },
    ],
    bobotHistory: [
      { bulan: "Feb", bobot: 1.5 },
      { bulan: "Mar", bobot: 1.7 },
      { bulan: "Apr", bobot: 1.8 },
      { bulan: "Mei", bobot: 1.9 },
      { bulan: "Jun", bobot: 2.0 },
      { bulan: "Jul", bobot: 2.1 },
    ],
  },

  // 🦆 BEBEK
  {
    id: "b1",
    idKambing: "BK-201",
    jenis: "Bebek",
    ras: "Bebek Mojosari",
    kelamin: "Betina",
    umur: "9 bulan",
    ciri: "Bulu coklat berbintik hitam, paruh kuning",
    namaPemilik: "Kelompok Mindajaya",
    umurPemilik: 40,
    statusKepemilikan: "Kepemilikan kelompok",
    bobot: 2.4,
    tinggi: 28,
    panjang: 25,
    lebarDada: 14,
    kondisi: "Sehat",
    nafsuMakan: "Baik",
    feses: "Normal",
    catatan: "Penghasil telur bebek kualitas unggul.",
    riwayat: [
      { tanggal: "2026-05-20", keterangan: "Vaksin Flu Burung AI", jenis: "Vaksin" },
    ],
    bobotHistory: [
      { bulan: "Feb", bobot: 1.8 },
      { bulan: "Mar", bobot: 2.0 },
      { bulan: "Apr", bobot: 2.1 },
      { bulan: "Mei", bobot: 2.2 },
      { bulan: "Jun", bobot: 2.3 },
      { bulan: "Jul", bobot: 2.4 },
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
    idKambing: "SP-002",
    level: "peringatan",
    pesan: "Sapi Simmental SP-002 butuh pemeriksaan kehamilan bulanan.",
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
    deskripsi: "Anggota membawa ternak & kartu digital; kader mencatat kehadiran.",
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
