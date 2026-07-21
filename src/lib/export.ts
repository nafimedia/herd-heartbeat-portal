export function downloadCsv(filename: string, rows: Array<Record<string, unknown>>) {
  if (!rows.length) {
    const emptyBlob = new Blob([""], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(emptyBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    return;
  }

  const normalizedRows = rows.map((row) => ({
    id: row.id ?? "",
    tag: row.tag ?? "",
    name: row.name ?? "",
    jenis: row.jenis ?? "",
    ras: row.ras ?? "",
    jenisKelamin: row.jenisKelamin ?? "",
    umur: row.umur ?? "",
    berat: row.berat ?? "",
    kandang: row.kandang ?? "",
    status: row.status ?? "",
    tanggalMasuk: row.tanggalMasuk ?? "",
    namaPemilik: row.namaPemilik ?? "",
    catatan: row.catatan ?? "",
    kondisi: row.kondisi ?? "",
    riwayatSingkat: row.riwayatSingkat ?? "",
    fotoKambing: row.fotoKambing ?? "",
  }));

  const headers = Object.keys(normalizedRows[0]);
  const lines = [headers.join(",")];

  for (const row of normalizedRows) {
    const values = headers.map((header) => {
      const value = row[header];
      const normalized = value == null ? "" : String(value).replace(/\r?\n/g, " ");
      return `"${normalized.replace(/"/g, '""')}"`;
    });
    lines.push(values.join(","));
  }

  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
