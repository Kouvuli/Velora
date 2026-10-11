export type CountFormat = { decimals?: number; prefix?: string; suffix?: string };

export function formatCount(value: number, { decimals = 0, prefix = "", suffix = "" }: CountFormat = {}) {
  const number = value.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return `${prefix}${number}${suffix}`;
}
