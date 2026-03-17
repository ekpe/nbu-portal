"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getLecturerResultContext } from "@/modules/results/services/get-lecturer-result-context";
import { getOrCreateResultSheet } from "@/modules/results/services/get-or-create-result-sheet";

export async function createOrOpenResultSheetAction(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const courseOfferingId = String(formData.get("courseOfferingId") ?? "");
  if (!courseOfferingId) throw new Error("Course offering is required.");

  const context = await getLecturerResultContext(session.user.id);
  if (!context?.staffProfile) throw new Error("Lecturer profile not found.");

  const sheet = await getOrCreateResultSheet(courseOfferingId, context.staffProfile.id);
  redirect(`/staff/results/${sheet.id}`);
}