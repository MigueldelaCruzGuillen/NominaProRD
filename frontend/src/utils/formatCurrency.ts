export function formatCurrency(
  value: number,
  currency = "DOP",
  locale = "es-DO"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}