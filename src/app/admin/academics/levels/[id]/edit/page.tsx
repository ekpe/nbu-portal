import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { LevelForm } from "@/components/forms/level-form";

export default async function EditLevelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const level = await prisma.level.findUnique({
    where: { id },
  });

  if (!level) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Edit Level</h1>
      <LevelForm level={level} />
    </div>
  );
}