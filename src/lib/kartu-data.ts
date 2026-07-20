export interface RiwayatKesehatan {
  tanggal: string;
  keterangan: string;
  jenis: "Sakit" | "Vaksin" | "Obat" | "Pemeriksaan";
}

export interface KartuKesehatanKambing {
  id: string;
  idKambing: string;
  ras: string;
  kelamin: "Jantan" | "Betina";
  umur: string;
  ciri: string;
  namaPemilik: string;
  umurPemilik: number;
  bobot: number;
  tinggi: number;
  panjang: number;
  lebarDada: number;
  kondisi: "Sehat" | "Sakit";
  nafsuMakan: "Baik" | "Tidak";
  feses: "Normal" | "Diare";
  catatan: string;
  riwayat: RiwayatKesehatan[];
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
    nafsuMakan: "Tidak",
    feses: "Diare",
    catatan: "Perlu isolasi 5 hari, cek kembali oleh drh. Sari.",
    riwayat: [
      { tanggal: "2026-07-12", keterangan: "Diare akut - pemberian oralit ternak", jenis: "Sakit" },
      { tanggal: "2026-07-13", keterangan: "Injeksi antibiotik", jenis: "Obat" },
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
  },
];
