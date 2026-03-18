import ExcelJS from "exceljs";

function normalizeHeader(value: unknown): string {
  return String(value ?? "").trim();
}

function normalizeCellValue(value: unknown): unknown {
  if (value == null) return "";

  if (typeof value === "object" && value !== null) {
    // ExcelJS rich text / formula / hyperlink / date-like objects
    if ("text" in (value as Record<string, unknown>)) {
      return String((value as Record<string, unknown>).text ?? "").trim();
    }

    if ("result" in (value as Record<string, unknown>)) {
      return (value as Record<string, unknown>).result ?? "";
    }

    if ("hyperlink" in (value as Record<string, unknown>)) {
      return String((value as Record<string, unknown>).text ?? "").trim();
    }
  }

  return value;
}

export async function parseResultUpload(fileBuffer: Buffer): Promise<Record<string, unknown>[]> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(fileBuffer);

  const worksheet = workbook.worksheets[0];
  if (!worksheet) return [];

  const headerRow = worksheet.getRow(1);
  const headers: string[] = [];

  headerRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    headers[colNumber - 1] = normalizeHeader(normalizeCellValue(cell.value));
  });

  const rows: Record<string, unknown>[] = [];

  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) return;

    const record: Record<string, unknown> = {};

    headers.forEach((header, index) => {
      if (!header) return;
      const cell = row.getCell(index + 1);
      record[header] = normalizeCellValue(cell.value);
    });

    const hasAnyValue = Object.values(record).some(
      (value) => String(value ?? "").trim() !== "",
    );

    if (hasAnyValue) {
      rows.push(record);
    }
  });

  return rows;
}