export const formatCurrency = (
  amount: number,
  currency: string = "SAR"
): string => {
  return new Intl.NumberFormat("en-SA", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

export const parseCurrency = (
  value: string,
  currency: string = "SAR"
): number => {
  // Remove currency symbols and parse as number
  const cleaned = value.replace(/[^\d.-]/g, "");
  return parseFloat(cleaned) || 0;
};

export const getCurrencySymbol = (currency: string): string => {
  const symbols: { [key: string]: string } = {
    SAR: "﷼",
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
  };
  return symbols[currency] || currency;
};

export const SUPPORTED_CURRENCIES = [
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
];
