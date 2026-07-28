import json
import zipfile
import xml.etree.ElementTree as ET
import os

def import_clean_data():
    xlsx_path = os.path.join('data', 'dataset_ternak.xlsx')
    json_path = os.path.join('data', 'farm.db.json')

    if not os.path.exists(xlsx_path):
        print(f"File {xlsx_path} not found.")
        return

    # Parse Excel XML
    z = zipfile.ZipFile(xlsx_path)
    ss_tree = ET.fromstring(z.read('xl/sharedStrings.xml'))
    strings = [elem.text for elem in ss_tree.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t')]

    sheet_xml = z.read('xl/worksheets/sheet1.xml')
    s_tree = ET.fromstring(sheet_xml)
    rows = []
    for row in s_tree.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row'):
        row_vals = []
        for cell in row.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c'):
            t = cell.attrib.get('t')
            v = cell.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
            val = v.text if v is not None else ''
            if t == 's' and val != '':
                val = strings[int(val)]
            row_vals.append(val)
        rows.append(row_vals)

    if not rows:
        print("No rows found in Excel.")
        return

    data_rows = rows[1:]

    # Read existing feedStock and production or keep defaults
    existing_feed = [
        {
            "id": "feed-001",
            "nama": "Konsentrat Sapi & Kambing",
            "kategori": "Konsentrat",
            "stok": 500,
            "satuan": "kg",
            "minimum": 100,
            "supplier": "PT Pakan Nusantara"
        }
    ]
    existing_prod = []

    posyandu_animals = []
    posyandu_health_checks = []

    for idx, r in enumerate(data_rows, 1):
        if not r or len(r) < 12:
            continue

        peternak = r[0].strip()
        no_kambing = r[1].strip()
        jk = r[2].strip()
        umur_bulan = float(r[3]) if r[3] else 0
        bb_sebelum = float(r[4]) if r[4] else 0
        bb_sesudah = float(r[5]) if r[5] else 0
        bcs_sebelum = float(r[6]) if r[6] else 0
        bcs_sesudah = float(r[7]) if r[7] else 0
        status_sebelum = r[8].strip()
        riwayat_penyakit = r[9].strip()
        perlakuan = r[10].strip()
        status_sesudah = r[11].strip()

        tag = f"KB-POS-{idx:03d}"
        animal_id = f"animal-pos-{idx:03d}"

        # Animal record
        animal = {
            "id": animal_id,
            "tag": tag,
            "name": f"Kambing {peternak} #{no_kambing}",
            "jenis": "Kambing",
            "ras": "Jawa Randu",
            "jenisKelamin": jk if jk in ["Jantan", "Betina"] else ("Jantan" if "Jantan" in jk else "Betina"),
            "umur": int(umur_bulan),
            "umurKambing": f"{int(umur_bulan)} bulan",
            "berat": int(bb_sesudah) if bb_sesudah else int(bb_sebelum),
            "kandang": f"Kandang {peternak}",
            "status": status_sesudah if status_sesudah else (status_sebelum if status_sebelum else "Sehat"),
            "tanggalMasuk": "2026-07-28",
            "ciriCiri": f"BB Awal: {bb_sebelum} kg, BB Akhir: {bb_sesudah} kg. BCS Awal: {bcs_sebelum}, BCS Akhir: {bcs_sesudah}.",
            "namaPemilik": peternak,
            "umurPemilik": "",
            "statusKepemilikan": "Kepemilikan sendiri",
            "tinggiBadan": "",
            "panjangBadan": "",
            "lebarDada": "",
            "kondisi": status_sesudah if status_sesudah else "Sehat",
            "nafsuMakan": "Baik",
            "feses": "Normal",
            "riwayatSingkat": f"Riwayat: {riwayat_penyakit}. Perlakuan Posyandu: {perlakuan}.",
            "catatan": f"Data Posyandu PKM UNU 2026. Peternak: {peternak}, No Kambing: {no_kambing}.",
            "fotoKambing": ""
        }

        posyandu_animals.append(animal)

        # Health check record
        if perlakuan and perlakuan != "-":
            check_item = {
                "id": f"check-pos-{idx:03d}",
                "tanggal": "2026-07-28",
                "tag": tag,
                "tindakan": perlakuan,
                "petugas": "Tim Posyandu PKM UNU",
                "status": "Selesai"
            }
            posyandu_health_checks.append(check_item)

    # Save CLEAN data (ONLY Excel dataset) to farm.db.json
    db = {
        "animals": posyandu_animals,
        "healthChecks": posyandu_health_checks,
        "feedStock": existing_feed,
        "production": existing_prod
    }

    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(db, f, indent=2, ensure_ascii=False)

    print(f"Successfully cleaned database JSON: {len(posyandu_animals)} animals and {len(posyandu_health_checks)} health checks stored.")

if __name__ == "__main__":
    import_clean_data()
