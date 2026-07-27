export type JenisObat =
  | "Antibiotik"
  | "Vitamin"
  | "Vaksin"
  | "Obat Cacing"
  | "Antiseptik"
  | "Anti Parasit"
  | "Anti Jamur"
  | "Anti Diare"
  | "Penguat Nafsu Makan"
  | "Lainnya";

export type SatuanObat =
  | "Botol"
  | "Vial"
  | "Ampul"
  | "Tablet"
  | "Strip"
  | "Sachet"
  | "Liter"
  | "ml"
  | "Kg"
  | "Gram"
  | "Dosis";

export interface Obat {
  id: string;
  namaObat: string;
  jenisObat: JenisObat;
  satuan: SatuanObat;
  stok: number;
  minimumStok: number;
  fungsiPenggunaan: string;
  caraPenggunaan: string;
  frekuensiPenggunaan: number; // e.g. 1, 2, 3 -> displayed as "1 kali sehari"
  status: "Aktif" | "Nonaktif";
}

export interface RiwayatPenggunaanObat {
  id: string;
  tanggal: string;
  earTag: string;
  namaTernak: string;
  namaObat: string;
  jumlah: number;
  satuan: SatuanObat;
  petugas: string;
  keterangan: string;
}

export const LIST_JENIS_OBAT: JenisObat[] = [
  "Antibiotik",
  "Vitamin",
  "Vaksin",
  "Obat Cacing",
  "Antiseptik",
  "Anti Parasit",
  "Anti Jamur",
  "Anti Diare",
  "Penguat Nafsu Makan",
  "Lainnya",
];

export const LIST_SATUAN_OBAT: SatuanObat[] = [
  "Botol",
  "Vial",
  "Ampul",
  "Tablet",
  "Strip",
  "Sachet",
  "Liter",
  "ml",
  "Kg",
  "Gram",
  "Dosis",
];

const INITIAL_DAFTAR_OBAT: Obat[] = [
  {
    id: "obt-001",
    namaObat: "Oxytetracycline",
    jenisObat: "Antibiotik",
    satuan: "Botol",
    stok: 25,
    minimumStok: 5,
    fungsiPenggunaan: "Mengobati infeksi bakteri dan meminimalkan peradangan pada kambing & sapi.",
    caraPenggunaan: "Disuntik (Intramuskular)",
    frekuensiPenggunaan: 1,
    status: "Aktif",
  },
  {
    id: "obt-002",
    namaObat: "B-Complex Injection",
    jenisObat: "Vitamin",
    satuan: "Botol",
    stok: 18,
    minimumStok: 4,
    fungsiPenggunaan: "Menjaga daya tahan tubuh dan mempercepat stamina pemulihan.",
    caraPenggunaan: "Disuntik",
    frekuensiPenggunaan: 1,
    status: "Aktif",
  },
  {
    id: "obt-003",
    namaObat: "Albendazole Oral",
    jenisObat: "Obat Cacing",
    satuan: "Botol",
    stok: 12,
    minimumStok: 3,
    fungsiPenggunaan: "Mengatasi cacingan dan parasit pencernaan ternak.",
    caraPenggunaan: "Diminum (Drenching)",
    frekuensiPenggunaan: 1,
    status: "Aktif",
  },
  {
    id: "obt-004",
    namaObat: "Vet-Diar Stop",
    jenisObat: "Anti Diare",
    satuan: "Sachet",
    stok: 40,
    minimumStok: 10,
    fungsiPenggunaan: "Mengobati diare dan pencernaan tidak lancar.",
    caraPenggunaan: "Dicampur air minum",
    frekuensiPenggunaan: 2,
    status: "Aktif",
  },
  {
    id: "obt-005",
    namaObat: "Bio-Appetite Booster",
    jenisObat: "Penguat Nafsu Makan",
    satuan: "Liter",
    stok: 15,
    minimumStok: 3,
    fungsiPenggunaan: "Menambah nafsu makan dan metabolisme pakan ternak.",
    caraPenggunaan: "Dicampur pakan",
    frekuensiPenggunaan: 2,
    status: "Aktif",
  },
];

