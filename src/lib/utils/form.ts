export function isChecked(formData: FormData, key: string): boolean {
  return formData.get(key) === "on";
}

export function emptyToUndefined(value: FormDataEntryValue | null): string | undefined {
  const text = String(value ?? "").trim();
  return text === "" ? undefined : text;
}