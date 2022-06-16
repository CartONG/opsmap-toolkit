export type TKLabel = Record<string, string>;

export function TKGetLocalValue(label: TKLabel, locale: string): string {
  return label ? label[locale] ?? label["en"] ?? "" : "";
}