const INITIAL_RIWAYAT: RiwayatPenggunaanObat[] = [
  {
    id: "usage-001",
    tanggal: "2026-07-25",
    earTag: "MJ-KB-001",
    namaTernak: "Kambing Etawa PE",
    namaObat: "Oxytetracycline",
    jumlah: 1,
    satuan: "Botol",
    petugas: "Drh. Ahmad",
    keterangan: "Pencegahan infeksi pasca melahirkan",
  },
  {
    id: "usage-002",
    tanggal: "2026-07-26",
    earTag: "MJ-KB-005",
    namaTernak: "Kambing Etawa Jantan",
    namaObat: "Vet-Diar Stop",
    jumlah: 2,
    satuan: "Sachet",
    petugas: "Pak Tono",
    keterangan: "Pengobatan diare ringan",
  },
];

const STORAGE_KEY_OBAT = "kartaning_daftar_obat";
const STORAGE_KEY_RIWAYAT = "kartaning_riwayat_obat";

export function loadDaftarObat(): Obat[] {
  if (typeof window === "undefined") return INITIAL_DAFTAR_OBAT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_OBAT);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_OBAT, JSON.stringify(INITIAL_DAFTAR_OBAT));
      return INITIAL_DAFTAR_OBAT;
    }
    return JSON.parse(raw) as Obat[];
  } catch {
    return INITIAL_DAFTAR_OBAT;
  }
}

export function saveDaftarObat(list: Obat[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_OBAT, JSON.stringify(list));
  } catch (err) {
    console.error("Failed to save daftar obat:", err);
  }
}

export function loadRiwayatObat(): RiwayatPenggunaanObat[] {
  if (typeof window === "undefined") return INITIAL_RIWAYAT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RIWAYAT);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_RIWAYAT, JSON.stringify(INITIAL_RIWAYAT));
      return INITIAL_RIWAYAT;
    }
    return JSON.parse(raw) as RiwayatPenggunaanObat[];
  } catch {
    return INITIAL_RIWAYAT;
  }
}

export function saveRiwayatObat(list: RiwayatPenggunaanObat[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_RIWAYAT, JSON.stringify(list));
  } catch (err) {
    console.error("Failed to save riwayat obat:", err);
  }
}

export function catatPenggunaanObat(params: {
  earTag: string;
  namaTernak: string;
  namaObat: string;
  jumlah: number;
  petugas: string;
  keterangan: string;
}): { success: boolean; usage?: RiwayatPenggunaanObat; message?: string } {
  const listObat = loadDaftarObat();
  const obatIndex = listObat.findIndex(
    (item) => item.namaObat.toLowerCase() === params.namaObat.toLowerCase()
  );

  if (obatIndex === -1) {
    return { success: false, message: `Obat "${params.namaObat}" tidak ditemukan dalam Data Obat.` };
  }

  const obat = listObat[obatIndex];
  const nextStok = Math.max(0, obat.stok - params.jumlah);
  listObat[obatIndex] = { ...obat, stok: nextStok };
  saveDaftarObat(listObat);

  const newUsage: RiwayatPenggunaanObat = {
    id: `usage-${Date.now()}`,
    tanggal: new Date().toISOString().slice(0, 10),
    earTag: params.earTag || "-",
    namaTernak: params.namaTernak || "-",
    namaObat: obat.namaObat,
    jumlah: params.jumlah,
    satuan: obat.satuan,
    petugas: params.petugas || "Petugas Peternakan",
    keterangan: params.keterangan || "Penggunaan pada kartu kesehatan",
  };

  const riwayatList = loadRiwayatObat();
  saveRiwayatObat([newUsage, ...riwayatList]);

  return { success: true, usage: newUsage };
}
