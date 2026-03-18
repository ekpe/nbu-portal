import ExcelJS from "exceljs";

function normalizeHeader(value: unknown): string {
  return String(value ?? "").trim();
}

function normalizeCellValue(value: unknown): unknown {
  if (value == null) return "";

  if (typeof value === "object" && value !== null) {
    const record = value as Record<string, unknown>;

    if ("text" in record) {
      return String(record.text ?? "").trim();
    }

    if ("result" in record) {
      return record.result ?? "";
    }

    if ("hyperlink" in record) {
      return String(record.text ?? "").trim();
    }
  }

  return value;
}

export async function parseResultUpload(
  fileBuffer: Uint8Array,
): Promise<Record<string, unknown>[]> {
  const workbook = new ExcelJS.Workbook();

  const arrayBuffer = fileBuffer.buffer.slice(
    fileBuffer.byteOffset,
    fileBuffer.byteOffset + fileBuffer.byteLength,
  ) as ArrayBuffer;

  await workbook.xlsx.load(arrayBuffer);

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