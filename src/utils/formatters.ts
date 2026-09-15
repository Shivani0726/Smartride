/**
 * Formats a number to Indian Rupees format with ₹ symbol.
 * Example: 1449000 -> ₹14,49,000
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats a number to Indian Lakhs / Crores for compact badges.
 * Example: 799000 -> ₹7.99 Lakh
 * Example: 6095000 -> ₹60.95 Lakh
 */
export function formatLakhs(amount: number): string {
  if (amount >= 10000000) {
    const cr = amount / 10000000;
    return `₹${cr.toFixed(2).replace(/\.00$/, '')} Crore`;
  }
  const lakh = amount / 100000;
  return `₹${lakh.toFixed(2).replace(/\.00$/, '')} Lakh`;
}
