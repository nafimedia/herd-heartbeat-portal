export type ValidationErrors = Record<string, string>;

export function validateLoginForm(email: string, password: string): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!email.trim()) {
    errors.email = "Email wajib diisi.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Format email tidak valid.";
  }

  if (!password.trim()) {
    errors.password = "Password wajib diisi.";
  }

  return errors;
}

export function validateAnimalForm(form: Record<string, string | number>): ValidationErrors {
  const errors: ValidationErrors = {};
  const tag = String(form.tag || "").trim();
  const jenis = String(form.jenis || "").trim();
  const ras = String(form.ras || "").trim();
  const umurKambing = Number(form.umurKambing || 0);
  const namaPemilik = String(form.namaPemilik || "").trim();
  const berat = Number(form.berat || 0);

  if (!tag) {
    errors.tag = "ID / nomor kambing wajib diisi.";
  }

  if (!jenis) {
    errors.jenis = "Jenis ternak wajib diisi.";
  }

  if (!ras) {
    errors.ras = "Ras wajib diisi.";
  }

  if (!Number.isFinite(umurKambing) || umurKambing < 0) {
    errors.umurKambing = "Umur kambing harus berupa angka positif.";
  }

  if (!namaPemilik) {
    errors.namaPemilik = "Nama pemilik wajib diisi.";
  }

  if (!Number.isFinite(berat) || berat < 0) {
    errors.berat = "Bobot badan harus berupa angka positif.";
  }

  return errors;
}
