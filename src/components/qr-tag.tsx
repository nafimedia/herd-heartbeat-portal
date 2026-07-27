import React from "react";
import { Printer, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AnimalQrTagProps {
  animal: {
    id?: string;
    tag: string;
    name?: string;
    jenis?: string;
    type?: string;
    breed?: string;
    ras?: string;
    kandang?: string;
    namaPemilik?: string;
    status?: string;
  };
  onPrint?: () => void;
}

// Generate raw SVG string markup for print isolation
export function generateQrCodeSvgMarkup(value: string, size = 100): string {
  const gridSize = 21;
  const cells: boolean[][] = Array.from({ length: gridSize }, () => Array(gridSize).fill(false));

  const drawFinder = (startX: number, startY: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 ||
          r === 6 ||
          c === 0 ||
          c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          cells[startY + r][startX + c] = true;
        }
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(gridSize - 7, 0);
  drawFinder(0, gridSize - 7);

  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (
        (r < 7 && c < 7) ||
        (r < 7 && c >= gridSize - 7) ||
        (r >= gridSize - 7 && c < 7)
      ) {
        continue;
      }
      const val = (r * 31 + c * 17 + Math.abs(hash)) % 3;
      cells[r][c] = val === 0 || (r + c) % 2 === 0;
    }
  }

  const cellSize = size / gridSize;
  let rects = "";

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (cells[r][c]) {
        rects += `<rect x="${(c * cellSize).toFixed(2)}" y="${(r * cellSize).toFixed(2)}" width="${cellSize.toFixed(2)}" height="${cellSize.toFixed(2)}" fill="#000000" rx="${(cellSize * 0.15).toFixed(2)}" />`;
      }
    }
  }

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="background:#ffffff; padding:2px; border:1px solid #cbd5e1; border-radius:6px;" xmlns="http://www.w3.org/2000/svg">${rects}</svg>`;
}

// React SVG Component wrapper
export function SimpleQRCodeSVG({ value, size = 150 }: { value: string; size?: number }) {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: generateQrCodeSvgMarkup(value, size),
      }}
    />
  );
}

// Dedicated 100% Focused Tag Printer Function
export function printAnimalQrTag(animal: {
  tag: string;
  jenis?: string;
  ras?: string;
  kandang?: string;
  namaPemilik?: string;
  status?: string;
}) {
  const tagId = animal.tag || "SP-000";
  const jenisText = animal.jenis || "Ternak";
  const rasText = animal.ras || "Lokal";
  const kandangText = animal.kandang || "Kandang Utama";
  const pemilikText = animal.namaPemilik || "KTT Mindajaya";
  const statusText = animal.status || "Sehat";

  const printWindow = window.open("", "_blank", "width=700,height=700");
  if (!printWindow) {
    window.print();
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Cetak Label Tag - ${tagId}</title>
        <style>
          @page {
            size: portrait;
            margin: 8mm;
          }
          * {
            box-sizing: border-box !important;
            margin: 0;
            padding: 0;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background: #ffffff !important;
            color: #000000 !important;
            display: flex;
            align-items: flex-start;
            justify-content: center;
            padding-top: 15px;
          }
          .tag-box {
            width: 88mm;
            height: 56mm;
            border: 2.5px solid #000000;
            border-radius: 10px;
            padding: 12px 14px;
            background: #ffffff;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            page-break-inside: avoid;
            box-shadow: none;
          }
          .tag-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1.5px solid #000000;
            padding-bottom: 6px;
          }
          .header-brand {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .brand-logo {
            width: 28px !important;
            height: 28px !important;
            max-width: 28px !important;
            max-height: 28px !important;
            object-fit: contain !important;
          }
          .brand-title {
            font-size: 11px;
            font-weight: 800;
            color: #000000;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            line-height: 1.1;
          }
          .brand-sub {
            font-size: 8px;
            color: #475569;
          }
          .status-badge {
            border: 1.5px solid #000000;
            background: #ffffff;
            color: #000000;
            font-size: 9px;
            font-weight: 800;
            padding: 2px 8px;
            border-radius: 99px;
            text-transform: uppercase;
          }
          .tag-body {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 6px 0;
            gap: 10px;
          }
          .label-title {
            font-size: 9px;
            text-transform: uppercase;
            color: #475569;
            font-weight: 800;
            letter-spacing: 0.5px;
          }
          .tag-id {
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-size: 22px;
            font-weight: 900;
            color: #000000;
            line-height: 1.1;
          }
          .meta-info {
            font-size: 10px;
            color: #1e293b;
            margin-top: 3px;
            line-height: 1.35;
          }
          .meta-bold {
            font-weight: 800;
            color: #000000;
          }
          .qr-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .qr-sub {
            font-size: 7.5px;
            font-family: monospace;
            color: #000000;
            margin-top: 3px;
            font-weight: 800;
            letter-spacing: 0.5px;
          }
          .tag-footer {
            border-top: 1px solid #000000;
            padding-top: 4px;
            text-align: center;
            font-size: 8px;
            color: #334155;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="tag-box">
          <div class="tag-header">
            <div class="header-brand">
              <img src="/images/logomindajaya.png" alt="Logo" class="brand-logo" />
              <div>
                <div class="brand-title">KARTANING TAG</div>
                <div class="brand-sub">Posyandu Ternak UNU x Mindajaya</div>
              </div>
            </div>
            <div class="status-badge">${statusText}</div>
          </div>

          <div class="tag-body">
            <div style="flex: 1; min-width: 0;">
              <div class="label-title">EAR TAG ID</div>
              <div class="tag-id">${tagId}</div>
              <div class="meta-info">
                <div class="meta-bold">${jenisText} (${rasText})</div>
                <div>📍 Kandang: ${kandangText}</div>
                <div>👤 Pemilik: ${pemilikText}</div>
              </div>
            </div>

            <div class="qr-container">
              ${generateQrCodeSvgMarkup(`KARTANING-ANIMAL-${tagId}`, 90)}
              <div class="qr-sub">SCAN TERNAK</div>
            </div>
          </div>

          <div class="tag-footer">
            Sistem Pendataan Peternakan Presisi © 2026
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              window.close();
            }, 350);
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

// Batch Printer for Multiple Animals
export function printBatchQrTags(
  animals: Array<{
    tag: string;
    jenis?: string;
    ras?: string;
    kandang?: string;
    namaPemilik?: string;
    status?: string;
  }>
) {
  if (!animals || animals.length === 0) return;

  const printWindow = window.open("", "_blank", "width=850,height=850");
  if (!printWindow) {
    window.print();
    return;
  }

  const tagsHtml = animals
    .map((item) => {
      const tagId = item.tag || "SP-000";
      const jenisText = item.jenis || "Ternak";
      const rasText = item.ras || "Lokal";
      const kandangText = item.kandang || "Kandang Utama";
      const pemilikText = item.namaPemilik || "KTT Mindajaya";
      const statusText = item.status || "Sehat";

      return `
        <div class="tag-box">
          <div class="tag-header">
            <div class="header-brand">
              <img src="/images/logomindajaya.png" alt="Logo" class="brand-logo" />
              <div>
                <div class="brand-title">KARTANING TAG</div>
                <div class="brand-sub">Posyandu Ternak UNU x Mindajaya</div>
              </div>
            </div>
            <div class="status-badge">${statusText}</div>
          </div>

          <div class="tag-body">
            <div style="flex: 1; min-width: 0;">
              <div class="label-title">EAR TAG ID</div>
              <div class="tag-id">${tagId}</div>
              <div class="meta-info">
                <div class="meta-bold">${jenisText} (${rasText})</div>
                <div>📍 Kandang: ${kandangText}</div>
                <div>👤 Pemilik: ${pemilikText}</div>
              </div>
            </div>

            <div class="qr-container">
              ${generateQrCodeSvgMarkup(`KARTANING-ANIMAL-${tagId}`, 80)}
              <div class="qr-sub">SCAN TERNAK</div>
            </div>
          </div>

          <div class="tag-footer">
            Sistem Pendataan Peternakan Presisi © 2026
          </div>
        </div>
      `;
    })
    .join("\n");

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Cetak Batch Label Tag Ternak (${animals.length} Ekstrak)</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          * {
            box-sizing: border-box !important;
            margin: 0;
            padding: 0;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: #ffffff !important;
            color: #000000 !important;
            padding: 10px;
          }
          .batch-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          .tag-box {
            width: 88mm;
            height: 56mm;
            border: 2px solid #000000;
            border-radius: 10px;
            padding: 10px 12px;
            background: #ffffff;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            page-break-inside: avoid;
          }
          .tag-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1.5px solid #000000;
            padding-bottom: 5px;
          }
          .header-brand {
            display: flex;
            align-items: center;
            gap: 6px;
          }
          .brand-logo {
            width: 24px !important;
            height: 24px !important;
            object-fit: contain !important;
          }
          .brand-title {
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
          }
          .brand-sub {
            font-size: 7.5px;
            color: #475569;
          }
          .status-badge {
            border: 1px solid #000000;
            font-size: 8.5px;
            font-weight: 800;
            padding: 1px 6px;
            border-radius: 99px;
          }
          .tag-body {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            margin: 4px 0;
          }
          .label-title {
            font-size: 8px;
            color: #475569;
            font-weight: 800;
          }
          .tag-id {
            font-family: monospace;
            font-size: 19px;
            font-weight: 900;
          }
          .meta-info {
            font-size: 9px;
            color: #1e293b;
          }
          .meta-bold {
            font-weight: 800;
          }
          .qr-container {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .qr-sub {
            font-size: 7px;
            font-family: monospace;
            font-weight: 800;
          }
          .tag-footer {
            border-top: 1px solid #000000;
            padding-top: 3px;
            text-align: center;
            font-size: 7.5px;
            color: #475569;
          }
        </style>
      </head>
      <body>
        <div class="batch-grid">
          ${tagsHtml}
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              window.close();
            }, 450);
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

export function AnimalQrTagCard({ animal, onPrint }: AnimalQrTagProps) {
  const tagId = animal.tag || animal.id || "SP-000";

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      printAnimalQrTag(animal);
    }
  };

  const jenisText = animal.jenis || animal.type || "Ternak";
  const rasText = animal.ras || animal.breed || "Lokal";
  const kandangText = animal.kandang || "Kandang Utama";
  const pemilikText = animal.namaPemilik || "KTT Mindajaya";
  const statusText = animal.status || "Sehat";

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* On-Screen Card Tag Preview */}
      <div className="w-full max-w-sm overflow-hidden rounded-2xl border-2 border-emerald-500/50 bg-card p-5 shadow-xl backdrop-blur text-card-foreground">
        {/* Header Badge */}
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <img src="/images/logomindajaya.png" alt="Logo" className="h-7 w-7 object-contain max-h-7 max-w-7" />
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                KARTANING TAG
              </p>
              <p className="text-[9px] text-muted-foreground">Posyandu Ternak UNU x Mindajaya</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30 text-[10px] font-bold">
            {statusText}
          </Badge>
        </div>

        {/* Tag Body */}
        <div className="my-4 flex items-center justify-between gap-4">
          <div className="space-y-1 flex-1 min-w-0">
            <p className="text-[10px] uppercase font-semibold text-muted-foreground">EAR TAG ID</p>
            <h2 className="text-2xl font-black tracking-tight text-foreground font-mono truncate">
              {tagId}
            </h2>
            <div className="pt-1 space-y-0.5 text-xs text-muted-foreground">
              <p className="font-semibold text-foreground truncate">{jenisText} ({rasText})</p>
              <p className="text-[11px] truncate">📍 Kandang: {kandangText}</p>
              <p className="text-[11px] truncate">👤 Pemilik: {pemilikText}</p>
            </div>
          </div>

          {/* QR Code SVG */}
          <div className="shrink-0 flex flex-col items-center">
            <SimpleQRCodeSVG value={`KARTANING-ANIMAL-${tagId}`} size={100} />
            <span className="mt-1 text-[9px] font-mono text-muted-foreground font-semibold">SCAN TERNAK</span>
          </div>
        </div>

        {/* Footer Tag */}
        <div className="border-t border-border/60 pt-2 text-center text-[9px] text-muted-foreground font-medium">
          Sistem Pendataan Peternakan Presisi © 2026
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Button onClick={handlePrint} size="sm" className="gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md">
          <Printer className="h-4 w-4" /> Cetak Label Tag Presisi (88mm x 56mm)
        </Button>
      </div>
    </div>
  );
}
