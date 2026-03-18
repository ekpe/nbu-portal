export function toTrimmedString(value: unknown): string {
  return String(value ?? "").trim();
}

export function toNullableNumber(value: unknown): number | null {
  if (value == null) return null;

  const text = String(value).trim();
  if (text === "") return null;

  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : null;
}