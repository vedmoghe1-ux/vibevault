/* All prices in the app are stored in USD (see lib/data.js). This file
   converts for display only. Swap `RATES` for a live rates API
   (e.g. exchangerate.host, Open Exchange Rates) when you're ready —
   just replace the static numbers with fetched ones on an interval. */

export const CURRENCIES = [
  { code: "USD", label: "USD $", symbol: "$", rate: 1 },
  { code: "EUR", label: "EUR €", symbol: "€", rate: 0.92 },
  { code: "GBP", label: "GBP £", symbol: "£", rate: 0.79 },
  { code: "INR", label: "INR ₹", symbol: "₹", rate: 83.1 },
  { code: "JPY", label: "JPY ¥", symbol: "¥", rate: 149.4 },
  { code: "AUD", label: "AUD A$", symbol: "A$", rate: 1.52 },
];

export function formatMoney(usd, code = "USD") {
  const c = CURRENCIES.find((x) => x.code === code) || CURRENCIES[0];
  const value = usd * c.rate;
  const rounded = c.code === "JPY" ? Math.round(value) : Math.round(value);
  return `${c.symbol}${rounded.toLocaleString()}`;
}
