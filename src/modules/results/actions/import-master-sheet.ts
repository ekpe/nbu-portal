"use server";

import { auth } from "@/auth";
import { parseResultUpload } from "@/modules/results/services/parse-result-upload";
import { importMasterSheet } from "@/modules/results/services/import-master-sheet";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";

export async function importMasterSheetAction(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const resultSheetId = String(formData.get("resultSheetId") ?? "");
  const file = formData.get("file");

  if (!resultSheetId) {
    throw new Error("Result sheet is required.");
  }

  if (!(file instanceof File)) {
    throw new Error("Excel file is required.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const rows = await parseResultUpload(buffer);

  await importMasterSheet(resultSheetId, rows);

  await writeAuditLog({
    actorId: session.user.id,
    action: "MASTER_SHEET_IMPORTED",
    entityType: "RESULT_SHEET",
    entityId: resultSheetId,
    summary: `Imported master sheet from Excel with ${rows.length} row(s)`,
  });
}